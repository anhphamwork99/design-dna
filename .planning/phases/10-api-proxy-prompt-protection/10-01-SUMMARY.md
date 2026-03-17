# Summary 10-01: Backend API Key Management + Gemini SDK Setup

## Result: ✅ COMPLETE

## What was done

Set up backend infrastructure for API key management and Gemini SDK on the Hono API server.

### Files created

| File | Purpose | Lines |
|------|---------|-------|
| `api/src/lib/supabase.ts` | Supabase admin client (service role, bypasses RLS) | 11 |
| `api/src/lib/crypto.ts` | AES-256-GCM encrypt/decrypt for API keys | 34 |
| `api/src/lib/gemini.ts` | Get Gemini client from user's encrypted API key | 33 |
| `api/src/middleware/auth.ts` | JWT verification middleware, sets user + user-scoped Supabase client | 44 |
| `api/src/routes/api-keys.ts` | CRUD routes: GET/POST/DELETE `/api/api-keys` | 146 |
| `api/.env.example` | Updated with Supabase + encryption env vars | 13 |
| `api/.env.local` | Real Supabase values + generated encryption key | 14 |
| `api/.gitignore` | Prevent .env.local and dist from being committed | 3 |

### Files modified

| File | Change |
|------|--------|
| `api/package.json` | Added `@supabase/supabase-js`, `@google/genai` |
| `api/src/index.ts` | Load `.env.local`, register apiKeysRoute |

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/api-keys` | Required | Returns `{ hasKey: boolean }` — never the actual key |
| POST | `/api/api-keys` | Required | Body `{ key: string }` — encrypts and upserts |
| DELETE | `/api/api-keys` | Required | Removes saved key for user |

### Key design decisions

- **Hono Env typing** — defined `Env` type with `Variables: { user, supabase }` to satisfy TypeScript strict mode for `c.get()`/`c.set()`
- **Per-request Supabase client** — auth middleware creates a user-scoped client (anon key + user JWT) for RLS enforcement, not the admin client
- **Upsert pattern** — POST checks for existing key before insert/update, one key per user per provider
- **`.env.local` loading** — switched from `dotenv/config` import to explicit `config({ path: '.env.local' })` call
- **`.gitignore` added** — deviation: created `api/.gitignore` to prevent `.env.local` (secrets) from being committed

## Requirements covered

| Req | Description | Status |
|-----|-------------|--------|
| PROXY-02 | API keys encrypted at rest (AES-256-GCM) | ✅ |
| PROXY-04 | Consistent error JSON `{ code, message }` | ✅ |

## Deviations

| # | Type | Description |
|---|------|-------------|
| 1 | Auto-fix | Created `api/.gitignore` — project had no gitignore for api/, `.env.local` would have been committed with secrets |
| 2 | Auto-fix | Added Hono `Env` type definition to fix TypeScript `c.get()` errors — plan's code didn't account for Hono strict typing |
| 3 | Auto-fix | Changed dotenv loading from `import 'dotenv/config'` to `config({ path: '.env.local' })` — `.env` file doesn't exist, only `.env.local` |

## Verification

- [x] `npm run lint` — TypeScript compiles without errors
- [x] `npm run dev` — server starts on port 4000
- [x] `GET /api/health` — returns `{ status: "ok" }`
- [x] `GET /api/api-keys` without token — returns 401 `{ code: "UNAUTHORIZED" }`
- [x] Error responses follow `{ code, message }` format

## Commits

| Hash | Message |
|------|---------|
| `50f0cbe` | `chore(10-01): install @supabase/supabase-js and @google/genai` |
| `137f03c` | `feat(10-01): create Supabase admin client for backend` |
| `f20dfee` | `feat(10-01): create AES-256-GCM crypto utils for API key encryption` |
| `ad6d1ee` | `feat(10-01): create JWT auth middleware with user-scoped Supabase client` |
| `753385c` | `feat(10-01): create CRUD API key routes with encryption` |
| `df63e67` | `feat(10-01): create Gemini client helper with encrypted key lookup` |
| `1c4a5e2` | `feat(10-01): update env config, register api-keys routes, add .gitignore` |
| `7f74c0e` | `fix(10-01): add Hono Env type to fix TypeScript c.get() errors` |

## Self-Check: PASSED

- [x] `api/src/lib/supabase.ts` exists
- [x] `api/src/lib/crypto.ts` exists
- [x] `api/src/lib/gemini.ts` exists
- [x] `api/src/middleware/auth.ts` exists
- [x] `api/src/routes/api-keys.ts` exists
- [x] `api/.env.local` exists
- [x] `api/.env.example` updated
- [x] `api/src/index.ts` updated
- [x] All 8 commits verified in git log
- [x] TypeScript passes
- [x] Server starts without errors
