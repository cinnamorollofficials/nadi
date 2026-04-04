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

type BlogPostService interface {
	Create(ctx context.Context, req dto.CreateBlogPostRequest) (*dto.BlogPostResponse, error)
	GetAll(ctx context.Context, pagination *defaultDto.PaginationRequest) (*defaultDto.PaginationResponse, error)
	GetByID(ctx context.Context, id uint) (*dto.BlogPostResponse, error)
	Update(ctx context.Context, id uint, req dto.UpdateBlogPostRequest) (*dto.BlogPostResponse, error)
	Delete(ctx context.Context, id uint) error
	Export(ctx context.Context, format string) ([]byte, error)
}

type blogpostService struct {
	repo  repository.BlogPostRepository
	cache cache.CacheService
}

func NewBlogPostService(repo repository.BlogPostRepository, cache cache.CacheService) BlogPostService {
	return &blogpostService{
		repo:  repo,
		cache: cache,
	}
}

func (s *blogpostService) Create(ctx context.Context, req dto.CreateBlogPostRequest) (*dto.BlogPostResponse, error) {
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

	if err := s.repo.Create(ctx, entity); err != nil {
		return nil, err
	}

	s.cache.DeletePattern(ctx, "blogposts:*")

	
	logger.AuditLogger.Info().
		Uint("blogpost_id", entity.ID).
		Str("action", "blogpost_creation").
		Msg("blogpost created")
	

	return s.mapToResponse(entity), nil
}

func (s *blogpostService) GetAll(ctx context.Context, pagination *defaultDto.PaginationRequest) (*defaultDto.PaginationResponse, error) {
	cacheKey := fmt.Sprintf("blogposts:page:%d:limit:%d:search:%s", pagination.GetPage(), pagination.GetLimit(), pagination.Search)
	var cached defaultDto.PaginationResponse
	if err := s.cache.Get(ctx, cacheKey, &cached); err == nil {
		return &cached, nil
	}

	entities, total, err := s.repo.FindAll(ctx, pagination)
	if err != nil {
		return nil, err
	}

	var responses []dto.BlogPostResponse
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

func (s *blogpostService) GetByID(ctx context.Context, id uint) (*dto.BlogPostResponse, error) {
	cacheKey := fmt.Sprintf("blogposts:%d", id)
	var cached dto.BlogPostResponse
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

func (s *blogpostService) Update(ctx context.Context, id uint, req dto.UpdateBlogPostRequest) (*dto.BlogPostResponse, error) {
	entity, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if req.Title != "" {
		entity.Title = req.Title
	}
	if req.Slug != "" {
		entity.Slug = req.Slug
	}
	if req.Summary != "" {
		entity.Summary = req.Summary
	}
	entity.Content = req.Content
	if req.Author != "" {
		entity.Author = req.Author
	}
	if req.Category != "" {
		entity.Category = req.Category
	}
	entity.Status = req.Status
	entity.Image = req.Image
	entity.PublishedAt = req.PublishedAt

	if err := s.repo.Update(ctx, entity); err != nil {
		return nil, err
	}

	s.cache.Delete(ctx, fmt.Sprintf("blogposts:%d", id))
	s.cache.DeletePattern(ctx, "blogposts:*")

	
	logger.AuditLogger.Info().
		Uint("blogpost_id", entity.ID).
		Str("action", "blogpost_update").
		Msg("blogpost updated")
	

	return s.mapToResponse(entity), nil
}

func (s *blogpostService) Delete(ctx context.Context, id uint) error {
	s.cache.Delete(ctx, fmt.Sprintf("blogposts:%d", id))
	s.cache.DeletePattern(ctx, "blogposts:*")

	
	logger.AuditLogger.Info().
		Uint("blogpost_id", id).
		Str("action", "blogpost_deletion").
		Msg("blogpost deleted")
	

	return s.repo.Delete(ctx, id)
}

func (s *blogpostService) Export(ctx context.Context, format string) ([]byte, error) {
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

func (s *blogpostService) generateCSV(entities []entity.BlogPost) ([]byte, error) {
	var buf bytes.Buffer
	writer := csv.NewWriter(&buf)

	header := []string{"ID", "Title", "Slug", "Summary", "Content", "Author", "Category", "Status", "Image", "PublishedAt", "Created At"}
	writer.Write(header)

	for _, e := range entities {
		row := []string{
			fmt.Sprintf("%d", e.ID),
			fmt.Sprintf("%v", e.Title),
			fmt.Sprintf("%v", e.Slug),
			fmt.Sprintf("%v", e.Summary),
			fmt.Sprintf("%v", e.Content),
			fmt.Sprintf("%v", e.Author),
			fmt.Sprintf("%v", e.Category),
			fmt.Sprintf("%v", e.Status),
			fmt.Sprintf("%v", e.Image),
			fmt.Sprintf("%v", e.PublishedAt),
			e.CreatedAt.Format("2006-01-02 15:04:05"),
		}
		writer.Write(row)
	}

	writer.Flush()
	return buf.Bytes(), nil
}

func (s *blogpostService) generateExcel(entities []entity.BlogPost) ([]byte, error) {
	f := excelize.NewFile()
	sheet := "Sheet1"
	f.SetSheetName("Sheet1", sheet)

	header := []string{"ID", "Title", "Slug", "Summary", "Content", "Author", "Category", "Status", "Image", "PublishedAt", "Created At"}
	for i, h := range header {
		cell, _ := excelize.CoordinatesToCellName(i+1, 1)
		f.SetCellValue(sheet, cell, h)
	}

	for i, e := range entities {
		rowNum := i + 2
		f.SetCellValue(sheet, fmt.Sprintf("A%d", rowNum), e.ID)
		
		var cell string
		cell, _ = excelize.CoordinatesToCellName(0+2, rowNum)
		f.SetCellValue(sheet, cell, e.Title)
		cell, _ = excelize.CoordinatesToCellName(1+2, rowNum)
		f.SetCellValue(sheet, cell, e.Slug)
		cell, _ = excelize.CoordinatesToCellName(2+2, rowNum)
		f.SetCellValue(sheet, cell, e.Summary)
		cell, _ = excelize.CoordinatesToCellName(3+2, rowNum)
		f.SetCellValue(sheet, cell, e.Content)
		cell, _ = excelize.CoordinatesToCellName(4+2, rowNum)
		f.SetCellValue(sheet, cell, e.Author)
		cell, _ = excelize.CoordinatesToCellName(5+2, rowNum)
		f.SetCellValue(sheet, cell, e.Category)
		cell, _ = excelize.CoordinatesToCellName(6+2, rowNum)
		f.SetCellValue(sheet, cell, e.Status)
		cell, _ = excelize.CoordinatesToCellName(7+2, rowNum)
		f.SetCellValue(sheet, cell, e.Image)
		cell, _ = excelize.CoordinatesToCellName(8+2, rowNum)
		f.SetCellValue(sheet, cell, e.PublishedAt)
		
		lastCell, _ := excelize.CoordinatesToCellName(len(header), rowNum)
		f.SetCellValue(sheet, lastCell, e.CreatedAt.Format("2006-01-02 15:04:05"))
	}

	buf, err := f.WriteToBuffer()
	if err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func (s *blogpostService) mapToResponse(entity *entity.BlogPost) *dto.BlogPostResponse {
	return &dto.BlogPostResponse{
		ID:        entity.ID,
		Title: entity.Title,
		Slug: entity.Slug,
		Summary: entity.Summary,
		Content: entity.Content,
		Author: entity.Author,
		Category: entity.Category,
		Status: entity.Status,
		Image: entity.Image,
		PublishedAt: entity.PublishedAt,
		CreatedAt: entity.CreatedAt,
		UpdatedAt: entity.UpdatedAt,
	}
}
