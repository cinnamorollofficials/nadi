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

type MedicpediaPenyakitServiceTestSuite struct {
	suite.Suite
	ctrl      *gomock.Controller
	mockRepo  *mock_repository.MockMedicpediaPenyakitRepository
	mockCache *mock_pkg_cache.MockCacheService
	service   MedicpediaPenyakitService
}

func (s *MedicpediaPenyakitServiceTestSuite) SetupTest() {
	s.ctrl = gomock.NewController(s.T())
	s.mockRepo = mock_repository.NewMockMedicpediaPenyakitRepository(s.ctrl)
	s.mockCache = mock_pkg_cache.NewMockCacheService(s.ctrl)
	s.service = NewMedicpediaPenyakitService(s.mockRepo, s.mockCache)
}

func (s *MedicpediaPenyakitServiceTestSuite) TearDownTest() {
	s.ctrl.Finish()
}

func (s *MedicpediaPenyakitServiceTestSuite) TestCreate_Success() {
	req := dto.CreateMedicpediaPenyakitRequest{
		Name: "test",
		Slug: "test",
		Image: "test",
		Description: "test",
		Causes: "test",
		FactorsSymptoms: "test",
		Diagnosis: "test",
		WhenToSeeDoctor: "test",
		Prevention: "test",
		Status: "test",
	}

	entity := &entity.MedicpediaPenyakit{
		Name: req.Name,
		Slug: req.Slug,
		Image: req.Image,
		Description: req.Description,
		Causes: req.Causes,
		FactorsSymptoms: req.FactorsSymptoms,
		Diagnosis: req.Diagnosis,
		WhenToSeeDoctor: req.WhenToSeeDoctor,
		Prevention: req.Prevention,
		Status: req.Status,
	}

	s.mockRepo.EXPECT().Create(gomock.Any(), entity).Return(nil)
	s.mockCache.EXPECT().DeletePattern(gomock.Any(), "medicpedia_penyakit:*").Return(nil)

	res, err := s.service.Create(context.Background(), req)
	assert.NoError(s.T(), err)
	assert.NotNil(s.T(), res)
}

func TestMedicpediaPenyakitServiceTestSuite(t *testing.T) {
	suite.Run(t, new(MedicpediaPenyakitServiceTestSuite))
}
