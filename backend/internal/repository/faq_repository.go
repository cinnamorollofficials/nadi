package repository

import (
	"context"
	defaultDto "github.com/hadi-projects/go-react-starter/internal/dto/default"
	"github.com/hadi-projects/go-react-starter/internal/entity"
	"gorm.io/gorm"
)

type FaqRepository interface {
	Create(ctx context.Context, entity *entity.Faq) error
	FindAll(ctx context.Context, pagination *defaultDto.PaginationRequest) ([]entity.Faq, int64, error)
	FindByID(ctx context.Context, id uint) (*entity.Faq, error)
	Update(ctx context.Context, entity *entity.Faq) error
	Delete(ctx context.Context, id uint) error
}

type faqRepository struct {
	db *gorm.DB
}

func NewFaqRepository(db *gorm.DB) FaqRepository {
	return &faqRepository{db: db}
}

func (r *faqRepository) Create(ctx context.Context, entity *entity.Faq) error {
	return r.db.WithContext(ctx).Create(entity).Error
}

func (r *faqRepository) FindAll(ctx context.Context, pagination *defaultDto.PaginationRequest) ([]entity.Faq, int64, error) {
	var entities []entity.Faq
	var total int64

	query := r.db.WithContext(ctx).Model(&entity.Faq{})

	
	if pagination.Search != "" {
		query = query.Where("question LIKE ?", "%"+pagination.Search+"%")
		query = query.Or("answer LIKE ?", "%"+pagination.Search+"%")
		query = query.Or("status LIKE ?", "%"+pagination.Search+"%")
	}
	

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (pagination.GetPage() - 1) * pagination.GetLimit()
	err := query.Order("id DESC").
		Limit(pagination.GetLimit()).
		Offset(offset).
		Find(&entities).Error

	return entities, total, err
}

func (r *faqRepository) FindByID(ctx context.Context, id uint) (*entity.Faq, error) {
	var entity entity.Faq
	err := r.db.WithContext(ctx).First(&entity, id).Error
	if err != nil {
		return nil, err
	}
	return &entity, nil
}

func (r *faqRepository) Update(ctx context.Context, entity *entity.Faq) error {
	return r.db.WithContext(ctx).Save(entity).Error
}

func (r *faqRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&entity.Faq{}, id).Error
}
