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
	"github.com/hadi-projects/go-react-starter/internal/repository"
)

// sumoPodProvider implements LLMProvider using the SumoPod OpenAI-compatible API.
type sumoPodProvider struct {
	cfg      *config.Config
	chatRepo repository.ChatRepository
}

// NewSumoPodProvider creates a new SumoPodProvider that implements LLMProvider.
func NewSumoPodProvider(cfg *config.Config, chatRepo repository.ChatRepository) LLMProvider {
	return &sumoPodProvider{cfg: cfg, chatRepo: chatRepo}
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
func (p *sumoPodProvider) GenerateResponseStream(
	ctx context.Context,
	mode entity.ChatMode,
	history []entity.ChatMessage,
	userMessage string,
	extraSystemInstructions string,
	onChunk func(string),
) (*UsageMetadata, error) {
	// 1. Semantic Search (Mini-RAG) — same as GeminiProvider
	contextInfo := p.getRelevantContext(ctx, userMessage)

	// 2. Build system prompt — identical structure to GeminiProvider
	systemPrompt := `IDENTITAS PROFESIONAL (DR. NADI):
Anda adalah Dr. Nadi, seorang dokter virtual senior di platform Nadi. Anda memiliki spesialisasi dalam memberikan edukasi medis, melakukan triage gejala, dan bimbingan kesehatan primer.

STANDAR KOMUNIKASI KLINIS:
1. BEDSIDE MANNER: Gunakan nada bicara yang tenang, berwibawa, empatik, dan sangat sopan. Gunakan sapaan yang sesuai (seperti "Bapak/Ibu" atau "Anda").
2. PENALARAN KLINIS: Jangan sekadar menjawab "Ya/Tidak". Jelaskan secara singkat alasan medis di balik pertanyaan Anda agar pengguna merasa dipandu secara profesional.
3. KUNJUNGAN FISIK: Selalu tekankan bahwa konsultasi virtual ini tidak menggantikan pemeriksaan fisik secara langsung, namun Anda akan membantu memberikan panduan awal yang objektif.

STRUKTUR RESPON MEDIS:
Jika memberikan analisa terakhir, susun jawaban Anda secara sistematis dengan poin-poin berikut:
- RINGKASAN TEMUAN: Rangkuman dari apa yang dikeluhkan pengguna.
- ANALISA KLINIS: Penjelasan mengenai mekanisme gejala yang terjadi.
- KEMUNGKINAN PENYEBAB (DIAGNOSIS BANDING): Berikan beberapa kemungkinan kondisi medis yang relevan.
- RENCANA TINDAKAN (ACTION PLAN):
  * Saran pemeriksaan (misal: cek darah, rontgen, atau cukup istirahat).
  * Kapan harus segera menemui dokter spesialis di dunia nyata.
- SARAN GAYA HIDUP (PROMOTIF): Tips nutrisi dan aktivitas untuk menunjang kesembuhan.

ATURAN KETAT:
1. HANYA jawab topik kesehatan. Tolak topik lain dengan wibawa seorang dokter.
2. JANGAN mendiagnosis dengan kepastian 100%. Gunakan bahasa "Kemungkinan besar" atau "Ada indikasi ke arah...".
3. JANGAN memberikan rekomendasi dosis obat keras (antibiotik, obat jantung, dll) tanpa resep.
4. BAHASA: Anda WAJIB selalu merespons dalam Bahasa Indonesia, tanpa pengecualian. Meskipun pengguna menulis dalam bahasa lain, tetap jawab dalam Bahasa Indonesia.`

	if mode == entity.ChatModeConsultation {
		systemPrompt += "\n\nKonteks Medis Nadi:\n"
		if contextInfo != "" {
			systemPrompt += "Gunakan informasi sah berikut untuk membantu jawaban Anda:\n" + contextInfo
		}
	} else if mode == entity.ChatModeSymptomCheck {
		systemPrompt += `
MODUL SYMPTOM CHECKER (STRATEGI SATU PER SATU):
1. Anda memimpin percakapan. Mulailah dengan sapaan singkat dan tanya HANYA usia & jenis kelamin di pesan pertama.
2. ATURAN KRUSIAL: HANYA tanyakan SATU (1) pertanyaan dalam setiap balasan. Jangan pernah menanyakan dua hal atau lebih sekaligus.
3. Tunggu jawaban user sebelum lanjut ke pertanyaan berikutnya.
4. URUTAN YANG DISARANKAN:
   - Tahap 1: Usia & Jenis Kelamin.
   - Tahap 2: Keluhan utama secara spesifik.
   - Tahap 3: Durasi dan kapan munculnya.
   - Tahap 4: Faktor pemicu atau penyerta (mual, pusing, dll).
   - Tahap 5: Tingkat keparahan atau sifat rasa sakit.
5. JANGAN berikan analisa sebelum minimal 4-5 pertanyaan dijawab.
6. ANALISA FINAL: Berikan ringkasan, kemungkinan penyebab, dan saran tindakan (IGD jika red flags).`
	}

	if extraSystemInstructions != "" {
		systemPrompt += "\n\nINSTRUKSI KHUSUS SESI INI:\n" + extraSystemInstructions
	}

	systemPrompt += `

MODERASI & ETIKA:
- Jika pengguna menggunakan kata-kata kasar (curse words), penghinaan, atau bahasa yang tidak pantas, Anda HARUS tetap profesional.
- Jangan membalas hinaan. Berikan peringatan lembut: "Mohon gunakan bahasa yang sopan agar saya dapat memberikan bantuan kesehatan yang optimal bagi Anda."
- Anda memiliki hak untuk berhenti merespons jika input pengguna mengandung konten yang sangat berbahaya atau melanggar etika.`

	// 3. Build the messages array and send to SumoPod
	messages := p.buildMessages(systemPrompt, history, userMessage)

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
// It prepends a "system" role message with the fully-built system prompt,
// appends the conversation history, and finally appends the new user message.
func (p *sumoPodProvider) buildMessages(systemPrompt string, history []entity.ChatMessage, userMessage string) []sumoPodMessage {
	messages := make([]sumoPodMessage, 0, len(history)+2)

	messages = append(messages, sumoPodMessage{
		Role:    "system",
		Content: systemPrompt,
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

// getRelevantContext performs a mini-RAG lookup identical to GeminiProvider.
func (p *sumoPodProvider) getRelevantContext(ctx context.Context, query string) string {
	penyakit, _ := p.chatRepo.SearchMedicpediaPenyakit(ctx, query)
	nutrisi, _ := p.chatRepo.SearchMedicpediaNutrisi(ctx, query)

	var contextParts []string
	for _, item := range penyakit {
		contextParts = append(contextParts, fmt.Sprintf("Disease: %s\nDescription: %s\nSymptoms: %s", item.Name, item.Description, item.FactorsSymptoms))
	}
	for _, item := range nutrisi {
		contextParts = append(contextParts, fmt.Sprintf("Nutrition: %s\nDescription: %s", item.Name, item.Description))
	}

	if len(contextParts) == 0 {
		return ""
	}

	return strings.Join(contextParts, "\n\n")
}
