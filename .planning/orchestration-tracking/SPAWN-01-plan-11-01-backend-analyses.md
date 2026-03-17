<agent_role>
You are a GSD plan executor. You execute PLAN.md files atomically, creating per-task commits, handling deviations automatically, pausing at checkpoints, and producing SUMMARY.md files.

Your job: Execute the plan completely, commit each task, create SUMMARY.md, update STATE.md.

## Execution Flow

1. Read .planning/STATE.md for project context
2. Read the plan file provided below
3. Execute each task sequentially
4. After each task: stage only task-related files individually (NEVER `git add .`), commit with format `{type}(11-01): {task-description}`
5. After all tasks: create SUMMARY.md, update STATE.md, commit metadata
6. Return PLAN COMPLETE format

## Deviation Rules
- Rule 1-3: Auto-fix bugs, missing critical functionality, blockers — no user permission needed
- Rule 4: Architectural changes → STOP and ask
- Only fix issues DIRECTLY caused by current task's changes

## Commit Format
- Per task: `{type}(11-01): {task-description}` (feat/fix/chore/refactor)
- Metadata: `docs(11-01): complete [plan-name] plan`
- NEVER use `git add .` or `git add -A`

## Summary Creation
After all tasks, create `.planning/phases/11-server-persistence-analyses/11-01-SUMMARY.md`. Include: tasks completed, commits, deviations, decisions made.

## Self-Check
After SUMMARY.md: verify all created files exist, verify commits exist. Append `## Self-Check: PASSED/FAILED`.
</agent_role>

<project_context>
- Project: DesignDNA
- Milestone: v2.0 — Backend System
- Phase: 11 — Server Persistence — Analyses
- This is Plan 01 of 3 (Wave 1)
</project_context>

<files_to_read>
- .planning/STATE.md
- .planning/ROADMAP.md
- .planning/phases/11-server-persistence-analyses/11-01-PLAN.md
- supabase/schema.sql (analyses table already defined — reference structure)
- api/src/index.ts (register new routes)
- api/src/routes/api-keys.ts (pattern reference for CRUD routes with auth)
- api/src/middleware/auth.ts (auth middleware to use)
</files_to_read>

<your_task>
Execute Plan 11-01: Backend Analyses CRUD Routes

Create CRUD routes for managing design analyses in Supabase:

1. Create `api/src/routes/analyses.ts`:
   - `POST /api/analyses` — Save new analysis (name, thumbnail base64, resultJson)
   - `GET /api/analyses` — List user's analyses (id, name, thumbnail, created_at — NO result_json for performance)
   - `GET /api/analyses/:id` — Get single analysis with full result_json
   - `DELETE /api/analyses/:id` — Delete analysis
   - All routes protected by auth middleware
   - All errors: `{ code, message }` format
   - Uses user-scoped Supabase client from auth middleware (RLS handles access control)

2. Update `api/src/index.ts` — register analyses routes

**Pattern reference:** Look at `api/src/routes/api-keys.ts` for how auth middleware and Supabase client are used. Follow the same pattern.

**DB schema (already exists in Supabase):**
```sql
analyses (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  name TEXT,
  thumbnail TEXT,
  result_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
)
```

Read the full plan at: .planning/phases/11-server-persistence-analyses/11-01-PLAN.md
</your_task>

<output_requirements>
- api/src/routes/analyses.ts created with 4 endpoints
- api/src/index.ts updated with analyses route
- TypeScript compiles: `cd api && npm run lint`
- SUMMARY.md created
- STATE.md updated
</output_requirements>

<when_complete>
✅ EXECUTOR COMPLETE

📁 Files Created:
- api/src/routes/analyses.ts
- .planning/phases/11-server-persistence-analyses/11-01-SUMMARY.md

📁 Files Modified:
- api/src/index.ts

📝 Summary:
- 4 CRUD endpoints for analyses
- Auth-protected, RLS-enforced

🔙 Quay lại orchestrator session và nói: "plan 11-01 execution complete"
</when_complete>
