package dto

type GoogleLoginRequest struct {
	Credential string `json:"credential" binding:"required"`
}
