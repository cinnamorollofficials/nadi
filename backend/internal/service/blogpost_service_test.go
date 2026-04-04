package service

import (
	"testing"

	"github.com/hadi-projects/go-react-starter/internal/dto"
	"github.com/hadi-projects/go-react-starter/internal/entity"
	mock_repository "github.com/hadi-projects/go-react-starter/internal/mock/repository"
	mock_pkg_cache "github.com/hadi-projects/go-react-starter/internal/mock/pkg/cache"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/mock/gomock"
)

type BlogPostServiceTestSuite struct {
	suite.Suite
	ctrl      *gomock.Controller
	mockRepo  *mock_repository.MockBlogPostRepository
	mockCache *mock_pkg_cache.MockCacheService
	service   BlogPostService
}

func (s *BlogPostServiceTestSuite) SetupTest() {
	s.ctrl = gomock.NewController(s.T())
	s.mockRepo = mock_repository.NewMockBlogPostRepository(s.ctrl)
	s.mockCache = mock_pkg_cache.NewMockCacheService(s.ctrl)
	s.service = NewBlogPostService(s.mockRepo, s.mockCache)
}

func (s *BlogPostServiceTestSuite) TearDownTest() {
	s.ctrl.Finish()
}

func (s *BlogPostServiceTestSuite) TestCreate_Success() {
	req := dto.CreateBlogPostRequest{
		Title: "test",
		Slug: "test",
		Summary: "test",
		Content: "test",
		Author: "test",
		Category: "test",
		Status: "test",
		Image: "test",
		PublishedAt: nil,
	}

	entity := &entity.BlogPost{
		Title: req.Title,
		Slug: req.Slug,
		Summary: req.Summary,
		Content: req.Content,
		Author: req.Author,
		Category: req.Category,
		Status: req.Status,
		Image: req.Image,
		PublishedAt: req.PublishedAt,
	}

	s.mockRepo.EXPECT().Create(entity).Return(nil)
	s.mockCache.EXPECT().DeletePattern("blogposts:*").Return(nil)

	res, err := s.service.Create(req)
	assert.NoError(s.T(), err)
	assert.NotNil(s.T(), res)
}

func TestBlogPostServiceTestSuite(t *testing.T) {
	suite.Run(t, new(BlogPostServiceTestSuite))
}
