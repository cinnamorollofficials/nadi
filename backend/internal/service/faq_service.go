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

type FaqService interface {
	Create(ctx context.Context, req dto.CreateFaqRequest) (*dto.FaqResponse, error)
	GetAll(ctx context.Context, pagination *defaultDto.PaginationRequest) (*defaultDto.PaginationResponse, error)
	GetByID(ctx context.Context, id uint) (*dto.FaqResponse, error)
	Update(ctx context.Context, id uint, req dto.UpdateFaqRequest) (*dto.FaqResponse, error)
	Delete(ctx context.Context, id uint) error
	Export(ctx context.Context, format string) ([]byte, error)
}

type faqService struct {
	repo  repository.FaqRepository
	cache cache.CacheService
}

func NewFaqService(repo repository.FaqRepository, cache cache.CacheService) FaqService {
	return &faqService{
		repo:  repo,
		cache: cache,
	}
}

func (s *faqService) Create(ctx context.Context, req dto.CreateFaqRequest) (*dto.FaqResponse, error) {
	entity := &entity.Faq{
		Question: req.Question,
		Answer:   req.Answer,
		Category: req.Category,
		Status:   req.Status,
	}

	if err := s.repo.Create(ctx, entity); err != nil {
		return nil, err
	}

	s.cache.DeletePattern(ctx, "faqs:*")

	
	logger.AuditLogger.Info().
		Uint("faq_id", entity.ID).
		Str("action", "faq_creation").
		Msg("faq created")
	

	return s.mapToResponse(entity), nil
}

func (s *faqService) GetAll(ctx context.Context, pagination *defaultDto.PaginationRequest) (*defaultDto.PaginationResponse, error) {
	cacheKey := fmt.Sprintf("faqs:page:%d:limit:%d:search:%s", pagination.GetPage(), pagination.GetLimit(), pagination.Search)
	var cached defaultDto.PaginationResponse
	if err := s.cache.Get(ctx, cacheKey, &cached); err == nil {
		return &cached, nil
	}

	entities, total, err := s.repo.FindAll(ctx, pagination)
	if err != nil {
		return nil, err
	}

	var responses []dto.FaqResponse
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

func (s *faqService) GetByID(ctx context.Context, id uint) (*dto.FaqResponse, error) {
	cacheKey := fmt.Sprintf("faqs:%d", id)
	var cached dto.FaqResponse
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

func (s *faqService) Update(ctx context.Context, id uint, req dto.UpdateFaqRequest) (*dto.FaqResponse, error) {
	entity, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if req.Question != "" {
		entity.Question = req.Question
	}
	entity.Answer = req.Answer
	entity.Category = req.Category
	entity.Status = req.Status

	if err := s.repo.Update(ctx, entity); err != nil {
		return nil, err
	}

	s.cache.Delete(ctx, fmt.Sprintf("faqs:%d", id))
	s.cache.DeletePattern(ctx, "faqs:*")

	
	logger.AuditLogger.Info().
		Uint("faq_id", entity.ID).
		Str("action", "faq_update").
		Msg("faq updated")
	

	return s.mapToResponse(entity), nil
}

func (s *faqService) Delete(ctx context.Context, id uint) error {
	s.cache.Delete(ctx, fmt.Sprintf("faqs:%d", id))
	s.cache.DeletePattern(ctx, "faqs:*")

	
	logger.AuditLogger.Info().
		Uint("faq_id", id).
		Str("action", "faq_deletion").
		Msg("faq deleted")
	

	return s.repo.Delete(ctx, id)
}

func (s *faqService) Export(ctx context.Context, format string) ([]byte, error) {
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

func (s *faqService) generateCSV(entities []entity.Faq) ([]byte, error) {
	var buf bytes.Buffer
	writer := csv.NewWriter(&buf)

	header := []string{"ID", "Question", "Answer", "Status", "Created At"}
	writer.Write(header)

	for _, e := range entities {
		row := []string{
			fmt.Sprintf("%d", e.ID),
			fmt.Sprintf("%v", e.Question),
			fmt.Sprintf("%v", e.Answer),
			fmt.Sprintf("%v", e.Status),
			e.CreatedAt.Format("2006-01-02 15:04:05"),
		}
		writer.Write(row)
	}

	writer.Flush()
	return buf.Bytes(), nil
}

func (s *faqService) generateExcel(entities []entity.Faq) ([]byte, error) {
	f := excelize.NewFile()
	sheet := "Sheet1"
	f.SetSheetName("Sheet1", sheet)

	header := []string{"ID", "Question", "Answer", "Status", "Created At"}
	for i, h := range header {
		cell, _ := excelize.CoordinatesToCellName(i+1, 1)
		f.SetCellValue(sheet, cell, h)
	}

	for i, e := range entities {
		rowNum := i + 2
		f.SetCellValue(sheet, fmt.Sprintf("A%d", rowNum), e.ID)
		
		var cell string
		cell, _ = excelize.CoordinatesToCellName(0+2, rowNum)
		f.SetCellValue(sheet, cell, e.Question)
		cell, _ = excelize.CoordinatesToCellName(1+2, rowNum)
		f.SetCellValue(sheet, cell, e.Answer)
		cell, _ = excelize.CoordinatesToCellName(2+2, rowNum)
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

func (s *faqService) mapToResponse(entity *entity.Faq) *dto.FaqResponse {
	return &dto.FaqResponse{
		ID:        entity.ID,
		Question: entity.Question,
		Answer:   entity.Answer,
		Category: entity.Category,
		Status:   entity.Status,
		CreatedAt: entity.CreatedAt,
		UpdatedAt: entity.UpdatedAt,
	}
}
