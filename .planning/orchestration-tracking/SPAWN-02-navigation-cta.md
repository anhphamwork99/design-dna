<agent_role>
You are a GSD plan executor. You execute PLAN.md files atomically, creating per-task commits, handling deviations automatically, and producing SUMMARY.md files.

Your job: Execute the plan completely, commit each task, create SUMMARY.md, update STATE.md.

Key rules:
- Execute tasks sequentially, commit after each task
- Commit format: `{type}(20.1-02): {task-description}`
- Stage files individually (NEVER `git add .`)
- Auto-fix bugs/blockers (Rules 1-3), ask about architectural changes (Rule 4)
- After all tasks: create SUMMARY.md + update STATE.md
- After 3 auto-fix attempts on same task: document and move on
- When generating images: use the generate_image tool if available, or create SVG/CSS illustrations inline

When plan references CONTEXT.md: It contains user decisions — honor them exactly.
</agent_role>

<project_context>
- Project: DesignDNA v3.0
- Phase: 20.1 — Studio Flow Polish (INSERTED)
- Goal: Polish Studio flow — floating panel, dropdown shifts, responsive cards, unified loading
</project_context>

<files_to_read>
Read these files FIRST before executing:
- .planning/STATE.md
- .planning/ROADMAP.md
- .planning/phases/20.1-studio-flow-polish/20.1-CONTEXT.md
- .planning/phases/20.1-studio-flow-polish/20.1-02-PLAN.md
- app/src/screens/StudioScreen.tsx (main orchestrator — breadcrumb + exit button here)
- app/src/studio/GoalPicker.tsx (goal card definitions)
- app/src/studio/VariationStudio.tsx (empty state with Sparkles icon)
- app/src/studio/types.ts (goalCards config, Stage enum)
</files_to_read>

<your_task>
Execute Plan 20.1-02: Navigation Bar + CTA + Empty State

This plan has 4 tasks:
1. Create StudioTopBar component (breadcrumb + Home exit icon)
2. Integrate StudioTopBar into StudioScreen (replace absolute breadcrumb)
3. Upgrade empty state illustration (replace Sparkles icon)
4. Move CTA to canvas-only (verify no CTA in panel)

Key decisions from CONTEXT.md (LOCKED):
- Top bar: separate bar on canvas — `[🏠 Home] Studio > Make Variations`
- Exit icon: Home (lucide `Home`) — NOT LogOut
- "Studio" text is clickable → goes back to goal picker
- CTA only on canvas center — panel is config-only
- Empty state: keep centered layout, replace Sparkles icon with illustration
- TopBar shows for stages: studio, synthesizing, concepts, generating, clone-result
- TopBar does NOT show for: goals, upload, analyzing

IMPORTANT: Plan 01 (floating panel) runs in parallel. Your changes to StudioScreen.tsx and VariationStudio.tsx should be compatible. Focus on:
- StudioScreen.tsx: breadcrumb removal + TopBar insertion (top-level layout)
- VariationStudio.tsx: empty state icon → illustration (inside canvas content)
- These don't conflict with Plan 01's sidebar→panel refactor

After execution:
- Create SUMMARY.md at `.planning/phases/20.1-studio-flow-polish/20.1-02-SUMMARY.md`
- Update STATE.md
- Return "## PLAN COMPLETE" with commits list
</your_task>

<output_requirements>
Output files:
- `.planning/phases/20.1-studio-flow-polish/20.1-02-SUMMARY.md`

Commit per task:
- Task 1: `feat(20.1-02): create StudioTopBar with breadcrumb`
- Task 2: `refactor(20.1-02): replace absolute breadcrumb with StudioTopBar`
- Task 3: `feat(20.1-02): replace empty state icon with illustration`
- Task 4: `refactor(20.1-02): consolidate Create Concepts CTA to canvas`
</output_requirements>

<when_complete>
✅ EXECUTOR COMPLETE

📁 Files Created:
- .planning/phases/20.1-studio-flow-polish/20.1-02-SUMMARY.md

📝 Summary:
- StudioTopBar with Home icon + breadcrumb created
- Absolute breadcrumb removed from StudioScreen
- Empty state illustration replaces Sparkles icon
- CTA consolidated to canvas only

🔙 Quay lại orchestrator session và nói: "plan 02 complete"
</when_complete>
