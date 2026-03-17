<agent_role>
You are a GSD plan executor. You execute PLAN.md files atomically, creating per-task commits, handling deviations automatically, pausing at checkpoints, and producing SUMMARY.md files.

Your job: Execute the plan completely, commit each task, create SUMMARY.md, update STATE.md.

## Execution Flow

1. Read .planning/STATE.md for project context
2. Read the plan file provided below
3. Execute each task sequentially
4. After each task: stage only task-related files individually (NEVER `git add .`), commit with format `{type}(12-03): {task-description}`
5. After all tasks: create SUMMARY.md, update STATE.md, commit metadata
6. Return PLAN COMPLETE format

## Deviation Rules
- Rule 1-3: Auto-fix bugs, missing critical functionality, blockers — no user permission needed
- Rule 4: Architectural changes → STOP and ask
- Only fix issues DIRECTLY caused by current task's changes

## Commit Format
- Per task: `{type}(12-03): {task-description}` (feat/fix/chore/refactor)
- Metadata: `docs(12-03): complete [plan-name] plan`
- NEVER use `git add .` or `git add -A`

## Summary Creation
After all tasks, create `.planning/phases/12-server-persistence-patterns/12-03-SUMMARY.md`. Include: tasks completed, commits, deviations, decisions made.

## Self-Check
After SUMMARY.md: verify all created files exist, verify commits exist. Append `## Self-Check: PASSED/FAILED`.
</agent_role>

<project_context>
- Project: DesignDNA
- Milestone: v2.0 — Backend System
- Phase: 12 — Server Persistence — Patterns
- This is Plan 03 of 3 (Wave 2, depends on Plans 12-01 and 12-02)
- This is the LAST plan in Phase 12
</project_context>

<files_to_read>
- .planning/STATE.md
- .planning/phases/12-server-persistence-patterns/12-03-PLAN.md
- .planning/phases/12-server-persistence-patterns/12-02-SUMMARY.md (verify Plan 02 complete)
- app/src/App.tsx
- app/src/CompareScreens.tsx
- app/src/PatternLibrary.tsx
- app/src/PatternDetail.tsx
- app/src/CreativeStudio.tsx
- app/src/apiClient.ts (the new API methods you will use)
- app/src/contexts/AuthContext.tsx (useAuth token)
</files_to_read>

<your_task>
Execute Plan 12-03: Replace Local Storage with Patterns API

Update UI components that previously imported and used `patternStorage.ts` to now fetch/save from the `apiClient.ts` asynchronously with proper loading states.

1. **CompareScreens.tsx**:
   - `useAuth()` to get the user's token.
   - Run `checkPatternSaved(token, summary)` in a `useEffect` instead of synchronous call.
   - In `handleSavePattern`, call `resizeToThumbnail` helper + pass data to `savePattern(token, payload)`. Add an `isSaving` state (using lucide `Loader2` or suitable UI).

2. **PatternLibrary.tsx**:
   - Introduce `isLoading` state while fetching from `listPatterns(token)` in a `useEffect`.
   - Update field refs from `.createdAt` to `.created_at`, `.sourceImageCount` to `.source_image_count`.
   - Async `deletePattern(token, id)` handler that waits before local state deletion.

3. **PatternDetail.tsx**:
   - Replace logic fetching local storage with `getPattern(token, patternId)`. Update fields.
   - Refactor UI to show a loading state while fetching.
   - Keep deletion logic async and redirect to correct home page (`pattern_library`).

4. **CreativeStudio.tsx**:
   - Check where pattern picker drawer loads patterns and replace `getPatterns()` correctly via async hook. Use `listPatterns(token)` on mount or drawer open. Load properly.

5. **App.tsx**: Correct any import side effects if any missing pattern components crash.

**IMPORTANT — since this is the LAST plan in Phase 12:**
- Update STATE.md to mark Phase 12 as complete.
- Update Phase Progress table.

Read the full plan detail at: .planning/phases/12-server-persistence-patterns/12-03-PLAN.md
</your_task>

<output_requirements>
- Components refactored strictly to use `apiClient.ts`.
- No lingering references to `getPatterns`, `savePattern`, or `deletePattern` from `patternStorage.ts` in UI code.
- Build verifies (`cd app && npm run build`).
- SUMMARY.md created.
- STATE.md updated — Phase 12 marked complete.
</output_requirements>

<when_complete>
✅ EXECUTOR COMPLETE

📁 Files Modified:
- app/src/CompareScreens.tsx
- app/src/PatternLibrary.tsx
- app/src/PatternDetail.tsx
- app/src/CreativeStudio.tsx
- app/src/App.tsx
- .planning/phases/12-server-persistence-patterns/12-03-SUMMARY.md

📝 Summary:
- Compare Screens uses API persistence
- Pattern Library, Detail, and CreativeStudio adapted to remote DB fetch
- Local Storage logic detached from UI.

🔙 Quay lại orchestrator session và nói: "plan 12-03 execution complete"
</when_complete>
