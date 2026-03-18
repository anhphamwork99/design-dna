<agent_role>
First, read `.agent/agents/gsd-planner.md` for your full role definition. You are a GSD planner — you create executable phase plans (PLAN.md files) that Agent executors can implement without interpretation.
</agent_role>

<project_context>
- **Project:** DesignDNA — AI-powered design intelligence tool for POD sellers
- **Milestone:** v3.0 — UI Redesign (Krea AI-inspired, achromatic light theme)
- **Phase:** 22 — Library & Analyses Screens
- **Phase goal:** Create PatternLibraryScreen, MyAnalysesScreen with grid/list toggle, search, context menus, and empty states
</project_context>

<files_to_read>
Read these files for full context:

- `.planning/PROJECT.md` — Project overview, constraints
- `.planning/STATE.md` — Current state, completed phases
- `.planning/ROADMAP.md` — Phase 22 details + dependency context
- `.planning/REQUIREMENTS.md` — SCREEN-06, SCREEN-07, UX-01..04 requirements

**Existing code to understand:**
- `app/src/screens/LibraryScreen.tsx` (24 LOC) — Current placeholder
- `app/src/screens/PatternDetailScreen.tsx` (27 LOC) — Current placeholder
- `app/src/screens/ViewAnalysisScreen.tsx` (265 LOC) — Existing analysis detail (may need redesign)
- `app/src/apiClient.ts` — API functions (deleteAnalysis, deletePatternById, etc.)
- `app/src/App.tsx` — Current routes (line 63: /library/pattern/:id)
- `app/src/components/shared/` — Available shared components (Card, Button, Modal, EmptyState, etc.)
- `app/src/screens/HomeScreen.tsx` — Reference for list/grid patterns if any
</files_to_read>

<your_task>

## Planning Context

**Phase:** 22 — Library & Analyses Screens
**Mode:** standard
**Phase requirement IDs (MUST be covered):** SCREEN-06, SCREEN-07, UX-01, UX-02, UX-03, UX-04
**Discovery level:** Level 0 — pure internal work, existing patterns and shared components
**Research:** Skipped (config)
**No CONTEXT.md** — no discuss-phase was run, Agent has full discretion on decisions

## Requirements

| ID | Requirement | Notes |
|----|-------------|-------|
| SCREEN-06 | PatternLibraryScreen — grid/list toggle, search, cards with context menu [⋮] | Browse patterns |
| SCREEN-07 | MyAnalysesScreen — grid/list toggle, search, cards with context menu [⋮] | Browse analyses |
| UX-01 | Context menus [⋮] on cards — View, Use in Studio, Compare, Delete | Consistent actions |
| UX-02 | Fullscreen image lightbox — click image → overlay with download + close | Modal viewer |
| UX-03 | Cross-feature quick actions — 12 links mapped | Navigation shortcuts |
| UX-04 | All empty states designed per screen with icon + message + CTA | Onboarding experience |

## Scope from Roadmap

- Pattern Library: grid/list toggle, search bar, cards with context menu [⋮]
- Pattern Detail: full pattern data, source designs, [Use in Studio] CTA
- My Analyses: grid/list toggle, search bar, cards with context menu [⋮] (View, Studio, Compare, Delete)
- Both screens share CardGrid component pattern
- Empty states per screen with CTA

## Existing Code (what you're building on)

- `LibraryScreen.tsx` (24 LOC): Placeholder stub
- `PatternDetailScreen.tsx` (27 LOC): Placeholder stub
- `ViewAnalysisScreen.tsx` (265 LOC): Existing analysis detail view (may need minor redesign)
- API functions available: `deleteAnalysis()`, `deletePatternById()` in apiClient.ts
- Routes already exist in App.tsx: `/library`, `/library/pattern/:id`
- Shared components available: Card, Button, Modal, EmptyState, ErrorBanner, Badge, UploadZone

## Established Patterns from Prior Phases

- Stage-machine pattern (Phase 20, 21)
- Focused component directories (e.g., `compare/` from Phase 21)
- Shared components consumption
- No fade animations (user preference)
- `ai-gradient` class for primary CTAs
- Lucide icons throughout
- UX copy should be clear, action-oriented (from Phase 21 rewrite)

## Planning Instructions

Create PLAN.md file(s) in `.planning/phases/22-library-analyses-screens/`. Both screens share similar pattern (grid/list toggle, search, context menu) — consider:
- Shared ListPage or DataGrid component to avoid duplication
- Context menu component (reusable across both screens)
- Image lightbox component (reusable)
- Empty state per screen

</your_task>

<output_requirements>
Write plan files to: `.planning/phases/22-library-analyses-screens/22-{NN}-PLAN.md`

After writing plans:
1. Update `.planning/ROADMAP.md` with plan count and checkboxes
2. Git commit: `docs(22): create phase plan`
3. Return `## PLANNING COMPLETE` with wave structure table
</output_requirements>

<when_complete>
✅ PLANNER COMPLETE

📁 Files Created:
- `.planning/phases/22-library-analyses-screens/22-01-PLAN.md` (and any additional plans)
- Updated `.planning/ROADMAP.md`

📝 Summary:
- [Number of plans created]
- [Wave structure]
- [Key planning decisions]

🔙 Quay lại orchestrator session và nói: "planning complete"
</when_complete>
