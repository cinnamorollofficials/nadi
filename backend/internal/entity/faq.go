package entity

import "time"

type Faq struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Question  string    `gorm:"unique;type:varchar(255);not null" json:"question"`
	Answer    string    `gorm:"type:longtext" json:"answer"`
	Category  string    `gorm:"type:varchar(100)" json:"category"`
	Status    string    `gorm:"type:varchar(50)" json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
