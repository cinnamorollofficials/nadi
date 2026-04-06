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

type MedicpediaNutrisiServiceTestSuite struct {
	suite.Suite
	ctrl      *gomock.Controller
	mockRepo  *mock_repository.MockMedicpediaNutrisiRepository
	mockCache *mock_pkg_cache.MockCacheService
	service   MedicpediaNutrisiService
}

func (s *MedicpediaNutrisiServiceTestSuite) SetupTest() {
	s.ctrl = gomock.NewController(s.T())
	s.mockRepo = mock_repository.NewMockMedicpediaNutrisiRepository(s.ctrl)
	s.mockCache = mock_pkg_cache.NewMockCacheService(s.ctrl)
	s.service = NewMedicpediaNutrisiService(s.mockRepo, s.mockCache)
}

func (s *MedicpediaNutrisiServiceTestSuite) TearDownTest() {
	s.ctrl.Finish()
}

func (s *MedicpediaNutrisiServiceTestSuite) TestCreate_Success() {
	req := dto.CreateMedicpediaNutrisiRequest{
		Name: "test",
		Slug: "test",
		Image: "test",
		Description: "test",
		Benefits: "test",
		Sources: "test",
		DailyNeeds: "test",
		RisksDeficiency: "test",
		Status: "test",
	}

	entity := &entity.MedicpediaNutrisi{
		Name: req.Name,
		Slug: req.Slug,
		Image: req.Image,
		Description: req.Description,
		Benefits: req.Benefits,
		Sources: req.Sources,
		DailyNeeds: req.DailyNeeds,
		RisksDeficiency: req.RisksDeficiency,
		Status: req.Status,
	}

	s.mockRepo.EXPECT().Create(gomock.Any(), entity).Return(nil)
	s.mockCache.EXPECT().DeletePattern(gomock.Any(), "medicpedia_nutrisi:*").Return(nil)

	res, err := s.service.Create(context.Background(), req)
	assert.NoError(s.T(), err)
	assert.NotNil(s.T(), res)
}

func TestMedicpediaNutrisiServiceTestSuite(t *testing.T) {
	suite.Run(t, new(MedicpediaNutrisiServiceTestSuite))
}
