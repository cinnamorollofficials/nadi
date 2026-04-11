package main

import (
	"fmt"
	"log"

	"github.com/hadi-projects/go-react-starter/pkg/crypto"
)

func main() {
	fmt.Println("Generating AES-256 encryption key...")
	
	key, err := crypto.GenerateKeyBase64()
	if err != nil {
		log.Fatal("Failed to generate encryption key:", err)
	}
	
	fmt.Println("\n=== ENCRYPTION KEY ===")
	fmt.Printf("ENCRYPTION_KEY=%s\n", key)
	fmt.Println("\n=== IMPORTANT ===")
	fmt.Println("1. Add this to your .env file")
	fmt.Println("2. Keep this key secure and never commit it to version control")
	fmt.Println("3. Use the same key across all instances of your application")
	fmt.Println("4. If you lose this key, encrypted data cannot be recovered")
	fmt.Println("5. Rotate this key periodically for security")
}