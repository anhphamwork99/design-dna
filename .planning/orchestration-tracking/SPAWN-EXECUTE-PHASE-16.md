<agent_role>
You are a GSD execute-phase orchestrator. You execute all plans in a phase using wave-based execution.

Your job: Discover plans, group by wave, spawn executor subagents, handle checkpoints, collect results, verify phase goal, update state.

**Key behaviors:**
- Each plan is executed as an independent unit with atomic commits
- Plans in the same wave CAN run in parallel
- Plans with `autonomous: false` have checkpoints — pause and present to user
- After all plans complete, verify phase goal with must_haves
- Update ROADMAP.md, STATE.md, REQUIREMENTS.md

**Executor agent instructions:** Read `.agent/agents/gsd-executor.md` for the full executor protocol.

**Execute-phase workflow:** Read `.agent/skills/gsd/gsd-execution/execute-phase.md` for the full orchestration process.

**Checkpoint handling:** Read `.agent/skills/gsd/gsd-execution/references/checkpoints.md` for checkpoint protocol.

**Summary template:** Read `.agent/skills/gsd/_gsd-shared/templates/summary.md` for SUMMARY.md format.

**Config:**
- `model_profile: balanced` → executor model: sonnet, verifier model: sonnet
- `commit_docs: true`
- `workflow.verifier: true` → run verification after execution
- `branching_strategy: none` → no branch creation
</agent_role>

<project_context>
- **Project:** DesignDNA v3.0 UI Redesign
- **Current Phase:** 16 — App Shell & Sidebar
- **Phase Goal:** Replace useState navigation with persistent sidebar + React Router v7
- **Previous Phase:** 15 (Shared UI Components) — COMPLETE
</project_context>

<files_to_read>
- `.planning/PROJECT.md` — Project overview
- `.planning/ROADMAP.md` — Phase roadmap
- `.planning/STATE.md` — Current state
- `.planning/REQUIREMENTS.md` — Requirements traceability
- `.planning/config.json` — Workflow config
- `.planning/phases/16-app-shell-sidebar/16-CONTEXT.md` — User decisions
- `.planning/phases/16-app-shell-sidebar/16-01-PLAN.md` — Plan 01 (Wave 1)
- `.planning/phases/16-app-shell-sidebar/16-02-PLAN.md` — Plan 02 (Wave 2)
- `.agent/agents/gsd-executor.md` — Executor agent instructions
- `.agent/skills/gsd/gsd-execution/execute-phase.md` — Execute-phase workflow
- `.agent/skills/gsd/_gsd-shared/templates/summary.md` — Summary template
</files_to_read>

<your_task>
Execute Phase 16: App Shell & Sidebar

**Phase has 2 plans across 2 waves:**

| Wave | Plan | Autonomous | What it builds |
|------|------|------------|----------------|
| 1 | 16-01 | ✅ true | Install Router v7, Dancing Script font, create Sidebar + AppShell + SidebarNavItem components |
| 2 | 16-02 | ❌ false (checkpoint) | Wire BrowserRouter + Routes, refactor App.tsx, remove header/landing, create HomeScreen placeholder |

**Execution flow:**

1. Read all files listed above
2. **Wave 1:** Execute Plan 01 (autonomous — install deps, create layout components)
3. Verify Plan 01 SUMMARY.md created
4. **Wave 2:** Execute Plan 02 (has checkpoint — wire routes, refactor App.tsx)
5. Plan 02 will pause at checkpoint:human-verify for UI testing
6. Present checkpoint to user, wait for approval
7. If approved, spawn continuation agent to complete Plan 02
8. After both plans complete, verify phase goal
9. Update ROADMAP.md, STATE.md, REQUIREMENTS.md

**Important:**
- Dev servers are already running: `npm run dev` on both `/api` and `/app`
- Project root: `/Users/anhpham99/Development/Building/Builder Space/projects/design-dna`
- Working directory is the project root
- The CONTEXT.md contains critical user decisions — sidebar structure, logo font, routing, auth gate pattern
- Phase requirement IDs: LAYOUT-01 through LAYOUT-06, ROUTER-01, ROUTER-02
</your_task>

<output_requirements>
**Per plan:**
- `.planning/phases/16-app-shell-sidebar/16-01-SUMMARY.md`
- `.planning/phases/16-app-shell-sidebar/16-02-SUMMARY.md`

**Phase completion:**
- `.planning/phases/16-app-shell-sidebar/16-VERIFICATION.md`
- Updated `.planning/ROADMAP.md` (Phase 16 marked complete)
- Updated `.planning/STATE.md` (current phase, progress)
- Updated `.planning/REQUIREMENTS.md` (LAYOUT-*, ROUTER-* marked Complete)

**Git commits:**
- Per-task atomic commits: `feat(16-01): ...`, `feat(16-02): ...`
- Per-plan metadata commits: `docs(16-01): complete ...`, `docs(16-02): complete ...`
- Phase completion commit: `docs(16): complete app-shell-sidebar phase`
</output_requirements>

<when_complete>
✅ EXECUTOR COMPLETE

📁 Files Created:
- app/src/components/layout/Sidebar.tsx
- app/src/components/layout/SidebarNavItem.tsx
- app/src/components/layout/AppShell.tsx
- app/src/components/layout/index.ts
- app/src/screens/HomeScreen.tsx
- .planning/phases/16-app-shell-sidebar/16-01-SUMMARY.md
- .planning/phases/16-app-shell-sidebar/16-02-SUMMARY.md
- .planning/phases/16-app-shell-sidebar/16-VERIFICATION.md

📝 Summary:
- Sidebar with 3 zones (WORKSPACE, TOOLS, FOOTER) and collapse toggle
- React Router v7 replacing useState navigation
- Dancing Script logo font loaded
- Auth gate wrapping Router
- Header and LandingScreen removed

🔙 Quay lại orchestrator session và nói: "phase 16 execution complete"
</when_complete>
