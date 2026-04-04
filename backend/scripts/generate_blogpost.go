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
		ModuleName: "BlogPost",
		TableName:  "blogposts",
		AuditLog:   true,
		Icon:       "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
		Fields: []generator.Field{
			{Name: "title", Type: "string", Binding: "required", Searchable: true},
			{Name: "slug", Type: "string", Binding: "required", Searchable: true, Unique: true},
			{Name: "summary", Type: "string", Binding: "", Searchable: false},
			{Name: "content", Type: "wysiwyg", Binding: "required", Searchable: false},
			{Name: "author", Type: "string", Binding: "", Searchable: true},
			{Name: "category", Type: "string", Binding: "", Searchable: true},
			{Name: "status", Type: "enum", Binding: "required", Searchable: true},
			{Name: "image", Type: "image", Binding: "", Searchable: false},
			{Name: "published_at", Type: "datetime", Binding: "", Searchable: false},
		},
	}

	g := generator.NewGeneratorFromConfig(config, baseDir)
	if err := g.Generate(); err != nil {
		fmt.Printf("Error: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("BlogPost module generated successfully!")
}
