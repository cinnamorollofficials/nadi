package dto

import "time"

type LoginRequest struct {
	Email      string `json:"email" binding:"required,email"`
	Password   string `json:"password" binding:"required"`
	RememberMe bool   `json:"remember_me"`
}

type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

type LoginResponse struct {
	AccessToken  string           `json:"access_token,omitempty"`
	RefreshToken string           `json:"refresh_token,omitempty"`
	User         *AuthUserResponse `json:"user,omitempty"`
	Requires2FA  bool             `json:"requires_2fa,omitempty"`
	TempToken    string           `json:"temp_token,omitempty"`
}

type UsageInfo struct {
	Limit       int     `json:"limit"`
	Used        int     `json:"used"`
	Percent     int     `json:"percent"`
	TodayTokens int     `json:"today_tokens"`
	TotalTokens int64   `json:"total_tokens"`
	EstCost     float64 `json:"est_cost"`
}

// UserDailyTokenUsage represents token usage stats from ai_usage_logs
type UserDailyTokenUsage struct {
	MessageCount     int     `json:"message_count"`
	TotalTokens      int     `json:"total_tokens"`
	PromptTokens     int     `json:"prompt_tokens"`
	CandidatesTokens int     `json:"candidates_tokens"`
	EstimatedCost    float64 `json:"estimated_cost"`
}

// UserUsageHistory represents usage stats for a specific day
type UserUsageDailyHistory struct {
	Date     string `json:"date"`
	Tokens   int    `json:"tokens"`
	Messages int    `json:"messages"`
}

// UserUsageResponse is the full per-user usage response
type UserUsageResponse struct {
	Today   *UserDailyTokenUsage    `json:"today"`
	History []UserUsageDailyHistory `json:"history"`
	AllTime struct {
		TotalTokens   int64   `json:"total_tokens"`
		TotalMessages int64   `json:"total_messages"`
		TotalCost     float64 `json:"total_cost"`
	} `json:"all_time"`
}

type AuthUserResponse struct {
	ID              uint       `json:"id"`
	Name            string     `json:"name"`
	Email           string     `json:"email"`
	RoleID          uint       `json:"role_id"`
	Role            string     `json:"role"`
	PermissionsMask uint64     `json:"permissions_mask,string"`
	Status          string     `json:"status"`
	TwoFAEnabled    bool       `json:"two_fa_enabled"`
	Usage           *UsageInfo `json:"usage,omitempty"`
}

type TwoFAEnrollResponse struct {
	Secret string `json:"secret"`
	QRURL  string `json:"qr_url"`
}

type TwoFAVerifyRequest struct {
	TempToken string `json:"temp_token" binding:"required"`
	Code      string `json:"code" binding:"required"`
}

type TwoFAConfirmRequest struct {
	Code string `json:"code" binding:"required"`
}

type TwoFADisableRequest struct {
	Code string `json:"code" binding:"required"`
}

type UserResponse struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	RoleID    uint      `json:"role_id"`
	Role      string    `json:"role"`
	Status       string    `json:"status"`
	TwoFAEnabled bool      `json:"two_fa_enabled"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type ResetPasswordRequest struct {
	Token    string `json:"token" binding:"required"`
	Password string `json:"password" binding:"required,min=8"`
}

type LogoutRequest struct {
	Token        string `json:"token"`
	RefreshToken string `json:"refresh_token"`
	Reason       string `json:"reason"`
}

type TwoFAResetRequest struct {
	TempToken string `json:"temp_token" binding:"required"`
}

type TwoFAResetConfirmRequest struct {
	Token string `json:"token" binding:"required"`
}

type VerifyEmailRequest struct {
	Token string `json:"token" binding:"required"`
}
