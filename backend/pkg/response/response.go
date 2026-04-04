package response

import (
	"github.com/gin-gonic/gin"
)

type Response struct {
	Meta Meta        `json:"meta"`
	Data interface{} `json:"data"`
}

type Meta struct {
	Code       int             `json:"code"`
	Status     string          `json:"status"`
	Message    string          `json:"message"`
	Pagination *PaginationMeta `json:"pagination,omitempty"`
}

type PaginationMeta struct {
	CurrentPage int   `json:"current_page"`
	TotalPages  int   `json:"total_pages"`
	TotalData   int64 `json:"total_data"`
	Limit       int   `json:"limit"`
}

func Success(c *gin.Context, code int, message string, data interface{}) {
	c.JSON(code, Response{
		Meta: Meta{
			Code:    code,
			Status:  "success",
			Message: message,
		},
		Data: data,
	})
}

func SuccessWithPagination(c *gin.Context, code int, message string, data interface{}, pagination *PaginationMeta) {
	c.JSON(code, Response{
		Meta: Meta{
			Code:       code,
			Status:     "success",
			Message:    message,
			Pagination: pagination,
		},
		Data: data,
	})
}

func Error(c *gin.Context, code int, message string) {
	c.JSON(code, Response{
		Meta: Meta{
			Code:    code,
			Status:  "error",
			Message: message,
		},
		Data: nil,
	})
}
