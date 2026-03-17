# v2.0 Pitfalls Research

## 1. Auth Security Pitfalls

| Pitfall | Warning Signs | Prevention | Phase |
|---------|---------------|------------|-------|
| **JWT in localStorage** — XSS can steal tokens | Any `localStorage.setItem('token', ...)` in auth code | Store access token in memory (React state), refresh token in HttpOnly cookie | Auth phase |
| **Missing CORS config** — any origin can call API | No `cors()` middleware or wildcard `*` with credentials | Whitelist `http://localhost:5173` (dev) and production domain only | Backend scaffold |
| **No CSRF protection** — forged requests modify data | State-changing endpoints accept any request with valid cookie | Use SameSite=Lax cookies (sufficient for most cases) | Auth phase |
| **No ownership checks** — IDOR/BOLA vulnerability | Backend endpoints trust `userId` from request body | Always derive `userId` from JWT, verify ownership: `analysis.userId === req.user.id` | All CRUD phases |
| **Password storage mistakes** — plaintext or weak hash | Using MD5/SHA1 or custom hashing | Use bcrypt (cost 12) or argon2 via better-auth (handles automatically) | Auth phase |

## 2. API Proxy Pitfalls

| Pitfall | Warning Signs | Prevention | Phase |
|---------|---------------|------------|-------|
| **Timeout for AI generation** — proxy hangs on long Gemini calls | Default 30s timeout kills image generation (can take 60s+) | Set generous timeout (120s) for generation endpoints, shorter (30s) for analysis | API proxy phase |
| **Lost error context** — frontend gets generic 500 | `catch (e) { res.status(500).send('error') }` | Map Gemini errors to specific codes: `{ code: 'RATE_LIMITED', message: '...' }` | API proxy phase |
| **Prompt injection via user input** — user crafts text to override system prompt | User input concatenated directly into system prompt | Separate system prompt from user content in API call structure, input sanitization | API proxy phase |
| **API key exposure in logs** — key appears in error traces | `console.log(req.body)` includes decrypted key | Never log decrypted keys; redact in error handlers | API key management |
| **No rate limiting** — users can spam expensive AI calls | Missing rate-limit middleware | `@hono/rate-limit`: 10 AI calls/min per user, 60 CRUD calls/min | Backend scaffold |

## 3. Migration Pitfalls

| Pitfall | Warning Signs | Prevention | Phase |
|---------|---------------|------------|-------|
| **Data loss during migration** — localStorage cleared before server confirms | `localStorage.clear()` before `POST /migrate` succeeds | Only clear localStorage items AFTER successful server response (200 OK) | Migration phase |
| **Schema mismatch** — old localStorage format ≠ new DB schema | `JSON.parse` errors or missing fields | Version the migration payload, validate + transform server-side | Migration phase |
| **Double migration** — user logs in from 2 browsers, both try to migrate | Duplicate patterns in DB | Make migration endpoint idempotent: check if pattern already exists (by hash/name+date) | Migration phase |
| **Breaking existing flow** — auth gate blocks app before migration can run | User sees login but has no account yet | Migration happens AFTER first registration, not before | Migration phase |

## 4. Deployment Pitfalls

| Pitfall | Warning Signs | Prevention | Phase |
|---------|---------------|------------|-------|
| **CORS in production** — dev config doesn't match prod | Works locally, fails deployed | Use environment-based CORS config: `FRONTEND_URL` env var | Backend scaffold |
| **Env vars in frontend bundle** — `VITE_` prefix exposes secrets | Any `VITE_GEMINI_KEY` or `VITE_SECRET` | ONLY use `VITE_` for non-secret config (API base URL). Secrets stay server-side | API proxy phase |
| **Database connection limits** — serverless cold starts exhaust pool | `too many connections` errors | Use connection pooler (Neon's pooler, PgBouncer) or serverless-friendly driver | Backend scaffold |
| **Mixed HTTP/HTTPS** — cookie not sent over HTTP | Auth works locally but not deployed | Ensure `Secure` cookie flag + HTTPS in production; `Secure: false` only in dev | Deployment |

## 5. Frontend Integration Pitfalls

| Pitfall | Warning Signs | Prevention | Phase |
|---------|---------------|------------|-------|
| **Auth state flash** — user sees login screen briefly on refresh | No silent token refresh on mount | AuthContext does `POST /auth/refresh` on mount before rendering app | Frontend auth phase |
| **Stale data after mutations** — pattern deleted but still shows in list | Not invalidating cache after mutation | Use React Query or manual refetch after every mutation | Frontend data phase |
| **Missing loading states** — white screen during API calls | No skeleton/spinner during fetch | Add loading states for every async operation | All frontend phases |

## Critical Path Risks

1. **Highest risk:** API proxy timeout for image generation (Gemini multimodal can take 90s+). Solution: generous timeout + progress indicator
2. **Medium risk:** better-auth + Hono integration maturity — newer library, fewer examples. Mitigation: follow official Hono example exactly
3. **Low risk:** Schema migration for existing patterns — simple JSON transformation, one-time operation
