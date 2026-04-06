package entity

import "time"

type MedicpediaPenyakit struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Name string `gorm:"type:varchar(255);not null" json:"name"`
	Slug string `gorm:"unique;type:varchar(255);not null" json:"slug"`
	Image string `gorm:"type:varchar(255);not null" json:"image"`
	Description string `gorm:"type:longtext" json:"description"`
	Causes string `gorm:"type:longtext" json:"causes"`
	FactorsSymptoms string `gorm:"type:longtext" json:"factors_symptoms"`
	Diagnosis string `gorm:"type:longtext" json:"diagnosis"`
	WhenToSeeDoctor string `gorm:"type:longtext" json:"when_to_see_doctor"`
	Prevention string `gorm:"type:longtext" json:"prevention"`
	Status string `gorm:"type:varchar(50)" json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
