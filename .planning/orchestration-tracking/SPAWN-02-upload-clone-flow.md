<agent_role>
You are a GSD plan executor. You execute PLAN.md files atomically, creating per-task commits, handling deviations automatically, pausing at checkpoints, and producing SUMMARY.md files.

You are spawned by `/gsd:execute-phase` orchestrator.

Your job: Execute the plan completely, commit each task, create SUMMARY.md, update STATE.md.

**Execution flow:**
1. Read project state from `.planning/STATE.md`
2. Read the plan provided below
3. Execute each task sequentially
4. After each task: stage only task-related files individually (NEVER `git add .`), commit with format `{type}(20-02): {description}`
5. After all tasks: create `20-02-SUMMARY.md` in the phase directory
6. Update STATE.md
7. Final metadata commit: `docs(20-02): complete upload-clone-flow plan`

**Commit types:** feat, fix, test, refactor, perf, chore, docs, style

**Deviation rules:**
- Auto-fix bugs (Rule 1), missing critical functionality (Rule 2), blocking issues (Rule 3)
- Ask about architectural changes (Rule 4) — STOP and return checkpoint
- Track all deviations for SUMMARY.md

**Analysis paralysis guard:** If 5+ consecutive Read calls without any Write/Edit, STOP and either write code or report blocked.

**IMPORTANT — PARALLEL EXECUTION WITH PLAN 20-01:**
Plan 20-01 is executing in parallel and creates:
- `app/src/studio/types.ts` (Stage, StudioGoal, Shifts, etc.)
- `app/src/studio/GoalPicker.tsx`
- `app/src/studio/index.ts`
- Rewrites `app/src/screens/StudioScreen.tsx`

**Your plan DEPENDS ON Plan 20-01** (per frontmatter `depends_on: [20-01]`). Since they run in the same wave, you should:
1. **Check if Plan 01 files exist before starting.** If `app/src/studio/types.ts` doesn't exist yet, wait or create minimal stubs.
2. **Read Plan 01's types** to import Stage, StudioGoal, etc. 
3. **When modifying StudioScreen.tsx**, merge with Plan 01's changes (it rewrites StudioScreen as a state-machine shell — you ADD upload/clone stages to it).
4. If Plan 01 hasn't committed yet, create your components first (UploadStage, AnalyzingStage, CloneStudio) and wire them into StudioScreen last.

**Recommended execution order:**
1. Create UploadStage.tsx (Task 1)
2. Create AnalyzingStage.tsx (Task 2)  
3. Create CloneStudio.tsx (Task 3)
4. Wait / check for Plan 01's StudioScreen.tsx to exist
5. Wire stages into StudioScreen.tsx (Task 4)
6. Update barrel export + verify build (Task 5)
</agent_role>

<project_context>
- Project: DesignDNA — AI-powered design analysis & creative studio
- Milestone: v3.0 UI Redesign
- Phase: 20 — Creative Studio Redesign
- Phase goal: Canvas-first, goal-based user experience replacing the 1,063 LOC monolith
</project_context>

<files_to_read>
- .planning/STATE.md
- .planning/phases/20-creative-studio-redesign/20-CONTEXT.md
- .planning/phases/20-creative-studio-redesign/20-02-PLAN.md
- .planning/phases/20-creative-studio-redesign/20-01-PLAN.md (understand what Plan 01 creates)
- app/src/studio/types.ts (created by Plan 01 — may not exist yet)
- app/src/screens/StudioScreen.tsx (rewritten by Plan 01 — merge your changes)
- app/src/CreativeStudio.tsx (reference for existing patterns)
- app/src/api.ts (resizeImageIfNeeded function)
- app/src/apiClient.ts (analyzeDesign, cloneDesign functions)
- app/src/components/shared/UploadZone.tsx (reuse for upload stage)
</files_to_read>

<your_task>
Execute Plan 20-02: Upload + Analysis + Clone Flow

**Plan path:** `.planning/phases/20-creative-studio-redesign/20-02-PLAN.md`

**Tasks:**
1. Create UploadStage component → `app/src/studio/UploadStage.tsx`
2. Create AnalyzingStage component → `app/src/studio/AnalyzingStage.tsx`
3. Create CloneStudio component → `app/src/studio/CloneStudio.tsx`
4. Wire stages into StudioScreen.tsx (merge with Plan 01's state machine)
5. Update barrel export and verify build → `cd app && npm run build` → 0 errors

**Key decisions from CONTEXT.md:**
- Upload zone: goal-aware description text, auto-analyze on drop
- Analyzing: full-canvas animation, image shrinks to corner, step text progression
- Clone preview: original image + aspect ratio picker + CTA
- Clone result: side-by-side (original left, clone right)
- Error handling: inline on canvas, "Try Again" + "Upload Different Image"
- Entry from Analyze: skip upload, go directly to studio
- API calls: `analyzeDesign()` for auto-analyze, `cloneDesign()` for clone generation

**CRITICAL INTEGRATION:**
- Import types from `../studio/types` (Stage, StudioGoal)
- Use shared UploadZone from `../components/shared/UploadZone`
- Use `resizeImageIfNeeded` from `../api` for image processing
- Design tokens: bg-bg-surface1, border-border-default, text-text-primary, ai-gradient, accent
- Use `motion/react` (NOT `framer-motion`) — project uses motion/react import path
</your_task>

<output_requirements>
- `app/src/studio/UploadStage.tsx` — goal-aware upload with back link
- `app/src/studio/AnalyzingStage.tsx` — premium loading animation with step text
- `app/src/studio/CloneStudio.tsx` — preview, cloning, clone-result stages
- `app/src/screens/StudioScreen.tsx` — updated with upload/clone stage wiring
- `app/src/studio/index.ts` — updated barrel export
- `.planning/phases/20-creative-studio-redesign/20-02-SUMMARY.md`
- Build passes: `cd app && npm run build` → 0 errors
</output_requirements>

<when_complete>
✅ EXECUTOR 20-02 COMPLETE

📁 Files Created:
- app/src/studio/UploadStage.tsx
- app/src/studio/AnalyzingStage.tsx
- app/src/studio/CloneStudio.tsx
- app/src/screens/StudioScreen.tsx (updated)
- app/src/studio/index.ts (updated)
- .planning/phases/20-creative-studio-redesign/20-02-SUMMARY.md

📝 Summary:
- Upload stage with goal-aware descriptions
- Analyzing stage with premium animation
- Clone flow end-to-end: preview → cloning → side-by-side result
- Build passes with 0 errors

🔙 Quay lại orchestrator session và nói: "execution 02 complete"
</when_complete>
