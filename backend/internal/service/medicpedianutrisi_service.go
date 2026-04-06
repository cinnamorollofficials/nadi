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

type MedicpediaNutrisiService interface {
	Create(ctx context.Context, req dto.CreateMedicpediaNutrisiRequest) (*dto.MedicpediaNutrisiResponse, error)
	GetAll(ctx context.Context, pagination *defaultDto.PaginationRequest) (*defaultDto.PaginationResponse, error)
	GetPublicAll(ctx context.Context, pagination *defaultDto.PaginationRequest) (*defaultDto.PaginationResponse, error)
	GetByID(ctx context.Context, id uint) (*dto.MedicpediaNutrisiResponse, error)
	GetBySlug(ctx context.Context, slug string) (*dto.MedicpediaNutrisiResponse, error)
	Update(ctx context.Context, id uint, req dto.UpdateMedicpediaNutrisiRequest) (*dto.MedicpediaNutrisiResponse, error)
	Delete(ctx context.Context, id uint) error
	Export(ctx context.Context, format string) ([]byte, error)
}

type medicpedianutrisiService struct {
	repo  repository.MedicpediaNutrisiRepository
	cache cache.CacheService
}

func NewMedicpediaNutrisiService(repo repository.MedicpediaNutrisiRepository, cache cache.CacheService) MedicpediaNutrisiService {
	return &medicpedianutrisiService{
		repo:  repo,
		cache: cache,
	}
}

func (s *medicpedianutrisiService) Create(ctx context.Context, req dto.CreateMedicpediaNutrisiRequest) (*dto.MedicpediaNutrisiResponse, error) {
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

	if err := s.repo.Create(ctx, entity); err != nil {
		return nil, err
	}

	s.cache.DeletePattern(ctx, "medicpedia_nutrisi:*")

	
	logger.AuditLogger.Info().
		Uint("medicpedianutrisi_id", entity.ID).
		Str("action", "medicpedianutrisi_creation").
		Msg("medicpedianutrisi created")
	

	return s.mapToResponse(entity), nil
}

func (s *medicpedianutrisiService) GetAll(ctx context.Context, pagination *defaultDto.PaginationRequest) (*defaultDto.PaginationResponse, error) {
	cacheKey := fmt.Sprintf("medicpedia_nutrisi:page:%d:limit:%d:search:%s", pagination.GetPage(), pagination.GetLimit(), pagination.Search)
	var cached defaultDto.PaginationResponse
	if err := s.cache.Get(ctx, cacheKey, &cached); err == nil {
		return &cached, nil
	}

	entities, total, err := s.repo.FindAll(ctx, pagination)
	if err != nil {
		return nil, err
	}

	var responses []dto.MedicpediaNutrisiResponse
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

func (s *medicpedianutrisiService) GetByID(ctx context.Context, id uint) (*dto.MedicpediaNutrisiResponse, error) {
	cacheKey := fmt.Sprintf("medicpedia_nutrisi:%d", id)
	var cached dto.MedicpediaNutrisiResponse
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

func (s *medicpedianutrisiService) GetBySlug(ctx context.Context, slug string) (*dto.MedicpediaNutrisiResponse, error) {
	cacheKey := fmt.Sprintf("medicpedia_nutrisi_slug:%s", slug)
	var cached dto.MedicpediaNutrisiResponse
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

func (s *medicpedianutrisiService) GetPublicAll(ctx context.Context, pagination *defaultDto.PaginationRequest) (*defaultDto.PaginationResponse, error) {
	cacheKey := fmt.Sprintf("medicpedia_nutrisi_public:page:%d:limit:%d:search:%s", pagination.GetPage(), pagination.GetLimit(), pagination.Search)
	var cached defaultDto.PaginationResponse
	if err := s.cache.Get(ctx, cacheKey, &cached); err == nil {
		return &cached, nil
	}

	entities, total, err := s.repo.FindPublicAll(ctx, pagination)
	if err != nil {
		return nil, err
	}

	var responses []dto.MedicpediaNutrisiResponse
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


func (s *medicpedianutrisiService) Update(ctx context.Context, id uint, req dto.UpdateMedicpediaNutrisiRequest) (*dto.MedicpediaNutrisiResponse, error) {
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
	entity.Benefits = req.Benefits
	entity.Sources = req.Sources
	entity.DailyNeeds = req.DailyNeeds
	entity.RisksDeficiency = req.RisksDeficiency
	entity.Status = req.Status

	if err := s.repo.Update(ctx, entity); err != nil {
		return nil, err
	}

	s.cache.Delete(ctx, fmt.Sprintf("medicpedia_nutrisi:%d", id))
	s.cache.DeletePattern(ctx, "medicpedia_nutrisi:*")

	
	logger.AuditLogger.Info().
		Uint("medicpedianutrisi_id", entity.ID).
		Str("action", "medicpedianutrisi_update").
		Msg("medicpedianutrisi updated")
	

	return s.mapToResponse(entity), nil
}

func (s *medicpedianutrisiService) Delete(ctx context.Context, id uint) error {
	s.cache.Delete(ctx, fmt.Sprintf("medicpedia_nutrisi:%d", id))
	s.cache.DeletePattern(ctx, "medicpedia_nutrisi:*")

	
	logger.AuditLogger.Info().
		Uint("medicpedianutrisi_id", id).
		Str("action", "medicpedianutrisi_deletion").
		Msg("medicpedianutrisi deleted")
	

	return s.repo.Delete(ctx, id)
}

func (s *medicpedianutrisiService) Export(ctx context.Context, format string) ([]byte, error) {
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

func (s *medicpedianutrisiService) generateCSV(entities []entity.MedicpediaNutrisi) ([]byte, error) {
	var buf bytes.Buffer
	writer := csv.NewWriter(&buf)

	header := []string{"ID", "Name", "Slug", "Image", "Description", "Benefits", "Sources", "DailyNeeds", "RisksDeficiency", "Status", "Created At"}
	writer.Write(header)

	for _, e := range entities {
		row := []string{
			fmt.Sprintf("%d", e.ID),
			fmt.Sprintf("%v", e.Name),
			fmt.Sprintf("%v", e.Slug),
			fmt.Sprintf("%v", e.Image),
			fmt.Sprintf("%v", e.Description),
			fmt.Sprintf("%v", e.Benefits),
			fmt.Sprintf("%v", e.Sources),
			fmt.Sprintf("%v", e.DailyNeeds),
			fmt.Sprintf("%v", e.RisksDeficiency),
			fmt.Sprintf("%v", e.Status),
			e.CreatedAt.Format("2006-01-02 15:04:05"),
		}
		writer.Write(row)
	}

	writer.Flush()
	return buf.Bytes(), nil
}

func (s *medicpedianutrisiService) generateExcel(entities []entity.MedicpediaNutrisi) ([]byte, error) {
	f := excelize.NewFile()
	sheet := "Sheet1"
	f.SetSheetName("Sheet1", sheet)

	header := []string{"ID", "Name", "Slug", "Image", "Description", "Benefits", "Sources", "DailyNeeds", "RisksDeficiency", "Status", "Created At"}
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
		f.SetCellValue(sheet, cell, e.Benefits)
		cell, _ = excelize.CoordinatesToCellName(5+2, rowNum)
		f.SetCellValue(sheet, cell, e.Sources)
		cell, _ = excelize.CoordinatesToCellName(6+2, rowNum)
		f.SetCellValue(sheet, cell, e.DailyNeeds)
		cell, _ = excelize.CoordinatesToCellName(7+2, rowNum)
		f.SetCellValue(sheet, cell, e.RisksDeficiency)
		cell, _ = excelize.CoordinatesToCellName(8+2, rowNum)
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

func (s *medicpedianutrisiService) mapToResponse(entity *entity.MedicpediaNutrisi) *dto.MedicpediaNutrisiResponse {
	return &dto.MedicpediaNutrisiResponse{
		ID:        entity.ID,
		Name: entity.Name,
		Slug: entity.Slug,
		Image: entity.Image,
		Description: entity.Description,
		Benefits: entity.Benefits,
		Sources: entity.Sources,
		DailyNeeds: entity.DailyNeeds,
		RisksDeficiency: entity.RisksDeficiency,
		Status: entity.Status,
		CreatedAt: entity.CreatedAt,
		UpdatedAt: entity.UpdatedAt,
	}
}
