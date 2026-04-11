package errors

import (
	"errors"
	"fmt"
)

// Error types for consistent error handling
var (
	// Authentication errors
	ErrUnauthorized       = errors.New("unauthorized")
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrTokenExpired       = errors.New("token expired")
	ErrTokenInvalid       = errors.New("token invalid")
	ErrAccountFrozen      = errors.New("account frozen")
	ErrAccountPending     = errors.New("account pending approval")
	ErrEmailNotVerified   = errors.New("email not verified")

	// Authorization errors
	ErrForbidden          = errors.New("forbidden")
	ErrInsufficientPermissions = errors.New("insufficient permissions")

	// Resource errors
	ErrNotFound           = errors.New("resource not found")
	ErrAlreadyExists      = errors.New("resource already exists")
	ErrConflict           = errors.New("resource conflict")

	// Validation errors
	ErrInvalidInput       = errors.New("invalid input")
	ErrValidationFailed   = errors.New("validation failed")
	ErrInvalidFormat      = errors.New("invalid format")

	// Rate limiting errors
	ErrRateLimitExceeded  = errors.New("rate limit exceeded")
	ErrTooManyRequests    = errors.New("too many requests")

	// External service errors
	ErrExternalService    = errors.New("external service error")
	ErrDatabaseError      = errors.New("database error")
	ErrCacheError         = errors.New("cache error")

	// Business logic errors
	ErrOperationFailed    = errors.New("operation failed")
	ErrInvalidState       = errors.New("invalid state")
)

// AppError represents an application error with additional context
type AppError struct {
	Code    string
	Message string
	Err     error
	Details map[string]interface{}
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %v", e.Message, e.Err)
	}
	return e.Message
}

func (e *AppError) Unwrap() error {
	return e.Err
}

// NewAppError creates a new application error
func NewAppError(code, message string, err error) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
		Err:     err,
		Details: make(map[string]interface{}),
	}
}

// WithDetail adds a detail to the error
func (e *AppError) WithDetail(key string, value interface{}) *AppError {
	e.Details[key] = value
	return e
}

// ValidationError represents a validation error with field-specific errors
type ValidationError struct {
	Fields map[string]string
}

func (e *ValidationError) Error() string {
	return "validation failed"
}

// NewValidationError creates a new validation error
func NewValidationError() *ValidationError {
	return &ValidationError{
		Fields: make(map[string]string),
	}
}

// AddField adds a field error
func (e *ValidationError) AddField(field, message string) *ValidationError {
	e.Fields[field] = message
	return e
}

// HasErrors returns true if there are any field errors
func (e *ValidationError) HasErrors() bool {
	return len(e.Fields) > 0
}

// Helper functions for common error patterns

// Wrap wraps an error with additional context
func Wrap(err error, message string) error {
	if err == nil {
		return nil
	}
	return fmt.Errorf("%s: %w", message, err)
}

// WrapWithCode wraps an error with a code and message
func WrapWithCode(code, message string, err error) *AppError {
	return NewAppError(code, message, err)
}

// IsNotFound checks if an error is a not found error
func IsNotFound(err error) bool {
	return errors.Is(err, ErrNotFound)
}

// IsUnauthorized checks if an error is an unauthorized error
func IsUnauthorized(err error) bool {
	return errors.Is(err, ErrUnauthorized) || errors.Is(err, ErrInvalidCredentials)
}

// IsForbidden checks if an error is a forbidden error
func IsForbidden(err error) bool {
	return errors.Is(err, ErrForbidden) || errors.Is(err, ErrInsufficientPermissions)
}

// IsValidation checks if an error is a validation error
func IsValidation(err error) bool {
	var validationErr *ValidationError
	return errors.As(err, &validationErr)
}

// IsRateLimit checks if an error is a rate limit error
func IsRateLimit(err error) bool {
	return errors.Is(err, ErrRateLimitExceeded) || errors.Is(err, ErrTooManyRequests)
}