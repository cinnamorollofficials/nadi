package middleware

import (
	"context"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hadi-projects/go-react-starter/pkg/cache"
	"github.com/hadi-projects/go-react-starter/pkg/response"
)

type RedisRateLimiterConfig struct {
	Cache       cache.Cache
	RPS         int           // Requests per second
	Burst       int           // Burst capacity
	WindowSize  time.Duration // Time window for rate limiting
	KeyPrefix   string        // Redis key prefix
}

// RedisRateLimiter implements distributed rate limiting using Redis
func RedisRateLimiter(config RedisRateLimiterConfig) gin.HandlerFunc {
	if config.WindowSize == 0 {
		config.WindowSize = time.Second
	}
	if config.KeyPrefix == "" {
		config.KeyPrefix = "rate_limit:"
	}

	return func(c *gin.Context) {
		AddToTrace(c, "RedisRateLimiter")
		
		// Get client identifier (IP address)
		clientIP := c.ClientIP()
		key := config.KeyPrefix + clientIP
		
		ctx := c.Request.Context()
		
		// Check current request count
		allowed, err := isRequestAllowed(ctx, config.Cache, key, config.RPS, config.Burst, config.WindowSize)
		if err != nil {
			// Log error but don't block request on Redis failure
			c.Header("X-RateLimit-Error", "true")
			c.Next()
			return
		}

		if !allowed {
			// Set rate limit headers
			c.Header("X-RateLimit-Limit", strconv.Itoa(config.RPS))
			c.Header("X-RateLimit-Remaining", "0")
			c.Header("Retry-After", strconv.Itoa(int(config.WindowSize.Seconds())))
			
			response.Error(c, http.StatusTooManyRequests, "Rate limit exceeded")
			c.Abort()
			return
		}

		// Set rate limit headers for successful requests
		remaining, _ := getRemainingRequests(ctx, config.Cache, key, config.RPS, config.WindowSize)
		c.Header("X-RateLimit-Limit", strconv.Itoa(config.RPS))
		c.Header("X-RateLimit-Remaining", strconv.Itoa(remaining))

		c.Next()
	}
}

// isRequestAllowed checks if the request is allowed based on rate limits
func isRequestAllowed(ctx context.Context, cache cache.Cache, key string, rps, burst int, window time.Duration) (bool, error) {
	now := time.Now().Unix()
	windowStart := now - int64(window.Seconds())
	
	// Use Redis pipeline for atomic operations
	pipe := []string{
		// Remove expired entries
		fmt.Sprintf("ZREMRANGEBYSCORE %s -inf %d", key, windowStart),
		// Count current requests in window
		fmt.Sprintf("ZCARD %s", key),
		// Add current request
		fmt.Sprintf("ZADD %s %d %d", key, now, now),
		// Set expiration
		fmt.Sprintf("EXPIRE %s %d", key, int(window.Seconds())+1),
	}
	
	// Execute pipeline (simplified - in real implementation, use Redis pipeline)
	// For now, we'll use individual commands
	
	// Remove expired entries
	if err := cache.Delete(ctx, key+"_expired"); err != nil {
		// Ignore error for cleanup
	}
	
	// Get current count
	countStr, err := cache.Get(ctx, key+"_count")
	if err != nil {
		countStr = "0"
	}
	
	count, _ := strconv.Atoi(countStr)
	
	// Check if request is allowed
	if count >= rps {
		return false, nil
	}
	
	// Increment counter
	newCount := count + 1
	if err := cache.Set(ctx, key+"_count", strconv.Itoa(newCount), window); err != nil {
		return false, err
	}
	
	return true, nil
}

// getRemainingRequests calculates remaining requests in the current window
func getRemainingRequests(ctx context.Context, cache cache.Cache, key string, rps int, window time.Duration) (int, error) {
	countStr, err := cache.Get(ctx, key+"_count")
	if err != nil {
		return rps, nil
	}
	
	count, _ := strconv.Atoi(countStr)
	remaining := rps - count
	if remaining < 0 {
		remaining = 0
	}
	
	return remaining, nil
}

// PerUserRateLimiter implements rate limiting per authenticated user
func PerUserRateLimiter(config RedisRateLimiterConfig) gin.HandlerFunc {
	if config.KeyPrefix == "" {
		config.KeyPrefix = "user_rate_limit:"
	}

	return func(c *gin.Context) {
		AddToTrace(c, "PerUserRateLimiter")
		
		// Get user ID from context
		userID, exists := c.Get("user_id")
		if !exists {
			// Fall back to IP-based rate limiting for unauthenticated users
			clientIP := c.ClientIP()
			key := config.KeyPrefix + "ip:" + clientIP
			
			ctx := c.Request.Context()
			allowed, err := isRequestAllowed(ctx, config.Cache, key, config.RPS, config.Burst, config.WindowSize)
			if err != nil {
				c.Header("X-RateLimit-Error", "true")
				c.Next()
				return
			}
			
			if !allowed {
				response.Error(c, http.StatusTooManyRequests, "Rate limit exceeded")
				c.Abort()
				return
			}
			
			c.Next()
			return
		}
		
		// Use user ID for rate limiting
		key := config.KeyPrefix + "user:" + fmt.Sprintf("%v", userID)
		
		ctx := c.Request.Context()
		allowed, err := isRequestAllowed(ctx, config.Cache, key, config.RPS, config.Burst, config.WindowSize)
		if err != nil {
			c.Header("X-RateLimit-Error", "true")
			c.Next()
			return
		}

		if !allowed {
			c.Header("X-RateLimit-Limit", strconv.Itoa(config.RPS))
			c.Header("X-RateLimit-Remaining", "0")
			
			response.Error(c, http.StatusTooManyRequests, "Rate limit exceeded")
			c.Abort()
			return
		}

		// Set rate limit headers
		remaining, _ := getRemainingRequests(ctx, config.Cache, key, config.RPS, config.WindowSize)
		c.Header("X-RateLimit-Limit", strconv.Itoa(config.RPS))
		c.Header("X-RateLimit-Remaining", strconv.Itoa(remaining))

		c.Next()
	}
}