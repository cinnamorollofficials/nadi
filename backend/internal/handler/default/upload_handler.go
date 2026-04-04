package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	service "github.com/hadi-projects/go-react-starter/internal/service/default"
	"github.com/hadi-projects/go-react-starter/pkg/response"
)

type UploadHandler interface {
	Upload(c *gin.Context)
}

type uploadHandler struct {
	service service.UploadService
}

func NewUploadHandler(service service.UploadService) UploadHandler {
	return &uploadHandler{service: service}
}

func (h *uploadHandler) Upload(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		response.Error(c, http.StatusBadRequest, "No file uploaded")
		return
	}

	folder := c.DefaultPostForm("folder", "general")
	
	path, err := h.service.UploadFile(file, folder)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to upload file: "+err.Error())
		return
	}

	response.Success(c, http.StatusOK, "File uploaded successfully", gin.H{
		"path": "/" + path,
	})
}
