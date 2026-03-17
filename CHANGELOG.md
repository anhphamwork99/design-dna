# Changelog

All notable changes to DesignDNA are documented in this file.

## [2.0.0] — 2026-03-17

### 🏗 Backend System

Full-stack migration: client-side SPA → Supabase + Hono backend with auth, persistence, and prompt protection.

### Added
- **Supabase Auth** — email/password registration and login, Google OAuth, auto session refresh
- **Auth gate** — unauthenticated users see login screen only, logout button in header
- **Hono API proxy** — all 7 Gemini prompt modules moved server-side (analyze, compare, synthesize, generate, clone, buyer-fit, helpers)
- **6 AI proxy routes** — `/api/ai/analyze`, `/api/ai/batch`, `/api/ai/synthesize`, `/api/ai/generate`, `/api/ai/clone`, `/api/ai/buyer-fit`
- **Encrypted API key management** — AES-256-GCM encryption, per-user storage in Supabase, CRUD via Settings modal
- **Server persistence — Analyses** — auto-save after analysis, My Analyses UI (list, view in read mode, delete)
- **Server persistence — Patterns** — full CRUD routes, Pattern Library + Detail powered by API
- **localStorage migration** — one-time migration hook with banner UI, idempotent (name + createdAt dedup)
- **Database schema** — 4 tables (profiles, api_keys, analyses, patterns) with Row Level Security
- **Auth middleware** — JWT verification with user-scoped Supabase client for RLS

### Changed
- Frontend `apiClient.ts` replaces direct Gemini SDK calls — `@google/genai` removed from frontend
- Pattern Library, Pattern Detail, Creative Studio, Compare screens all use server API instead of localStorage
- Settings modal replaces inline API key input

### Removed
- `patternStorage.ts` — deprecated in Phase 12, deleted in Phase 13
- Direct `@google/genai` dependency from frontend
- Client-side API key storage in localStorage

### Security
- All prompts and system instructions stored server-side only
- API keys encrypted at rest (AES-256-GCM with per-key IV)
- Row Level Security on all database tables
- JWT-authenticated API routes

---

## [1.0.0] — 2026-03-17

### 🎨 Full Feature App

Initial release: complete design analysis and creation tool for POD sellers.

### Added
- **Design DNA Analysis** — Visual DNA (composition, color, typography, graphics, POD tech) + Buyer DNA (persona, identity signals, emotional triggers, occasion, "Made For Me" decisions)
- **Creative Studio** — 3-panel layout (config → canvas → evaluation), 5-level creativity slider, aspect ratio options (6 formats)
- **AI Concept Synthesis** — mandatory synthesis step before artwork generation
- **Multimodal Artwork Generation** — two-pass pipeline (illustration → typography decoration)
- **Batch Compare** — upload 2–5 designs, cross-design pattern analysis, Winning Formula extraction
- **Pattern Library** — save, browse, view detail, delete, apply patterns in Creative Studio
- **Section selection** — apply patterns to specific design sections
- **Buyer Fit scoring** — AI evaluation of generated artwork vs target audience
- **Dark mode elegant UI** — premium design-tool aesthetic
- **POD-ready output** — flat illustration, white background, print-ready constraints

### Architecture
- React + Vite SPA
- Client-side only (user provides own Gemini API key)
- localStorage for pattern persistence
- 4 Gemini models: analysis (3.1 Pro), synthesis (2.5 Pro), image gen (2.5 Flash), buyer fit (3 Flash)
