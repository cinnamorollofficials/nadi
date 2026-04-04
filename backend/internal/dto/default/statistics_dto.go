package dto

type DashboardStatsResponse struct {
	TotalUsers       int64 `json:"total_users"`
	TotalRoles       int64 `json:"total_roles"`
	TotalPermissions int64 `json:"total_permissions"`
}
