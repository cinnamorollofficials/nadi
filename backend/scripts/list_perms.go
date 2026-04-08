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

	var perms []entity.Permission
	if err := db.Find(&perms).Error; err != nil {
		fmt.Printf("Error finding permissions: %v\n", err)
		return
	}

	fmt.Println("ID | Name")
	fmt.Println("---|---")
	for _, p := range perms {
		fmt.Printf("%d | %s\n", p.ID, p.Name)
	}
}
