# Architecture — CSS & Component Restructuring

**Project:** DesignDNA v3.0 Redesign  
**Researched:** 2026-03-17  
**Researcher:** Architecture Agent

---

## 1. Current Codebase Analysis

### File Structure (as-is)

```
app/src/
├── App.tsx              (1,307 lines — GOD COMPONENT)
├── CreativeStudio.tsx   (1,063 lines)
├── CompareScreens.tsx   (578 lines — 3 components exported)
├── PatternLibrary.tsx   (177 lines)
├── PatternDetail.tsx    (265 lines)
├── LoginScreen.tsx      (155 lines)
├── RegisterScreen.tsx   (≈175 lines)
├── api.ts               (utility — thumbnail generation)
├── apiClient.ts         (API calls to backend)
├── index.css            (109 lines — ALL styles, dark theme)
├── main.tsx             (14 lines — entry point)
├── components/
│   ├── MyAnalysesList.tsx  (152 lines)
│   └── SettingsModal.tsx   (259 lines)
├── contexts/
│   └── AuthContext.tsx     (auth context provider)
├── hooks/
│   └── useMigratePatterns.ts (migration hook)
└── lib/
    └── supabase.ts         (Supabase client init)
```

**Stats:** 15 source files, ~6,500 LOC TypeScript

### Critical Issues Found

| Issue | Severity | Impact on Redesign |
|-------|----------|-------------------|
| **God Component: App.tsx** | 🔴 Critical | 1,307 lines. Contains 6 inline components (LandingScreen, UploadScreen, AnalyzingScreen, ResultsScreen, ViewAnalysisScreen) + all app state + all screen routing. Must be decomposed. |
| **Single CSS file** | 🔴 Critical | 109 lines, all dark-mode hardcoded. No separation of tokens/layout/component styles. Every color is dark-mode specific — cannot toggle themes. |
| **No router** | 🟡 Major | Navigation via `useState<Screen>` with 12 screen states. No URL support, no back/forward, no deep linking. Sidebar navigation requires proper routing. |
| **Inline styles via Tailwind** | 🟡 Major | Components use Tailwind utility classes extensively with hardcoded dark-mode colors (e.g., `bg-bg-surface1`). Theme tokens ARE used via `@theme` but colors are dark-only. |
| **Flat file structure** | 🟠 Moderate | No separation between layout, shared, and screen components. Screen components scattered at root level. |
| **Tightly coupled screen components** | 🟠 Moderate | Screens defined inline in App.tsx share parent state via prop drilling. Extracting them requires lifting state or adding context. |

### Current Tailwind + CSS Variables Approach

The app uses **Tailwind CSS v4** with `@theme` directive defining CSS custom properties:

```css
@theme {
  --color-bg-base: #0B0F19;
  --color-bg-surface1: #111827;
  --color-text-primary: rgba(255, 255, 255, 0.92);
  --color-accent: #0096ED;
  /* ... all dark-mode values */
}
```

**Key insight:** The token naming convention (`bg-base`, `text-primary`, `accent`, etc.) is already **semantic** — not `dark-blue-900`. This means we can swap values to light-mode without renaming tokens. This is a huge advantage.

---

## 2. CSS Architecture Strategy

### 2.1 Design Tokens — Three-Layer System

Adopt a **primitive → semantic → component** token hierarchy:

```css
/* ─── Layer 1: Primitives (raw palette values) ─── */
:root {
  /* From Krea AI design system extraction */
  --primitive-white: #FFFFFF;
  --primitive-gray-50: #FAFAFA;
  --primitive-gray-100: #F5F5F5;
  --primitive-gray-200: #E5E5E5;
  --primitive-gray-300: #D4D4D4;
  --primitive-gray-400: #A3A3A3;
  --primitive-gray-500: #737373;
  --primitive-gray-600: #525252;
  --primitive-gray-700: #404040;
  --primitive-gray-800: #262626;
  --primitive-gray-900: #171717;
  --primitive-black: #000000;
  --primitive-blue-500: #0096ED;
  --primitive-purple-500: #7C3AED;
  /* ... spacing, radii, etc. */
}

/* ─── Layer 2: Semantic tokens (theme-aware) ─── */
:root, [data-theme="light"] {
  --color-bg-base: var(--primitive-gray-50);
  --color-bg-surface1: var(--primitive-white);
  --color-bg-surface2: var(--primitive-gray-100);
  --color-bg-surface3: var(--primitive-gray-200);
  --color-border-default: var(--primitive-gray-200);
  --color-border-hover: var(--primitive-gray-300);
  --color-text-primary: var(--primitive-gray-900);
  --color-text-secondary: var(--primitive-gray-500);
  --color-text-tertiary: var(--primitive-gray-400);
  --color-accent: var(--primitive-blue-500);
  /* ... */
}

[data-theme="dark"] {
  --color-bg-base: #0B0F19;
  --color-bg-surface1: #111827;
  --color-text-primary: rgba(255, 255, 255, 0.92);
  /* ... current dark values preserved */
}

/* ─── Layer 3: Component tokens (optional, per-component) ─── */
.sidebar {
  --sidebar-width: 260px;
  --sidebar-bg: var(--color-bg-surface1);
  --sidebar-item-hover: var(--color-bg-surface2);
}
```

### 2.2 Theme Switching Strategy

**Approach:** `data-theme` attribute on `<html>` element.

```tsx
// ThemeContext.tsx
const toggleTheme = () => {
  const next = theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  setTheme(next);
};
```

**Why this approach:**
- Zero JS framework dependency — works with pure CSS
- `prefers-color-scheme` media query for initial detection
- `data-theme` attribute overrides for user preference
- Tailwind `@theme` tokens automatically consumed by utility classes
- No re-render required — CSS handles everything at runtime

### 2.3 CSS File Organization

```
app/src/styles/
├── tokens.css          ← Design tokens (primitives + semantic + component)
├── reset.css           ← Modern reset (Josh Comeau style)
├── globals.css         ← Body, typography, scrollbar, global animations
├── utilities.css       ← Custom utilities (ai-gradient, shimmer, etc.)
└── components/         ← Per-component styles (only when needed)
    ├── sidebar.css
    └── ...
```

**Main entry:** `index.css` imports in order:

```css
@import './styles/reset.css';
@import './styles/tokens.css';
@import './styles/globals.css';
@import './styles/utilities.css';
@import "tailwindcss";
```

### 2.4 Tailwind v4 Strategy

**Keep Tailwind utility classes** — they're already deeply embedded. Strategy:

1. **Replace `@theme` values** with new light-first tokens
2. **Keep utility class usage** (`bg-bg-surface1`, `text-text-primary`, etc.)
3. **Token names stay the same** — values change per theme
4. **Add `data-theme="dark"` override** for dark mode toggle

This means **zero changes to existing JSX className strings** for the token swap. Only the CSS values behind them change.

---

## 3. Component Restructuring Plan

### 3.1 Decomposition Map: App.tsx → Multiple Files

**Current App.tsx contains:**

| Inline Component | Lines | Action |
|-----------------|-------|--------|
| `App` (main) | 1-465 | Keep + refactor to use Router |
| `LandingScreen` | 469-522 | → Remove (replaced by sidebar navigation) |
| `UploadScreen` | 524-629 | → `screens/AnalyzeScreen.tsx` |
| `AnalyzingScreen` | 631-741 | → Merge into AnalyzeScreen (sub-state) |
| `ResultsScreen` | 743-1233 | → `screens/AnalysisResultsScreen.tsx` |
| `ViewAnalysisScreen` | 1235-1306 | → Merge into AnalysisResultsScreen (mode) |

### 3.2 New Component Architecture

```
app/src/
├── components/
│   ├── layout/                    ← App shell
│   │   ├── AppShell.tsx           ← Sidebar + Content wrapper
│   │   ├── Sidebar.tsx            ← Left navigation
│   │   ├── SidebarNavItem.tsx     ← Nav item component
│   │   └── ContentArea.tsx        ← Main content container
│   ├── shared/                    ← Reusable UI primitives
│   │   ├── Button.tsx             ← Primary, secondary, ghost variants
│   │   ├── Card.tsx               ← Surface card with border
│   │   ├── Input.tsx              ← Text input with label
│   │   ├── Modal.tsx              ← Generic modal wrapper
│   │   ├── UploadZone.tsx         ← Drag & drop upload
│   │   ├── LoadingSpinner.tsx     ← Loading states
│   │   ├── EmptyState.tsx         ← Empty state placeholder
│   │   ├── ErrorBanner.tsx        ← Error display
│   │   └── Badge.tsx              ← Tag/badge component
│   └── screens/                   ← Feature screens (rendered in ContentArea)
│       ├── AnalyzeScreen.tsx      ← Upload + Analyzing (merged)
│       ├── AnalysisResultsScreen.tsx  ← Results display + View saved
│       ├── CompareScreen.tsx      ← Upload + Analyzing + Results (merged)
│       ├── CreativeStudioScreen.tsx   ← Generation workspace
│       ├── PatternLibraryScreen.tsx   ← Pattern list
│       ├── PatternDetailScreen.tsx    ← Single pattern view
│       ├── MyAnalysesScreen.tsx       ← Saved analyses list
│       └── SettingsScreen.tsx         ← Settings (from modal → full screen)
├── contexts/
│   ├── AuthContext.tsx             ← Keep existing
│   └── ThemeContext.tsx            ← New: theme switching
├── hooks/
│   ├── useMigratePatterns.ts      ← Keep existing
│   └── useAnalysis.ts             ← New: extract analysis logic from App.tsx
├── lib/
│   └── supabase.ts                ← Keep existing
├── api.ts                         ← Keep
├── apiClient.ts                   ← Keep
├── App.tsx                        ← Slim: Router + AppShell only
├── main.tsx                       ← Keep (add ThemeProvider)
└── styles/                        ← CSS architecture
    ├── tokens.css
    ├── reset.css
    ├── globals.css
    └── utilities.css
```

### 3.3 Key Restructuring Decisions

| Decision | Rationale |
|----------|-----------|
| **Remove LandingScreen** | Sidebar replaces feature-selection landing page. All features accessible from sidebar always. |
| **Settings: Modal → Screen** | Krea AI pattern: Settings is a sidebar-accessible screen, not a floating modal. Simpler UX. |
| **Merge Upload + Analyzing** | These are sub-states of the same user flow. One screen component manages upload → analyzing → results transition. |
| **Extract shared components** | Button, Card, Input, Modal patterns appear 20+ times across codebase. Extract once, use everywhere. |
| **AppShell pattern** | `<AppShell>` wraps `<Sidebar>` + `<ContentArea>`. All screens render inside ContentArea. Auth screens bypass AppShell. |

---

## 4. State Management & Routing

### 4.1 URL-Based Routing with React Router

**Install:** `react-router-dom` v7

```tsx
// App.tsx — slim version
function App() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <AuthRoutes />;

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/analyze" />} />
        <Route path="/analyze" element={<AnalyzeScreen />} />
        <Route path="/analyze/:id" element={<AnalysisResultsScreen />} />
        <Route path="/compare" element={<CompareScreen />} />
        <Route path="/studio" element={<CreativeStudioScreen />} />
        <Route path="/patterns" element={<PatternLibraryScreen />} />
        <Route path="/patterns/:id" element={<PatternDetailScreen />} />
        <Route path="/analyses" element={<MyAnalysesScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
      </Routes>
    </AppShell>
  );
}
```

### 4.2 State Migration

| Current State | Location | Migration |
|---------------|----------|-----------|
| `currentScreen` | App.tsx useState | → React Router `pathname` |
| `uploadedImage` | App.tsx useState | → AnalyzeScreen local state |
| `analysisResult` | App.tsx useState | → AnalyzeScreen local state OR URL param (`:id`) |
| `compareImages` | App.tsx useState | → CompareScreen local state |
| `compareResult` | App.tsx useState | → CompareScreen local state |
| `selectedPatternId` | App.tsx useState | → URL param (`:id`) |
| `viewingAnalysisId` | App.tsx useState | → URL param (`:id`) |
| `isSettingsOpen` | App.tsx useState | → Route `/settings` |
| `authScreen` | App.tsx useState | → Separate auth routes |
| `error` | App.tsx useState | → Per-screen local state |

**Key insight:** Most state was at App level only because App managed screen routing. With React Router, each screen manages its own state. App.tsx shrinks from 1,307 to ~50 lines.

---

## 5. Build Order (Phased Approach)

### Critical Dependency Chain

```
tokens.css → reset/globals → AppShell/Sidebar → Router → Individual Screens
    ↑                            ↑                  ↑
    │                            │                  │
Design System             Layout Foundation     Navigation
Extraction                                     Infrastructure
```

### Phase Breakdown

| Phase | What | Dependencies | Risk |
|-------|------|-------------|------|
| **Phase 1: Design Tokens** | Create `tokens.css` from Krea AI extraction. Light-first semantic tokens via CSS custom properties. | Krea AI design system extraction (SPAWN-01) | Low — additive, no breaking changes |
| **Phase 2: CSS Reset & Globals** | Add `reset.css`, `globals.css`, `utilities.css`. Migrate animations from `index.css`. | Phase 1 done | Low — refactoring CSS only |
| **Phase 3: Tailwind Theme Swap** | Replace `@theme` values in `index.css` with new light-mode tokens. Add `[data-theme="dark"]` overrides. | Phase 1, 2 done | Medium — visual change but no code changes in components |
| **Phase 4: Shared Components** | Extract Button, Card, Input, Modal, UploadZone, EmptyState, ErrorBanner. | Phase 3 done (need correct tokens) | Low — new files, no breaking changes |
| **Phase 5: AppShell + Sidebar** | Create layout shell: Sidebar navigation + ContentArea. | Phase 4 done (uses shared components) | Medium — structural change to app layout |
| **Phase 6: React Router** | Install react-router-dom. Refactor App.tsx to use Routes. Wire sidebar NavItems to routes. | Phase 5 done | High — biggest breaking change. All screen references change. |
| **Phase 7: Screen Extraction** | Extract inline components from App.tsx to `screens/` folder. Wire to Router. | Phase 6 done | High — large code movement, but logic stays same |
| **Phase 8: Screen Redesign** | Redesign each screen one-by-one (Analyze, Compare, Studio, etc.) using new design system. | Phase 4-7 done | Medium per screen — can be done incrementally |
| **Phase 9: Theme Context** | Add ThemeContext, theme toggle in sidebar, `prefers-color-scheme` detection. | Phase 3 done (tokens ready) | Low — additive feature |
| **Phase 10: Auth Screens Redesign** | Redesign Login/Register with new design system. | Phase 4 done | Low — isolated screens |

### Migration Safety Strategy

**Principle: "Working app at every phase"**

1. **Phase 1-2 (CSS Setup):** Existing app keeps running. New CSS files are created alongside existing `index.css`. No import changes yet.
2. **Phase 3 (Token Swap):** This is the "visual flip" — app goes from dark to light. All component JSX stays untouched because token names don't change. Verify every screen still renders correctly.
3. **Phase 4-5 (Components + Layout):** New components are created. Existing components not yet touched. AppShell wraps existing content.
4. **Phase 6-7 (Router + Extraction):** Biggest risk phase. Do these together in a single focused effort. LandingScreen removal happens here.
5. **Phase 8 (Screen Redesign):** Each screen can be redesigned independently after routing works.

---

## 6. File Organization (Final Proposed)

```
app/src/
├── styles/
│   ├── tokens.css              ← 3-layer design tokens
│   ├── reset.css               ← Modern CSS reset
│   ├── globals.css             ← Body, typography, scrollbar
│   └── utilities.css           ← ai-gradient, shimmer, scan-line
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx        ← <Sidebar> + <ContentArea>
│   │   ├── Sidebar.tsx         ← Left nav with NavItems
│   │   ├── SidebarNavItem.tsx  ← Individual nav link
│   │   └── ContentArea.tsx     ← Main content wrapper
│   ├── shared/
│   │   ├── Button.tsx          ← Variants: primary, secondary, ghost
│   │   ├── Card.tsx            ← Surface card
│   │   ├── Input.tsx           ← Form input + label
│   │   ├── Modal.tsx           ← Dialog wrapper (still needed for confirms)
│   │   ├── UploadZone.tsx      ← Drag + drop zone
│   │   ├── LoadingSpinner.tsx  ← Consistent loading states
│   │   ├── EmptyState.tsx      ← Icon + title + description + CTA
│   │   ├── ErrorBanner.tsx     ← Error with retry
│   │   └── Badge.tsx           ← Tags and labels
│   └── screens/
│       ├── AnalyzeScreen.tsx
│       ├── AnalysisResultsScreen.tsx
│       ├── CompareScreen.tsx
│       ├── CreativeStudioScreen.tsx
│       ├── PatternLibraryScreen.tsx
│       ├── PatternDetailScreen.tsx
│       ├── MyAnalysesScreen.tsx
│       └── SettingsScreen.tsx
├── contexts/
│   ├── AuthContext.tsx          ← Existing (keep)
│   └── ThemeContext.tsx         ← New: light/dark toggle
├── hooks/
│   ├── useMigratePatterns.ts   ← Existing (keep)
│   └── useAnalysis.ts          ← New: analysis flow state machine
├── lib/
│   └── supabase.ts             ← Existing (keep)
├── api.ts                      ← Existing (keep)
├── apiClient.ts                ← Existing (keep)
├── App.tsx                     ← Slim: ~50 lines (Router + Auth gate)
├── AuthRoutes.tsx              ← Login/Register routing
├── main.tsx                    ← Entry (add ThemeProvider + BrowserRouter)
└── index.css                   ← Entry point: imports all styles/ files
```

**File count:** ~30 source files (from 15). More files but each is focused and small.

---

## 7. Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| **Token swap breaks visual state** | Medium | Test every screen after Phase 3. Screenshot comparison. |
| **Router migration breaks navigation** | Medium | Do Phase 6-7 in one sprint. Full flow test before continuing. |
| **CreativeStudio complexity** | High | This 1,063-line component has complex internal state machine. Redesign last, touch minimally during restructure. |
| **Tailwind class conflicts** | Low | Token names don't change — only values behind them. |
| **Missing design tokens** | Low | Krea AI extraction (SPAWN-01) runs in parallel, provides complete token set. |

---

## Sources

| Source | Topic | Confidence |
|--------|-------|------------|
| Codebase analysis (direct) | App.tsx, index.css, all components | 🟢 High |
| [frontendtools.tech — CSS Variables Guide](https://www.frontendtools.tech/blog/css-variables-guide-design-tokens-theming-2025) | Design tokens with CSS custom properties | 🟢 High |
| [superflex.ai — CSS Architecture](https://www.superflex.ai/blog/css-architecture) | BEM → Tailwind → Tokens evolution | 🟢 High |
| [UXPin — Managing Global Styles with Design Tokens](https://www.uxpin.com/studio/blog/managing-global-styles-in-react-with-design-tokens/) | Token → CSS variable strategy | 🟢 High |
| [namastedev.com — Dark Mode with CSS Variables](https://namastedev.com/blog/implementing-dark-mode-in-react-with-css-variables-and-context-api/) | data-theme attribute strategy | 🟡 Medium |
| [css-tricks.com — Easy Dark Mode in React](https://css-tricks.com/easy-dark-mode-and-multiple-color-themes-in-react/) | data-theme + CSS variables pattern | 🟡 Medium |
| [stevekinney.com — Framework Migration Patterns](https://stevekinney.com/courses/enterprise-ui/framework-migration-patterns) | Phased migration strategy | 🟡 Medium |
| [Medium — Design Tokens with CSS Custom Properties](https://medium.com/design-bootcamp/simple-design-tokens-with-css-custom-properties-7ab69b71d8ad) | Token naming conventions | 🟡 Medium |
