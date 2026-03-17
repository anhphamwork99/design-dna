# DesignDNA

AI-powered design intelligence tool for Print-on-Demand sellers and graphic designers.

Upload any graphic design → AI decodes its **Visual DNA** (composition, color, typography, graphics, POD tech) and **Buyer DNA** (persona, identity signals, emotional triggers, occasion mapping). Compare multiple designs to extract winning patterns. Then create new designs through: **Original + Modifications + Patterns → AI Synthesis → POD-ready artwork**.

## ✨ Features

### 🔬 Design Analysis
Upload any design image and get a comprehensive DNA breakdown:
- **Visual DNA** — grid type, color palette (HEX), typography classification, illustration style, POD technical specs
- **Buyer DNA** — target persona, identity signals, emotional triggers, occasion & timing, "Made For Me" decisions

### ⚖️ Compare Designs
Upload 2–5 designs for batch analysis:
- Cross-design visual pattern detection
- Buyer overlap mapping
- Winning Formula extraction (keep / experiment / avoid)

### 📚 Pattern Library
Save and reuse insights from Compare analyses:
- Browse saved patterns with thumbnails
- Apply patterns in Creative Studio for informed creation

### 🎨 Creative Studio
Generate new POD-ready artwork:
- Start from any analyzed design (ground truth)
- 5-level creativity slider (Faithful → Radical)
- Apply saved patterns as creative input
- AI Concept Synthesis → Multimodal artwork generation
- POD-ready output (flat illustration, white background, print-ready)

### 📖 My Analyses
Cloud-persisted analysis history:
- Auto-save after every analysis
- Browse, view, and delete saved DNA Cards

### 🔐 Authentication & Security
- Email/password + Google OAuth (Supabase Auth)
- Server-side API proxy — prompts never exposed to client
- Encrypted API key storage (AES-256-GCM)
- Row Level Security on all data

## 🏗 Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│  Hono API    │────▶│   Gemini AI  │
│  React+Vite  │     │   Proxy      │     │  (4 models)  │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                     ┌──────▼───────┐
                     │   Supabase   │
                     │  Auth + DB   │
                     └──────────────┘
```

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite (TypeScript) |
| Backend API | Hono |
| Database | Supabase PostgreSQL + RLS |
| Auth | Supabase Auth |
| AI Models | Gemini 3.1 Pro, 2.5 Pro, 2.5 Flash, 3 Flash |
| Encryption | AES-256-GCM |

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A [Supabase](https://supabase.com) project
- A [Gemini API key](https://aistudio.google.com/apikey)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/anhphamwork99/design-dna.git
   cd design-dna
   ```

2. **Setup the database**
   - Create a Supabase project
   - Run `supabase/schema.sql` in the SQL Editor

3. **Configure environment variables**

   **Frontend** (`app/.env.local`):
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_API_URL=http://localhost:4000
   ```

   **Backend** (`api/.env`):
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your-service-role-key
   SUPABASE_ANON_KEY=your-anon-key
   ENCRYPTION_KEY=your-32-byte-hex-key
   PORT=4000
   ```

4. **Install dependencies**
   ```bash
   cd app && npm install
   cd ../api && npm install
   ```

5. **Run development servers**
   ```bash
   # Terminal 1 — Frontend
   cd app && npm run dev

   # Terminal 2 — Backend API
   cd api && npm run dev
   ```

6. **Open the app**
   - Navigate to `http://localhost:5173`
   - Register an account
   - Add your Gemini API key in Settings
   - Upload a design to analyze!

## 📁 Project Structure

```
design-dna/
├── app/                    # React + Vite frontend
│   ├── src/
│   │   ├── App.tsx         # Main app with routing & screens
│   │   ├── apiClient.ts    # HTTP client for backend API
│   │   ├── CreativeStudio.tsx
│   │   ├── CompareScreens.tsx
│   │   ├── PatternLibrary.tsx
│   │   ├── PatternDetail.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── components/     # Shared components
│   │   ├── contexts/       # AuthContext
│   │   ├── hooks/          # useMigratePatterns
│   │   └── lib/            # Supabase client
│   └── package.json
├── api/                    # Hono backend API
│   ├── src/
│   │   ├── index.ts        # App entry + routes
│   │   ├── prompts/        # AI prompt modules (7 files)
│   │   ├── routes/         # API routes (ai, api-keys, analyses, patterns)
│   │   ├── lib/            # Supabase client, crypto utils
│   │   └── middleware/     # Auth middleware
│   └── package.json
├── supabase/
│   └── schema.sql          # Database schema + RLS policies
└── .planning/              # GSD project management
```

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## 📄 License

Private project — all rights reserved.
