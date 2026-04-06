package dto

import "time"

type MedicpediaNutrisiResponse struct {
	ID        uint      `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
	Image string `json:"image"`
	Description string `json:"description"`
	Benefits string `json:"benefits"`
	Sources string `json:"sources"`
	DailyNeeds string `json:"daily_needs"`
	RisksDeficiency string `json:"risks_deficiency"`
	Status string `json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CreateMedicpediaNutrisiRequest struct {
	Name string `json:"name" binding:"required"`
	Slug string `json:"slug" binding:"required"`
	Image string `json:"image" binding:""`
	Description string `json:"description" binding:"required"`
	Benefits string `json:"benefits" binding:"required"`
	Sources string `json:"sources" binding:"required"`
	DailyNeeds string `json:"daily_needs" binding:"required"`
	RisksDeficiency string `json:"risks_deficiency" binding:"required"`
	Status string `json:"status" binding:"required"`
}

type UpdateMedicpediaNutrisiRequest struct {
	Name string `json:"name"`
	Slug string `json:"slug"`
	Image string `json:"image"`
	Description string `json:"description"`
	Benefits string `json:"benefits"`
	Sources string `json:"sources"`
	DailyNeeds string `json:"daily_needs"`
	RisksDeficiency string `json:"risks_deficiency"`
	Status string `json:"status"`
}
