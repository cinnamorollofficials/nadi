package repository

import (
	"context"
	dto "github.com/hadi-projects/go-react-starter/internal/dto/default"
	entity "github.com/hadi-projects/go-react-starter/internal/entity/default"
	"gorm.io/gorm"
)

type AiTierRepository interface {
	Create(ctx context.Context, tier *entity.AiTier) error
	FindAll(ctx context.Context, pagination *dto.PaginationRequest) ([]entity.AiTier, int64, error)
	FindByID(ctx context.Context, id uint) (*entity.AiTier, error)
	FindDefault(ctx context.Context) (*entity.AiTier, error)
	Update(ctx context.Context, tier *entity.AiTier) error
	Delete(ctx context.Context, id uint) error
	ResetDefaults(ctx context.Context) error
}

type aiTierRepository struct {
	db *gorm.DB
}

func NewAiTierRepository(db *gorm.DB) AiTierRepository {
	return &aiTierRepository{db: db}
}

func (r *aiTierRepository) Create(ctx context.Context, tier *entity.AiTier) error {
	return r.db.WithContext(ctx).Create(tier).Error
}

func (r *aiTierRepository) FindAll(ctx context.Context, pagination *dto.PaginationRequest) ([]entity.AiTier, int64, error) {
	var tiers []entity.AiTier
	var total int64

	query := r.db.WithContext(ctx).Model(&entity.AiTier{})
	if pagination.Search != "" {
		query = query.Where("name LIKE ?", "%"+pagination.Search+"%")
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = query.Offset(pagination.GetOffset()).Limit(pagination.GetLimit()).Find(&tiers).Error
	return tiers, total, err
}

func (r *aiTierRepository) FindByID(ctx context.Context, id uint) (*entity.AiTier, error) {
	var tier entity.AiTier
	err := r.db.WithContext(ctx).First(&tier, id).Error
	return &tier, err
}

func (r *aiTierRepository) FindDefault(ctx context.Context) (*entity.AiTier, error) {
	var tier entity.AiTier
	err := r.db.WithContext(ctx).Where("is_default = ?", true).First(&tier).Error
	return &tier, err
}

func (r *aiTierRepository) Update(ctx context.Context, tier *entity.AiTier) error {
	return r.db.WithContext(ctx).Save(tier).Error
}

func (r *aiTierRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&entity.AiTier{}, id).Error
}

func (r *aiTierRepository) ResetDefaults(ctx context.Context) error {
	return r.db.WithContext(ctx).Model(&entity.AiTier{}).Where("is_default = ?", true).Update("is_default", false).Error
}
