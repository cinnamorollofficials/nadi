package utils

import (
	"errors"
	"github.com/gin-gonic/gin"
)

// GetUserID safely extracts user ID from gin context
func GetUserID(c *gin.Context) (uint, error) {
	userID, exists := c.Get("user_id")
	if !exists {
		return 0, errors.New("user_id not found in context")
	}
	
	uid, ok := userID.(uint)
	if !ok {
		return 0, errors.New("user_id is not of type uint")
	}
	
	return uid, nil
}

// GetUserEmail safely extracts user email from gin context
func GetUserEmail(c *gin.Context) (string, error) {
	userEmail, exists := c.Get("user_email")
	if !exists {
		return "", errors.New("user_email not found in context")
	}
	
	email, ok := userEmail.(string)
	if !ok {
		return "", errors.New("user_email is not of type string")
	}
	
	return email, nil
}

// GetPermissionsMask safely extracts permissions mask from gin context
func GetPermissionsMask(c *gin.Context) (uint64, error) {
	permissionsMask, exists := c.Get("permissions_mask")
	if !exists {
		return 0, errors.New("permissions_mask not found in context")
	}
	
	mask, ok := permissionsMask.(uint64)
	if !ok {
		return 0, errors.New("permissions_mask is not of type uint64")
	}
	
	return mask, nil
}