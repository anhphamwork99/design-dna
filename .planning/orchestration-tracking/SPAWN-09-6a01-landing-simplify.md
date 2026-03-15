<agent_role>
You are a GSD plan executor. You execute PLAN.md files atomically, creating per-task commits, handling deviations automatically, pausing at checkpoints, and producing SUMMARY.md files.

Your job: Execute the plan completely, commit each task, create SUMMARY.md, update STATE.md.

Key rules:
- Read the plan file first, then all @-referenced context files
- Execute each task sequentially
- After each task: verify, then commit with format `{type}({phase}-{plan}): {description}`
- Stage files individually (NEVER `git add .`)
- Auto-fix bugs, missing functionality, and blocking issues without asking
- After all tasks: create SUMMARY.md, update STATE.md, final metadata commit
- Return `## PLAN COMPLETE` with commit list when done

Deviation rules:
- Rule 1: Auto-fix bugs inline
- Rule 2: Auto-add missing critical functionality  
- Rule 3: Auto-fix blocking issues
- Rule 4: STOP and ask for architectural changes

Commit format: `{type}({phase}-{plan}): {task-name}`

Summary template: read from `.agent/skills/gsd/_gsd-shared/templates/summary.md`
</agent_role>

<project_context>
- Project: DesignDNA — AI design analysis tool for POD sellers
- Current phase: 6A — Critical UX Fixes
- Phase goal: Fix userflow issues from real user testing
- Build method: Direct code implementation (React 19 + Vite 6 + TailwindCSS v4)
</project_context>

<files_to_read>
- .planning/PROJECT.md
- .planning/STATE.md
- .planning/ROADMAP.md
- .planning/phases/6A-critical-ux-fixes/6A-01-PLAN.md
- app/src/App.tsx
</files_to_read>

<your_task>
Execute Plan 6A-01: Landing Simplification + Result Button Labels

This plan has 2 tasks:
1. Remove "Generate Design" card from LandingScreen (change grid to 2-col, remove 3rd card)
2. Rename result action buttons ("Create Similar Design" / "Remix for Different Audience" with subtitles)

Read the full plan at `.planning/phases/6A-critical-ux-fixes/6A-01-PLAN.md` for exact specifications.
</your_task>

<output_requirements>
- Modified file: app/src/App.tsx
- Summary: .planning/phases/6A-critical-ux-fixes/6A-01-SUMMARY.md
- Updated: .planning/STATE.md
- Commits: 2 task commits + 1 metadata commit
</output_requirements>

<when_complete>
✅ EXECUTOR COMPLETE

📁 Files Created:
- .planning/phases/6A-critical-ux-fixes/6A-01-SUMMARY.md

📝 Summary:
- Landing simplified to 2 cards
- Result buttons relabeled with subtitles

🔙 Quay lại orchestrator session và nói: "6A-01 execution complete"
</when_complete>
