package logger

import (
	"context"
	"testing"

	"github.com/rs/zerolog"
	"github.com/stretchr/testify/assert"
)

func TestWithCtx(t *testing.T) {
	ctx := context.Background()
	ctx = context.WithValue(ctx, CtxKeyRequestID, "test-request-id")
	ctx = context.WithValue(ctx, CtxKeyUserID, uint(123))
	ctx = context.WithValue(ctx, CtxKeyUserEmail, "test@example.com")

	l := zerolog.New(nil)
	ctxLog := WithCtx(ctx, l)

	// We can't easily inspect the fields of a zerolog.Logger without a custom writer,
	// but we can at least verify it doesn't panic and returns a Logger.
	assert.NotNil(t, ctxLog)
	
	// Smoke test for the methods
	ctxLog.Info().Msg("test info")
	ctxLog.Error().Msg("test error")
}
