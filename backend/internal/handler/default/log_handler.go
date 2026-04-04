package handler

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	dto "github.com/hadi-projects/go-react-starter/internal/dto/default"
	repository "github.com/hadi-projects/go-react-starter/internal/repository/default"
	service "github.com/hadi-projects/go-react-starter/internal/service/default"
	"github.com/hadi-projects/go-react-starter/pkg/cache"
	"github.com/hadi-projects/go-react-starter/pkg/logger"
	"github.com/hadi-projects/go-react-starter/pkg/response"
)

type LogHandler interface {
	GetLogs(ctx *gin.Context)
	Export(ctx *gin.Context)
}

type logHandler struct {
	logService service.LogService
	cache      cache.CacheService
	permRepo   repository.PermissionRepository
}

func NewLogHandler(logService service.LogService, cacheService cache.CacheService, permRepo repository.PermissionRepository) LogHandler {
	return &logHandler{
		logService: logService,
		cache:      cacheService,
		permRepo:   permRepo,
	}
}

// hasPermission checks whether the current request's user has the named permission,
// using the same permissions_mask + DB/cache lookup strategy as PermissionGuard.
// Returns true immediately for users whose JWT role claim is "admin".
func (h *logHandler) hasPermission(ctx *gin.Context, permName string) bool {
	// Admin role bypass (same as PermissionGuard)
	role, exists := ctx.Get("role")
	if exists && role != nil {
		if roleStr, ok := role.(string); ok && roleStr == "admin" {
			return true
		}
	}

	permissionsMaskInterface, exists := ctx.Get("permissions_mask")
	if !exists {
		return false
	}

	userMask, ok := permissionsMaskInterface.(uint64)
	if !ok {
		return false
	}

	reqCtx := ctx.Request.Context()
	if reqCtx == nil {
		reqCtx = context.Background()
	}

	cacheKey := "perm_id:" + permName
	var permID uint

	if err := h.cache.Get(reqCtx, cacheKey, &permID); err != nil {
		perm, err := h.permRepo.FindByName(reqCtx, permName)
		if err != nil {
			logger.SystemLogger.Error().Err(err).Msgf("logHandler: failed to find permission %q", permName)
			return false
		}
		permID = perm.ID
		h.cache.Set(reqCtx, cacheKey, permID, 24*time.Hour)
	}

	if permID == 0 || permID > 64 {
		return false
	}

	requiredMask := uint64(1) << (permID - 1)
	return (userMask & requiredMask) != 0
}

func (h *logHandler) GetLogs(ctx *gin.Context) {
	var query dto.LogQuery
	if err := ctx.ShouldBindQuery(&query); err != nil {
		response.Error(ctx, http.StatusBadRequest, err.Error())
		return
	}

	isAdmin := h.hasPermission(ctx, "get-all-logs")
	canSeeOwn := h.hasPermission(ctx, "get-own-logs")

	if !isAdmin && !canSeeOwn {
		response.Error(ctx, http.StatusForbidden, "you don't have permission to view logs")
		return
	}

	// Non-admins may only see their own log entries
	if !isAdmin {
		userID, exists := ctx.Get("user_id")
		if !exists {
			response.Error(ctx, http.StatusForbidden, "user id not found in context")
			return
		}
		query.UserID = userID.(uint)
	}

	logs, err := h.logService.GetLogs(query)
	if err != nil {
		response.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(ctx, http.StatusOK, "Logs retrieved successfully", logs)
}

func (h *logHandler) Export(ctx *gin.Context) {
	var query dto.LogQuery
	if err := ctx.ShouldBindQuery(&query); err != nil {
		response.Error(ctx, http.StatusBadRequest, err.Error())
		return
	}

	format := ctx.DefaultQuery("format", "excel")
	data, filename, err := h.logService.Export(query, format)
	if err != nil {
		response.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	contentType := "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	if format == "csv" {
		contentType = "text/csv"
	}

	ctx.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	ctx.Header("Content-Type", contentType)
	ctx.Data(http.StatusOK, contentType, data)
}
