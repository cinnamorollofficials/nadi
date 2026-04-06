package dto

import "time"

type MedicpediaPenyakitResponse struct {
	ID        uint      `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
	Image string `json:"image"`
	Description string `json:"description"`
	Causes string `json:"causes"`
	FactorsSymptoms string `json:"factors_symptoms"`
	Diagnosis string `json:"diagnosis"`
	WhenToSeeDoctor string `json:"when_to_see_doctor"`
	Prevention string `json:"prevention"`
	Status string `json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CreateMedicpediaPenyakitRequest struct {
	Name string `json:"name" binding:"required"`
	Slug string `json:"slug" binding:"required"`
	Image string `json:"image" binding:""`
	Description string `json:"description" binding:"required"`
	Causes string `json:"causes" binding:"required"`
	FactorsSymptoms string `json:"factors_symptoms" binding:"required"`
	Diagnosis string `json:"diagnosis" binding:"required"`
	WhenToSeeDoctor string `json:"when_to_see_doctor" binding:"required"`
	Prevention string `json:"prevention" binding:"required"`
	Status string `json:"status" binding:"required"`
}

type UpdateMedicpediaPenyakitRequest struct {
	Name string `json:"name"`
	Slug string `json:"slug"`
	Image string `json:"image"`
	Description string `json:"description"`
	Causes string `json:"causes"`
	FactorsSymptoms string `json:"factors_symptoms"`
	Diagnosis string `json:"diagnosis"`
	WhenToSeeDoctor string `json:"when_to_see_doctor"`
	Prevention string `json:"prevention"`
	Status string `json:"status"`
}
