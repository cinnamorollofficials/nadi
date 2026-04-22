package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	dto "github.com/hadi-projects/go-react-starter/internal/dto/default"
	"github.com/hadi-projects/go-react-starter/internal/service"
	"github.com/hadi-projects/go-react-starter/pkg/response"
)

type AiTierHandler interface {
	Create(c *gin.Context)
	GetAll(c *gin.Context)
	GetByID(c *gin.Context)
	Update(c *gin.Context)
	Delete(c *gin.Context)
}

type aiTierHandler struct {
	aiTierService service.AiTierService
}

func NewAiTierHandler(aiTierService service.AiTierService) AiTierHandler {
	return &aiTierHandler{aiTierService: aiTierService}
}

func (h *aiTierHandler) Create(c *gin.Context) {
	var req dto.CreateAiTierRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	res, err := h.aiTierService.Create(c.Request.Context(), req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, "AI Tier created successfully", res)
}

func (h *aiTierHandler) GetAll(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.Query("search")

	pagination := &dto.PaginationRequest{
		Page:   page,
		Limit:  limit,
		Search: search,
	}

	res, err := h.aiTierService.GetAll(c.Request.Context(), pagination)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	meta := &response.PaginationMeta{
		CurrentPage: res.Meta.CurrentPage,
		TotalPages:  res.Meta.TotalPages,
		TotalData:   res.Meta.TotalData,
		Limit:       res.Meta.Limit,
	}

	response.SuccessWithPagination(c, http.StatusOK, "AI Tiers retrieved", res.Data, meta)
}

func (h *aiTierHandler) GetByID(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	res, err := h.aiTierService.GetByID(c.Request.Context(), uint(id))
	if err != nil {
		response.Error(c, http.StatusNotFound, "AI Tier not found")
		return
	}
	response.Success(c, http.StatusOK, "AI Tier retrieved", res)
}

func (h *aiTierHandler) Update(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var req dto.UpdateAiTierRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	res, err := h.aiTierService.Update(c.Request.Context(), uint(id), req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "AI Tier updated successfully", res)
}

func (h *aiTierHandler) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := h.aiTierService.Delete(c.Request.Context(), uint(id)); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, "AI Tier deleted successfully", nil)
}
