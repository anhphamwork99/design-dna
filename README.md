# DesignDNA

AI-powered design intelligence workspace for Print-on-Demand sellers and graphic designers.

Upload a design image and DesignDNA breaks it into:

- **Visual DNA**: composition, color, typography, graphics, POD production traits
- **Buyer DNA**: persona, identity signals, emotional triggers, occasion timing, purchase psychology

From there, users can compare designs, save reusable patterns, and generate new POD-ready artwork from grounded analysis.

## Features

### Analyze

- Upload a design image
- Extract Visual DNA and Buyer DNA
- Auto-save analysis history to Supabase

### Compare

- Analyze 2 to 5 designs together
- Detect repeated visual and buyer patterns
- Produce a winning formula

### Pattern Library

- Save comparison insights as reusable patterns
- Browse patterns in grid or list layouts
- Send patterns into Studio

### Studio

- Start from a real analyzed design
- Clone, create variations, or explore new concepts
- Synthesize concepts before generating artwork
- Generate POD-ready outputs

### My Analyses

- Persist analysis history in the cloud
- Reopen, reuse, compare, or delete past analyses

### Authentication And Security

- Email/password and Google OAuth via Supabase Auth
- Server-side API proxy for Gemini calls
- Encrypted per-user API key storage
- Row Level Security on persisted data

## UI Status

Current frontend direction:

- light-first design system
- achromatic surfaces with blue accent
- left sidebar app shell for desktop
- immersive Studio workspace

Current design baseline lives in [DESIGN.md](./DESIGN.md).

Current style guide lives in [`.planning/deliverables/STYLE-GUIDE.md`](./.planning/deliverables/STYLE-GUIDE.md).

## Architecture

```text
Frontend (React + Vite)
  -> Hono API proxy
    -> Gemini models
    -> Supabase Auth + PostgreSQL
```

| Layer | Technology |
| --- | --- |
| Frontend | React + Vite + TypeScript |
| Routing | React Router v7 |
| Backend API | Hono |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| AI | Gemini models |
| Persistence | Per-user analyses and patterns with RLS |
| Encryption | AES-256-GCM |

## Frontend Structure

```text
design-dna/
├── app/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   ├── styles/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   └── shared/
│   │   ├── screens/
│   │   ├── studio/
│   │   ├── compare/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── api.ts
│   │   └── apiClient.ts
├── api/
│   ├── _src/
│   │   ├── routes/
│   │   ├── prompts/
│   │   ├── middleware/
│   │   └── lib/
├── supabase/
└── .planning/
```

### Frontend Contracts

- `components/layout/` owns app shell behavior
- `components/shared/` owns reusable UI primitives
- `screens/` owns route-level pages
- `studio/` owns the immersive studio workflow and state machine
- `compare/` owns comparison-specific UI

## Getting Started

### Prerequisites

- Node.js 20+
- a Supabase project
- a Gemini API key

### Setup

1. Clone the repository.
2. Run `supabase/schema.sql` in Supabase SQL Editor.
3. Configure frontend and backend environment variables.
4. Install dependencies in `app/` and `api/`.
5. Run the frontend and backend dev servers.

### Frontend env

`app/.env.local`

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:4000
```

### Backend env

`api/.env`

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
ENCRYPTION_KEY=your-32-byte-hex-key
PORT=4000
```

### Run locally

```bash
# frontend
cd app
npm install
npm run dev

# backend
cd ../api
npm install
npm run dev
```

Open `http://localhost:5173`, create an account, save your Gemini API key, then start analyzing designs.

## Project Docs

- [DESIGN.md](./DESIGN.md): current design baseline and guardrails
- [CHANGELOG.md](./CHANGELOG.md): version history
- [`.planning/REQUIREMENTS.md`](./.planning/REQUIREMENTS.md): active UI redesign requirements

## License

Private project. All rights reserved.

