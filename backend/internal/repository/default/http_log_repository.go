package repository

import (
	"context"
	"time"

	dto "github.com/hadi-projects/go-react-starter/internal/dto/default"
	"github.com/hadi-projects/go-react-starter/internal/entity/default"
	"github.com/hadi-projects/go-react-starter/pkg/logger"
	"gorm.io/gorm"
)

type HttpLogRepository interface {
	Create(log *entity.HttpLog) error
	FindAll(ctx context.Context, query *dto.HttpLogQuery) ([]entity.HttpLog, int64, error)
	DeleteOldLogs(ctx context.Context, days int) (int64, error)
}

type httpLogRepository struct {
	db *gorm.DB
}

func NewHttpLogRepository(db *gorm.DB) HttpLogRepository {
	return &httpLogRepository{db: db}
}

func (r *httpLogRepository) Create(log *entity.HttpLog) error {
	ctx := context.WithValue(context.Background(), logger.CtxKeySkipLogging, true)
	return r.db.WithContext(ctx).Create(log).Error
}

func (r *httpLogRepository) FindAll(ctx context.Context, query *dto.HttpLogQuery) ([]entity.HttpLog, int64, error) {
	var logs []entity.HttpLog
	var total int64

	q := r.db.WithContext(ctx).Model(&entity.HttpLog{})

	if query.Method != "" {
		q = q.Where("method = ?", query.Method)
	}
	if query.Path != "" {
		q = q.Where("path LIKE ?", "%"+query.Path+"%")
	}
	if query.StatusCode != 0 {
		q = q.Where("status_code = ?", query.StatusCode)
	}

	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := q.Order("id DESC").
		Limit(query.GetLimit()).
		Offset(query.GetOffset()).
		Find(&logs).Error

	return logs, total, err
}

func (r *httpLogRepository) DeleteOldLogs(ctx context.Context, days int) (int64, error) {
	result := r.db.WithContext(ctx).Where("created_at < ?", time.Now().AddDate(0, 0, -days)).Delete(&entity.HttpLog{})
	return result.RowsAffected, result.Error
}
