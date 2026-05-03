# Implementation Plan: Multi-LLM Provider

## Overview

Refactor the backend to introduce a pluggable `LLMProvider` interface, migrate the existing Gemini integration to implement it, add a new SumoPod OpenAI-compatible provider, and wire everything together via a factory function and updated config. No changes to `ChatHandler`, the WebSocket protocol, or any frontend code are required.

## Tasks

- [x] 1. Add SumoPod configuration to `config.go`
  - Add `SumoPodConfig` struct with fields `APIKey`, `BaseURL`, `Model`, and `LLMProvider`
  - Bind env vars `SUMOPOD_API_KEY`, `SUMOPOD_BASE_URL` (default `"https://ai.sumopod.com/v1"`), `SUMOPOD_MODEL` (default `"gpt-4o-mini"`), and `LLM_PROVIDER` (default `"gemini"`) using `viper`
  - Add `SumoPod SumoPodConfig` field to the `Config` struct
  - Populate `config.SumoPod` in `LoadConfig()`
  - _Requirements: 4.1, 4.6_

- [ ] 2. Define `LLMProvider` interface and `UsageMetadata` struct
  - [x] 2.1 Create `backend/internal/service/llm_provider.go`
    - Define `UsageMetadata` struct with fields `PromptTokenCount int32`, `CompletionTokenCount int32`, `TotalTokenCount int32`, `ModelName string`
    - Define `LLMProvider` interface with method `GenerateResponseStream(ctx, mode, history, userMessage, systemInstructions, onChunk) (*UsageMetadata, error)`
    - Add `NewLLMProvider(cfg *config.Config, chatRepo repository.ChatRepository) (LLMProvider, error)` factory function stub (returns error for now; will be completed in task 5)
    - _Requirements: 1.1, 1.2_

  - [ ]* 2.2 Write property test for `NewLLMProvider` — Property 2: unknown provider always errors
    - **Property 2: Unknown provider always errors**
    - Generate random strings that are not `""`, `"gemini"`, or `"sumopod"`; assert error is non-nil and provider is nil
    - Use `pgregory.net/rapid` for property generation
    - File: `backend/internal/service/llm_provider_test.go`
    - **Validates: Requirements 4.5**

- [ ] 3. Refactor `GeminiService` to implement `LLMProvider`
  - [x] 3.1 Rename and adapt `gemini_service.go`
    - Replace the `GeminiService` interface and `geminiService` struct with a `geminiProvider` struct implementing `LLMProvider`
    - Change `GenerateResponseStream` return type from `*genai.UsageMetadata` to `*UsageMetadata`
    - Populate `UsageMetadata` from `genai.UsageMetadata` fields: `PromptTokenCount`, `CandidatesTokenCount` → `CompletionTokenCount`, `TotalTokenCount`, and hardcode `ModelName` to `"gemini-2.5-flash"`
    - Preserve all existing behavior: system prompt construction, safety settings, RAG context lookup (`getRelevantContext`), history conversion (`convertHistory`), and `[MULAI_CEK_GEJALA]` special handling
    - Export a `NewGeminiProvider(cfg *config.Config, chatRepo repository.ChatRepository) LLMProvider` constructor
    - _Requirements: 2.1, 2.3, 2.4_

  - [ ]* 3.2 Write unit tests for `GeminiProvider` construction
    - `TestNewLLMProvider_Gemini`: verify `"gemini"` returns a `*geminiProvider`
    - `TestNewLLMProvider_Default`: verify empty string returns a `*geminiProvider`
    - `TestNewLLMProvider_MissingGeminiKey`: verify error when `GEMINI_API_KEY` is empty
    - File: `backend/internal/service/llm_provider_test.go`
    - _Requirements: 2.2, 2.5, 4.2, 4.4_

  - [ ]* 3.3 Write property test for `NewLLMProvider` — Property 7: default provider is Gemini
    - **Property 7: Default provider is Gemini**
    - Call `NewLLMProvider` with `LLM_PROVIDER = ""`; assert the returned provider is a `*geminiProvider` (not an error, not a SumoPodProvider)
    - File: `backend/internal/service/llm_provider_test.go`
    - **Validates: Requirements 4.4, 6.1**

  - [ ]* 3.4 Write property test for `NewLLMProvider` — Property 1: provider selection is deterministic
    - **Property 1: Provider selection is deterministic**
    - Generate random valid provider strings (`"gemini"`, `"sumopod"`); assert the returned provider is non-nil and error is nil
    - File: `backend/internal/service/llm_provider_test.go`
    - **Validates: Requirements 2.2, 3.10, 4.2, 4.3**

- [ ] 4. Implement `SumoPodProvider`
  - [x] 4.1 Create `backend/internal/service/sumopod_service.go`
    - Define `sumoPodProvider` struct with `cfg *config.Config` field
    - Implement `GenerateResponseStream` to:
      - Build the OpenAI-compatible messages array: prepend a `"system"` role message with `systemInstructions`, then map `entity.ChatMessage` history (role `"user"` → `"user"`, role `"assistant"` → `"assistant"`)
      - Send HTTP POST to `cfg.SumoPod.BaseURL + "/chat/completions"` with JSON body (`model`, `messages`, `max_tokens: 8192`, `temperature: 0.7`, `stream: true`)
      - Set `Authorization: Bearer <SUMOPOD_API_KEY>` and `Content-Type: application/json` headers
      - Parse SSE response line-by-line: extract `delta.content` from each `data:` line and call `onChunk` for each non-empty fragment
      - Stop on `data: [DONE]`
      - Return `*UsageMetadata` from the `usage` field of the final SSE chunk (if present), using the `model` field as `ModelName`
      - Return a descriptive error if HTTP status != 200
      - Skip malformed JSON SSE lines (non-fatal)
    - Export `NewSumoPodProvider(cfg *config.Config) LLMProvider` constructor
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.9_

  - [ ]* 4.2 Write unit tests for `SumoPodProvider`
    - `TestSumoPodConvertMessages`: verify role and content mapping for a concrete history slice (system prepended, user/assistant preserved)
    - `TestNewLLMProvider_SumoPod`: verify `"sumopod"` returns a `*sumoPodProvider`
    - `TestNewLLMProvider_MissingSumoPodKey`: verify error when `SUMOPOD_API_KEY` is empty
    - File: `backend/internal/service/sumopod_service_test.go`
    - _Requirements: 3.6, 3.8, 3.10, 4.3_

  - [ ]* 4.3 Write property test for `SumoPodProvider` — Property 4: message history conversion preserves roles
    - **Property 4: SumoPod message history conversion preserves roles**
    - Generate random slices of `entity.ChatMessage` with roles drawn from `{"user", "assistant"}`; assert the converted OpenAI messages slice has the same length (+1 for system) and matching role/content for each element
    - File: `backend/internal/service/sumopod_service_test.go`
    - **Validates: Requirements 3.6**

  - [ ]* 4.4 Write property test for `NewLLMProvider` — Property 3: missing API key always errors
    - **Property 3: Missing API key always errors at startup**
    - For each provider type, set the API key to `""` and assert `NewLLMProvider` returns a non-nil error
    - File: `backend/internal/service/llm_provider_test.go`
    - **Validates: Requirements 2.5, 3.8**

- [x] 5. Complete `NewLLMProvider` factory function
  - Implement the full factory logic in `backend/internal/service/llm_provider.go`:
    - Read `cfg.SumoPod.LLMProvider`; default empty string to `"gemini"`
    - Case `"gemini"`: validate `cfg.Gemini.APIKey` is non-empty, return `NewGeminiProvider(cfg, chatRepo)`
    - Case `"sumopod"`: validate `cfg.SumoPod.APIKey` is non-empty, return `NewSumoPodProvider(cfg)`
    - Default: return `fmt.Errorf("unsupported LLM provider %q; supported: gemini, sumopod")`
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 2.2, 2.5, 3.8, 3.10_

- [x] 6. Checkpoint — Ensure all tests pass
  - Run `go test ./internal/service/...` from the `backend` directory
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Update `ChatService` to use `LLMProvider`
  - [x] 7.1 Modify `backend/internal/service/chat_service.go`
    - Replace the `geminiService GeminiService` field in `chatService` struct with `llmProvider LLMProvider`
    - Update `NewChatService` constructor parameter from `geminiService GeminiService` to `llmProvider LLMProvider`
    - In `ProcessMessage`, replace `s.geminiService.GenerateResponseStream(...)` with `s.llmProvider.GenerateResponseStream(...)`
    - Update usage logging: replace direct `genai.UsageMetadata` field access with `UsageMetadata` fields (`PromptTokenCount`, `CompletionTokenCount`, `TotalTokenCount`, `ModelName`)
    - Replace hardcoded `"gemini-2.5-flash"` model name with `usage.ModelName`
    - Update cost calculation: use a helper that switches on `usage.ModelName` prefix — `"gemini"` prefix uses existing formula `(promptTokens * 0.0000001) + (completionTokens * 0.0000004)`, all other prefixes default to `0`
    - Skip `AiUsageLog` creation when `usage` is nil (no error returned)
    - _Requirements: 1.3, 5.1, 5.2, 5.3, 5.4_

  - [ ]* 7.2 Write property test for `ChatService` — Property 5: UsageMetadata nil safety
    - **Property 5: UsageMetadata nil safety in ChatService**
    - Use a mock `LLMProvider` that returns `nil` metadata; call `ProcessMessage`; assert no error and no `AiUsageLog` record created
    - File: `backend/internal/service/chat_service_test.go`
    - **Validates: Requirements 5.3**

  - [ ]* 7.3 Write property test for `ChatService` — Property 6: usage log model name matches provider metadata
    - **Property 6: Usage log model name matches provider metadata**
    - Generate random `ModelName` strings; use a mock provider returning `UsageMetadata` with that name; assert the created `AiUsageLog.Model` equals the generated name
    - File: `backend/internal/service/chat_service_test.go`
    - **Validates: Requirements 5.2**

  - [ ]* 7.4 Write unit tests for `ChatService` usage logging
    - `TestChatService_ProcessMessage_NilUsage`: verify no `AiUsageLog` is created when provider returns nil metadata
    - `TestChatService_ProcessMessage_UsageLogged`: verify `AiUsageLog.Model` matches `UsageMetadata.ModelName`
    - File: `backend/internal/service/chat_service_test.go`
    - _Requirements: 5.2, 5.3_

- [x] 8. Wire `NewLLMProvider` into the router/startup
  - Locate where `NewGeminiService` and `NewChatService` are called (likely `backend/cmd/api/main.go` or a router setup file)
  - Replace `NewGeminiService(cfg, chatRepo)` with `NewLLMProvider(cfg, chatRepo)`
  - Pass the returned `LLMProvider` to `NewChatService` in place of the old `GeminiService`
  - Add error handling: if `NewLLMProvider` returns an error, call `log.Fatal` or `panic` (consistent with existing `validateConfig` behavior)
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 9. Final checkpoint — Ensure all tests pass and build succeeds
  - Run `go build ./...` from the `backend` directory to verify no compilation errors
  - Run `go test ./...` from the `backend` directory to verify all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The `pgregory.net/rapid` library is used for property-based tests (pure Go, no external test runner required)
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties; unit tests validate specific examples and edge cases
- The `ChatHandler`, WebSocket protocol, and all frontend-facing API contracts remain unchanged throughout
