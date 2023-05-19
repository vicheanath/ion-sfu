package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/vicheanath/golivestream/models"
	"github.com/vicheanath/golivestream/utils"
	"github.com/vicheanath/golivestream/utils/token"
	"net/http"
)

func CurrentUser(c *gin.Context) {

	user_id, err := token.ExtractTokenID(c)

	if err != nil {
		utils.Res(c, http.StatusBadRequest, nil, err)
		return
	}

	u, err := models.GetUserByID(user_id)

	if err != nil {
		utils.Res(c, http.StatusBadRequest, nil, err)
		return
	}

	utils.Res(c, http.StatusOK, u, nil)
}

type LoginInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {

	var input LoginInput

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.Res(c, http.StatusBadRequest, nil, err)
		return
	}

	u := models.User{}

	u.Username = input.Username
	u.Password = input.Password

	token, err := models.LoginCheck(u.Username, u.Password)

	if err != nil {
		utils.Res(c, http.StatusBadRequest, nil, err)
		return
	}

	utils.Res(c, http.StatusOK, token, nil)

}

type RegisterInput struct {
	Username string `json:"Username" binding:"required"`
	Password string `json:"Password" binding:"required"`
}

func Register(c *gin.Context) {

	var input RegisterInput

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.Res(c, http.StatusBadRequest, nil, err)
		return
	}

	u := models.User{}

	u.Username = input.Username
	u.Password = input.Password

	_, err := u.SaveUser()

	if err != nil {
		utils.Res(c, http.StatusBadRequest, nil, err)
		return
	}

	utils.Res(c, http.StatusOK, u, nil)

}
