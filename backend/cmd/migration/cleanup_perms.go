package main

import (
	"github.com/hadi-projects/go-react-starter/config"
	"github.com/hadi-projects/go-react-starter/pkg/database"
	"github.com/hadi-projects/go-react-starter/pkg/logger"
)

func main() {
	cfg := config.LoadConfig()
	logger.InitLogger(&cfg)

	db, err := database.NewMySQLConnection(&cfg)
	if err != nil {
		logger.SystemLogger.Fatal().Err(err).Msg("Failed to connect to database")
	}

	logger.SystemLogger.Info().Msg("Starting permission system cleanup...")

	// 1. Clear role_has_permissions link table
	if err := db.Exec("DELETE FROM role_has_permissions").Error; err != nil {
		logger.SystemLogger.Warn().Err(err).Msg("Failed to clear role_has_permissions (might be empty)")
	}

	// 2. Clear permissions table and reset AI
	if err := db.Exec("SET FOREIGN_KEY_CHECKS = 0").Error; err != nil {
		logger.SystemLogger.Fatal().Err(err).Msg("Failed to disable FK checks")
	}
	
	if err := db.Exec("TRUNCATE TABLE permissions").Error; err != nil {
		logger.SystemLogger.Fatal().Err(err).Msg("Failed to truncate permissions table")
	}

	if err := db.Exec("SET FOREIGN_KEY_CHECKS = 1").Error; err != nil {
		logger.SystemLogger.Fatal().Err(err).Msg("Failed to enable FK checks")
	}

	logger.SystemLogger.Info().Msg("Permission cleanup completed successfully. You can now run the seeder.")
}
