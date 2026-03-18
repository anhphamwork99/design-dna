# Changelog

All notable changes to DesignDNA are documented in this file.

## [3.0.0] — 2026-03-18

### 🎨 UI Redesign (v3.0 Milestone)

Complete visual and architectural overhaul: dark theme → light theme, monolithic screens → component architecture, new layouts and premium interactions.

### Design System Foundation (Phase 14–15)
- **CSS Design Tokens** — 80+ tokens: colors, spacing, typography (Inter), radius, shadows, z-index
- **Light Theme** — migrated from dark mode to premium light theme with semantic color system
- **Shared UI Components** — Button (4 variants, 3 sizes), Card, Input, Badge, UploadZone, EmptyState, ErrorBanner, LoadingSpinner, ContextMenu, DataGrid, ImageLightbox

### App Shell & Navigation (Phase 16–17)
- **Sidebar Navigation** — responsive collapsible sidebar with logo, nav items, and user section
- **React Router v7** — multi-page routing replacing single-page conditional rendering
- **Screen Extraction** — 6 screens extracted from monolithic App.tsx (74 LOC after refactor)

### Home & Analyze Screens (Phase 18–19)
- **HomeScreen** — hero banner, quick action cards, recent analyses grid
- **AnalyzeScreen Redesign** — stage-machine (upload → analyzing → results), breadcrumb navigation

### Creative Studio Redesign (Phase 20)
- **Stage-Machine Architecture** — 10-stage flow: goals → upload → analyze → studio → concepts
- **GoalPicker** — 3 animated goal cards (Make Variations, Explore, Clone)
- **VariationStudio** — sidebar + canvas layout with PatternPicker, ConceptCard, ConceptDetailDialog
- **CloneStudio** — preview → cloning → result stages with aspect ratio selection
- **MascotLoader** — branded GIF-based loading animation

### Studio Flow Polish (Phase 20.1)
- **Floating Panel** — 260px overlay card (`shadow-xl`, `rounded-2xl`), replaces docked sidebar
- **AccordionSection** — collapsible sections with animated height transitions
- **DimensionShifts** — dropdown per dimension replacing cramped 3-button toggles
- **StudioTopBar** — Home icon exit + breadcrumb navigation
- **Responsive Concept Cards** — CSS grid `auto-fill minmax(240px, 1fr)`, unified layout (artwork/placeholder + text)
- **Unified MascotLoader** — all loading states use branded loader (synthesizing: full canvas, generating: per-card)
- **Per-Card Generation** — parallel artwork generation with wave gradient animation (40 pulsating bars)
- **Canvas CTA consolidation** — single "Create Concepts" on canvas, panel is config-only

### Compare Screen Redesign (Phase 21)
- **CompareUpload** — dual upload zones with animated grid
- **CompareAnalyzing** — MascotLoader with shimmer text
- **CompareResults** — side-by-side comparison with DNA metrics, save/use/new-comparison actions

### Library & Analyses Screens (Phase 22)
- **Pattern Library** — DataGrid with search, grid/list toggle, context menu (View, Use in Studio, Delete)
- **PatternDetailScreen** — full detail view with DNA breakdown
- **MyAnalysesScreen** — DataGrid with search, filtering, context menu (View, Use in Studio, Compare, Delete)

### Layout Standardization
- **Consistent page layouts** — uniform header + content structure across all screens
- **Optimized thumbnails** — reduced size while maintaining clarity
- **Auth screen** — background image with overlay

### Architecture
- React + Vite + React Router v7 SPA
- 80+ CSS design tokens (semantic color system)
- Component architecture: 15+ shared components, 18 studio components
- Stage-machine patterns for multi-step flows

---

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
