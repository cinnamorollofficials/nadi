package config

type SecurityConfig struct {
	RequestTimeOut  int
	APIKey          string
	BCryptCost      int
	AdminEmail      string
	AdminPassword   string
	EncryptionKey   string // AES-256 key for encrypting sensitive data (32 bytes base64)
}
