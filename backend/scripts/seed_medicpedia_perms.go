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

	modules := []struct {
		Name     string
		BaseName string
	}{
		{Name: "MedicpediaPenyakit", BaseName: "medicpedia_penyakit"},
		{Name: "MedicpediaNutrisi", BaseName: "medicpedia_nutrisi"},
	}

	var allPermissions []entity.Permission

	for _, mod := range modules {
		permissions := []entity.Permission{
			{Name: "get-" + mod.BaseName, Description: "Read access for " + mod.Name},
			{Name: "create-" + mod.BaseName, Description: "Create access for " + mod.Name},
			{Name: "update-" + mod.BaseName, Description: "Update access for " + mod.Name},
			{Name: "delete-" + mod.BaseName, Description: "Delete access for " + mod.Name},
		}

		for i := range permissions {
			if err := db.FirstOrCreate(&permissions[i], entity.Permission{Name: permissions[i].Name}).Error; err != nil {
					fmt.Printf("Error creating permission %s: %v\n", permissions[i].Name, err)
					return
			}
			allPermissions = append(allPermissions, permissions[i])
		}
	}

	// Assign to admin role (Role ID = 1)
	var adminRole entity.Role
	if err := db.Preload("Permissions").First(&adminRole, 1).Error; err != nil {
		fmt.Printf("Error finding admin role: %v\n", err)
		return
	}

	// Add new permissions to role if not already there
	for _, p := range allPermissions {
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

	fmt.Println("Permissions for Medicpedia modules seeded and assigned to Admin!")
}
