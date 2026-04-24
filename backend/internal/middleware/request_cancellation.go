package middleware

import (
	"context"
	"time"

	"github.com/gin-gonic/gin"
)

func RequestCancellation(timeout time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Skip timeout for WebSocket connections
		if c.GetHeader("Upgrade") == "websocket" {
			c.Next()
			return
		}

		// Use the context with timeout directly for the request context.
		// Handlers down the chain can check c.Request.Context().Done().
		ctx, cancel := context.WithTimeout(c.Request.Context(), timeout)
		defer cancel()

		c.Request = c.Request.WithContext(ctx)

		// Continue synchronously.
		c.Next()
	}
}
