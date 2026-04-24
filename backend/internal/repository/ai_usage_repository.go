package repository

import (
	"context"
	"time"

	entity "github.com/hadi-projects/go-react-starter/internal/entity/default"
	"gorm.io/gorm"
)

type AiUsageRepository interface {
	Create(ctx context.Context, log *entity.AiUsageLog) error
	GetStats(ctx context.Context) (map[string]interface{}, error)
	GetDailyUsage(ctx context.Context, days int) ([]map[string]interface{}, error)
	GetTopUsers(ctx context.Context, limit int) ([]map[string]interface{}, error)
	// Per-user queries
	GetTodayUsageByUserID(ctx context.Context, userID uint) (*TodayUsageSummary, error)
	GetUsageHistoryByUserID(ctx context.Context, userID uint, days int) ([]DailyUsageSummary, error)
	GetAllTimeUsageByUserID(ctx context.Context, userID uint) (*AllTimeUsageSummary, error)
	// Admin: today's usage for all users
	GetTodayUsageAllUsers(ctx context.Context) (map[uint]*TodayUsageSummary, error)
}

type TodayUsageSummary struct {
	MessageCount     int64   `json:"message_count"`
	TotalTokens      int64   `json:"total_tokens"`
	PromptTokens     int64   `json:"prompt_tokens"`
	CandidatesTokens int64   `json:"candidates_tokens"`
	EstimatedCost    float64 `json:"estimated_cost"`
}

type DailyUsageSummary struct {
	Date     string `json:"date"`
	Tokens   int64  `json:"tokens"`
	Messages int64  `json:"messages"`
}

type AllTimeUsageSummary struct {
	TotalTokens   int64   `json:"total_tokens"`
	TotalMessages int64   `json:"total_messages"`
	TotalCost     float64 `json:"total_cost"`
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

func (r *aiUsageRepository) GetTodayUsageByUserID(ctx context.Context, userID uint) (*TodayUsageSummary, error) {
	var summary TodayUsageSummary
	now := time.Now().UTC()
	startOfDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)
	endOfDay := startOfDay.Add(24 * time.Hour).Add(-1 * time.Second)

	err := r.db.WithContext(ctx).Model(&entity.AiUsageLog{}).
		Select(`COUNT(*) as message_count, COALESCE(SUM(total_tokens), 0) as total_tokens, COALESCE(SUM(prompt_tokens), 0) as prompt_tokens, COALESCE(SUM(candidates_tokens), 0) as candidates_tokens, COALESCE(SUM(cost), 0) as estimated_cost`).
		Where("user_id = ? AND created_at BETWEEN ? AND ?", userID, startOfDay, endOfDay).
		Scan(&summary).Error

	return &summary, err
}

func (r *aiUsageRepository) GetUsageHistoryByUserID(ctx context.Context, userID uint, days int) ([]DailyUsageSummary, error) {
	var results []DailyUsageSummary
	threshold := time.Now().UTC().AddDate(0, 0, -days)

	err := r.db.WithContext(ctx).Model(&entity.AiUsageLog{}).
		Select("DATE(created_at) as date, COALESCE(SUM(total_tokens), 0) as tokens, COUNT(*) as messages").
		Where("user_id = ? AND created_at >= ?", userID, threshold).
		Group("DATE(created_at)").
		Order("date ASC").
		Scan(&results).Error

	return results, err
}

func (r *aiUsageRepository) GetAllTimeUsageByUserID(ctx context.Context, userID uint) (*AllTimeUsageSummary, error) {
	var summary AllTimeUsageSummary

	err := r.db.WithContext(ctx).Model(&entity.AiUsageLog{}).
		Select(`COALESCE(SUM(total_tokens), 0) as total_tokens, COUNT(*) as total_messages, COALESCE(SUM(cost), 0) as total_cost`).
		Where("user_id = ?", userID).
		Scan(&summary).Error

	return &summary, err
}

func (r *aiUsageRepository) GetTodayUsageAllUsers(ctx context.Context) (map[uint]*TodayUsageSummary, error) {
	now := time.Now().UTC()
	startOfDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)
	endOfDay := startOfDay.Add(24 * time.Hour).Add(-1 * time.Second)

	type row struct {
		UserID           uint    `gorm:"column:user_id"`
		MessageCount     int64   `gorm:"column:message_count"`
		TotalTokens      int64   `gorm:"column:total_tokens"`
		PromptTokens     int64   `gorm:"column:prompt_tokens"`
		CandidatesTokens int64   `gorm:"column:candidates_tokens"`
		EstimatedCost    float64 `gorm:"column:estimated_cost"`
	}

	var rows []row
	err := r.db.WithContext(ctx).Model(&entity.AiUsageLog{}).
		Select(`user_id, COUNT(*) as message_count, COALESCE(SUM(total_tokens), 0) as total_tokens, COALESCE(SUM(prompt_tokens), 0) as prompt_tokens, COALESCE(SUM(candidates_tokens), 0) as candidates_tokens, COALESCE(SUM(cost), 0) as estimated_cost`).
		Where("created_at BETWEEN ? AND ?", startOfDay, endOfDay).
		Group("user_id").
		Scan(&rows).Error

	result := make(map[uint]*TodayUsageSummary, len(rows))
	for _, r := range rows {
		result[r.UserID] = &TodayUsageSummary{
			MessageCount:     r.MessageCount,
			TotalTokens:      r.TotalTokens,
			PromptTokens:     r.PromptTokens,
			CandidatesTokens: r.CandidatesTokens,
			EstimatedCost:    r.EstimatedCost,
		}
	}
	return result, err
}
