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
	{Role: "superadmin", Permission: "get-user"},
	{Role: "superadmin", Permission: "create-user"},
	{Role: "superadmin", Permission: "edit-user"},
	{Role: "superadmin", Permission: "delete-user"},
	// 2. role module permission
	{Role: "superadmin", Permission: "get-role"},
	{Role: "superadmin", Permission: "create-role"},
	{Role: "superadmin", Permission: "edit-role"},
	{Role: "superadmin", Permission: "delete-role"},
	// 3. permission module permission
	{Role: "superadmin", Permission: "get-permission"},
	{Role: "superadmin", Permission: "create-permission"},
	{Role: "superadmin", Permission: "edit-permission"},
	{Role: "superadmin", Permission: "delete-permission"},
	// 4. api key module permission
	{Role: "superadmin", Permission: "create-api-key"},
	{Role: "superadmin", Permission: "delete-api-key"},
	// 5. medicpediapenyakit module
	{Role: "superadmin", Permission: "get-medicpediapenyakit"},
	{Role: "superadmin", Permission: "create-medicpediapenyakit"},
	{Role: "superadmin", Permission: "edit-medicpediapenyakit"},
	{Role: "superadmin", Permission: "delete-medicpediapenyakit"},
	// 6. medicpedianutrisi module 
	{Role: "superadmin", Permission: "get-medicpedianutrisi"},
	{Role: "superadmin", Permission: "create-medicpedianutrisi"},
	{Role: "superadmin", Permission: "edit-medicpedianutrisi"},
	{Role: "superadmin", Permission: "delete-medicpedianutrisi"},
	// 7. blogpost module
	{Role: "superadmin", Permission: "get-blogpost"},
	{Role: "superadmin", Permission: "create-blogpost"},
	{Role: "superadmin", Permission: "edit-blogpost"},
	{Role: "superadmin", Permission: "delete-blogpost"},
	// 8. blogpost module
	{Role: "copywriting", Permission: "get-faq"},
	{Role: "copywriting", Permission: "create-faq"},
	{Role: "copywriting", Permission: "edit-faq"},
	{Role: "copywriting", Permission: "delete-faq"},
	//  9. storage module permission
	{Role: "superadmin", Permission: "upload-file"},
	{Role: "superadmin", Permission: "get-file"},
	{Role: "superadmin", Permission: "delete-file"},
	{Role: "superadmin", Permission: "share-file"},
	{Role: "superadmin", Permission: "manage-storage"},
	// 10. setting module permission
	{Role: "superadmin", Permission: "get-website-setting"},
	{Role: "superadmin", Permission: "edit-website-setting"},
	{Role: "superadmin", Permission: "get-email-setting"},
	{Role: "superadmin", Permission: "edit-email-setting"},
	{Role: "superadmin", Permission: "get-storage-setting"},
	{Role: "superadmin", Permission: "edit-storage-setting"},
	{Role: "superadmin", Permission: "get-security-setting"},
	{Role: "superadmin", Permission: "edit-security-setting"},
	{Role: "superadmin", Permission: "get-infrastructure-setting"},
	{Role: "superadmin", Permission: "edit-infrastructure-setting"},
	{Role: "superadmin", Permission: "get-advanced-setting"},
	{Role: "superadmin", Permission: "edit-advanced-setting"},
	// 11. logs module permission
	{Role: "superadmin", Permission: "get-audit-log"},
	{Role: "superadmin", Permission: "get-system-log"},
	{Role: "superadmin", Permission: "get-http-log"},
	// 12. mmodule generator
	{Role: "superadmin", Permission: "create-module"},
	// 13. cache module permission
	{Role: "superadmin", Permission: "manage-cache"},
	{Role: "superadmin", Permission: "get-cache"},
	
	// ==== copywriting ====
	// 1. medicpediapenyakit module
	{Role: "copywriting", Permission: "get-medicpediapenyakit"},
	{Role: "copywriting", Permission: "create-medicpediapenyakit"},
	{Role: "copywriting", Permission: "edit-medicpediapenyakit"},
	{Role: "copywriting", Permission: "delete-medicpediapenyakit"},
	// 2. medicpedianutrisi module 
	{Role: "copywriting", Permission: "get-medicpedianutrisi"},
	{Role: "copywriting", Permission: "create-medicpedianutrisi"},
	{Role: "copywriting", Permission: "edit-medicpedianutrisi"},
	{Role: "copywriting", Permission: "delete-medicpedianutrisi"},
	// 3. blogpost module
	{Role: "copywriting", Permission: "get-blogpost"},
	{Role: "copywriting", Permission: "create-blogpost"},
	{Role: "copywriting", Permission: "edit-blogpost"},
	{Role: "copywriting", Permission: "delete-blogpost"},
	// 4. blogpost module
	{Role: "copywriting", Permission: "get-faq"},
	{Role: "copywriting", Permission: "create-faq"},
	{Role: "copywriting", Permission: "edit-faq"},
	{Role: "copywriting", Permission: "delete-faq"},


	// ==== guest ====
	// 1. medicpediapenyakit module
	{Role: "copywriting", Permission: "get-medicpediapenyakit"},
	// 2. medicpedianutrisi module 
	{Role: "copywriting", Permission: "get-medicpedianutrisi"},
	// 3. blogpost module
	{Role: "copywriting", Permission: "get-blogpost"},
	// 4. blogpost module
	{Role: "copywriting", Permission: "get-faq"},

	// === basic permissional for all ===
	{Role: "superadmin", Permission: "get-profile"},
	{Role: "admin", Permission: "get-profile"},
	{Role: "auditor", Permission: "get-profile"},
	{Role: "copywriting", Permission: "get-profile"},
	{Role: "user", Permission: "get-profile"},
}

func SeedRole(db *gorm.DB) {
	for _, rp := range defaultRoles {
		// 1. Create Permission if not exists
		var perm entity.Permission
		if err := db.FirstOrCreate(&perm, entity.Permission{Name: rp.Permission}).Error; err != nil {
			logger.SystemLogger.Error().Err(err).Msgf("Failed to seed permission: %s", rp.Permission)
			continue
		}

		// 2. Create Role if not exists
		var role entity.Role
		if err := db.FirstOrCreate(&role, entity.Role{Name: rp.Role}).Error; err != nil {
			logger.SystemLogger.Error().Err(err).Msgf("Failed to seed role: %s", rp.Role)
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
