# Plan 16-01 Summary — Install Router & Create Layout Components

**Phase:** 16-app-shell-sidebar
**Plan:** 01 (Wave 1)
**Status:** ✅ Complete
**Commit:** `feat(16-01): install react-router-dom v7, add Dancing Script font, create layout components`

---

## What Was Built

### Task 1: Dependencies & Font
- Installed `react-router-dom@7.13.1`
- Added Dancing Script Google Font import to `index.css`
- Added `--font-logo: "Dancing Script", cursive` CSS token to `@theme`

### Task 2: Layout Components

**SidebarNavItem.tsx** (34 lines)
- Uses `<NavLink>` from react-router-dom
- Active state: `bg-bg-surface2` + `font-semibold` + `border-l-4 border-text-secondary`
- Collapsed mode: icon-only, centered
- Label fades with `transition-opacity`

**Sidebar.tsx** (142 lines)
- 3 zones: WORKSPACE (Home, Library), TOOLS (Studio, Analyze, Compare), FOOTER (Settings, Sign Out)
- Collapse toggle: expanded 240px (`w-60`), collapsed 64px (`w-16`)
- `transition-all duration-300 ease-in-out` for smooth width change
- Logo "DesignDNA" in `font-logo` (Dancing Script)
- Section labels: uppercase, `text-[11px]`, tertiary color
- Dividers between sections
- Settings onClick opens modal (prevents navigation)
- Sign Out uses signOut prop
- `role="navigation"` for accessibility

**AppShell.tsx** (22 lines)
- Flex row layout: Sidebar + content area
- Content area: `flex-1 overflow-auto p-8`
- Gets signOut from useAuth(), passes to Sidebar
- Push layout model (sidebar in document flow)

**index.ts** (barrel export)
- Exports AppShell, Sidebar, SidebarNavItem

---

## Files Modified
| File | Action | Lines |
|------|--------|-------|
| `app/package.json` | Modified | react-router-dom@7.13.1 added |
| `app/src/index.css` | Modified | +2 lines (font import + token) |
| `app/src/components/layout/SidebarNavItem.tsx` | Created | 34 |
| `app/src/components/layout/Sidebar.tsx` | Created | 142 |
| `app/src/components/layout/AppShell.tsx` | Created | 22 |
| `app/src/components/layout/index.ts` | Created | 3 |

## Requirements Covered
- LAYOUT-01: AppShell component ✅
- LAYOUT-02: Sidebar expand/collapse ✅
- LAYOUT-03: 3-zone sidebar sections ✅
- LAYOUT-04: Active item indicator ✅
- LAYOUT-06: Structural preparation (LandingScreen removal in Plan 02) ✅

## Verification
- Zero TypeScript errors in layout components
- Pre-existing errors in other files unchanged
