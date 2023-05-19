package utils

import (
	"github.com/gin-gonic/gin"
	"time"
)



func Res(c *gin.Context, status int, data interface{}, err error) {
	c.JSON(status, gin.H{
		"status":    status,
		"data":      data,
		"timestamp": time.Now().Unix(),
		"error":     err.Error(),
	})
}
