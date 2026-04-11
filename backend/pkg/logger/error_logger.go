package logger

import (
	"context"
	"runtime"

	"github.com/rs/zerolog"
)

// ErrorLogger provides structured error logging
type ErrorLogger struct {
	logger *zerolog.Logger
}

// NewErrorLogger creates a new error logger
func NewErrorLogger(logger *zerolog.Logger) *ErrorLogger {
	return &ErrorLogger{logger: logger}
}

// LogError logs an error with context and stack trace
func (l *ErrorLogger) LogError(ctx context.Context, err error, message string, fields map[string]interface{}) {
	if err == nil {
		return
	}

	event := l.logger.Error().
		Err(err).
		Str("message", message)

	// Add context fields
	if userID, ok := ctx.Value(CtxKeyUserID).(uint); ok {
		event = event.Uint("user_id", userID)
	}
	if userEmail, ok := ctx.Value(CtxKeyUserEmail).(string); ok {
		event = event.Str("user_email", userEmail)
	}
	if requestID, ok := ctx.Value(CtxKeyRequestID).(string); ok {
		event = event.Str("request_id", requestID)
	}

	// Add custom fields
	for key, value := range fields {
		event = event.Interface(key, value)
	}

	// Add stack trace for debugging
	if pc, file, line, ok := runtime.Caller(1); ok {
		funcName := runtime.FuncForPC(pc).Name()
		event = event.
			Str("file", file).
			Int("line", line).
			Str("function", funcName)
	}

	event.Msg("Error occurred")
}

// LogErrorWithStack logs an error with full stack trace
func (l *ErrorLogger) LogErrorWithStack(ctx context.Context, err error, message string) {
	if err == nil {
		return
	}

	// Capture stack trace
	stackTrace := make([]map[string]interface{}, 0)
	for i := 1; i < 10; i++ {
		pc, file, line, ok := runtime.Caller(i)
		if !ok {
			break
		}
		funcName := runtime.FuncForPC(pc).Name()
		stackTrace = append(stackTrace, map[string]interface{}{
			"file":     file,
			"line":     line,
			"function": funcName,
		})
	}

	event := l.logger.Error().
		Err(err).
		Str("message", message).
		Interface("stack_trace", stackTrace)

	// Add context fields
	if userID, ok := ctx.Value(CtxKeyUserID).(uint); ok {
		event = event.Uint("user_id", userID)
	}
	if userEmail, ok := ctx.Value(CtxKeyUserEmail).(string); ok {
		event = event.Str("user_email", userEmail)
	}
	if requestID, ok := ctx.Value(CtxKeyRequestID).(string); ok {
		event = event.Str("request_id", requestID)
	}

	event.Msg("Error with stack trace")
}

// LogPanic logs a panic with recovery information
func (l *ErrorLogger) LogPanic(ctx context.Context, recovered interface{}, message string) {
	// Capture stack trace
	stackTrace := make([]map[string]interface{}, 0)
	for i := 1; i < 10; i++ {
		pc, file, line, ok := runtime.Caller(i)
		if !ok {
			break
		}
		funcName := runtime.FuncForPC(pc).Name()
		stackTrace = append(stackTrace, map[string]interface{}{
			"file":     file,
			"line":     line,
			"function": funcName,
		})
	}

	event := l.logger.Fatal().
		Interface("panic", recovered).
		Str("message", message).
		Interface("stack_trace", stackTrace)

	// Add context fields
	if userID, ok := ctx.Value(CtxKeyUserID).(uint); ok {
		event = event.Uint("user_id", userID)
	}
	if userEmail, ok := ctx.Value(CtxKeyUserEmail).(string); ok {
		event = event.Str("user_email", userEmail)
	}
	if requestID, ok := ctx.Value(CtxKeyRequestID).(string); ok {
		event = event.Str("request_id", requestID)
	}

	event.Msg("Panic recovered")
}

// Global error logger instance
var ErrorLog *ErrorLogger

// InitErrorLogger initializes the global error logger
func InitErrorLogger(logger *zerolog.Logger) {
	ErrorLog = NewErrorLogger(logger)
}

// Helper functions for common error logging patterns

// LogDatabaseError logs a database error
func LogDatabaseError(ctx context.Context, err error, operation string) {
	if ErrorLog != nil {
		ErrorLog.LogError(ctx, err, "Database error", map[string]interface{}{
			"operation": operation,
			"type":      "database",
		})
	}
}

// LogCacheError logs a cache error
func LogCacheError(ctx context.Context, err error, operation string) {
	if ErrorLog != nil {
		ErrorLog.LogError(ctx, err, "Cache error", map[string]interface{}{
			"operation": operation,
			"type":      "cache",
		})
	}
}

// LogExternalServiceError logs an external service error
func LogExternalServiceError(ctx context.Context, err error, service string) {
	if ErrorLog != nil {
		ErrorLog.LogError(ctx, err, "External service error", map[string]interface{}{
			"service": service,
			"type":    "external_service",
		})
	}
}

// LogValidationError logs a validation error
func LogValidationError(ctx context.Context, err error, fields map[string]string) {
	if ErrorLog != nil {
		ErrorLog.LogError(ctx, err, "Validation error", map[string]interface{}{
			"fields": fields,
			"type":   "validation",
		})
	}
}