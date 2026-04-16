package repository

import (
	"context"

	defaultDto "github.com/hadi-projects/go-react-starter/internal/dto/default"
	"github.com/hadi-projects/go-react-starter/internal/entity"
	"gorm.io/gorm"
)

type MedicpediaPenyakitRepository interface {
	Create(ctx context.Context, entity *entity.MedicpediaPenyakit) error
	FindAll(ctx context.Context, pagination *defaultDto.PaginationRequest) ([]entity.MedicpediaPenyakit, int64, error)
	FindPublicAll(ctx context.Context, pagination *defaultDto.PaginationRequest) ([]entity.MedicpediaPenyakit, int64, error)
	FindByID(ctx context.Context, id uint) (*entity.MedicpediaPenyakit, error)
	FindBySlug(ctx context.Context, slug string) (*entity.MedicpediaPenyakit, error)
	Update(ctx context.Context, entity *entity.MedicpediaPenyakit) error
	Delete(ctx context.Context, id uint) error
}

type medicpediapenyakitRepository struct {
	db *gorm.DB
}

func NewMedicpediaPenyakitRepository(db *gorm.DB) MedicpediaPenyakitRepository {
	return &medicpediapenyakitRepository{db: db}
}

func (r *medicpediapenyakitRepository) Create(ctx context.Context, entity *entity.MedicpediaPenyakit) error {
	return r.db.WithContext(ctx).Create(entity).Error
}

func (r *medicpediapenyakitRepository) FindAll(ctx context.Context, pagination *defaultDto.PaginationRequest) ([]entity.MedicpediaPenyakit, int64, error) {
	var entities []entity.MedicpediaPenyakit
	var total int64

	query := r.db.WithContext(ctx).Model(&entity.MedicpediaPenyakit{})

	if pagination.Search != "" {
		query = query.Where("name LIKE ?", "%"+pagination.Search+"%")
		query = query.Or("slug LIKE ?", "%"+pagination.Search+"%")
		query = query.Or("description LIKE ?", "%"+pagination.Search+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (pagination.GetPage() - 1) * pagination.GetLimit()
	err := query.Order("id ASC").
		Limit(pagination.GetLimit()).
		Offset(offset).
		Find(&entities).Error

	return entities, total, err
}

func (r *medicpediapenyakitRepository) FindPublicAll(ctx context.Context, pagination *defaultDto.PaginationRequest) ([]entity.MedicpediaPenyakit, int64, error) {
	var entities []entity.MedicpediaPenyakit
	var total int64

	query := r.db.WithContext(ctx).Model(&entity.MedicpediaPenyakit{}).Where("status = ?", "Published")

	if pagination.Search != "" {
		query = query.Where("(name LIKE ? OR slug LIKE ?)", "%"+pagination.Search+"%", "%"+pagination.Search+"%")
	}

	if pagination.Letter != "" {
		query = query.Where("name LIKE ?", pagination.Letter+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (pagination.GetPage() - 1) * pagination.GetLimit()
	err := query.Order("name ASC").
		Limit(pagination.GetLimit()).
		Offset(offset).
		Find(&entities).Error

	return entities, total, err
}

func (r *medicpediapenyakitRepository) FindByID(ctx context.Context, id uint) (*entity.MedicpediaPenyakit, error) {
	var entity entity.MedicpediaPenyakit
	err := r.db.WithContext(ctx).First(&entity, id).Error
	if err != nil {
		return nil, err
	}
	return &entity, nil
}

func (r *medicpediapenyakitRepository) FindBySlug(ctx context.Context, slug string) (*entity.MedicpediaPenyakit, error) {
	var ent entity.MedicpediaPenyakit
	err := r.db.WithContext(ctx).Where("slug = ?", slug).First(&ent).Error
	if err != nil {
		return nil, err
	}
	return &ent, nil
}

func (r *medicpediapenyakitRepository) Update(ctx context.Context, entity *entity.MedicpediaPenyakit) error {
	return r.db.WithContext(ctx).Save(entity).Error
}

func (r *medicpediapenyakitRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&entity.MedicpediaPenyakit{}, id).Error
}
