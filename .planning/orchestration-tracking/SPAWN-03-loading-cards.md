<agent_role>
You are a GSD plan executor. You execute PLAN.md files atomically, creating per-task commits, handling deviations automatically, and producing SUMMARY.md files.

Your job: Execute the plan completely, commit each task, create SUMMARY.md, update STATE.md.

Key rules:
- Execute tasks sequentially, commit after each task
- Commit format: `{type}(20.1-03): {task-description}`
- Stage files individually (NEVER `git add .`)
- Auto-fix bugs/blockers (Rules 1-3), ask about architectural changes (Rule 4)
- After all tasks: create SUMMARY.md + update STATE.md
- After 3 auto-fix attempts on same task: document and move on

When plan references CONTEXT.md: It contains user decisions — honor them exactly.
</agent_role>

<project_context>
- Project: DesignDNA v3.0
- Phase: 20.1 — Studio Flow Polish (INSERTED)
- Goal: Polish Studio flow — floating panel, dropdown shifts, responsive cards, unified loading
- Wave: 2 (runs AFTER Plan 01 + Plan 02 complete)
</project_context>

<files_to_read>
Read these files FIRST before executing:
- .planning/STATE.md
- .planning/ROADMAP.md
- .planning/phases/20.1-studio-flow-polish/20.1-CONTEXT.md
- .planning/phases/20.1-studio-flow-polish/20.1-03-PLAN.md
- .planning/phases/20.1-studio-flow-polish/20.1-01-SUMMARY.md (Plan 01 completed — see what changed)
- .planning/phases/20.1-studio-flow-polish/20.1-02-SUMMARY.md (Plan 02 completed — see what changed)
- app/src/studio/ConceptCard.tsx (will be rewritten for responsive + unified layout)
- app/src/studio/VariationStudio.tsx (already refactored by Plan 01 — read current state)
- app/src/studio/ConceptDetailDialog.tsx (update generating state)
- app/src/screens/StudioScreen.tsx (already updated by Plan 02 — read current state)
- app/src/studio/MascotLoader.tsx (will be used everywhere)
- app/src/studio/types.ts (need to add per-card generating state)
</files_to_read>

<your_task>
Execute Plan 20.1-03: Loading States + Concept Cards + Transitions

This plan has 5 tasks:
1. Responsive concept cards with unified layout (rewrite ConceptCard, update grid)
2. Unified synthesizing loading with MascotLoader (full canvas takeover)
3. Per-card generating state with wave gradient (MascotLoader in card, per-card tracking)
4. Smooth canvas transitions (staggered card entrance, empty→concepts animation)
5. Build verification + cleanup (npm run build, fix errors, remove unused)

Key decisions from CONTEXT.md (LOCKED):
- MascotLoader for ALL loading states
- Synthesizing: full canvas takeover, panel hides
- Generating artwork: MascotLoader inside card + wave gradient bottom
- Per-card generating state (not global stage) — enables parallel generation
- Cards: responsive grid (auto-fill, minmax 240px, 1fr), unified layout
- Unified card = aspect-4/3 top area (artwork or gradient placeholder) + text below
- Smooth transitions only within canvas, outer screens unchanged

IMPORTANT: Plan 01 (floating panel) and Plan 02 (navigation + empty state) have already been executed.
The codebase now has FloatingPanel, AccordionSection, DimensionShifts, StudioTopBar components.
VariationStudio uses floating panel layout. Read the current state of files before editing.

After execution:
- Create SUMMARY.md at `.planning/phases/20.1-studio-flow-polish/20.1-03-SUMMARY.md`
- Update STATE.md
- Run `npm run build` and fix any errors
- Return "## PLAN COMPLETE" with commits list
</your_task>

<output_requirements>
Output files:
- `.planning/phases/20.1-studio-flow-polish/20.1-03-SUMMARY.md`

Commit per task:
- Task 1: `feat(20.1-03): responsive concept cards with unified layout`
- Task 2: `feat(20.1-03): full canvas MascotLoader for synthesizing`
- Task 3: `feat(20.1-03): per-card generating with MascotLoader + wave gradient`
- Task 4: `feat(20.1-03): smooth transitions within canvas studio`
- Task 5: `chore(20.1-03): cleanup unused code + verify build`
</output_requirements>

<when_complete>
✅ EXECUTOR COMPLETE

📁 Files Created:
- .planning/phases/20.1-studio-flow-polish/20.1-03-SUMMARY.md

📝 Summary:
- ConceptCard rewritten with responsive + unified layout
- MascotLoader used for all loading states
- Per-card generating with wave gradient animation
- Smooth staggered transitions in canvas

🔙 Quay lại orchestrator session và nói: "plan 03 complete"
</when_complete>
