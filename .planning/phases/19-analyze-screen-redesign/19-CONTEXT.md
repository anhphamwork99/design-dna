# Phase 19: Analyze Screen Redesign - Context

**Gathered:** 2026-03-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Redesign the Analyze screen with v3.0 design system. Includes: upload zone polish, loading state with progress bar, results layout refinement, and a major routing restructure — merging My Analyses list into the Analyze flow as nested routes. The existing AnalyzeScreen (311 LOC) + 6 sub-components in `analyze/` are the baseline. MyAnalysesScreen (Phase 22) is reused directly.

</domain>

<decisions>
## Implementation Decisions

### Routing & Navigation (Major Change)
- **Nested routes:** `/analyze` (analyses list), `/analyze/new` (upload + analyze flow), `/analyze/:id` (view saved results)
- **Sidebar:** Merge "Analyze" + "My Analyses" into single "Analyze" item → clicks to `/analyze` (list)
- **Remove:** Separate `/analyses` route and "My Analyses" sidebar item
- **Breadcrumb:** Inline "← Back to Analyses" text link at top of `/analyze/new` and `/analyze/:id` screens
- **Reuse:** Import existing `MyAnalysesScreen` component for `/analyze` route, add "New Analysis" CTA button
- **Entry:** Always start fresh at upload step — no preloaded state from other screens

### Results Layout
- **Side-by-side:** Image 40% sticky left + DNA 60% right (keep current layout)
- **Tabs:** Keep 2-tab navigation (Design Breakdown / Target Audience)
- **Mobile:** Image shrinks to thumbnail and pins at top when user scrolls DNA content
- **Sections:** Flat sections with heading + content inside tabs (no cards, no accordions) — keep current format

### Upload Experience
- **Layout:** Keep existing layout, only polish visual — rebalance proportions of title, upload zone, and button for better balance
- **Preview:** Keep existing preview behavior, only polish visual
- **Clipboard paste:** Support Cmd+V / Ctrl+V paste image directly into upload zone (new feature)
- **Validation:** Explicit guidance — show supported formats + max file size in upload zone text, inline error message when wrong type/size

### Loading & Progress
- **Indicator:** MascotLoader chibi GIF + energy bar-style progress bar with percentage display
- **Progress simulation:** Step-based — 3-4 fixed steps ("Reading design..." → "Analyzing composition..." → "Decoding buyer DNA..." → "Finalizing..."), each step advances percentage
- **Error:** Modal overlay on top of loading screen — Retry + Cancel buttons
- **Cancel:** Confirm dialog before canceling ("Analysis in progress. Cancel?" Yes/No)

### Post-analysis Actions
- **Primary CTA:** "Go to Studio" — navigates to `/studio` with design + DNA preloaded
- **Secondary actions:** "Analyze Another" (navigates to `/analyze` list) + "Copy Analysis" (renamed from "Copy DNA JSON")
- **Auto-save notification:** Toast "Analysis saved ✓" after successful auto-save (fire-and-forget behavior unchanged)

### Agent's Discretion
- Exact proportions for upload zone rebalancing
- MascotLoader size and placement during loading
- Progress bar animation easing and step timing
- Toast notification styling and duration
- Mobile thumbnail size when pinned

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `AnalyzeScreen.tsx` (311 LOC) — shell with 3-step state machine (upload/analyzing/results) + inline ResultsStep
- `analyze/AnalyzeUploadStep.tsx` — upload flow component
- `analyze/AnalyzeLoadingStep.tsx` — loading animation (to be redesigned)
- `analyze/AnalyzeVisualTab.tsx` (9.9KB) — visual DNA display sections
- `analyze/AnalyzeBuyerTab.tsx` (6.9KB) — buyer DNA display sections
- `analyze/AnalyzeGoToStudioButton.tsx` — navigate to Studio with data
- `analyze/types.ts` — AnalyzeImage, AnalyzeError types
- `shared/UploadZone.tsx` — drag & drop component (reusable, needs clipboard paste addition)
- `shared/Modal.tsx` — overlay with backdrop blur (for error modal + cancel confirm)
- `shared/ErrorBanner.tsx` — error display
- `screens/MyAnalysesScreen.tsx` (231 LOC) — DataGrid grid/list + search + context menu (reuse directly)
- MascotLoader pattern — chibi GIF used in Studio/Compare (established pattern)

### Established Patterns
- Stage-machine shell pattern (Studio Phase 20, Compare Phase 21)
- AnimatePresence mode="wait" for step transitions
- Auto-save fire-and-forget with generateThumbnail
- Error handling with type-specific messages (NO_API_KEY, timeout, 400, 403, 429, etc.)
- motion/react for animations
- React Router v7 for navigation

### Integration Points
- `App.tsx` — Route definitions need updating (add nested `/analyze/*`, remove `/analyses`)
- `Sidebar.tsx` — Merge 2 items into 1 "Analyze" item
- `apiClient.ts` — analyzeDesign, saveAnalysis functions (unchanged)
- `ViewAnalysisScreen.tsx` — May need updating to use `/analyze/:id` route instead

</code_context>

<specifics>
## Specific Ideas

- Progress bar should feel like a "thanh năng lượng" (energy bar) — game-inspired, not generic
- "Copy DNA JSON" renamed to "Copy Analysis" — friendlier label
- Upload zone needs rebalancing: title length, zone height, button size should feel proportional and premium
- Clipboard paste (Cmd+V) is a usability improvement — many POD sellers screenshot designs from marketplaces

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 19-analyze-screen-redesign*
*Context gathered: 2026-03-19*
