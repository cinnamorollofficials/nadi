package entity

import "time"

type AiTier struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"not null;unique" json:"name"`
	DailyLimit  int       `gorm:"not null" json:"daily_limit"`
	Description string    `json:"description"`
	IsDefault   bool      `gorm:"default:false" json:"is_default"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
