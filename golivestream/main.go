package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"net/url"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/pion/mediadevices"
	"github.com/pion/mediadevices/pkg/codec/vpx"
	"github.com/pion/mediadevices/pkg/frame"
	"github.com/pion/mediadevices/pkg/prop"
	"github.com/pion/webrtc/v3"
	"github.com/sourcegraph/jsonrpc2"

	// Note: If you don't have a camera or microphone or your adapters are not supported,
	//       you can always swap your adapters with our dummy adapters below.
	// _ "github.com/pion/mediadevices/pkg/driver/videotest"
	// _ "github.com/pion/mediadevices/pkg/driver/audiotest"
	_ "github.com/pion/mediadevices/pkg/driver/camera"     // This is required to register camera adapter
	_ "github.com/pion/mediadevices/pkg/driver/microphone" // This is required to register microphone adapter
	_ "github.com/pion/mediadevices/pkg/driver/screen"     // This is required to register screen adapter

	"github.com/vicheanath/golivestream/controllers"
	"github.com/vicheanath/golivestream/models"
	"github.com/vicheanath/golivestream/middlewares"
)

type Candidate struct {
	Target    int                  `json:"target"`
	Candidate *webrtc.ICECandidate `json:candidate`
}

type ResponseCandidate struct {
	Target    int                      `json:"target"`
	Candidate *webrtc.ICECandidateInit `json:candidate`
}

// SendOffer object to send to the sfu over Websockets
type SendOffer struct {
	SID   string                     `json:sid`
	Offer *webrtc.SessionDescription `json:offer`
}

// SendAnswer object to send to the sfu over Websockets
type SendAnswer struct {
	SID    string                     `json:sid`
	Answer *webrtc.SessionDescription `json:answer`
}

// TrickleResponse received from the sfu server
type TrickleResponse struct {
	Params ResponseCandidate `json:params`
	Method string            `json:method`
}

// Response received from the sfu over Websockets
type Response struct {
	Params *webrtc.SessionDescription `json:params`
	Result *webrtc.SessionDescription `json:result`
	Method string                     `json:method`
	Id     uint64                     `json:id`
}

type Stream struct {
	Name        string `json:"name"`
	Code        string `json:"code"`
	Description string `json:"description"`
	DeviceID    string `json:"device_id"`
	Witdh       int    `json:"width"`
	Height      int    `json:"height"`
}

var peerConnection *webrtc.PeerConnection
var connectionID uint64
var remoteDescription *webrtc.SessionDescription

var addr string

func main() {

	models.ConnectDataBase()

	flag.StringVar(&addr, "a", "localhost:7000", "address to use")
	flag.Parse()

	u := url.URL{Scheme: "ws", Host: addr, Path: "/ws"}
	log.Printf("connecting to %s", u.String())

	ws, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		log.Fatal("dial:", err)
	}

	r := gin.Default()

	// create auth middleware gin jwt
	public := r.Group("/api/v1")

	public.POST("/register", controllers.Register)
	public.POST("/login",controllers.Login)

	protected := r.Group("/api/v1/protected")
	protected.Use(middlewares.JwtAuthMiddleware())
	protected.GET("/user",controllers.CurrentUser)


	protected.GET("/ping", func(c *gin.Context) {
		res(c, 200, "pong")
	})
	protected.GET("/", func(c *gin.Context) {
		res(c, 200, "ok")
	})

	protected.GET("/stream/devices", func(c *gin.Context) {
		// Check if don't have any device
		if len(mediadevices.EnumerateDevices()) == 0 {
			res(c, 404, "No devices found")
			return
		}
		// Return devices
		res(c, 200, mediadevices.EnumerateDevices())
	})

	protected.POST("/stream/:id", func(c *gin.Context) {
		// read request body and decode it as json
		var stream Stream
		err := c.BindJSON(&stream)
		if err != nil {
			res(c, 400, err)
			return
		}
		go startPeerConnection(ws, stream)

	})
	r.Run()
	ws.Close()
}

func res(c *gin.Context, code int, data interface{}) {
	c.JSON(code, gin.H{
		"data":      data,
		"status":    "ok",
		"code":      code,
		"timestamp": time.Now().Unix(),
	})
}

func startPeerConnection(c *websocket.Conn, stream Stream) {
	config := webrtc.Configuration{
		ICEServers: []webrtc.ICEServer{
			{
				URLs: []string{"stun:stun.l.google.com:19302"},
			},
		},
		SDPSemantics: webrtc.SDPSemanticsUnifiedPlanWithFallback,
	}
	// Create a new RTCPeerConnection
	mediaEngine := webrtc.MediaEngine{}
	vpxParams, err := vpx.NewVP8Params()
	if err != nil {
		panic(err)
	}
	vpxParams.BitRate = 1000000 // 1Mbps

	devices := mediadevices.EnumerateDevices()

	// get device by id
	var device mediadevices.MediaDeviceInfo
	for _, d := range devices {
		if d.DeviceID == stream.DeviceID {
			device = d

		}
	}

	fmt.Println(device)
	var codecSelector *mediadevices.CodecSelector
	switch device.DeviceType {
	case "camera":
		codecSelector = mediadevices.NewCodecSelector(
			mediadevices.WithVideoEncoders(&vpxParams),
		)
	case "microphone":
		codecSelector = mediadevices.NewCodecSelector(
		// mediadevices.WithAudioEncoders(&opusParams),
		)
	case "screen":
		codecSelector = mediadevices.NewCodecSelector(
			mediadevices.WithVideoEncoders(&vpxParams),
		)
	}

	// codecSelector := mediadevices.NewCodecSelector(
	// 	mediadevices.WithVideoEncoders(&vpxParams),
	// )

	codecSelector.Populate(&mediaEngine)
	api := webrtc.NewAPI(webrtc.WithMediaEngine(&mediaEngine))
	peerConnection, err = api.NewPeerConnection(config)
	if err != nil {
		panic(err)
	}

	// Read incoming Websocket messages
	done := make(chan struct{})

	go readMessage(c, done)

	s, err := mediadevices.GetUserMedia(mediadevices.MediaStreamConstraints{
		Video: func(c *mediadevices.MediaTrackConstraints) {
			c.FrameFormat = prop.FrameFormat(frame.FormatYUY2)
			c.Width = prop.Int(1280)
			c.Height = prop.Int(720)
		},
		Codec: codecSelector,
	})

	if err != nil {
		panic(err)
	}

	for _, track := range s.GetTracks() {
		track.OnEnded(func(err error) {
			fmt.Printf("Track (ID: %s) ended with error: %v\n",
				track.ID(), err)
		})
		_, err = peerConnection.AddTransceiverFromTrack(track,
			webrtc.RtpTransceiverInit{
				Direction: webrtc.RTPTransceiverDirectionSendonly,
			},
		)
		if err != nil {
			panic(err)
		}
	}

	// Creating WebRTC offer
	offer, err := peerConnection.CreateOffer(nil)

	// Set the remote SessionDescription
	err = peerConnection.SetLocalDescription(offer)
	if err != nil {
		panic(err)
	}

	// Handling OnICECandidate event
	peerConnection.OnICECandidate(func(candidate *webrtc.ICECandidate) {
		if candidate != nil {
			candidateJSON, err := json.Marshal(&Candidate{
				Candidate: candidate,
				Target:    0,
			})

			params := (*json.RawMessage)(&candidateJSON)

			if err != nil {
				log.Fatal(err)
			}

			message := &jsonrpc2.Request{
				Method: "trickle",
				Params: params,
			}

			reqBodyBytes := new(bytes.Buffer)
			json.NewEncoder(reqBodyBytes).Encode(message)

			messageBytes := reqBodyBytes.Bytes()
			c.WriteMessage(websocket.TextMessage, messageBytes)
		}
	})

	peerConnection.OnICEConnectionStateChange(func(connectionState webrtc.ICEConnectionState) {
		fmt.Printf("Connection State has changed to %s \n", connectionState.String())
	})

	offerJSON, err := json.Marshal(&SendOffer{
		Offer: peerConnection.LocalDescription(),
		SID:   "test room",
	})

	params := (*json.RawMessage)(&offerJSON)

	connectionUUID := uuid.New()
	connectionID = uint64(connectionUUID.ID())

	offerMessage := &jsonrpc2.Request{
		Method: "join",
		Params: params,
		ID: jsonrpc2.ID{
			IsString: false,
			Str:      "",
			Num:      connectionID,
		},
	}

	reqBodyBytes := new(bytes.Buffer)
	json.NewEncoder(reqBodyBytes).Encode(offerMessage)

	messageBytes := reqBodyBytes.Bytes()
	c.WriteMessage(websocket.TextMessage, messageBytes)

	<-done
}

func readMessage(connection *websocket.Conn, done chan struct{}) {
	defer close(done)
	for {
		_, message, err := connection.ReadMessage()
		if err != nil || err == io.EOF {
			log.Fatal("Error reading: ", err)
			break
		}

		fmt.Printf("recv: %s", message)

		var response Response
		json.Unmarshal(message, &response)

		if response.Id == connectionID {
			result := *response.Result
			remoteDescription = response.Result
			if err := peerConnection.SetRemoteDescription(result); err != nil {
				log.Fatal(err)
			}
		} else if response.Id != 0 && response.Method == "offer" {
			peerConnection.SetRemoteDescription(*response.Params)
			answer, err := peerConnection.CreateAnswer(nil)

			if err != nil {
				log.Fatal(err)
			}

			peerConnection.SetLocalDescription(answer)

			connectionUUID := uuid.New()
			connectionID = uint64(connectionUUID.ID())

			offerJSON, err := json.Marshal(&SendAnswer{
				Answer: peerConnection.LocalDescription(),
				SID:    "test room",
			})

			params := (*json.RawMessage)(&offerJSON)

			answerMessage := &jsonrpc2.Request{
				Method: "answer",
				Params: params,
				ID: jsonrpc2.ID{
					IsString: false,
					Str:      "",
					Num:      connectionID,
				},
			}

			reqBodyBytes := new(bytes.Buffer)
			json.NewEncoder(reqBodyBytes).Encode(answerMessage)

			messageBytes := reqBodyBytes.Bytes()
			connection.WriteMessage(websocket.TextMessage, messageBytes)
		} else if response.Method == "trickle" {
			var trickleResponse TrickleResponse

			if err := json.Unmarshal(message, &trickleResponse); err != nil {
				log.Fatal(err)
			}

			err := peerConnection.AddICECandidate(*trickleResponse.Params.Candidate)

			if err != nil {
				log.Fatal(err)
			}
		}
	}
}
