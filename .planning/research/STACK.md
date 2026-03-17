# v2.0 Stack Research (Updated)

## Final Stack: Supabase + Hono API Proxy

### Architecture Simplification

Supabase handles **Auth + Database** → chỉ cần build **Hono backend cho API proxy** (giấu prompts).

```
Browser (app/)
├── Supabase JS SDK → Auth (login, register, Google OAuth)
├── Supabase JS SDK → Database (analyses, patterns CRUD)
└── Hono Backend   → Gemini API proxy (prompts server-side)
```

### Stack Components

| Layer | Tool | Purpose |
|-------|------|---------|
| **Auth** | Supabase Auth | Email/password + Google OAuth, JWT sessions, auto-refresh |
| **Database** | Supabase PostgreSQL | JSONB storage, Row Level Security (per-user data) |
| **API Proxy** | Hono (edge) | Proxy Gemini calls, hide prompts, handle user API keys |
| **Frontend** | React + Vite (existing) | + `@supabase/supabase-js` SDK |
| **Deployment** | Vercel (FE + Hono Edge) | Single platform |

### What Supabase Eliminates

| Previously Needed | Now Handled By |
|-------------------|----------------|
| Password hashing, JWT signing | Supabase Auth |
| Token refresh, session management | Supabase Auth |
| Google OAuth flow | Supabase Auth |
| Database setup, migrations | Supabase Dashboard + SQL |
| Row-level authorization | Supabase RLS policies |
| Connection pooling | Supabase built-in (Supavisor) |

### What Still Needs Building

| Component | Why |
|-----------|-----|
| **Hono API proxy** | Hide prompts from frontend — Supabase can't proxy AI calls |
| **Prompt files** | Move from api.ts to server-side |
| **User API key encryption** | Store encrypted Gemini keys in Supabase DB |
| **Frontend auth UI** | Login/Register screens (Supabase handles logic, we build UI) |
| **Frontend data layer** | Replace localStorage with Supabase SDK calls |
| **Migration endpoint** | One-time localStorage → Supabase on first login |

### Supabase Free Tier

- 50K MAU (auth)
- 500MB database
- 1GB file storage
- Unlimited API requests
- 2 projects

More than enough for DesignDNA's scale.

### Libraries to Install

```bash
# Frontend (app/)
npm install @supabase/supabase-js

# Backend proxy (api/)
npm install hono @hono/node-server dotenv
# OR deploy as Vercel Edge Function (no separate server)
```
