package dto

import "time"

type SystemLogQuery struct {
	Page       int    `form:"page" json:"page"`
	Limit      int    `form:"limit" json:"limit"`
	Method     string `form:"method" json:"method"`
	StatusCode int    `form:"status_code" json:"status_code"`
	Path       string `form:"path" json:"path"`
	RequestID  string `form:"request_id" json:"request_id"`
}

func (q *SystemLogQuery) GetPage() int {
	if q.Page <= 0 {
		return 1
	}
	return q.Page
}

func (q *SystemLogQuery) GetLimit() int {
	if q.Limit <= 0 {
		return 10
	}
	return q.Limit
}

type SystemLogResponse struct {
	ID           uint      `json:"id"`
	RequestID    string    `json:"request_id"`
	Method       string    `json:"method"`
	Path         string    `json:"path"`
	StatusCode   int       `json:"status_code"`
	Latency      int64     `json:"latency"`
	RequestBody  string    `json:"request_body"`
	ResponseBody string    `json:"response_body"`
	CreatedAt    time.Time `json:"created_at"`
}
