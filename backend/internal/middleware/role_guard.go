package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hadi-projects/go-react-starter/pkg/response"
)

func RoleGuard(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("role")
		if !exists {
			response.Error(c, http.StatusForbidden, "Role not found in context")
			c.Abort()
			return
		}

		roleStr, ok := userRole.(string)
		if !ok {
			response.Error(c, http.StatusForbidden, "Invalid role format")
			c.Abort()
			return
		}

		for _, role := range allowedRoles {
			if role == roleStr {
				c.Next()
				return
			}
		}

		response.Error(c, http.StatusForbidden, "Forbidden: Insufficient permissions")
		c.Abort()
	}
}
