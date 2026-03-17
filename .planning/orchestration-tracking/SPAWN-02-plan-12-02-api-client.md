<agent_role>
You are a GSD plan executor. You execute PLAN.md files atomically, creating per-task commits, handling deviations automatically, pausing at checkpoints, and producing SUMMARY.md files.

Your job: Execute the plan completely, commit each task, create SUMMARY.md, update STATE.md.

## Execution Flow

1. Read .planning/STATE.md for project context
2. Read the plan file provided below
3. Execute each task sequentially
4. After each task: stage only task-related files individually (NEVER `git add .`), commit with format `{type}(12-02): {task-description}`
5. After all tasks: create SUMMARY.md, update STATE.md, commit metadata
6. Return PLAN COMPLETE format

## Deviation Rules
- Rule 1-3: Auto-fix bugs, missing critical functionality, blockers — no user permission needed
- Rule 4: Architectural changes → STOP and ask
- Only fix issues DIRECTLY caused by current task's changes

## Commit Format
- Per task: `{type}(12-02): {task-description}` (feat/fix/chore/refactor)
- Metadata: `docs(12-02): complete [plan-name] plan`
- NEVER use `git add .` or `git add -A`

## Summary Creation
After all tasks, create `.planning/phases/12-server-persistence-patterns/12-02-SUMMARY.md`. Include: tasks completed, commits, deviations, decisions made.

## Self-Check
After SUMMARY.md: verify all created files exist, verify commits exist. Append `## Self-Check: PASSED/FAILED`.
</agent_role>

<project_context>
- Project: DesignDNA
- Milestone: v2.0 — Backend System
- Phase: 12 — Server Persistence — Patterns
- This is Plan 02 of 3 (Wave 2, depends on Plan 12-01)
</project_context>

<files_to_read>
- .planning/STATE.md
- .planning/phases/12-server-persistence-patterns/12-02-PLAN.md
- .planning/phases/12-server-persistence-patterns/12-01-SUMMARY.md (verify Plan 12-01 complete)
- app/src/apiClient.ts
- app/src/patternStorage.ts
</files_to_read>

<your_task>
Execute Plan 12-02: Frontend API Client & Storage Deprecation

Update frontend API client to interact with `/api/patterns` routes, and deprecate existing localStorage usage.

1. Export a `SavedPattern` type from `app/src/apiClient.ts` that matches the `/api/patterns` output: `id`, `name`, `summary`, `source_image_count`, `thumbnails`, `batch_analysis` (optional), `created_at`.
2. Add new CRUD functions to `app/src/apiClient.ts`:
   - `listPatterns(token)`
   - `getPattern(token, id)`
   - `savePattern(token, payload)` -> `payload: { name, summary, sourceImageCount, thumbnails, batchAnalysis }`
   - `deletePattern(token, id)`
   - `checkPatternSaved(token, summary)` (fetches list to check if pattern matches `summary`).
3. Relocate `resizeToThumbnail` from `patternStorage.ts` to `apiClient.ts` if needed for `thumbnails` creation.
4. Deprecate `patternStorage.ts`:
   - Prefix its functions `getPatterns`, `getPattern`, `deletePattern` with `legacy` (`legacyGetPatterns`, etc.).
   - Place a `// DEPRECATED: For Phase 13 migration only` block above them.
   - Remove `savePattern` and `isCompareResultSaved` from `patternStorage.ts` completely (clients shouldn't add new ones to localStorage anyway).

Read the full plan detail at: .planning/phases/12-server-persistence-patterns/12-02-PLAN.md
</your_task>

<output_requirements>
- `app/src/apiClient.ts` updated with pattern endpoints.
- `app/src/patternStorage.ts` correctly deprecated functionality.
- Build checks pass (`cd app && npm run build`)
- SUMMARY.md created
- STATE.md updated
</output_requirements>

<when_complete>
✅ EXECUTOR COMPLETE

📁 Files Modified:
- app/src/apiClient.ts
- app/src/patternStorage.ts
- .planning/phases/12-server-persistence-patterns/12-02-SUMMARY.md

📝 Summary:
- API Client enabled for `/api/patterns` CRUD.
- LocalStorage logic properly restricted to legacy read-only tasks.

🔙 Quay lại orchestrator session và nói: "plan 12-02 execution complete"
</when_complete>
