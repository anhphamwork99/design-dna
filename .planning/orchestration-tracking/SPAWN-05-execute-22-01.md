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
- **Wave:** 1 of 2
</project_context>

<files_to_read>
- `.planning/PROJECT.md`
- `.planning/STATE.md`
- `.planning/ROADMAP.md`
- `.planning/phases/22-library-analyses-screens/22-01-PLAN.md` ← **YOUR PLAN**
</files_to_read>

<your_task>
Execute Plan 22-01: Shared components (ContextMenu, DataGrid, ImageLightbox).

1. Read the full plan at `.planning/phases/22-library-analyses-screens/22-01-PLAN.md`
2. Execute each task atomically
3. Commit per task: `feat(22-01): {task-name}`
4. Verify: `npx tsc --noEmit` after each task
5. Create SUMMARY.md: `.planning/phases/22-library-analyses-screens/22-01-SUMMARY.md`
6. Commit docs: `docs(22-01): complete plan`

**Important:**
- Wave 1 — no dependencies
- All autonomous (no checkpoints)
- Stage files individually, never `git add .`
</your_task>

<output_requirements>
- New shared components in `app/src/components/shared/`
- Updated barrel export `index.ts`
- SUMMARY.md created
- Build passes with 0 errors
</output_requirements>

<when_complete>
✅ EXECUTOR COMPLETE — Plan 22-01

📁 Files Created:
- `app/src/components/shared/ContextMenu.tsx`
- `app/src/components/shared/DataGrid.tsx`
- `app/src/components/shared/ImageLightbox.tsx`
- `.planning/phases/22-library-analyses-screens/22-01-SUMMARY.md`

🔙 Quay lại orchestrator session và nói: "wave 1 complete"
</when_complete>
