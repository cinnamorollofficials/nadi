package repository

import (
	"context"
	"time"

	"github.com/hadi-projects/go-react-starter/internal/entity"
	"gorm.io/gorm"
)

type AiUsageRepository interface {
	Create(ctx context.Context, log *entity.AiUsageLog) error
	GetStats(ctx context.Context) (map[string]interface{}, error)
	GetDailyUsage(ctx context.Context, days int) ([]map[string]interface{}, error)
	GetTopUsers(ctx context.Context, limit int) ([]map[string]interface{}, error)
}

type aiUsageRepository struct {
	db *gorm.DB
}

func NewAiUsageRepository(db *gorm.DB) AiUsageRepository {
	return &aiUsageRepository{db: db}
}

func (r *aiUsageRepository) Create(ctx context.Context, log *entity.AiUsageLog) error {
	return r.db.WithContext(ctx).Create(log).Error
}

func (r *aiUsageRepository) GetStats(ctx context.Context) (map[string]interface{}, error) {
	var stats struct {
		TotalTokens      int64   `json:"total_tokens"`
		TotalPrompt      int64   `json:"total_prompt"`
		TotalCandidates  int64   `json:"total_candidates"`
		TotalCost        float64 `json:"total_cost"`
	}

	err := r.db.WithContext(ctx).Model(&entity.AiUsageLog{}).
		Select("SUM(total_tokens) as total_tokens, SUM(prompt_tokens) as total_prompt, SUM(candidates_tokens) as total_candidates, SUM(cost) as total_cost").
		Scan(&stats).Error

	var userCount int64
	r.db.WithContext(ctx).Model(&entity.AiUsageLog{}).Distinct("user_id").Count(&userCount)

	return map[string]interface{}{
		"total_tokens":     stats.TotalTokens,
		"total_prompt":     stats.TotalPrompt,
		"total_candidates": stats.TotalCandidates,
		"total_cost":       stats.TotalCost,
		"active_users":     userCount,
	}, err
}

func (r *aiUsageRepository) GetDailyUsage(ctx context.Context, days int) ([]map[string]interface{}, error) {
	var results []map[string]interface{}
	
	// Calculate date threshold
	threshold := time.Now().AddDate(0, 0, -days)

	err := r.db.WithContext(ctx).Model(&entity.AiUsageLog{}).
		Select("DATE(created_at) as date, SUM(total_tokens) as tokens").
		Where("created_at >= ?", threshold).
		Group("DATE(created_at)").
		Order("date ASC").
		Scan(&results).Error

	return results, err
}

func (r *aiUsageRepository) GetTopUsers(ctx context.Context, limit int) ([]map[string]interface{}, error) {
	var results []map[string]interface{}

	err := r.db.WithContext(ctx).Model(&entity.AiUsageLog{}).
		Select("users.name as user_name, users.email as user_email, SUM(total_tokens) as tokens, SUM(cost) as cost").
		Joins("JOIN users ON users.id = ai_usage_logs.user_id").
		Group("ai_usage_logs.user_id").
		Order("tokens DESC").
		Limit(limit).
		Scan(&results).Error

	return results, err
}
