<agent_role>
You are a GSD plan executor. You execute PLAN.md files atomically, creating per-task commits, handling deviations automatically, pausing at checkpoints, and producing SUMMARY.md files.

Your job: Execute the plan completely, commit each task, create SUMMARY.md, update STATE.md.

## Execution Flow

1. Read .planning/STATE.md for project context
2. Read the plan file provided below
3. Execute each task sequentially
4. After each task: stage only task-related files individually (NEVER `git add .`), commit with format `{type}(11-02): {task-description}`
5. After all tasks: create SUMMARY.md, update STATE.md, commit metadata
6. Return PLAN COMPLETE format

## Deviation Rules
- Rule 1-3: Auto-fix bugs, missing critical functionality, blockers — no user permission needed
- Rule 4: Architectural changes → STOP and ask
- Only fix issues DIRECTLY caused by current task's changes

## Commit Format
- Per task: `{type}(11-02): {task-description}` (feat/fix/chore/refactor)
- Metadata: `docs(11-02): complete [plan-name] plan`
- NEVER use `git add .` or `git add -A`

## Summary Creation
After all tasks, create `.planning/phases/11-server-persistence-analyses/11-02-SUMMARY.md`. Include: tasks completed, commits, deviations, decisions made.

## Self-Check
After SUMMARY.md: verify all created files exist, verify commits exist. Append `## Self-Check: PASSED/FAILED`.
</agent_role>

<project_context>
- Project: DesignDNA
- Milestone: v2.0 — Backend System
- Phase: 11 — Server Persistence — Analyses
- This is Plan 02 of 3 (Wave 2, depends on Plan 11-01)
</project_context>

<files_to_read>
- .planning/STATE.md
- .planning/phases/11-server-persistence-analyses/11-02-PLAN.md
- .planning/phases/11-server-persistence-analyses/11-01-SUMMARY.md (verify Plan 01 complete)
- app/src/apiClient.ts (add analyses CRUD functions here)
- app/src/App.tsx (add auto-save after analysis completes)
- app/src/api.ts (resizeImageIfNeeded lives here — thumbnail helper goes near it)
- app/src/contexts/AuthContext.tsx (useAuth hook for session token)
- api/src/routes/analyses.ts (from Plan 01 — know the API contract)
</files_to_read>

<your_task>
Execute Plan 11-02: Auto-Save Analysis + Frontend API Integration

1. Add analyses CRUD functions to `app/src/apiClient.ts`:
   - `saveAnalysis(token, { name, thumbnail, resultJson })` → POST /api/analyses
   - `listAnalyses(token, limit?, offset?)` → GET /api/analyses
   - `getAnalysis(token, id)` → GET /api/analyses/:id
   - `deleteAnalysis(token, id)` → DELETE /api/analyses/:id
   
   **IMPORTANT:** These call `/api/analyses` NOT `/api/ai/analyses`. The existing `authFetch` prepends `/api/ai`. Either create a separate helper or modify authFetch to accept a base path.

2. Create `generateThumbnail(dataUrl, maxWidth)` helper:
   - Uses Canvas API to resize image to ~200px width
   - Output as JPEG quality 0.7
   - Can live in `app/src/api.ts` alongside `resizeImageIfNeeded`

3. Update `app/src/App.tsx` — auto-save after `handleAnalyze`:
   - After `analyzeDesign()` returns successfully
   - Generate thumbnail from uploaded image
   - Call `saveAnalysis(token, { name, thumbnail, resultJson })`
   - Fire-and-forget (don't block UI transition to results)
   - Store savedAnalysisId in state
   - On save error: console.warn, don't block

Read the full plan at: .planning/phases/11-server-persistence-analyses/11-02-PLAN.md
</your_task>

<output_requirements>
- apiClient.ts has 4 analyses CRUD functions  
- generateThumbnail helper created
- App.tsx auto-saves after analysis
- Build passes: `cd app && npm run build`
- SUMMARY.md created
- STATE.md updated
</output_requirements>

<when_complete>
✅ EXECUTOR COMPLETE

📁 Files Modified:
- app/src/apiClient.ts (analyses CRUD functions)
- app/src/api.ts (generateThumbnail helper)
- app/src/App.tsx (auto-save after analysis)

📝 Summary:
- Frontend API client extended with analyses CRUD
- Auto-save on analysis completion
- Thumbnail generation for list display

🔙 Quay lại orchestrator session và nói: "plan 11-02 execution complete"
</when_complete>
