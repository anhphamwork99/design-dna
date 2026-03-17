# v2.0 Architecture Research

## Current Architecture (v1.0)

```
Browser
├── App.tsx (screen routing, state)
├── api.ts (direct Gemini API calls + ALL prompts)
├── patternStorage.ts (localStorage CRUD)
├── CreativeStudio.tsx (generation UI)
├── CompareScreens.tsx (compare UI)
├── PatternLibrary.tsx (pattern list)
└── PatternDetail.tsx (pattern detail)
```

**Key observations:**
- `api.ts` contains ALL business logic prompts (analyze, compare, synthesize, generate)
- User enters API key in Settings → stored in React state
- All data ephemeral (localStorage for patterns only)
- No routing library — custom `Screen` type with AnimatePresence

## Target Architecture (v2.0)

```
Browser (app/)                          Server (api/)
├── App.tsx                             ├── routes/
│   ├── AuthGate                        │   ├── auth.ts (login, register, OAuth)
│   └── Screen routing                  │   ├── gemini.ts (proxy ALL AI calls)
├── contexts/                           │   ├── analyses.ts (CRUD)
│   └── AuthContext.tsx                 │   ├── patterns.ts (CRUD)
├── lib/                                │   └── apikeys.ts (user key management)
│   └── apiClient.ts (→ backend)        ├── db/
├── CreativeStudio.tsx                  │   ├── schema.ts (Drizzle schema)
├── CompareScreens.tsx                  │   └── index.ts (connection)
├── PatternLibrary.tsx                  ├── prompts/ (ALL prompt templates)
├── PatternDetail.tsx                   │   ├── analyze.ts
├── AnalysisHistory.tsx (NEW)           │   ├── compare.ts
├── LoginScreen.tsx (NEW)               │   ├── synthesize.ts
└── RegisterScreen.tsx (NEW)            │   └── generate.ts
                                        └── middleware/
                                            ├── auth.ts (JWT verify)
                                            ├── rateLimit.ts
                                            └── cors.ts
```

## Integration Points

### 1. api.ts → apiClient.ts (Adapter Pattern)

**Current:** `api.ts` exports functions that call Gemini directly with prompts inline
**Target:** `apiClient.ts` exports same function signatures but calls backend endpoints

```typescript
// BEFORE (api.ts)
export async function analyzeDNA(imageData: string, apiKey: string) {
  const prompt = `You are a design analyst...`; // EXPOSED
  const result = await callGemini(prompt, apiKey);
  return result;
}

// AFTER (apiClient.ts)
export async function analyzeDNA(imageData: string) {
  // API key is server-side, prompt is server-side
  const response = await fetch('/api/gemini/analyze', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ imageData }),
  });
  return response.json();
}
```

### 2. patternStorage.ts → Server API

**Current:** localStorage CRUD
**Target:** Backend CRUD endpoints (`/api/patterns`)

| Old Function | New Endpoint | Notes |
|-------------|-------------|-------|
| `getPatterns()` | `GET /api/patterns` | Server returns user's patterns |
| `getPattern(id)` | `GET /api/patterns/:id` | Server verifies ownership |
| `savePattern(data)` | `POST /api/patterns` | Server stores in DB |
| `deletePattern(id)` | `DELETE /api/patterns/:id` | Server verifies ownership |
| `isCompareResultSaved()` | Check on client or `POST /api/patterns/check-duplicate` | |

### 3. App.tsx → Auth Gate

**Current:** App renders Landing directly
**Target:** App checks auth state first → LoginScreen or Landing

```typescript
// App.tsx
function App() {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!user) return <LoginScreen />;
  
  return <AuthenticatedApp />; // existing screen routing
}
```

### 4. Settings → API Key Management

**Current:** User enters key in modal → stored in React state
**Target:** User enters key in modal → saved to server via `POST /api/apikeys`

## Database Schema (Drizzle)

```typescript
// api/src/db/schema.ts
import { pgTable, text, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  passwordHash: text('password_hash'), // null for OAuth-only users
  googleId: text('google_id').unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  encryptedKey: text('encrypted_key').notNull(),
  provider: text('provider').default('gemini'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const analyses = pgTable('analyses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  name: text('name'), // design name / filename
  thumbnail: text('thumbnail'), // base64 small thumbnail
  resultJson: jsonb('result_json').notNull(), // full DNA analysis
  createdAt: timestamp('created_at').defaultNow(),
});

export const patterns = pgTable('patterns', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  summary: text('summary'),
  sourceImageCount: integer('source_image_count'),
  thumbnails: jsonb('thumbnails'), // array of base64 thumbnails
  batchAnalysis: jsonb('batch_analysis').notNull(), // full compare result
  createdAt: timestamp('created_at').defaultNow(),
});
```

## Suggested Build Order

1. **Backend scaffold** — Hono project, DB connection, health endpoint
2. **Auth** — better-auth setup, login/register/Google endpoints
3. **Frontend auth** — LoginScreen, RegisterScreen, AuthContext, auth gate
4. **API proxy** — Move prompts to server, proxy Gemini calls
5. **API key management** — Save/load user's Gemini key server-side
6. **Persistence** — Analysis CRUD, Pattern CRUD endpoints
7. **Frontend data** — Replace localStorage with server calls, add My Analyses
8. **Migration** — One-time localStorage → server migration on first login

## Monorepo Structure

```
design-dna/
├── app/               # Existing React Vite frontend
│   ├── src/
│   └── package.json
├── api/               # NEW — Hono backend
│   ├── src/
│   │   ├── routes/
│   │   ├── db/
│   │   ├── prompts/
│   │   └── middleware/
│   └── package.json
├── packages/
│   └── shared/        # NEW — Shared TypeScript types
│       ├── src/types.ts
│       └── package.json
├── .planning/         # GSD planning
└── package.json       # Workspace root
```

No Nx/Turborepo needed — simple npm/pnpm workspaces sufficient for 2 apps + 1 shared package.
