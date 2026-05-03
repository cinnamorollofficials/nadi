package service

import (
	"context"
	"fmt"

	"github.com/hadi-projects/go-react-starter/config"
	"github.com/hadi-projects/go-react-starter/internal/entity"
	"github.com/hadi-projects/go-react-starter/internal/repository"
)

// UsageMetadata holds provider-agnostic token usage information returned
// after a generation call.
type UsageMetadata struct {
	PromptTokenCount     int32
	CompletionTokenCount int32
	TotalTokenCount      int32
	ModelName            string
}

// LLMProvider is the interface all LLM backends must implement.
// ChatService depends on this interface exclusively.
type LLMProvider interface {
	GenerateResponseStream(
		ctx context.Context,
		mode entity.ChatMode,
		history []entity.ChatMessage,
		userMessage string,
		systemInstructions string,
		onChunk func(string),
	) (*UsageMetadata, error)
}

// NewLLMProvider selects and instantiates the correct LLMProvider based on
// cfg.SumoPod.LLMProvider. Returns an error if the provider name is
// unrecognized or if the required API key is missing.
func NewLLMProvider(cfg *config.Config, chatRepo repository.ChatRepository) (LLMProvider, error) {
	provider := cfg.SumoPod.LLMProvider
	if provider == "" {
		provider = "gemini"
	}

	switch provider {
	case "gemini":
		if cfg.Gemini.APIKey == "" {
			return nil, fmt.Errorf("GEMINI_API_KEY is required for the gemini provider")
		}
		return NewGeminiProvider(cfg, chatRepo), nil
	case "sumopod":
		if cfg.SumoPod.APIKey == "" {
			return nil, fmt.Errorf("SUMOPOD_API_KEY is required for the sumopod provider")
		}
		return NewSumoPodProvider(cfg), nil
	default:
		return nil, fmt.Errorf("unsupported LLM provider %q; supported: gemini, sumopod", provider)
	}
}
