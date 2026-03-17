# Plan 20-01 Summary: State Machine + Types + Goal Picker Stage

**Executed:** 2026-03-18
**Status:** ✅ Complete
**Build:** ✅ 0 errors

## Files Created/Modified

| File | Action | LOC |
|------|--------|-----|
| `app/src/studio/types.ts` | Created | 109 |
| `app/src/studio/GoalPicker.tsx` | Created | 76 |
| `app/src/studio/index.ts` | Created | 2 |
| `app/src/screens/StudioScreen.tsx` | Rewritten | 79 |

## What Was Done

### Task 1: Define types and Stage enum
- Created `studio/types.ts` with `Stage` type (10 stages replacing 17 boolean useState calls)
- `StudioGoal` type: 'clone' | 'variations' | 'explore' (replaces creativity slider)
- `goalCards` metadata array with icon, title, description, CTA per goal
- `getDefaultShifts(goal)` helper: Variations = S/H change, rest keep; Explore = all change
- `dimensionConfig` array (7 dimensions), `ShiftState`, `Shifts`, `AppliedPatternData` interfaces
- Re-exports `SynthesizedConcept`, `SynthesizeInput`, `GenerateArtworkInput`, `CloneDesignInput`, `SavedPattern`

### Task 2: Create GoalPicker component
- 3 large cards in horizontal row, centered layout
- `motion/react` animations: staggered entry (opacity+y), hover scale(1.02)+shadow, tap scale(0.98)
- Preloaded image indicator when entering from Analyze screen
- Design system tokens: bg-bg-surface1, border-border-default, text-text-secondary, accent

### Task 3: Rewrite StudioScreen as state-machine shell
- Stage-based rendering with `useState<Stage>('goals')`
- 'goals' stage → `<GoalPicker />` with AnimatePresence transitions
- All other stages → fallback to old `<CreativeStudio />` component (preserves existing functionality)
- `handleSelectGoal`: if image+DNA preloaded → skip to 'studio', else → 'upload'
- `handleStartOver`: keeps image+DNA, resets goal, returns to 'goals'
- Entry from Analyze: `useLocation().state` pre-loads image+DNA

### Task 4: Studio barrel export
- `studio/index.ts` re-exports all types and GoalPicker

### Task 5: Build verification
- `npm run build` → 0 errors, 2148 modules transformed
- Old CreativeStudio.tsx untouched — works as fallback for non-goal stages

## Deviations

None. Plan executed as-is.

## Key Decisions

1. Used Tailwind utility classes (not custom CSS) — consistent with existing codebase pattern
2. `onNavigate` prop passed to CreativeStudio fallback maps to `handleStartOver` — "Back" goes to goal picker
3. `AnimatePresence mode="wait"` for smooth stage transitions

## Next

Plan 20-02 (Upload + Clone Flow) and Plan 20-03 (Variation/Explore + Cleanup) build on this foundation.
