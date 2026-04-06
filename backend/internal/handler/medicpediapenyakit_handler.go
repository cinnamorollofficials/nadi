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

type MedicpediaPenyakitHandler interface {
	Create(c *gin.Context)
	GetAll(c *gin.Context)
	GetPublicAll(c *gin.Context)
	GetByID(c *gin.Context)
	GetBySlug(c *gin.Context)
	Update(c *gin.Context)
	Delete(c *gin.Context)
	Export(c *gin.Context)
}

type medicpediapenyakitHandler struct {
	service service.MedicpediaPenyakitService
}

func NewMedicpediaPenyakitHandler(service service.MedicpediaPenyakitService) MedicpediaPenyakitHandler {
	return &medicpediapenyakitHandler{service: service}
}

func (h *medicpediapenyakitHandler) Create(c *gin.Context) {
	var req dto.CreateMedicpediaPenyakitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	res, err := h.service.Create(c.Request.Context(), req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, "MedicpediaPenyakit created successfully", res)
}

func (h *medicpediapenyakitHandler) GetAll(c *gin.Context) {
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

	response.Success(c, http.StatusOK, "MedicpediaPenyakits retrieved successfully", res)
}

func (h *medicpediapenyakitHandler) GetByID(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	res, err := h.service.GetByID(c.Request.Context(), uint(id))
	if err != nil {
		response.Error(c, http.StatusNotFound, "MedicpediaPenyakit not found")
		return
	}

	response.Success(c, http.StatusOK, "MedicpediaPenyakit retrieved successfully", res)
}

func (h *medicpediapenyakitHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")
	res, err := h.service.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		response.Error(c, http.StatusNotFound, "MedicpediaPenyakit not found")
		return
	}

	response.Success(c, http.StatusOK, "MedicpediaPenyakit retrieved successfully", res)
}

func (h *medicpediapenyakitHandler) GetPublicAll(c *gin.Context) {
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

	response.Success(c, http.StatusOK, "MedicpediaPenyakits retrieved successfully", res)
}

func (h *medicpediapenyakitHandler) Update(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var req dto.UpdateMedicpediaPenyakitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	res, err := h.service.Update(c.Request.Context(), uint(id), req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "MedicpediaPenyakit updated successfully", res)
}

func (h *medicpediapenyakitHandler) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := h.service.Delete(c.Request.Context(), uint(id)); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "MedicpediaPenyakit deleted successfully", nil)
}

func (h *medicpediapenyakitHandler) Export(c *gin.Context) {
	format := c.DefaultQuery("format", "excel")
	res, err := h.service.Export(c.Request.Context(), format)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	filename := "medicpediapenyakit." + format
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
