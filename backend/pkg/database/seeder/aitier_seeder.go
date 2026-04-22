package seeder

import (
	entity "github.com/hadi-projects/go-react-starter/internal/entity/default"
	"github.com/hadi-projects/go-react-starter/pkg/logger"
	"gorm.io/gorm"
)

func SeedAiTier(db *gorm.DB) {
	tiers := []entity.AiTier{
		{
			Name:        "Basic",
			DailyLimit:  20,
			Description: "Free tier for all users.",
			IsDefault:   true,
		},
		{
			Name:        "Gold",
			DailyLimit:  100,
			Description: "Premium tier for health enthusiasts.",
			IsDefault:   false,
		},
		{
			Name:        "Platinum",
			DailyLimit:  1000,
			Description: "Unlimited power for medical professionals.",
			IsDefault:   false,
		},
	}

	for _, t := range tiers {
		var count int64
		db.Model(&entity.AiTier{}).Where("name = ?", t.Name).Count(&count)
		if count == 0 {
			if err := db.Create(&t).Error; err != nil {
				logger.SystemLogger.Error().Err(err).Msgf("Failed to seed AI Tier: %s", t.Name)
			}
		}
	}
}
