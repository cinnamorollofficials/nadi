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

type FaqHandler interface {
	Create(c *gin.Context)
	GetAll(c *gin.Context)
	GetByID(c *gin.Context)
	Update(c *gin.Context)
	Delete(c *gin.Context)
	Export(c *gin.Context)
}

type faqHandler struct {
	service service.FaqService
}

func NewFaqHandler(service service.FaqService) FaqHandler {
	return &faqHandler{service: service}
}

func (h *faqHandler) Create(c *gin.Context) {
	var req dto.CreateFaqRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	res, err := h.service.Create(c.Request.Context(), req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, "Faq created successfully", res)
}

func (h *faqHandler) GetAll(c *gin.Context) {
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

	response.Success(c, http.StatusOK, "Faqs retrieved successfully", res)
}

func (h *faqHandler) GetByID(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	res, err := h.service.GetByID(c.Request.Context(), uint(id))
	if err != nil {
		response.Error(c, http.StatusNotFound, "Faq not found")
		return
	}

	response.Success(c, http.StatusOK, "Faq retrieved successfully", res)
}

func (h *faqHandler) Update(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var req dto.UpdateFaqRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	res, err := h.service.Update(c.Request.Context(), uint(id), req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Faq updated successfully", res)
}

func (h *faqHandler) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := h.service.Delete(c.Request.Context(), uint(id)); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Faq deleted successfully", nil)
}

func (h *faqHandler) Export(c *gin.Context) {
	format := c.DefaultQuery("format", "excel")
	res, err := h.service.Export(c.Request.Context(), format)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	filename := "faq." + format
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
