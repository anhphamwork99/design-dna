# State — DesignDNA v3.0

## Current

- **Milestone:** v3.0 — UI Redesign
- **Phase:** 17 — Router & Screen Extraction (NEXT)
- **Status:** Phase 16 complete. Ready to plan Phase 17.

## Milestone History

| Milestone | Phases | Status |
|-----------|--------|--------|
| v1.0 Full Feature App | 1–7 | ✅ Complete |
| v2.0 Backend System | 8–13 | ✅ Complete |
| v3.0 UI Redesign | 14–24 | 🔄 Active |

## Phase 16 Progress

### Plan 16-01: Layout Components ✅
- Installed react-router-dom@7.13.1
- Dancing Script font + `--font-logo` CSS token
- 3 layout components: Sidebar (142 LOC), SidebarNavItem (34 LOC), AppShell (23 LOC)
- Sidebar: 3 zones (WORKSPACE, TOOLS, FOOTER), collapse toggle, active state

### Plan 16-02: Wire Routes & Refactor App.tsx ✅
- BrowserRouter wraps app in main.tsx
- HomeScreen placeholder at `/`
- Routes: /, /analyze, /studio, /compare, /library, /library/pattern/:id, /library/analysis/:id
- Header removed, LandingScreen removed
- Analyze/Compare sub-flows stay as internal state
- UI polish: bolder logo, more spacing, subtle hover/active (user-approved)

## Phase 15 Results

- 9 shared UI components in `components/shared/`
- Button, Card, Input, Modal, Badge, UploadZone, EmptyState, ErrorBanner, LoadingSpinner

## Phase 14 Results

- CSS architecture: tokens, reset, globals, utilities
- Light mode Krea-inspired achromatic palette
- Inter font, import-only index.css

## Architecture Summary

**Current:** React + Vite + Supabase + Hono | React Router v7, sidebar nav
**Target:** Same stack, extract screens from App.tsx god component

## Key Models

- **Analysis:** gemini-3.1-pro-preview
- **Synthesis:** gemini-2.5-pro
- **Generation:** gemini-2.5-flash-image
- **Scoring:** gemini-3-flash-preview

## v3.0 Decisions

| Decision | Choice |
|----------|--------|
| Dark mode | ❌ Light only |
| Font | Inter (variable) + Dancing Script (logo) |
| Router | React Router v7 |
| Mobile sidebar | Deferred (desktop only for now) |
| Active state | bg highlight + bold (no left border) |

## Stopping Point

2026-03-17: Phase 16 complete (App Shell + Sidebar + React Router). Next: `/gsd:plan-phase 17` for Router & Screen Extraction.
