# UI/UX Feature Patterns — Krea AI-inspired

**Reference:** Krea AI (krea.ai) — March 2026 Redesign
**Researched:** 2026-03-17
**Milestone:** v3.0 UI Redesign

---

## 1. Sidebar Navigation Structure

### Krea AI Sidebar Anatomy (Post-Redesign March 2026)

Krea AI restructured their entire navigation into **"One Sidebar"** — every tool lives in one place. Key principles from their redesign blog:

> "Every tool lives in one place now. Image, video, enhance, edit, 3D, realtime. Sessions carry over between them, and live indicators show what's running so you're not switching tabs to check on a job."

#### Krea Sidebar Structure (Extracted from krea.ai/apps)

```
┌─────────────────────────┐
│  [Logo]  Toggle Sidebar │
├─────────────────────────┤
│                         │
│  🏠 Home                │ ← Primary navigation (workspace-level)
│  🎓 Train Lora          │
│  🔗 Node Editor         │
│  📁 Assets              │
│                         │
├─────── Tools ───────────┤
│                         │
│  🖼️ Image        [▸]    │ ← Tool categories with expand arrows
│  🎬 Video        [▸]    │
│  ✨ Enhancer     [▸]    │
│  🍌 Nano Banana  [▸]    │   (sub-tools: models within each)
│  ⚡ Realtime     [▸]    │
│                         │
├─────────────────────────┤
│  🔍 Tools Search        │ ← Quick search across all tools
├─────────────────────────┤
│                         │
│  👤 Sign In / Profile   │ ← Footer: auth + account
│                         │
└─────────────────────────┘
```

#### Key Krea Sidebar Patterns

| Pattern | Detail |
|---------|--------|
| **Two-zone layout** | Top zone = workspace-level pages (Home, Assets, Editor). Bottom zone = creative tools (Image, Video, etc.) |
| **Icon + Label** | Every item has icon + text label. Tooltip on collapsed state |
| **Collapsible** | Toggle sidebar button at top. Collapsed = icon-only rail |
| **Sub-tool expansion** | Tool categories expand to show sub-tools/models (e.g., Image → Flux, Krea 1, etc.) |
| **Live indicators** | Running jobs show status indicators next to tool name |
| **Session persistence** | Switching tools preserves your work state |
| **Search** | "Tools Search" input at bottom of tool list for quick access |
| **Footer** | User profile/sign-in at very bottom |

### Proposed DesignDNA Sidebar Structure

Mapping DesignDNA's 6 features to Krea-style sidebar:

```
┌─────────────────────────────┐
│  [DesignDNA Logo]    [≡/×]  │ ← Collapsible toggle
├─────────────────────────────┤
│                             │
│  WORKSPACE                  │ ← Section label (uppercase, small, muted)
│  ─────────────────────────  │
│  🏠 Home                    │ ← Dashboard / landing
│  📊 My Analyses             │ ← Saved analysis results
│  📐 Pattern Library         │ ← Saved patterns collection
│                             │
├─────────────────────────────┤
│                             │
│  TOOLS                      │ ← Section label
│  ─────────────────────────  │
│  🔍 Analyze Design          │ ← Upload + AI analysis
│  🎨 Creative Studio         │ ← Synthesis + generation
│  ⚖️ Compare Designs         │ ← Multi-design comparison
│                             │
├─────────────────────────────┤
│                             │
│  ─────────────────────────  │
│  ⚙️ Settings                │ ← API key management
│  👤 User Profile            │ ← Account info, logout
│                             │
└─────────────────────────────┘
```

#### Rationale for Grouping

| Section | Items | Why |
|---------|-------|-----|
| **Workspace** | Home, My Analyses, Pattern Library | Content you've created or saved — browse & manage |
| **Tools** | Analyze, Creative Studio, Compare | Action-oriented — do something with designs |
| **Footer** | Settings, Profile | Utility functions — infrequent access |

#### Sidebar States

| State | Behavior |
|-------|----------|
| **Expanded** (default) | Icon + text label, ~240px width |
| **Collapsed** | Icon-only rail, ~64px width, tooltips on hover |
| **Active item** | Left accent bar (4px) + background highlight + bold text |
| **Hover** | Subtle background tint |
| **Badge** | Small dot/count on "My Analyses" if new results saved |

---

## 2. Screen-by-Screen Layout

### 2.1 Home / Dashboard

**Krea Pattern:** Krea's redesigned home is "a third the size it used to be" — a clean landing with quick access to all tools and recent work.

**DesignDNA Home Layout:**

```
┌─────────┬───────────────────────────────────────────────┐
│         │                                               │
│ Sidebar │   Welcome back, [Name]                        │
│         │                                               │
│         │   ┌─────────────────────────────────────────┐  │
│         │   │       HERO ACTION CARD                  │  │
│         │   │                                         │  │
│         │   │   🔍 Analyze a Design                   │  │
│         │   │   Upload or drop any design to start    │  │
│         │   │                                         │  │
│         │   │   [ Drop image here or click to upload ]│  │
│         │   └─────────────────────────────────────────┘  │
│         │                                               │
│         │   ┌──── Quick Actions ────┐                   │
│         │   │ 🎨 Creative Studio    │                   │
│         │   │ ⚖️ Compare Designs    │                   │
│         │   │ 📐 Pattern Library    │                   │
│         │   └───────────────────────┘                   │
│         │                                               │
│         │   Recent Analyses                             │
│         │   ┌────────┐ ┌────────┐ ┌────────┐           │
│         │   │ thumb  │ │ thumb  │ │ thumb  │           │
│         │   │ name   │ │ name   │ │ name   │           │
│         │   │ date   │ │ date   │ │ date   │           │
│         │   └────────┘ └────────┘ └────────┘           │
│         │   [View all →]                                │
│         │                                               │
└─────────┴───────────────────────────────────────────────┘
```

**Key Elements:**
- **Hero card** with primary CTA (Analyze) — prominent upload zone
- **Quick action cards** for other tools (3 cards in row)
- **Recent analyses** as horizontal card scroll — shows thumbnails + names + dates
- **Empty state** for new users: "Start by analyzing your first design" with illustration

### 2.2 Analyze Design

**Krea Pattern:** Krea's tool screens follow: left sidebar → main workspace → optional right settings panel. Clean layouts, controls hidden until needed.

**DesignDNA Analyze Layout:**

```
┌─────────┬───────────────────────────────────────────────┐
│         │                                               │
│ Sidebar │   Analyze Design                              │
│         │   ─────────────────                           │
│         │                                               │
│         │   ┌─────────────────────────────────────────┐  │
│         │   │                                         │  │
│         │   │     📂 Drop image here                  │  │
│         │   │     or click to upload                  │  │
│         │   │                                         │  │
│         │   │     Supported: PNG, JPG, WebP           │  │
│         │   │     Max: 10MB                           │  │
│         │   └─────────────────────────────────────────┘  │
│         │                                               │
│         │   ─── OR after upload: ───                    │
│         │                                               │
│         │   ┌───────────────┬─────────────────────────┐  │
│         │   │               │                         │  │
│         │   │  [Uploaded    │   Visual DNA             │  │
│         │   │   Image       │   ┌─ Composition ──────┐│  │
│         │   │   Preview]    │   │ ...                 ││  │
│         │   │               │   ├─ Color Palette ────┤│  │
│         │   │   [Analyze]   │   │ ...                 ││  │
│         │   │   [Clear]     │   ├─ Typography ───────┤│  │
│         │   │               │   │ ...                 ││  │
│         │   │               │   ├─ Buyer DNA ────────┤│  │
│         │   │               │   │ ...                 ││  │
│         │   └───────────────┴─────────────────────────┘  │
│         │                                               │
│         │   [💾 Save Analysis]  [🎨 Use in Studio →]    │
│         │                                               │
└─────────┴───────────────────────────────────────────────┘
```

**Key States:**
1. **Empty** — Large upload dropzone with dashed border
2. **Image uploaded** — Preview + "Analyze" button
3. **Analyzing** — Progress bar + skeleton content (loading DNA sections)
4. **Results** — Side-by-side: image preview (left) + DNA results (right, scrollable accordion sections)
5. **Saved** — Toast notification + green checkmark on save button

**Post-analysis actions:**
- **Save Analysis** — persist to server
- **Use in Creative Studio** → navigates to Studio with this analysis pre-loaded
- **Compare with other** → navigates to Compare with this design selected

### 2.3 Creative Studio

**Krea Pattern:** Krea's creative workspace uses a clean layout with workspace in center and relevant controls contextually shown. Drag-and-drop between tools.

**DesignDNA Creative Studio — 3-Panel Layout:**

```
┌─────────┬──────────────┬──────────────────┬──────────────┐
│         │  LEFT PANEL   │   CENTER PANEL   │  RIGHT PANEL │
│ Sidebar │  Source       │   Workspace      │  Output      │
│         │              │                  │              │
│         │  ┌──────────┐│                  │              │
│         │  │ Original ││  Synthesis       │  Generated   │
│         │  │ Design   ││  Preview         │  Artwork     │
│         │  │ [thumb]  ││                  │              │
│         │  │ [Select] ││  "A vibrant..."  │  [Result     │
│         │  └──────────┘│  ┌─────────────┐ │   Image]     │
│         │              │  │ Concept card│ │              │
│         │  Modifications│ │ from synth  │ │  Actions:    │
│         │  ┌──────────┐│  └─────────────┘ │  [Download]  │
│         │  │ text area││                  │  [Regenerate]│
│         │  └──────────┘│  [🔄 Synthesize] │  [🔍 Analyze]│
│         │              │  [🎨 Generate]   │              │
│         │  Patterns    │                  │              │
│         │  ┌──────────┐│                  │              │
│         │  │ [+] Add  ││                  │              │
│         │  │ pattern1 ││                  │              │
│         │  │ pattern2 ││                  │              │
│         │  └──────────┘│                  │              │
│         │              │                  │              │
└─────────┴──────────────┴──────────────────┴──────────────┘
```

**Left Panel — Source (300px):**
- Original design selector (dropdown from "My Analyses") with thumbnail preview
- Modifications textarea (what to change)
- Applied patterns list (chips/cards with remove button)
- [+ Add Pattern] button → opens Pattern Library modal

**Center Panel — Workspace:**
- Synthesis preview card (structured concept after AI synthesis)
- [Synthesize] button → triggers concept creation
- [Generate] button → triggers artwork generation (only active after synthesis)
- Progress indicators during AI calls

**Right Panel — Output (300px):**
- Generated artwork preview (full-width image)
- Download, Regenerate, and "Analyze this result" action buttons
- Empty state when no generation yet: "Generate artwork to see results here"

### 2.4 Compare Designs

**DesignDNA Compare Layout:**

```
┌─────────┬───────────────────────────────────────────────┐
│         │                                               │
│ Sidebar │   Compare Designs                             │
│         │   ─────────────────                           │
│         │                                               │
│         │   Select 2-4 designs to compare:              │
│         │   ┌────────┐ ┌────────┐ ┌────────┐ ┌───────┐ │
│         │   │ ✓ sel  │ │ ✓ sel  │ │  add   │ │  add  │ │
│         │   │ thumb  │ │ thumb  │ │  [+]   │ │  [+]  │ │
│         │   │ name   │ │ name   │ │        │ │       │ │
│         │   └────────┘ └────────┘ └────────┘ └───────┘ │
│         │                                               │
│         │   [⚖️ Compare Selected (2)]                   │
│         │                                               │
│         │   ─── Results ───                             │
│         │                                               │
│         │   ┌─────────────────────────────────────────┐  │
│         │   │  Comparison Matrix                      │  │
│         │   │  ┌─────────┬─────────┬─────────┐       │  │
│         │   │  │ Aspect  │ Design1 │ Design2 │       │  │
│         │   │  ├─────────┼─────────┼─────────┤       │  │
│         │   │  │ Color   │ ...     │ ...     │       │  │
│         │   │  │ Comp.   │ ...     │ ...     │       │  │
│         │   │  │ Buyer   │ ...     │ ...     │       │  │
│         │   │  └─────────┴─────────┴─────────┘       │  │
│         │   └─────────────────────────────────────────┘  │
│         │                                               │
│         │   Winning Formula (Pattern)                   │
│         │   ┌─────────────────────────────────────────┐  │
│         │   │  Extracted pattern summary...           │  │
│         │   │  [💾 Save as Pattern] [🎨 Use in Studio]│  │
│         │   └─────────────────────────────────────────┘  │
│         │                                               │
└─────────┴───────────────────────────────────────────────┘
```

**Selection area:**
- 4 slots displayed, 2 required minimum
- Each slot: click [+] → modal with "My Analyses" list to pick from
- Selected designs show thumbnail + name + remove [×] button

**Results area:**
- Comparison matrix table (responsive, scrollable)
- Winning formula card with save + use actions

### 2.5 Pattern Library

**Krea Pattern:** Krea's homepage shows tools in a clean grid with descriptions. Apply similar grid for patterns.

**DesignDNA Pattern Library Layout:**

```
┌─────────┬───────────────────────────────────────────────┐
│         │                                               │
│ Sidebar │   Pattern Library                             │
│         │   ─────────────────                           │
│         │                                               │
│         │   [🔍 Search patterns...]     [Grid │ List]   │
│         │                                               │
│         │   ┌────────┐ ┌────────┐ ┌────────┐           │
│         │   │ thumb  │ │ thumb  │ │ thumb  │           │
│         │   │        │ │        │ │        │           │
│         │   │ name   │ │ name   │ │ name   │           │
│         │   │ date   │ │ date   │ │ date   │           │
│         │   │ designs│ │ designs│ │ designs│           │
│         │   │ count  │ │ count  │ │ count  │           │
│         │   │        │ │        │ │        │           │
│         │   │ [⋮]    │ │ [⋮]    │ │ [⋮]    │           │
│         │   └────────┘ └────────┘ └────────┘           │
│         │                                               │
│         │   ┌────────┐ ┌────────┐ ┌────────┐           │
│         │   │ ...    │ │ ...    │ │ ...    │           │
│         │   └────────┘ └────────┘ └────────┘           │
│         │                                               │
│         │   Empty state: "No patterns yet.              │
│         │   Compare 2+ designs to extract patterns."    │
│         │                                               │
└─────────┴───────────────────────────────────────────────┘
```

**Grid view (default):** 3-column responsive grid, each card shows:
- Thumbnail (from source designs)
- Pattern name
- Created date
- Source design count
- Context menu [⋮]: View, Use in Studio, Delete

**List view:** Table format with sortable columns

**Pattern Detail (click → expand or navigate):**
- Full pattern data display
- Source designs thumbnails
- [Use in Creative Studio] CTA
- [Delete Pattern] danger action

### 2.6 My Analyses

**DesignDNA My Analyses Layout:**

```
┌─────────┬───────────────────────────────────────────────┐
│         │                                               │
│ Sidebar │   My Analyses                                 │
│         │   ─────────────────                           │
│         │                                               │
│         │   [🔍 Search...]              [Grid │ List]   │
│         │                                               │
│         │   ┌────────┐ ┌────────┐ ┌────────┐           │
│         │   │ image  │ │ image  │ │ image  │           │
│         │   │ thumb  │ │ thumb  │ │ thumb  │           │
│         │   │        │ │        │ │        │           │
│         │   │ name   │ │ name   │ │ name   │           │
│         │   │ date   │ │ date   │ │ date   │           │
│         │   │        │ │        │ │        │           │
│         │   │ [⋮]    │ │ [⋮]    │ │ [⋮]    │           │
│         │   └────────┘ └────────┘ └────────┘           │
│         │                                               │
│         │   Empty state: "No analyses yet.              │
│         │   Upload your first design to get started."   │
│         │   [→ Analyze Design]                          │
│         │                                               │
└─────────┴───────────────────────────────────────────────┘
```

**Card layout:** Similar to Pattern Library but with design-specific info:
- Original image thumbnail (prominent)
- Design name
- Analysis date
- Context menu [⋮]: View, Use in Studio, Compare, Delete

**View Detail:** Click card → full analysis view (same as Analyze results screen but read-only)

### 2.7 Settings

**Minimal screen — Krea-style "controls hidden until needed":**

```
┌─────────┬───────────────────────────────────────────────┐
│         │                                               │
│ Sidebar │   Settings                                    │
│         │   ─────────────────                           │
│         │                                               │
│         │   API Configuration                           │
│         │   ┌─────────────────────────────────────────┐  │
│         │   │  Gemini API Key                         │  │
│         │   │  [••••••••••••••••••]  [👁] [Save]      │  │
│         │   │                                         │  │
│         │   │  Status: ✅ Connected                    │  │
│         │   │  Last verified: 2 hours ago             │  │
│         │   └─────────────────────────────────────────┘  │
│         │                                               │
│         │   Account                                     │
│         │   ┌─────────────────────────────────────────┐  │
│         │   │  Email: user@example.com                │  │
│         │   │  Provider: Google                       │  │
│         │   │                                         │  │
│         │   │  [Sign Out]                             │  │
│         │   └─────────────────────────────────────────┘  │
│         │                                               │
└─────────┴───────────────────────────────────────────────┘
```

---

## 3. Interaction Patterns

### 3.1 Image Upload

**Krea Pattern:** Simple drag-and-drop with format display. "Upload any photo. We support all major file formats."

| Pattern | Implementation |
|---------|---------------|
| **Drag & drop zone** | Dashed border area, highlight on drag-over (blue border + light blue bg) |
| **Click to upload** | Clicking zone opens file picker |
| **Format hint** | Small text: "PNG, JPG, WebP • Max 10MB" |
| **Preview** | After upload: thumbnail preview with file name + size |
| **Replace** | Click preview or drag new image to replace |
| **Validation** | Immediate feedback: "File too large" / "Unsupported format" as inline error |

### 3.2 Loading States

**Krea Pattern:** Krea uses minimal loading — "killed animation delays between pages". Fast, no unnecessary spinners.

| Context | Loading Pattern |
|---------|----------------|
| **Page navigation** | Instant (SPA routing, no loading) |
| **Analysis in progress** | Progress bar (determinate if possible) + skeleton sections for DNA results |
| **Synthesis** | Pulsing card placeholder + "Synthesizing concept..." text |
| **Image generation** | Progress bar + "Generating artwork..." + elapsed time counter |
| **Save operations** | Button shows spinner inline → success checkmark → revert |
| **Data lists loading** | Skeleton cards (3-6 ghost cards matching layout) |

### 3.3 Empty States

| Screen | Empty State |
|--------|-------------|
| **Home (new user)** | Illustration + "Welcome to DesignDNA" + "Start by analyzing your first design" + [Analyze Design] CTA |
| **My Analyses** | Icon + "No analyses yet" + "Upload a design to discover its DNA" + [→ Analyze Design] |
| **Pattern Library** | Icon + "No patterns yet" + "Compare 2+ designs to extract winning patterns" + [→ Compare Designs] |
| **Creative Studio (no original)** | "Select an analyzed design to begin" + dropdown/picker |
| **Compare (no selections)** | 4 empty placeholder slots with [+] buttons |

### 3.4 Error States

| Error | Handling |
|-------|----------|
| **API key missing** | Banner at top of tool screens: "Set up your API key to use AI features" + [→ Settings] |
| **API call failure** | Toast notification: error message + [Retry] button |
| **Network offline** | Full-screen overlay: "Check your internet connection" + [Retry] |
| **File upload error** | Inline error below upload zone (red text) |
| **404 analysis not found** | "This analysis was deleted or doesn't exist" + [← Back to Analyses] |

### 3.5 Context Menus

**Pattern:** Three-dot menu [⋮] on cards, consistent across My Analyses and Pattern Library.

| Item Type | Menu Actions |
|-----------|-------------|
| **Analysis card** | View • Use in Creative Studio • Use in Compare • Delete |
| **Pattern card** | View • Use in Creative Studio • Delete |
| **Generated image** | Download • Analyze this • Full screen preview |

### 3.6 Fullscreen Image Preview

**Krea Pattern:** Krea uses overlay lightbox for image viewing.

- Click image → darkened overlay + centered image (fit to viewport)
- [×] close button top-right
- [Download] button
- [Esc] or click outside to close
- Optional zoom on double-click

---

## 4. Navigation Flow

### 4.1 Primary Navigation (Sidebar)

```
Sidebar click → Instant page transition (SPA)
Active item → highlighted in sidebar

Home ─── always accessible
├── Recent Analyses → click → Analysis detail
├── Quick Actions → click → respective tool page
│
My Analyses ─── browse/manage
├── Card click → Analysis detail view
├── [⋮] → Context menu actions
│
Pattern Library ─── browse/manage
├── Card click → Pattern detail view
├── [⋮] → Context menu actions
│
Analyze Design ─── primary action
├── Upload → Analyze → Results
├── [Save] → saved to My Analyses
├── [Use in Studio →] → Creative Studio (pre-loaded)
│
Creative Studio ─── creation workflow
├── Select original → Modify → Synthesize → Generate
├── [Add Pattern] → Pattern Library modal
│
Compare Designs ─── comparison workflow
├── Select 2-4 → Compare → Results
├── [Save as Pattern] → saved to Pattern Library
│
Settings ─── utility
```

### 4.2 Cross-Feature Navigation (Quick Actions)

These are the **fast lanes** — links from one feature into another:

| From | Action | To |
|------|--------|-----|
| Home | Click recent analysis card | Analysis detail view |
| Home | Quick action cards | Analyze / Studio / Compare |
| Analyze results | [Use in Creative Studio] | Studio with analysis pre-loaded |
| Analyze results | [Compare with others] | Compare with this design pre-selected |
| My Analyses | Context menu → "Use in Studio" | Studio with analysis pre-loaded |
| My Analyses | Context menu → "Use in Compare" | Compare with analysis pre-selected |
| Compare results | [Save as Pattern] | Pattern saved → Pattern Library |
| Compare results | [Use in Studio] | Studio with pattern pre-loaded |
| Pattern Library | Context menu → "Use in Studio" | Studio with pattern applied |
| Creative Studio | [+ Add Pattern] | Pattern picker modal (inline) |
| Creative Studio | [Analyze result] | Analyze with generated image |
| Any tool screen | API key missing banner | Settings page |

### 4.3 Breadcrumb / Back Navigation

**No breadcrumbs needed** — sidebar provides constant navigation context. However:

- **Detail views** (Analysis detail, Pattern detail) show a **back arrow** + parent label:
  - `← My Analyses` or `← Pattern Library`
- **Modal dialogs** (pattern picker, confirm delete) use standard modal close patterns

### 4.4 Keyboard Shortcuts (Nice-to-have)

| Shortcut | Action |
|----------|--------|
| `[` or `]` | Toggle sidebar expand/collapse |
| `Ctrl/Cmd + 1-6` | Navigate to sidebar items |
| `Esc` | Close modal/lightbox |

---

## 5. Key Design Principles from Krea AI Redesign

### Direct Quotes from Krea Blog (March 2, 2026)

1. **"Is this helping you make something, or is it in the way?"** — The filter for every screen redesign decision.

2. **"Controls that stay hidden until you need them"** — Progressive disclosure. Don't overwhelm with options upfront.

3. **"The quality bar for every screen: open it, do your work, keep moving"** — Efficiency-first. Reduce friction between tasks.

4. **"Production-grade doesn't have to mean complicated"** — Simplicity as a design principle.

5. **"Sessions carry over between tools"** — State persistence across features. Navigating away shouldn't lose work.

6. **"The homepage is now a third the size it used to be"** — Lean home page. Just recent work + quick access. No fluff.

### Applied to DesignDNA

| Krea Principle | DesignDNA Application |
|----------------|----------------------|
| One sidebar | All 6 features in one sidebar, never more than 1 click away |
| Lean homepage | Hero upload CTA + quick actions + recent analyses only |
| Controls when needed | Creative Studio shows right panel only after generation |
| Session persistence | Analysis results stay in state when navigating to Studio |
| State indicators | Show "analyzing..." badge on sidebar when analysis is running |
| Hidden complexity | Flatten sub-menus, no nested dropdowns in sidebar |

---

## 6. Sources

| Source | URL | Confidence |
|--------|-----|------------|
| Krea Redesign Blog | https://www.krea.ai/blog/redesign | ⭐⭐⭐⭐⭐ Primary |
| Krea App (live) | https://www.krea.ai/apps | ⭐⭐⭐⭐⭐ Primary |
| Krea Enhance Tool | https://www.krea.ai/apps/enhance | ⭐⭐⭐⭐ Direct observation |
| Krea Realtime Tool | https://www.krea.ai/apps/image/realtime | ⭐⭐⭐⭐ Direct observation |
| Krea Documentation | https://docs.krea.ai/user-guide | ⭐⭐⭐⭐ Official docs |
| Krea Edit Docs | https://docs.krea.ai/user-guide/features/edit | ⭐⭐⭐⭐ Official docs |
| Sidebar Best Practices 2026 | https://www.navbar.gallery/blog/best-side-bar-navigation-menu-design-examples | ⭐⭐⭐ Reference |
| AI UX Patterns (Bestfolios) | https://medium.com/bestfolios/building-trust-and-enhancing-interactions | ⭐⭐⭐ Reference |
| Side Drawer UI Guide | https://www.designmonks.co/blog/side-drawer-ui | ⭐⭐⭐ Reference |
| UX Trends 2025 (Fuselab) | https://fuselabcreative.com/ui-ux-design-trends-2026 | ⭐⭐ Background |

---

## Quality Gate Checklist

- [x] All 6 features mapped to new navigation structure (Sidebar: Home, Analyze, Studio, Compare, Patterns, Analyses, Settings)
- [x] Screen flow diagrams for each feature
- [x] Interaction patterns documented (upload, loading, empty, error, context menus, fullscreen)
- [x] Krea AI patterns referenced with specifics (blog quotes, sidebar structure, design principles)
- [x] Cross-feature navigation flows mapped
- [x] Empty states designed for each screen
- [x] Error handling patterns defined

---

*Previous version: v2.0 Features Research (AUTH, PROXY, DATA, UI, MIGRATE)*
*This version: v3.0 UI/UX Patterns Research (Krea AI-inspired redesign)*
