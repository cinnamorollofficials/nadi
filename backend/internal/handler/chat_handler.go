package handler

import (
	"net/http"
	"strconv"

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
}

type chatHandler struct {
	chatService service.ChatService
}

func NewChatHandler(chatService service.ChatService) ChatHandler {
	return &chatHandler{chatService: chatService}
}

func (h *chatHandler) HandleWebSocket(c *gin.Context) {
	_, err := utils.GetUserID(c)
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
			ChannelID uint   `json:"channel_id"`
			Content   string `json:"content"`
		}

		if err := conn.ReadJSON(&msg); err != nil {
			break
		}

		if msg.Type == "message" {
			err := h.chatService.ProcessMessage(c.Request.Context(), msg.ChannelID, msg.Content, func(chunk string) {
				conn.WriteJSON(gin.H{
					"type":    "chunk",
					"content": chunk,
				})
			})

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
	channelID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid channel ID")
		return
	}

	messages, err := h.chatService.GetMessages(c.Request.Context(), uint(channelID))
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

	channelID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid channel ID")
		return
	}

	var req struct {
		Title string `json:"title" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	err = h.chatService.RenameChannel(c.Request.Context(), uid, uint(channelID), req.Title)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Chat renamed successfully", nil)
}
