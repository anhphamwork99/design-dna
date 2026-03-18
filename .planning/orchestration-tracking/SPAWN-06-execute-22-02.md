<agent_role>
First, read `.agent/agents/gsd-executor.md` for your full role definition and execution protocol. You are a GSD plan executor.

Also read:
- `.agent/skills/gsd/gsd-execution/execute-plan.md`
- `.agent/skills/gsd/_gsd-shared/templates/summary.md`
- `.agent/skills/gsd/_gsd-shared/references/ui-brand.md`
</agent_role>

<project_context>
- **Project:** DesignDNA — AI-powered design intelligence tool for POD sellers
- **Milestone:** v3.0 — UI Redesign
- **Phase:** 22 — Library & Analyses Screens
- **Wave:** 2 of 2 (depends on Wave 1 — Plan 22-01 shared components must be complete)
</project_context>

<files_to_read>
- `.planning/PROJECT.md`
- `.planning/STATE.md`
- `.planning/ROADMAP.md`
- `.planning/phases/22-library-analyses-screens/22-01-SUMMARY.md` ← What Wave 1 built
- `.planning/phases/22-library-analyses-screens/22-02-PLAN.md` ← **YOUR PLAN**
</files_to_read>

<your_task>
Execute Plan 22-02: PatternLibraryScreen + PatternDetailScreen rewrite.

1. Read the full plan at `.planning/phases/22-library-analyses-screens/22-02-PLAN.md`
2. Execute each task atomically
3. Commit per task: `feat(22-02): {task-name}`
4. Verify: `npx tsc --noEmit` after each task
5. Create SUMMARY.md: `.planning/phases/22-library-analyses-screens/22-02-SUMMARY.md`
6. Commit docs: `docs(22-02): complete plan`

**Important:**
- Depends on 22-01 (ContextMenu, DataGrid, ImageLightbox should exist)
- All autonomous (no checkpoints)
- Stage files individually, never `git add .`
</your_task>

<output_requirements>
- Rewritten `LibraryScreen.tsx` (from 24 LOC placeholder to full screen)
- Rewritten `PatternDetailScreen.tsx` (from 27 LOC placeholder to full detail view)
- Old pattern files deleted if applicable
- SUMMARY.md created
- Build passes with 0 errors
</output_requirements>

<when_complete>
✅ EXECUTOR COMPLETE — Plan 22-02

📁 Files Created/Modified:
- `app/src/screens/LibraryScreen.tsx` (rewritten)
- `app/src/screens/PatternDetailScreen.tsx` (rewritten)
- `.planning/phases/22-library-analyses-screens/22-02-SUMMARY.md`

🔙 Quay lại orchestrator session và nói: "22-02 complete"
</when_complete>
