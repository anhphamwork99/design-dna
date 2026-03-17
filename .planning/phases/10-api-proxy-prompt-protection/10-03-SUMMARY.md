# Summary 10-03: Frontend API Client Refactor

## Result: ✅ COMPLETE

## What was done

Replaced the 881-line `app/src/api.ts` (Gemini SDK + prompts) with a thin HTTP client (`apiClient.ts`) that calls backend proxy routes. Removed `@google/genai` from frontend entirely. All API calls now go through the Hono backend with Supabase session token authentication.

### Files created

| File | Purpose | Lines |
|------|---------|-------|
| `app/src/apiClient.ts` | Thin HTTP client — 6 functions calling backend proxy routes via `authFetch` helper | 97 |

### Files modified

| File | Change |
|------|--------|
| `app/src/api.ts` | Gutted from 881 lines to ~110 lines — kept ONLY type exports + `resizeImageIfNeeded` (Canvas API) |
| `app/src/App.tsx` | Import from `./apiClient`, use `session.access_token` instead of localStorage API key, simplified SettingsModal (placeholder for Plan 10-04) |
| `app/src/CreativeStudio.tsx` | Import from `./apiClient`, use `session.access_token`, switch `onProgress` callbacks to indeterminate progress text |
| `app/package.json` | Removed `@google/genai` dependency |
| `app/.env.example` | Added `VITE_API_URL=http://localhost:4000` |
| `app/.env.local` | Added `VITE_API_URL=http://localhost:4000` |

### Key design decisions

- **authFetch helper** — centralized fetch wrapper that adds `Authorization: Bearer {token}` header and handles error JSON parsing
- **Type imports from `./api`** — `apiClient.ts` imports types from the gutted `api.ts` (which now serves as a shared types file). This avoids breaking any other files that import types from `./api`.
- **Indeterminate progress** — since backend handles the full pipeline (no streaming), replaced `onProgress` callbacks with static progress messages set before the API call
- **SettingsModal simplified** — removed API key input (now server-side). Shows placeholder text — Plan 10-04 will rebuild this with server-side key management UI.
- **Error messages passed through** — backend already maps Gemini errors to user-friendly messages (PROXY-04), so frontend just displays `err.message` directly instead of re-classifying errors.
- **resizeImageIfNeeded stays in frontend** — uses browser Canvas API, cannot run on server. Images are resized before being sent to apiClient functions.

## Requirements covered

| Req | Description | Status |
|-----|-------------|--------|
| PROXY-01 | All Gemini prompts moved to server-side (zero in frontend) | ✅ |
| PROXY-01 | Frontend makes HTTP calls to backend instead of direct Gemini | ✅ |

## Deviations

| # | Type | Description |
|---|------|-------------|
| 1 | Design choice | Kept `api.ts` as types barrel export instead of renaming to `types.ts` — avoids changing imports in other files (CompareScreens, PatternLibrary, etc.) that may reference types from `./api` |
| 2 | Design choice | SettingsModal simplified to a placeholder instead of removed — keeps the Settings gear icon functional for Plan 10-04 to rebuild with server-side API key management |

## Verification

- [x] `npm run build` — production build succeeds
- [x] `grep -r "GoogleGenAI\|@google/genai" app/src/` — returns NOTHING
- [x] `grep -r "gemini-2.5\|gemini-3" app/src/` — returns NOTHING
- [x] `grep -r "designdna_api_key" app/src/` — returns NOTHING
- [x] `app/src/` contains zero Gemini SDK imports
- [x] `app/src/` contains zero prompt template strings
- [x] `app/src/` contains zero model name references
- [x] All API calls go through backend proxy via `apiClient.ts`
- [x] Session token used for authentication instead of raw API key

## Commits

| Hash | Message |
|------|---------|
| `b55ffe5` | `feat(10-03): create thin HTTP API client for backend proxy` |
| `991233a` | `refactor(10-03): rewire App.tsx to use apiClient with session token` |
| `ac10baf` | `refactor(10-03): rewire CreativeStudio.tsx to use apiClient with session token` |
| `aef65e2` | `refactor(10-03): gut api.ts to types-only, remove @google/genai, add VITE_API_URL` |

## Self-Check: PASSED

- [x] `app/src/apiClient.ts` exists
- [x] `app/src/api.ts` exists (gutted — types + resizeImageIfNeeded only)
- [x] `app/src/App.tsx` imports from `./apiClient`
- [x] `app/src/CreativeStudio.tsx` imports from `./apiClient`
- [x] `@google/genai` NOT in `app/package.json`
- [x] `VITE_API_URL` in `.env.example` and `.env.local`
- [x] All 4 commits verified in git log
- [x] Build passes (`npm run build`)
- [x] Zero Gemini SDK references in `app/src/`
