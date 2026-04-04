package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/hadi-projects/go-react-starter/internal/dto"
	defaultDto "github.com/hadi-projects/go-react-starter/internal/dto/default"
	"github.com/hadi-projects/go-react-starter/internal/service"
	"github.com/hadi-projects/go-react-starter/pkg/response"
)

type BlogPostHandler interface {
	Create(c *gin.Context)
	GetAll(c *gin.Context)
	GetByID(c *gin.Context)
	Update(c *gin.Context)
	Delete(c *gin.Context)
	Export(c *gin.Context)
}

type blogpostHandler struct {
	service service.BlogPostService
}

func NewBlogPostHandler(service service.BlogPostService) BlogPostHandler {
	return &blogpostHandler{service: service}
}

func (h *blogpostHandler) Create(c *gin.Context) {
	var req dto.CreateBlogPostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	res, err := h.service.Create(c.Request.Context(), req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, "BlogPost created successfully", res)
}

func (h *blogpostHandler) GetAll(c *gin.Context) {
	var pagination defaultDto.PaginationRequest
	if err := c.ShouldBindQuery(&pagination); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	res, err := h.service.GetAll(c.Request.Context(), &pagination)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "BlogPosts retrieved successfully", res)
}

func (h *blogpostHandler) GetByID(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	res, err := h.service.GetByID(c.Request.Context(), uint(id))
	if err != nil {
		response.Error(c, http.StatusNotFound, "BlogPost not found")
		return
	}

	response.Success(c, http.StatusOK, "BlogPost retrieved successfully", res)
}

func (h *blogpostHandler) Update(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var req dto.UpdateBlogPostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	res, err := h.service.Update(c.Request.Context(), uint(id), req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "BlogPost updated successfully", res)
}

func (h *blogpostHandler) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := h.service.Delete(c.Request.Context(), uint(id)); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "BlogPost deleted successfully", nil)
}

func (h *blogpostHandler) Export(c *gin.Context) {
	format := c.DefaultQuery("format", "excel")
	res, err := h.service.Export(c.Request.Context(), format)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	filename := "blogpost." + format
	contentType := "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	if format == "csv" {
		contentType = "text/csv"
	}

	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Transfer-Encoding", "binary")
	c.Header("Content-Disposition", "attachment; filename="+filename)
	c.Header("Content-Type", contentType)
	c.Data(http.StatusOK, contentType, res)
}
