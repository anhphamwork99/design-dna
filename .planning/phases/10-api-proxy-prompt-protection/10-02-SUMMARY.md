# Summary 10-02: Backend Proxy Routes — Move Prompts Server-Side

## Result: ✅ COMPLETE

## What was done

Moved ALL 6 Gemini prompt functions from `app/src/api.ts` to `api/src/prompts/`, created 6 proxy endpoints on the Hono backend, and registered them in the main app.

### Files created

| File | Purpose | Lines |
|------|---------|-------|
| `api/src/prompts/helpers.ts` | cleanJsonResponse, CREATIVITY_FIDELITY, CREATIVITY_IMAGE_ROLES, DIMENSION_LABELS, packageFullDna, formatPatternInsights | 256 |
| `api/src/prompts/analyze.ts` | analyzeDesign — single design deep analysis prompt + Gemini call | 73 |
| `api/src/prompts/synthesize.ts` | synthesizeConcept — 3 wildly different concept generation | 119 |
| `api/src/prompts/generate.ts` | generateArtwork — two-pass pipeline (illustration → text decoration) | 176 |
| `api/src/prompts/clone.ts` | cloneDesign — subtle mode design extraction | 127 |
| `api/src/prompts/compare.ts` | analyzeBatch — batch comparison of 2-5 designs | 64 |
| `api/src/prompts/buyer-fit.ts` | analyzeBuyerFit — buyer fit scoring | 30 |
| `api/src/routes/ai.ts` | 6 proxy endpoints with auth, validation, error mapping | 198 |
| `api/src/types.ts` | Shared types: SynthesizedConcept, SynthesizeInput, GenerateArtworkInput, CloneDesignInput, ImageInput | 56 |

### Files modified

| File | Change |
|------|--------|
| `api/src/index.ts` | Import and register aiRoute, add placeholder comment for body size |

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/ai/analyze` | Required | Single design deep analysis |
| POST | `/api/ai/compare` | Required | Batch comparison (2-5 images) |
| POST | `/api/ai/synthesize` | Required | Concept generation (3 concepts) |
| POST | `/api/ai/generate` | Required | Two-pass artwork generation |
| POST | `/api/ai/clone` | Required | Design cloning (subtle mode) |
| POST | `/api/ai/buyer-fit` | Required | Buyer fit scoring |

### Key design decisions

- **No resizeImageIfNeeded on server** — uses Canvas API (browser-only), stays in frontend. Server receives already-resized base64 images.
- **generateImageFromModel duplicated** — appears in both `generate.ts` and `clone.ts` since it's a small helper used only within each module. Avoids circular imports.
- **Error mapping (PROXY-04)** — `mapGeminiError()` in `ai.ts` classifies Gemini errors into user-friendly codes: `NO_API_KEY`, `INVALID_API_KEY`, `QUOTA_EXCEEDED`, `INVALID_INPUT`, `CONTENT_BLOCKED`, `AI_ERROR`
- **No aggressive timeouts (PROXY-05)** — generation routes (`/generate`, `/clone`) can take 60-120s; no timeout middleware applied
- **Types shared via api/src/types.ts** — frontend-only fields (`onProgress` callback) excluded from server types
- **Image data handling** — routes accept raw base64 strings (with or without `data:` prefix). Prompt modules handle stripping the prefix when needed.

## Requirements covered

| Req | Description | Status |
|-----|-------------|--------|
| PROXY-01 | All Gemini prompts moved to server-side | ✅ |
| PROXY-04 | Consistent error JSON `{ code, message }` on all routes | ✅ |
| PROXY-05 | No aggressive timeouts on generation routes | ✅ |

## Deviations

| # | Type | Description |
|---|------|-------------|
| 1 | Design choice | `generateImageFromModel` duplicated in `generate.ts` and `clone.ts` instead of shared — avoids cross-module dependency for a small 15-line helper |
| 2 | Addition | Created `api/src/types.ts` — plan mentioned it but didn't list as separate task. Required for TypeScript strict mode. |

## Verification

- [x] `npm run lint` — TypeScript compiles without errors
- [x] `npm run dev` — server starts on port 4000
- [x] `api/src/prompts/` contains 7 files (helpers, analyze, synthesize, generate, clone, compare, buyer-fit)
- [x] `api/src/routes/ai.ts` created with 6 endpoints
- [x] Each route returns `{ code, message }` on error (PROXY-04)
- [x] No timeout middleware on generation routes (PROXY-05)

## Commits

| Hash | Message |
|------|---------|
| `7fedef9` | `feat(10-02): create prompt helpers and shared types` |
| `f215ddf` | `feat(10-02): create analyzeDesign prompt module` |
| `b4d8601` | `feat(10-02): create synthesizeConcept prompt module` |
| `52aab3c` | `feat(10-02): create generateArtwork two-pass prompt module` |
| `c8b64e9` | `feat(10-02): create cloneDesign prompt module` |
| `eda76ac` | `feat(10-02): create analyzeBatch prompt module` |
| `cdfe607` | `feat(10-02): create analyzeBuyerFit prompt module` |
| `583ee4e` | `feat(10-02): create AI proxy routes with 6 endpoints` |
| `6d4ed36` | `feat(10-02): register AI proxy routes in main app` |

## Self-Check: PASSED

- [x] `api/src/prompts/helpers.ts` exists
- [x] `api/src/prompts/analyze.ts` exists
- [x] `api/src/prompts/synthesize.ts` exists
- [x] `api/src/prompts/generate.ts` exists
- [x] `api/src/prompts/clone.ts` exists
- [x] `api/src/prompts/compare.ts` exists
- [x] `api/src/prompts/buyer-fit.ts` exists
- [x] `api/src/routes/ai.ts` exists
- [x] `api/src/types.ts` exists
- [x] `api/src/index.ts` updated with aiRoute
- [x] All 9 commits verified in git log
- [x] TypeScript passes (`npm run lint`)
- [x] Server starts (`npm run dev`)
