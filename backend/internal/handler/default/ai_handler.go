package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/hadi-projects/go-react-starter/internal/repository"
	"github.com/hadi-projects/go-react-starter/pkg/response"
)

type AiHandler interface {
	GetStats(c *gin.Context)
	GetDailyUsage(c *gin.Context)
	GetTopUsers(c *gin.Context)
}

type aiHandler struct {
	repo repository.AiUsageRepository
}

func NewAiHandler(repo repository.AiUsageRepository) AiHandler {
	return &aiHandler{repo: repo}
}

func (h *aiHandler) GetStats(c *gin.Context) {
	stats, err := h.repo.GetStats(c.Request.Context())
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, "AI usage stats retrieved successfully", stats)
}

func (h *aiHandler) GetDailyUsage(c *gin.Context) {
	days, _ := strconv.Atoi(c.DefaultQuery("days", "7"))
	usage, err := h.repo.GetDailyUsage(c.Request.Context(), days)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, "AI daily usage retrieved successfully", usage)
}

func (h *aiHandler) GetTopUsers(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	users, err := h.repo.GetTopUsers(c.Request.Context(), limit)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, "AI top users retrieved successfully", users)
}
