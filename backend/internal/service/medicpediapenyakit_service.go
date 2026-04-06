package service

import (
	"bytes"
	"context"
	"encoding/csv"
	"fmt"
	"math"
	"time"

	"github.com/xuri/excelize/v2"
	defaultDto "github.com/hadi-projects/go-react-starter/internal/dto/default"
	"github.com/hadi-projects/go-react-starter/internal/dto"
	"github.com/hadi-projects/go-react-starter/internal/entity"
	"github.com/hadi-projects/go-react-starter/internal/repository"
	"github.com/hadi-projects/go-react-starter/pkg/cache"
	"github.com/hadi-projects/go-react-starter/pkg/logger"
)

type MedicpediaPenyakitService interface {
	Create(ctx context.Context, req dto.CreateMedicpediaPenyakitRequest) (*dto.MedicpediaPenyakitResponse, error)
	GetAll(ctx context.Context, pagination *defaultDto.PaginationRequest) (*defaultDto.PaginationResponse, error)
	GetPublicAll(ctx context.Context, pagination *defaultDto.PaginationRequest) (*defaultDto.PaginationResponse, error)
	GetByID(ctx context.Context, id uint) (*dto.MedicpediaPenyakitResponse, error)
	GetBySlug(ctx context.Context, slug string) (*dto.MedicpediaPenyakitResponse, error)
	Update(ctx context.Context, id uint, req dto.UpdateMedicpediaPenyakitRequest) (*dto.MedicpediaPenyakitResponse, error)
	Delete(ctx context.Context, id uint) error
	Export(ctx context.Context, format string) ([]byte, error)
}

type medicpediapenyakitService struct {
	repo  repository.MedicpediaPenyakitRepository
	cache cache.CacheService
}

func NewMedicpediaPenyakitService(repo repository.MedicpediaPenyakitRepository, cache cache.CacheService) MedicpediaPenyakitService {
	return &medicpediapenyakitService{
		repo:  repo,
		cache: cache,
	}
}

func (s *medicpediapenyakitService) Create(ctx context.Context, req dto.CreateMedicpediaPenyakitRequest) (*dto.MedicpediaPenyakitResponse, error) {
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

	if err := s.repo.Create(ctx, entity); err != nil {
		return nil, err
	}

	s.cache.DeletePattern(ctx, "medicpedia_penyakit:*")

	
	logger.AuditLogger.Info().
		Uint("medicpediapenyakit_id", entity.ID).
		Str("action", "medicpediapenyakit_creation").
		Msg("medicpediapenyakit created")
	

	return s.mapToResponse(entity), nil
}

func (s *medicpediapenyakitService) GetAll(ctx context.Context, pagination *defaultDto.PaginationRequest) (*defaultDto.PaginationResponse, error) {
	cacheKey := fmt.Sprintf("medicpedia_penyakit:page:%d:limit:%d:search:%s", pagination.GetPage(), pagination.GetLimit(), pagination.Search)
	var cached defaultDto.PaginationResponse
	if err := s.cache.Get(ctx, cacheKey, &cached); err == nil {
		return &cached, nil
	}

	entities, total, err := s.repo.FindAll(ctx, pagination)
	if err != nil {
		return nil, err
	}

	var responses []dto.MedicpediaPenyakitResponse
	for _, e := range entities {
		responses = append(responses, *s.mapToResponse(&e))
	}

	response := &defaultDto.PaginationResponse{
		Data: responses,
		Meta: defaultDto.PaginationMeta{
			CurrentPage: pagination.GetPage(),
			TotalPages:  int(math.Ceil(float64(total) / float64(pagination.GetLimit()))),
			TotalData:   total,
			Limit:       pagination.GetLimit(),
		},
	}

	s.cache.Set(ctx, cacheKey, response, 5*time.Minute)
	return response, nil
}

func (s *medicpediapenyakitService) GetByID(ctx context.Context, id uint) (*dto.MedicpediaPenyakitResponse, error) {
	cacheKey := fmt.Sprintf("medicpedia_penyakit:%d", id)
	var cached dto.MedicpediaPenyakitResponse
	if err := s.cache.Get(ctx, cacheKey, &cached); err == nil {
		return &cached, nil
	}

	entity, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	response := s.mapToResponse(entity)
	s.cache.Set(ctx, cacheKey, response, 5*time.Minute)
	return response, nil
}

func (s *medicpediapenyakitService) GetBySlug(ctx context.Context, slug string) (*dto.MedicpediaPenyakitResponse, error) {
	cacheKey := fmt.Sprintf("medicpedia_penyakit_slug:%s", slug)
	var cached dto.MedicpediaPenyakitResponse
	if err := s.cache.Get(ctx, cacheKey, &cached); err == nil {
		return &cached, nil
	}

	entity, err := s.repo.FindBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}

	response := s.mapToResponse(entity)
	s.cache.Set(ctx, cacheKey, response, 5*time.Minute)
	return response, nil
}

func (s *medicpediapenyakitService) GetPublicAll(ctx context.Context, pagination *defaultDto.PaginationRequest) (*defaultDto.PaginationResponse, error) {
	cacheKey := fmt.Sprintf("medicpedia_penyakit_public:page:%d:limit:%d:search:%s", pagination.GetPage(), pagination.GetLimit(), pagination.Search)
	var cached defaultDto.PaginationResponse
	if err := s.cache.Get(ctx, cacheKey, &cached); err == nil {
		return &cached, nil
	}

	entities, total, err := s.repo.FindPublicAll(ctx, pagination)
	if err != nil {
		return nil, err
	}

	var responses []dto.MedicpediaPenyakitResponse
	for _, e := range entities {
		responses = append(responses, *s.mapToResponse(&e))
	}

	response := &defaultDto.PaginationResponse{
		Data: responses,
		Meta: defaultDto.PaginationMeta{
			CurrentPage: pagination.GetPage(),
			TotalPages:  int(math.Ceil(float64(total) / float64(pagination.GetLimit()))),
			TotalData:   total,
			Limit:       pagination.GetLimit(),
		},
	}

	s.cache.Set(ctx, cacheKey, response, 5*time.Minute)
	return response, nil
}

func (s *medicpediapenyakitService) Update(ctx context.Context, id uint, req dto.UpdateMedicpediaPenyakitRequest) (*dto.MedicpediaPenyakitResponse, error) {
	entity, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if req.Name != "" {
		entity.Name = req.Name
	}
	if req.Slug != "" {
		entity.Slug = req.Slug
	}
	if req.Image != "" {
		entity.Image = req.Image
	}
	entity.Description = req.Description
	entity.Causes = req.Causes
	entity.FactorsSymptoms = req.FactorsSymptoms
	entity.Diagnosis = req.Diagnosis
	entity.WhenToSeeDoctor = req.WhenToSeeDoctor
	entity.Prevention = req.Prevention
	entity.Status = req.Status

	if err := s.repo.Update(ctx, entity); err != nil {
		return nil, err
	}

	s.cache.Delete(ctx, fmt.Sprintf("medicpedia_penyakit:%d", id))
	s.cache.DeletePattern(ctx, "medicpedia_penyakit:*")

	
	logger.AuditLogger.Info().
		Uint("medicpediapenyakit_id", entity.ID).
		Str("action", "medicpediapenyakit_update").
		Msg("medicpediapenyakit updated")
	

	return s.mapToResponse(entity), nil
}

func (s *medicpediapenyakitService) Delete(ctx context.Context, id uint) error {
	s.cache.Delete(ctx, fmt.Sprintf("medicpedia_penyakit:%d", id))
	s.cache.DeletePattern(ctx, "medicpedia_penyakit:*")

	
	logger.AuditLogger.Info().
		Uint("medicpediapenyakit_id", id).
		Str("action", "medicpediapenyakit_deletion").
		Msg("medicpediapenyakit deleted")
	

	return s.repo.Delete(ctx, id)
}

func (s *medicpediapenyakitService) Export(ctx context.Context, format string) ([]byte, error) {
	pagination := &defaultDto.PaginationRequest{
		Page:  1,
		Limit: 1000000,
	}

	entities, _, err := s.repo.FindAll(ctx, pagination)
	if err != nil {
		return nil, err
	}

	if format == "csv" {
		return s.generateCSV(entities)
	}
	return s.generateExcel(entities)
}

func (s *medicpediapenyakitService) generateCSV(entities []entity.MedicpediaPenyakit) ([]byte, error) {
	var buf bytes.Buffer
	writer := csv.NewWriter(&buf)

	header := []string{"ID", "Name", "Slug", "Image", "Description", "Causes", "FactorsSymptoms", "Diagnosis", "WhenToSeeDoctor", "Prevention", "Status", "Created At"}
	writer.Write(header)

	for _, e := range entities {
		row := []string{
			fmt.Sprintf("%d", e.ID),
			fmt.Sprintf("%v", e.Name),
			fmt.Sprintf("%v", e.Slug),
			fmt.Sprintf("%v", e.Image),
			fmt.Sprintf("%v", e.Description),
			fmt.Sprintf("%v", e.Causes),
			fmt.Sprintf("%v", e.FactorsSymptoms),
			fmt.Sprintf("%v", e.Diagnosis),
			fmt.Sprintf("%v", e.WhenToSeeDoctor),
			fmt.Sprintf("%v", e.Prevention),
			fmt.Sprintf("%v", e.Status),
			e.CreatedAt.Format("2006-01-02 15:04:05"),
		}
		writer.Write(row)
	}

	writer.Flush()
	return buf.Bytes(), nil
}

func (s *medicpediapenyakitService) generateExcel(entities []entity.MedicpediaPenyakit) ([]byte, error) {
	f := excelize.NewFile()
	sheet := "Sheet1"
	f.SetSheetName("Sheet1", sheet)

	header := []string{"ID", "Name", "Slug", "Image", "Description", "Causes", "FactorsSymptoms", "Diagnosis", "WhenToSeeDoctor", "Prevention", "Status", "Created At"}
	for i, h := range header {
		cell, _ := excelize.CoordinatesToCellName(i+1, 1)
		f.SetCellValue(sheet, cell, h)
	}

	for i, e := range entities {
		rowNum := i + 2
		f.SetCellValue(sheet, fmt.Sprintf("A%d", rowNum), e.ID)
		
		var cell string
		cell, _ = excelize.CoordinatesToCellName(0+2, rowNum)
		f.SetCellValue(sheet, cell, e.Name)
		cell, _ = excelize.CoordinatesToCellName(1+2, rowNum)
		f.SetCellValue(sheet, cell, e.Slug)
		cell, _ = excelize.CoordinatesToCellName(2+2, rowNum)
		f.SetCellValue(sheet, cell, e.Image)
		cell, _ = excelize.CoordinatesToCellName(3+2, rowNum)
		f.SetCellValue(sheet, cell, e.Description)
		cell, _ = excelize.CoordinatesToCellName(4+2, rowNum)
		f.SetCellValue(sheet, cell, e.Causes)
		cell, _ = excelize.CoordinatesToCellName(5+2, rowNum)
		f.SetCellValue(sheet, cell, e.FactorsSymptoms)
		cell, _ = excelize.CoordinatesToCellName(6+2, rowNum)
		f.SetCellValue(sheet, cell, e.Diagnosis)
		cell, _ = excelize.CoordinatesToCellName(7+2, rowNum)
		f.SetCellValue(sheet, cell, e.WhenToSeeDoctor)
		cell, _ = excelize.CoordinatesToCellName(8+2, rowNum)
		f.SetCellValue(sheet, cell, e.Prevention)
		cell, _ = excelize.CoordinatesToCellName(9+2, rowNum)
		f.SetCellValue(sheet, cell, e.Status)
		
		lastCell, _ := excelize.CoordinatesToCellName(len(header), rowNum)
		f.SetCellValue(sheet, lastCell, e.CreatedAt.Format("2006-01-02 15:04:05"))
	}

	buf, err := f.WriteToBuffer()
	if err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func (s *medicpediapenyakitService) mapToResponse(entity *entity.MedicpediaPenyakit) *dto.MedicpediaPenyakitResponse {
	return &dto.MedicpediaPenyakitResponse{
		ID:        entity.ID,
		Name: entity.Name,
		Slug: entity.Slug,
		Image: entity.Image,
		Description: entity.Description,
		Causes: entity.Causes,
		FactorsSymptoms: entity.FactorsSymptoms,
		Diagnosis: entity.Diagnosis,
		WhenToSeeDoctor: entity.WhenToSeeDoctor,
		Prevention: entity.Prevention,
		Status: entity.Status,
		CreatedAt: entity.CreatedAt,
		UpdatedAt: entity.UpdatedAt,
	}
}
