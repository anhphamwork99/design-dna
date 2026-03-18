# Roadmap — v3.0 UI Redesign

**Milestone:** v3.0 — UI Redesign (Krea AI-inspired)
**Created:** 2026-03-17
**Last phase of v2.0:** Phase 13
**Starting phase:** Phase 14

---

## Phase Overview

| Phase | Name | Requirements | Risk | Size |
|-------|------|-------------|------|------|
| 14 | Design System Foundation ✅ | STYLE-01..06 | 🔴 HIGH | Medium |
| 15 | Shared UI Components ✅ | SHARED-01..09 | 🟡 MED | Medium |
| 16 | App Shell & Sidebar ✅ | LAYOUT-01..06, ROUTER-01..02 | 🔴 HIGH | Large |
| 17 | Router & Screen Extraction ✅ | ROUTER-03..05, SCREEN-01 | 🔴 HIGH | Large |
| 18 | Home Screen | SCREEN-02, UX-04 (home) | 🟡 MED | Small |
| 19 | Analyze Screen Redesign | SCREEN-03, UX-01..06 (analyze) | 🟡 MED | Large |
| 20 | Creative Studio Redesign | SCREEN-04 | 🔴 HIGH | Large |
| 21 | Compare Screen Redesign ✅ | SCREEN-05 | 🟡 MED | Medium |
| 22 | Library & Analyses Screens | SCREEN-06, SCREEN-07, UX-01..04 (lists) | 🟡 MED | Medium |
| 23 | Settings & Auth Screens | SCREEN-08, AUTH-01, AUTH-02 | 🟢 LOW | Small |
| 24 | Polish & Verification | POLISH-01..03, UX-02..03 | 🟢 LOW | Small |

---

## Phase Details

### Phase 14: Design System Foundation
**Requirements:** STYLE-01, STYLE-02, STYLE-03, STYLE-04, STYLE-05, STYLE-06
**Risk:** 🔴 HIGH — Token swap = visual flip. App goes from dark→light in this phase.
**Pitfall watch:** P1 (big-bang CSS), P3 (depth mismatch), P7 (specificity), P15 (font rendering)

**Scope:**
- Create `styles/tokens.css` with CSS custom properties from DESIGN-SYSTEM.md extraction
- Create `styles/reset.css` (modern CSS reset)
- Create `styles/globals.css` (body, typography, scrollbar, global keyframes)
- Create `styles/utilities.css` (migrate custom utilities from current index.css)
- Replace `@theme` values in index.css — dark→light values (token names stay same!)
- Add Inter font from Google Fonts
- Restructure `index.css` as import-only entry point

**Verification:** App renders in light mode. All screens visually correct (may look rough but functional).

---

### Phase 15: Shared UI Components
**Requirements:** SHARED-01..09
**Risk:** 🟡 MEDIUM — New files, no breaking changes.

**Scope:**
- `components/shared/Button.tsx` — primary, secondary, ghost, icon-only variants
- `components/shared/Card.tsx` — surface card with border + hover
- `components/shared/Input.tsx` — text input with label + error state
- `components/shared/Modal.tsx` — overlay with backdrop blur + close
- `components/shared/UploadZone.tsx` — drag & drop + preview + validation
- `components/shared/EmptyState.tsx` — icon + title + description + CTA
- `components/shared/ErrorBanner.tsx` — error message + retry
- `components/shared/LoadingSpinner.tsx` — spinner + skeleton cards
- `components/shared/Badge.tsx` — small pill

**Verification:** Each component renders correctly in isolation. Build passes.

---

### Phase 16: App Shell & Sidebar
**Requirements:** LAYOUT-01..06, ROUTER-01, ROUTER-02
**Risk:** 🔴 HIGH — Major structural change. LandingScreen removal.
**Pitfall watch:** P2 (logic loss), P4 (nav change shock), P5 (auth break), P10 (perf), P11 (a11y)

**Scope:**
- Install `react-router-dom` v7
- Create `components/layout/AppShell.tsx` (Sidebar + ContentArea)
- Create `components/layout/Sidebar.tsx` (3 sections, expand/collapse, active state)
- Create `components/layout/SidebarNavItem.tsx` (icon + label + active indicator)
- Create `components/layout/ContentArea.tsx` (main area wrapper)
- Remove `LandingScreen` inline component
- Sidebar responsive: collapse on mobile (≤768px)
- Route definitions wired to sidebar items

**Verification:** Sidebar renders, clicking items changes route, auth gate works above shell.

---

### Phase 17: Router & Screen Extraction
**Requirements:** ROUTER-03..05, SCREEN-01
**Risk:** 🔴 HIGH — God component decomposition. Biggest refactor.
**Pitfall watch:** P2 (logic loss), P5 (auth), P10 (perf)

**Scope:**
- Decompose `App.tsx` (1,307 LOC → ~50 LOC): extract inline components to `screens/`
- Extract: `AnalyzeScreen.tsx` (Upload + Analyzing + Results merged)
- Extract: `AnalysisResultsScreen.tsx` (results display + view saved)
- Extract: `CompareScreen.tsx` (refactor existing to use Router params)
- Move: `CreativeStudio.tsx` → `screens/CreativeStudioScreen.tsx`
- Extract: `PatternLibraryScreen.tsx`, `PatternDetailScreen.tsx`
- Move: `MyAnalysesList.tsx` → `screens/MyAnalysesScreen.tsx`
- Transform: `SettingsModal.tsx` → `screens/SettingsScreen.tsx` (modal → page)
- Wire all screens to Routes
- `document.title` update per route
- Migrate state: `useState<Screen>` → Router `pathname`

**Verification:** All 8 screens accessible via sidebar + URL. Core interactions work. Auth gate intact.

---

### Phase 18: Home Screen
**Requirements:** SCREEN-02, UX-04 (home empty state)
**Risk:** 🟡 MEDIUM

**Scope:**
- New `screens/HomeScreen.tsx`
- Hero upload CTA card (prominent, with drag & drop)
- Quick action cards: Analyze, Studio, Compare (3 cards in row)
- Recent analyses grid (from API, horizontal scroll)
- Empty state for new users: illustration + "Start by analyzing your first design"
- Route `/` → redirect to `/home`

**Verification:** Home screen renders. Quick actions navigate correctly. Recent analyses load from API.

---

### Phase 19: Analyze Screen Redesign
**Requirements:** SCREEN-03, UX-01..06 (analyze context)
**Risk:** 🟡 MEDIUM

**Scope:**
- Redesign upload zone with new UploadZone component
- Side-by-side results layout: image preview (left) + DNA accordion sections (right)
- 3 states: empty (upload) → analyzing (progress + skeleton) → results (side-by-side)
- Post-analysis actions: Save, Use in Studio →, Compare with other →
- Loading states with progress bar + skeleton
- Error states with ErrorBanner
- Fullscreen image lightbox on click

**Verification:** Full flow: upload → analyze → view results → save → navigate to Studio.

---

### Phase 20: Creative Studio Redesign ✅ COMPLETE
**Requirements:** SCREEN-04
**Risk:** 🔴 HIGH — Most complex component (1,063 LOC), complex state machine.

**Delivered:**
- Stage-machine architecture: 10-stage enum replaces 17 boolean useState calls
- Goal picker: 3 large cards (Clone, Variations, Explore) replace creativity slider
- Upload stage: goal-aware descriptions, auto-analyze on drop
- Analyzing stage: premium loading animation with step text progression
- Clone flow: preview → cloning → side-by-side result
- Variation/Explore flow: sidebar (shifts, patterns, aspect ratio) + canvas (concept cards)
- Concept cards: horizontal strip, click → fullscreen dialog, artwork renders on card
- Pattern picker: ported and componentized from old code
- "Go to Studio" wired from AnalyzeScreen via route state
- Old `CreativeStudio.tsx` (1,063 LOC) deleted → replaced by ~10 focused components
- Buyer fit (`analyzeBuyerFit`) removed from Studio entirely

**Verification:** ✅ Clone, Variations, Explore flows operational. Build passes.

---

### Phase 21: Compare Screen Redesign ✅
**Requirements:** SCREEN-05
**Risk:** 🟡 MEDIUM
**Plans:** 2 plans in 2 waves

**Scope:**
- Break `CompareScreens.tsx` (565 LOC) into focused `compare/` components (types, upload, analyzing, results)
- Stage-machine shell pattern (matching Studio Phase 20)
- Upload: multi-image (2-5) drag & drop with image grid
- Analyzing: chibi GIF mascot (not skeleton shimmer)
- Results: redesigned layout with winning formula, visual patterns, buyer overlap, pattern analysis
- Button layout: Row 1 = Save as Pattern (full-width primary), Row 2 = Use in Studio + New Comparison
- "Use in Studio" navigates to `/studio` with winning formula pre-loaded
- No confirm dialog on New Comparison
- Full UX copy rewrite

Plans:
- [x] 21-01-PLAN.md — Types + CompareUpload + CompareAnalyzing (foundation)
- [x] 21-02-PLAN.md — CompareResults + shell rewrite + delete old monolith

**Verification:** Upload 2+ images → analyzing (GIF) → results → save pattern / use in studio / new comparison.

---

### Phase 22: Library & Analyses Screens
**Requirements:** SCREEN-06, SCREEN-07, UX-01..04 (lists)
**Risk:** 🟡 MEDIUM

**Scope:**
- Pattern Library: grid/list toggle, search bar, cards with context menu [⋮]
- Pattern Detail: full pattern data, source designs, [Use in Studio] CTA
- My Analyses: grid/list toggle, search bar, cards with context menu [⋮] (View, Studio, Compare, Delete)
- Both screens share CardGrid component pattern
- Empty states per screen with CTA

**Verification:** Browse, search, context menu actions, empty states. Delete works with confirmation.

---

### Phase 23: Settings & Auth Screens
**Requirements:** SCREEN-08, AUTH-01, AUTH-02
**Risk:** 🟢 LOW

**Scope:**
- Settings: full-page layout (from modal), API key section + account section
- Login screen: redesigned with light theme, Inter font
- Register screen: redesigned with light theme, Inter font
- Keep all auth logic unchanged

**Verification:** Login → Register toggle works. API key save/verify works. Sign out works.

---

### Phase 24: Polish & Verification
**Requirements:** POLISH-01..03, UX-02, UX-03
**Risk:** 🟢 LOW

**Scope:**
- CSS cleanup: remove dead dark-mode styles, unused rules
- Accessibility: `role="navigation"` on sidebar, focus management, keyboard nav
- Responsive testing: 375px, 768px, 1280px
- Cross-feature quick actions: verify all 12 navigation links
- Fullscreen image lightbox component
- Performance profiling (React DevTools)
- Full app walkthrough — every screen, every state

**Verification:** All 45 requirements met. Build passes. Responsive on 3 breakpoints.

---

## Dependency Chain

```
Phase 14 (Tokens) ──→ Phase 15 (Shared Components) ──→ Phase 16 (Shell + Sidebar)
                                                            │
                                                            ▼
                                                      Phase 17 (Router + Extract)
                                                            │
                                              ┌─────────────┼─────────────┐
                                              ▼             ▼             ▼
                                         Phase 18      Phase 19       Phase 20
                                         (Home)       (Analyze)      (Studio)
                                              │             │             │
                                              ▼             ▼             ▼
                                         Phase 21      Phase 22       Phase 23
                                         (Compare)    (Library)      (Settings)
                                                            │
                                                            ▼
                                                      Phase 24 (Polish)
```

Phases 18–23 can be done in any order after Phase 17.

---

*Total: 11 phases (Phase 14–24)*
*Estimated: Medium-to-large effort*
