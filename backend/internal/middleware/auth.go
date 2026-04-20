package middleware

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/hadi-projects/go-react-starter/pkg/cache"
	"github.com/hadi-projects/go-react-starter/pkg/logger"
	"github.com/hadi-projects/go-react-starter/pkg/response"
	"github.com/hadi-projects/go-react-starter/pkg/token"
)

func AuthMiddleware(jwtSecret string, cacheService cache.CacheService) gin.HandlerFunc {
	blacklist := token.NewBlacklist(cacheService)

	return func(c *gin.Context) {
		AddToTrace(c, "AuthMiddleware")
		authHeader := c.GetHeader("Authorization")
		tokenString := ""

		if authHeader != "" {
			parts := strings.Split(authHeader, " ")
			if len(parts) == 2 && parts[0] == "Bearer" {
				tokenString = parts[1]
			}
		}

		// Fallback to query parameter (common for WebSockets)
		if tokenString == "" {
			tokenString = c.Query("token")
		}

		if tokenString == "" {
			response.Error(c, http.StatusUnauthorized, "Authorization token is required")
			c.Abort()
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(jwtSecret), nil
		})

		if err != nil || !token.Valid {
			response.Error(c, http.StatusUnauthorized, "Invalid or expired token")
			c.Abort()
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			// Check if token is revoked
			if jti, ok := claims["jti"].(string); ok {
				revoked, err := blacklist.IsRevoked(c.Request.Context(), jti)
				if err != nil {
					logger.SystemLogger.Error().Err(err).Msg("Failed to check token revocation status")
					// Continue anyway - don't block on cache failure
				} else if revoked {
					response.Error(c, http.StatusUnauthorized, "Token has been revoked")
					c.Abort()
					return
				}
			}

			var userID uint
			var userEmail string

			// Cast sub to uint
			if subFloat, ok := claims["sub"].(float64); ok {
				userID = uint(subFloat)
				c.Set("user_id", userID)
			}
			if email, ok := claims["email"].(string); ok {
				userEmail = email
				c.Set("user_email", userEmail)
			}
			c.Set("role", claims["role"])

			// Also set in request context for logger.WithCtx compatibility
			ctx := c.Request.Context()
			if userID != 0 {
				ctx = context.WithValue(ctx, logger.CtxKeyUserID, userID)
			}
			if userEmail != "" {
				ctx = context.WithValue(ctx, logger.CtxKeyUserEmail, userEmail)
			}
			c.Request = c.Request.WithContext(ctx)

			if permissionsMaskFloat, ok := claims["permissions_mask"].(float64); ok {
				permissionsMask := uint64(permissionsMaskFloat)
				c.Set("permissions_mask", permissionsMask)
			} else {
				// Set empty mask to avoid "not found" error in guard
				c.Set("permissions_mask", uint64(0))
			}
		} else {
			response.Error(c, http.StatusUnauthorized, "Invalid token claims")
			c.Abort()
			return
		}

		c.Next()
	}
}
