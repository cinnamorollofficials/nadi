package dto

import "time"

type AiTierResponse struct {
	ID          uint      `json:"id"`
	Name        string    `json:"name"`
	DailyLimit  int       `json:"daily_limit"`
	Description string    `json:"description"`
	IsDefault   bool      `json:"is_default"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type CreateAiTierRequest struct {
	Name        string `json:"name" binding:"required"`
	DailyLimit  int    `json:"daily_limit" binding:"required"`
	Description string `json:"description"`
	IsDefault   bool   `json:"is_default"`
}

type UpdateAiTierRequest struct {
	Name        string `json:"name"`
	DailyLimit  int    `json:"daily_limit"`
	Description string `json:"description"`
	IsDefault   bool   `json:"is_default"`
}
