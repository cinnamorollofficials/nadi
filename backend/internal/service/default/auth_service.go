package service

import (
	"context"
	"encoding/base64"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/hadi-projects/go-react-starter/config"
	dto "github.com/hadi-projects/go-react-starter/internal/dto/default"
	entity "github.com/hadi-projects/go-react-starter/internal/entity/default"
	repository "github.com/hadi-projects/go-react-starter/internal/repository/default"
	"github.com/hadi-projects/go-react-starter/pkg/cache"
	"github.com/hadi-projects/go-react-starter/pkg/crypto"
	"github.com/hadi-projects/go-react-starter/pkg/kafka"
	"github.com/hadi-projects/go-react-starter/pkg/logger"
	"github.com/hadi-projects/go-react-starter/pkg/mailer"
	tokenPkg "github.com/hadi-projects/go-react-starter/pkg/token"
	"github.com/pquerna/otp/totp"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/api/idtoken"
)

type AuthService interface {
	Login(ctx context.Context, req dto.LoginRequest) (*dto.LoginResponse, error)
	ForgotPassword(ctx context.Context, req dto.ForgotPasswordRequest) error
	ResetPassword(ctx context.Context, req dto.ResetPasswordRequest) error
	Logout(ctx context.Context, req dto.LogoutRequest) error
	RefreshToken(ctx context.Context, req dto.RefreshTokenRequest) (*dto.LoginResponse, error)
	Enroll2FA(ctx context.Context, userID uint) (*dto.TwoFAEnrollResponse, error)
	Confirm2FA(ctx context.Context, userID uint, req dto.TwoFAConfirmRequest) error
	Disable2FA(ctx context.Context, userID uint, req dto.TwoFADisableRequest) error
	Verify2FA(ctx context.Context, req dto.TwoFAVerifyRequest) (*dto.LoginResponse, error)
	Request2FAReset(ctx context.Context, req dto.TwoFAResetRequest) error
	Confirm2FAReset(ctx context.Context, req dto.TwoFAResetConfirmRequest) error
	VerifyEmail(ctx context.Context, token string) error
	LoginWithGoogle(ctx context.Context, req dto.GoogleLoginRequest) (*dto.LoginResponse, error)
}

type authService struct {
	userRepo  repository.UserRepository
	tokenRepo repository.TokenRepository
	producer  kafka.Producer
	mailer         mailer.Mailer
	config         *config.Config
	cache          cache.CacheService
	settingService SettingService
}

func NewAuthService(
	userRepo repository.UserRepository,
	tokenRepo repository.TokenRepository,
	producer kafka.Producer,
	mailer mailer.Mailer,
	config *config.Config,
	cache cache.CacheService,
	settingService SettingService,
) AuthService {
	return &authService{
		userRepo:  userRepo,
		tokenRepo: tokenRepo,
		producer:  producer,
		mailer:         mailer,
		config:         config,
		cache:          cache,
		settingService: settingService,
	}
}

func (s *authService) Login(ctx context.Context, req dto.LoginRequest) (*dto.LoginResponse, error) {
	// 1. Find user by email (simple, no preloads)
	user, err := s.userRepo.FindByEmailSimple(ctx, req.Email)
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	if user.Status == "freezed" {
		return nil, errors.New("your account is frozen, please contact administrator")
	}
	if user.Status == "pending" {
		return nil, errors.New("please verify your email before logging in")
	}
	// 2. Verify password
	if user.Password == nil {
		return nil, errors.New("this account does not have a password set, please login with Google")
	}
	err = bcrypt.CompareHashAndPassword([]byte(*user.Password), []byte(req.Password))
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	// 3. Fetch full user data including Role and Permissions for Token generation
	fullUser, err := s.userRepo.FindByID(ctx, user.ID)
	if err != nil {
		return nil, err
	}
	user = fullUser

	// 4. Generate JWT Tokens
	// 4a. If 2FA is enabled, issue a temp token instead of JWT
	if user.TwoFAEnabled {
		tempToken := uuid.New().String()
		tempKey := "2fa_temp:" + tempToken
		s.cache.Set(ctx, tempKey, fmt.Sprintf("%d", user.ID), 5*time.Minute)
		return &dto.LoginResponse{
			Requires2FA: true,
			TempToken:   tempToken,
		}, nil
	}

	// 4b. No 2FA: Generate JWT Tokens directly
	var permissionsMask uint64
	if user.Role.ID != 0 && user.Role.Permissions != nil {
		for _, p := range user.Role.Permissions {
			if p.ID <= 64 {
				permissionsMask |= (uint64(1) << (p.ID - 1))
			}
		}
	}

	accessToken, err := s.generateAccessToken(user, permissionsMask)
	if err != nil {
		return nil, err
	}

	var refreshTokenStr string
	if req.RememberMe {
		refreshTokenStr = uuid.New().String()
		expirationDays := 7
		if s.config.JWT.RefreshExpirationTime != "" {
			fmt.Sscanf(s.config.JWT.RefreshExpirationTime, "%dh", &expirationDays)
		}
		expiresAt := time.Now().Add(time.Hour * time.Duration(24*expirationDays))
		rt := &entity.RefreshToken{
			UserID:    user.ID,
			Token:     refreshTokenStr,
			ExpiresAt: expiresAt,
		}
		if err := s.tokenRepo.CreateRefreshToken(ctx, rt); err != nil {
			return nil, err
		}
	}

	logger.LogAudit(context.WithValue(context.WithValue(ctx, logger.CtxKeyUserID, user.ID), logger.CtxKeyUserEmail, user.Email), "LOGIN", "AUTH", fmt.Sprintf("%d", user.ID), fmt.Sprintf("RememberMe: %v", req.RememberMe))

	// 5. Return response
	userResp := &dto.AuthUserResponse{
		ID:              user.ID,
		Name:            user.Name,
		Email:           user.Email,
		RoleID:          user.RoleID,
		Role:            user.Role.Name,
		PermissionsMask: permissionsMask,
		Status:          user.Status,
		TwoFAEnabled:    user.TwoFAEnabled,
	}
	return &dto.LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshTokenStr,
		User:         userResp,
	}, nil
}

func (s *authService) generateAccessToken(user *entity.User, permissionsMask uint64) (string, error) {
	// Generate unique token ID (JTI) for revocation support
	tokenID := uuid.New().String()
	
	expirationTime := time.Now().Add(time.Minute * 15) // 15 minutes
	
	claims := jwt.MapClaims{
		"jti":              tokenID, // JWT ID for revocation
		"sub":              user.ID,
		"email":            user.Email,
		"role":             user.Role.Name,
		"permissions_mask": permissionsMask,
		"iat":              time.Now().Unix(),
		"exp":              expirationTime.Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(s.config.JWT.Secret))
	if err != nil {
		return "", err
	}
	
	// Track token for potential revocation
	// Note: This is async and non-blocking
	go func() {
		blacklist := tokenPkg.NewBlacklist(s.cache)
		_ = blacklist.TrackUserToken(context.Background(), user.ID, tokenID, expirationTime)
	}()
	
	return tokenString, nil
}

func (s *authService) RefreshToken(ctx context.Context, req dto.RefreshTokenRequest) (*dto.LoginResponse, error) {
	// 1. Find refresh token
	rt, err := s.tokenRepo.FindByRefreshToken(ctx, req.RefreshToken)
	if err != nil {
		return nil, errors.New("invalid or expired refresh token")
	}

	// 2. Check expiration
	if time.Now().After(rt.ExpiresAt) {
		s.tokenRepo.DeleteRefreshToken(ctx, req.RefreshToken)
		return nil, errors.New("refresh token expired")
	}

	if rt.User.Status == "freezed" {
		return nil, errors.New("your account is frozen, please contact administrator")
	}
	if rt.User.Status == "pending" {
		return nil, errors.New("your account is pending approval")
	}

	// 3. Generate new Access Token
	var permissionsMask uint64
	if rt.User.Role.ID != 0 && rt.User.Role.Permissions != nil {
		for _, p := range rt.User.Role.Permissions {
			if p.ID <= 64 {
				permissionsMask |= (uint64(1) << (p.ID - 1))
			}
		}
	}

	accessToken, err := s.generateAccessToken(&rt.User, permissionsMask)
	if err != nil {
		return nil, err
	}

	// 4. Return response
	userResp := &dto.AuthUserResponse{
		ID:              rt.User.ID,
		Name:            rt.User.Name,
		Email:           rt.User.Email,
		RoleID:          rt.User.RoleID,
		Role:            rt.User.Role.Name,
		PermissionsMask: permissionsMask,
		Status:          rt.User.Status,
		TwoFAEnabled:    rt.User.TwoFAEnabled,
	}
	return &dto.LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: rt.Token,
		User:         userResp,
	}, nil
}

func (s *authService) ForgotPassword(ctx context.Context, req dto.ForgotPasswordRequest) error {
	// 1. Find user by email
	user, err := s.userRepo.FindByEmail(ctx, req.Email)
	if err != nil {
		// Return nil to avoid enumerating users
		return nil
	}

	// Audit forgot password
	logger.LogAudit(ctx, "FORGOT_PASSWORD", "AUTH", fmt.Sprintf("%d", user.ID), fmt.Sprintf("email: %s", req.Email))

	// 2. Generate token with 1 hour expiration (extended from 15 minutes)
	token := uuid.New().String()
	expiresAt := time.Now().Add(60 * time.Minute)

	// 3. Save token
	resetToken := &entity.PasswordResetToken{
		UserID:    user.ID,
		Token:     token,
		ExpiresAt: expiresAt,
	}

	if err := s.tokenRepo.Create(ctx, resetToken); err != nil {
		return err
	}

	// 4. Publish message to Kafka
	appName := s.settingService.GetConfigValue(ctx, "app_name")
	logoID := s.settingService.GetConfigValue(ctx, "app_logo")
	logoURL := ""
	if logoID != "" {
		logoURL = s.config.App.URL + "/api/v1/public/storage/" + logoID
	}

	msg := map[string]string{
		"email":    user.Email,
		"token":    token,
		"app_name": appName,
		"logo_url": logoURL,
	}

	// Use configured topic from config
	topic := s.config.Kafka.Topic
	if topic == "" {
		topic = "password-reset"
	}

	var publishErr error
	if s.producer != nil {
		publishErr = s.producer.Publish(ctx, topic, msg)
	} else {
		publishErr = errors.New("kafka producer is not initialized")
	}

	if publishErr != nil {
		logger.SystemLogger.Error().Err(publishErr).Msg("Failed to publish password reset message to Kafka. Falling back to direct email.")

		// Fallback: Send email via goroutine with timeout
		go func() {
			// Create context with timeout to prevent goroutine leaks
			emailCtx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
			defer cancel()
			
			frontendURL := s.config.Frontend.URL
			if frontendURL == "" {
				frontendURL = "http://localhost:5173"
			}
			resetLink := frontendURL + "/reset-password?token=" + token
			
			// Get logo URL
			logoID := s.settingService.GetConfigValue(emailCtx, "app_logo")
			logoURL := ""
			if logoID != "" {
				logoURL = s.config.App.URL + "/api/v1/public/storage/" + logoID
			}

			// Debug log to verify the generated link
			logger.SystemLogger.Info().
				Str("reset_link", resetLink).
				Str("app_name", appName).
				Str("logo_url", logoURL).
				Msg("Generated Reset Password Link")
			
			body := mailer.GetResetPasswordEmailNative(resetLink, appName, logoURL)
			if err := s.mailer.SendEmail(emailCtx, user.Email, "Reset Password Request (Fallback)", body); err != nil {
				logger.SystemLogger.Error().Err(err).Str("email", user.Email).Msg("Failed to send fallback email")
			} else {
				logger.SystemLogger.Info().Str("email", user.Email).Msg("Fallback email sent successfully")
			}
		}()

		// Return nil to client as the request is accepted
		return nil
	}

	return nil
}

func (s *authService) ResetPassword(ctx context.Context, req dto.ResetPasswordRequest) error {
	// 1. Find token
	resetToken, err := s.tokenRepo.FindByToken(ctx, req.Token)
	if err != nil {
		return errors.New("invalid or expired token")
	}

	// 2. Check expiration
	if time.Now().After(resetToken.ExpiresAt) {
		return errors.New("invalid or expired token")
	}

	// 3. Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), s.config.Security.BCryptCost)
	if err != nil {
		return err
	}

	// 4. Update user password
	user := resetToken.User
	hashedPasswordStr := string(hashedPassword)
	user.Password = &hashedPasswordStr
	if err := s.userRepo.Update(ctx, &user); err != nil {
		return err
	}

	// 5. Delete token (and potentially all other tokens for this user)
	if err := s.tokenRepo.DeleteByUserID(ctx, user.ID); err != nil {
		logger.SystemLogger.Error().Err(err).Msg("Failed to delete reset tokens")
	}

	// Audit reset password
	logger.LogAudit(context.WithValue(context.WithValue(ctx, logger.CtxKeyUserID, user.ID), logger.CtxKeyUserEmail, user.Email), "RESET_PASSWORD", "AUTH", fmt.Sprintf("%d", user.ID), "")

	return nil
}

func (s *authService) Logout(ctx context.Context, req dto.LogoutRequest) error {
	userID, _ := ctx.Value(logger.CtxKeyUserID).(uint)

	// Parse token to get JTI for revocation
	if req.Token != "" {
		token, err := jwt.Parse(req.Token, func(token *jwt.Token) (interface{}, error) {
			return []byte(s.config.JWT.Secret), nil
		})
		
		if err == nil && token.Valid {
			if claims, ok := token.Claims.(jwt.MapClaims); ok {
				// Revoke the specific token
				if jti, ok := claims["jti"].(string); ok {
					if exp, ok := claims["exp"].(float64); ok {
						expiresAt := time.Unix(int64(exp), 0)
						blacklist := tokenPkg.NewBlacklist(s.cache)
						if err := blacklist.RevokeToken(ctx, jti, expiresAt); err != nil {
							logger.SystemLogger.Error().Err(err).Msg("Failed to revoke token")
						}
					}
				}
			}
		}
	}

	// Delete refresh token if provided
	if req.RefreshToken != "" {
		if err := s.tokenRepo.DeleteRefreshToken(ctx, req.RefreshToken); err != nil {
			logger.SystemLogger.Error().Err(err).Msg("Failed to delete refresh token")
		}
	}

	// Audit logout
	logger.LogAudit(ctx, "LOGOUT", "AUTH", fmt.Sprintf("%d", userID), fmt.Sprintf("reason: %s", req.Reason))

	return nil
}

// Enroll2FA generates a new TOTP secret for the user (does not activate 2FA yet)
func (s *authService) Enroll2FA(ctx context.Context, userID uint) (*dto.TwoFAEnrollResponse, error) {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, errors.New("user not found")
	}
	if user.TwoFAEnabled {
		return nil, errors.New("2FA is already enabled")
	}

	key, err := totp.Generate(totp.GenerateOpts{
		Issuer:      "GoReactApp",
		AccountName: user.Email,
	})
	if err != nil {
		return nil, err
	}

	// Encrypt the secret before storing
	encryptor, err := s.getEncryptor()
	if err != nil {
		return nil, fmt.Errorf("failed to initialize encryptor: %w", err)
	}
	
	encryptedSecret, err := encryptor.Encrypt(key.Secret())
	if err != nil {
		return nil, fmt.Errorf("failed to encrypt 2FA secret: %w", err)
	}

	// Save the encrypted secret (not enabled yet, needs confirmation)
	user.TwoFASecret = encryptedSecret
	if err := s.userRepo.Update(ctx, user); err != nil {
		return nil, err
	}

	return &dto.TwoFAEnrollResponse{
		Secret: key.Secret(), // Return plaintext for QR code generation
		QRURL:  key.URL(),
	}, nil
}

// Confirm2FA activates 2FA after verifying the first code
func (s *authService) Confirm2FA(ctx context.Context, userID uint, req dto.TwoFAConfirmRequest) error {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return errors.New("user not found")
	}
	if user.TwoFAEnabled {
		return errors.New("2FA is already enabled")
	}
	if user.TwoFASecret == "" {
		return errors.New("no 2FA secret found, please enroll first")
	}

	// Decrypt the secret for validation
	encryptor, err := s.getEncryptor()
	if err != nil {
		return fmt.Errorf("failed to initialize encryptor: %w", err)
	}
	
	decryptedSecret, err := encryptor.Decrypt(user.TwoFASecret)
	if err != nil {
		return fmt.Errorf("failed to decrypt 2FA secret: %w", err)
	}

	// Validate TOTP code
	valid := totp.Validate(req.Code, decryptedSecret)
	if !valid {
		return errors.New("invalid 2FA code")
	}

	// Enable 2FA
	user.TwoFAEnabled = true
	if err := s.userRepo.Update(ctx, user); err != nil {
		return err
	}

	logger.LogAudit(ctx, "ENABLE_2FA", "AUTH", fmt.Sprintf("%d", user.ID), "")
	return nil
}

// Disable2FA verifies the code then turns off 2FA
func (s *authService) Disable2FA(ctx context.Context, userID uint, req dto.TwoFADisableRequest) error {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return errors.New("user not found")
	}
	if !user.TwoFAEnabled {
		return errors.New("2FA is not enabled")
	}

	// Decrypt the secret for validation
	encryptor, err := s.getEncryptor()
	if err != nil {
		return fmt.Errorf("failed to initialize encryptor: %w", err)
	}
	
	decryptedSecret, err := encryptor.Decrypt(user.TwoFASecret)
	if err != nil {
		return fmt.Errorf("failed to decrypt 2FA secret: %w", err)
	}

	// Validate TOTP code
	valid := totp.Validate(req.Code, decryptedSecret)
	if !valid {
		return errors.New("invalid 2FA code")
	}

	// Disable 2FA and clear encrypted secret
	user.TwoFAEnabled = false
	user.TwoFASecret = ""
	user.TwoFACounter = 0
	
	if err := s.userRepo.Update(ctx, user); err != nil {
		return err
	}

	logger.LogAudit(ctx, "DISABLE_2FA", "AUTH", fmt.Sprintf("%d", user.ID), "")
	return nil
}

// Verify2FA exchanges a temp_token + code for a real JWT
func (s *authService) Verify2FA(ctx context.Context, req dto.TwoFAVerifyRequest) (*dto.LoginResponse, error) {
	tempKey := "2fa_temp:" + req.TempToken
	var userIDStr string
	if err := s.cache.Get(ctx, tempKey, &userIDStr); err != nil || userIDStr == "" {
		return nil, errors.New("invalid or expired 2FA session, please login again")
	}

	var userID uint
	fmt.Sscanf(userIDStr, "%d", &userID)

	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, errors.New("user not found")
	}

	// Decrypt the secret for validation
	encryptor, err := s.getEncryptor()
	if err != nil {
		return nil, fmt.Errorf("failed to initialize encryptor: %w", err)
	}
	
	decryptedSecret, err := encryptor.Decrypt(user.TwoFASecret)
	if err != nil {
		return nil, fmt.Errorf("failed to decrypt 2FA secret: %w", err)
	}

	// Validate TOTP code
	valid := totp.Validate(req.Code, decryptedSecret)
	if !valid {
		return nil, errors.New("invalid 2FA code")
	}

	// Delete the temp token
	s.cache.Delete(ctx, tempKey)

	// Generate the full JWT
	return s.generateLoginResponse(ctx, user)
}

// Helper to generate standard login response with audit logging
func (s *authService) generateLoginResponse(ctx context.Context, user *entity.User) (*dto.LoginResponse, error) {
	var permissionsMask uint64
	if user.Role.ID != 0 && user.Role.Permissions != nil {
		for _, p := range user.Role.Permissions {
			if p.ID <= 64 {
				permissionsMask |= (uint64(1) << (p.ID - 1))
			}
		}
	}

	accessToken, err := s.generateAccessToken(user, permissionsMask)
	if err != nil {
		return nil, err
	}

	logger.LogAudit(context.WithValue(ctx, logger.CtxKeyUserID, user.ID), "LOGIN_2FA", "AUTH", fmt.Sprintf("%d", user.ID), "")

	userResp := &dto.AuthUserResponse{
		ID:              user.ID,
		Name:            user.Name,
		Email:           user.Email,
		RoleID:          user.RoleID,
		Role:            user.Role.Name,
		PermissionsMask: permissionsMask,
		Status:          user.Status,
		TwoFAEnabled:    user.TwoFAEnabled,
	}
	return &dto.LoginResponse{
		AccessToken: accessToken,
		User:        userResp,
	}, nil
}

func (s *authService) Request2FAReset(ctx context.Context, req dto.TwoFAResetRequest) error {
	tempKey := "2fa_temp:" + req.TempToken
	var userIDStr string
	if err := s.cache.Get(ctx, tempKey, &userIDStr); err != nil || userIDStr == "" {
		return errors.New("invalid or expired 2FA session")
	}

	var userID uint
	fmt.Sscanf(userIDStr, "%d", &userID)

	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return errors.New("user not found")
	}

	// Delete any existing reset tokens
	s.tokenRepo.DeleteTwoFAResetTokenByUserID(ctx, user.ID)

	token := uuid.New().String()
	expiresAt := time.Now().Add(60 * time.Minute) // Extended from 15 minutes to 1 hour

	resetToken := &entity.TwoFAResetToken{
		UserID:    user.ID,
		Token:     token,
		ExpiresAt: expiresAt,
	}

	if err := s.tokenRepo.CreateTwoFAResetToken(ctx, resetToken); err != nil {
		return err
	}

	frontendURL := s.config.Frontend.URL
	if frontendURL == "" {
		frontendURL = "http://localhost:5173"
	}
	resetLink := frontendURL + "/twofa/reset-confirm?token=" + token

	appName := s.settingService.GetConfigValue(ctx, "app_name")
	logoID := s.settingService.GetConfigValue(ctx, "app_logo")
	logoURL := ""
	if logoID != "" {
		logoURL = s.config.App.URL + "/api/v1/public/storage/" + logoID
	}

	// 2FA Reset Email with Kafka Fallback
	msg := map[string]string{
		"type":        "twofa-reset",
		"email":       user.Email,
		"token":       token,
		"app_name":    appName,
		"logo_url":    logoURL,
		"reset_link":  resetLink,
	}

	var publishErr error
	if s.producer != nil {
		publishErr = s.producer.Publish(ctx, "twofa-reset", msg)
	} else {
		publishErr = errors.New("kafka producer not initialized")
	}

	if publishErr != nil {
		logger.SystemLogger.Error().Err(publishErr).Msg("Failed to publish 2FA reset message to Kafka. Falling back to direct email.")
		go func() {
			// Create context with timeout to prevent goroutine leaks
			emailCtx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
			defer cancel()
			
			body := mailer.GetTwoFAResetEmailNative(resetLink, appName, logoURL)
			if err := s.mailer.SendEmail(emailCtx, user.Email, "Reset Two-Factor Authentication", body); err != nil {
				logger.SystemLogger.Error().Err(err).Str("email", user.Email).Msg("Failed to send 2FA reset email (fallback)")
			} else {
				logger.SystemLogger.Info().Str("email", user.Email).Msg("2FA reset email (fallback) sent successfully")
			}
		}()
	}

	return nil
}

func (s *authService) Confirm2FAReset(ctx context.Context, req dto.TwoFAResetConfirmRequest) error {
	resetToken, err := s.tokenRepo.FindByTwoFAResetToken(ctx, req.Token)
	if err != nil {
		return errors.New("invalid or expired token")
	}

	if time.Now().After(resetToken.ExpiresAt) {
		return errors.New("invalid or expired token")
	}

	user := resetToken.User
	user.TwoFAEnabled = false
	user.TwoFASecret = ""
	user.TwoFACounter = 0

	if err := s.userRepo.Update(ctx, &user); err != nil {
		return err
	}

	if err := s.tokenRepo.DeleteTwoFAResetTokenByUserID(ctx, user.ID); err != nil {
		logger.SystemLogger.Error().Err(err).Msg("Failed to delete 2FA reset tokens")
	}

	logger.LogAudit(context.WithValue(context.WithValue(ctx, logger.CtxKeyUserID, user.ID), logger.CtxKeyUserEmail, user.Email), "RESET_2FA", "AUTH", fmt.Sprintf("%d", user.ID), "")

	return nil
}

func (s *authService) VerifyEmail(ctx context.Context, token string) error {
	// 1. Find token
	verifyToken, err := s.tokenRepo.FindByEmailVerificationToken(ctx, token)
	if err != nil {
		return errors.New("invalid or expired verification token")
	}

	// 2. Check expiration
	if time.Now().After(verifyToken.ExpiresAt) {
		return errors.New("verification token has expired")
	}

	// 3. Update user status
	user := verifyToken.User
	user.Status = "active"
	if err := s.userRepo.Update(ctx, &user); err != nil {
		return err
	}

	// 4. Delete all verification tokens for this user
	if err := s.tokenRepo.DeleteEmailVerificationTokenByUserID(ctx, user.ID); err != nil {
		logger.SystemLogger.Error().Err(err).Msg("Failed to delete verification tokens")
	}

	// Audit log
	logger.LogAudit(context.WithValue(context.WithValue(ctx, logger.CtxKeyUserID, user.ID), logger.CtxKeyUserEmail, user.Email), "VERIFY_EMAIL", "AUTH", fmt.Sprintf("%d", user.ID), "")

	return nil
}

func (s *authService) LoginWithGoogle(ctx context.Context, req dto.GoogleLoginRequest) (*dto.LoginResponse, error) {
	// 1. Verify Google ID Token with proper ClientID validation
	payload, err := idtoken.Validate(ctx, req.Credential, s.config.Google.ClientID)
	if err != nil {
		return nil, errors.New("invalid google token")
	}

	googleID := payload.Subject
	email := payload.Claims["email"].(string)
	name := payload.Claims["name"].(string)
	picture := payload.Claims["picture"].(string)

	// 2. Find user by GoogleID
	user, err := s.userRepo.FindByGoogleID(ctx, googleID)
	if err != nil {
		// 3. If not found by GoogleID, check by Email
		user, err = s.userRepo.FindByEmail(ctx, email)
		if err != nil {
			// 4. Not found by Email either: Create new user
			roleID := uint(2) // Default fallback
			role, err := s.userRepo.FindRoleByName(ctx, "user")
			if err == nil {
				roleID = role.ID
			}

			user = &entity.User{
				Name:      name,
				Email:     email,
				GoogleID:  &googleID,
				AvatarURL: &picture,
				RoleID:    roleID,
				Status:    "active", // Google users are pre-verified
			}
			if err := s.userRepo.Create(ctx, user); err != nil {
				return nil, err
			}
			// Fetch fresh user with Role/Permissions
			user, _ = s.userRepo.FindByID(ctx, user.ID)
		} else {
			// 5. Found by Email: Link GoogleID
			user.GoogleID = &googleID
			user.AvatarURL = &picture
			if err := s.userRepo.Update(ctx, user); err != nil {
				return nil, err
			}
		}
	}

	if user.Status == "freezed" {
		return nil, errors.New("your account is frozen")
	}

	// 6. Generate standard login response
	return s.generateLoginResponse(ctx, user)
}

// getEncryptor returns an encryptor instance for encrypting sensitive data
func (s *authService) getEncryptor() (*crypto.Encryptor, error) {
	keyBytes, err := base64.StdEncoding.DecodeString(s.config.Security.EncryptionKey)
	if err != nil {
		return nil, fmt.Errorf("invalid encryption key: %w", err)
	}
	
	return crypto.NewEncryptor(keyBytes)
}
