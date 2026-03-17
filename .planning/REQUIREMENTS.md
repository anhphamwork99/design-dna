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

### STYLE — Design System Foundation

| ID | Requirement | Notes |
|----|-------------|-------|
| STYLE-01 | Create design tokens as CSS custom properties — colors, typography, spacing, radius, shadows, transitions | From DESIGN-SYSTEM.md extraction |
| STYLE-02 | Swap Tailwind `@theme` values from dark to light palette — semantic names unchanged | Zero JSX changes needed |
| STYLE-03 | Add CSS reset (Josh Comeau style) + globals (body, typography, scrollbar) | Separate files in `styles/` |
| STYLE-04 | Organize CSS into `styles/tokens.css`, `reset.css`, `globals.css`, `utilities.css` | Import order matters |
| STYLE-05 | Use Inter font (Google Fonts variable) — replace current font stack | Single family for all text |
| STYLE-06 | Achromatic color palette — grayscale only, no brand hue | Krea AI pattern |

### LAYOUT — App Shell & Navigation

| ID | Requirement | Notes |
|----|-------------|-------|
| LAYOUT-01 | Create `AppShell` component — sidebar + content area wrapper | Replaces landing screen |
| LAYOUT-02 | Create `Sidebar` — expanded (240px icon+label) and collapsed (64px icon-only) | Toggle button at top |
| LAYOUT-03 | Sidebar sections: WORKSPACE (Home, My Analyses, Pattern Library) + TOOLS (Analyze, Studio, Compare) + FOOTER (Settings, Profile) | 3-zone grouping |
| LAYOUT-04 | Active sidebar item — left accent bar (4px) + bg highlight + bold text | Krea active state pattern |
| LAYOUT-05 | Sidebar collapse on mobile (≤768px) → hamburger or bottom nav | Responsive |
| LAYOUT-06 | Remove `LandingScreen` — all features accessible from sidebar | No more feature-selection landing |

### ROUTER — Navigation Infrastructure

| ID | Requirement | Notes |
|----|-------------|-------|
| ROUTER-01 | Install `react-router-dom` v7 | Named routes |
| ROUTER-02 | Routes: `/` (redirect to `/analyze`), `/analyze`, `/analyze/:id`, `/studio`, `/compare`, `/patterns`, `/patterns/:id`, `/analyses`, `/settings` | URL-based nav |
| ROUTER-03 | Refactor `App.tsx` from 1,307 LOC god component to ~50 LOC (Router + Auth gate) | Decompose |
| ROUTER-04 | Auth boundary ABOVE AppShell — unauthenticated → Login, authenticated → AppShell+Routes | Keep auth gate |
| ROUTER-05 | `document.title` update on every route change | Accessibility |

### SHARED — Reusable UI Components

| ID | Requirement | Notes |
|----|-------------|-------|
| SHARED-01 | `Button` — primary (black bg), secondary (gray bg), ghost (transparent), icon-only (circular) | 4 variants |
| SHARED-02 | `Card` — surface card with subtle border, rounded corners (16px), hover state | Base card |
| SHARED-03 | `Input` — text input with label, placeholder, error state | Form input |
| SHARED-04 | `Modal` — centered overlay with backdrop blur(24px), 16px radius, close button | Generic modal |
| SHARED-05 | `UploadZone` — drag & drop with dashed border, preview, format hints, validation | Image upload |
| SHARED-06 | `EmptyState` — icon + title + description + CTA button | Per-screen empty experience |
| SHARED-07 | `ErrorBanner` — error message with optional retry button | API/network errors |
| SHARED-08 | `LoadingSpinner` — consistent spinner + skeleton card pattern | Loading states |
| SHARED-09 | `Badge` — small pill with label | Tags, status |

### SCREEN — Screen Extraction & Redesign

| ID | Requirement | Notes |
|----|-------------|-------|
| SCREEN-01 | Extract 6 inline components from `App.tsx` into `screens/` folder | Decompose god component |
| SCREEN-02 | **Home** — hero upload CTA + quick action cards (3) + recent analyses grid | Dashboard |
| SCREEN-03 | **AnalyzeScreen** — upload zone → analyzing progress → side-by-side results (image + DNA accordion) | 3-state flow |
| SCREEN-04 | **CreativeStudioScreen** — 3-panel (Source + Workspace + Output) | Most complex |
| SCREEN-05 | **CompareScreen** — 4-slot selector + comparison matrix + winning formula card | Selection + results |
| SCREEN-06 | **PatternLibraryScreen** — grid/list toggle, search, cards with context menu [⋮] | Browse patterns |
| SCREEN-07 | **MyAnalysesScreen** — grid/list toggle, search, cards with context menu [⋮] | Browse analyses |
| SCREEN-08 | **SettingsScreen** — full page (not modal), API key + account section | From modal → screen |

### AUTH — Auth Screens Redesign

| ID | Requirement | Notes |
|----|-------------|-------|
| AUTH-01 | Redesign `LoginScreen` with new design system | Light theme |
| AUTH-02 | Redesign `RegisterScreen` with new design system | Light theme |

### UX — Interaction Patterns

| ID | Requirement | Notes |
|----|-------------|-------|
| UX-01 | Context menus [⋮] on cards — View, Use in Studio, Compare, Delete | Consistent actions |
| UX-02 | Fullscreen image lightbox — click image → overlay with download + close | Modal viewer |
| UX-03 | Cross-feature quick actions — 12 links mapped (Analyze→Studio, Compare→Save Pattern, etc.) | Navigation shortcuts |
| UX-04 | All empty states designed per screen with icon + message + CTA | Onboarding experience |
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
