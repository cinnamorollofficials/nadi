package entity

import "time"

type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"not null" json:"name"`
	Email     string    `gorm:"not null;unique" json:"email"`
	RoleID    uint      `gorm:"not null" json:"role_id"`
	Role      Role      `gorm:"foreignKey:RoleID" json:"role"`
	Password     *string    `gorm:"default:null" json:"-"`
	GoogleID     *string    `gorm:"uniqueIndex;default:null" json:"google_id"`
	AvatarURL    *string    `gorm:"default:null" json:"avatar_url"`
	Status       string    `gorm:"type:enum('active', 'freezed', 'pending');default:'active'" json:"status"`
	TwoFASecret  string    `gorm:"default:''" json:"-"`
	TwoFAEnabled bool      `gorm:"default:false" json:"two_fa_enabled"`
	TwoFACounter uint64    `gorm:"default:0" json:"-"`
	UsageLimit   int       `gorm:"default:20" json:"usage_limit"`
	CurrentUsage int       `gorm:"default:0" json:"current_usage"`
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}
