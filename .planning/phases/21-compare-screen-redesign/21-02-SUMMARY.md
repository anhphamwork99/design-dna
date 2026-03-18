---
phase: 21-compare-screen-redesign
plan: 02
subsystem: ui
tags: [react, compare, results, stage-machine, shimmer, lucide-icons]

# Dependency graph
requires:
  - phase: 21-compare-screen-redesign
    plan: 01
    provides: CompareUpload, CompareAnalyzing, types, barrel export
  - phase: 20-creative-studio-redesign
    provides: MascotLoader, stage-machine pattern reference
  - phase: 15
    provides: Shared Modal, ErrorBanner components
provides:
  - CompareResults component (results view with save/studio/new-comparison actions)
  - CompareScreen rewritten as clean stage-machine shell
  - shimmer-text + animated-dots CSS utilities (global, reused across loading screens)
  - Batch upload race condition fix in CompareUpload
affects: [none — phase 21 complete]

# Tech tracking
tech-stack:
  added: []
  patterns: [shimmer-text CSS utility, animated-dots CSS utility, stage-machine shell pattern]

key-files:
  created:
    - app/src/compare/CompareResults.tsx
  modified:
    - app/src/screens/CompareScreen.tsx (rewritten as shell)
    - app/src/compare/CompareUpload.tsx (batch upload fix)
    - app/src/compare/CompareAnalyzing.tsx (shimmer text)
    - app/src/compare/index.ts (barrel export updated)
    - app/src/studio/AnalyzingStage.tsx (shimmer text)
    - app/src/studio/CloneStudio.tsx (shimmer text)
    - app/src/styles/utilities.css (shimmer-text, animated-dots)
  deleted:
    - app/src/CompareScreens.tsx (565 LOC old monolith)
---

# Plan 21-02 Summary — CompareResults + Shell Rewrite

## Objective

Complete the Compare screen redesign by creating the results view, rewriting the screen shell as a stage-machine, and deleting the old monolith.

## What Was Built

### 1. CompareResults Component (`compare/CompareResults.tsx`)

**Layout — single-column scannable sections:**
- **Header**: "Your Winning Formula" + compact image strip (64px thumbnails)
- **The Formula**: Hero section with summary + Keep/Experiment/Avoid 3-column grid
- **Design DNA**: Colors, typography, composition, illustration style cards
- **Shared Audience**: Who buys, identity, emotion, occasion cards
- **Why They Sell**: Pattern analysis bullets + Niche Level (3-tier ladder)

**UX Copy Rewrite:**
| Old | New |
|-----|-----|
| Visual Patterns | Design DNA |
| Buyer Overlap | Shared Audience |
| Made-for-Me Patterns | Why They Sell |
| Specificity Ladder | Niche Level |
| Generic / Niche / Hyper-niche | Broad Market / Focused Niche / Your Sweet Spot |

**Action Buttons (2-row layout):**
- **Row 1**: "Save as Pattern" — full-width, ai-gradient primary, disabled "✓ Pattern Saved" state
- **Row 2**: "Use in Studio" + "New Comparison" — identical secondary border style

**Features:**
- Save as Pattern → shared `<Modal>` with name input → toast notification → button state change
- Use in Studio → `navigate('/studio', { state: { analysisResult, autoGoal: 'explore' } })`
- New Comparison → immediate reset, NO confirm dialog (LOCKED decision)
- Pattern saved check on mount via `checkPatternSaved()`
- All icons use lucide-react (CircleCheck, FlaskConical, CircleX, Bookmark, Sparkles, RefreshCw)

### 2. CompareScreen Shell Rewrite (`screens/CompareScreen.tsx`)

- **Before**: 150 LOC with old CompareScreens imports + screenMap mapping
- **After**: ~140 LOC clean stage-machine shell
- Imports from `compare/` barrel only
- Uses `Step` type (`upload` | `analyzing` | `results`)
- Preserved ALL error mapping logic (timeout, location, 400, 403, 429, 50x, JSON parse, NO_API_KEY)
- Simple conditional rendering (no AnimatePresence wrapper)
- `handleNewComparison` resets without confirmation

### 3. Old Monolith Deleted

- `app/src/CompareScreens.tsx` (565 LOC) — deleted
- Zero remaining imports confirmed

### 4. Cross-Screen Polish

**Batch Upload Fix:**
- `CompareUpload.addFiles()` — fixed race condition where multiple FileReader callbacks overwrote each other
- Now uses `Promise.all` to read all files, then single state update

**Shimmer Text Loading Animation (global CSS utility):**
- `.shimmer-text` — text-primary highlight sweeps right-to-left on text-tertiary base, 3s cycle
- `.animated-dots` — 3 dots appear sequentially with staggered delay
- Applied consistently to all 3 loading screens:
  - CompareAnalyzing: "Discovering what makes your designs special..."
  - AnalyzingStage: "AI analyzing your artwork..."
  - CloneStudio: "Extracting & recreating design..."
- All synced to `text-[20px] font-semibold tracking-tight`

## Net LOC Change

- Created: ~340 LOC (CompareResults)
- Rewritten: ~140 LOC (CompareScreen shell)
- Deleted: -565 LOC (CompareScreens monolith)
- Net: **~-85 LOC** (less code, better architecture)

## Commits

| Hash | Description |
|------|-------------|
| `9a08f79` | feat: create CompareResults component |
| `ac292dc` | feat: rewrite CompareScreen shell + delete old monolith |
| `690c1fe` | fix: batch upload race condition + button UI improvements |
| `74ea25f` | fix: shimmer text loading + lucide icons for Keep/Experiment/Avoid |
| `216b13f` | fix: add shimmer text + animated dots to CloneStudio loading |
| `c53e241` | fix: brighter shimmer highlight + sync loading text styles |
| `1334fe8` | fix: slow shimmer animation to 3s |
| `9f189cc` | fix: reverse shimmer direction (R→L) + remove white highlight |

## Verification

- [x] `npm run build` — 0 new errors
- [x] No remaining imports of old CompareScreens
- [x] User-approved via human-verify checkpoint
- [x] Upload: multi-image batch upload works
- [x] Analyzing: shimmer text + animated dots + mascot GIF
- [x] Results: readable layout, correct button arrangement
- [x] Save as Pattern: modal, toast, disabled state
- [x] Use in Studio: navigates with route state
- [x] New Comparison: no confirm dialog, resets to upload
- [x] Loading screens synced across Compare + Studio + Clone

## Phase 21 Status

**COMPLETE** — Both Wave 1 (21-01) and Wave 2 (21-02) are finished.
The Compare screen is fully redesigned with modular components in `compare/` directory.
