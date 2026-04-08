package main

import (
	"fmt"
	"os"

	"github.com/hadi-projects/go-react-starter/config"
	entity "github.com/hadi-projects/go-react-starter/internal/entity/default"
	"github.com/hadi-projects/go-react-starter/pkg/database"
)

func main() {
	cfg := config.LoadConfig()
	db, err := database.NewMySQLConnection(&cfg)
	if err != nil {
		fmt.Printf("Error connecting to database: %v\n", err)
		os.Exit(1)
	}

	moduleName := "Faq"
	baseName := "faq"
	permissions := []entity.Permission{
		{Name: "get-" + baseName, Description: "Read access for " + moduleName},
		{Name: "create-" + baseName, Description: "Create access for " + moduleName},
		{Name: "update-" + baseName, Description: "Update access for " + moduleName},
		{Name: "delete-" + baseName, Description: "Delete access for " + moduleName},
	}

	// Insert permissions
	for i := range permissions {
		if err := db.FirstOrCreate(&permissions[i], entity.Permission{Name: permissions[i].Name}).Error; err != nil {
			fmt.Printf("Error creating permission %s: %v\n", permissions[i].Name, err)
			return
		}
	}

	// Assign to admin role (Role ID = 1)
	var adminRole entity.Role
	if err := db.Preload("Permissions").First(&adminRole, 1).Error; err != nil {
		fmt.Printf("Error finding admin role: %v\n", err)
		return
	}

	// Add new permissions to role if not already there
	for _, p := range permissions {
		exists := false
		for _, rp := range adminRole.Permissions {
			if rp.ID == p.ID {
				exists = true
				break
			}
		}
		if !exists {
			adminRole.Permissions = append(adminRole.Permissions, p)
		}
	}

	if err := db.Save(&adminRole).Error; err != nil {
		fmt.Printf("Error saving admin role: %v\n", err)
		return
	}

	fmt.Println("Permissions for Faq module seeded and assigned to Admin!")
}
