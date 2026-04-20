package repository

import (
	"context"
	"github.com/hadi-projects/go-react-starter/internal/entity"
	"gorm.io/gorm"
)

type ChatRepository interface {
	CreateChannel(ctx context.Context, channel *entity.ChatChannel) error
	GetChannelsByUserID(ctx context.Context, userID uint) ([]entity.ChatChannel, error)
	GetChannelWithMessages(ctx context.Context, channelID uint) (*entity.ChatChannel, error)
	UpdateChannel(ctx context.Context, channel *entity.ChatChannel) error
	
	CreateMessage(ctx context.Context, message *entity.ChatMessage) error
	GetMessagesByChannelID(ctx context.Context, channelID uint) ([]entity.ChatMessage, error)

	// Search context for RAG
	SearchMedicpediaPenyakit(ctx context.Context, query string) ([]entity.MedicpediaPenyakit, error)
	SearchMedicpediaNutrisi(ctx context.Context, query string) ([]entity.MedicpediaNutrisi, error)
}

type chatRepository struct {
	db *gorm.DB
}

func NewChatRepository(db *gorm.DB) ChatRepository {
	return &chatRepository{db: db}
}

func (r *chatRepository) CreateChannel(ctx context.Context, channel *entity.ChatChannel) error {
	return r.db.WithContext(ctx).Create(channel).Error
}

func (r *chatRepository) GetChannelsByUserID(ctx context.Context, userID uint) ([]entity.ChatChannel, error) {
	var channels []entity.ChatChannel
	err := r.db.WithContext(ctx).
		Select("chat_channels.*, (SELECT COUNT(*) FROM chat_messages WHERE chat_messages.channel_id = chat_channels.id) as message_count").
		Where("user_id = ?", userID).
		Order("updated_at DESC").
		Find(&channels).Error
	return channels, err
}

func (r *chatRepository) GetChannelWithMessages(ctx context.Context, channelID uint) (*entity.ChatChannel, error) {
	var channel entity.ChatChannel
	err := r.db.WithContext(ctx).Preload("Messages").First(&channel, channelID).Error
	if err != nil {
		return nil, err
	}
	return &channel, nil
}

func (r *chatRepository) UpdateChannel(ctx context.Context, channel *entity.ChatChannel) error {
	return r.db.WithContext(ctx).Save(channel).Error
}

func (r *chatRepository) CreateMessage(ctx context.Context, message *entity.ChatMessage) error {
	return r.db.WithContext(ctx).Create(message).Error
}

func (r *chatRepository) GetMessagesByChannelID(ctx context.Context, channelID uint) ([]entity.ChatMessage, error) {
	var messages []entity.ChatMessage
	err := r.db.WithContext(ctx).Where("channel_id = ?", channelID).Order("created_at ASC").Find(&messages).Error
	return messages, err
}

func (r *chatRepository) SearchMedicpediaPenyakit(ctx context.Context, query string) ([]entity.MedicpediaPenyakit, error) {
	var results []entity.MedicpediaPenyakit
	err := r.db.WithContext(ctx).Where("name LIKE ? OR description LIKE ?", "%"+query+"%", "%"+query+"%").Limit(3).Find(&results).Error
	return results, err
}

func (r *chatRepository) SearchMedicpediaNutrisi(ctx context.Context, query string) ([]entity.MedicpediaNutrisi, error) {
	var results []entity.MedicpediaNutrisi
	err := r.db.WithContext(ctx).Where("name LIKE ? OR description LIKE ?", "%"+query+"%", "%"+query+"%").Limit(3).Find(&results).Error
	return results, err
}
