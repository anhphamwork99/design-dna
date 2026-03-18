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
- `.planning/phases/22-library-analyses-screens/22-03-PLAN.md` ← **YOUR PLAN**
</files_to_read>

<your_task>
Execute Plan 22-03: MyAnalysesScreen + route/sidebar wiring.

1. Read the full plan at `.planning/phases/22-library-analyses-screens/22-03-PLAN.md`
2. Execute each task atomically
3. Commit per task: `feat(22-03): {task-name}`
4. Verify: `npx tsc --noEmit` after each task
5. Create SUMMARY.md: `.planning/phases/22-library-analyses-screens/22-03-SUMMARY.md`
6. Commit docs: `docs(22-03): complete plan`

**Important:**
- Depends on 22-01 (ContextMenu, DataGrid, ImageLightbox should exist)
- Runs in PARALLEL with 22-02 — do NOT touch files owned by 22-02 (LibraryScreen.tsx, PatternDetailScreen.tsx)
- All autonomous (no checkpoints)
- Stage files individually, never `git add .`
</your_task>

<output_requirements>
- New/rewritten `MyAnalysesScreen.tsx`
- Updated `App.tsx` routes if needed
- Updated `Sidebar.tsx` nav items if needed
- Old analysis list component deleted if applicable
- SUMMARY.md created
- Build passes with 0 errors
</output_requirements>

<when_complete>
✅ EXECUTOR COMPLETE — Plan 22-03

📁 Files Created/Modified:
- `app/src/screens/MyAnalysesScreen.tsx` (new/rewritten)
- `app/src/App.tsx` (updated routes if needed)
- `app/src/components/layout/Sidebar.tsx` (updated nav if needed)
- `.planning/phases/22-library-analyses-screens/22-03-SUMMARY.md`

🔙 Quay lại orchestrator session và nói: "22-03 complete"
</when_complete>
