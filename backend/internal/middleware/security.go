package middleware

import (
	"github.com/gin-gonic/gin"
)

func SecureHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		AddToTrace(c, "SecureHeaders")
		c.Header("X-Frame-Options", "DENY")
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		// Improved CSP with more specific directives
		c.Header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'")
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")
		c.Header("Permissions-Policy", "geolocation=(), microphone=(), camera=()")

		// Removed SQL injection regex detection as it provides false security
		// GORM's parameterized queries already protect against SQL injection
		// Regex patterns can be bypassed and create false positives
		// 
		// Security Note: Real SQL injection protection comes from:
		// 1. Parameterized queries (GORM handles this)
		// 2. Input validation at the application layer
		// 3. Principle of least privilege for database users
		// 4. Regular security audits

		c.Next()
	}
}