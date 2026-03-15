---
phase: 6A-critical-ux-fixes
plan: 01
subsystem: ui
tags: [react, tailwindcss, landing-page, ux-copy]

requires:
  - phase: 05-build-prompt-f3
    provides: Working app with LandingScreen and ResultsScreen
provides:
  - Simplified 2-card landing screen (Analyze + Compare only)
  - Descriptive result action button labels with subtitles
affects: [6A-02, 6A-03, 6A-04]

tech-stack:
  added: []
  patterns: [subtitle-in-button]

key-files:
  created: []
  modified: [app/src/App.tsx]

key-decisions:
  - "Removed Sparkles import since it was only used by the deleted Generate Design card"
  - "Changed button padding from py-2 to py-3 to accommodate subtitle text"
  - "Used text-white/70 for subtitle on gradient button vs text-text-tertiary on outline button"

patterns-established:
  - "Button with subtitle: text-left alignment + <p> subtitle inside <button>"

duration: 5min
completed: 2026-03-15
---

# Plan 6A-01: Landing Simplification + Result Button Labels Summary

**Removed confusing "Generate Design (Coming Soon)" card from landing and relabeled result action buttons with self-explanatory names + subtitles**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-15T20:25:00+07:00
- **Completed:** 2026-03-15T20:35:00+07:00
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Landing screen simplified to 2 action cards (Analyze Design + Compare Designs) in 2-column grid
- "Generate Design (Coming Soon)" card and Sparkles icon import removed entirely
- Result action buttons renamed: "Create Similar Design" + "Remix for Different Audience" with descriptive subtitles

## Task Commits

Each task was committed atomically:

1. **Task 1: Remove "Generate Design" card from LandingScreen** - `777fe6b` (refactor)
2. **Task 2: Rename action buttons on ResultsScreen** - `52668ca` (fix)

**Plan metadata:** (included in this commit)

## Files Created/Modified
- `app/src/App.tsx` - Removed 3rd landing card, changed grid to 2-col, removed Sparkles import, renamed result buttons with subtitles

## Decisions Made
- Removed `Sparkles` from lucide-react import — confirmed not used in GenerationScreen or CompareScreens
- Used `text-white/70` opacity for subtitle on the gradient primary button for readability
- Added `text-left` alignment to buttons to properly display the subtitle below the label

## Deviations from Plan
None - plan executed exactly as written

## Issues Encountered
- `app/` directory is a separate git repo (has its own `.git/`), so commits needed to be made via `git -C app` instead of the parent repo

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Landing and result screens updated, ready for 6A-02 (analyzing screen improvements)
- All navigation flows remain intact

---
*Phase: 6A-critical-ux-fixes*
*Completed: 2026-03-15*
