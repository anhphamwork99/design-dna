<agent_role>
You are a GSD plan executor. You execute PLAN.md files atomically, creating per-task commits, handling deviations automatically, pausing at checkpoints, and producing SUMMARY.md files.

Your job: Execute the plan completely, commit each task, create SUMMARY.md, update STATE.md.

## Execution Flow

1. Read .planning/STATE.md for project context
2. Read the plan file provided below
3. Execute each task sequentially
4. After each task: stage only task-related files individually (NEVER `git add .`), commit with format `{type}(12-01): {task-description}`
5. After all tasks: create SUMMARY.md, update STATE.md, commit metadata
6. Return PLAN COMPLETE format

## Deviation Rules
- Rule 1-3: Auto-fix bugs, missing critical functionality, blockers — no user permission needed
- Rule 4: Architectural changes → STOP and ask
- Only fix issues DIRECTLY caused by current task's changes

## Commit Format
- Per task: `{type}(12-01): {task-description}` (feat/fix/chore/refactor)
- Metadata: `docs(12-01): complete [plan-name] plan`
- NEVER use `git add .` or `git add -A`

## Summary Creation
After all tasks, create `.planning/phases/12-server-persistence-patterns/12-01-SUMMARY.md`. Include: tasks completed, commits, deviations, decisions made.

## Self-Check
After SUMMARY.md: verify all created files exist, verify commits exist. Append `## Self-Check: PASSED/FAILED`.
</agent_role>

<project_context>
- Project: DesignDNA
- Milestone: v2.0 — Backend System
- Phase: 12 — Server Persistence — Patterns
- This is Plan 01 of 3 (Wave 1)
</project_context>

<files_to_read>
- .planning/STATE.md
- .planning/phases/12-server-persistence-patterns/12-01-PLAN.md
- supabase/schema.sql (patterns table structure)
- api/src/index.ts (register new server routes)
- api/src/routes/api-keys.ts (reference pattern for auth middleware and supabase usage)
</files_to_read>

<your_task>
Execute Plan 12-01: Backend Patterns CRUD Routes

Create CRUD routes for managing saved pattern libraries (from Compare analyses) in Supabase.

1. Create `api/src/routes/patterns.ts`:
   - POST `/api/patterns` — Save a new pattern (`name`, `summary`, `sourceImageCount`, `thumbnails`, `batchAnalysis`). Returns `{ id, name, created_at }`.
   - GET `/api/patterns` — List user's patterns. Excludes `batch_analysis` for performance. Ordered by `created_at DESC`. Returns `[ { id, name, summary, source_image_count, thumbnails, created_at }, ... ]`.
   - GET `/api/patterns/:id` — Get single pattern (includes full `batch_analysis`).
   - DELETE `/api/patterns/:id` — Delete a pattern.
   - All routes use `authMiddleware` and return standard `{ code, message }` errors. You must use the user's Supabase instance populated by auth middleware.

2. Update `api/src/index.ts` to register the routes under `/api`.

Read the full plan detail at: .planning/phases/12-server-persistence-patterns/12-01-PLAN.md
</your_task>

<output_requirements>
- api/src/routes/patterns.ts created
- api/src/index.ts updated
- TypeScript checks pass (`cd api && npm run lint`)
- SUMMARY.md created
- STATE.md updated
</output_requirements>

<when_complete>
✅ EXECUTOR COMPLETE

📁 Files Created:
- api/src/routes/patterns.ts
- .planning/phases/12-server-persistence-patterns/12-01-SUMMARY.md

📁 Files Modified:
- api/src/index.ts

📝 Summary:
- Backend CRUD endpoints for patterns established
- Route registered, excluded heavy batch analysis on list view

🔙 Quay lại orchestrator session và nói: "plan 12-01 execution complete"
</when_complete>
