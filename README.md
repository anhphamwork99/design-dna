# DesignDNA

AI-powered design intelligence workspace for Print-on-Demand sellers and graphic designers.

Upload any design image and DesignDNA extracts its **Visual DNA** and **Buyer DNA** — then lets you compare designs, save winning patterns, and generate new POD-ready artwork grounded in real analysis.

## Features

### 🔬 Deep Analyze

Upload a design image and AI breaks it down into two layers:

- **Visual DNA** — composition, color palette, typography, graphics style, POD production traits
- **Buyer DNA** — target persona, identity signals, emotional triggers, occasion timing, purchase psychology

Results are auto-saved to your cloud library for future reference.

### ⚡ Batch Compare

Analyze 2–5 designs side by side:

- Cross-design pattern detection across visual and buyer dimensions
- **Winning Formula** extraction — what makes the best designs work
- DNA metrics comparison with side-by-side results layout

### 🎨 Creative Studio

An immersive workspace to create new POD artwork grounded in real design analysis:

- **3 Creative Modes** — Make Variations, Explore New Directions, Clone Design
- **Goal-driven workflow** — pick a goal → upload reference → AI analyzes → synthesize concepts → generate artwork
- **AI Concept Synthesis** — mandatory synthesis step before generation ensures coherent results
- **Two-pass artwork pipeline** — illustration generation → typography decoration
- **Dimension Shifts** — fine-tune creativity, style, color, and composition per concept
- **Floating Panel** — overlay configuration panel with collapsible accordion sections
- **Per-card parallel generation** — generate artwork on individual concept cards simultaneously

### 📚 Winning Patterns

Save and reuse insights from your best comparisons:

- Browse patterns in grid or list view with search
- Full detail view with DNA breakdown
- Send any pattern directly into Creative Studio as a creative foundation

### 📂 My Analyses

Cloud-persisted analysis history:

- Search and filter past analyses
- Reopen results, compare multiple analyses, or feed them into Studio
- Context menu actions: View, Use in Studio, Compare, Delete

### 🔐 Authentication & Security

- **Supabase Auth** — email/password registration + Google OAuth
- **Server-side API proxy** — all AI prompts run on the backend, never exposed to the client
- **Encrypted API key storage** — AES-256-GCM encryption with per-key IV
- **Row Level Security** — all database tables scoped to the authenticated user

### 🏠 Home Dashboard

- Hero banner with quick navigation
- Bento feature grid with hover animations
- Onboarding checklist (API key → first analysis → explore patterns)
- Recent analyses carousel

## Architecture

```
React SPA (Vite)  →  Hono API (Cloudflare Workers)  →  Gemini AI Models
                                                    →  Supabase (Auth + PostgreSQL)
```

| Layer | Technology |
| --- | --- |
| Frontend | React + Vite + TypeScript |
| Routing | React Router v7 |
| Backend API | Hono on Cloudflare Workers |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth (email + Google OAuth) |
| AI | Gemini models (analysis, synthesis, image generation) |
| Encryption | AES-256-GCM |
| Deployment | Cloudflare Workers (single-worker: API + SPA) |

## Project Structure

```
design-dna/
├── app/                        # Frontend (React + Vite)
│   └── src/
│       ├── screens/            # Route-level pages
│       │   ├── HomeScreen
│       │   ├── AnalyzeScreen
│       │   ├── StudioScreen
│       │   ├── CompareScreen
│       │   ├── LibraryScreen
│       │   ├── MyAnalysesScreen
│       │   ├── PatternDetailScreen
│       │   └── ViewAnalysisScreen
│       ├── studio/             # Creative Studio components & state
│       ├── compare/            # Comparison-specific UI
│       ├── components/         # Shared UI (Button, Card, DataGrid...)
│       ├── contexts/           # Auth & app state providers
│       ├── hooks/              # Custom hooks
│       ├── styles/             # CSS design tokens (80+ tokens)
│       ├── api.ts              # Legacy API helpers
│       └── apiClient.ts        # Authenticated API client
├── api/                        # Backend (Hono + Cloudflare Workers)
│   └── _src/
│       ├── routes/             # API routes (ai, analyses, patterns, api-keys)
│       ├── prompts/            # AI prompt modules (server-side only)
│       ├── middleware/         # Auth middleware (JWT verification)
│       └── lib/                # Shared utilities (encryption, Supabase client)
└── supabase/
    └── schema.sql              # Database schema (profiles, api_keys, analyses, patterns)
```

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project
- A Gemini API key

### Setup

1. Clone the repository
2. Run `supabase/schema.sql` in your Supabase SQL Editor
3. Configure environment variables (see below)
4. Install dependencies in both `app/` and `api/`
5. Start dev servers

### Frontend env (`app/.env.local`)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:4000
```

### Backend env (`api/.env`)

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
ENCRYPTION_KEY=your-32-byte-hex-key
PORT=4000
```

### Run locally

```bash
# Frontend
cd app && npm install && npm run dev

# Backend (separate terminal)
cd api && npm install && npm run dev
```

Open `http://localhost:5173`, create an account, save your Gemini API key in Settings, then start analyzing designs.

## License

Private project. All rights reserved.

<!-- poke was here -->
