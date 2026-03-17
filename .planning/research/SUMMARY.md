# v2.0 Research Summary

## Stack Decision

**Hono + better-auth + Drizzle ORM + PostgreSQL**

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Hono 4.x** | Same language as FE (TypeScript), edge-ready, minimal, built-in middleware |
| Auth | **better-auth** | Email/password + Google OAuth in single config, official Hono integration |
| ORM | **Drizzle** | Lightweight, type-safe, SQL-first, excellent Postgres/JSONB support |
| Database | **PostgreSQL** (Neon) | JSONB for 50-100KB JSON payloads, free managed tier, mature |
| Runtime | **Bun** or Node.js 22+ | Bun preferred for speed, Node as universal fallback |

**Why not FastAPI?** Same-language advantage (TypeScript FE↔BE) outweighs FastAPI's maturity. Type sharing is direct, no codegen needed.

**Why not Express?** Hono is lighter, edge-native, and better-auth provides a more integrated auth experience than Passport.js

## Feature Table Stakes (What Must Ship)

| Category | Must-have Features |
|----------|-------------------|
| **Auth** | Email/password register+login, Google OAuth, JWT access+refresh, auto-refresh, logout |
| **Proxy** | All Gemini calls server-side, prompts hidden, user API key stored encrypted, rate limit, error mapping |
| **Persistence** | Save/list/delete analyses, save/list/delete patterns per user |
| **Frontend** | Login/Register pages, auth gate, My Analyses on Landing, API key in Settings |
| **Migration** | One-time localStorage→server on first login, idempotent, clear after success |

## Architecture Changes

1. **api.ts refactored** → `apiClient.ts` calls backend instead of Gemini directly
2. **Prompts moved** server-side → `api/src/prompts/` directory
3. **Auth gate** wraps entire app — no guest access
4. **patternStorage.ts** → replaced by server API calls
5. **Monorepo** — `app/` + `api/` + `packages/shared/` (simple pnpm workspaces)

## Build Order (8 phases suggested)

1. Backend scaffold + DB + health endpoint
2. Auth (better-auth: email/password + Google OAuth)
3. Frontend auth (Login, Register, AuthContext, auth gate)
4. API proxy (move prompts server-side, proxy Gemini calls)
5. API key management (save/load per user)
6. Server persistence (Analysis + Pattern CRUD)
7. Frontend data migration (replace localStorage → server API, add My Analyses)
8. One-time localStorage migration

## Top 3 Pitfalls to Watch

1. **AI generation timeout** — Gemini multimodal can take 90s+. Set proxy timeout to 120s, not default 30s
2. **JWT in localStorage** — Use HttpOnly cookie for refresh token, memory for access token
3. **Migration data loss** — Only clear localStorage AFTER successful server upload confirmation

## Files

| File | Contents |
|------|----------|
| `STACK.md` | Stack comparison and recommendation |
| `FEATURES.md` | Features categorized as table-stakes/differentiators/anti-features |
| `ARCHITECTURE.md` | Current vs target architecture, DB schema, integration points |
| `PITFALLS.md` | 25 pitfalls across 5 categories with prevention strategies |
