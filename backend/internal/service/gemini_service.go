package service

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/generative-ai-go/genai"
	"github.com/hadi-projects/go-react-starter/config"
	"github.com/hadi-projects/go-react-starter/internal/entity"
	"github.com/hadi-projects/go-react-starter/internal/repository"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
)

type geminiProvider struct {
	config   *config.Config
	chatRepo repository.ChatRepository
}

// NewGeminiProvider creates a new GeminiProvider that implements LLMProvider.
func NewGeminiProvider(cfg *config.Config, chatRepo repository.ChatRepository) LLMProvider {
	return &geminiProvider{
		config:   cfg,
		chatRepo: chatRepo,
	}
}

func (s *geminiProvider) GenerateResponseStream(ctx context.Context, mode entity.ChatMode, history []entity.ChatMessage, userMessage string, extraSystemInstructions string, onChunk func(string)) (*UsageMetadata, error) {
	client, err := genai.NewClient(ctx, option.WithAPIKey(s.config.Gemini.APIKey))
	if err != nil {
		return nil, err
	}
	defer client.Close()

	model := client.GenerativeModel("gemini-2.5-flash")

	// 1. Semantic Search (Mini-RAG)
	contextInfo := s.getRelevantContext(ctx, userMessage)

	// 2. Prepare System Instruction
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

	model.SystemInstruction = &genai.Content{
		Parts: []genai.Part{genai.Text(systemPrompt)},
	}

	// 3. Configure Safety Settings (Tightened for medical safety)
	model.SafetySettings = []*genai.SafetySetting{
		{
			Category:  genai.HarmCategoryHarassment,
			Threshold: genai.HarmBlockLowAndAbove,
		},
		{
			Category:  genai.HarmCategoryHateSpeech,
			Threshold: genai.HarmBlockLowAndAbove,
		},
		{
			Category:  genai.HarmCategoryDangerousContent,
			Threshold: genai.HarmBlockLowAndAbove,
		},
		{
			Category:  genai.HarmCategorySexuallyExplicit,
			Threshold: genai.HarmBlockLowAndAbove,
		},
	}

	// 4. Handle Moderation in System Prompt
	moderationPrompt := `
MODERASI & ETIKA:
- Jika pengguna menggunakan kata-kata kasar (curse words), penghinaan, atau bahasa yang tidak pantas, Anda HARUS tetap profesional.
- Jangan membalas hinaan. Berikan peringatan lembut: "Mohon gunakan bahasa yang sopan agar saya dapat memberikan bantuan kesehatan yang optimal bagi Anda."
- Anda memiliki hak untuk berhenti merespons jika input pengguna mengandung konten yang sangat berbahaya atau melanggar etika.`

	model.SystemInstruction.Parts[0] = genai.Text(string(model.SystemInstruction.Parts[0].(genai.Text)) + moderationPrompt)

	// 3. Prepare History
	chat := model.StartChat()
	chat.History = s.convertHistory(history)

	// 4. Stream Response with Timeout
	geminiCtx, cancel := context.WithTimeout(ctx, 90*time.Second)
	defer cancel()

	// Special handling for system triggers
	finalUserMessage := userMessage
	if userMessage == "[MULAI_CEK_GEJALA]" {
		finalUserMessage = "Halo, saya ingin melakukan cek gejala. Silakan mulai sesi tanya jawab Anda."
	}

	iter := chat.SendMessageStream(geminiCtx, genai.Text(finalUserMessage))
	var lastResp *genai.GenerateContentResponse
	for {
		resp, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}
		lastResp = resp

		if len(resp.Candidates) > 0 {
			for _, part := range resp.Candidates[0].Content.Parts {
				if text, ok := part.(genai.Text); ok {
					onChunk(string(text))
				}
			}
		}
	}

	if lastResp != nil && lastResp.UsageMetadata != nil {
		return &UsageMetadata{
			PromptTokenCount:     lastResp.UsageMetadata.PromptTokenCount,
			CompletionTokenCount: lastResp.UsageMetadata.CandidatesTokenCount,
			TotalTokenCount:      lastResp.UsageMetadata.TotalTokenCount,
			ModelName:            "gemini-2.5-flash",
		}, nil
	}

	return nil, nil
}

func (s *geminiProvider) getRelevantContext(ctx context.Context, query string) string {
	// Simple keyword extraction - just use the full query for now
	penyakit, _ := s.chatRepo.SearchMedicpediaPenyakit(ctx, query)
	nutrisi, _ := s.chatRepo.SearchMedicpediaNutrisi(ctx, query)

	var contextParts []string
	for _, p := range penyakit {
		contextParts = append(contextParts, fmt.Sprintf("Disease: %s\nDescription: %s\nSymptoms: %s", p.Name, p.Description, p.FactorsSymptoms))
	}
	for _, n := range nutrisi {
		contextParts = append(contextParts, fmt.Sprintf("Nutrition: %s\nDescription: %s", n.Name, n.Description))
	}

	if len(contextParts) == 0 {
		return ""
	}

	return strings.Join(contextParts, "\n\n")
}

func (s *geminiProvider) convertHistory(history []entity.ChatMessage) []*genai.Content {
	var genaiHistory []*genai.Content
	for _, msg := range history {
		role := "user"
		if msg.Role == "assistant" || msg.Role == "ai" {
			role = "model"
		}
		genaiHistory = append(genaiHistory, &genai.Content{
			Role:  role,
			Parts: []genai.Part{genai.Text(msg.Content)},
		})
	}
	return genaiHistory
}
