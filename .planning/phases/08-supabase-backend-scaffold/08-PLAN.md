---
phase: 8
plan: 1
title: "Supabase Project + Database Schema"
wave: 1
depends_on: []
files_modified:
  - "supabase/schema.sql"
  - "app/src/lib/supabase.ts"
  - "app/.env.example"
requirements:
  - DATA-05
autonomous: true
---

# Plan 08-01: Supabase Project + Database Schema

## Objective

Setup Supabase project (via dashboard), tạo database tables cho DesignDNA, cấu hình RLS policies, và tạo Supabase client trong frontend.

## Context

- Supabase free tier: 50K MAU, 500MB DB, unlimited API
- Tables cần: user profiles, analyses, patterns, api_keys
- RLS đảm bảo mỗi user chỉ truy cập data của mình
- Supabase tự tạo `auth.users` table — ta chỉ tạo `public` tables

## Tasks

<task id="01" title="Create Supabase SQL schema file">
Tạo file `supabase/schema.sql` tại project root chứa toàn bộ SQL schema cho DesignDNA.

Tables:

1. `profiles` — extends auth.users (trigger tự tạo khi signup)
   - id (uuid, references auth.users.id)
   - email (text)
   - name (text)
   - created_at (timestamptz)

2. `api_keys` — user's Gemini API keys (encrypted)
   - id (uuid, primary key)
   - user_id (uuid, references profiles.id)
   - encrypted_key (text, not null)
   - provider (text, default 'gemini')
   - created_at (timestamptz)

3. `analyses` — saved analysis results
   - id (uuid, primary key)
   - user_id (uuid, references profiles.id)
   - name (text) — design name/filename
   - thumbnail (text) — small base64 thumbnail
   - result_json (jsonb, not null) — full DNA analysis (~50-100KB)
   - created_at (timestamptz)

4. `patterns` — saved compare results
   - id (uuid, primary key)
   - user_id (uuid, references profiles.id)
   - name (text, not null)
   - summary (text)
   - source_image_count (integer)
   - thumbnails (jsonb) — array of base64 thumbnails
   - batch_analysis (jsonb, not null) — full compare result
   - created_at (timestamptz)

Include:
- RLS enable on all tables
- RLS policies: SELECT/INSERT/UPDATE/DELETE chỉ cho `auth.uid() = user_id`
- Trigger function: auto-create profile row on signup
- Indexes: user_id + created_at DESC on analyses and patterns
</task>

<task id="02" title="Install Supabase SDK in frontend">
```bash
cd app && npm install @supabase/supabase-js
```
</task>

<task id="03" title="Create Supabase client utility">
Tạo `app/src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Cả 2 giá trị đều public (anon key là safe to expose — RLS bảo vệ data).
</task>

<task id="04" title="Update .env.example">
Thêm vào `app/.env.example`:

```
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Tạo `app/.env.local` (gitignored) với actual values cho dev.
</task>

## Verification

- [ ] `supabase/schema.sql` exists với 4 tables + RLS policies + trigger
- [ ] `@supabase/supabase-js` in app/package.json dependencies
- [ ] `app/src/lib/supabase.ts` creates client with env vars
- [ ] `.env.example` documents Supabase config vars
- [ ] `vite build` passes — no import errors

## must_haves

- Database schema covers all 4 tables with correct column types
- RLS policies restrict access to owner only (auth.uid() = user_id)
- Auto-create profile trigger on signup
- Supabase client importable from any component
---

# Plan 08-02: Hono API Proxy Scaffold

## Objective

Tạo Hono backend project cho API proxy. Project chạy locally, có health endpoint, rate-limit middleware, CORS config, và cấu trúc sẵn cho routes.

## Context

- Hono dùng cho API proxy — giấu Gemini prompts khỏi frontend
- Chạy trên Bun hoặc Node.js
- Cấu trúc: routes/, middleware/, prompts/
- Phase này chỉ scaffold — chưa implement actual proxy routes

## Tasks

<task id="01" title="Create api/ directory with Hono project">
Tạo `api/` folder tại project root:

```
api/
├── src/
│   ├── index.ts          # Hono app entry point
│   ├── routes/
│   │   └── health.ts     # GET /health endpoint
│   ├── middleware/
│   │   ├── cors.ts       # CORS config
│   │   └── rateLimit.ts  # Rate limiting
│   └── prompts/          # Empty — will hold AI prompts in Phase 10
│       └── .gitkeep
├── package.json
├── tsconfig.json
└── .env.example
```
</task>

<task id="02" title="Setup api/package.json">
```json
{
  "name": "design-dna-api",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "start": "node dist/index.js",
    "build": "tsc",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "hono": "^4.7.0",
    "@hono/node-server": "^1.14.0",
    "dotenv": "^16.4.0"
  },
  "devDependencies": {
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "@types/node": "^22.14.0"
  }
}
```

Run `cd api && npm install`.
</task>

<task id="03" title="Implement Hono app with middleware">
`api/src/index.ts`:

```typescript
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { rateLimiter } from 'hono/rate-limiter'; // or custom
import 'dotenv/config';
import { healthRoute } from './routes/health';

const app = new Hono();

// CORS — only allow frontend origin
app.use('*', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Routes
app.route('/api', healthRoute);

// Start server
const port = Number(process.env.PORT) || 4000;
console.log(`API server running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
```

`api/src/routes/health.ts`:

```typescript
import { Hono } from 'hono';

export const healthRoute = new Hono();

healthRoute.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

Rate limit middleware (custom hoặc dùng hono built-in) — placeholder cho Phase 10 khi có actual AI endpoints.
</task>

<task id="04" title="Create api/.env.example and tsconfig.json">
`api/.env.example`:
```
PORT=4000
FRONTEND_URL=http://localhost:3000
```

`api/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "dist",
    "rootDir": "src",
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```
</task>

## Verification

- [ ] `cd api && npm run dev` starts Hono server on port 4000
- [ ] `curl http://localhost:4000/api/health` returns `{"status":"ok",...}`
- [ ] CORS headers present for configured frontend origin
- [ ] `api/src/prompts/` directory exists (empty, ready for Phase 10)
- [ ] `npm run lint` passes in api/

## must_haves

- Hono server starts and responds to health check
- CORS restricted to frontend origin only
- Rate-limit middleware structure ready
- prompts/ directory created for future use
