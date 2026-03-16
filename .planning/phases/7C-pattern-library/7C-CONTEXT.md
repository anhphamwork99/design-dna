# Phase 7C: Pattern Library + Save Flow - Context

**Gathered:** 2026-03-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Enable saving Compare results as reusable Patterns + Pattern Library UI. User can browse, view detail, delete patterns from Landing, and apply selected pattern sections into Creative Studio. Removes existing "Use Winning Formula" shortcut — all pattern usage flows through Library.

</domain>

<decisions>
## Implementation Decisions

### Save Trigger & Naming
- "Save as Pattern" button on Compare Results screen — user-initiated, not auto-save
- Popup/modal with input field for user to name the pattern
- Toast notification ("Pattern saved!") appears briefly after save, user stays on Compare Results
- Save once per Compare result — after saving, button changes to disabled "✓ Saved" state

### Pattern Data Scope
- Store **full `batch_analysis` object** — visual_patterns, buyer_overlap, made_for_me_patterns, specificity_ladder, winning_formula (with suggested_brief)
- Store **resized thumbnail images** of the original designs used in Compare
- Metadata: pattern name (user-given), created date, source image count
- Persistence: localStorage

### Pattern Library — Landing Entry Point
- New entry point on Landing screen (3rd option alongside Analyze + Compare) — only visible when ≥1 pattern exists
- Navigates to **full-screen Pattern Library page** (new Screen route)
- **List view**: each card shows pattern name + source design thumbnails + created date + 1-line summary (from `winning_formula.summary`)
- **Detail view**: click card → navigates to **dedicated detail page** showing all data in flat layout (similar to Compare Results screen format)
- Actions: **delete** pattern (from list or detail). **No Apply action** from Landing Library — apply only from Creative Studio

### Pattern Library — Creative Studio Panel
- "+ Add Pattern" button (currently disabled) becomes functional
- Click → **expanded panel** slides open showing list of saved patterns
- User selects a pattern → **dialog opens** with content section checkboxes (Visual Patterns ☑, Buyer Overlap ☑, Winning Formula ☑, Made For Me ☑, Specificity Ladder ☑)
- User toggles which sections to include → confirm
- Applied pattern shown as **simple chip** (pattern name + × remove button)
- **Only 1 pattern at a time** — applying new pattern replaces existing one

### Apply Behavior
- Applied pattern data (selected sections only) injected into synthesis prompt as creative input
- Pattern does NOT auto-change dimension states (keep/change) — dimensions remain as user set them
- Removing pattern chip clears pattern from synthesis prompt, does NOT reset dimensions

### Breaking Change: Remove "Use Winning Formula"
- **Remove** the existing "Use Winning Formula" button from Compare Results → Creative Studio flow
- Remove `prefilledBrief` prop chain: App.tsx → CompareScreens.tsx → CreativeStudio.tsx
- **New flow**: Compare Results → "Save as Pattern" → user goes to Creative Studio independently → "+ Add Pattern" from Library
- This simplifies the data flow and makes patterns the single entry point for cross-design insights

### Agent's Discretion
- Thumbnail resize dimensions (balance quality vs localStorage size)
- localStorage key naming convention
- Panel animation style (slide, fade, etc.)
- Exact dialog layout for section checkboxes
- Pattern list sort order (newest first vs alphabetical)
- Toast notification duration and position

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `CompareResultsScreen` already renders all `batch_analysis` sections — can reuse layout for pattern detail page
- `appliedPattern` state already exists in CreativeStudio (string | null) — needs upgrade to structured data
- Toast-style notifications not yet implemented — needs new component
- `batch_analysis` schema already well-defined in `api.ts` (analyzeBatch return type)

### Established Patterns
- Screen navigation via `currentScreen` state + `setCurrentScreen` in App.tsx
- Screen type union: `'landing' | 'upload' | 'analyzing' | 'results' | 'generation' | 'compare_upload' | 'compare_analyzing' | 'compare_results'`
- localStorage used only for API key (`designdna_api_key`) — no data persistence yet
- CSS: dark mode tokens, no CSS modules — inline Tailwind-style classes

### Integration Points
- App.tsx: add new Screen types (`pattern_library`, `pattern_detail`)
- App.tsx: remove `prefilledBrief` state and prop passing
- CompareScreens.tsx: add "Save as Pattern" button, remove "Use Winning Formula" button
- CreativeStudio.tsx: upgrade `appliedPattern` from `string | null` to structured pattern data
- CreativeStudio.tsx: implement "+ Add Pattern" panel + section selection dialog
- Landing screen: add Pattern Library entry point (conditional on saved patterns)

</code_context>

<specifics>
## Specific Ideas

- Pattern detail page should look like Compare Results — same visual language, familiar to user
- "+ Add Pattern" in Creative Studio opens panel inside the left sidebar area, not a full-screen overlay
- Section selection dialog uses checkboxes with section names matching what user sees in Compare Results
- When no patterns saved, Landing shows only Analyze + Compare (no empty state for Library)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 7C-pattern-library*
*Context gathered: 2026-03-16*
