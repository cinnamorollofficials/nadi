package handler

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hadi-projects/go-react-starter/pkg/cache"
	"github.com/hadi-projects/go-react-starter/pkg/logger"
	"github.com/hadi-projects/go-react-starter/pkg/response"
)

type CacheHandler interface {
	ClearAll(c *gin.Context)
	RefreshModule(c *gin.Context)
	GetStatus(c *gin.Context)
}

type cacheHandler struct {
	cache cache.CacheService
}

func NewCacheHandler(cache cache.CacheService) CacheHandler {
	return &cacheHandler{cache: cache}
}

func (h *cacheHandler) ClearAll(c *gin.Context) {
	if err := h.cache.FlushAll(); err != nil {
		logger.SystemLogger.Error().Err(err).Msg("Failed to clear cache")
		response.Error(c, http.StatusInternalServerError, "Failed to clear cache")
		return
	}

	logger.SystemLogger.Info().Msg("Cache cleared successfully")
	response.Success(c, http.StatusOK, "Cache cleared successfully", nil)
}

func (h *cacheHandler) RefreshModule(c *gin.Context) {
	module := c.Param("module")
	if module == "" {
		response.Error(c, http.StatusBadRequest, "Module name is required")
		return
	}

	pattern := fmt.Sprintf("%s:*", module)
	if err := h.cache.DeletePattern(c.Request.Context(), pattern); err != nil {
		logger.SystemLogger.Error().Err(err).Str("module", module).Msg("Failed to refresh module cache")
		response.Error(c, http.StatusInternalServerError, fmt.Sprintf("Failed to refresh %s cache", module))
		return
	}

	logger.SystemLogger.Info().Str("module", module).Msg("Module cache refreshed successfully")
	response.Success(c, http.StatusOK, fmt.Sprintf("%s cache refreshed successfully", module), nil)
}

func (h *cacheHandler) GetStatus(c *gin.Context) {
	status := h.cache.Status()
	response.Success(c, http.StatusOK, "Cache status", gin.H{"status": status})
}
