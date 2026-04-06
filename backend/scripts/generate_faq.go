package main

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/hadi-projects/go-react-starter/internal/generator"
)

func main() {
	// Root of the project
	baseDir, _ := os.Getwd()
	if filepath.Base(baseDir) == "scripts" {
		baseDir = filepath.Dir(baseDir)
	}

	config := generator.ModuleConfig{
		ModuleName: "Faq",
		TableName:  "faqs",
		AuditLog:   true,
		Icon:       "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
		Fields: []generator.Field{
			{Name: "question", Type: "string", Binding: "required", Searchable: true, Unique: true},
			{Name: "answer", Type: "wysiwyg", Binding: "required", Searchable: true},
			{Name: "status", Type: "enum", Binding: "required", Searchable: true},
		},
	}

	g := generator.NewGeneratorFromConfig(config, baseDir)
	if err := g.Generate(); err != nil {
		fmt.Printf("Error: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Faq module generated successfully!")
}
