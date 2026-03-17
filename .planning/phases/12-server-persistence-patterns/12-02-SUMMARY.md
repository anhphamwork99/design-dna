# Plan 12-02 Summary: Frontend API Client & Storage Deprecation

## Completed Tasks

| # | Task | Status |
|---|------|--------|
| 1 | Deprecate `patternStorage.ts` — rename functions to `legacy*`, remove `savePattern`/`isCompareResultSaved` | ✅ Done |
| 2 | Add `SavedPattern` type + 5 CRUD functions to `apiClient.ts` | ✅ Done |
| 3 | Move `resizeToThumbnail` to `apiClient.ts` | ✅ Done |
| 4 | [Deviation] Update `CompareScreens.tsx` to use API functions (build fix) | ✅ Done |

## Commits

| Hash | Message |
|------|---------|
| `5215bdb` | refactor(12-02): deprecate patternStorage.ts — rename to legacy, remove savePattern/isCompareResultSaved |
| `3b618c3` | feat(12-02): add pattern CRUD functions and SavedPattern type to apiClient.ts |
| `cc259d8` | fix(12-02): update CompareScreens to use API-backed pattern save and check |

## Files Modified
- `app/src/patternStorage.ts` — deprecated: renamed type to `LegacySavedPattern`, renamed CRUD to `legacy*` prefix, removed `savePattern`/`isCompareResultSaved`, added backward-compat re-exports
- `app/src/apiClient.ts` — added `SavedPattern` type, `listPatterns`, `getPatternById`, `savePattern`, `deletePatternById`, `checkPatternSaved`, `resizeToThumbnail`
- `app/src/CompareScreens.tsx` — switched from localStorage to API-backed pattern save/check

## Implementation Details

### apiClient.ts — New Exports
| Export | Type | Description |
|--------|------|-------------|
| `SavedPattern` | interface | Matches backend DB shape (snake_case fields) |
| `listPatterns(token)` | GET `/api/patterns` | Returns array without `batch_analysis` |
| `getPatternById(token, id)` | GET `/api/patterns/:id` | Full pattern with `batch_analysis` |
| `savePattern(token, data)` | POST `/api/patterns` | Saves new pattern |
| `deletePatternById(token, id)` | DELETE `/api/patterns/:id` | Deletes a pattern |
| `checkPatternSaved(token, summary)` | helper | Lists patterns, checks if any matches `summary` |
| `resizeToThumbnail(dataUri, maxSize?)` | helper | Canvas-based image resize |

### patternStorage.ts — Deprecation Strategy
- Renamed `getPatterns` → `legacyGetPatterns`, `getPattern` → `legacyGetPattern`, `deletePattern` → `legacyDeletePattern`
- Added backward-compat re-exports (`export const getPatterns = legacyGetPatterns`) so existing UI consumers (CreativeStudio, PatternLibrary, PatternDetail, App.tsx) keep compiling until Plan 12-03 migrates them
- Removed `savePattern` and `isCompareResultSaved` completely (no new writes to localStorage)
- Added `@deprecated` JSDoc tags to all exports

## Deviations
| Type | Description |
|------|-------------|
| Rule 1 (auto-fix) | Updated `CompareScreens.tsx` to use API functions — necessary because `savePattern`/`isCompareResultSaved` were removed from `patternStorage.ts` and build would fail |

### Key Decisions
- Named API functions `getPatternById`/`deletePatternById` to avoid name collision with backward-compat re-exports in patternStorage
- `checkPatternSaved` does a full list fetch + client-side filter (acceptable since list excludes batch_analysis)
- Kept backward-compat re-exports in patternStorage to minimize blast radius — Plan 12-03 will remove them

## Verification
- `npm run build` — passed with zero errors (Vite build)

## Self-Check: PASSED
- [x] `app/src/apiClient.ts` exports 5 pattern CRUD functions + SavedPattern type
- [x] `app/src/patternStorage.ts` has legacy-prefixed functions + deprecation comments
- [x] `app/src/CompareScreens.tsx` uses API-backed functions
- [x] `npm run build` passes
- [x] 3 commits created with correct format
