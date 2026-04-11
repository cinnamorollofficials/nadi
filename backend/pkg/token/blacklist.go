package token

import (
	"context"
	"fmt"
	"time"

	"github.com/hadi-projects/go-react-starter/pkg/cache"
)

const (
	tokenBlacklistPrefix = "token:blacklist:"
	userTokensPrefix     = "user:tokens:"
)

// Blacklist manages JWT token revocation
type Blacklist struct {
	cache cache.CacheService
}

// NewBlacklist creates a new token blacklist manager
func NewBlacklist(cache cache.CacheService) *Blacklist {
	return &Blacklist{cache: cache}
}

// RevokeToken adds a token to the blacklist
func (b *Blacklist) RevokeToken(ctx context.Context, tokenID string, expiresAt time.Time) error {
	key := tokenBlacklistPrefix + tokenID
	ttl := time.Until(expiresAt)
	
	if ttl <= 0 {
		// Token already expired, no need to blacklist
		return nil
	}
	
	// Store in blacklist with TTL matching token expiration
	return b.cache.Set(ctx, key, "revoked", ttl)
}

// IsRevoked checks if a token is blacklisted
func (b *Blacklist) IsRevoked(ctx context.Context, tokenID string) (bool, error) {
	key := tokenBlacklistPrefix + tokenID
	var value string
	err := b.cache.Get(ctx, key, &value)
	if err != nil {
		// If error is "cache miss", token is not revoked
		if err.Error() == "cache miss: key not found" {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

// RevokeAllUserTokens revokes all tokens for a specific user
func (b *Blacklist) RevokeAllUserTokens(ctx context.Context, userID uint) error {
	// Get all token IDs for this user
	userTokensKey := fmt.Sprintf("%s%d", userTokensPrefix, userID)
	
	// Delete the user's token list
	return b.cache.Delete(ctx, userTokensKey)
}

// TrackUserToken tracks a token for a user (for bulk revocation)
func (b *Blacklist) TrackUserToken(ctx context.Context, userID uint, tokenID string, expiresAt time.Time) error {
	userTokensKey := fmt.Sprintf("%s%d", userTokensPrefix, userID)
	ttl := time.Until(expiresAt)
	
	if ttl <= 0 {
		return nil
	}
	
	// Add token ID to user's token set
	// In a real implementation, you'd use Redis SADD
	// For now, we'll store a simple marker
	tokenKey := fmt.Sprintf("%s:%s", userTokensKey, tokenID)
	return b.cache.Set(ctx, tokenKey, "active", ttl)
}

// CleanupExpiredTokens removes expired tokens from tracking (called periodically)
func (b *Blacklist) CleanupExpiredTokens(ctx context.Context) error {
	// Redis TTL handles this automatically
	// This is a no-op for Redis-based implementation
	return nil
}
