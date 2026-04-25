package entity

import "time"

type AiUsageLog struct {
	ID              uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID          uint      `gorm:"not null;index" json:"user_id"`
	PromptTokens    int       `gorm:"not null" json:"prompt_tokens"`
	CandidatesTokens int      `gorm:"not null" json:"candidates_tokens"`
	TotalTokens     int       `gorm:"not null" json:"total_tokens"`
	Model           string    `gorm:"type:varchar(100);not null" json:"model"`
	Cost            float64   `gorm:"type:decimal(18,8);default:0" json:"cost"`
	CreatedAt       time.Time `gorm:"index" json:"created_at"`
}

