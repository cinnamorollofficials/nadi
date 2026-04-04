package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	service "github.com/hadi-projects/go-react-starter/internal/service/default"
	"github.com/hadi-projects/go-react-starter/pkg/logger"
	"github.com/hadi-projects/go-react-starter/pkg/response"
)

type StatisticsHandler interface {
	GetDashboardStats(c *gin.Context)
}

type statisticsHandler struct {
	service service.StatisticsService
}

func NewStatisticsHandler(service service.StatisticsService) StatisticsHandler {
	return &statisticsHandler{service: service}
}

func (h *statisticsHandler) GetDashboardStats(c *gin.Context) {
	stats, err := h.service.GetDashboardStats()
	if err != nil {
		logger.SystemLogger.Error().Err(err).Msg("Failed to fetch dashboard stats")
		response.Error(c, http.StatusInternalServerError, "Failed to fetch dashboard statistics")
		return
	}

	response.Success(c, http.StatusOK, "Dashboard statistics retrieved successfully", stats)
}
