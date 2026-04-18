package seeder

import (
	entity "github.com/hadi-projects/go-react-starter/internal/entity/default"
	"github.com/hadi-projects/go-react-starter/pkg/logger"
	"gorm.io/gorm"
)

// Master list of all permissions in exact order (ID 1-60)
var masterPermissionList = []string{
	"user:view", "user:create", "user:edit", "user:delete",
	"role:view", "role:create", "role:edit", "role:delete",
	"permission:view", "permission:create", "permission:edit", "permission:delete",
	"apikey:view", "apikey:create", "apikey:delete",
	"blogpost:view", "blogpost:create", "blogpost:edit", "blogpost:delete",
	"penyakit:view", "penyakit:create", "penyakit:edit", "penyakit:delete",
	"nutrisi:view", "nutrisi:create", "nutrisi:edit", "nutrisi:delete",
	"faq:view", "faq:create", "faq:edit", "faq:delete",
	"storage:view", "storage:upload", "storage:delete", "storage:share", "storage:manage",
	"setting:view_website", "setting:edit_website",
	"setting:view_smtp", "setting:edit_smtp",
	"setting:view_storage", "setting:edit_storage",
	"setting:view_security", "setting:edit_security",
	"setting:view_infra", "setting:edit_infra",
	"setting:view_advance", "setting:edit_advance",
	"service:view_redis", "service:manage_redis",
	"service:view_kafka", "service:manage_kafka",
	"log:audit", "log:http", "log:system",
	"system:stat", "system:gen", "system:export", "system:profile", "any",
}

type RolePermission struct {
	Role       string
	Permission string
}

func getRoleAssignments() []RolePermission {
	var assignments []RolePermission

	// Superadmin gets everything
	for _, p := range masterPermissionList {
		assignments = append(assignments, RolePermission{Role: "superadmin", Permission: p})
	}

	// Admin assignments
	adminPerms := []string{
		"user:view", "user:create", "user:edit",
		"role:view", "role:create", "role:edit",
		"permission:view",
		"apikey:view", "apikey:create",
		"blogpost:view", "blogpost:create", "blogpost:edit", "blogpost:delete",
		"penyakit:view", "penyakit:create", "penyakit:edit", "penyakit:delete",
		"nutrisi:view", "nutrisi:create", "nutrisi:edit", "nutrisi:delete",
		"faq:view", "faq:create", "faq:edit", "faq:delete",
		"storage:view", "storage:upload", "storage:delete", "storage:share",
		"setting:view_website", "setting:edit_website",
		"setting:view_smtp", "setting:edit_smtp",
		"setting:view_storage", "setting:edit_storage",
		"setting:view_security", "setting:edit_security",
		"setting:view_infra", "setting:edit_infra",
		"setting:view_advance", "setting:edit_advance",
		"service:view_redis", "service:view_kafka",
		"log:audit", "log:http", "log:system",
		"system:stat", "system:export", "system:profile",
	}
	for _, p := range adminPerms {
		assignments = append(assignments, RolePermission{Role: "admin", Permission: p})
	}

	// Auditor assignments (Read-only plus logs)
	auditorPerms := []string{
		"user:view", "role:view", "permission:view", "apikey:view",
		"blogpost:view", "penyakit:view", "nutrisi:view", "faq:view", "storage:view",
		"setting:view_website", "setting:view_smtp", "setting:view_storage", "setting:view_security", "setting:view_infra", "setting:view_advance",
		"service:view_redis", "service:view_kafka",
		"log:audit", "log:http", "log:system",
		"system:stat", "system:export", "system:profile",
	}
	for _, p := range auditorPerms {
		assignments = append(assignments, RolePermission{Role: "auditor", Permission: p})
	}

	// Copywriting assignments (CMS focus)
	copywritingPerms := []string{
		"blogpost:view", "blogpost:create", "blogpost:edit", "blogpost:delete",
		"penyakit:view", "penyakit:create", "penyakit:edit", "penyakit:delete",
		"nutrisi:view", "nutrisi:create", "nutrisi:edit", "nutrisi:delete",
		"faq:view", "faq:create", "faq:edit", "faq:delete",
		"system:profile",
	}
	for _, p := range copywritingPerms {
		assignments = append(assignments, RolePermission{Role: "copywriting", Permission: p})
	}

	// User (Client)
	assignments = append(assignments, RolePermission{Role: "user", Permission: "system:profile"})

	return assignments
}

func SeedRole(db *gorm.DB) {
	// 1. Create all roles first
	roles := []string{"superadmin", "admin", "auditor", "copywriting", "user"}
	for _, roleName := range roles {
		var role entity.Role
		if err := db.FirstOrCreate(&role, entity.Role{Name: roleName}).Error; err != nil {
			logger.SystemLogger.Error().Err(err).Msgf("Failed to seed role: %s", roleName)
		}
	}

	// 2. Create permissions in strict order to maintain ID -> Bitmask mapping
	// This ensures user:view is ID 1, user:create is ID 2, etc.
	for _, permName := range masterPermissionList {
		var perm entity.Permission
		// We use FirstOrCreate but the order of this loop is what matters for new databases
		if err := db.FirstOrCreate(&perm, entity.Permission{Name: permName}).Error; err != nil {
			logger.SystemLogger.Error().Err(err).Msgf("Failed to seed permission: %s", permName)
		}
	}

	// 3. Assign Permissions to Roles
	assignments := getRoleAssignments()
	for _, rp := range assignments {
		var perm entity.Permission
		if err := db.Where("name = ?", rp.Permission).First(&perm).Error; err != nil {
			logger.SystemLogger.Error().Err(err).Msgf("Failed to find permission for assignment: %s", rp.Permission)
			continue
		}

		var role entity.Role
		if err := db.Where("name = ?", rp.Role).First(&role).Error; err != nil {
			logger.SystemLogger.Error().Err(err).Msgf("Failed to find role: %s", rp.Role)
			continue
		}

		// Use association to link role and permission
		if err := db.Model(&role).Association("Permissions").Append(&perm); err != nil {
			logger.SystemLogger.Error().Err(err).Msgf("Failed to assign %s to %s", rp.Permission, rp.Role)
		}
	}

	logger.SystemLogger.Info().Msg("Role & Permission Master Seeding Completed!")
}
