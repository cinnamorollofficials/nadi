package database

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/hadi-projects/go-react-starter/config"
	"github.com/hadi-projects/go-react-starter/pkg/logger"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func NewMySQLConnection(cfg *config.Config) (*gorm.DB, error) {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		cfg.Database.UserName,
		cfg.Database.Password,
		cfg.Database.Host,
		cfg.Database.Port,
		cfg.Database.Name,
	)

	dbLogger := logger.NewGormLogger(logger.DBLogger)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: dbLogger,
	})

	if err != nil {
		return nil, fmt.Errorf("failed to open database connection: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get sql.DB instance: %w", err)
	}

	// Configure connection pool
	sqlDB.SetMaxIdleConns(cfg.Database.MaxIdleConns)
	sqlDB.SetMaxOpenConns(cfg.Database.MaxOpenConns)
	sqlDB.SetConnMaxLifetime(time.Duration(cfg.Database.MaxLifetime) * time.Minute)

	// Log connection pool configuration
	logger.SystemLogger.Info().
		Int("max_idle_conns", cfg.Database.MaxIdleConns).
		Int("max_open_conns", cfg.Database.MaxOpenConns).
		Int("max_lifetime_minutes", cfg.Database.MaxLifetime).
		Msg("Database connection pool configured")

	// Start connection pool monitoring goroutine
	go monitorConnectionPool(sqlDB)

	return db, nil
}

// monitorConnectionPool logs connection pool stats periodically
func monitorConnectionPool(sqlDB interface{ Stats() sql.DBStats }) {
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		stats := sqlDB.Stats()
		logger.SystemLogger.Info().
			Int("open_connections", stats.OpenConnections).
			Int("in_use", stats.InUse).
			Int("idle", stats.Idle).
			Int64("wait_count", stats.WaitCount).
			Dur("wait_duration", stats.WaitDuration).
			Msg("Database connection pool stats")
	}
}
