package repository

import (
	"context"
	defaultDto "github.com/hadi-projects/go-react-starter/internal/dto/default"
	"github.com/hadi-projects/go-react-starter/internal/entity"
	"gorm.io/gorm"
)

type MedicpediaNutrisiRepository interface {
	Create(ctx context.Context, entity *entity.MedicpediaNutrisi) error
	FindAll(ctx context.Context, pagination *defaultDto.PaginationRequest) ([]entity.MedicpediaNutrisi, int64, error)
	FindPublicAll(ctx context.Context, pagination *defaultDto.PaginationRequest) ([]entity.MedicpediaNutrisi, int64, error)
	FindByID(ctx context.Context, id uint) (*entity.MedicpediaNutrisi, error)
	FindBySlug(ctx context.Context, slug string) (*entity.MedicpediaNutrisi, error)
	Update(ctx context.Context, entity *entity.MedicpediaNutrisi) error
	Delete(ctx context.Context, id uint) error
}

type medicpedianutrisiRepository struct {
	db *gorm.DB
}

func NewMedicpediaNutrisiRepository(db *gorm.DB) MedicpediaNutrisiRepository {
	return &medicpedianutrisiRepository{db: db}
}

func (r *medicpedianutrisiRepository) Create(ctx context.Context, entity *entity.MedicpediaNutrisi) error {
	return r.db.WithContext(ctx).Create(entity).Error
}

func (r *medicpedianutrisiRepository) FindAll(ctx context.Context, pagination *defaultDto.PaginationRequest) ([]entity.MedicpediaNutrisi, int64, error) {
	var entities []entity.MedicpediaNutrisi
	var total int64

	query := r.db.WithContext(ctx).Model(&entity.MedicpediaNutrisi{})

	
	if pagination.Search != "" {
		query = query.Where("name LIKE ?", "%"+pagination.Search+"%")
		query = query.Or("slug LIKE ?", "%"+pagination.Search+"%")
		query = query.Or("description LIKE ?", "%"+pagination.Search+"%")
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

func (r *medicpedianutrisiRepository) FindPublicAll(ctx context.Context, pagination *defaultDto.PaginationRequest) ([]entity.MedicpediaNutrisi, int64, error) {
	var entities []entity.MedicpediaNutrisi
	var total int64

	query := r.db.WithContext(ctx).Model(&entity.MedicpediaNutrisi{}).Where("status = ?", "Published")

	if pagination.Search != "" {
		query = query.Where("(name LIKE ? OR slug LIKE ? OR description LIKE ?)", "%"+pagination.Search+"%", "%"+pagination.Search+"%", "%"+pagination.Search+"%")
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

func (r *medicpedianutrisiRepository) FindByID(ctx context.Context, id uint) (*entity.MedicpediaNutrisi, error) {
	var entity entity.MedicpediaNutrisi
	err := r.db.WithContext(ctx).First(&entity, id).Error
	if err != nil {
		return nil, err
	}
	return &entity, nil
}

func (r *medicpedianutrisiRepository) FindBySlug(ctx context.Context, slug string) (*entity.MedicpediaNutrisi, error) {
	var ent entity.MedicpediaNutrisi
	err := r.db.WithContext(ctx).Where("slug = ?", slug).First(&ent).Error
	if err != nil {
		return nil, err
	}
	return &ent, nil
}

func (r *medicpedianutrisiRepository) Update(ctx context.Context, entity *entity.MedicpediaNutrisi) error {
	return r.db.WithContext(ctx).Save(entity).Error
}

func (r *medicpedianutrisiRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&entity.MedicpediaNutrisi{}, id).Error
}

