# Phase 2: AI Studio Configuration - Context

**Gathered:** 2026-03-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Tạo AI Studio Configuration document gồm: System Instructions (role, capabilities, conventions), Structured Output JSON schemas (Visual DNA, Buyer DNA, Batch Compare), và model selection mapping. Output là 1 deliverable `.planning/deliverables/AI-STUDIO-CONFIG.md`. Phase này KHÔNG build code — chỉ tạo configuration documents cho AI Studio.

</domain>

<decisions>
## Implementation Decisions

### System Instructions — Structure & Scope
- Frame: **"You are a React developer building the DesignDNA app..."** — code generation focus, hướng dẫn Gemini Build Mode tạo code
- Scope: **1 System Instructions duy nhất**, general/conceptual — focus vào concepts, rules, conventions. Chi tiết từng feature sẽ do user prompts (Phase 3-5) yêu cầu cụ thể
- Style Guide: **Embed trực tiếp** vào System Instructions (không reference riêng)
- Content ngoài Style Guide: Agent's discretion — quyết định thêm product context, navigation rules, error handling, constraints nào cần thiết

### JSON Schema — Strictness & Optionality
- `made_for_me_decisions`: **Fixed count 3-5** decisions per analysis — AI luôn output đúng range này
- `color.palette`: **5 colors** — follow Style Guide proportional color bar spec (5 segments, 60-30-10 ratio)
- Classification fields (`harmony`, `grid_type`, `style`, etc.): **Free-text strings** — KHÔNG dùng enum, để AI mô tả tự nhiên
- Data formats: **Simple, user-readable** — VD `age_range: "25-35"` (string), focus vào dễ hiểu khi display trên UI

### Quick Scan vs Deep Analysis
- Visual DNA detail: **Cùng level** cho cả 2 modes — Quick Scan không giảm detail Visual DNA
- Chỉ khác: Quick Scan **không có Buyer DNA**, Deep Analysis **có Buyer DNA đầy đủ**
- Mode selection: **Sau khi upload** — user upload image xong mới chọn Quick Scan hay Deep Analysis
- Prompt structure & schema approach: Agent's discretion

### Buyer DNA Inference
- Confidence level: **Không show** — output clean, không kèm % confidence
- Ambiguous designs: **1 primary buyer** + note "Could also appeal to..." — commit vào 1 profile chính, mention alternatives ngắn gọn
- `made_for_me_decisions` tone: **Mix** — decision title neutral/analytical, explanation conversational/insightful (giống APP-CONCEPT-V2 examples)
- Content language: **Tiếng Anh** — toàn bộ analysis output bằng English

### Agent's Discretion
- Cấu trúc nội dung System Instructions ngoài Style Guide (product context, constraints, error patterns)
- Prompt structure for Quick Scan vs Deep Analysis (single prompt with mode flag vs separate sections)
- JSON schema cho Quick Scan (cùng schema với Buyer DNA null, hay schema riêng nhỏ hơn)
- Schema field ordering và naming conventions
- Batch Compare schema structure (how to represent cross-design patterns)
- Model selection config format
- Generation prompt template structure (SHIFT+B → image gen prompt)

</decisions>

<specifics>
## Specific Ideas

- System Instructions phải **general enough** để không cần thay đổi khi build từng phase — user prompts sẽ handle chi tiết
- Style Guide embed **nguyên vẹn** — không tóm tắt hay rút gọn
- `made_for_me_decisions` explanation style phải match APP-CONCEPT-V2 examples — "Earth-tone palette" (neutral title) + "Colors literally match the environment they love. Wearing these colors = wearing nature. Would FAIL in neon or pastels." (conversational explanation)
- User role boundary rõ ràng: User chốt UX + features, Agent quyết định implementation + business logic
- JSON schemas serve 2 purposes: (1) Gemini structured output enforcement, (2) TypeScript type definitions cho React app

</specifics>

<deferred>
## Deferred Ideas

- Không có — scope rõ ràng

</deferred>

---

*Phase: 02-ai-studio-configuration*
*Context gathered: 2026-03-15*
