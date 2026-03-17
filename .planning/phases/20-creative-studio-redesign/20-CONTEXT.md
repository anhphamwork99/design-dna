# Phase 20: Creative Studio Redesign - Context

**Gathered:** 2026-03-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Redesign the Creative Studio component (currently 1,063 LOC `CreativeStudio.tsx`, now `StudioScreen.tsx`) into a canvas-first, goal-based experience. Replace the creativity slider with 3 explicit goal cards. Implement staged transitions (Goal → Upload → Analyze → Studio) on a single canvas without page navigation. Preserve all existing synthesis/generation pipeline logic — visual + interaction changes only.

**What this phase delivers:**
1. Goal picker screen (3 large cards: Clone / Variations / Explore)
2. Goal-aware upload zone with auto-analyze
3. Animated canvas transitions between stages
4. Concept card horizontal strip with fullscreen dialog detail
5. Artwork rendering directly on concept cards
6. Clone mode with side-by-side comparison
7. Simplified state machine (Stage enum replacing boolean soup)

**What this phase does NOT deliver:**
- Chat-based concept refinement (deferred)
- Buyer fit scoring (REMOVED — `analyzeBuyerFit()` will not be called)
- Mobile responsive (deferred — desktop only per Phase 16 decision)

</domain>

<decisions>
## Implementation Decisions

### Flow Sequence
- **Goal picker FIRST** — When entering Studio, the first screen shows 3 large goal cards with titles and descriptions. No sidebars visible yet.
- **Goal → Upload (separate screens)** — After selecting goal, canvas transitions to upload zone. Goal shown small in header/breadcrumb.
- **Auto-analyze on drop** — User drops image → auto-analyze fires immediately, no "Analyze" button needed.
- **Auto-transition to Studio** — After analysis completes, sidebar slides in and canvas transitions directly to Studio mode. No confirmation/summary step.
- **No goal switching mid-flow** — Once in Studio, user cannot change goal. Must click "Start Over" to return to Goal picker.
- **"Start Over" → Goal picker** — Keeps image+DNA, resets concepts/artwork. User can pick same or different goal.

### Entry from Analyze Screen
- **"Go to Studio" action** on Analyze screen → navigates to Studio Goal picker, but with image+DNA already loaded. Skip upload stage.
- **Image thumbnail visible** on Goal picker when entering from Analyze (remind user which artwork they're using).

### Goal Cards
- **3 goals replace creativity slider:**
  - 🎯 **Clone Design** — maps to `creativity=1`, calls `cloneDesign()`, no synthesis/concepts
  - 🔄 **Make Variations** — maps to `creativity=2-3`, calls `synthesizeConcept()` → `generateArtwork()`
  - ✨ **Explore New Ideas** — maps to `creativity=4-5`, calls `synthesizeConcept()` → `generateArtwork()`
- **Cards must be large** with clear title + description. Emphasize differences between goals. Not small buttons.

### Upload Zone
- **Goal-aware description text** — Changes based on selected goal:
  - Clone: "Upload the product photo you want to extract"
  - Variations: "Upload the design you want to riff on"
  - Explore: "Upload the design for inspiration"
- **Supported formats shown** — PNG, JPG, etc. displayed below upload zone
- **Drag & drop + browse button** — Standard upload patterns

### Analysis Loading
- **Full-canvas animated loading** — Image thumbnail shrinks to corner
- **Step text progression** — "Extracting colors...", "Reading typography...", "Mapping buyer signals..."
- **Premium animation** — DNA helix, particles, or similar engaging visual

### Error Handling
- **Inline center canvas** — Loading animation stops, error message appears on center canvas
- **Two actions:** "Try Again" + "Upload Different Image"
- **No navigation** — Stay on same canvas, no redirect

### Clone Mode
- **Preview before cloning** — Canvas shows original image + sidebar has aspect ratio picker + "Clone This Design" CTA. User clicks to start.
- **Result: side-by-side** — Original left, clone right on center canvas.
- **Sidebar minimal** — Aspect ratio only + "Re-clone" button. No shifts, no patterns.
- **No concept carousel** — Clone skips synthesis entirely.

### Variation/Explore Mode
- **Left sidebar content (3 sections):**
  1. Dimension shifts (7 dims: Keep/Change/Reimagine)
  2. Pattern picker (expandable list from saved patterns)
  3. Aspect ratio selector
  4. "Create Concepts" CTA at bottom
- **Default shifts differ by goal:**
  - Variations: Style=CHANGE, Colors=CHANGE, rest=KEEP
  - Explore: All dimensions=REIMAGINE
- **Concept cards: horizontal scroll strip** — 3 compact cards in a row. Thumbnail + title + 1-line description. Swipe/scroll to browse.

### Concept Detail Interaction
- **Click card → fullscreen dialog** — Near full-screen modal with backdrop blur. Close via X button or ESC key.
- **Dialog content:** Full concept description, color palette swatches, target buyer, key elements, "Generate Artwork" CTA.
- **Generate → dialog closes** — Artwork renders directly on the concept card in the strip (replaces placeholder thumbnail).

### Artwork Result Actions (dual interaction)
- **Hover card** → Quick action icons overlay (download, regenerate, zoom)
- **Click card** → Fullscreen dialog reopens showing generated artwork large + all action buttons (Download, Regenerate, Try Different Concept, Start Over)

### Buyer Fit
- **REMOVED** — `analyzeBuyerFit()` will not be called from Studio. Remove the async call and all buyer fit UI.

### State Management
- **Stage enum replaces 17 useState booleans:**
  ```
  type Stage =
    | 'goals'        // Goal picker
    | 'upload'       // Upload zone
    | 'analyzing'    // Auto-analyze loading
    | 'studio'       // Main studio canvas (clone preview OR concept strip)
    | 'synthesizing' // Creating concepts
    | 'concepts'     // Concept cards visible
    | 'generating'   // Creating artwork
    | 'result'       // Artwork on cards
    | 'cloning'      // Clone in progress
    | 'clone-result' // Side-by-side clone result
  ```
- **Each stage determines exactly which UI elements are visible** — eliminates impossible states.

### Agent's Discretion
- Animation details (duration, easing, exact transitions) — Agent decides based on motion/react capabilities
- Exact layout proportions (sidebar width, card sizes) — Agent decides, consistent with Phase 16 sidebar pattern (~240px)
- Loading animation style (DNA helix vs particles vs abstract) — Agent picks what's achievable

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `StudioScreen.tsx` (16 LOC wrapper) — thin screen shell, actual logic in `CreativeStudio.tsx`
- `CreativeStudio.tsx` (1,063 LOC) — all synthesis/generation logic, state machine, UI. Will be rewritten.
- `components/shared/Modal.tsx` — existing modal component, can be extended for fullscreen concept dialog
- `components/shared/UploadZone.tsx` — existing upload component, reusable for upload stage
- `components/shared/ErrorBanner.tsx` — existing error component (may adapt for inline errors)
- `components/shared/LoadingSpinner.tsx` — existing loader (will need enhancement for full-canvas animation)
- `components/shared/Card.tsx` — surface card, potential base for concept cards

### Established Patterns
- **Framer Motion (motion/react)** — already imported in CreativeStudio for `AnimatePresence` transitions
- **Stage-based rendering:** Current code uses boolean soup — redesign replaces with Stage enum
- **API client pattern:** `synthesizeConcept()`, `generateArtwork()`, `cloneDesign()` in `apiClient.ts` — interfaces unchanged

### Integration Points
- **Router:** `/studio` route already wired in App.tsx → StudioScreen
- **Sidebar nav:** "Studio" item in TOOLS section — already functional
- **Analyze → Studio:** Currently passes `analysisResult` + `uploadedImage` as props. Need to handle cross-screen data passing (via route state or context).
- **Pattern Library:** `listPatterns()` API for pattern picker sidebar section

</code_context>

<specifics>
## Specific Ideas

- **Goal cards should be prominently large** — "Emphasize rõ ràng" with title + description. Not small radio buttons or tabs.
- **Canvas transitions are central to the experience** — User should feel the canvas "evolving" around them, not navigating between pages.
- **Loading animation should feel premium** — Step text ("Extracting colors...", "Reading typography...") creates engagement during wait.
- **Concept detail dialog = near fullscreen + backdrop blur** — Generous space for concept info, not cramped modal.
- **Artwork renders ON the card** — The card transforms from concept placeholder to actual artwork. Visual continuity.
- Reference visualizations created during discussion: `playground/visual-explainer/studio-synthesis-pipeline.html`, `studio-ux-revised.html`

</specifics>

<deferred>
## Deferred Ideas

- Chat-based concept refinement (conversational iteration on concepts)
- Buyer fit scoring (removed from Studio entirely — could be separate feature if needed later)
- Mobile responsive Studio layout
- "Generate all 3 concepts" batch mode (generate artwork for all 3 concepts at once)

</deferred>

---

*Phase: 20-creative-studio-redesign*
*Context gathered: 2026-03-18*
