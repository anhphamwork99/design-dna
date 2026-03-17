# Phase 16: App Shell & Sidebar - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the current `LandingScreen` + `useState<Screen>` navigation with a persistent sidebar layout + React Router v7 URL-based navigation. Create `AppShell` (sidebar + content area wrapper), `Sidebar` component with 3 zones, and wire route definitions. This phase creates the **structural shell** only — individual screen content is redesigned in Phases 18-23.

</domain>

<decisions>
## Implementation Decisions

### Sidebar Structure
- **Default state:** Expanded (240px, icon + label). Always starts expanded.
- **3 zones with section labels + thin dividers:**
  - WORKSPACE: Home, Library (gộp My Analyses + Pattern Library)
  - TOOLS: Studio (first), Analyze, Compare
  - FOOTER: Settings, Sign Out (pushed to bottom via spacer)
- **Section labels:** Muted, uppercase, small text (e.g., "WORKSPACE", "TOOLS")
- **Collapse toggle:** Chevron at top-right of sidebar (`«` when expanded, `»` when collapsed)
- **Collapsed width:** 64px, icon-only
- **Active item indicator:** Dark gray 4px left accent bar + background highlight + bold text. Use `--color-text-secondary` or similar dark gray token — NOT black, NOT brand color.

### Sidebar ↔ Content Layout
- **Push content model:** Sidebar occupies real layout space (flexbox column). Content area expands/contracts with sidebar width. Not overlay.
- **Smooth CSS transition:** `width` + `margin-left` transition ~200-300ms ease. Labels fade in/out during collapse/expand.
- **Right border:** Thin 1px solid using `--color-border` token. Clean separation.
- **Background:** Same white background for both sidebar and content area (`--color-bg-primary`). Border is the only visual separator.

### Logo
- **Typography logo** "DesignDNA" using **Dancing Script** (Google Fonts, variable weight)
- Placed at top of sidebar, above WORKSPACE section
- Pair: Dancing Script (logo only) + Inter (all UI text)
- Load via Google Fonts preconnect (same as Inter setup)

### Mobile Responsive
- **Desktop only** for Phase 16. No mobile responsive behavior.
- Mobile sidebar/bottom nav deferred to future phase if needed.

### Landing Screen Retirement
- **`/` route → Home screen** (placeholder in this phase, full dashboard in Phase 18)
- Placeholder Home: Simple page with basic welcome text or "Coming soon" — enough to verify routing works
- **LandingScreen component removed** — all navigation moves to sidebar
- Feature cards from LandingScreen are NOT preserved — Home dashboard (Phase 18) will be designed fresh

### Router & Auth
- **React Router v7** (`react-router-dom` v7) — install in this phase
- **Auth wrapper ABOVE Router:** Unauthenticated → Login/Register only. Authenticated → `<AppShell>` wrapping all routes.
- **Routes to wire:** `/` (Home), `/library` (Library — gộp analyses + patterns), `/studio`, `/analyze`, `/compare`, `/settings`
- **`document.title` update** on route change (accessibility requirement)

### App.tsx Refactor Depth
- **Agent's Discretion:** Agent decides how much to decompose App.tsx in this phase vs deferring to Phase 17 (Router & Screen Extraction). The key constraint is: routing must work, sidebar must navigate, existing screens must remain functional.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/shared/` — 9 components (Button, Card, Input, Modal, Badge, UploadZone, EmptyState, ErrorBanner, LoadingSpinner) ready to use in sidebar/shell
- `contexts/AuthContext` — existing auth context with `useAuth()` hook, `user`, `session`, `signOut`
- `index.css` — design tokens in `@theme` block, achromatic palette, Inter font already configured

### Established Patterns
- Single-file CSS architecture (`index.css` with `@theme` + Tailwind v4) — no separate token files
- Tailwind v4 utility classes for styling
- Motion/React for animations (`framer-motion` already installed)
- Lucide React for icons

### Integration Points
- `App.tsx` (1,306 LOC) — current god component. Contains all state, inline LandingScreen, screen switching via `useState<Screen>`
- `LoginScreen.tsx` / `RegisterScreen.tsx` — separate files, will be rendered outside AppShell
- `SettingsModal.tsx` — currently modal, will become route `/settings` in future phase
- `CreativeStudio.tsx`, `CompareScreens.tsx`, `PatternLibrary.tsx`, `PatternDetail.tsx`, `MyAnalysesList.tsx` — existing screen components that need to be wired to routes

</code_context>

<specifics>
## Specific Ideas

- Sidebar inspired by **Krea AI** — clean, achromatic, expanded by default, thin border separator
- Logo "DesignDNA" in Dancing Script — artistic handwritten feel contrasting with clean Inter UI
- Library concept: single sidebar item that combines both analyses and patterns (details in Phase 22)
- Tool ordering reflects user priority: Studio first (primary creative tool), then Analyze, then Compare

</specifics>

<deferred>
## Deferred Ideas

- **Mobile responsive sidebar** — Desktop only for now. Bottom nav or collapsible hamburger for mobile deferred to future phase.
- **Library screen design** — Gộp My Analyses + Pattern Library into single "Library" with tabs/filters. Design deferred to Phase 22.
- **Settings as full page** (not modal) — Route exists (`/settings`) but SettingsModal stays as-is until Phase 23.

</deferred>

---

*Phase: 16-app-shell-sidebar*
*Context gathered: 2026-03-17*
