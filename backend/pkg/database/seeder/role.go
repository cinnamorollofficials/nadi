package seeder

import (
	entity "github.com/hadi-projects/go-react-starter/internal/entity/default"
	"github.com/hadi-projects/go-react-starter/pkg/logger"
	"gorm.io/gorm"
)

type RolePermission struct {
	Role       string
	Permission string
}

var defaultRoles = []RolePermission{
	// ==== superadmin ====
	// 1. user module permission
	{Role: "superadmin", Permission: "create-user"},
	{Role: "superadmin", Permission: "delete-user"},
	{Role: "superadmin", Permission: "edit-user"},
	{Role: "superadmin", Permission: "get-user"},
	// 2. role module permission
	{Role: "superadmin", Permission: "create-role"},
	{Role: "superadmin", Permission: "delete-role"},
	{Role: "superadmin", Permission: "edit-role"},
	{Role: "superadmin", Permission: "get-role"},
	// 3. permission module permission
	{Role: "superadmin", Permission: "create-permission"},
	{Role: "superadmin", Permission: "delete-permission"},
	{Role: "superadmin", Permission: "edit-permission"},
	{Role: "superadmin", Permission: "get-permission"},
	// 4. api key module permission
	{Role: "superadmin", Permission: "get-api-key"},
	{Role: "superadmin", Permission: "create-api-key"},
	{Role: "superadmin", Permission: "delete-api-key"},
	// 5. medicpediapenyakit module
	{Role: "superadmin", Permission: "get-medicpediapenyakit"},
	{Role: "superadmin", Permission: "create-medicpediapenyakit"},
	{Role: "superadmin", Permission: "update-medicpediapenyakit"},
	{Role: "superadmin", Permission: "delete-medicpediapenyakit"},
	// 6. medicpedianutrisi module 
	{Role: "superadmin", Permission: "get-medicpedianutrisi"},
	{Role: "superadmin", Permission: "create-medicpedianutrisi"},
	{Role: "superadmin", Permission: "update-medicpedianutrisi"},
	{Role: "superadmin", Permission: "delete-medicpedianutrisi"},
	// 7. blogpost module
	{Role: "superadmin", Permission: "get-blogpost"},
	{Role: "superadmin", Permission: "create-blogpost"},
	{Role: "superadmin", Permission: "update-blogpost"},
	{Role: "superadmin", Permission: "delete-blogpost"},
	// 8. faq module
	{Role: "superadmin", Permission: "get-faq"},
	{Role: "superadmin", Permission: "create-faq"},
	{Role: "superadmin", Permission: "update-faq"},
	{Role: "superadmin", Permission: "delete-faq"},
	// 9. storage module permission
	{Role: "superadmin", Permission: "upload-file"},
	{Role: "superadmin", Permission: "get-file"},
	{Role: "superadmin", Permission: "delete-file"},
	{Role: "superadmin", Permission: "share-file"},
	{Role: "superadmin", Permission: "manage-storage"},
	// 10. setting module permission
	{Role: "superadmin", Permission: "get-setting"},
	{Role: "superadmin", Permission: "edit-setting"},
	// 11. logs module permission
	{Role: "superadmin", Permission: "get-all-logs"},
	{Role: "superadmin", Permission: "get-audit-log"},
	{Role: "superadmin", Permission: "get-auth-log"},
	{Role: "superadmin", Permission: "get-http-log"},
	{Role: "superadmin", Permission: "get-own-logs"},
	// 12. module generator
	{Role: "superadmin", Permission: "create-module"},
	// 13. cache module permission
	{Role: "superadmin", Permission: "manage-cache"},
	// 14. profile permission
	{Role: "superadmin", Permission: "get-profile"},
	
	// ==== admin ====
	// 1. user module permission
	{Role: "admin", Permission: "create-user"},
	{Role: "admin", Permission: "edit-user"},
	{Role: "admin", Permission: "get-user"},
	// 2. role module permission
	{Role: "admin", Permission: "get-role"},
	// 3. permission module permission
	{Role: "admin", Permission: "get-permission"},
	// 4. medicpediapenyakit module
	{Role: "admin", Permission: "get-medicpediapenyakit"},
	{Role: "admin", Permission: "create-medicpediapenyakit"},
	{Role: "admin", Permission: "update-medicpediapenyakit"},
	{Role: "admin", Permission: "delete-medicpediapenyakit"},
	// 5. medicpedianutrisi module 
	{Role: "admin", Permission: "get-medicpedianutrisi"},
	{Role: "admin", Permission: "create-medicpedianutrisi"},
	{Role: "admin", Permission: "update-medicpedianutrisi"},
	{Role: "admin", Permission: "delete-medicpedianutrisi"},
	// 6. blogpost module
	{Role: "admin", Permission: "get-blogpost"},
	{Role: "admin", Permission: "create-blogpost"},
	{Role: "admin", Permission: "update-blogpost"},
	{Role: "admin", Permission: "delete-blogpost"},
	// 7. faq module
	{Role: "admin", Permission: "get-faq"},
	{Role: "admin", Permission: "create-faq"},
	{Role: "admin", Permission: "update-faq"},
	{Role: "admin", Permission: "delete-faq"},
	// 8. storage module permission
	{Role: "admin", Permission: "upload-file"},
	{Role: "admin", Permission: "get-file"},
	{Role: "admin", Permission: "delete-file"},
	{Role: "admin", Permission: "share-file"},
	// 9. setting module permission
	{Role: "admin", Permission: "get-setting"},
	{Role: "admin", Permission: "edit-setting"},
	// 10. logs module permission
	{Role: "admin", Permission: "get-audit-log"},
	{Role: "admin", Permission: "get-http-log"},
	{Role: "admin", Permission: "get-own-logs"},
	// 11. profile permission
	{Role: "admin", Permission: "get-profile"},

	// ==== auditor ====
	// 1. logs module permission (read-only)
	{Role: "auditor", Permission: "get-all-logs"},
	{Role: "auditor", Permission: "get-audit-log"},
	{Role: "auditor", Permission: "get-auth-log"},
	{Role: "auditor", Permission: "get-http-log"},
	{Role: "auditor", Permission: "get-own-logs"},
	// 2. read-only access to users and roles
	{Role: "auditor", Permission: "get-user"},
	{Role: "auditor", Permission: "get-role"},
	{Role: "auditor", Permission: "get-permission"},
	// 3. profile permission
	{Role: "auditor", Permission: "get-profile"},

	// ==== copywriting ====
	// 1. medicpediapenyakit module
	{Role: "copywriting", Permission: "get-medicpediapenyakit"},
	{Role: "copywriting", Permission: "create-medicpediapenyakit"},
	{Role: "copywriting", Permission: "update-medicpediapenyakit"},
	{Role: "copywriting", Permission: "delete-medicpediapenyakit"},
	// 2. medicpedianutrisi module 
	{Role: "copywriting", Permission: "get-medicpedianutrisi"},
	{Role: "copywriting", Permission: "create-medicpedianutrisi"},
	{Role: "copywriting", Permission: "update-medicpedianutrisi"},
	{Role: "copywriting", Permission: "delete-medicpedianutrisi"},
	// 3. blogpost module
	{Role: "copywriting", Permission: "get-blogpost"},
	{Role: "copywriting", Permission: "create-blogpost"},
	{Role: "copywriting", Permission: "update-blogpost"},
	{Role: "copywriting", Permission: "delete-blogpost"},
	// 4. faq module
	{Role: "copywriting", Permission: "get-faq"},
	{Role: "copywriting", Permission: "create-faq"},
	{Role: "copywriting", Permission: "update-faq"},
	{Role: "copywriting", Permission: "delete-faq"},
	// 5. profile permission
	{Role: "copywriting", Permission: "get-profile"},

	// ==== user ====
	// Basic user permissions (for client dashboard)
	{Role: "user", Permission: "get-profile"},
}

func SeedRole(db *gorm.DB) {
	// First, create all roles
	roles := []string{"superadmin", "admin", "auditor", "copywriting", "user"}
	for _, roleName := range roles {
		var role entity.Role
		if err := db.FirstOrCreate(&role, entity.Role{Name: roleName}).Error; err != nil {
			logger.SystemLogger.Error().Err(err).Msgf("Failed to seed role: %s", roleName)
		}
	}

	// Then create permissions and assign them to roles
	for _, rp := range defaultRoles {
		// 1. Create Permission if not exists
		var perm entity.Permission
		if err := db.FirstOrCreate(&perm, entity.Permission{Name: rp.Permission}).Error; err != nil {
			logger.SystemLogger.Error().Err(err).Msgf("Failed to seed permission: %s", rp.Permission)
			continue
		}

		// 2. Get Role
		var role entity.Role
		if err := db.Where("name = ?", rp.Role).First(&role).Error; err != nil {
			logger.SystemLogger.Error().Err(err).Msgf("Failed to find role: %s", rp.Role)
			continue
		}

		// 3. Assign Permission to Role (idempotent)
		var count int64
		// Check association table 'role_has_permissions'
		if err := db.Table("role_has_permissions").
			Where("role_id = ? AND permission_id = ?", role.ID, perm.ID).
			Count(&count).Error; err != nil {
			logger.SystemLogger.Error().Err(err).Msg("Failed to check role permission association")
			continue
		}

		if count == 0 {
			if err := db.Model(&role).Association("Permissions").Append(&perm); err != nil {
				logger.SystemLogger.Error().Err(err).Msgf("Failed to assign permission %s to role %s", rp.Permission, rp.Role)
			}
		}
	}
	logger.SystemLogger.Info().Msg("Role & Permission Seeding Completed!")
}
