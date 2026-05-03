# Requirements Document

## Introduction

This feature introduces a pluggable multi-LLM provider architecture to the Nadi backend. Currently, the chat system is tightly coupled to Google Gemini via `GeminiService`. The goal is to introduce a provider-agnostic `LLMProvider` interface that both the existing Gemini integration and a new OpenAI-compatible provider (hosted at `https://ai.sumopod.com/v1/chat/completions`) can implement. The `ChatService` will depend on this interface rather than on `GeminiService` directly, so no frontend or handler changes are required. Providers are selected and configured via environment variables.

## Glossary

- **LLM_Provider**: A backend service that accepts a conversation history and a user message and returns a streamed text response. Examples: Gemini, SumoPod.
- **LLMProvider_Interface**: The Go interface (`LLMProvider`) that all LLM providers must implement, replacing the current `GeminiService` dependency in `ChatService`.
- **Gemini_Provider**: The existing Google Gemini integration, refactored to implement `LLMProvider_Interface`.
- **SumoPod_Provider**: The new OpenAI-compatible provider using the endpoint `https://ai.sumopod.com/v1/chat/completions` with Bearer token authentication.
- **Provider_Registry**: The component responsible for selecting and instantiating the correct `LLM_Provider` based on configuration.
- **ChatService**: The existing service that orchestrates message processing, usage tracking, and encryption. It will depend on `LLMProvider_Interface` instead of `GeminiService`.
- **UsageMetadata**: A provider-agnostic struct containing token counts (prompt tokens, completion tokens, total tokens) and model name returned after a generation call.
- **Active_Provider**: The `LLM_Provider` selected at startup via the `LLM_PROVIDER` environment variable.
- **StreamChunk**: A partial text fragment emitted by an `LLM_Provider` during streaming.

---

## Requirements

### Requirement 1: Provider-Agnostic LLM Interface

**User Story:** As a backend developer, I want a single interface that all LLM providers implement, so that `ChatService` can work with any provider without code changes.

#### Acceptance Criteria

1. THE LLMProvider_Interface SHALL define a method `GenerateResponseStream(ctx, mode, history, userMessage, systemInstructions, onChunk) (*UsageMetadata, error)` that all providers must implement.
2. THE UsageMetadata SHALL contain fields for prompt token count, completion token count, total token count, and model name as a string.
3. THE ChatService SHALL depend on LLMProvider_Interface and not on any concrete provider type.
4. WHEN a new LLM_Provider is added, THE System SHALL require no changes to ChatService, chat_handler, or any frontend code.

---

### Requirement 2: Gemini Provider Refactoring

**User Story:** As a backend developer, I want the existing Gemini integration to implement the new `LLMProvider_Interface`, so that it continues to work without behavioral changes.

#### Acceptance Criteria

1. THE Gemini_Provider SHALL implement LLMProvider_Interface by adapting its existing `GenerateResponseStream` signature to match the interface.
2. WHEN the `LLM_PROVIDER` environment variable is set to `"gemini"`, THE Provider_Registry SHALL instantiate and return the Gemini_Provider.
3. THE Gemini_Provider SHALL preserve all existing behavior including system prompt construction, safety settings, history conversion, and RAG context lookup.
4. THE Gemini_Provider SHALL return a UsageMetadata value populated from `genai.UsageMetadata` fields (`PromptTokenCount`, `CandidatesTokenCount`, `TotalTokenCount`) and the model name `"gemini-2.5-flash"`.
5. IF the Gemini API key (`GEMINI_API_KEY`) is empty and the Gemini_Provider is selected, THEN THE Provider_Registry SHALL return an error at startup.

---

### Requirement 3: SumoPod OpenAI-Compatible Provider

**User Story:** As a backend developer, I want a new LLM provider that calls the SumoPod OpenAI-compatible API, so that the application can use an alternative model without frontend changes.

#### Acceptance Criteria

1. THE SumoPod_Provider SHALL implement LLMProvider_Interface.
2. WHEN generating a response, THE SumoPod_Provider SHALL send an HTTP POST request to `https://ai.sumopod.com/v1/chat/completions` with a JSON body containing `model`, `messages`, `max_tokens`, `temperature`, and `stream: true`.
3. THE SumoPod_Provider SHALL set the `Authorization` header to `Bearer <SUMOPOD_API_KEY>` and the `Content-Type` header to `application/json` on every request.
4. THE SumoPod_Provider SHALL parse the Server-Sent Events (SSE) stream response, extracting `delta.content` from each `data:` line and invoking the `onChunk` callback for each non-empty fragment.
5. WHEN the SSE stream contains a `data: [DONE]` line, THE SumoPod_Provider SHALL stop reading and return.
6. THE SumoPod_Provider SHALL convert the `entity.ChatMessage` history into the OpenAI `messages` array format, mapping role `"assistant"` to `"assistant"` and role `"user"` to `"user"`, and prepending a `"system"` role message containing the system instructions.
7. THE SumoPod_Provider SHALL return a UsageMetadata value populated from the `usage` field of the final SSE response chunk (if present), using the `model` field as the model name.
8. IF the SumoPod API key (`SUMOPOD_API_KEY`) is empty and the SumoPod_Provider is selected, THEN THE Provider_Registry SHALL return an error at startup.
9. IF the HTTP response status code from the SumoPod endpoint is not 200, THEN THE SumoPod_Provider SHALL return a descriptive error including the status code and response body.
10. WHEN the `LLM_PROVIDER` environment variable is set to `"sumopod"`, THE Provider_Registry SHALL instantiate and return the SumoPod_Provider.

---

### Requirement 4: Provider Selection via Configuration

**User Story:** As a system operator, I want to select the active LLM provider via an environment variable, so that I can switch providers without recompiling the application.

#### Acceptance Criteria

1. THE System SHALL read the `LLM_PROVIDER` environment variable at startup to determine the Active_Provider.
2. WHEN `LLM_PROVIDER` is set to `"gemini"`, THE Provider_Registry SHALL select the Gemini_Provider.
3. WHEN `LLM_PROVIDER` is set to `"sumopod"`, THE Provider_Registry SHALL select the SumoPod_Provider.
4. WHEN `LLM_PROVIDER` is not set or is empty, THE Provider_Registry SHALL default to `"gemini"` to preserve backward compatibility.
5. IF `LLM_PROVIDER` is set to an unrecognized value, THEN THE Provider_Registry SHALL return an error at startup with a message listing the supported provider names.
6. THE Config SHALL expose a `SumoPod` configuration struct containing `APIKey` (from `SUMOPOD_API_KEY`), `BaseURL` (from `SUMOPOD_BASE_URL`, defaulting to `"https://ai.sumopod.com/v1"`), `Model` (from `SUMOPOD_MODEL`, defaulting to `"gpt-4o-mini"`), and `LLMProvider` (from `LLM_PROVIDER`, defaulting to `"gemini"`).

---

### Requirement 5: Usage Logging Compatibility

**User Story:** As a system operator, I want AI usage logs to be recorded regardless of which provider is active, so that token consumption and cost tracking remain consistent.

#### Acceptance Criteria

1. WHEN a response is generated by any LLM_Provider, THE ChatService SHALL log an `AiUsageLog` record using the token counts from the returned UsageMetadata.
2. THE AiUsageLog record SHALL include the model name from UsageMetadata so that logs identify which provider and model was used.
3. WHEN UsageMetadata is nil (provider did not return usage data), THE ChatService SHALL skip usage log creation without returning an error.
4. THE ChatService SHALL calculate estimated cost using provider-specific rates; WHEN the provider is `"gemini"`, THE ChatService SHALL use the existing Gemini token pricing formula.

---

### Requirement 6: Backward Compatibility

**User Story:** As a developer, I want the existing deployment to continue working without any configuration changes, so that the migration to the new architecture is non-breaking.

#### Acceptance Criteria

1. WHEN `LLM_PROVIDER` is not set in the environment, THE System SHALL behave identically to the current production behavior using the Gemini_Provider.
2. THE existing `GEMINI_API_KEY` environment variable SHALL remain the configuration key for the Gemini_Provider API key.
3. THE ChatService public interface (method signatures) SHALL remain unchanged.
4. THE chat_handler, WebSocket protocol, and all frontend-facing API contracts SHALL remain unchanged.
5. WHEN `GEMINI_API_KEY` is set and `LLM_PROVIDER` is unset, THE System SHALL start successfully and route all chat requests through the Gemini_Provider.
