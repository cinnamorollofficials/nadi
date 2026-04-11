package middleware

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hadi-projects/go-react-starter/pkg/cache"
	"github.com/hadi-projects/go-react-starter/pkg/response"
)

const (
	CSRFTokenHeader = "X-CSRF-Token"
	CSRFCookieName  = "csrf_token"
	CSRFCachePrefix = "csrf:"
	CSRFTokenLength = 32
	CSRFExpiration  = 24 * time.Hour
)

type CSRFConfig struct {
	Cache cache.CacheService
}

// CSRFProtection provides CSRF protection middleware
func CSRFProtection(config CSRFConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		AddToTrace(c, "CSRFProtection")

		method := c.Request.Method
		
		// Skip CSRF for safe methods
		if method == "GET" || method == "HEAD" || method == "OPTIONS" {
			c.Next()
			return
		}

		// Skip CSRF for API key authenticated requests
		if c.GetHeader("X-API-Key") != "" {
			c.Next()
			return
		}

		// Get token from header
		tokenFromHeader := c.GetHeader(CSRFTokenHeader)
		if tokenFromHeader == "" {
			response.Error(c, http.StatusForbidden, "CSRF token missing")
			c.Abort()
			return
		}

		// Validate token
		cacheKey := CSRFCachePrefix + tokenFromHeader
		var value string
		err := config.Cache.Get(c.Request.Context(), cacheKey, &value)
		if err != nil {
			response.Error(c, http.StatusForbidden, "Invalid or expired CSRF token")
			c.Abort()
			return
		}

		c.Next()
	}
}

// GenerateCSRFToken generates a new CSRF token and stores it in cache
func GenerateCSRFToken(c *gin.Context, cache cache.CacheService) (string, error) {
	// Generate random token
	bytes := make([]byte, CSRFTokenLength)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	token := hex.EncodeToString(bytes)

	// Store in cache
	cacheKey := CSRFCachePrefix + token
	if err := cache.Set(c.Request.Context(), cacheKey, "valid", CSRFExpiration); err != nil {
		return "", err
	}

	return token, nil
}

// CSRFTokenEndpoint provides an endpoint to get CSRF tokens
func CSRFTokenEndpoint(cache cache.CacheService) gin.HandlerFunc {
	return func(c *gin.Context) {
		token, err := GenerateCSRFToken(c, cache)
		if err != nil {
			response.Error(c, http.StatusInternalServerError, "Failed to generate CSRF token")
			return
		}

		// Set cookie for browser clients
		c.SetSameSite(http.SameSiteStrictMode)
		c.SetCookie(CSRFCookieName, token, int(CSRFExpiration.Seconds()), "/", "", true, true)

		response.Success(c, http.StatusOK, "CSRF token generated", gin.H{
			"csrf_token": token,
		})
	}
}