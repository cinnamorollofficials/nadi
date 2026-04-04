package service

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"

	"github.com/google/uuid"
)

type UploadService interface {
	UploadFile(file *multipart.FileHeader, folder string) (string, error)
}

type uploadService struct {
	basePath string
}

func NewUploadService(basePath string) UploadService {
	return &uploadService{
		basePath: basePath,
	}
}

func (s *uploadService) UploadFile(file *multipart.FileHeader, folder string) (string, error) {
	// Create folder if not exists
	uploadDir := filepath.Join(s.basePath, folder)
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		if err := os.MkdirAll(uploadDir, 0755); err != nil {
			return "", fmt.Errorf("failed to create upload directory: %v", err)
		}
	}

	// Generate unique filename
	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("%d_%s%s", time.Now().UnixNano(), uuid.New().String(), ext)
	relativePath := filepath.Join(folder, filename)
	fullPath := filepath.Join(s.basePath, relativePath)

	// Save file
	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	dst, err := os.Create(fullPath)
	if err != nil {
		return "", err
	}
	defer dst.Close()

	if _, err = io.Copy(dst, src); err != nil {
		return "", err
	}

	// Normalize path for web (using /)
	return filepath.ToSlash(relativePath), nil
}
