package handler

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/hadi-projects/go-react-starter/internal/entity"
	"github.com/hadi-projects/go-react-starter/internal/service"
	"github.com/hadi-projects/go-react-starter/internal/utils"
	"github.com/hadi-projects/go-react-starter/pkg/response"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // In production, refine this
	},
}

type ChatHandler interface {
	HandleWebSocket(c *gin.Context)
	GetHistory(c *gin.Context)
	GetMessages(c *gin.Context)
	CreateChannel(c *gin.Context)
	RenameChannel(c *gin.Context)
	TogglePinChannel(c *gin.Context)
	DeleteChannel(c *gin.Context)
}

type chatHandler struct {
	chatService service.ChatService
}

func NewChatHandler(chatService service.ChatService) ChatHandler {
	return &chatHandler{chatService: chatService}
}

func (h *chatHandler) HandleWebSocket(c *gin.Context) {
	uid, err := utils.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}
	defer conn.Close()

	for {
		var msg struct {
			Type      string `json:"type"`
			ChannelUID string `json:"channel_uid"`
			Content   string `json:"content"`
		}

		if err := conn.ReadJSON(&msg); err != nil {
			break
		}

		if msg.Type == "message" {
			// Use a longer timeout for AI processing
			// Now that middleware ignores WS, c.Request.Context() correctly reflects the connection stay
			ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Minute)

			err := h.chatService.ProcessMessage(ctx, uid, msg.ChannelUID, msg.Content, func(chunk string) {
				conn.WriteJSON(gin.H{
					"type":    "chunk",
					"content": chunk,
				})
			})
			cancel() // Free resources immediately

			if err != nil {
				conn.WriteJSON(gin.H{"type": "error", "content": err.Error()})
			} else {
				conn.WriteJSON(gin.H{"type": "done"})
			}
		}
	}
}

func (h *chatHandler) GetHistory(c *gin.Context) {
	uid, err := utils.GetUserID(c)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, "Unauthorized")
		return
	}

	history, err := h.chatService.GetChatHistory(c.Request.Context(), uid)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Chat history retrieved", history)
}

func (h *chatHandler) GetMessages(c *gin.Context) {
	uid, err := utils.GetUserID(c)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, "Unauthorized")
		return
	}

	channelUID := c.Param("uid")
	if channelUID == "" {
		response.Error(c, http.StatusBadRequest, "Invalid channel UID")
		return
	}

	messages, err := h.chatService.GetMessages(c.Request.Context(), uid, channelUID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Messages retrieved", messages)
}

func (h *chatHandler) CreateChannel(c *gin.Context) {
	uid, err := utils.GetUserID(c)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var req struct {
		Mode entity.ChatMode `json:"mode" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	channel, err := h.chatService.CreateChannel(c.Request.Context(), uid, req.Mode)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, "Channel created", channel)
}
func (h *chatHandler) RenameChannel(c *gin.Context) {
	uid, err := utils.GetUserID(c)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, "Unauthorized")
		return
	}

	channelUID := c.Param("uid")
	if channelUID == "" {
		response.Error(c, http.StatusBadRequest, "Invalid channel UID")
		return
	}

	var req struct {
		Title string `json:"title" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	err = h.chatService.RenameChannel(c.Request.Context(), uid, channelUID, req.Title)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Chat renamed successfully", nil)
}

func (h *chatHandler) TogglePinChannel(c *gin.Context) {
	uid, err := utils.GetUserID(c)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, "Unauthorized")
		return
	}

	channelUID := c.Param("uid")
	if channelUID == "" {
		response.Error(c, http.StatusBadRequest, "Invalid channel UID")
		return
	}

	err = h.chatService.TogglePinChannel(c.Request.Context(), uid, channelUID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Pin status toggled", nil)
}

func (h *chatHandler) DeleteChannel(c *gin.Context) {
	uid, err := utils.GetUserID(c)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, "Unauthorized")
		return
	}

	channelUID := c.Param("uid")
	if channelUID == "" {
		response.Error(c, http.StatusBadRequest, "Invalid channel UID")
		return
	}

	err = h.chatService.DeleteChannel(c.Request.Context(), uid, channelUID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Chat deleted successfully", nil)
}
