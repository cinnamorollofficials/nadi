package dto

import "time"

type AuditLogQuery struct {
	Page      int    `form:"page" json:"page"`
	Limit     int    `form:"limit" json:"limit"`
	Module    string `form:"module" json:"module"`
	Action    string `form:"action" json:"action"`
	UserEmail string `form:"user_email" json:"user_email"`
	RequestID string `form:"request_id" json:"request_id"`
}

func (q *AuditLogQuery) GetPage() int {
	if q.Page <= 0 {
		return 1
	}
	return q.Page
}

func (q *AuditLogQuery) GetLimit() int {
	if q.Limit <= 0 {
		return 10
	}
	return q.Limit
}

type AuditLogResponse struct {
	ID        uint      `json:"id"`
	RequestID string    `json:"request_id"`
	UserID    uint      `json:"user_id"`
	UserEmail string    `json:"user_email"`
	Action    string    `json:"action"`
	Module    string    `json:"module"`
	TargetID  string    `json:"target_id"`
	Metadata  string    `json:"metadata"`
	CreatedAt time.Time `json:"created_at"`
}
