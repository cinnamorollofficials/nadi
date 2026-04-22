package utils

import (
	"github.com/google/uuid"
	"strings"
)

// GenerateUID generates a short, URL-safe identifier based on a UUID.
// It uses the first 12 characters of a UUID which provides enough entropy for chat channel IDs
// while staying short and clean in URLs.
func GenerateUID() string {
	id := uuid.New().String()
	return strings.ReplaceAll(id[:13], "-", "")
}
