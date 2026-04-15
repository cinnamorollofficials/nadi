package seeder

import (
	"context"

	entity "github.com/hadi-projects/go-react-starter/internal/entity/default"
	repository "github.com/hadi-projects/go-react-starter/internal/repository/default"
	"github.com/hadi-projects/go-react-starter/pkg/logger"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var users = []map[string]string{
	{"email": "admin@mail.com", "password": "Password@123", "role": "superadmin"},
	{"email": "budi@mail.com", "password": "Password@123", "role": "admin"},
	{"email": "annisa@mail.com", "password": "Password@123", "role": "admin"},
}

func SeedUser(db *gorm.DB, bcryptCost int) {
	for _, userData := range users {
		email := userData["email"]
		password := userData["password"]
		roleName := userData["role"]

		// Find role by name instead of using hardcoded ID
		var role entity.Role
		if err := db.Where("name = ?", roleName).First(&role).Error; err != nil {
			logger.SystemLogger.Error().Err(err).Msgf("Failed to find role %s for user %s", roleName, email)
			continue
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcryptCost)
		if err != nil {
			logger.SystemLogger.Error().Err(err).Msgf("Failed to hash password for user %s", email)
			continue
		}

		var user entity.User
		if err := db.Where("email = ?", email).First(&user).Error; err == nil {
			logger.SystemLogger.Info().Msgf("User %s already exists, skipping.", email)
			continue
		}

		hashedPasswordStr := string(hashedPassword)
		user = entity.User{
			Email:    email,
			Password: &hashedPasswordStr,
			RoleID:   role.ID, // Use the found role's ID
			Name:     email, // Temporary: using email as name if not provided
		}
		if err := repository.NewUserRepository(db).Create(context.Background(), &user); err != nil {
			logger.SystemLogger.Error().Err(err).Msgf("Failed to create user %s", email)
		} else {
			logger.SystemLogger.Info().Msgf("User %s created successfully with role %s.", email, roleName)
		}
	}

	logger.SystemLogger.Info().Int("bcrypt_cost", bcryptCost).Msg("User Seeding Completed!")
}
