# Research Summary — v3.0 UI Redesign

**Synthesized:** 2026-03-17
**Sources:** DESIGN-SYSTEM.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md
**Confidence:** HIGH — CSS tokens extracted via Puppeteer, codebase analyzed directly, 30+ external sources

---

## Executive Summary

DesignDNA v3.0 redesign chuyển từ **dark-mode landing-page app** sang **light-first sidebar-based creative tool**, lấy cảm hứng từ Krea AI. Research reveals 4 key insights:

1. **Krea dùng achromatic palette (grayscale only)** — no brand color hue. Toàn bộ UI xây trên scale từ `#000` → `#FFF` với `Inter` font thay Suisse Intl.
2. **Current codebase có God Component** — `App.tsx` (1,307 LOC) chứa 6 inline components + all state + routing. Phải decompose trước khi redesign UI.
3. **Token names KHÔNG cần đổi** — Tailwind v4 `@theme` đã dùng semantic naming (`bg-base`, `text-primary`). Chỉ cần swap values từ dark → light.
4. **15 pitfalls documented** — nguy hiểm nhất: big-bang CSS rewrite, dark→light depth mismatch, navigation model change shock.

---

## 1. Design System (from DESIGN-SYSTEM.md)

### Color Philosophy
- **Achromatic-first** — grayscale scale following Tailwind neutral (050 → 950)
- **Light-first** cho DesignDNA: `#FAFAFA` base, `#FFFFFF` surfaces, `#000` text
- **No accent hue** — CTAs use black/white contrast (black bg + white text, hoặc ngược lại)
- **Border strategy:** `rgba(0,0,0,0.1)` inset ring shadows thay vì solid borders

### Typography
- **Font:** Inter (free alternative to Krea's Suisse Intl) — single family cho mọi thứ
- **Scale:** nano(11px) → micro(12px) → caption(13px) → label(14px) → body(16px) → h4(20px) → h3(24px) → h2(30px) → h1(36px)
- **Weights:** 400 (regular), 450 (book), 500 (medium), 600 (semibold), 700 (bold)
- **Tight headlines** (line-height 1.0), comfortable body (1.5)

### Spacing
- **Base unit:** 4px, primary 8px
- **Scale:** 4 → 8 → 12 → 16 → 20 → 28 → 32 → 40 → 44 → 48 → 64 → 80 → 96px
- **Density:** Default-to-comfortable

### Component Tokens
- **Radius:** 6px (small) → 8px (default) → 16px (cards) → 9999px (pill)
- **Shadows:** Minimal — inset ring `0.5px rgba(0,0,0,0.1)` for borders, `rgba(0,0,0,0.25) 25px 50px -12px` for modals
- **Transitions:** 100-200ms micro,304-700ms content reveals, `(:ease-out` + `cubic-bezier(0.4,0,0.2,1)`)
- **Backdrop blur:** 24px cho overlays (glassmorphism-lite)

### CSS Custom Properties: READY
Full `:root {}` block có ~60 tokens — sẵn sàng dùng. Xem `DESIGN-SYSTEM.md` Section 12.

---

## 2. UI/UX Patterns (from FEATURES.md)

### Sidebar Structure (Proposed)
```
WORKSPACE
  🏠 Home
  📊 My Analyses
  📐 Pattern Library
TOOLS
  🔍 Analyze Design
  🎨 Creative Studio
  ⚖️ Compare Designs
────────────
  ⚙️ Settings
  👤 Profile
```

- **Expanded:** icon + label, ~240px
- **Collapsed:** icon-only rail, ~64px
- **Active state:** 4px left accent bar + background highlight

### Screen Layouts (6 screens mapped)
| Screen | Layout | Key Pattern |
|--------|--------|-------------|
| **Home** | Hero upload CTA + quick actions + recent analyses grid | Like Krea "1/3 size home" |
| **Analyze** | Upload zone → side-by-side (image + DNA accordion results) | Progressive disclosure |
| **Creative Studio** | 3-panel: Source (left) + Workspace (center) + Output (right) | Krea tool pattern |
| **Compare** | 4-slot selector + comparison matrix + winning formula | Card selection picker |
| **Pattern Library** | Grid/List toggle, search, cards with context menu | Clean grid |
| **My Analyses** | Grid/List toggle, search, cards with context menu | Mirror Pattern Library |

### Interaction Patterns
- **Upload:** Drag & drop + click, dashed border, format hints, preview
- **Loading:** Progress bars (determinate), skeleton cards, inline spinners
- **Empty states:** Icon + message + CTA for each screen
- **Error states:** Banner (API key), toast (API failure), overlay (offline)
- **Menus:** 3-dot [⋮] context menus on cards

### Cross-Feature Navigation
12 quick-action links mapped (e.g., Analyze → "Use in Studio", Compare → "Save as Pattern").

---

## 3. Architecture (from ARCHITECTURE.md)

### Current State
- **God Component:** `App.tsx` = 1,307 LOC (6 inline components + state + routing)
- **Single CSS:** `index.css` = 109 LOC, all dark-mode hardcoded
- **No router:** Navigation via `useState<Screen>` — no URLs, no back/forward
- **Tailwind v4:** Token names already semantic — swap values, keep names

### Restructuring Plan

**New Architecture:**
```
components/
├── layout/     AppShell, Sidebar, SidebarNavItem, ContentArea
├── shared/     Button, Card, Input, Modal, UploadZone, EmptyState, ErrorBanner, Badge
└── screens/    AnalyzeScreen, AnalysisResultsScreen, CompareScreen, CreativeStudio, etc.
contexts/       AuthContext (keep), ThemeContext (new)
styles/         tokens.css, reset.css, globals.css, utilities.css
```

**CSS Token Strategy:** 3-layer system
1. **Primitives** — raw hex values (`--primitive-gray-800: #262626`)
2. **Semantic** — theme-aware (`--color-bg-base: var(--primitive-gray-50)`)
3. **Component** — per-component (`--sidebar-width: 260px`)

**Theme switching:** `data-theme` attribute on `<html>`, CSS handles runtime swap.

**Routing:** React Router v7 with named routes (`/analyze`, `/studio`, `/compare`, etc.)

### Build Order (10 phases)
```
Phase 1: Design Tokens → Phase 2: CSS Reset & Globals → Phase 3: Tailwind Theme Swap
→ Phase 4: Shared Components → Phase 5: AppShell + Sidebar → Phase 6: React Router
→ Phase 7: Screen Extraction → Phase 8: Screen Redesign (per-screen)
→ Phase 9: Theme Context → Phase 10: Auth Screens Redesign
```

**Key insight:** Phase 3 (token swap) is the "visual flip" — app goes light. No JSX changes needed because token names stay same.

---

## 4. Pitfalls (from PITFALLS.md)

### Top 5 Dangers
| # | Pitfall | Phase | Mitigation |
|---|---------|-------|------------|
| P1 | Big-bang CSS rewrite | Foundation | Token swap, NOT CSS rewrite. Values change, names don't. |
| P2 | Logic loss during restructuring | Layout | Extract business logic to hooks BEFORE moving JSX. |
| P3 | Dark→light depth mismatch | Foundation | Design light mode from scratch, don't "invert" dark. |
| P4 | Navigation change breaks mental model | Layout | Map all old flows → new sidebar. Keep feature names identical. |
| P5 | Auth flow breaks with layout change | Layout | Auth boundary ABOVE sidebar. Test immediately after layout change. |

### Phase Risk Map
| Phase | Risk | Critical Pitfalls |
|-------|------|-------------------|
| Foundation (tokens) | 🔴 CRITICAL | P1, P3, P7, P15 |
| Layout/Navigation | 🔴 CRITICAL | P2, P4, P5, P9, P10, P11 |
| Screen Redesigns | 🟡 MODERATE | P2, P6, P7, P8, P9, P12 |
| Shared Components | 🟡 MODERATE | P3, P8, P14 |
| Final Polish | 🟢 LOW | P6, P11, P13, P15 |

### Golden Rule
> "Keep app working at every commit. Foundation first, screen-by-screen migration, verify after each screen."

---

## 5. Synthesis: Recommended Roadmap Structure

Based on architecture build order + pitfall phase risks:

| Phase | Name | What | Risk | Est. |
|-------|------|------|------|------|
| 71 | Design System Foundation | tokens.css + reset + globals + tailwind swap | 🔴 HIGH | Medium |
| 72 | Shared UI Components | Button, Card, Input, Modal, UploadZone, EmptyState, ErrorBanner, Badge | 🟡 MED | Medium |
| 73 | App Shell & Sidebar | AppShell + Sidebar + ContentArea + collapsible | 🔴 HIGH | Medium |
| 74 | React Router & Navigation | Install router, refactor App.tsx, wire sidebar to routes | 🔴 HIGH | Large |
| 75 | Screen Extraction | Extract inline components from App.tsx to screens/ | 🟡 MED | Large |
| 76 | Home & Onboarding Screen | Home dashboard screen redesign | 🟡 MED | Small |
| 77 | Analyze Screen Redesign | Upload + Analyzing + Results screens redesigned | 🟡 MED | Large |
| 78 | Creative Studio Redesign | 3-panel layout redesign (most complex) | 🔴 HIGH | Large |
| 79 | Compare Screen Redesign | Selection + matrix + winning formula redesign | 🟡 MED | Medium |
| 80 | Pattern Library & My Analyses | Grid/list views + context menus + detail views | 🟡 MED | Medium |
| 81 | Settings & Auth Screens | Settings full-page + Login/Register redesign | 🟢 LOW | Small |
| 82 | Theme Toggle & Dark Mode | ThemeContext, toggle in sidebar, prefers-color-scheme | 🟢 LOW | Small |
| 83 | Polish & Verification | CSS cleanup, accessibility audit, responsive testing | 🟢 LOW | Small |

---

## 6. Key Decisions to Make

### Already Decided (from user)
- ✅ Left sidebar navigation
- ✅ Krea AI-inspired style  
- ✅ All 6 features preserved
- ✅ No new features in v3.0

### Need Decision
1. **Dark mode toggle?** Krea is dark-first but has toggle. DesignDNA current is dark-only. → **Propose:** Light-first + dark mode toggle (Phase 82)
2. **Font:** Inter (free Suisse Intl alternative) vs keep current? → **Propose:** Inter
3. **Router:** React Router v7 vs keep useState? → **Propose:** React Router v7 (enables URLs, back/forward, deep links)
4. **Collapse sidebar on mobile?** → **Propose:** Yes, collapse to bottom nav on mobile

---

*Synthesized from 4 parallel research agents — 2026-03-17*
