package entity

import "time"

type BlogPost struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Title string `gorm:"type:varchar(255);not null" json:"title"`
	Slug string `gorm:"unique;type:varchar(255);not null" json:"slug"`
	Summary string `gorm:"type:varchar(255);not null" json:"summary"`
	Content string `gorm:"type:longtext" json:"content"`
	Author string `gorm:"type:varchar(255);not null" json:"author"`
	Category string `gorm:"type:varchar(255);not null" json:"category"`
	Status string `gorm:"type:varchar(50)" json:"status"`
	Image string `gorm:"type:varchar(255)" json:"image"`
	PublishedAt time.Time `json:"published_at"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
