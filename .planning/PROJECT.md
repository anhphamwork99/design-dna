# DesignDNA

## What This Is

DesignDNA là AI-powered design intelligence tool cho Print On Demand (POD) sellers và graphic designers. Upload bất kỳ graphic design nào → AI giải mã "Visual DNA" (composition, color, typography, graphics, POD tech) và "Buyer DNA" (persona, identity signals, emotional triggers, occasion, "made for me" decisions). So sánh nhiều designs để rút ra winning patterns. Từ đó sáng tạo designs mới qua quy trình: Original + Modify + Optional Patterns → AI Synthesis → POD-ready artwork.

## Core Value

**Giúp POD sellers hiểu CHÍNH XÁC tại sao một design bán tốt — không chỉ visual mà cả buyer psychology — rồi tạo designs original có cùng sức hấp dẫn, đảm bảo chất lượng in ấn POD.**

## Architecture Principles (chốt 2026-03-16)

1. **Original là ground truth — BẮT BUỘC.** Generation luôn bắt đầu từ 1 design đã phân tích. Đây là "cái gốc" để sáng tạo.
2. **Patterns là tài sản tái sử dụng — TÙY CHỌN.** Kết quả Compare được lưu thành Pattern. User tích lũy nhiều patterns, apply 0/1/nhiều khi sáng tạo.
3. **Synthesis bắt buộc — TRƯỚC KHI generate.** AI tổng hợp original DNA + modifications + applied patterns → 1 concept thống nhất có linh hồn riêng, không phải Frankenstein mix.
4. **POD-ready output.** Generated artwork phải flat illustration, white bg, print-ready — enforce qua prompt constraints.

## Current Milestone: v2.0 Backend System

**Goal:** Chuyển DesignDNA từ client-side SPA sang full-stack application — backend cho persistence, auth, và bảo vệ nghiệp vụ.

**Target features:**
- Backend API proxy — giấu prompts/system instructions khỏi frontend
- User accounts — email/password + Google OAuth, bắt buộc login
- Server-side persistence — analysis results + patterns (JSON, không ảnh)
- API key management — user nhập key riêng, lưu server-side per user
- "My Analyses" — lưu + xem lại analysis history
- Pattern migration — localStorage → server khi tạo account
- Frontend auth UI — login, register, settings

**Decisions (from discussion 2026-03-17):** See `.planning/references/BACKEND-CONTEXT.md`

## Requirements

### Validated

(None yet — ship to validate)

### Active

**F1 — Design DNA Analysis:**
- [ ] F1-01: Upload image (PNG/JPEG/WEBP) để phân tích
- [ ] F1-02: Visual DNA — Phân tích Composition (grid, symmetry, focal point, flow, density)
- [ ] F1-03: Visual DNA — Phân tích Color (palette HEX, harmony type, 60-30-10 ratio, temperature)
- [ ] F1-04: Visual DNA — Phân tích Typography (font classification, hierarchy, spacing, suggested Google Fonts)
- [ ] F1-05: Visual DNA — Phân tích Graphics (illustration style, elements, effects, detail level)
- [ ] F1-06: Visual DNA — POD Technical (print method, suitable products, garment colors, scalability)
- [ ] F1-07: Buyer DNA — Persona (age, gender lean, interests, values, lifestyle, spending mindset)
- [ ] F1-08: Buyer DNA — Identity Signals (tribal belonging, message to world, aesthetic identity)
- [ ] F1-09: Buyer DNA — Emotional Triggers (primary emotion, trigger description, emotional arc)
- [ ] F1-10: Buyer DNA — Occasion & Timing (seasons, events, mood triggers, gift potential, evergreen vs viral)
- [ ] F1-11: Buyer DNA — "Made For Me" Decisions (specific design decisions + why they create personal resonance)
- [ ] F1-12: DNA Card UI — 2-tab display (Visual DNA tab + Buyer DNA tab)
- [x] ~~F1-13: Quick Scan vs Deep Analysis~~ → Merged into single unified analysis (Phase 6A)

**F2 — Creative Studio (redesigned 2026-03-16):**
- [ ] F2-01: Creative Studio screen — redesigned from Generation screen
- [ ] F2-02: Original design required — always starts from 1 analyzed design with image visible
- [ ] F2-03: Design Controls — simplified SHIFT+B dimensions (keep/change per dimension + text input)
- [ ] F2-04: Creativity Level slider (5 levels: Faithful → Radical)
- [ ] F2-05: Pattern integration — apply 0, 1, or multiple saved patterns as creative input
- [ ] F2-06: AI Concept Synthesis — mandatory step: AI creates unified concept from original + mods + patterns
- [ ] F2-07: Concept review — user reads, edits, or regenerates concept before artwork generation
- [ ] F2-08: Multimodal artwork generation — sends original image + synthesized prompt + POD constraints to Gemini
- [ ] F2-09: POD-ready output — flat illustration, white bg, no 3D/effects, print-ready
- [ ] F2-10: Chat-based refinement (multi-turn iteration on generated artwork)
- [ ] F2-11: Download generated image

**F3 — Batch Compare & Patterns:**
- [ ] F3-01: Upload 2-5 images for batch analysis
- [ ] F3-02: Cross-design visual pattern analysis (common colors, typography, composition, style)
- [ ] F3-03: Buyer Overlap Map (shared persona, shared identity, shared emotion, shared occasion)
- [ ] F3-04: "Made For Me" patterns across designs
- [ ] F3-05: Winning Formula output (keep/experiment/avoid + summary)
- [ ] F3-06: Save compare result as reusable Pattern (named, timestamped)

**F4 — Pattern Library:**
- [ ] F4-01: List saved patterns with name, source count, created date
- [ ] F4-02: View pattern detail (visual patterns, buyer overlap, winning formula)
- [ ] F4-03: Delete patterns
- [ ] F4-04: Apply pattern from library into Creative Studio
- [ ] F4-05: Persist patterns in localStorage

**App Shell & UX:**
- [ ] APP-01: Landing screen with action routes (Analyze, Compare, + Pattern Library entry if patterns exist)
- [ ] APP-02: Dark mode elegant UI
- [ ] APP-03: Loading states during AI analysis/generation/synthesis
- [ ] APP-04: Responsive layout

### Out of Scope

- Trend Advisor (Google Search grounding) — quá generic cho ngách đặc thù
- SVG/vector output — Gemini generates raster only
- Real-time canvas editing — prompt-based generation
- Marketplace integration (auto-post to Etsy) — cần custom backend
- User accounts / cloud sync — v2 consideration
- Exact font name identification — Gemini limitation, chỉ classify type + suggest alternatives

## Context

- **Build method:** Direct code implementation in IDE (transitioned from AI Studio Build Mode at Phase 6)
- **Research sources:** 2 deep research sessions (Design Analysis Framework + AI Studio Capabilities) trong `.planning/research/`
- **App concept v2:** Features, userflow, DNA schemas — trong `.planning/references/APP-CONCEPT-V2.md`
- **Architecture analysis:** First principles redesign — trong conversation artifacts (2026-03-16)
- **Reference POD artwork:** Desired output style — trong `.planning/deliverables/reference-pod-artwork/`

## Constraints

- **Framework:** React + Vite
- **Model for analysis:** gemini-3.1-pro-preview (unified deep analysis)
- **Model for synthesis:** gemini-2.5-pro (strong reasoning for concept creation)
- **Model for image gen:** gemini-2.5-flash-image (artwork generation with multimodal input)
- **Model for buyer fit:** gemini-3-flash-preview (scoring)
- **UI Style:** Dark mode elegant — premium, clean, design-tool aesthetic
- **Structured Output:** JSON schema enforce cho analysis outputs
- **Persistence:** localStorage for patterns and future history

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| React framework | Đơn giản cho SPA, không cần SSR | ✓ Good |
| Remove Trend Advisor (F4 cũ) | Google Search quá generic cho POD niches | ✓ Good |
| Dark mode elegant UI | User preference + phù hợp design tool aesthetic | ✓ Good |
| Direct code in IDE | Transitioned from AI Studio Build Mode — more control | ✓ Good |
| Merge Quick/Deep analysis | Single unified flow, better UX (Phase 6A) | ✓ Good |
| Original = required ground truth | Generation luôn cần 1 design gốc đã analyze | ✓ Good |
| Patterns = reusable assets | Compare results saved, apply 0/1/many khi generate | ✓ Good |
| Mandatory synthesis step | AI tổng hợp concept thống nhất trước khi generate | ✓ Good |
| Multimodal generation | Gửi original image + text prompt cho Gemini | ✓ Good |
| POD quality enforcement | Hardcode POD constraints vào generation prompt | ✓ Good |

---
*Last updated: 2026-03-16 after architecture redesign*
