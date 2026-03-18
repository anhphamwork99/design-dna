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
- **Wave:** 2 of 2 (depends on Wave 1 — Plan 21-01 must be complete)
</project_context>

<files_to_read>
Read these files for context:
- `.planning/PROJECT.md`
- `.planning/STATE.md`
- `.planning/ROADMAP.md`
- `.planning/phases/21-compare-screen-redesign/21-CONTEXT.md`
- `.planning/phases/21-compare-screen-redesign/21-01-SUMMARY.md` ← Read to understand what Wave 1 built
- `.planning/phases/21-compare-screen-redesign/21-02-PLAN.md` ← **THIS IS YOUR PLAN**
</files_to_read>

<your_task>
Execute Plan 21-02: CompareResults + Rewrite CompareScreen shell + Delete old monolith.

Read the full plan at `.planning/phases/21-compare-screen-redesign/21-02-PLAN.md` and execute all tasks following the gsd-executor protocol:

1. Read plan → understand tasks (3 tasks: CompareResults, rewrite shell + delete monolith, human-verify checkpoint)
2. Execute Task 1 (CompareResults) atomically → commit
3. Execute Task 2 (rewrite CompareScreen shell + delete CompareScreens.tsx) → commit
4. **Task 3 is checkpoint:human-verify** — After completing Tasks 1-2, present the checkpoint verification steps to user. Wait for "approved" or issue description.
5. Create SUMMARY.md: `.planning/phases/21-compare-screen-redesign/21-02-SUMMARY.md`
6. Commit docs: `docs(21-02): complete plan`

**Important:**
- This plan depends on 21-01 (Wave 1) — `compare/types.ts`, `CompareUpload.tsx`, `CompareAnalyzing.tsx`, `index.ts` should already exist
- Plan has `autonomous: false` — Task 3 is a human-verify checkpoint
- Follow all commit rules from executor protocol
- Do NOT use `git add .` — stage files individually

**Key CONTEXT.md decisions (LOCKED):**
- Save as Pattern = primary action (full-width, row 1)
- Use in Studio + New Comparison = row 2 (secondary/ghost)
- No confirm dialog on New Comparison
- Use in Studio navigates with winning formula pre-loaded
- UX copy must be rewritten (all current copy is unclear)
</your_task>

<output_requirements>
- `app/src/compare/CompareResults.tsx` — New results component
- `app/src/screens/CompareScreen.tsx` — Rewritten stage-machine shell
- `app/src/compare/index.ts` — Updated barrel export
- `app/src/CompareScreens.tsx` — DELETED
- `.planning/phases/21-compare-screen-redesign/21-02-SUMMARY.md`
- Build passes: `npx tsc --noEmit` and `npm run build` = 0 errors
- Human checkpoint completed (user approved)
</output_requirements>

<when_complete>
✅ EXECUTOR COMPLETE — Plan 21-02

📁 Files Created/Modified:
- `app/src/compare/CompareResults.tsx` (new)
- `app/src/screens/CompareScreen.tsx` (rewritten)
- `app/src/compare/index.ts` (updated)
- `app/src/CompareScreens.tsx` (deleted)
- `.planning/phases/21-compare-screen-redesign/21-02-SUMMARY.md`

📝 Summary:
- [What was built]
- [Key decisions]
- [Human checkpoint status]
- [Build status]

🔙 Quay lại orchestrator session và nói: "wave 2 complete"
</when_complete>
