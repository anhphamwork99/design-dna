# v2.0 Features Research

## Feature Categories

### 1. Authentication (AUTH)

**Table stakes:**
- Email/password registration with validation
- Email/password login with JWT access token
- Google OAuth login (Authorization Code + PKCE)
- Password hashing (bcrypt/argon2)
- Session management (access token + refresh token)
- Logout (clear tokens)
- Account linking (Google login → same account as email if same email)

**Differentiators:**
- Silent token refresh (auto-renew without user action)
- Google One-Tap login
- "Remember me" option
- Password reset via email link

**Anti-features:**
- Implicit OAuth flow (token in URL → security risk)
- Storing JWT in localStorage (XSS vulnerable)
- Long-lived access tokens (>15 min)
- Complex RBAC (only 1 role needed: user)

### 2. API Proxy (PROXY)

**Table stakes:**
- All Gemini API calls go through backend
- Prompts/system instructions stored server-side only
- User's API key stored encrypted per-user in DB
- Rate limiting per user
- Error mapping (Gemini errors → consistent JSON format)
- CORS restricted to frontend origin only
- Request timeout handling (30s for generation calls)

**Differentiators:**
- Streaming proxy (SSE for long-running generation)
- Request logging/audit trail
- Circuit breaker for Gemini failures

**Anti-features:**
- Exposing raw Gemini error payloads to frontend
- Caching AI responses (each generation should be unique)
- Complex API versioning (v1 is enough for now)

### 3. Server Persistence (DATA)

**Table stakes:**
- Save analysis results (DNA Card JSON) per user
- Save patterns (Compare results JSON + thumbnails) per user
- List user's analyses (paginated)
- List user's patterns
- Delete analysis / delete pattern
- API key CRUD per user (save, retrieve, update, delete)

**Differentiators:**
- Search/filter analyses by date or design name
- Duplicate detection (don't save same analysis twice)
- Data export (download all my data as JSON)

**Anti-features:**
- Storing generated images server-side (too large, user downloads)
- Real-time sync (not needed — single user per session)
- Complex relational models (flat tables sufficient)

### 4. Frontend Auth UI (UI)

**Table stakes:**
- Login page (email/password form + Google button)
- Register page (email/password + name)
- Auth gate (redirect to login if not authenticated)
- Settings page: manage API key
- Loading states during auth operations

**Differentiators:**
- Password strength indicator
- Inline validation (email format, password rules)
- Animated page transitions for auth flow

**Anti-features:**
- Admin dashboard (no admin role needed)
- User profile editing beyond API key
- Social sharing features

### 5. Migration (MIGRATE)

**Table stakes:**
- On first login, detect localStorage patterns
- POST patterns to server via migration endpoint
- Idempotent migration (safe to run multiple times)
- Clear localStorage after successful migration
- Show migration progress to user

**Differentiators:**
- Conflict resolution (server data wins if newer)
- Versioned migration payload for future-proofing

**Anti-features:**
- Background sync API (overkill for one-time migration)
- Migrating generated images (not persisted)

## Dependencies on Existing Features

| New Feature | Depends On |
|-------------|-----------|
| Save analysis | Existing analysis JSON structure (api.ts) |
| Save pattern | Existing patternStorage.ts interfaces |
| API proxy | Existing prompt construction in api.ts |
| Auth gate | Existing App.tsx screen routing |
| Migration | Existing localStorage CRUD in patternStorage.ts |
