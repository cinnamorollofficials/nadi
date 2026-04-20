package entity

import "time"

type ChatMode string

const (
	ChatModeConsultation ChatMode = "consultation"
	ChatModeSymptomCheck ChatMode = "symptom_check"
)

type ChatChannel struct {
	ID        uint          `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID    uint          `gorm:"not null;index" json:"user_id"`
	Title     string        `gorm:"type:varchar(255);not null" json:"title"`
	Mode      ChatMode      `gorm:"type:varchar(50);default:'consultation'" json:"mode"`
	Status    string        `gorm:"type:varchar(20);default:'active'" json:"status"`
	CreatedAt time.Time     `json:"created_at"`
	UpdatedAt time.Time     `json:"updated_at"`
	Messages     []ChatMessage `gorm:"foreignKey:ChannelID" json:"messages,omitempty"`
	MessageCount int           `gorm:"-" json:"message_count"`
}

type ChatMessage struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	ChannelID uint      `gorm:"not null;index" json:"channel_id"`
	Role      string    `gorm:"type:varchar(20);not null" json:"role"` // 'user' or 'assistant'
	Content   string    `gorm:"type:longtext;not null" json:"content"`
	Metadata  string    `gorm:"type:longtext" json:"metadata"` // For storing citations/refs as JSON string
	CreatedAt time.Time `json:"created_at"`
}
