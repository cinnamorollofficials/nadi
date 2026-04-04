package repository

import (
	"context"
	defaultDto "github.com/hadi-projects/go-react-starter/internal/dto/default"
	"github.com/hadi-projects/go-react-starter/internal/entity"
	"gorm.io/gorm"
)

type BlogPostRepository interface {
	Create(ctx context.Context, entity *entity.BlogPost) error
	FindAll(ctx context.Context, pagination *defaultDto.PaginationRequest) ([]entity.BlogPost, int64, error)
	FindByID(ctx context.Context, id uint) (*entity.BlogPost, error)
	Update(ctx context.Context, entity *entity.BlogPost) error
	Delete(ctx context.Context, id uint) error
}

type blogpostRepository struct {
	db *gorm.DB
}

func NewBlogPostRepository(db *gorm.DB) BlogPostRepository {
	return &blogpostRepository{db: db}
}

func (r *blogpostRepository) Create(ctx context.Context, entity *entity.BlogPost) error {
	return r.db.WithContext(ctx).Create(entity).Error
}

func (r *blogpostRepository) FindAll(ctx context.Context, pagination *defaultDto.PaginationRequest) ([]entity.BlogPost, int64, error) {
	var entities []entity.BlogPost
	var total int64

	query := r.db.WithContext(ctx).Model(&entity.BlogPost{})

	
	if pagination.Search != "" {
		query = query.Where("title LIKE ?", "%"+pagination.Search+"%")
		query = query.Or("slug LIKE ?", "%"+pagination.Search+"%")
		query = query.Or("author LIKE ?", "%"+pagination.Search+"%")
		query = query.Or("category LIKE ?", "%"+pagination.Search+"%")
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

func (r *blogpostRepository) FindByID(ctx context.Context, id uint) (*entity.BlogPost, error) {
	var entity entity.BlogPost
	err := r.db.WithContext(ctx).First(&entity, id).Error
	if err != nil {
		return nil, err
	}
	return &entity, nil
}

func (r *blogpostRepository) Update(ctx context.Context, entity *entity.BlogPost) error {
	return r.db.WithContext(ctx).Save(entity).Error
}

func (r *blogpostRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&entity.BlogPost{}, id).Error
}
