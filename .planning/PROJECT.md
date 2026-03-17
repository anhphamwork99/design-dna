# DesignDNA

## What This Is

DesignDNA là AI-powered design intelligence tool cho Print On Demand (POD) sellers và graphic designers. Upload bất kỳ graphic design nào → AI giải mã "Visual DNA" (composition, color, typography, graphics, POD tech) và "Buyer DNA" (persona, identity signals, emotional triggers, occasion, "made for me" decisions). So sánh nhiều designs để rút ra winning patterns. Từ đó sáng tạo designs mới qua quy trình: Original + Modify + Optional Patterns → AI Synthesis → POD-ready artwork. Full-stack app with server-side AI proxy, user auth, and cloud persistence.

## Core Value

**Giúp POD sellers hiểu CHÍNH XÁC tại sao một design bán tốt — không chỉ visual mà cả buyer psychology — rồi tạo designs original có cùng sức hấp dẫn, đảm bảo chất lượng in ấn POD.**

## Current State

**Shipped:** v2.0 Backend System (2026-03-17)
**Architecture:** React + Vite + Supabase (Auth + PostgreSQL) + Hono (API Proxy)
**Stats:** 35 source files, ~6,500 LOC TypeScript

**v2.0 delivered:**
- Supabase Auth (email/password + Google OAuth) + mandatory auth gate
- Hono API proxy — all prompts server-side, zero business logic in frontend
- Encrypted API key management (AES-256-GCM) per user
- Server persistence — analyses + patterns saved to PostgreSQL with RLS
- localStorage → server pattern migration (one-time, idempotent)
- "My Analyses" UI with auto-save, list, view, delete
- Settings UI for API key management

## Current Milestone: v3.0 UI Redesign

**Goal:** Full UI/UX redesign lấy cảm hứng từ Krea AI — chuyển từ dark mode sang light-first, left sidebar navigation, redesign tất cả screens với design system mới.

**Target features:**
- Extract & clone Krea AI design system (colors, typography, spacing, components, patterns)
- Left sidebar navigation thay thế landing screen selection
- Redesign tất cả screens: Analysis, Creative Studio, Compare, Pattern Library, My Analyses, Settings
- Clear feature list & navigation flow
- Light mode as default (giữ dark mode toggle nếu phù hợp)

## Architecture Principles (chốt 2026-03-16)

1. **Original là ground truth — BẮT BUỘC.** Generation luôn bắt đầu từ 1 design đã phân tích. Đây là "cái gốc" để sáng tạo.
2. **Patterns là tài sản tái sử dụng — TÙY CHỌN.** Kết quả Compare được lưu thành Pattern. User tích lũy nhiều patterns, apply 0/1/nhiều khi sáng tạo.
3. **Synthesis bắt buộc — TRƯỚC KHI generate.** AI tổng hợp original DNA + modifications + applied patterns → 1 concept thống nhất có linh hồn riêng, không phải Frankenstein mix.
4. **POD-ready output.** Generated artwork phải flat illustration, white bg, print-ready — enforce qua prompt constraints.

## Requirements

### Validated

**v1.0 — Full Feature App:**
- ✓ F1-01..F1-12: Design DNA Analysis (Visual + Buyer) — v1.0
- ✓ F2-01..F2-11: Creative Studio (synthesis → generation pipeline) — v1.0
- ✓ F3-01..F3-06: Batch Compare & Patterns — v1.0
- ✓ F4-01..F4-05: Pattern Library (save, browse, detail, apply) — v1.0
- ✓ APP-01..APP-04: App Shell & UX (landing, dark mode, loading, responsive) — v1.0

**v2.0 — Backend System:**
- ✓ AUTH-01..06: Supabase Auth (email/password, Google OAuth, auth gate, logout) — v2.0
- ✓ PROXY-01..05: API Proxy (server-side prompts, encrypted keys, error mapping) — v2.0
- ✓ DATA-01..05: Server Persistence (analyses, patterns, RLS) — v2.0
- ✓ UI-01..06: Frontend Auth & Data UI — v2.0
- ✓ MIG-01..03: localStorage Migration — v2.0

### Active

(Defining requirements for v3.0 UI Redesign)

### Out of Scope

- Trend Advisor (Google Search grounding) — quá generic cho ngách đặc thù
- SVG/vector output — Gemini generates raster only
- Real-time canvas editing — prompt-based generation
- Marketplace integration (auto-post to Etsy) — cần custom backend
- Exact font name identification — Gemini limitation, chỉ classify type + suggest alternatives
- Mobile app — web-first approach
- Real-time sync — single user per session
- Complex RBAC — no roles beyond "authenticated user"

## Context

- **Build method:** Direct code implementation in IDE (transitioned from AI Studio Build Mode at Phase 6)
- **Research sources:** 2 deep research sessions (Design Analysis Framework + AI Studio Capabilities)
- **App concept v2:** Features, userflow, DNA schemas — trong `.planning/references/APP-CONCEPT-V2.md`
- **Architecture analysis:** First principles redesign (2026-03-16)
- **Backend context:** Decisions from discussion — trong `.planning/references/BACKEND-CONTEXT.md`
- **Reference POD artwork:** Desired output style — trong `.planning/deliverables/reference-pod-artwork/`

## Constraints

- **Framework:** React + Vite (frontend) + Hono (backend API)
- **Database:** Supabase PostgreSQL + Row Level Security
- **Auth:** Supabase Auth (email/password + Google OAuth)
- **Model for analysis:** gemini-3.1-pro-preview (unified deep analysis)
- **Model for synthesis:** gemini-2.5-pro (strong reasoning for concept creation)
- **Model for image gen:** gemini-2.5-flash-image (artwork generation with multimodal input)
- **Model for buyer fit:** gemini-3-flash-preview (scoring)
- **UI Style:** Dark mode elegant — premium, clean, design-tool aesthetic
- **Structured Output:** JSON schema enforce cho analysis outputs
- **Persistence:** Supabase PostgreSQL (server-side, per-user with RLS)
- **API Keys:** User-provided Gemini API keys, stored encrypted (AES-256-GCM)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| React framework | Đơn giản cho SPA, không cần SSR | ✓ Good |
| Remove Trend Advisor | Google Search quá generic cho POD niches | ✓ Good |
| Dark mode elegant UI | User preference + phù hợp design tool aesthetic | ✓ Good |
| Direct code in IDE | Transitioned from AI Studio Build Mode — more control | ✓ Good |
| Merge Quick/Deep analysis | Single unified flow, better UX (Phase 6A) | ✓ Good |
| Original = required ground truth | Generation luôn cần 1 design gốc đã analyze | ✓ Good |
| Patterns = reusable assets | Compare results saved, apply 0/1/many khi generate | ✓ Good |
| Mandatory synthesis step | AI tổng hợp concept thống nhất trước khi generate | ✓ Good |
| Multimodal generation | Gửi original image + text prompt cho Gemini | ✓ Good |
| POD quality enforcement | Hardcode POD constraints vào generation prompt | ✓ Good |
| Supabase for auth + DB | Managed PostgreSQL, built-in Auth, RLS — zero backend auth code | ✓ Good |
| Hono for API proxy | Lightweight, TypeScript-native, Web Standard API — fast | ✓ Good |
| AES-256-GCM encryption | Industry standard for API key storage, per-key IV | ✓ Good |
| Incremental deprecation | patternStorage.ts legacy → API → delete over 2 phases | ✓ Good |
| Idempotent migration | name+createdAt dedup for localStorage→server migration | ✓ Good |

---
*Last updated: 2026-03-17 after v2.0 milestone*
