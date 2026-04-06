package service

import (
	"context"
	"testing"

	"github.com/hadi-projects/go-react-starter/internal/dto"
	"github.com/hadi-projects/go-react-starter/internal/entity"
	mock_repository "github.com/hadi-projects/go-react-starter/internal/mock/repository"
	mock_pkg_cache "github.com/hadi-projects/go-react-starter/internal/mock/pkg/cache"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/mock/gomock"
)

type FaqServiceTestSuite struct {
	suite.Suite
	ctrl      *gomock.Controller
	mockRepo  *mock_repository.MockFaqRepository
	mockCache *mock_pkg_cache.MockCacheService
	service   FaqService
}

func (s *FaqServiceTestSuite) SetupTest() {
	s.ctrl = gomock.NewController(s.T())
	s.mockRepo = mock_repository.NewMockFaqRepository(s.ctrl)
	s.mockCache = mock_pkg_cache.NewMockCacheService(s.ctrl)
	s.service = NewFaqService(s.mockRepo, s.mockCache)
}

func (s *FaqServiceTestSuite) TearDownTest() {
	s.ctrl.Finish()
}

func (s *FaqServiceTestSuite) TestCreate_Success() {
	req := dto.CreateFaqRequest{
		Question: "test",
		Answer: "test",
		Status: "test",
	}

	entity := &entity.Faq{
		Question: req.Question,
		Answer: req.Answer,
		Status: req.Status,
	}

	s.mockRepo.EXPECT().Create(gomock.Any(), entity).Return(nil)
	s.mockCache.EXPECT().DeletePattern(gomock.Any(), "faqs:*").Return(nil)

	res, err := s.service.Create(context.Background(), req)
	assert.NoError(s.T(), err)
	assert.NotNil(s.T(), res)
}

func TestFaqServiceTestSuite(t *testing.T) {
	suite.Run(t, new(FaqServiceTestSuite))
}
