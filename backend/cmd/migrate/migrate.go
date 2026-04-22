package main

import (
	"github.com/google/uuid"
	"github.com/hadi-projects/go-react-starter/config"
	customEntity "github.com/hadi-projects/go-react-starter/internal/entity"
	entity "github.com/hadi-projects/go-react-starter/internal/entity/default"
	"github.com/hadi-projects/go-react-starter/pkg/database"
	"github.com/hadi-projects/go-react-starter/pkg/database/seeder"
	"github.com/hadi-projects/go-react-starter/pkg/logger"
)

func main() {
	cfg := config.LoadConfig()
	logger.InitLogger(&cfg)

	db, err := database.NewMySQLConnection(&cfg)
	if err != nil {
		logger.SystemLogger.Fatal().Err(err).Msg("Failed to connect to database")
	}

	logger.SystemLogger.Info().Msg("Starting auto-migration...")

	// Truncate tables for a clean start as requested
	logger.SystemLogger.Info().Msg("Truncating chat tables...")
	db.Exec("SET FOREIGN_KEY_CHECKS = 0;")
	db.Exec("TRUNCATE TABLE chat_channels;")
	db.Exec("TRUNCATE TABLE chat_messages;")
	db.Exec("SET FOREIGN_KEY_CHECKS = 1;")

	err = db.AutoMigrate(
		&entity.User{},
		&entity.Role{},
		&entity.Permission{},
		&entity.PasswordResetToken{},
		&entity.HttpLog{},
		&entity.SystemLog{},
		&entity.AuditLog{},
		&entity.RefreshToken{},
		&entity.TwoFAResetToken{},
		&customEntity.StorageFile{},
		&customEntity.ShareLink{},
		&customEntity.ShareLinkAccess{},
		&entity.Setting{},
		&entity.ApiKey{},
		&entity.EmailVerificationToken{},
		&customEntity.BlogPost{},
		&customEntity.MedicpediaPenyakit{},
		&customEntity.MedicpediaNutrisi{},
		&customEntity.Faq{},
		&customEntity.ChatChannel{},
		&customEntity.ChatMessage{},
		&customEntity.AiUsageLog{},
		// [GENERATOR_INSERT_MIGRATION]
	)

	if err != nil {
		logger.SystemLogger.Fatal().Err(err).Msg("Failed to auto-migrate database")
	}

	// Log this action to the new http_logs table
	logAction := &entity.HttpLog{
		RequestID:       uuid.New().String(),
		Method:          "SYSTEM",
		Path:            "database:migrate",
		ClientIP:        "127.0.0.1",
		UserAgent:       "Go-React-Starter/CLI",
		RequestHeaders:  "{}",
		RequestBody:     "{}",
		StatusCode:      200,
		ResponseHeaders: "{}",
		ResponseBody:    `{"message": "Auto-migration completed successfully"}`,
		Latency:         0,
		UserEmail:       "system@local",
	}
	db.Create(logAction)

	// Run Seeders
	logger.SystemLogger.Info().Msg("Running Seeders...")
	seeder.SeedRole(db)
	seeder.SeedSettings(db)

	logger.SystemLogger.Info().Msg("Auto-migration completed successfully!")
}
