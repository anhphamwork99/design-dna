# v3.0 Requirements — UI Redesign

**Milestone:** v3.0 — UI Redesign (Krea AI-inspired)
**Created:** 2026-03-17
**Status:** Active

---

## Decisions

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| D1 | Dark mode | ❌ Light only | Simplicity. No ThemeContext, no dual token layer. |
| D2 | Font | Inter (variable) | Free Suisse Intl alternative, supports weight 450 |
| D3 | Router | React Router v7 | URLs, back/forward, deep links |
| D4 | Mobile sidebar | Collapse to bottom nav | Standard mobile UX pattern |

---

## Requirements

### STYLE — Design System Foundation ✅

| ID | Requirement | Notes |
|----|-------------|-------|
| ~~STYLE-01~~ | ~~Create design tokens as CSS custom properties~~ | ✅ `styles/tokens.css` |
| ~~STYLE-02~~ | ~~Swap Tailwind `@theme` values from dark to light palette~~ | ✅ Token names preserved |
| ~~STYLE-03~~ | ~~Add CSS reset + globals~~ | ✅ `styles/reset.css`, `styles/globals.css` |
| ~~STYLE-04~~ | ~~Organize CSS into `styles/` folder~~ | ✅ 4 files + import-only entry |
| ~~STYLE-05~~ | ~~Use Inter font (Google Fonts variable)~~ | ✅ Variable 100-900 weight |
| ~~STYLE-06~~ | ~~Achromatic color palette~~ | ✅ Grayscale only |

### LAYOUT — App Shell & Navigation ✅ (5/6)

| ID | Requirement | Notes |
|----|-------------|-------|
| ~~LAYOUT-01~~ | ~~Create `AppShell` component — sidebar + content area wrapper~~ | ✅ Replaces landing screen |
| ~~LAYOUT-02~~ | ~~Create `Sidebar` — expanded (240px icon+label) and collapsed (64px icon-only)~~ | ✅ Toggle button at top |
| ~~LAYOUT-03~~ | ~~Sidebar sections: WORKSPACE (Home, Library) + TOOLS (Studio, Analyze, Compare) + FOOTER (Settings, Sign Out)~~ | ✅ 3-zone grouping |
| ~~LAYOUT-04~~ | ~~Active sidebar item — bg highlight + bold text~~ | ✅ Modified: no left border (user decision) |
| LAYOUT-05 | Sidebar collapse on mobile (≤768px) → hamburger or bottom nav | ⏭️ Deferred (desktop only) |
| ~~LAYOUT-06~~ | ~~Remove `LandingScreen` — all features accessible from sidebar~~ | ✅ Removed |

### ROUTER — Navigation Infrastructure (2/5)

| ID | Requirement | Notes |
|----|-------------|-------|
| ~~ROUTER-01~~ | ~~Install `react-router-dom` v7~~ | ✅ v7.13.1 |
| ~~ROUTER-02~~ | ~~Routes: `/`, `/analyze`, `/studio`, `/compare`, `/library`, `/library/pattern/:id`, `/library/analysis/:id`~~ | ✅ URL-based nav |
| ROUTER-03 | Refactor `App.tsx` from 1,307 LOC god component to ~50 LOC (Router + Auth gate) | Decompose |
| ROUTER-04 | Auth boundary ABOVE AppShell — unauthenticated → Login, authenticated → AppShell+Routes | Keep auth gate |
| ROUTER-05 | `document.title` update on every route change | Accessibility |

### SHARED — Reusable UI Components ✅

| ID | Requirement | Notes |
|----|-------------|-------|
| ~~SHARED-01~~ | ~~`Button` — primary, secondary, ghost, icon-only~~ | ✅ 4 variants, 3 sizes, loading |
| ~~SHARED-02~~ | ~~`Card` — surface card with border, hover~~ | ✅ 16px radius, keyboard support |
| ~~SHARED-03~~ | ~~`Input` — text input with label, error~~ | ✅ Helper text, accessible |
| ~~SHARED-04~~ | ~~`Modal` — centered overlay with backdrop blur~~ | ✅ Escape, scroll lock, animated |
| ~~SHARED-05~~ | ~~`UploadZone` — drag & drop with preview~~ | ✅ Compact mode, validation |
| ~~SHARED-06~~ | ~~`EmptyState` — icon + title + CTA~~ | ✅ Uses Button |
| ~~SHARED-07~~ | ~~`ErrorBanner` — error with retry~~ | ✅ Dismissible |
| ~~SHARED-08~~ | ~~`LoadingSpinner` — spinner + skeleton~~ | ✅ Spinner, Skeleton, SkeletonCard |
| ~~SHARED-09~~ | ~~`Badge` — small pill~~ | ✅ 5 semantic variants |

### SCREEN — Screen Extraction & Redesign

| ID | Requirement | Notes |
|----|-------------|-------|
| SCREEN-01 | Extract 6 inline components from `App.tsx` into `screens/` folder | Decompose god component |
| SCREEN-02 | **Home** — hero upload CTA + quick action cards (3) + recent analyses grid | Dashboard |
| SCREEN-03 | **AnalyzeScreen** — upload zone → analyzing progress → side-by-side results (image + DNA accordion) | 3-state flow |
| SCREEN-04 | **CreativeStudioScreen** — 3-panel (Source + Workspace + Output) | Most complex |
| ~~SCREEN-05~~ | ~~**CompareScreen** — 4-slot selector + comparison matrix + winning formula card~~ | ✅ Complete |
| ~~SCREEN-06~~ | ~~**PatternLibraryScreen** — grid/list toggle, search, cards with context menu [⋮]~~ | ✅ Complete |
| ~~SCREEN-07~~ | ~~**MyAnalysesScreen** — grid/list toggle, search, cards with context menu [⋮]~~ | ✅ Complete |
| SCREEN-08 | **SettingsScreen** — full page (not modal), API key + account section | From modal → screen |

### AUTH — Auth Screens Redesign

| ID | Requirement | Notes |
|----|-------------|-------|
| AUTH-01 | Redesign `LoginScreen` with new design system | Light theme |
| AUTH-02 | Redesign `RegisterScreen` with new design system | Light theme |

### UX — Interaction Patterns

| ID | Requirement | Notes |
|----|-------------|-------|
| ~~UX-01~~ | ~~Context menus [⋮] on cards — View, Use in Studio, Compare, Delete~~ | ✅ Complete |
| ~~UX-02~~ | ~~Fullscreen image lightbox — click image → overlay with download + close~~ | ✅ Complete |
| ~~UX-03~~ | ~~Cross-feature quick actions — 12 links mapped (Analyze→Studio, Compare→Save Pattern, etc.)~~ | ✅ Complete |
| ~~UX-04~~ | ~~All empty states designed per screen with icon + message + CTA~~ | ✅ Complete |
| UX-05 | Loading states — progress bars (determinate), skeleton cards, inline button spinners | Consistent loading |
| UX-06 | Error states — banner (API key), toast (API failure), overlay (offline) | Error handling |

### POLISH — Final Quality

| ID | Requirement | Notes |
|----|-------------|-------|
| POLISH-01 | CSS cleanup — remove all dead dark-mode styles after migration | Clean codebase |
| POLISH-02 | Accessibility — sidebar `role="navigation"`, focus management, keyboard shortcuts | a11y |
| POLISH-03 | Responsive testing — 375px, 768px, 1280px breakpoints | Mobile support |

---

## Totals

- **STYLE:** 6 requirements
- **LAYOUT:** 6 requirements
- **ROUTER:** 5 requirements
- **SHARED:** 9 requirements
- **SCREEN:** 8 requirements
- **AUTH:** 2 requirements
- **UX:** 6 requirements
- **POLISH:** 3 requirements

**Total: 45 requirements**

---

## Out of Scope (v3.0)

- Dark mode toggle — light only
- New features — redesign only
- Backend changes — no API changes
- Database schema changes — none
- New AI models — keep existing
