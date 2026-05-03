package service

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/hadi-projects/go-react-starter/config"
	"github.com/hadi-projects/go-react-starter/internal/entity"
)

// sumoPodProvider implements LLMProvider using the SumoPod OpenAI-compatible API.
type sumoPodProvider struct {
	cfg *config.Config
}

// NewSumoPodProvider creates a new SumoPodProvider that implements LLMProvider.
func NewSumoPodProvider(cfg *config.Config) LLMProvider {
	return &sumoPodProvider{cfg: cfg}
}

// sumoPodMessage represents a single message in the OpenAI-compatible messages array.
type sumoPodMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// sumoPodRequest is the JSON body sent to the SumoPod chat completions endpoint.
type sumoPodRequest struct {
	Model       string           `json:"model"`
	Messages    []sumoPodMessage `json:"messages"`
	MaxTokens   int              `json:"max_tokens"`
	Temperature float64          `json:"temperature"`
	Stream      bool             `json:"stream"`
}

// sumoPodDelta holds the content fragment from a streaming chunk.
type sumoPodDelta struct {
	Content string `json:"content"`
}

// sumoPodChoice represents a single choice in a streaming chunk.
type sumoPodChoice struct {
	Delta        sumoPodDelta `json:"delta"`
	FinishReason *string      `json:"finish_reason"`
}

// sumoPodUsage holds token usage data from the final SSE chunk.
type sumoPodUsage struct {
	PromptTokens     int32 `json:"prompt_tokens"`
	CompletionTokens int32 `json:"completion_tokens"`
	TotalTokens      int32 `json:"total_tokens"`
}

// sumoPodChunk represents a single SSE data chunk from the SumoPod API.
type sumoPodChunk struct {
	ID      string          `json:"id"`
	Object  string          `json:"object"`
	Choices []sumoPodChoice `json:"choices"`
	Usage   *sumoPodUsage   `json:"usage"`
	Model   string          `json:"model"`
}

// GenerateResponseStream sends a streaming chat completion request to the SumoPod API,
// calls onChunk for each text fragment received, and returns usage metadata from the
// final SSE chunk.
//
// The mode parameter is accepted but not used — the system instructions already encode
// mode-specific behavior.
func (p *sumoPodProvider) GenerateResponseStream(
	ctx context.Context,
	mode entity.ChatMode,
	history []entity.ChatMessage,
	userMessage string,
	systemInstructions string,
	onChunk func(string),
) (*UsageMetadata, error) {
	// Build the messages array: system message first, then history, then the new user message.
	messages := p.buildMessages(systemInstructions, history, userMessage)

	reqBody := sumoPodRequest{
		Model:       p.cfg.SumoPod.Model,
		Messages:    messages,
		MaxTokens:   8192,
		Temperature: 0.7,
		Stream:      true,
	}

	bodyBytes, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("sumopod: failed to marshal request: %w", err)
	}

	url := p.cfg.SumoPod.BaseURL + "/chat/completions"
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(bodyBytes))
	if err != nil {
		return nil, fmt.Errorf("sumopod: failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+p.cfg.SumoPod.APIKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("sumopod: HTTP request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyContent, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("sumopod API error: status %d, body: %s", resp.StatusCode, string(bodyContent))
	}

	// Parse the SSE stream line by line.
	var lastUsage *sumoPodUsage
	var lastModel string

	scanner := bufio.NewScanner(resp.Body)
	for scanner.Scan() {
		line := scanner.Text()

		// Skip lines that don't start with "data: "
		if !strings.HasPrefix(line, "data: ") {
			continue
		}

		payload := strings.TrimPrefix(line, "data: ")

		// Stop on the [DONE] sentinel.
		if payload == "[DONE]" {
			break
		}

		// Parse the JSON chunk; skip malformed lines (non-fatal).
		var chunk sumoPodChunk
		if err := json.Unmarshal([]byte(payload), &chunk); err != nil {
			continue
		}

		// Track usage and model from every chunk (the final chunk carries the real values).
		if chunk.Usage != nil {
			lastUsage = chunk.Usage
		}
		if chunk.Model != "" {
			lastModel = chunk.Model
		}

		// Emit content fragments.
		for _, choice := range chunk.Choices {
			if choice.Delta.Content != "" {
				onChunk(choice.Delta.Content)
			}
		}
	}

	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("sumopod: error reading SSE stream: %w", err)
	}

	// Return usage metadata if the final chunk carried it.
	if lastUsage != nil {
		return &UsageMetadata{
			PromptTokenCount:     lastUsage.PromptTokens,
			CompletionTokenCount: lastUsage.CompletionTokens,
			TotalTokenCount:      lastUsage.TotalTokens,
			ModelName:            lastModel,
		}, nil
	}

	return nil, nil
}

// buildMessages constructs the OpenAI-compatible messages array.
// It prepends a "system" role message with systemInstructions, appends the
// conversation history, and finally appends the new user message.
func (p *sumoPodProvider) buildMessages(systemInstructions string, history []entity.ChatMessage, userMessage string) []sumoPodMessage {
	messages := make([]sumoPodMessage, 0, len(history)+2)

	// Prepend system instructions with a mandatory language rule appended.
	languageRule := "\n\nATURAN BAHASA: Anda WAJIB selalu merespons dalam Bahasa Indonesia, tanpa pengecualian. Meskipun pengguna menulis dalam bahasa lain, tetap jawab dalam Bahasa Indonesia."
	messages = append(messages, sumoPodMessage{
		Role:    "system",
		Content: systemInstructions + languageRule,
	})

	// Map history: "user" → "user", "assistant" → "assistant".
	for _, msg := range history {
		role := msg.Role
		if role != "user" && role != "assistant" {
			// Normalise unexpected roles to "user" as a safe fallback.
			role = "user"
		}
		messages = append(messages, sumoPodMessage{
			Role:    role,
			Content: msg.Content,
		})
	}

	// Append the new user message.
	messages = append(messages, sumoPodMessage{
		Role:    "user",
		Content: userMessage,
	})

	return messages
}
