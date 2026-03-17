# Plan 16-02 Summary — Wire Router, Refactor App.tsx

**Phase:** 16-app-shell-sidebar
**Plan:** 02 (Wave 2)
**Status:** ✅ Complete
**Commits:**
- `feat(16-02): wire BrowserRouter, Routes, refactor App.tsx, remove header/landing`
- `fix(16-02): polish sidebar UI — bolder logo, more spacing, subtle active/hover states`

---

## What Was Built

### Task 1: BrowserRouter + Routes + App.tsx Refactor

**main.tsx** — Wrapped app with `<BrowserRouter>`
```
<StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
</StrictMode>
```

**HomeScreen.tsx** (19 lines) — Placeholder home dashboard
- Welcome text + document.title update
- Route: `/`

**App.tsx Refactor** (net -62 lines)
- Removed `<header>` (fixed top bar)
- Removed `LandingScreen` function (~53 lines)
- Removed `'landing'` from Screen type
- Wrapped authenticated content in `<AppShell>` + `<Routes>`
- Route mapping:
  - `/` → HomeScreen
  - `/analyze` → AnalyzeFlow (upload → analyzing → results, internal state)
  - `/studio` → CreativeStudio
  - `/compare` → CompareFlow (upload → analyzing → results, internal state)
  - `/library` → PatternLibrary
  - `/library/pattern/:id` → PatternDetail
  - `/library/analysis/:id` → ViewAnalysisScreen
- Settings: modal triggered via sidebar onClick (no route)
- Migration banner moved inside AppShell content area

**Other files updated:**
- `PatternLibrary.tsx` — replaced `'landing'` navigation
- `CompareScreens.tsx` — replaced `'landing'` navigation + type
- `MyAnalysesList.tsx` — replaced `'landing'` navigation

### Checkpoint: UI Polish (after human review)
- Logo: `text-2xl font-bold` (bolder), aligned with icons (`px-6`)
- Nav items: `h-11`, `gap-1` for more spacing
- Section spacing: `mt-4` after logo, `my-4` between sections
- Active state: bg highlight + bold only (no left border per user feedback)
- Hover: subtle `bg-state-hover` tint only (no border)

---

## Files Modified
| File | Action | Notes |
|------|--------|-------|
| `app/src/main.tsx` | Modified | BrowserRouter wrapping |
| `app/src/App.tsx` | Modified | Major refactor: Routes, remove header/landing |
| `app/src/screens/HomeScreen.tsx` | Created | Placeholder home |
| `app/src/PatternLibrary.tsx` | Modified | Remove 'landing' refs |
| `app/src/CompareScreens.tsx` | Modified | Remove 'landing' refs |
| `app/src/components/MyAnalysesList.tsx` | Modified | Remove 'landing' refs |
| `app/src/components/layout/SidebarNavItem.tsx` | Modified | UI polish |
| `app/src/components/layout/Sidebar.tsx` | Modified | UI polish |

## Requirements Covered
- LAYOUT-05: Deferred (mobile responsive — desktop only per CONTEXT.md)
- LAYOUT-06: LandingScreen removed ✅
- ROUTER-01: react-router-dom v7 installed ✅
- ROUTER-02: Routes wired for all sidebar items ✅

## Verification
- Build passes with zero new errors
- Human verified sidebar navigation, active states, collapse/expand
