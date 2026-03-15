# DesignDNA — Style Guide

> **Purpose:** This document defines all visual design tokens, component patterns, layout specifications, and interaction behaviors for the DesignDNA application. Embed this directly into AI Studio System Instructions so Gemini generates consistent, high-quality UI code.
>
> **Aesthetic:** Raycast-inspired dark mode — polished surfaces, strong visual hierarchy, smooth interactions, subtly "alive" feel.

---

## 1. Design Philosophy

DesignDNA uses a **premium dark interface** inspired by Raycast: clean surfaces with subtle depth through elevation and borders, a single brand accent color used sparingly, and thoughtful micro-animations that make the interface feel responsive without being distracting.

**Core Principles:**
- **Depth through elevation** — surfaces get progressively lighter, not through shadows but through background lightness + border definition
- **Mono-accent clarity** — one brand color (`#0096ED`) for all interactive elements; AI-specific actions use a gradient variant
- **Spacious breathing room** — generous whitespace, large headings, clearly defined sections
- **Quiet confidence** — no glow effects, no neon, no excessive gradients. Flat, clean, professional

**Anti-Patterns (DO NOT):**
- ❌ Glow/neon effects on any element
- ❌ Gradients on non-AI elements (only AI action buttons and loading states use gradients)
- ❌ Overly rounded/playful shapes (this is a professional design tool, not a consumer toy)
- ❌ Bright/saturated backgrounds
- ❌ Multiple accent colors — stick to `#0096ED` only
- ❌ Heavy shadows — use borders for depth instead

---

## 2. Color System

### 2.1 Base & Surfaces

| Token | Value | Usage |
|-------|-------|-------|
| `color.bg.base` | `#0B0F19` | Page background, app shell |
| `color.bg.surface1` | `#111827` | Cards, panels, topbar, input backgrounds |
| `color.bg.surface2` | `#1E293B` | Elevated cards, nested containers, hover states on surface1 |
| `color.bg.surface3` | `#273549` | Tooltips, dropdowns, popovers |

### 2.2 Borders

| Token | Value | Usage |
|-------|-------|-------|
| `color.border.default` | `rgba(255, 255, 255, 0.06)` | Card borders, dividers, tab bar bottom border |
| `color.border.hover` | `rgba(255, 255, 255, 0.10)` | Hover state on bordered elements |
| `color.border.active` | `rgba(255, 255, 255, 0.15)` | Active/focused non-brand borders |
| `color.border.brand` | `#0096ED` | Focus rings, active tabs, selected states |

### 2.3 Brand Accent

| Token | Value | Usage |
|-------|-------|-------|
| `color.accent.primary` | `#0096ED` | Buttons (primary), links, active tab underline, selected radio/checkbox, slider fill, focus rings |
| `color.accent.hover` | `#0082D4` | Primary button hover (10% darker) |
| `color.accent.subtle` | `rgba(0, 150, 237, 0.10)` | Brand tint backgrounds (upload drag state, selected card bg) |
| `color.accent.ring` | `rgba(0, 150, 237, 0.25)` | Focus ring outline |

### 2.4 AI Gradient

Used ONLY for AI-powered action buttons, loading states, and generation-active indicators.

| Token | Value | Usage |
|-------|-------|-------|
| `color.ai.gradient` | `linear-gradient(135deg, #0096ED 0%, #7C3AED 100%)` | AI action buttons (Analyze, Generate), shimmer loading effect |
| `color.ai.gradient-hover` | `linear-gradient(135deg, #0082D4 0%, #6D2ED4 100%)` | AI button hover state |
| `color.ai.purple` | `#7C3AED` | Secondary AI accent when needed standalone |

### 2.5 Text Colors

| Token | Value | Usage |
|-------|-------|-------|
| `color.text.primary` | `rgba(255, 255, 255, 0.92)` | Headings, body text, values in data displays |
| `color.text.secondary` | `rgba(255, 255, 255, 0.60)` | Descriptions, labels in data displays, secondary info |
| `color.text.tertiary` | `rgba(255, 255, 255, 0.40)` | Placeholders, captions, disabled text, helper text |
| `color.text.inverse` | `#FFFFFF` | Text on brand/gradient backgrounds |
| `color.text.brand` | `#0096ED` | Links, interactive text |

### 2.6 Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `color.semantic.success` | `#22C55E` | Checkmarks, positive scores, passed states |
| `color.semantic.success-subtle` | `rgba(34, 197, 94, 0.10)` | Success background tint |
| `color.semantic.warning` | `#F59E0B` | Caution indicators, medium scores |
| `color.semantic.warning-subtle` | `rgba(245, 158, 11, 0.10)` | Warning background tint |
| `color.semantic.error` | `#EF4444` | Error states, failed validation |
| `color.semantic.error-subtle` | `rgba(239, 68, 68, 0.10)` | Error background tint |

### 2.7 State Overlays

| Token | Value | Usage |
|-------|-------|-------|
| `color.state.hover` | `rgba(255, 255, 255, 0.04)` | Hover overlay on interactive elements |
| `color.state.active` | `rgba(255, 255, 255, 0.06)` | Active/pressed overlay |
| `color.state.disabled-opacity` | `0.40` | Opacity for disabled elements |
| `color.state.focus-ring` | `0 0 0 2px rgba(0, 150, 237, 0.25)` | Focus ring box-shadow |

---

## 3. Typography System

### 3.1 Font Stack

```
font-family: 'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Google Fonts Import:**
```
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

### 3.2 Type Scale

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `type.h1` | 32px | 700 (Bold) | 1.2 (38px) | -0.02em | Page titles, hero headlines |
| `type.h2` | 20px | 600 (SemiBold) | 1.3 (26px) | -0.01em | Section headers, card titles |
| `type.h3` | 16px | 600 (SemiBold) | 1.4 (22px) | 0 | Subsection headers |
| `type.body` | 14px | 400 (Regular) | 1.5 (21px) | 0 | Body text, descriptions |
| `type.body-medium` | 14px | 500 (Medium) | 1.5 (21px) | 0 | Emphasized body, values in data display |
| `type.small` | 12px | 400 (Regular) | 1.4 (17px) | 0.02em | Labels, metadata, tabs |
| `type.small-medium` | 12px | 500 (Medium) | 1.4 (17px) | 0.02em | Active tab labels, badge text |
| `type.caption` | 11px | 400 (Regular) | 1.4 (15px) | 0.03em | HEX codes under color swatches, fine print |

### 3.3 Data Display Pattern

For structured data (DNA analysis results), use inline `Label: Value` format:

```
Label (type.small, color.text.secondary, weight 400):  Value (type.body-medium, color.text.primary, weight 500)
```

Example rendering:
```
Grid: Rule of Thirds    Flow: Top → Bottom    Density: Moderate
```

Labels and values sit on the same line. Label in muted secondary color, value in primary color with medium weight. This creates a compact, scannable layout.

---

## 4. Spacing System

### 4.1 Base Unit

Base unit: **4px**

### 4.2 Spacing Scale

| Token | Value | Common Usage |
|-------|-------|-------------|
| `space.1` | 4px | Tight gaps (icon to label) |
| `space.2` | 8px | List item gaps, inline spacing |
| `space.3` | 12px | Button internal vertical padding, compact sections |
| `space.4` | 16px | Standard gaps between items, mobile page margins |
| `space.5` | 20px | Button horizontal padding |
| `space.6` | 24px | Card internal padding, section title to content |
| `space.8` | 32px | Between major sections, desktop page margins |
| `space.10` | 40px | Large section breaks |
| `space.12` | 48px | Hero vertical padding |
| `space.16` | 64px | Page top/bottom padding |
| `space.20` | 80px | Major layout breaks |

### 4.3 Component Spacing Presets

| Component | Padding | Gap |
|-----------|---------|-----|
| Card (generic) | 24px | — |
| Card (mini/compact) | 16px | — |
| Button (primary) | 12px 20px | — |
| Button (small) | 8px 16px | — |
| Input / TextArea | 10px 14px | — |
| Section to section | — | 32px |
| Items in a list | — | 8px |
| Items in a grid | — | 16px |
| Tab bar items | — | 24px |
| Action cards (landing) | — | 16px |
| Made For Me mini-cards | — | 8px |

---

## 5. Component Patterns

### 5.1 Cards

#### DNA Card (Analysis Result)

**Layout:** Split — uploaded image fixed on the left (40% width, `position: sticky; top: 80px`), scrollable DNA content on the right (60%).

| Property | Value |
|----------|-------|
| Background | `color.bg.surface1` |
| Border | 1px solid `color.border.default` |
| Border Radius | 12px |
| Padding | 0 (image flush to edge), 24px (content side) |
| Min Height | 480px |
| Image | Object-fit cover, border-radius 12px 0 0 12px |

The user must always see the original uploaded image while reading the analysis. On mobile (<768px), stack vertically — image on top (max-height 300px), content below.

#### Action Card (Landing Screen)

| Property | Value |
|----------|-------|
| Background | `color.bg.surface1` |
| Border | 1px solid `color.border.default` |
| Border Radius | 12px |
| Padding | 24px |
| Hover BG | `color.bg.surface2` |
| Hover Border | `color.border.hover` |
| Transition | 200ms ease |
| Cursor | pointer |
| Content | Icon (24px, `color.accent.primary`) + Title (type.h3) + Description (type.body, secondary color) |

Three action cards in a row: **Analyze**, **Compare**, **Quick Generate** (placeholder/disabled).

#### Mini Card ("Made For Me" Decisions)

| Property | Value |
|----------|-------|
| Background | `color.bg.surface2` |
| Border | 1px solid `color.border.default` |
| Border Radius | 8px |
| Padding | 16px |
| Layout | Icon (20px, left-aligned) + Title (type.body-medium, bold) + Explanation (type.body, secondary color, below title) |
| Stack Gap | 8px between mini-cards |
| Behavior | All visible, NO collapse/accordion — this is the most important section |

#### Buyer Fit Analysis Card

| Property | Value |
|----------|-------|
| Background | `color.bg.surface1` |
| Border | 1px solid `color.border.default` |
| Border Radius | 12px |
| Padding | 24px |
| Content | Score rows with label + percentage + status icon (✅/⚠️), stacked vertically with 8px gaps |
| Scores | Use `color.semantic.success` for ≥70%, `color.semantic.warning` for 50-69%, `color.semantic.error` for <50% |

#### Winning Formula Card (Batch Compare)

| Property | Value |
|----------|-------|
| Background | `color.bg.surface1` |
| Border | 1px solid `color.border.default` |
| Border Radius | 12px |
| Padding | 24px |
| Sections | Visual formula (labeled), Buyer formula (labeled), Suggested Brief (highlighted box with surface2 bg, italic text) |
| Action | "Generate from Formula" button (AI gradient) at bottom |

### 5.2 Buttons

#### Primary Button

| Property | Value |
|----------|-------|
| Background | `color.accent.primary` |
| Text Color | `#FFFFFF` |
| Font | type.body-medium (14px, 500) |
| Padding | 12px 20px |
| Border Radius | 8px |
| Border | none |
| Hover | Background → `color.accent.hover` |
| Active | Background → `#006DB3` |
| Disabled | opacity 0.4, pointer-events none |
| Transition | background 150ms ease |

#### AI Action Button (Analyze, Generate)

| Property | Value |
|----------|-------|
| Background | `color.ai.gradient` |
| Text Color | `#FFFFFF` |
| Font | type.body-medium (14px, 600) |
| Padding | 14px 24px |
| Border Radius | 8px |
| Border | none |
| Hover | `color.ai.gradient-hover`, subtle shimmer animation |
| Icon | ✨ or relevant icon, 16px, left of text |
| Min Width | 160px |

#### Secondary Button

| Property | Value |
|----------|-------|
| Background | transparent |
| Text Color | `color.text.primary` |
| Border | 1px solid `color.border.hover` (`rgba(255,255,255,0.10)`) |
| Border Radius | 8px |
| Padding | 12px 20px |
| Hover | Border → `color.border.active`, BG → `color.state.hover` |

#### Ghost Button

| Property | Value |
|----------|-------|
| Background | transparent |
| Text Color | `color.text.secondary` |
| Border | none |
| Padding | 8px 16px |
| Hover | BG → `color.state.hover`, Text → `color.text.primary` |

### 5.3 Tabs

**Style:** Underline tabs (not pill/boxed)

| Property | Value |
|----------|-------|
| Tab Bar | Bottom border 1px `color.border.default` |
| Tab Text | type.small (12px), uppercase, letter-spacing 0.05em |
| Inactive Tab | Color `color.text.secondary`, no underline |
| Active Tab | Color `color.text.primary`, 2px bottom border `color.accent.primary` |
| Hover (inactive) | Color `color.text.primary` (slightly brighter) |
| Tab Gap | 24px between tabs |
| Tab Padding | 12px 0 (vertical), text only |
| Transition | color 150ms, border 150ms |

Used for DNA Card (Visual DNA | Buyer DNA tabs).

### 5.4 Upload Zone

| Property | Value |
|----------|-------|
| Background | `color.bg.surface1` |
| Border | 2px dashed `rgba(255, 255, 255, 0.15)` |
| Border Radius | 12px |
| Padding | 48px 24px |
| Text Alignment | Center |
| Content | Upload icon (32px, `color.text.tertiary`) + "Drop image here or click to browse" (type.body, secondary) + "PNG, JPEG, WEBP" (type.caption, tertiary) |
| Hover | Border → 2px dashed `color.accent.primary`, BG → slight lighten |
| Dragging | Border → 2px solid `color.accent.primary`, BG → `color.accent.subtle` |
| Transition | border 200ms, background 200ms |

**Multi-image Upload (Batch Compare):**
- Same base style but wider/shorter
- Shows thumbnails of uploaded images in a horizontal row (up to 5)
- Each thumbnail: 80x80px, object-fit cover, border-radius 8px, 1px border
- "Add more" placeholder slot with dashed border and + icon
- Counter: "2 of 5 images" in caption text

### 5.5 Color Palette Display (DNA Card)

**Proportional Color Bar:**

| Property | Value |
|----------|-------|
| Container | border-radius 8px, overflow hidden, height 40px |
| Segments | Horizontal blocks, widths proportional to 60-30-10 ratio |
| Segment Style | No gap between segments, flush edges |
| Labels Below | HEX code (type.caption, `color.text.secondary`), centered under each segment, 4px gap above |

Below the color bar:
- Harmony type (e.g., "Analogous") — type.small, secondary color
- Temperature (e.g., "Warm Earthy") — type.small, secondary color
- Contrast level (e.g., "Medium") — type.small, secondary color

All on one line, pipe-separated: `Analogous | Warm Earthy | Medium`

### 5.6 Sliders (Creativity Level)

| Property | Value |
|----------|-------|
| Track Height | 4px |
| Track BG | `color.bg.surface2` |
| Track Border Radius | 9999px (fully rounded) |
| Fill | `color.accent.primary` |
| Thumb Size | 16px circle |
| Thumb BG | `#FFFFFF` |
| Thumb Shadow | `0 1px 3px rgba(0,0,0,0.3)` |
| Thumb Hover | scale(1.15) |
| Stops | 5 discrete positions, evenly spaced |
| Stop Labels | Below track, type.caption, centered under each stop |
| Active Label | type.small-medium, `color.text.primary` |
| Inactive Labels | type.caption, `color.text.tertiary` |

Labels: `1 Faithful` · `2 Inspired` · `3 Remixed` · `4 Bold` · `5 Radical`

### 5.7 Inputs & Text Areas

| Property | Value |
|----------|-------|
| Background | `color.bg.surface1` |
| Border | 1px solid `color.border.hover` (`rgba(255,255,255,0.10)`) |
| Border Radius | 8px |
| Padding | 10px 14px |
| Text | type.body, `color.text.primary` |
| Placeholder | type.body, `color.text.tertiary` |
| Focus Border | `color.accent.primary` |
| Focus Ring | `color.state.focus-ring` |
| Disabled | opacity 0.4, pointer-events none, BG `color.bg.surface2` |
| Transition | border 150ms, box-shadow 150ms |

**Text Area (Chat Refinement):**
- Same styling as input
- Min-height: 44px, max-height: 120px, auto-resize
- Send button inside right side: ghost style icon button, 32x32px

### 5.8 Radio Groups & Selectors

#### Mode Selector (Generation Modes)

| Property | Value |
|----------|-------|
| Layout | Vertical stack, 8px gap |
| Item BG | `color.bg.surface1` |
| Item Border | 1px solid `color.border.default` |
| Item Border Radius | 8px |
| Item Padding | 12px 16px |
| Selected Item | Border → `color.accent.primary`, BG → `color.accent.subtle` |
| Radio Dot | 16px circle, 2px border `color.border.active`, selected = filled `color.accent.primary` |
| Label | type.body-medium, `color.text.primary` |

Three options: "Same Buyer, New Design" / "Same Style, New Buyer" / "Full Remix"

#### Specificity Level Selector

| Property | Value |
|----------|-------|
| Layout | Horizontal row, 8px gap |
| Item BG | transparent |
| Item Border | 1px solid `color.border.default` |
| Item Border Radius | 8px |
| Item Padding | 8px 16px |
| Selected | BG → `color.accent.primary`, Text → white, Border → `color.accent.primary` |
| Hover | Border → `color.border.hover` |

Three options: `General` / `Niche` / `Hyper-niche`

### 5.9 SHIFT+B Dimension Controls

Each of the 6 dimensions (S, H, I, F, T, B) is a row:

| Property | Value |
|----------|-------|
| Row Layout | `[Letter Badge] [Dimension Name] [Keep/Change Toggle] [Input if Change]` |
| Badge | 24px square, border-radius 6px, `color.bg.surface2`, type.small-medium centered, `color.accent.primary` text |
| Dimension Name | type.body, `color.text.primary` |
| Toggle | Two-segment toggle: "Keep" / "Change" |
| Keep State | Muted appearance, checkmark icon, current value shown in secondary text |
| Change State | Active appearance, text input appears for user to specify new direction |
| Input | Inline, compact (height 36px), width fills remaining row space |

### 5.10 Score Displays & Badges

#### Percentage Score

| Property | Value |
|----------|-------|
| Layout | Inline: `Label  XX%  ✅` |
| Score Text | type.h3 (16px, 600), colored by threshold |
| ≥70% | `color.semantic.success` |
| 50-69% | `color.semantic.warning` |
| <50% | `color.semantic.error` |
| Status Icon | 16px, matching semantic color |

#### Count Badge

| Property | Value |
|----------|-------|
| Background | `color.bg.surface2` |
| Border Radius | 9999px |
| Padding | 2px 8px |
| Text | type.caption, `color.text.secondary` |

### 5.11 Loading Skeleton

| Property | Value |
|----------|-------|
| Base Color | `color.bg.surface2` |
| Shimmer Highlight | `rgba(255, 255, 255, 0.05)` |
| Animation | Linear gradient sweep left-to-right, 1.5s duration, infinite |
| Border Radius | Same as target element (8px for text blocks, 12px for cards) |
| Shapes | Rectangles matching content layout (title bar, text lines, color blocks) |

### 5.12 Buyer Overlap Map (Batch Compare)

| Property | Value |
|----------|-------|
| Layout | Horizontal comparison grid showing overlap dimensions |
| Section BG | `color.bg.surface1` |
| Shared Profile | Surface2 highlight box with icon + summary text |
| Pattern List | Numbered list with checkmark icons, each pattern in a mini-card style row |
| Specificity Ladder | Visual scale from ❌ (generic) → ✅ (niche) → ✅✅ (hyper-niche), using semantic colors |

---

## 6. Layout Patterns

### 6.1 App Shell

| Property | Value |
|----------|-------|
| Topbar Height | 56px |
| Topbar BG | `color.bg.surface1` |
| Topbar Border | Bottom 1px `color.border.default` |
| Topbar Content | Logo icon (24px) + "DesignDNA" wordmark (type.body-medium, `color.text.primary`), left-aligned, 16px gap between icon and text |
| Topbar Padding | 0 32px (desktop), 0 16px (mobile) |
| Content Area | Below topbar, full viewport height minus 56px |
| Content Max Width | 1200px |
| Content Centering | margin: 0 auto |
| Content Padding | 32px (desktop), 16px (mobile) |

The topbar is fixed/sticky at the top. Logo + wordmark always visible on every screen.

### 6.2 Landing Screen

| Property | Value |
|----------|-------|
| Hero Section | Centered, padding-top 64px, padding-bottom 40px |
| Tagline | type.h1, `color.text.primary`, text-align center |
| Subtitle | type.body, `color.text.secondary`, text-align center, max-width 560px, margin 0 auto, 8px below tagline |
| Action Cards | 3-column grid, equal widths, 16px gap, max-width 840px, centered |
| Mobile | 1-column stack, full width |

**Tagline text:** "Understand why designs sell. Create originals from insights."

**Subtitle text:** "Upload any design → AI decodes Visual DNA + Buyer DNA → Generate new designs that hit the same emotional triggers."

### 6.3 Analysis Screen (DNA Card)

| Property | Value |
|----------|-------|
| Layout | CSS Grid: `grid-template-columns: 2fr 3fr` (40% / 60%) |
| Gap | 0 (image flush to content panel) |
| Image Panel | `position: sticky; top: 80px; align-self: start` |
| Image | Object-fit cover, 100% width, border-radius 12px 0 0 12px |
| Content Panel | Padding 24px 32px, overflow-y auto |
| Tab Bar | At top of content panel |
| Sections | Vertically stacked, 24px gap between major sections |
| Mobile (<768px) | Stack vertically — image full-width (max-height 300px), content below, no sticky |

### 6.4 Generation Screen

| Property | Value |
|----------|-------|
| Layout | Single column, max-width 640px, centered (margin 0 auto) |
| Sections | Stacked: Mode Selector → Creativity Slider → SHIFT+B Controls → Specificity Level → Generate Button |
| Section Gap | 32px |
| Back Navigation | ← icon + "DNA Card" text, top-left, ghost button style |
| Generate Button | Full width, AI gradient, large (14px 24px padding) |

### 6.5 Generated Result Screen

| Property | Value |
|----------|-------|
| Layout | Single column, max-width 720px, centered |
| Image Display | Full width, border-radius 12px, border 1px, max-height 480px, object-fit contain |
| Buyer Fit Card | Below image, 16px gap |
| Chat Refinement | Below Buyer Fit card, 16px gap |
| Action Bar | Below chat, 16px gap, horizontal row: Download (primary) + Regenerate (secondary) + View DNA (ghost) |

### 6.6 Batch Compare Screen

| Property | Value |
|----------|-------|
| Upload Area | Full width, multi-image upload zone |
| Results | Vertical stack: Visual Patterns → Buyer Overlap Map → "Made For Me" Patterns → Winning Formula |
| Section Gap | 24px |
| Image Thumbnails | Horizontal scroll row at top (after upload), 80x80px each |
| Winning Formula CTA | AI gradient button "Generate from Formula" at bottom of formula card |

---

## 7. Animation & Interaction

### 7.1 Screen Transitions

| Property | Value |
|----------|-------|
| Type | Fade + translateY |
| Initial State | opacity: 0, translateY: 8px |
| Final State | opacity: 1, translateY: 0 |
| Duration | 200ms |
| Easing | ease-out |
| Trigger | On screen/route change |

### 7.2 Loading Skeleton Shimmer

| Property | Value |
|----------|-------|
| Animation | `@keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }` |
| Background | `linear-gradient(90deg, color.bg.surface2 25%, rgba(255,255,255,0.05) 50%, color.bg.surface2 75%)` |
| Background Size | 200% 100% |
| Duration | 1.5s |
| Timing | linear, infinite |

### 7.3 DNA Card — Staggered Reveal

When analysis results arrive, each section of the DNA Card fades in with stagger:

| Property | Value |
|----------|-------|
| Each Section | opacity: 0 → 1, translateY: 12px → 0 |
| Duration | 300ms per section |
| Stagger Delay | 100ms between sections |
| Easing | ease-out |
| Effect | Creates "AI is thinking" feel — sections appear one by one |

Order: Composition → Color → Typography → Graphics → POD Tech (Visual tab) or Persona → Identity → Emotional → Occasion → Made For Me (Buyer tab).

### 7.4 Button Interactions

| State | Animation |
|-------|-----------|
| Hover | Background color transition, 150ms ease |
| Active/Press | scale(0.98), 100ms ease |
| AI Button Shimmer | Subtle gradient shift on hover, 2s ease infinite (very subtle, not distracting) |

### 7.5 Micro-Interactions

| Element | Behavior |
|---------|----------|
| Tab Switch | Content fade: 150ms opacity transition |
| Upload Zone Drag | 200ms border + background transition |
| Slider Thumb | scale(1.15) on hover, 150ms |
| Card Hover | Border brightens + BG shifts (200ms) |
| Radio Select | 150ms border + bg color transition |
| Focus Ring | 150ms box-shadow transition |
| Mini-card appearance | Same as DNA card stagger but for each mini-card |

### 7.6 Loading States

| Context | Behavior |
|---------|----------|
| Analysis in progress | Full skeleton layout in DNA card area — shimmer blocks matching text/section shapes |
| Generation in progress | Centered spinner (24px, brand color) + "Generating your design..." text + progress indication if available |
| Batch analysis | Skeleton per image thumbnail + skeleton for results below |

---

## 8. Responsive Breakpoints

| Breakpoint | Width | Layout Behavior |
|------------|-------|-----------------|
| Desktop | ≥1024px | Split layouts, 3-column grids, sticky image panel, full topbar |
| Tablet | 768–1023px | Stacked layouts, 2-column grids where applicable, reduced padding |
| Mobile | <768px | Single column, full-width components, nav simplification |

### 8.1 Responsive Adjustments

| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Page padding | 32px | 24px | 16px |
| Action cards | 3 columns | 2 columns | 1 column (stacked) |
| DNA Card | Split (40/60) | Split (45/55) | Stacked (image top) |
| Generation controls | 640px centered | 640px centered | Full width |
| Topbar padding | 0 32px | 0 24px | 0 16px |
| H1 size | 32px | 28px | 24px |
| H2 size | 20px | 18px | 16px |
| Upload zone padding | 48px 24px | 40px 20px | 32px 16px |

---

## 9. Quick Reference Token Table

Self-contained lookup table. An AI reading ONLY this table should generate consistent UI.

### Colors

| Token | Value | When to Use |
|-------|-------|-------------|
| `bg.base` | `#0B0F19` | Page background |
| `bg.surface1` | `#111827` | Cards, panels, topbar, inputs |
| `bg.surface2` | `#1E293B` | Nested containers, hover, mini-cards |
| `bg.surface3` | `#273549` | Tooltips, popovers |
| `border.default` | `rgba(255,255,255,0.06)` | Card borders, dividers |
| `border.hover` | `rgba(255,255,255,0.10)` | Hover borders, input default border |
| `border.active` | `rgba(255,255,255,0.15)` | Active borders |
| `accent` | `#0096ED` | Buttons, links, focus, active states |
| `accent.hover` | `#0082D4` | Button hover |
| `accent.subtle` | `rgba(0,150,237,0.10)` | Tint backgrounds |
| `ai.gradient` | `#0096ED → #7C3AED` | AI buttons, loading shimmer |
| `text.primary` | `rgba(255,255,255,0.92)` | Headings, body, values |
| `text.secondary` | `rgba(255,255,255,0.60)` | Labels, descriptions |
| `text.tertiary` | `rgba(255,255,255,0.40)` | Placeholders, captions |
| `success` | `#22C55E` | Positive indicators |
| `warning` | `#F59E0B` | Caution indicators |
| `error` | `#EF4444` | Error states |

### Typography

| Style | CSS | When to Use |
|-------|-----|-------------|
| H1 | `32px/1.2, Inter 700, -0.02em` | Page titles |
| H2 | `20px/1.3, Inter 600, -0.01em` | Section headers |
| H3 | `16px/1.4, Inter 600` | Subsections |
| Body | `14px/1.5, Inter 400` | Content |
| Body Medium | `14px/1.5, Inter 500` | Values, emphasis |
| Small | `12px/1.4, Inter 400, 0.02em` | Labels |
| Caption | `11px/1.4, Inter 400, 0.03em` | HEX codes, fine print |

### Spacing

| Size | Value | Common Use |
|------|-------|------------|
| XS | 4px | Icon gaps |
| S | 8px | List items, inline |
| M | 16px | Grid gaps, mobile margins |
| L | 24px | Card padding, tab gaps |
| XL | 32px | Section gaps, desktop margins |
| 2XL | 48px | Hero padding |

### Radius

| Element | Value |
|---------|-------|
| Cards, panels | 12px |
| Buttons, inputs | 8px |
| Mini-cards | 8px |
| Badges, pills | 9999px |
| Letter badges | 6px |
| Image in card | 12px 0 0 12px (left) |

### Transitions

| Type | Duration | Easing |
|------|----------|--------|
| Color/BG change | 150ms | ease |
| Layout/position | 200ms | ease-out |
| Fade in (content) | 300ms | ease-out |
| Shimmer sweep | 1500ms | linear |
| Stagger delay | 100ms | — |

### Component Summary

| Component | BG | Border | Radius | Padding |
|-----------|----|----|-------|---------|
| Card (standard) | surface1 | default | 12px | 24px |
| Card (mini) | surface2 | default | 8px | 16px |
| Button (primary) | accent | none | 8px | 12px 20px |
| Button (AI) | gradient | none | 8px | 14px 24px |
| Button (secondary) | transparent | hover | 8px | 12px 20px |
| Input / TextArea | surface1 | hover | 8px | 10px 14px |
| Upload zone | surface1 | dashed 15% | 12px | 48px 24px |
| Tab bar | transparent | bottom default | 0 | 12px 0 |

---

*Last updated: 2026-03-15*
*Phase: 01-ui-ux-style-definition*
*Deliverable for: AI Studio System Instructions embedding*
