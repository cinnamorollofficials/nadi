package entity

import "time"

type MedicpediaNutrisi struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Name string `gorm:"type:varchar(255);not null" json:"name"`
	Slug string `gorm:"unique;type:varchar(255);not null" json:"slug"`
	Image string `gorm:"type:varchar(255);not null" json:"image"`
	Description string `gorm:"type:longtext" json:"description"`
	Benefits string `gorm:"type:longtext" json:"benefits"`
	Sources string `gorm:"type:longtext" json:"sources"`
	DailyNeeds string `gorm:"type:longtext" json:"daily_needs"`
	RisksDeficiency string `gorm:"type:longtext" json:"risks_deficiency"`
	Status string `gorm:"type:varchar(50)" json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
