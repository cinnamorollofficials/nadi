package dto

import "time"

type FaqResponse struct {
	ID        uint      `json:"id"`
	Question  string    `json:"question"`
	Answer    string    `json:"answer"`
	Category  string    `json:"category"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CreateFaqRequest struct {
	Question string `json:"question" binding:"required"`
	Answer   string `json:"answer" binding:"required"`
	Category string `json:"category" binding:"required"`
	Status   string `json:"status" binding:"required"`
}

type UpdateFaqRequest struct {
	Question string `json:"question"`
	Answer   string `json:"answer"`
	Category string `json:"category"`
	Status   string `json:"status"`
}
