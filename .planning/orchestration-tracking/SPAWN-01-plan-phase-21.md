<agent_role>
First, read `.agent/agents/gsd-planner.md` for your full role definition. You are a GSD planner — you create executable phase plans (PLAN.md files) that Agent executors can implement without interpretation.
</agent_role>

<project_context>
- **Project:** DesignDNA — AI-powered design intelligence tool for POD sellers
- **Milestone:** v3.0 — UI Redesign (Krea AI-inspired)
- **Phase:** 21 — Compare Screen Redesign
- **Phase goal:** Redesign the Compare flow (upload → compare → results → save/studio)
</project_context>

<files_to_read>
Read these files for full context:

- `.planning/PROJECT.md` — Project overview, constraints, architecture
- `.planning/STATE.md` — Current state, decisions, architecture summary
- `.planning/ROADMAP.md` — Phase 21 details and dependency context
- `.planning/phases/21-compare-screen-redesign/21-CONTEXT.md` — **CRITICAL:** User decisions from discuss-phase. ALL decisions here are LOCKED.
- `app/src/screens/CompareScreen.tsx` — Current thin shell (150 LOC)
- `app/src/CompareScreens.tsx` — Current 3 inline screens (565 LOC) — target for redesign
- `app/src/apiClient.ts` — API client with `analyzeBatch`, `savePattern`, `checkPatternSaved`
- `app/src/components/shared/` — Available shared UI components (Button, Card, Modal, UploadZone, etc.)
- `app/src/studio/` — Reference for stage-machine pattern used in Phase 20
</files_to_read>

<your_task>

## Planning Context

**Phase:** 21 — Compare Screen Redesign
**Mode:** standard
**Phase requirement IDs (MUST be covered):** SCREEN-05
**Requirement:** CompareScreen — 4-slot selector + comparison matrix + winning formula card (Selection + results)
**Discovery level:** Level 0 — pure internal work, existing patterns only. No new dependencies.
**Research:** Skipped (existing patterns sufficient)

## Key Decisions from CONTEXT.md (LOCKED — do NOT revisit)

1. **Upload mới only** — no "pick from My Analyses" modal
2. **Results layout refactored** — use screen-create + ux-writing approach for new results layout
3. **UX copy rewrite** — all copy currently unclear, needs full rewrite
4. **Save as Pattern = primary action** (full-width, row 1)
5. **Use in Studio = secondary** — navigate to `/studio` with winning formula pre-loaded (auto "Explore" goal + shifts injected)
6. **New Comparison = tertiary** (ghost/text style, row 2 alongside Use in Studio)
7. **No confirm on navigate** — user freely navigates without "unsaved" warnings
8. **Loading = chibi GIF** — same GIF as Clone design flow (not skeleton)
9. **Button layout: 2 rows** — Row 1: Save as Pattern full-width. Row 2: Use in Studio + New Comparison

## Existing Code (what you're replacing)

- `CompareScreen.tsx` (150 LOC): Step routing shell (upload → analyzing → results)
- `CompareScreens.tsx` (565 LOC): 3 inline components:
  - `CompareUploadScreen`: Multi-image upload (max 5), drag & drop
  - `CompareAnalyzingScreen`: Skeleton shimmer + timer + error handling
  - `CompareResultsScreen`: Winning formula + visual patterns + buyer overlap + pattern analysis + save popup

## Established Patterns to Follow

- **Stage-machine**: Type-based step routing (see StudioScreen.tsx Phase 20)
- **Shared components**: Button, Card, Modal, UploadZone, EmptyState, ErrorBanner
- **API client**: `analyzeBatch()`, `savePattern()`, `checkPatternSaved()`
- **Route state passing**: `navigate('/studio', { state: { ... } })` pattern
- **No fade animations**: Per user preference from Phase 20

## Planning Instructions

Create PLAN.md file(s) in `.planning/phases/21-compare-screen-redesign/` following the plan format from your agent definition.

Key considerations:
- This is a REDESIGN of existing working code — logic stays, UI changes
- `CompareScreens.tsx` (565 LOC) should be broken into separate focused components (following Phase 20 pattern)
- Error handling already comprehensive — preserve it
- API calls unchanged — `analyzeBatch()` stays
- Winning formula → Studio flow is NEW (route state with pattern data)

</your_task>

<output_requirements>
Write plan files to: `.planning/phases/21-compare-screen-redesign/21-{NN}-PLAN.md`

After writing plans:
1. Update `.planning/ROADMAP.md` with plan count and checkboxes
2. Git commit: `docs(21): create phase plan`
3. Return `## PLANNING COMPLETE` with wave structure table
</output_requirements>

<when_complete>
✅ PLANNER COMPLETE

📁 Files Created:
- `.planning/phases/21-compare-screen-redesign/21-01-PLAN.md` (and any additional plans)
- Updated `.planning/ROADMAP.md`

📝 Summary:
- [Number of plans created]
- [Wave structure]
- [Key planning decisions]

🔙 Quay lại orchestrator session và nói: "planning complete"
</when_complete>
