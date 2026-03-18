<agent_role>
First, read `.agent/agents/gsd-executor.md` for your full role definition and execution protocol. You are a GSD plan executor — you execute PLAN.md files atomically with per-task commits, deviation handling, and SUMMARY.md creation.

Also read these execution context files:
- `.agent/skills/gsd/gsd-execution/execute-plan.md` — Full execution protocol
- `.agent/skills/gsd/_gsd-shared/templates/summary.md` — SUMMARY.md template
- `.agent/skills/gsd/_gsd-shared/references/ui-brand.md` — UI/brand reference (if applicable)
</agent_role>

<project_context>
- **Project:** DesignDNA — AI-powered design intelligence tool for POD sellers
- **Milestone:** v3.0 — UI Redesign
- **Phase:** 21 — Compare Screen Redesign
- **Wave:** 1 of 2
</project_context>

<files_to_read>
Read these files for context:
- `.planning/PROJECT.md`
- `.planning/STATE.md`
- `.planning/ROADMAP.md`
- `.planning/phases/21-compare-screen-redesign/21-CONTEXT.md`
- `.planning/phases/21-compare-screen-redesign/21-01-PLAN.md` ← **THIS IS YOUR PLAN**
</files_to_read>

<your_task>
Execute Plan 21-01: Types + CompareUpload + CompareAnalyzing components.

Read the full plan at `.planning/phases/21-compare-screen-redesign/21-01-PLAN.md` and execute all tasks following the gsd-executor protocol:

1. Read plan → understand tasks
2. Execute each task atomically
3. Commit per task: `feat(21-01): {task-name}`
4. Verify: `npx tsc --noEmit` passes after each task
5. Create SUMMARY.md: `.planning/phases/21-compare-screen-redesign/21-01-SUMMARY.md`
6. Commit docs: `docs(21-01): complete plan`

**Important:**
- This is Wave 1 — no dependencies on other plans
- Plan is autonomous (no checkpoints)
- Follow all commit rules from executor protocol
- Do NOT use `git add .` — stage files individually
</your_task>

<output_requirements>
- 4 new files in `app/src/compare/`: types.ts, CompareUpload.tsx, CompareAnalyzing.tsx, index.ts
- SUMMARY.md at `.planning/phases/21-compare-screen-redesign/21-01-SUMMARY.md`
- Build passes: `npx tsc --noEmit` = 0 errors
- All commits follow format: `feat(21-01): {task-name}`, then `docs(21-01): complete plan`
</output_requirements>

<when_complete>
✅ EXECUTOR COMPLETE — Plan 21-01

📁 Files Created:
- `app/src/compare/types.ts`
- `app/src/compare/CompareUpload.tsx`
- `app/src/compare/CompareAnalyzing.tsx`
- `app/src/compare/index.ts`
- `.planning/phases/21-compare-screen-redesign/21-01-SUMMARY.md`

📝 Summary:
- [What was built]
- [Key decisions]
- [Build status]

🔙 Quay lại orchestrator session và nói: "wave 1 complete"
</when_complete>
