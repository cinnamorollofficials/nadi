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

type MedicpediaNutrisiHandler interface {
	Create(c *gin.Context)
	GetAll(c *gin.Context)
	GetPublicAll(c *gin.Context)
	GetByID(c *gin.Context)
	GetBySlug(c *gin.Context)
	Update(c *gin.Context)
	Delete(c *gin.Context)
	Export(c *gin.Context)
}

type medicpedianutrisiHandler struct {
	service service.MedicpediaNutrisiService
}

func NewMedicpediaNutrisiHandler(service service.MedicpediaNutrisiService) MedicpediaNutrisiHandler {
	return &medicpedianutrisiHandler{service: service}
}

func (h *medicpedianutrisiHandler) Create(c *gin.Context) {
	var req dto.CreateMedicpediaNutrisiRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	res, err := h.service.Create(c.Request.Context(), req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, "MedicpediaNutrisi created successfully", res)
}

func (h *medicpedianutrisiHandler) GetAll(c *gin.Context) {
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

	response.Success(c, http.StatusOK, "MedicpediaNutrisis retrieved successfully", res)
}

func (h *medicpedianutrisiHandler) GetByID(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	res, err := h.service.GetByID(c.Request.Context(), uint(id))
	if err != nil {
		response.Error(c, http.StatusNotFound, "MedicpediaNutrisi not found")
		return
	}

	response.Success(c, http.StatusOK, "MedicpediaNutrisi retrieved successfully", res)
}

func (h *medicpedianutrisiHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")
	res, err := h.service.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		response.Error(c, http.StatusNotFound, "MedicpediaNutrisi not found")
		return
	}

	response.Success(c, http.StatusOK, "MedicpediaNutrisi retrieved successfully", res)
}

func (h *medicpedianutrisiHandler) GetPublicAll(c *gin.Context) {
	var pagination defaultDto.PaginationRequest
	if err := c.ShouldBindQuery(&pagination); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	res, err := h.service.GetPublicAll(c.Request.Context(), &pagination)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "MedicpediaNutrisis retrieved successfully", res)
}


func (h *medicpedianutrisiHandler) Update(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var req dto.UpdateMedicpediaNutrisiRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	res, err := h.service.Update(c.Request.Context(), uint(id), req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "MedicpediaNutrisi updated successfully", res)
}

func (h *medicpedianutrisiHandler) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := h.service.Delete(c.Request.Context(), uint(id)); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "MedicpediaNutrisi deleted successfully", nil)
}

func (h *medicpedianutrisiHandler) Export(c *gin.Context) {
	format := c.DefaultQuery("format", "excel")
	res, err := h.service.Export(c.Request.Context(), format)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	filename := "medicpedianutrisi." + format
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
