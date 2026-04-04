package middleware

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/hadi-projects/go-react-starter/config"
	entity "github.com/hadi-projects/go-react-starter/internal/entity/default"
	repository "github.com/hadi-projects/go-react-starter/internal/repository/default"
	"github.com/hadi-projects/go-react-starter/pkg/logger"
)

var sensitiveKeys = map[string]bool{
	"password":              true,
	"token":                 true,
	"access_token":          true,
	"refresh_token":         true,
	"new_password":          true,
	"old_password":          true,
	"password_confirmation": true,
	"credit_card":           true,
	"cvv":                   true,
	"pan":                   true,
	"card_number":           true,
	"card_expiry":           true,
	"otp":                   true,
	"otp_code":              true,
	"secret_key":            true,
	"nik":                   true,
	"ktp_number":            true,
	"identity_number":       true,
}

var partialSensitiveKeys = map[string]bool{
	"email":        true,
	"phone":        true,
	"phone_number": true,
}

type bodyLogWriter struct {
	gin.ResponseWriter
	body *bytes.Buffer
}

func (w bodyLogWriter) Write(b []byte) (int, error) {
	w.body.Write(b)
	return w.ResponseWriter.Write(b)
}

func RequestLogger(cfg *config.Config, logRepo repository.HttpLogRepository) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		start := time.Now()
		path := ctx.Request.URL.Path
		method := ctx.Request.Method
		clientIP := ctx.ClientIP()
		userAgent := ctx.Request.UserAgent()

		requestID := uuid.New().String()
		AddToTrace(ctx, "Request Started")

		// Set in Gin context for potential usage in other middleware/handlers
		ctx.Set("request_id", requestID)
		// Set in Request context for the WithCtx helper (standard context.Context)
		ctx.Request = ctx.Request.WithContext(context.WithValue(ctx.Request.Context(), logger.CtxKeyRequestID, requestID))
		
		ctx.Header("X-Request-ID", requestID)

		var body []byte
		if ctx.Request.Body != nil {
			body, _ = io.ReadAll(ctx.Request.Body)
			ctx.Request.Body = io.NopCloser(bytes.NewBuffer(body))
		}

		blw := &bodyLogWriter{body: bytes.NewBufferString(""), ResponseWriter: ctx.Writer}
		ctx.Writer = blw

		ctx.Next()

		AddToTrace(ctx, "Response Sent")

		latency := time.Since(start)
		statusCode := ctx.Writer.Status()
		userID, userExists := ctx.Get("user_id")

		// Log to zerolog (file)
		logger.WithCtx(ctx.Request.Context(), logger.SystemLogger).Info().
			Str("method", method).
			Str("path", path).
			Int("status", statusCode).
			Int64("latency_ms", latency.Milliseconds()).
			Msg("HTTP Request")

		// Async save to database
		go func() {
			censoredReqHeaders := censorHeaders(ctx.Request.Header)
			reqHeadersJSON, _ := json.Marshal(censoredReqHeaders)
			
			censoredResHeaders := censorHeaders(ctx.Writer.Header())
			resHeadersJSON, _ := json.Marshal(censoredResHeaders)
			
			var uID *uint
			if userExists {
				id := userID.(uint)
				uID = &id
			}

			// Get user email if available (set by AuthMiddleware)
			userEmailStr := ""
			if email, eExists := ctx.Get("user_email"); eExists {
				userEmailStr = maskEmail(email.(string))
			}

			var reqBodyStr string
			if len(body) > 0 {
				reqBodyStr = string(censorBody(body))
			}
			
			var resBodyStr string
			if blw.body.Len() > 0 && !strings.Contains(path, "/logs") && blw.body.Len() < 512*1024 { // 512KB limit for DB
				resBodyStr = string(censorBody(blw.body.Bytes()))
			} else if blw.body.Len() > 0 {
				resBodyStr = "[skipped or too large]"
			}

			httpLog := &entity.HttpLog{
				RequestID:       requestID,
				Method:          method,
				Path:            path,
				ClientIP:        clientIP,
				UserAgent:       userAgent,
				RequestHeaders:  string(reqHeadersJSON),
				RequestBody:     reqBodyStr,
				StatusCode:      statusCode,
				ResponseHeaders: string(resHeadersJSON),
				ResponseBody:    resBodyStr,
				Latency:         latency.Milliseconds(),
				UserID:          uID,
				UserEmail:       userEmailStr,
				MiddlewareTrace: GetTraceString(ctx),
			}
			if logRepo != nil {
				_ = logRepo.Create(httpLog)
			}
		}()
	}
}

func censorHeaders(headers map[string][]string) map[string][]string {
	censored := make(map[string][]string)
	for k, v := range headers {
		lowerK := strings.ToLower(k)
		if lowerK == "authorization" || lowerK == "cookie" || lowerK == "set-cookie" || lowerK == "x-csrf-token" {
			censored[k] = []string{"***"}
		} else {
			// Copy slice
			vc := make([]string, len(v))
			copy(vc, v)
			censored[k] = vc
		}
	}
	return censored
}

func censorBody(body []byte) []byte {
	var data any
	if err := json.Unmarshal(body, &data); err != nil {
		return body
	}

	maskedData := maskSensitiveData(data)
	if maskedBody, err := json.Marshal(maskedData); err == nil {
		return maskedBody
	}

	return body
}

func maskSensitiveData(data any) any {

	switch v := data.(type) {
	case map[string]any:
		for key, val := range v {
			lowerKey := strings.ToLower(key)
			if sensitiveKeys[lowerKey] {
				v[key] = "***"
			} else if partialSensitiveKeys[lowerKey] {
				if strVal, ok := val.(string); ok {
					if strings.Contains(lowerKey, "email") {
						v[key] = maskEmail(strVal)
					} else {
						v[key] = maskPhone(strVal)
					}
				}
			} else {
				v[key] = maskSensitiveData(val)
			}
		}
		return v
	case []any:
		for i, val := range v {
			v[i] = maskSensitiveData(val)
		}

		return v
	}
	return data
}

func maskEmail(email string) string {
	parts := strings.Split(email, "@")
	if len(parts) != 2 {
		return email
	}

	local := parts[0]
	if len(local) <= 2 {
		return local + "@" + parts[1]
	}

	return local[:2] + "**" + local[len(local)-1:] + "@" + parts[1]
}

func maskPhone(phone string) string {
	if len(phone) < 7 {
		return phone
	}

	return phone[:4] + "***" + phone[len(phone)-3:]
}
