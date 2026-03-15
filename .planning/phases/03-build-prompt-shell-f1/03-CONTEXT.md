# Phase 3: Build Prompt — App Shell + F1 Analysis - Context

**Gathered:** 2026-03-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Tạo build prompt(s) cho AI Studio Build Mode để generate React code cho: App Shell (topbar, routing), Landing Screen (hero + 3 action cards), Upload Flow, Mode Selection, DNA Analysis, DNA Card UI (Visual + Buyer tabs). Output là deliverable `.planning/deliverables/BUILD-PROMPT-SHELL-F1.md`. Phase này tạo PROMPT documents — không viết code trực tiếp.

</domain>

<decisions>
## Implementation Decisions

### Prompt Granularity — Hybrid Approach
- **1 prompt scaffold** tạo toàn bộ app skeleton (shell + landing + upload + DNA card) → follow-up prompts nhỏ refine từng section
- Deliverable chỉ chứa **prompt text** — user copy paste vào AI Studio
- Research confirms: "Break complex tasks into sequential prompts" + Build Mode hỗ trợ multi-turn context + Annotation Mode cho visual fixes

### Mock Data First, Wire API Later
- Build prompt đầu tiên tạo **UI với mock/hardcoded JSON** data — layout, design, interactions render chính xác trước
- API wiring (gọi Gemini API thật) sẽ là **follow-up prompt riêng** trong cùng phase
- User biết cách AI Studio Build Mode access Gemini API — không cần hướng dẫn API key
- Loading experience: **Specify chi tiết** trong prompt — skeleton layout matching content shapes, shimmer animation, staggered reveal khi results arrive (theo Style Guide Section 7)
- Error handling: **Specify cụ thể** — retry logic, user-friendly error messages, fallback states

### DNA Card — Data Display
- Visual DNA: **Summary paragraph trên cùng** + full detail fields bên dưới cho mỗi dimension
- Hiển thị **tất cả fields** — color bar + harmony/contrast/temperature + suggested fonts đều visible
- Buyer DNA tab: **Made For Me lên đầu** (quan trọng nhất) → Persona → Identity → Emotional → Occasion
- "Could also appeal to..." note: Agent's discretion cho placement

### Upload → Analysis Flow
- Flow: Upload → **preview image full** → chọn mode (Quick Scan / Deep Analysis) → nhấn "Analyze" button → loading skeleton → DNA Card
- Image preview: **Full preview** + mode selector + Analyze button = separate deliberate step
- "Analyze Another": button trên DNA Card → quay lại upload screen
- Navigation from DNA Card: **Placeholder buttons** cho "Generate from DNA" và "Compare" — disabled hoặc "Coming soon" (Phase 4-5 scope)

### Agent's Discretion
- Exact prompt wording và structure
- How many follow-up prompts cần (1 scaffold + N refinements)
- Mock data content (realistic example — outdoor hiking design)
- "Could also appeal to..." note placement
- Exact loading skeleton shapes
- Exact error messages và retry logic
- Whether to split scaffold prompt thành 2 (shell+landing first, then upload+DNA card) hoặc 1

</decisions>

<specifics>
## Specific Ideas

- Mock data nên dùng **outdoor hiking design example** từ APP-CONCEPT-V2 (mountain, earth tones, slab serif) — consistent với schema examples
- Scaffold prompt nên reference **System Instructions đã paste** (Phase 2) — không duplicate design tokens trong build prompt
- Loading skeleton cho DNA Card nên match actual content layout (title bars, text lines, color block placeholder)
- DNA Card staggered reveal: sections fade in sequentially (100ms delay) — creates "AI is thinking" effect

</specifics>

<deferred>
## Deferred Ideas

- Live API wiring chi tiết (Part of Phase 3 nhưng sẽ là follow-up prompt, không phải scaffold)
- Generation screen (Phase 4)
- Batch Compare (Phase 5)

</deferred>

---

*Phase: 03-build-prompt-shell-f1*
*Context gathered: 2026-03-15*
