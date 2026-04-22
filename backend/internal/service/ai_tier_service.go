package service

import (
	"context"
	"fmt"
	"math"

	dto "github.com/hadi-projects/go-react-starter/internal/dto/default"
	entity "github.com/hadi-projects/go-react-starter/internal/entity/default"
	"github.com/hadi-projects/go-react-starter/internal/repository"
	"github.com/hadi-projects/go-react-starter/pkg/cache"
	"github.com/hadi-projects/go-react-starter/pkg/logger"
)

type AiTierService interface {
	Create(ctx context.Context, req dto.CreateAiTierRequest) (*dto.AiTierResponse, error)
	GetAll(ctx context.Context, pagination *dto.PaginationRequest) (*dto.PaginationResponse, error)
	GetByID(ctx context.Context, id uint) (*dto.AiTierResponse, error)
	Update(ctx context.Context, id uint, req dto.UpdateAiTierRequest) (*dto.AiTierResponse, error)
	Delete(ctx context.Context, id uint) error
}

type aiTierService struct {
	aiTierRepo repository.AiTierRepository
	cache      cache.CacheService
}

func NewAiTierService(aiTierRepo repository.AiTierRepository, cache cache.CacheService) AiTierService {
	return &aiTierService{aiTierRepo: aiTierRepo, cache: cache}
}

func (s *aiTierService) Create(ctx context.Context, req dto.CreateAiTierRequest) (*dto.AiTierResponse, error) {
	if req.IsDefault {
		s.aiTierRepo.ResetDefaults(ctx)
	}

	tier := &entity.AiTier{
		Name:        req.Name,
		DailyLimit:  req.DailyLimit,
		Description: req.Description,
		IsDefault:   req.IsDefault,
	}

	if err := s.aiTierRepo.Create(ctx, tier); err != nil {
		return nil, err
	}

	s.cache.DeletePattern(ctx, "ai-tiers:*")
	logger.LogAudit(ctx, "CREATE", "AI_TIER", fmt.Sprintf("%d", tier.ID), tier.Name)

	return s.mapToResponse(tier), nil
}

func (s *aiTierService) GetAll(ctx context.Context, pagination *dto.PaginationRequest) (*dto.PaginationResponse, error) {
	tiers, total, err := s.aiTierRepo.FindAll(ctx, pagination)
	if err != nil {
		return nil, err
	}

	var responses []dto.AiTierResponse
	for _, t := range tiers {
		responses = append(responses, *s.mapToResponse(&t))
	}

	return &dto.PaginationResponse{
		Data: responses,
		Meta: dto.PaginationMeta{
			CurrentPage: pagination.GetPage(),
			TotalPages:  int(math.Ceil(float64(total) / float64(pagination.GetLimit()))),
			TotalData:   total,
			Limit:       pagination.GetLimit(),
		},
	}, nil
}

func (s *aiTierService) GetByID(ctx context.Context, id uint) (*dto.AiTierResponse, error) {
	tier, err := s.aiTierRepo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return s.mapToResponse(tier), nil
}

func (s *aiTierService) Update(ctx context.Context, id uint, req dto.UpdateAiTierRequest) (*dto.AiTierResponse, error) {
	tier, err := s.aiTierRepo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if req.IsDefault && !tier.IsDefault {
		s.aiTierRepo.ResetDefaults(ctx)
	}

	if req.Name != "" {
		tier.Name = req.Name
	}
	if req.DailyLimit != 0 {
		tier.DailyLimit = req.DailyLimit
	}
	tier.Description = req.Description
	tier.IsDefault = req.IsDefault

	if err := s.aiTierRepo.Update(ctx, tier); err != nil {
		return nil, err
	}

	s.cache.DeletePattern(ctx, "ai-tiers:*")
	s.cache.DeletePattern(ctx, "users:*") // Limits might have changed
	logger.LogAudit(ctx, "UPDATE", "AI_TIER", fmt.Sprintf("%d", id), tier.Name)

	return s.mapToResponse(tier), nil
}

func (s *aiTierService) Delete(ctx context.Context, id uint) error {
	tier, err := s.aiTierRepo.FindByID(ctx, id)
	if err != nil {
		return err
	}

	if tier.IsDefault {
		return fmt.Errorf("cannot delete default tier")
	}

	s.cache.DeletePattern(ctx, "ai-tiers:*")
	logger.LogAudit(ctx, "DELETE", "AI_TIER", fmt.Sprintf("%d", id), "")
	return s.aiTierRepo.Delete(ctx, id)
}

func (s *aiTierService) mapToResponse(tier *entity.AiTier) *dto.AiTierResponse {
	return &dto.AiTierResponse{
		ID:          tier.ID,
		Name:        tier.Name,
		DailyLimit:  tier.DailyLimit,
		Description: tier.Description,
		IsDefault:   tier.IsDefault,
		CreatedAt:   tier.CreatedAt,
		UpdatedAt:   tier.UpdatedAt,
	}
}
