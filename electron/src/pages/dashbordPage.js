import {
  Box,
  Button,
  CircularProgress,
  Flex,
  Grid,
  SimpleGrid,
  Text,
  Wrap,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Client, LocalStream, RemoteStream } from "ion-sdk-js";
import { IonSFUJSONRPCSignal } from "ion-sdk-js/lib/signal/json-rpc-impl";

const { shell } = window.require("electron");
const { exec } = window.require("child_process");

const DashboardPage = () => {
  const remoteVideo = React.useRef(null);
  useEffect(() => {
    const signalLocal = new IonSFUJSONRPCSignal("ws://192.168.0.101:7000/ws");
    const config = {
      codec: "vp8",
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
        /*{
            "urls": "turn:TURN_IP:3468",
            "username": "username",
            "credential": "password"
        },*/
      ],
    };
    const clientLocal = new Client(signalLocal, config);

    signalLocal.onopen = () => clientLocal.join("test room");

    clientLocal.ontrack = (track, stream) => {
      console.log("got track", track.id, "for stream", stream.id);
      if (track.kind === "video") {
        track.onunmute = () => {
          remoteVideo.current.srcObject = stream;
          remoteVideo.current.autoplay = true;
          remoteVideo.current.muted = true;
          remoteVideo.current.playsInline = true;

          track.onremovetrack = () => {
            remoteVideo.current.srcObject = null;
          };
        };
      }
    };
  }, [remoteVideo]);

  const handleRun = () => {
    exec("go run main.go", (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(stdout);
    });
  };


  return (
    <Box>
      <Text>Dashboard</Text>
      {/* run go run main.go command */}
      <Button onClick={() => handleRun()}>Run</Button>
      <video
        ref={remoteVideo}
        style={{ width: "100%", height: "100%" }}
      ></video>
    </Box>
  );
};

export default DashboardPage;
