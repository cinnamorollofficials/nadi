package entity

import "time"

type SystemLog struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	RequestID    string    `gorm:"index" json:"request_id"`
	Method       string    `gorm:"not null;index" json:"method"`      // e.g. DATABASE:QUERY, REDIS:GET, KAFKA:PUBLISH, SMTP:SEND
	Path         string    `gorm:"not null;type:text" json:"path"`    // e.g. table name, redis key, kafka topic, recipient email
	StatusCode   int       `gorm:"not null;index" json:"status_code"` // 200 for success, 500 for error
	Latency      int64     `gorm:"not null" json:"latency"`           // in milliseconds
	RequestBody  string    `gorm:"type:longtext" json:"request_body"`
	ResponseBody string    `gorm:"type:longtext" json:"response_body"`
	CreatedAt    time.Time `gorm:"autoCreateTime;index" json:"created_at"`
}
