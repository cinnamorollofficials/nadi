package service

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/hadi-projects/go-react-starter/internal/entity"
	defaultEntity "github.com/hadi-projects/go-react-starter/internal/entity/default"
	"github.com/hadi-projects/go-react-starter/internal/repository"
	defaultRepo "github.com/hadi-projects/go-react-starter/internal/repository/default"
	"github.com/hadi-projects/go-react-starter/internal/utils"
	"github.com/hadi-projects/go-react-starter/pkg/crypto"
)

type ChatService interface {
	CreateChannel(ctx context.Context, userID uint, mode entity.ChatMode) (*entity.ChatChannel, error)
	GetChatHistory(ctx context.Context, userID uint) ([]entity.ChatChannel, error)
	GetMessages(ctx context.Context, userID uint, channelUID string) ([]entity.ChatMessage, error)
	ProcessMessage(ctx context.Context, userID uint, channelUID string, userMessage string, systemPrefix string, onChunk func(string)) error
	RenameChannel(ctx context.Context, userID uint, channelUID string, newTitle string) error
	TogglePinChannel(ctx context.Context, userID uint, channelUID string) error
	DeleteChannel(ctx context.Context, userID uint, channelUID string) error
	GetChannelInfo(ctx context.Context, userID uint, channelUID string) (*entity.ChatChannel, error)
}

type chatService struct {
	chatRepo    repository.ChatRepository
	userRepo    defaultRepo.UserRepository
	aiUsageRepo repository.AiUsageRepository
	llmProvider LLMProvider
	encryptor   *crypto.Encryptor
}

func NewChatService(
	chatRepo repository.ChatRepository,
	userRepo defaultRepo.UserRepository,
	aiUsageRepo repository.AiUsageRepository,
	llmProvider LLMProvider,
	encryptor *crypto.Encryptor,
) ChatService {
	return &chatService{
		chatRepo:    chatRepo,
		userRepo:    userRepo,
		aiUsageRepo: aiUsageRepo,
		llmProvider: llmProvider,
		encryptor:   encryptor,
	}
}

func (s *chatService) CreateChannel(ctx context.Context, userID uint, mode entity.ChatMode) (*entity.ChatChannel, error) {
	channel := &entity.ChatChannel{
		UID:    utils.GenerateUID(),
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

func (s *chatService) GetMessages(ctx context.Context, userID uint, channelUID string) ([]entity.ChatMessage, error) {
	channel, err := s.chatRepo.GetChannelByUID(ctx, channelUID)
	if err != nil {
		return nil, err
	}

	if channel.UserID != userID {
		return nil, fmt.Errorf("unauthorized access to chat")
	}

	messages, err := s.chatRepo.GetMessagesByChannelID(ctx, channel.ID)
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

func (s *chatService) ProcessMessage(ctx context.Context, userID uint, channelUID string, userMessage string, systemPrefix string, onChunk func(string)) error {
	// 1. Get channel info with recent messages
	channel, err := s.chatRepo.GetChannelByUID(ctx, channelUID)
	if err != nil {
		return err
	}

	if channel.UserID != userID {
		return fmt.Errorf("unauthorized to post to this chat")
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

	// 1.1 Check and Reset Daily Usage
	now := time.Now().UTC()
	if user.UpdatedAt.Year() != now.Year() || user.UpdatedAt.YearDay() != now.YearDay() {
		user.CurrentUsage = 0
	}

	// 1.2 Calculate Effective Limit
	effectiveLimit := user.UsageLimit
	if effectiveLimit <= 0 {
		effectiveLimit = user.AiTier.DailyLimit
	}
	if effectiveLimit <= 0 {
		effectiveLimit = 20 // Absolute fallback
	}

	if user.CurrentUsage >= effectiveLimit {
		return fmt.Errorf("batas konsultasi harian Anda (%d/%d) telah tercapai. Silakan coba lagi besok.", user.CurrentUsage, effectiveLimit)
	}

	// 2. Save User Message to DB (Encrypted)
	encryptedUserMsg, _ := s.encryptor.Encrypt(userMessage)
	userMsg := &entity.ChatMessage{
		ChannelID: channel.ID,
		Role:      "user",
		Content:   encryptedUserMsg,
	}
	if err := s.chatRepo.CreateMessage(ctx, userMsg); err != nil {
		return err
	}

	// 2.1 Handle System Prefix (if provided)
	if systemPrefix != "" {
		encryptedPrefix, _ := s.encryptor.Encrypt(systemPrefix)
		systemMsg := &entity.ChatMessage{
			ChannelID: channel.ID,
			Role:      "system",
			Content:   encryptedPrefix,
		}
		if err := s.chatRepo.CreateMessage(ctx, systemMsg); err != nil {
			return err
		}
	}

	// 2.2 Collect all system messages from history to maintain context
	var systemInstructions strings.Builder
	for _, m := range channel.Messages {
		if m.Role == "system" {
			systemInstructions.WriteString(m.Content)
			systemInstructions.WriteString("\n")
		}
	}
	if systemPrefix != "" {
		systemInstructions.WriteString(systemPrefix)
	}

	// 3. Generate AI Response using LLM Provider (Streaming)
	var fullResponse strings.Builder
	usage, err := s.llmProvider.GenerateResponseStream(ctx, channel.Mode, channel.Messages, userMessage, systemInstructions.String(), func(chunk string) {
		fullResponse.WriteString(chunk)
		onChunk(chunk) // Callback to pass chunk to the handler (WebSocket)
	})

	if err != nil {
		return err
	}

	// 4. Save entire AI Message to DB (Encrypted)
	encryptedAiMsg, _ := s.encryptor.Encrypt(fullResponse.String())
	aiMsg := &entity.ChatMessage{
		ChannelID: channel.ID,
		Role:      "assistant",
		Content:   encryptedAiMsg,
	}
	if err := s.chatRepo.CreateMessage(ctx, aiMsg); err != nil {
		return err
	}

	// 5. Auto-summarize title if it's a new chat or still using technical tags
	isInitialTag := strings.Contains(channel.Title, "[MULAI_CEK_GEJALA]")
	if channel.Title == "New Conversation" || isInitialTag || systemPrefix != "" {
		newTitle := userMessage
		diseaseName := ""

		// If it's just the start tag, set a temporary descriptive title
		if newTitle == "[MULAI_CEK_GEJALA]" {
			newTitle = "[MULAI_CEK_GEJALA]: Sesi Baru"
		}

		// Extract disease name from systemPrefix
		if systemPrefix != "" {
			startIdx := strings.Index(systemPrefix, "topik \"")
			endIdx := strings.Index(systemPrefix, "\". JANGAN")
			if startIdx != -1 && endIdx != -1 && endIdx > startIdx {
				diseaseName = systemPrefix[startIdx+7 : endIdx]
			}
		}

		// Format title
		if diseaseName != "" {
			newTitle = fmt.Sprintf("%s: %s", diseaseName, newTitle)
		} else if isInitialTag && userMessage != "[MULAI_CEK_GEJALA]" {
			// If we are replacing the initial tag with real content
			newTitle = fmt.Sprintf("[MULAI_CEK_GEJALA]: %s", userMessage)
		}

		if len(newTitle) > 60 {
			newTitle = newTitle[:57] + "..."
		}
		channel.Title = newTitle
		s.chatRepo.UpdateChannel(ctx, channel)
	}

	// 6. Increment User Usage
	user.CurrentUsage++
	s.userRepo.Update(ctx, user)

	// 7. Save AI Usage Log
	if usage != nil {
		cost := calculateLLMCost(usage.ModelName, usage.PromptTokenCount, usage.CompletionTokenCount)
		s.aiUsageRepo.Create(ctx, &defaultEntity.AiUsageLog{
			UserID:           channel.UserID,
			PromptTokens:     int(usage.PromptTokenCount),
			CandidatesTokens: int(usage.CompletionTokenCount),
			TotalTokens:      int(usage.TotalTokenCount),
			Model:            usage.ModelName,
			Cost:             cost,
		})
	}

	return nil
}

// calculateLLMCost returns the estimated cost for a generation call based on
// the model name prefix and token counts.
func calculateLLMCost(modelName string, promptTokens, completionTokens int32) float64 {
	if strings.HasPrefix(modelName, "gemini") {
		return (float64(promptTokens) * 0.0000001) + (float64(completionTokens) * 0.0000004)
	}
	return 0
}
func (s *chatService) RenameChannel(ctx context.Context, userID uint, channelUID string, newTitle string) error {
	channel, err := s.chatRepo.GetChannelByUID(ctx, channelUID)
	if err != nil {
		return err
	}

	if channel.UserID != userID {
		return fmt.Errorf("unauthorized to rename this chat")
	}

	channel.Title = newTitle
	return s.chatRepo.UpdateChannel(ctx, channel)
}

func (s *chatService) TogglePinChannel(ctx context.Context, userID uint, channelUID string) error {
	channel, err := s.chatRepo.GetChannelByUID(ctx, channelUID)
	if err != nil {
		return err
	}

	if channel.UserID != userID {
		return fmt.Errorf("unauthorized to pin this chat")
	}

	channel.IsPinned = !channel.IsPinned
	return s.chatRepo.UpdateChannel(ctx, channel)
}

func (s *chatService) DeleteChannel(ctx context.Context, userID uint, channelUID string) error {
	channel, err := s.chatRepo.GetChannelByUID(ctx, channelUID)
	if err != nil {
		return err
	}

	if channel.UserID != userID {
		return fmt.Errorf("unauthorized to delete this chat")
	}

	return s.chatRepo.DeleteChannel(ctx, channel.ID)
}

func (s *chatService) GetChannelInfo(ctx context.Context, userID uint, channelUID string) (*entity.ChatChannel, error) {
	channel, err := s.chatRepo.GetChannelByUID(ctx, channelUID)
	if err != nil {
		return nil, err
	}

	if channel.UserID != userID {
		return nil, fmt.Errorf("unauthorized")
	}

	return channel, nil
}
