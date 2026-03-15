# Creative Studio — UX Specification

> Phase 7A · DesignDNA · Last updated: 2026-03-16

---

## 1. Screen Purpose & Mental Model

### What the user is doing here

The user has already analyzed a design (Phase F1 complete) and now wants to **create a new design inspired by that original**. They're at the "ideation control panel" — the midpoint between understanding (analysis) and creation (generation).

### Mental model: The DJ Remix Console

Think of a DJ remix console:
- **Left turntable** = the original track (always playing, always visible)
- **Mixer controls** = which parts to keep, which to change
- **Right turntable** = patterns/samples you can layer in (optional)
- **Fader** = how different the remix should sound (creativity level)
- **Play button** = generate the remix

The user is remixing a design, not building from scratch. The original is their anchor, their reference point. Everything on screen is relative to that original.

### Emotional goal

**Confident creativity.** The user feels in control — they see what they're working from, they understand what will change, and they know what the AI will do with their choices. No guessing, no mystery toggles, no overwhelming options.

---

## 2. Layout Architecture

### Overall structure: 3-Panel Playground

**Decision:** 3-panel layout — Left controls, Center canvas (largest), Right iteration. Full viewport height. Desktop-only.

**Rationale:**
- **Jakob's Law** — AI generation tools (Google AI Studio, OpenAI Playground, Midjourney, ComfyUI) use panel-based layouts where controls and output are visible simultaneously. This IS a generation workspace.
- **Fitts' Law** — Controls grouped in a narrow left panel. Canvas takes maximum space for artwork evaluation. Feedback/chat in right panel — close to the output they describe.
- **No mobile responsive needed** — DesignDNA is a professional design tool used at a desk. POD sellers work on desktop when creating designs.

### 3-Panel wireframe

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back    Creative Studio                                      [Settings] │
├──────────────┬────────────────────────────────────────┬───────────────────────┤
│ LEFT PANEL   │         CENTER CANVAS                  │    RIGHT PANEL        │
│ (~280px)     │         (flex-1, largest)               │    (~300px)           │
│ scrollable   │         artwork + actions              │                       │
│              │                                        │                       │
│ ┌──────────┐ │                                        │  (empty until         │
│ │Your      │ │    ┌──────────────────────────┐        │   generation)         │
│ │Original  │ │    │                          │        │                       │
│ │ 🖼 80×80 │ │    │                          │        │  After generation:    │
│ │ [chips]  │ │    │   Generated Artwork      │        │                       │
│ └──────────┘ │    │   (main preview area)    │        │  Buyer Fit            │
│              │    │                          │        │  ┌─────────────────┐  │
│ How Different│    │   max-height, centered   │        │  │ Match    85%    │  │
│ [──●────] 2  │    │   object-contain         │        │  │ Emotion  78%    │  │
│ "Inspired"   │    │                          │        │  │ Original 92%    │  │
│              │    └──────────────────────────┘        │  │ Signals  4/5    │  │
│ What to      │                                        │  └─────────────────┘  │
│ Change       │    [✨ Create New]  [⬇ Download]       │                       │
│ ─────────    │                                        │                       │
│ Style  [K|C] │    (empty state: placeholder           │                       │
│ Colors [K|C] │     with prompt to configure           │                       │
│ Graph. [K|C] │     and click Create Design)           │                       │
│ Typo.  [K|C] │                                        │                       │
│ Theme  [K|C] │                                        │                       │
│ Audie. [K|C] │                                        │                       │
│ ─────────    │                                        │                       │
│ Patterns     │                                        │                       │
│ [+ Add]      │                                        │                       │
└──────────────┴────────────────────────────────────────┴───────────────────────┘
```

### Panel specifications

| Panel | Width | Height | Scroll | Purpose |
|-------|-------|--------|--------|---------|
| **Left** | `w-[280px]` fixed | `h-screen` (minus topbar) | `overflow-y-auto` | Configuration only: original, controls, patterns |
| **Center** | `flex-1` (fills remaining space) | `h-screen` (minus topbar) | No scroll — artwork + actions centered | Artwork canvas + ALL action buttons (Create, Create New, Download) |
| **Right** | `w-[300px]` fixed | `h-screen` (minus topbar) | `overflow-y-auto` | Buyer Fit scores (visible after generation only) |

### Panel behavior

- **Left panel** — Configuration only. All controls stacked vertically. Scrollable if content exceeds viewport. **No action buttons** — left panel is purely inputs.
- **Center canvas** — The hero + all actions. Before generation: empty state with prominent "Create Design" CTA. After generation: artwork at max size + "Create New Design" + "Download" below. No scroll.
- **Right panel** — Empty/minimal until first generation. After generation: Buyer Fit scores only. No chat refinement in Phase 7A.

### Container (full viewport)

- Root: `flex h-screen` (no `max-w-[800px]` — uses full width)
- Topbar: `h-14` fixed at top with back button + title + settings
- Panels: `flex flex-1 overflow-hidden` below topbar
- Panel dividers: `border-r border-border-default` between panels
- Left panel padding: `p-4`
- Center canvas padding: `p-6` (artwork needs breathing room)
- Right panel padding: `p-4`

### No mobile responsive

Desktop-only layout. No breakpoint handling needed. Minimum viewport width: `1024px`. Below that, the layout may truncate — acceptable for a professional design tool.

---

## 3. Section: Original Design (Ground Truth)

### Purpose

Always remind the user what they're working from. The original design is the anchor — it answers "where did this come from?" at a glance.

**UX Law — Von Restorff Effect:** The original design must be visually distinct from the controls below it. It's the one "different" element on a page of inputs — it grounds the user.

### Content (compact for 280px panel)

| Element | Source | Display |
|---------|--------|---------|
| Thumbnail image | `uploadedImage.data` (new prop) | **80×80px** rounded-lg, `object-cover`, border `border-border-default` |
| Design name | `uploadedImage.name` | Truncated with `truncate`, 13px font-medium |
| Key highlights | Derived from `analysisResult` | 2-4 compact chips: Style, Palette, Tribe, Emotion — wrap naturally within 280px |

**Note:** No `visual_dna.summary` text in left panel — the chips are sufficient at this width. Full DNA info is available on the Results screen.

### Layout (within left panel, stacked)

```
┌──────────────────────────┐
│ YOUR ORIGINAL            │
│ ┌────────┐               │
│ │  🖼    │ design.png    │
│ │ 80×80  │               │
│ └────────┘               │
│ [Geometric] [Analogous]  │
│ [Adventurers] [Wander]   │
└──────────────────────────┘
```

### Behavior

- **Always visible.** Never collapsible — read-only ground truth.
- **Static.** Does not update when controls change.
- **No interaction.** 0 interactive elements. Purely informational.
- **Image centered** above name and chips (stacked layout for narrow panel).

### Styling

- Container: `bg-bg-surface2/50 p-3 rounded-xl border border-border-default`
- Section label: `text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-2` → "Your Original"
- Image: `w-[80px] h-[80px] rounded-lg object-cover border border-border-default`
- Highlight chips: `bg-bg-surface2 px-2 py-0.5 rounded text-[11px] text-text-secondary`

---

## 4. Section: Design Controls

### Purpose

Let the user define HOW the new design should differ from the original. Two concerns: **how much** to change (creativity level) and **what** to change (6 dimensions).

### Simplification decisions

#### Decision 1: Remove the 3-mode card selector

**Current:** 3 clickable cards (Same Buyer / New Buyer / Full Remix) that auto-toggle Keep/Change for all 6 dimensions.

**New:** Remove entirely. Let users toggle each dimension individually.

**Rationale:**
- **Hick's Law** — 3 modes × understanding what each mode does = compound decision. The modes are an abstraction layer that doesn't help — users still need to understand what each dimension means.
- The mode cards were a shortcut for bulk-toggling dimensions, but the actual useful information is which dimensions to Keep vs Change. Show that directly.
- Default state replaces the mode utility (see "Default state" below).

#### Decision 2: Remove the Specificity Level selector

**Current:** 3-button selector (Broad Appeal / Focused / Ultra-Specific) — a separate concept from SHIFT+B dimensions.

**New:** Remove. The "Audience" dimension already covers specificity. If the user wants hyper-niche, they'll write it in the Audience text input. If they keep the audience, specificity is inherited from the original.

**Rationale:**
- **Miller's Law** — Reducing from 3 control groups (Mode, Dimensions, Specificity) to 2 (Creativity, Dimensions) stays within 7±2 chunks.
- Specificity is redundant with the Audience dimension's text input. "Target yoga-loving moms in Portland" is inherently hyper-niche — no need for a separate selector to declare it.

#### Decision 3: Set smart defaults

| Dimension | Default state | Rationale |
|-----------|--------------|-----------|
| Visual Style | **Change** | This is the #1 reason users are here — they want a different-looking design |
| Colors | **Change** | Second most common change |
| Graphics | **Keep** | Specific graphic elements often define the design's identity |
| Typography | **Keep** | Typography is often a "detail" users don't want to think about |
| Theme & Mood | **Keep** | The emotional direction is usually what they want to preserve |
| Audience | **Keep** | Most common use case = same audience, new design |

These defaults match what the old "Same Buyer, New Design" mode did — which was the most common entry flow from ResultsScreen ("Create Similar Design" button). But now the user can see and change any of them individually.

When navigating from "Remix for Different Audience" button: Audience defaults to **Change**, and Theme & Mood defaults to **Change**. This is controlled via the `initialGenMode` prop (see Implementation Notes).

### Subsection: Creativity Level

**Retained as-is.** This control works well and users understand it.

```
── How Different? ───────────────────────────────

  [────●────────────────────────] Slider (1-5)
  1:Faithful  2:Inspired  3:Remixed  4:Original  5:Radical
  
  "Keeps themes, reinterprets freely"   ← dynamic label
```

- Position: First within the Design Controls section (sets the "tone" before specific dimensions)
- Default: 2 (Inspired) — same as current
- **1 interactive element**: Range input

### Subsection: What to Change (6 Dimensions)

Each dimension = 1 row with:
- Dimension name (static label)
- **Keep / Change toggle** (segmented control, 2 buttons per row but functionally 1 binary toggle)
- **Text input** (only visible when "Change" is selected)

```
── What to Change ─────────────────────────────────

  Visual Style  [Keep ○ | ● Change]  [Campfire scene...]
  Colors        [Keep ○ | ● Change]  [Cool blues...]
  Graphics      [● Keep | ○ Change]  
  Typography    [● Keep | ○ Change]  
  Theme & Mood  [Keep ○ | ● Change]  [Find Your Peace...]
  Audience      [● Keep | ○ Change]  
```

**Dimension naming** (plain language, Phase 6A):

| SHIFT+B key | Current name | New display name | Placeholder |
|------------|-------------|-----------------|-------------|
| S | Visual Style | Visual Style | "e.g., Watercolor landscape" |
| H | Colors | Colors | "e.g., Cool blues and teals" |
| I | Graphics & Characters | Graphics | "e.g., Cat instead of dog" |
| F | Typography | Typography | "e.g., Bold hand-lettered" |
| T | Theme & Mood | Theme & Mood | "e.g., Calm serenity" |
| B | Target Audience | Audience | "e.g., Yoga moms 30-40" |

**Toggle behavior:**
- When **Keep** is selected: No text input visible. The original DNA value for that dimension is used in the generation prompt.
- When **Change** is selected: Text input appears with a placeholder. Input is optional — if left empty, AI will use the creativity level to interpret freely.

**Interactive element count for dimensions:**
- 6 toggles = 6 interactive elements (each toggle is a single binary choice)
- Text inputs only appear conditionally. They are supporting inputs, not separate "decisions."
- Per the toggle interaction model, each Keep/Change toggle counts as **1** interactive element (it's a binary switch, not 2 separate buttons — same as a checkbox).

### Styling

- Section container: `bg-bg-surface1 p-6 rounded-xl border border-border-default`
- Subsection labels: `text-[14px] font-semibold mb-1` + `text-[12px] text-text-secondary mb-4`
- Dimension rows: `flex items-center gap-4 py-3 border-b border-border-default/30 last:border-0`
- Dimension name: `w-[120px] text-[14px] font-medium flex-shrink-0`
- Toggle pill: `bg-bg-surface2 p-1 rounded-full border border-border-default inline-flex`
  - Active "Keep": `bg-bg-surface1 text-text-primary shadow-sm`
  - Active "Change": `bg-accent text-white shadow-sm`
  - Inactive: `text-text-secondary hover:text-text-primary`
- Text input: `bg-bg-surface2 border border-border-default rounded-lg px-3 py-2 text-[13px]` (same as current)

---

## 5. Section: Applied Patterns

### Purpose

Let the user optionally layer in **learned patterns** from previous Compare analyses. This is the "samples" tray — presets they've saved that can influence the generation.

**Scope note:** Pattern Library (Phase 7C) doesn't exist yet. This section builds the surface that will eventually connect to it. For Phase 7A, the section exists in its empty state only (or with patterns pre-loaded when navigating from Compare results with `prefilledBrief`).

### Empty state (most common in 7A)

```
┌────────────────────────────────────────────────────┐
│  Applied Patterns                                   │
│                                                     │
│       ◇                                             │
│  No patterns applied                                │
│  Patterns add winning formulas from your Compare    │
│  analyses to influence the new design.              │
│                                                     │
│  [+ Add Pattern]  ← disabled badge with tooltip     │
│  "Save a Compare result as a Pattern first"         │
└────────────────────────────────────────────────────┘
```

### With patterns applied (future, when Pattern Library exists)

```
┌────────────────────────────────────────────────────┐
│  Applied Patterns                                   │
│                                                     │
│  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │ "Summer Vibes"    × │  │ "Retro Bold"      × │  │
│  │ 3 designs · Keep bold│  │ 2 designs · Vintage │  │
│  └─────────────────────┘  └─────────────────────┘  │
│                                                     │
│  [+ Add Pattern]                                    │
└────────────────────────────────────────────────────┘
```

### Pattern chip design

Each applied pattern displays as a removable chip/card:
- **Name:** Pattern name (user-defined when saving Compare result)
- **Subtitle:** Source count + summary snippet (e.g., "3 designs · Keep bold colors")
- **Remove button:** `×` icon on hover/always visible
- Chip: `bg-bg-surface2 px-4 py-3 rounded-lg border border-border-default inline-flex items-center gap-3`

### Interactions

| Action | Trigger | Behavior |
|--------|---------|----------|
| Add Pattern | Click "Add Pattern" button | Opens a modal/panel listing saved patterns from localStorage (Phase 7C). For Phase 7A, button is present but disabled / shows tooltip |
| Remove Pattern | Click × on chip | Immediately removes pattern from applied list (no confirmation — easily re-added) |
| View Pattern | Click chip body (not ×) | Future: expand inline to show pattern details. Phase 7A: no-op |

### Interactive element count

- "Add Pattern" button: **1 interactive element** (disabled in 7A, but present for forward-compatibility)
- Each × remove button: only appears when patterns are applied → not counted in the default/initial state

### Preloaded pattern via `prefilledBrief`

When navigating from Compare Results → Generate, the current `prefilledBrief` (winning formula's `suggested_brief`) gets applied as a temporary "inline pattern." This bridges Phase 7A → 7C:
- Display as a chip labeled "Compare — Winning Formula"
- The brief text populates the Visual Style dimension's text input (same as current behavior)
- Removable via ×

### Styling

- Section container: `bg-bg-surface1 p-6 rounded-xl border border-border-default`
- Section label: `text-[14px] font-semibold mb-4`
- Empty state icon: A diamond/sparkle icon, 24px, text-secondary
- Empty state text: `text-[13px] text-text-secondary text-center`
- Add button: `text-[13px] font-medium text-accent hover:text-accent-hover` with `+` icon
- Pattern chips: `bg-bg-surface2 px-4 py-3 rounded-lg border border-border-default`

---

## 6. Section: Action Area (Center Canvas)

### All actions live in the center canvas

The left panel is **purely configuration** — no action buttons. All creation and output actions are in the **center canvas area**, creating a clear spatial model: *left = configure, center = act + view, right = evaluate.*

#### Before generation (empty state)

The center canvas shows a prominent CTA:

```
              ✨
       Ready to create
  Configure your design controls
    on the left, then...

   [✨✨✨ Create Design ✨✨✨]
```

- **"Create Design"** — Primary button, `ai-gradient` bg (blue-to-purple gradient), large, prominent
- Centered vertically and horizontally in the canvas
- When generating: button transforms to spinner + "Creating..." text, then fades to loading animation
- **1 interactive element** in center canvas initially

#### After generation

The center canvas shows artwork + secondary actions below:

```
   ┌─────────────────────────┐
   │                         │
   │   Generated Artwork     │
   │   (max size, centered)  │
   │                         │
   └─────────────────────────┘

   [✨ Create New Design]  [⬇ Download]
```

- **Create New Design** — Secondary button (`bg-bg-surface1 border`). Clears artwork + right panel. User re-adjusts left panel controls, then clicks "Create Design" again (which reappears in empty state).
- **Download** — Secondary button with download icon. Downloads generated PNG.
- Horizontal layout, centered below artwork, `gap-3` between buttons.

### Post-action flow

1. User configures controls in left panel
2. User clicks **"Create Design"** in center canvas
3. Center canvas shows loading animation → then generated artwork
4. Below artwork: "Create New Design" + "Download" appear
5. Right panel populates with Buyer Fit scores
6. User clicks "Create New Design" → returns to empty state with "Create Design" CTA

**Phase 7B:** "Create Design" changes to "Create Concept" → concept appears in center → then "Generate Artwork". Chat refinement added to right panel.

---

## 7. Interaction Flows

### Flow 1: Arrive from DNA Card (primary flow)

```
ResultsScreen → "Create Similar Design" → Creative Studio
```

1. User clicks "Create Similar Design" on ResultsScreen
2. `initialGenMode` set to `'same_buyer'`
3. Creative Studio opens with:
   - Original section: image + DNA summary populated from `analysisResult`  
   - Creativity: 2 (Inspired)
   - Dimensions: Visual Style=Change, Colors=Change, Graphics=Keep, Typography=Keep, Theme & Mood=Keep, Audience=Keep
4. User reviews original, adjusts any dimensions they want
5. User clicks "Create Design"
6. Generation runs → result appears below

### Flow 2: Arrive from DNA Card ("Remix for Different Audience")

```
ResultsScreen → "Remix for Different Audience" → Creative Studio
```

1. `initialGenMode` set to `'new_buyer'`
2. Creative Studio opens with different defaults:
   - Visual Style=Keep, Colors=Keep, Graphics=Keep, Typography=Keep, Theme & Mood=Change, Audience=Change
3. Audience text input is visible and focused
4. User types new audience → adjusts other controls → Create Design

### Flow 3: Arrive from Compare Results (with winning formula)

```
CompareResultsScreen → "Use Winning Formula" → Creative Studio
```

1. `prefilledBrief` set to winning formula's `suggested_brief`
2. Creative Studio opens with:
   - Applied Patterns section shows "Compare — Winning Formula" chip
   - Visual Style=Change, with the brief text pre-filled in the text input
   - All other dimensions=Change (full remix to apply the winning formula)
   - Creativity: 3 (Remixed)
3. User reviews, optionally adjusts → Create Design

### Flow 4: Adjust and re-generate

1. After viewing a generated result, user scrolls back up
2. Adjusts a dimension toggle or text input
3. Clicks "Create Design" again
4. Previous result is cleared, new generation begins

---

## 8. State Coverage

### Loading states

| State | Visual | Panel |
|-------|--------|-------|
| **Initial load** | No loading — screen is fully client-rendered from existing state | All |
| **Generating** | Left: Button shows spinner + "Creating...", disabled. Center: large pulsing placeholder with sparkle animation. Right: empty/dimmed. | All 3 |

### Empty states

| State | Visual | Panel |
|-------|--------|-------|
| **Center canvas (no generation yet)** | Large empty state: subtle gradient bg, sparkle icon, "Configure your settings and click Create Design" text. Action buttons (Create New + Download) hidden. | Center |
| **Right panel (no generation yet)** | Empty — no content shown. Can show subtle placeholder or be visually "asleep" (dimmed background). | Right |
| **No original** | Should not happen — navigation flow guarantees `analysisResult` exists. Fallback: "No analysis data" + back button in left panel. | Left |
| **No patterns** | Empty state message in Applied Patterns section. Add button disabled with tooltip. | Left |
| **All dimensions Keep** | Left panel shows subtle info hint: "All set to Keep — result will closely follow the original." | Left |

### Error states

| State | Visual | Panel |
|-------|--------|-------|
| **No API key** | Opens Settings modal (same as current) | Modal overlay |
| **Generation API error** | Center canvas shows error card with message + retry button (prominent, centered) | Center |
| **Rate limit** | Specific rate limit message in center canvas error card | Center |

### Edge cases

| Edge case | Handling |
|-----------|----------|
| **User toggles ALL dims to Change but leaves all text inputs empty** | Valid. AI uses creativity level to interpret freely from the original DNA. |
| **Very long text in dimension input** | Text input has no character limit (AI can handle it). CSS truncation via `text-ellipsis` when field is not focused. |
| **User removes a prefilledBrief pattern chip** | Clear the Applied Patterns section. The Visual Style text input retains any text the user typed (don't clear user edits). Reset `prefilledBrief` state to `undefined`. |
| **Viewport too narrow (<1024px)** | Layout may truncate. No special handling — desktop-only tool. |

---

## 9. Interactive Element Count

**Target: ≤8 interactive elements before the action button.**

| # | Element | Type | Always visible? |
|---|---------|------|----------------|
| 1 | Creativity Level slider | Range input | ✅ Left panel |
| 2 | Visual Style: Keep/Change toggle | Segmented control | ✅ Left panel |
| 3 | Colors: Keep/Change toggle | Segmented control | ✅ Left panel |
| 4 | Graphics: Keep/Change toggle | Segmented control | ✅ Left panel |
| 5 | Typography: Keep/Change toggle | Segmented control | ✅ Left panel |
| 6 | Theme & Mood: Keep/Change toggle | Segmented control | ✅ Left panel |
| 7 | Audience: Keep/Change toggle | Segmented control | ✅ Left panel |
| 8 | Add Pattern button | Button (disabled in 7A) | ✅ Left panel |
| — | Create Design button | Primary CTA | ✅ Center canvas |

**Total: 8 configuration elements in left panel + 1 action CTA in center canvas. ✅**

### What doesn't count

| Element | Why it doesn't count |
|---------|---------------------|
| Text inputs (up to 6) | **Conditional** — only visible when a dimension is set to "Change." They are secondary inputs that appear as a consequence of the toggle decision, not primary interactive elements. |
| Pattern remove × buttons | **Conditional** — only visible when patterns are applied. |
| Back button | Navigation, not a design control. |
| Original section | Read-only, 0 interactive elements. |

### Comparison: Current vs New

| | Current GenerationScreen | New Creative Studio |
|---|---|---|
| Mode cards | 3 | 0 (removed) |
| Dimension toggles | 12 (6 × 2 buttons each) | 6 (6 × 1 binary toggle) |
| Dimension text inputs | 6 (always visible areas) | conditional (only when Change) |
| Specificity selector | 3 | 0 (removed) |
| Creativity slider | 1 | 1 |
| Generate button | 1 | 1 |
| **Total always-visible** | **20+** | **8 + action** |

**Reduction: from 20+ to 8 interactive elements. 60% reduction.** ✅

---

## 10. UX Law Justifications

| Decision | UX Law | How it applies |
|----------|--------|----------------|
| Remove 3-mode card selector | **Hick's Law** | 3 modes = 3 choices before the real choices. Each mode required understanding what it auto-toggles. Removing it reduces the initial decision count from 4 (choose mode + adjust 6 dims) to 1 (adjust 6 dims directly). |
| Remove Specificity Level | **Miller's Law** | Reducing from 3 control groups to 2 keeps within 7±2 chunks. Specificity was redundant with the Audience dimension. |
| 6 dimensions with Keep/Change toggle | **Recognition over recall** | Users see the dimension name + current choice at a glance. "Keep" means "use the original" — they don't need to remember what the original was (it's shown above). |
| Original design always visible | **Von Restorff Effect** | The image thumbnail stands out visually among text controls, anchoring the user's mental model. "I'm changing THIS." |
| Smart defaults (most dims Keep) | **Default Effect / Status Quo Bias** | Research shows 70-90% of users keep defaults. By defaulting to the most common use case (same audience, new visual), we optimize for the majority while still allowing full customization. |
| Creativity slider first, dimensions second | **Progressive disclosure** | "How different?" sets the mental frame before "What specifically?" This top-down ordering (general → specific) matches natural decision-making. |
| Text inputs only when "Change" is selected | **Progressive disclosure** | Don't show inputs users don't need. When a dimension is "Keep," the input is meaningless — hiding it reduces visual noise. |
| 3-panel Playground layout | **Jakob's Law** | AI generation workspaces (Google AI Studio, OpenAI Playground, ComfyUI) use panel-based layouts where controls and output are visible simultaneously. |
| Generate button in left panel | **Fitts' Law** | Button is close to the controls the user just configured. No cross-panel mouse travel needed. |
| Center canvas largest | **Von Restorff Effect** | The generated artwork is THE output — it deserves the most visual real estate. Side panels support it. |
| Applied Patterns as removable chips | **Recognition over recall** | Users see pattern names, not IDs. × button for removal is a familiar pattern (email recipients, tag inputs, filter chips). |

---

## 11. Implementation Notes for Developer

### What to keep from current code

| Current code element | Keep / Remove | Notes |
|---------------------|--------------|-------|
| `creativity` state (number 1-5) | **Keep** | Same slider, same labels, same state |
| `creativityLabels` mapping | **Keep** | Labels work well |
| `shifts` state object | **Keep** | Same structure with `S`, `H`, `I`, `F`, `T`, `B` keys and `{keep, value}` shape |
| `shiftConfig` array | **Modify** | Update names to match new display names (see Section 4 table). Remove the letter badges (`dim.key` circles). |
| `constructPrompt()` function | **Keep** | Core prompt construction logic works. Remove `specificity` interpolation. Keep creativity interpolation. |
| `handleGenerate()` function | **Keep** | Same generation flow temporarily (Phase 7B will refactor). |
| `handleChatSend()`, chat UI | **Remove (Phase 7A)** | Chat refinement deferred. Will be re-added in right panel in Phase 7B. |
| `handleDownload()` | **Move to center canvas actions** | Download button below artwork in center canvas. |
| Result section: image | **Move to center canvas** | Generated image displays in center canvas at maximum size. |
| Result section: buyer fit scores | **Move to right panel** | Buyer fit scores display in right panel after generation. |
| Error handling | **Keep** | Errors display in center canvas area. |

### What to remove

| Current code element | Why |
|---------------------|-----|
| `GenerationMode` type and `mode` state | Replaced by smart defaults based on `initialGenMode` prop |
| 3 mode selector cards (L279-L304) | Removed per Decision 1 |
| `SpecificityLevel` type and `specificity` state | Removed per Decision 2 |
| Specificity selector UI (L384-L405) | Removed |
| `specificityLabels` mapping | Removed |
| Specificity in `constructPrompt()` — the line `prompt += \`\\nSpecificity: ...\`` | Remove this one line |
| `useEffect` that auto-toggles shifts based on mode (L56-L105) | Replace with initial defaults logic (see below) |

### What to add

#### 1. New prop: `uploadedImage`

The Creative Studio needs the original image for display. Currently `GenerationScreen` doesn't receive it.

```typescript
interface CreativeStudioProps {
  analysisResult: any;
  uploadedImage: { data: string; name: string; type: string } | null; // NEW
  onNavigate: (screen: any) => void;
  prefilledBrief?: string;
  initialGenMode?: string;
}
```

In `App.tsx`, pass `uploadedImage` to the `GenerationScreen` (or renamed to `CreativeStudio`):
```tsx
<CreativeStudio
  analysisResult={analysisResult}
  uploadedImage={uploadedImage}  // Add this
  onNavigate={setCurrentScreen}
  prefilledBrief={prefilledBrief}
  initialGenMode={initialGenMode}
/>
```

#### 2. Default state logic (replace useEffect mode auto-toggle)

Replace the current `useEffect` that watches `mode` and auto-sets shifts with a simpler initialization:

```typescript
function getInitialShifts(initialGenMode?: string, prefilledBrief?: string) {
  if (prefilledBrief) {
    // Full remix with compare brief
    return {
      S: { keep: false, value: prefilledBrief },
      H: { keep: false, value: '' },
      I: { keep: false, value: '' },
      F: { keep: false, value: '' },
      T: { keep: false, value: '' },
      B: { keep: false, value: '' },
    };
  }
  
  if (initialGenMode === 'new_buyer') {
    // Keep visual, change audience-related
    return {
      S: { keep: true, value: '' },
      H: { keep: true, value: '' },
      I: { keep: true, value: '' },
      F: { keep: true, value: '' },
      T: { keep: false, value: '' },
      B: { keep: false, value: '' },
    };
  }
  
  // Default: same buyer, new design
  return {
    S: { keep: false, value: '' },
    H: { keep: false, value: '' },
    I: { keep: true, value: '' },
    F: { keep: true, value: '' },
    T: { keep: true, value: '' },
    B: { keep: true, value: '' },
  };
}
```

#### 3. Applied Patterns state

```typescript
interface AppliedPattern {
  id: string;
  name: string;
  summary: string;
  sourceCount?: number;
  data?: any; // Full pattern data for prompt construction (Phase 7C)
}

const [appliedPatterns, setAppliedPatterns] = useState<AppliedPattern[]>(() => {
  if (prefilledBrief) {
    return [{
      id: 'compare-brief',
      name: 'Compare — Winning Formula',
      summary: prefilledBrief.slice(0, 60) + '...',
    }];
  }
  return [];
});
```

#### 4. Original Design section component

Create as a local component within the file (or extract to a separate file):

```typescript
function OriginalDesignSection({ 
  uploadedImage, 
  analysisResult 
}: { 
  uploadedImage: any; 
  analysisResult: any; 
}) {
  const style = analysisResult?.visual_dna?.graphics?.style;
  const harmony = analysisResult?.visual_dna?.color?.harmony;
  const tribe = analysisResult?.buyer_dna?.identity_signals?.tribe;
  const emotion = analysisResult?.buyer_dna?.emotional_triggers?.primary_emotion;
  const summary = analysisResult?.visual_dna?.summary;
  
  return (
    <div className="bg-bg-surface1 p-5 rounded-xl border border-border-default">
      <div className="text-[12px] font-medium text-text-tertiary uppercase tracking-wider mb-3">
        Your Original
      </div>
      <div className="flex gap-4">
        {uploadedImage && (
          <img 
            src={uploadedImage.data} 
            alt={uploadedImage.name} 
            className="w-[120px] h-[120px] rounded-lg object-cover border border-border-default flex-shrink-0" 
          />
        )}
        <div className="flex flex-col justify-center gap-2 min-w-0">
          <div className="text-[14px] font-medium truncate">{uploadedImage?.name}</div>
          {summary && (
            <div className="text-[13px] text-text-secondary line-clamp-2">{summary}</div>
          )}
          <div className="flex flex-wrap gap-1.5 mt-1">
            {style && <span className="bg-bg-surface2 px-2 py-1 rounded-md text-[12px] text-text-secondary border border-border-default">{style}</span>}
            {harmony && <span className="bg-bg-surface2 px-2 py-1 rounded-md text-[12px] text-text-secondary border border-border-default">{harmony}</span>}
            {tribe && <span className="bg-bg-surface2 px-2 py-1 rounded-md text-[12px] text-text-secondary border border-border-default">{tribe}</span>}
            {emotion && <span className="bg-bg-surface2 px-2 py-1 rounded-md text-[12px] text-text-secondary border border-border-default">{emotion}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### 5. File rename (required)

Rename `GenerationScreen.tsx` → `CreativeStudio.tsx` to match the new name. Update import in `App.tsx`. Update the Screen type union if needed.

#### 6. Root layout structure (3-panel)

```tsx
return (
  <div className="flex flex-col h-screen bg-bg-base">
    {/* Topbar */}
    <div className="h-14 flex items-center justify-between px-4 border-b border-border-default flex-shrink-0">
      <button onClick={() => onNavigate('results')} className="...">
        <ArrowLeft /> Back to DNA Card
      </button>
      <h1 className="text-[16px] font-semibold">Creative Studio</h1>
      <div>{/* Settings button */}</div>
    </div>
    
    {/* 3-Panel Layout */}
    <div className="flex flex-1 overflow-hidden">
      {/* Left Panel: Configuration Only */}
      <div className="w-[280px] flex-shrink-0 border-r border-border-default overflow-y-auto p-4 space-y-4">
        <OriginalDesignSection />
        <CreativitySlider />
        <DimensionControls />
        <AppliedPatterns />
      </div>
      
      {/* Center Canvas: Artwork + ALL Actions */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-bg-base">
        {generatedImage ? (
          <>
            <img src={generatedImage} className="max-w-full max-h-[calc(100%-60px)] object-contain rounded-xl" />
            <div className="flex gap-3 mt-4">
              <button onClick={handleNewDesign} className="px-4 py-2 bg-bg-surface1 border border-border-default rounded-lg text-[13px] font-medium hover:bg-bg-surface2 flex items-center gap-2">
                <Sparkles size={14} /> Create New Design
              </button>
              <button onClick={handleDownload} className="px-4 py-2 bg-bg-surface1 border border-border-default rounded-lg text-[13px] font-medium hover:bg-bg-surface2 flex items-center gap-2">
                <Download size={14} /> Download
              </button>
            </div>
          </>
        ) : (
          <EmptyCanvasState />
        )}
      </div>
      
      {/* Right Panel: Buyer Fit */}
      <div className="w-[300px] flex-shrink-0 border-l border-border-default overflow-y-auto p-4">
        {showResult && (
          <BuyerFitScores />
        )}
      </div>
    </div>
  </div>
);
```

#### 7. Updated shiftConfig (no letter badges)

```typescript
const dimensionConfig = [
  { key: 'S', name: 'Visual Style', placeholder: 'e.g., Watercolor landscape' },
  { key: 'H', name: 'Colors', placeholder: 'e.g., Cool blues and teals' },
  { key: 'I', name: 'Graphics', placeholder: 'e.g., Cat instead of dog' },
  { key: 'F', name: 'Typography', placeholder: 'e.g., Bold hand-lettered' },
  { key: 'T', name: 'Theme & Mood', placeholder: 'e.g., Calm serenity' },
  { key: 'B', name: 'Audience', placeholder: 'e.g., Yoga moms 30-40' },
];
```

Remove the circular letter badges. The dimension names are descriptive enough — the SHIFT+B framework is an internal model, not user-facing (Phase 6A plain language).

#### 8. Prompt construction update

Remove specificity from prompt. Keep everything else.

```typescript
// Remove this line from constructPrompt():
// prompt += `\nSpecificity: Enforce a ${specificity} context.\n`;
```

#### 9. Center canvas empty state

```tsx
function EmptyCanvasState() {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-[400px]">
      <div className="w-20 h-20 rounded-2xl bg-bg-surface1 border border-border-default flex items-center justify-center mb-6">
        <span className="text-3xl">✨</span>
      </div>
      <h2 className="text-[18px] font-semibold mb-2">Ready to create</h2>
      <p className="text-text-secondary text-[14px]">
        Configure your design controls on the left, then click Create Design
      </p>
    </div>
  );
}
```

#### 10. Right panel: Buyer Fit only

Right panel shows Buyer Fit scores after generation. Same visual design as current, just relocated:

- `BuyerFitScores` — compact card with 4 progress bars (same as current)
- No chat refinement in Phase 7A (deferred)
- No action buttons in right panel (actions are below canvas in center)

### CSS additions needed

Minimal — mainly `h-screen`, `overflow-hidden`, `flex-shrink-0` utilities already available. No new design tokens.

### Accessibility notes

- All toggles must be keyboard-navigable (Keep/Change buttons already have `focus-visible:ring-2`)
- Slider must be reachable via Tab and adjustable with arrow keys (native `<input type="range">` handles this)
- Panel landmark roles: left panel `role="form"`, center `role="main"`, right `role="complementary"`
- Applied Pattern chips: × button needs `aria-label="Remove pattern [name]"`
- The "info hint" for all-Keep state should be `role="status"` for screen readers

---

## Appendix: Scope Compliance Check

| Phase 7A Requirement | Addressed in this spec | Section |
|---------------------|----------------------|---------|
| F2-01: Creative Studio screen | ✅ Complete redesign | All sections |
| F2-02: Original design always visible | ✅ Section 3 — image + DNA summary | §3 |
| F2-03: Design Controls with Keep/Change | ✅ 6 dimensions with toggles | §4 |
| F2-04: Creativity Level slider (5 levels) | ✅ Retained as-is | §4 |
| F2-05: Pattern integration UI | ✅ Applied Patterns section with add/remove | §5 |

| NOT in 7A scope | Confirmed excluded |
|-----------------|-------------------|
| F2-06: Concept synthesis API | ✅ Not designed — placeholder note in §6 |
| F2-07: Concept review card | ✅ Not designed — placeholder note in §6 |
| F2-08: Multimodal generation | ✅ Not designed — uses current API temporarily |
| F2-09: POD-ready output | ✅ Not designed |
| F2-10: Chat refinement | ✅ Not redesigned — kept as-is from current |
| F2-11: Download | ✅ Not redesigned — kept as-is from current |
| F2-12: Aspect ratio | ✅ Not designed |

---

*End of UX Specification — Ready for developer implementation*
