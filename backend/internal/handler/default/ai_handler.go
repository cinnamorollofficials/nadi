package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	dto "github.com/hadi-projects/go-react-starter/internal/dto/default"
	"github.com/hadi-projects/go-react-starter/internal/repository"
	"github.com/hadi-projects/go-react-starter/pkg/response"
)

type AiHandler interface {
	GetStats(c *gin.Context)
	GetDailyUsage(c *gin.Context)
	GetTopUsers(c *gin.Context)
	GetMyUsage(c *gin.Context)
	GetAllUsersTodayUsage(c *gin.Context)
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

func (h *aiHandler) GetMyUsage(c *gin.Context) {
	userIDVal, exists := c.Get("userID")
	if !exists {
		response.Error(c, http.StatusUnauthorized, "unauthorized")
		return
	}
	userID, ok := userIDVal.(uint)
	if !ok {
		response.Error(c, http.StatusUnauthorized, "invalid user ID")
		return
	}

	days, _ := strconv.Atoi(c.DefaultQuery("days", "7"))
	ctx := c.Request.Context()

	today, err := h.repo.GetTodayUsageByUserID(ctx, userID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	history, err := h.repo.GetUsageHistoryByUserID(ctx, userID, days)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	allTime, err := h.repo.GetAllTimeUsageByUserID(ctx, userID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	result := &dto.UserUsageResponse{
		Today: &dto.UserDailyTokenUsage{
			MessageCount:     int(today.MessageCount),
			TotalTokens:      int(today.TotalTokens),
			PromptTokens:     int(today.PromptTokens),
			CandidatesTokens: int(today.CandidatesTokens),
			EstimatedCost:    today.EstimatedCost,
		},
		History: func() []dto.UserUsageDailyHistory {
			h := make([]dto.UserUsageDailyHistory, len(history))
			for i, d := range history {
				h[i] = dto.UserUsageDailyHistory{
					Date:     d.Date,
					Tokens:   int(d.Tokens),
					Messages: int(d.Messages),
				}
			}
			return h
		}(),
	}
	result.AllTime.TotalTokens = allTime.TotalTokens
	result.AllTime.TotalMessages = allTime.TotalMessages
	result.AllTime.TotalCost = allTime.TotalCost

	response.Success(c, http.StatusOK, "AI usage retrieved successfully", result)
}

func (h *aiHandler) GetAllUsersTodayUsage(c *gin.Context) {
	usage, err := h.repo.GetTodayUsageAllUsers(c.Request.Context())
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, "All users today usage retrieved successfully", usage)
}
