package service

import (
	dto "github.com/hadi-projects/go-react-starter/internal/dto/default"
	entity "github.com/hadi-projects/go-react-starter/internal/entity/default"
	"gorm.io/gorm"
)

type StatisticsService interface {
	GetDashboardStats() (*dto.DashboardStatsResponse, error)
}

type statisticsService struct {
	db *gorm.DB
}

func NewStatisticsService(db *gorm.DB) StatisticsService {
	return &statisticsService{db: db}
}

func (s *statisticsService) GetDashboardStats() (*dto.DashboardStatsResponse, error) {
	var totalUsers int64
	var totalRoles int64
	var totalPermissions int64

	// Count users
	if err := s.db.Model(&entity.User{}).Count(&totalUsers).Error; err != nil {
		return nil, err
	}

	// Count roles
	if err := s.db.Model(&entity.Role{}).Count(&totalRoles).Error; err != nil {
		return nil, err
	}

	// Count permissions
	if err := s.db.Model(&entity.Permission{}).Count(&totalPermissions).Error; err != nil {
		return nil, err
	}

	return &dto.DashboardStatsResponse{
		TotalUsers:       totalUsers,
		TotalRoles:       totalRoles,
		TotalPermissions: totalPermissions,
	}, nil
}
