package dto

import "time"

type BlogPostResponse struct {
	ID        uint      `json:"id"`
	Title string `json:"title"`
	Slug string `json:"slug"`
	Summary string `json:"summary"`
	Content string `json:"content"`
	Author string `json:"author"`
	Category string `json:"category"`
	Status string `json:"status"`
	Image string `json:"image"`
	PublishedAt time.Time `json:"published_at"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CreateBlogPostRequest struct {
	Title string `json:"title" binding:"required"`
	Slug string `json:"slug" binding:"required"`
	Summary string `json:"summary" binding:""`
	Content string `json:"content" binding:"required"`
	Author string `json:"author" binding:""`
	Category string `json:"category" binding:""`
	Status string `json:"status" binding:"required"`
	Image string `json:"image" binding:""`
	PublishedAt time.Time `json:"published_at" binding:""`
}

type UpdateBlogPostRequest struct {
	Title string `json:"title"`
	Slug string `json:"slug"`
	Summary string `json:"summary"`
	Content string `json:"content"`
	Author string `json:"author"`
	Category string `json:"category"`
	Status string `json:"status"`
	Image string `json:"image"`
	PublishedAt time.Time `json:"published_at"`
}
