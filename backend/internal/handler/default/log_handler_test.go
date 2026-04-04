package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	dto "github.com/hadi-projects/go-react-starter/internal/dto/default"
	mock_repository "github.com/hadi-projects/go-react-starter/internal/mock/repository"
	mock_service "github.com/hadi-projects/go-react-starter/internal/mock/service"
	mock_cache "github.com/hadi-projects/go-react-starter/internal/mock/pkg/cache"
	"github.com/hadi-projects/go-react-starter/pkg/logger"
	"github.com/rs/zerolog"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/mock/gomock"
)

type LogHandlerTestSuite struct {
	suite.Suite
	ctrl           *gomock.Controller
	mockService    *mock_service.MockLogService
	mockCache      *mock_cache.MockCacheService
	mockPermRepo   *mock_repository.MockPermissionRepository
	handler        LogHandler
}

func (s *LogHandlerTestSuite) SetupTest() {
	s.ctrl = gomock.NewController(s.T())
	s.mockService = mock_service.NewMockLogService(s.ctrl)
	s.mockCache = mock_cache.NewMockCacheService(s.ctrl)
	s.mockPermRepo = mock_repository.NewMockPermissionRepository(s.ctrl)
	s.handler = NewLogHandler(s.mockService, s.mockCache, s.mockPermRepo)

	gin.SetMode(gin.TestMode)
	logger.SystemLogger = zerolog.Nop()
}

func (s *LogHandlerTestSuite) TearDownTest() {
	s.ctrl.Finish()
}

func (s *LogHandlerTestSuite) TestGetLogs_AdminSuccess() {
	// Setup context with role="admin" to trigger the admin bypass in hasPermission
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request, _ = http.NewRequest("GET", "/logs?type=audit", nil)
	c.Set("user_id", uint(1))
	c.Set("role", "admin")

	// Mock GetLogs
	expectedLogs := []dto.LogResponse{
		{Message: "test log"},
	}
	s.mockService.EXPECT().GetLogs(gomock.Any()).Return(expectedLogs, nil)

	s.handler.GetLogs(c)

	assert.Equal(s.T(), http.StatusOK, w.Code)

	var resBody map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resBody)
	meta := resBody["meta"].(map[string]interface{})
	assert.Equal(s.T(), "success", meta["status"])
}

func (s *LogHandlerTestSuite) TestGetLogs_NoPermission_Forbidden() {
	// Setup context with no role and no permissions_mask
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request, _ = http.NewRequest("GET", "/logs?type=audit", nil)
	c.Set("user_id", uint(2))
	// permissions_mask = 0 means no permissions at all
	c.Set("permissions_mask", uint64(0))

	// hasPermission will call cache.Get (miss) then permRepo.FindByName for each checked permission
	s.mockCache.EXPECT().Get(gomock.Any(), "perm_id:get-all-logs", gomock.Any()).Return(assert.AnError)
	s.mockPermRepo.EXPECT().FindByName(gomock.Any(), "get-all-logs").Return(nil, assert.AnError)

	s.mockCache.EXPECT().Get(gomock.Any(), "perm_id:get-own-logs", gomock.Any()).Return(assert.AnError)
	s.mockPermRepo.EXPECT().FindByName(gomock.Any(), "get-own-logs").Return(nil, assert.AnError)

	s.handler.GetLogs(c)

	assert.Equal(s.T(), http.StatusForbidden, w.Code)
}

func TestLogHandlerTestSuite(t *testing.T) {
	suite.Run(t, new(LogHandlerTestSuite))
}
