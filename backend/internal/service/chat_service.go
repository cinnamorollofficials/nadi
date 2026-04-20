package service

import (
	"context"
	"fmt"
	"strings"
	"github.com/hadi-projects/go-react-starter/internal/entity"
	"github.com/hadi-projects/go-react-starter/internal/repository"
	defaultRepo "github.com/hadi-projects/go-react-starter/internal/repository/default"
	"github.com/hadi-projects/go-react-starter/pkg/crypto"
)

type ChatService interface {
	CreateChannel(ctx context.Context, userID uint, mode entity.ChatMode) (*entity.ChatChannel, error)
	GetChatHistory(ctx context.Context, userID uint) ([]entity.ChatChannel, error)
	GetMessages(ctx context.Context, channelID uint) ([]entity.ChatMessage, error)
	ProcessMessage(ctx context.Context, channelID uint, userMessage string, onChunk func(string)) error
}

type chatService struct {
	chatRepo      repository.ChatRepository
	userRepo      defaultRepo.UserRepository
	geminiService GeminiService
	encryptor     *crypto.Encryptor
}

func NewChatService(
	chatRepo repository.ChatRepository, 
	userRepo defaultRepo.UserRepository, 
	geminiService GeminiService,
	encryptor *crypto.Encryptor,
) ChatService {
	return &chatService{
		chatRepo:      chatRepo,
		userRepo:      userRepo,
		geminiService: geminiService,
		encryptor:     encryptor,
	}
}

func (s *chatService) CreateChannel(ctx context.Context, userID uint, mode entity.ChatMode) (*entity.ChatChannel, error) {
	channel := &entity.ChatChannel{
		UserID: userID,
		Title:  "New Conversation",
		Mode:   mode,
		Status: "active",
	}
	err := s.chatRepo.CreateChannel(ctx, channel)
	return channel, err
}

func (s *chatService) GetChatHistory(ctx context.Context, userID uint) ([]entity.ChatChannel, error) {
	return s.chatRepo.GetChannelsByUserID(ctx, userID)
}

func (s *chatService) GetMessages(ctx context.Context, channelID uint) ([]entity.ChatMessage, error) {
	messages, err := s.chatRepo.GetMessagesByChannelID(ctx, channelID)
	if err != nil {
		return nil, err
	}

	// Decrypt messages
	for i := range messages {
		if decrypted, err := s.encryptor.Decrypt(messages[i].Content); err == nil {
			messages[i].Content = decrypted
		}
	}

	return messages, nil
}

func (s *chatService) ProcessMessage(ctx context.Context, channelID uint, userMessage string, onChunk func(string)) error {
	// 1. Get channel info with recent messages
	channel, err := s.chatRepo.GetChannelWithMessages(ctx, channelID)
	if err != nil {
		return err
	}

	// Decrypt context messages for Gemini
	for i := range channel.Messages {
		if decrypted, err := s.encryptor.Decrypt(channel.Messages[i].Content); err == nil {
			channel.Messages[i].Content = decrypted
		}
	}

	// 1.1 Check User Usage Limit
	user, err := s.userRepo.FindByID(ctx, channel.UserID)
	if err != nil {
		return err
	}

	if user.CurrentUsage >= user.UsageLimit {
		return fmt.Errorf("batas konsultasi harian Anda (%d/%d) telah tercapai. Silakan coba lagi besok.", user.CurrentUsage, user.UsageLimit)
	}

	// 2. Save User Message to DB (Encrypted)
	encryptedUserMsg, _ := s.encryptor.Encrypt(userMessage)
	userMsg := &entity.ChatMessage{
		ChannelID: channelID,
		Role:      "user",
		Content:   encryptedUserMsg,
	}
	if err := s.chatRepo.CreateMessage(ctx, userMsg); err != nil {
		return err
	}

	// 3. Generate AI Response using Gemini (Streaming)
	var fullResponse strings.Builder
	err = s.geminiService.GenerateResponseStream(ctx, channel.Mode, channel.Messages, userMessage, func(chunk string) {
		fullResponse.WriteString(chunk)
		onChunk(chunk) // Callback to pass chunk to the handler (WebSocket)
	})

	if err != nil {
		return err
	}

	// 4. Save entire AI Message to DB (Encrypted)
	encryptedAiMsg, _ := s.encryptor.Encrypt(fullResponse.String())
	aiMsg := &entity.ChatMessage{
		ChannelID: channelID,
		Role:      "assistant",
		Content:   encryptedAiMsg,
	}
	if err := s.chatRepo.CreateMessage(ctx, aiMsg); err != nil {
		return err
	}

	// 5. Auto-summarize title if it's a new chat
	if channel.Title == "New Conversation" {
		newTitle := userMessage
		if len(newTitle) > 40 {
			newTitle = newTitle[:37] + "..."
		}
		channel.Title = newTitle
		s.chatRepo.UpdateChannel(ctx, channel)
	}

	// 6. Increment User Usage
	user.CurrentUsage++
	s.userRepo.Update(ctx, user)

	return nil
}
