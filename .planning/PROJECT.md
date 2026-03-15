# DesignDNA

## What This Is

DesignDNA là AI-powered design analysis tool cho Print On Demand (POD) sellers và graphic designers. Upload bất kỳ graphic design nào → AI giải mã "Visual DNA" (composition, color, typography, graphics, POD tech) và "Buyer DNA" (persona, identity signals, emotional triggers, occasion, "made for me" decisions) → tạo designs mới lấy cảm hứng ở nhiều mức sáng tạo với phương pháp SHIFT+B đảm bảo originality.

## Core Value

**Giúp POD sellers hiểu CHÍNH XÁC tại sao một design bán tốt — không chỉ visual mà cả buyer psychology — rồi tạo designs original có cùng sức hấp dẫn.**

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
- [ ] F1-13: Quick Scan mode (Visual DNA only, fast) vs Deep Analysis mode (Visual + Buyer DNA)

**F2 — Creative Generation:**
- [ ] F2-01: 3 Generation modes — "Same Buyer", "New Buyer", "Full Remix"
- [ ] F2-02: 5 Creativity Levels slider (Faithful → Radical)
- [ ] F2-03: SHIFT+B dimension controls (Subject, Harmony, Identity, Form, Text, Buyer Emotion)
- [ ] F2-04: Specificity Level selector (General / Niche / Hyper-niche)
- [ ] F2-05: AI image generation from DNA insights (Nano Banana 2 / Gemini image gen)
- [ ] F2-06: Buyer Fit analysis on generated design (match score, emotion match, originality score)
- [ ] F2-07: Chat-based refinement (multi-turn iteration)
- [ ] F2-08: Download generated image

**F3 — Batch Compare:**
- [ ] F3-01: Upload 2-5 images for batch analysis
- [ ] F3-02: Cross-design visual pattern analysis (common colors, typography, composition, style)
- [ ] F3-03: Buyer Overlap Map (shared persona, shared identity, shared emotion, shared occasion)
- [ ] F3-04: "Made For Me" patterns across designs (what winning designs have in common)
- [ ] F3-05: Winning Formula output (keep/experiment/avoid + suggested brief)
- [ ] F3-06: Generate from Winning Formula → routes to F2

**App Shell & UX:**
- [ ] APP-01: Landing screen with 3 action cards (Analyze, Compare, Quick Generate placeholder)
- [ ] APP-02: Dark mode elegant UI
- [ ] APP-03: Loading states during AI analysis/generation
- [ ] APP-04: Responsive layout

### Out of Scope

- Trend Advisor (Google Search grounding) — quá generic cho ngách đặc thù, không hữu ích
- SVG/vector output — Gemini generates raster only
- Real-time canvas editing — AI Studio = prompt-based, không có canvas tool
- Marketplace integration (auto-post to Etsy) — cần custom backend, ngoài scope
- User accounts / save history — v2 consideration
- Exact font name identification — Gemini limitation, chỉ classify type + suggest alternatives

## Context

- **Build method:** KHÔNG code trực tiếp. Tạo prompt + system instructions → paste vào Google AI Studio Build Mode → Gemini generate code React app → verify → iterate prompt
- **AI Studio:** Là production environment — build xong thì deploy trực tiếp trong AI Studio
- **Research sources:** 2 deep research sessions (Design Analysis Framework + AI Studio Capabilities) đã hoàn thành, artifacts trong `.planning/research/`
- **App concept v2:** Đã define đầy đủ features, userflow, DNA schemas — trong `.planning/references/APP-CONCEPT-V2.md`

## Constraints

- **Platform:** Google AI Studio Build Mode — tất cả code phải compatible với AI Studio runtime
- **Framework:** React (AI Studio dropdown selection)
- **Model for code gen:** Gemini 3.1 Pro Preview (code assistant trong Build Mode)
- **Model for analysis (app runtime):** gemini-2.5-flash (quick scan) / gemini-2.5-pro (deep analysis)
- **Model for image gen (app runtime):** gemini-3.1-flash-image-preview (Nano Banana 2)
- **UI Style:** Dark mode elegant — premium, clean, design-tool aesthetic
- **No external dependencies:** App phải self-contained trong AI Studio — không npm install, không external APIs ngoài Gemini
- **Structured Output:** JSON schema enforce cho tất cả analysis outputs — đảm bảo consistent khi chain F1 → F2

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| React framework | AI Studio generate React code tốt nhất, đơn giản cho SPA, không cần SSR | — Pending |
| Gemini 2.5 Flash cho Quick Scan | Fast + cost-effective, đủ cho visual-only analysis | — Pending |
| Gemini 2.5 Pro cho Deep Analysis | Stronger reasoning cần cho Buyer DNA inference | — Pending |
| Nano Banana 2 cho image gen | Best speed/quality balance | — Pending |
| Remove Trend Advisor (F4) | Google Search quá generic cho POD niches, thay bằng Buyer DNA | ✓ Good |
| SHIFT+B method (6 dimensions) | Thêm Buyer Emotion dimension so với SHIFT gốc | — Pending |
| Build via prompting, not coding | User muốn leverage AI Studio Build Mode | ✓ Good |
| Dark mode elegant UI | User preference + phù hợp design tool aesthetic | — Pending |

---
*Last updated: 2026-03-15 after initialization*
