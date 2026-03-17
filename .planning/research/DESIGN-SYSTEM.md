# Krea AI Design System Extraction

**Source:** krea.ai
**Method:** Puppeteer CSS extraction + LLM Vision + Web research + Manual analysis
**Researched:** 2026-03-17
**Extraction script:** `extract-url-styles.js` (Puppeteer, viewport 1440×900)

---

## 1. Color Palette

### CSS-Extracted Colors (HIGH confidence)

#### Backgrounds
| Hex | Role | Usage |
|-----|------|-------|
| `#000000` | App background (dark mode) | Primary app surface, hero sections |
| `#101010` | Card/panel background | Sidebar, elevated panels |
| `#262626` | Elevated surface | Input fields, secondary panels, hover states |
| `#E5E5E5` | Light divider | Borders, light mode dividers |
| `#F5F5F5` | Light surface | Light mode backgrounds, pricing cards |
| `#FFFFFF` | White surface | Cards, modals, light mode primary |

#### Text Colors
| Hex | Role | Usage |
|-----|------|-------|
| `#000000` | Primary text (light mode) | Headings on white backgrounds |
| `#404040` | Secondary text | Body text, descriptions |
| `#525252` | Tertiary text | Captions, meta info |
| `#737373` | Muted text | Placeholder text, disabled states |
| `#A3A3A3` | Subtle text (dark mode) | Secondary text on dark backgrounds |
| `#FFFFFF` | Primary text (dark mode) | Headings on dark backgrounds |

#### Borders
| Hex | Role |
|-----|------|
| `#FFFFFF` at 10% opacity | Subtle border (inset ring via `oklab` shadows) |

#### Accents
| Hex | Role |
|-----|------|
| `#000000` | Primary CTA background (dark) |
| `#262626` | Secondary accent |
| `#404040` | Hover state accent |
| `#E5E5E5` | Light accent / divider |
| `#FFFFFF` | Primary CTA text / outline button |

### Color Roles (LLM-Analyzed — MEDIUM confidence)

| Role | Default (Dark Mode) | Light Mode Equivalent |
|------|--------------------|-----------------------|
| **Primary** | `#FFFFFF` (white on dark) | `#000000` (black on light) |
| **Background** | `#000000` | `#FFFFFF` |
| **Surface** | `#101010` → `#262626` | `#F5F5F5` → `#E5E5E5` |
| **Text Primary** | `#FFFFFF` | `#000000` |
| **Text Secondary** | `#A3A3A3` | `#525252` |
| **Text Muted** | `#737373` | `#737373` |
| **Border** | `rgba(255,255,255,0.1)` | `rgba(0,0,0,0.1)` |
| **Accent (CTA)** | `#FFFFFF` bg + `#000000` text | `#000000` bg + `#FFFFFF` text |

### Color Philosophy
- **Achromatic-first:** Entire palette is grayscale — no brand color hue
- **High contrast:** Pure black/white for maximum readability
- **Neutral gray scale:** Steps follow Tailwind neutral scale (050, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
- **Dark mode default:** App interface is dark; landing page transitions between dark hero → white content sections

---

## 2. Typography

### Extracted Font (HIGH confidence)

| Property | Value |
|----------|-------|
| **Primary font** | `Suisse Intl` |
| **Fallback stack** | `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"` |
| **Font source** | Custom web font (self-hosted, Swiss Typefaces) |
| **Category** | Geometric sans-serif (similar to Inter, Helvetica Neue) |

### Type Scale (CSS-Extracted)

| Token | Size | Weight | Line-Height | Usage |
|-------|------|--------|-------------|-------|
| `display-xl` | 96px | 700 | 96px (1.0) | Hero headline (landing page) |
| `display-lg` | 72px | 700 | 72–75.6px (1.0–1.05) | Section headlines |
| `h1` | 36px | 700 | 37.5px (1.04) | Page titles |
| `h2` | 30px | 600 | 36px (1.2) | Section headings |
| `h3` | 24px | 600 | 30–32px (1.25–1.33) | Card titles, feature names |
| `h4` | 20px | 600 | 28px (1.4) | Sub-headings |
| `body-lg` | 18px | 400 | 25px (1.39) | Lead paragraphs |
| `body` | 16px | 400 | 24px (1.5) | Body text |
| `body-sm` | 15px | 400–450 | 22.5px (1.5) | Secondary body |
| `label` | 14px | 450–500 | 20px (1.43) | Labels, nav items, button text |
| `caption` | 13px | 400 | 18px (1.38) | Captions, metadata |
| `micro` | 12px | 400–500 | 16.5px (1.38) | Badges, small labels |
| `nano` | 11px | 400 | 13–16px | Timestamps, micro-text |

### Weight System

| Token | Weight | Usage |
|-------|--------|-------|
| `regular` | 400 | Body text, descriptions |
| `book` | 450 | Secondary body, slightly emphasized |
| `medium` | 500 | Labels, navigation, interactive text |
| `semibold` | 600 | Sub-headings, card titles |
| `bold` | 700 | Headlines, hero text, CTAs |

### Typography Notes
- **Single font family** — Suisse Intl serves all purposes (headings + body)
- **Weight 450 ("book")** is a distinctive detail — lighter than medium but heavier than regular, used for body text that needs subtle emphasis
- **Tight line-heights** on display text (1.0), comfortable (1.4–1.5) on body
- **No letter-spacing adjustments** detected — clean default tracking
- **Closest free alternative:** Inter (very similar geometric sans-serif with variable weight support)

---

## 3. Spacing System

### CSS-Extracted Values (HIGH confidence)

#### Padding Scale
```
8px → 12px → 16px → 20px → 28px → 32px → 44px → 64px → 90px → 96px → 160px
```

#### Margin Scale
```
16px → 32px → 40px → 48px → 64px → 80px
```

#### Gap Scale
```
4px → 8px → 10px → 12px → 14px → 18px → 40px → 44px → 96px
```

### Spacing Tokens (Derived)

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Icon padding, tight gaps |
| `space-2` | 8px | Base unit, inner component padding |
| `space-3` | 12px | Small padding, list item gaps |
| `space-4` | 16px | Card padding, form field padding |
| `space-5` | 20px | Medium padding |
| `space-6` | 28px | Section padding (compact) |
| `space-8` | 32px | Section padding, card gap |
| `space-10` | 40px | Section margins |
| `space-11` | 44px | Nav height, large gaps |
| `space-12` | 48px | Section margins |
| `space-16` | 64px | Large section padding |
| `space-20` | 80px | Page section margins |
| `space-24` | 96px | Hero section padding |
| `space-40` | 160px | Maximum section padding |

### Spacing Analysis
- **Base unit:** 4px (all values are multiples of 4)
- **Primary spacing:** 8px-based with gradual scaling
- **Density:** Default-to-comfortable — not cramped, generous whitespace
- **Scale type:** Roughly geometric after 32px (doubles: 32→64, 48→96)

---

## 4. Shadows

### CSS-Extracted Shadows (HIGH confidence)

| Token | CSS Value | Usage |
|-------|-----------|-------|
| `shadow-sm` | `rgba(0,0,0,0.05) 0px 1px 2px 0px` | Subtle elevation (cards, buttons) |
| `shadow-ring` | `oklab(0.999994 0.0000455678 0.0000200868 / 0.1) 0px 0px 0px 0.5px inset` | White inset ring border (dark mode component borders) |
| `shadow-ring-sm` | `shadow-ring` + `shadow-sm` combined | Card with border + subtle shadow |
| `shadow-2xl` | `rgba(0,0,0,0.25) 0px 25px 50px -12px` | Modal/overlay shadow, large elevation |

### Shadow Strategy
- **Minimal shadow usage** — borders via inset `ring` shadows (Tailwind pattern)
- **oklab color space** for precise ring borders — white at 10% opacity
- **Large spread shadows** only for overlays/modals
- **Dark mode approach:** Use subtle white inset rings instead of shadows for depth

---

## 5. Borders & Radius

### CSS-Extracted Border Radius (HIGH confidence)

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 6px | Small elements, badges |
| `radius-md` | 8px | Buttons, inputs, small cards |
| `radius-lg` | 16px | Cards, panels, modals |
| `radius-xl` | 32px | Pills, large rounded containers |
| `radius-full` | 9999px (33554432px raw) | Circular elements, avatar, pill buttons |

### Radius Strategy
- **Rounded** overall approach — no sharp corners anywhere
- **8px default** for interactive elements (buttons, inputs)
- **16px** for container-level elements (cards, panels)
- **Pill (9999px)** for avatar images, circular icon buttons
- **Border style:** `solid`, `1px` stroke width dominant
- **Border color:** Transparent or `rgba(255,255,255,0.1)` on dark mode

---

## 6. Gradients

### CSS-Extracted Gradients (HIGH confidence)

| # | CSS Value | Usage |
|---|-----------|-------|
| 1 | `linear-gradient(to top, rgba(0,0,0,0.7))` | Image overlay — bottom fade to black |
| 2 | `radial-gradient(100% 100% at 50% 0%, rgb(0,0,0))` | Radial vignette — top-center origin |
| 3 | `linear-gradient(120deg, rgb(255,255,255))` | Angled white gradient — text shimmer |
| 4 | `linear-gradient(rgb(255,255,255))` | Simple white overlay |
| 5 | `linear-gradient(90deg, rgb(255,255,255))` | Horizontal fade — carousel edge mask |
| 6 | `linear-gradient(270deg, rgb(255,255,255))` | Reverse horizontal fade |
| 7 | `radial-gradient(rgba(0,0,0,0.2))` | Subtle radial shadow |
| 8 | `linear-gradient(200deg, rgb(100,100,100))` | Angled gray gradient — metallic/premium feel |
| 9 | `radial-gradient(at 50% 0%, rgba(0,0,0,0))` | Top-center radial transparent |
| 10 | `linear-gradient(to top, rgb(255,255,255))` | Bottom-to-top white fade |
| 11 | `linear-gradient(rgba(0,0,0,0.8))` | Dark overlay |

### Gradient Strategy
- **Functional gradients only** — no decorative color gradients
- **Image/content overlays:** Dark gradients for text readability on images
- **Edge masks:** White linear gradients for carousel/marquee fade edges
- **Achromatic palette** carries through — gradients use only black, white, gray

---

## 7. Animations & Transitions

### Key Transitions (HIGH confidence)

| Pattern | CSS | Usage |
|---------|-----|-------|
| **Base hover** | `color 0.2s ease-out, background-color 0.1s ease-out` | Button/link hover |
| **Scale hover** | `scale 0.5s ease-out` | Image card hover zoom |
| **Smooth all** | `all 0.15s cubic-bezier(0.4, ...)` | General micro-interactions |
| **Opacity fade** | `opacity 0.2s cubic-bezier(0.4, ...)` | Tooltip, dropdown appear |
| **Page transition** | `all 0.5s ease` | Full page transitions |
| **Content reveal** | `transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)` | Scroll-triggered reveals |
| **Width/height** | `width 0.4s`, `height 0.2s linear` | Sidebar collapse/expand, accordion |
| **Box shadow** | `box-shadow 0.2s ease-in-out` | Focus ring transitions |
| **Input toggle** | `background-color 0.218s, border-color 0.218s` | Toggle switch animation |

### Keyframe Animations (HIGH confidence)

| Name | Duration | Effect | Usage |
|------|----------|--------|-------|
| `fade` | — | 0→1 opacity | Element enter |
| `spin` | — | 360° rotate | Loading spinner |
| `pulse` | — | 0.5 opacity at 50% | Skeleton loading |
| `ping` | — | Scale(2) + fade out | Notification dot |
| `bounce` | — | translateY bounce | Scroll indicator |
| `marquee-left` | 32s linear ∞ | translateX loop | Brand logo carousel |
| `marquee-right` | — | Reverse marquee | Reverse scroll |
| `accordion-down/up` | — | Height 0↔auto | Accordion expand/collapse |
| `collapsible-down/up` | — | Height 0↔auto | Collapsible panels |
| `caret-blink` | — | Opacity 1→0→1 | Text cursor blink |
| `wiggle` | — | ±2px translate | Error shake |
| `shake` | — | ±6px→±2px translate | Validation error |
| `draw-check` | — | Stroke dashoffset | Success checkmark draw |
| `audio-wave` | — | Height oscillation | Audio visualization |
| `enter/exit` | — | Translate+scale+rotate+blur | Component mount/unmount (Tailwind v4) |

### Animation Philosophy
- **Easing:** Primarily `ease-out` for UI transitions; `cubic-bezier(0.4, 0, 0.2, 1)` for content animations
- **Duration:** 100–200ms for micro-interactions; 400–700ms for content reveals; 1.5s for dramatic entrances
- **Framework:** Uses Tailwind v4 animation system (`enter`/`exit` keyframes with CSS custom properties)
- **Component library:** Bits UI / Radix-compatible animations (accordion, collapsible)
- **Motion library:** CSS-only (no Framer Motion or GSAP detected)

---

## 8. Effects

### CSS-Extracted Effects (HIGH confidence)

#### Backdrop Filters
| CSS | Usage |
|-----|-------|
| `backdrop-filter: blur(24px)` | Frosted glass nav bar, modal backdrop |

#### Filters
| CSS | Usage |
|-----|-------|
| `filter: blur(2px)` | Background blur behind focus elements |
| `filter: url("#clock-shadow")` | SVG filter — custom drop shadow |
| `filter: url("#shadow-blur")` | SVG filter — soft shadow |

#### Opacity Scale
| Value | Usage |
|-------|-------|
| `0.1` | Very subtle overlay, disabled states |
| `0.3` | Background dimming |
| `0.5` | Half-opacity for secondary elements |
| `0.65` | Semi-transparent overlays |
| `0.7` | Image overlay text background |

#### Blend Modes
| Mode | Usage |
|------|-------|
| `screen` | Light overlay blending on images |
| `overlay` | Texture blending on images |

### Effects Strategy
- **Glassmorphism-lite:** `backdrop-filter: blur(24px)` for nav/header — not full glass aesthetic
- **Opacity layering** for depth on dark backgrounds
- **SVG filters** for custom shadow effects (more control than CSS shadows)
- **Blend modes** used sparingly for image compositing

---

## 9. Visual Personality (LLM Vision — MEDIUM confidence)

### Graphic Style Analysis

| Attribute | Value |
|-----------|-------|
| **Illustration style** | None — photography-first, no illustrations |
| **Photography usage** | Custom / editorial — high-quality AI-generated showcase images |
| **Decorative elements** | Minimal: subtle gradient overlays, edge fade masks, marquee carousel |
| **Visual personality** | Premium, minimal, technical, confident, sophisticated |
| **Color application** | Large dark backgrounds with white text, content sections alternate dark/white, CTAs in high-contrast black/white |
| **Overall direction** | Flat + minimal with subtle glassmorphism accents |

### Design Language
- **"Dead simple UI"** — Krea's own design principle stated prominently
- **Content-first:** UI chrome is minimal; generated images/videos are the hero
- **Tool aesthetic:** Feels like a professional creative tool, not a consumer app
- **High production value:** Typography and spacing feel considered and intentional
- **Dark mode-first:** App interface is dark; landing page uses dark→light sections

### Mood Tags
`premium`, `minimal`, `technical`, `clean`, `professional`, `sophisticated`, `dark`, `creative-tool`

---

## 10. Component Patterns

### 10.1 Navigation — Top Bar + Sidebar

#### Landing Page Top Nav (PUBLIC)
```
[Logo] ——— [App] [Features ▾] [Image] [Video] [Upscaler] [API] [Pricing] [Enterprise] ——— [Sign up for free] [Log in]
```
- **Background:** `#000000` (solid black)
- **Font:** Suisse Intl, 14px, weight 500
- **Height:** ~56px
- **CTA "Sign up for free":** White bg, black text, rounded 8px
- **CTA "Log in":** `#262626` bg, white text, rounded 8px
- **Dropdown:** "Features" has chevron icon, dropdown menu

#### App Top Bar (LOGGED IN)
```
[K Logo] ——— [🏠 Home] [🖼 Image ●] [📹 Video] [✂ Enhance] [✏ Edit] [A Typography] [📁 Assets] ——— [🔍] [🔔 4] [🌙] [Avatar]
```
- **Background:** `#101010`
- **Nav items:** Icon-only in rounded pill container, center-aligned
- **Active state:** White filled circle background behind active icon
- **Notification badge:** Red circle `#EF4444` with count
- **Dark mode toggle:** Moon icon (🌙)
- **Avatar:** Circular, far right

#### App Left Sidebar (REDESIGNED — March 2026)
Per the [Krea Redesign blog post](https://www.krea.ai/blog/redesign):
```
One Sidebar:
├── Home
├── Train LoRA
├── Node Editor
├── Assets
├── ───────────
├── Image
├── Video
├── Enhancer
├── Nano Banana
└── Realtime
```
- **Sections:** Tools grouped, separated by dividers
- **Indicators:** Live session indicators showing running jobs
- **Persistence:** Sessions carry over between tools
- **Behavior:** Pinnable tools, configurable defaults

### 10.2 Cards

#### Image/Result Card
- **Border radius:** 8–16px
- **Aspect ratio:** Varies (portrait, landscape, square)
- **Hover overlay:** Gradient `linear-gradient(to top, rgba(0,0,0,0.7))`
- **Hover actions:** Heart ♡, Thumbs up 👍, Thumbs down 👎, More ⋮ (three dots)
- **Action placement:** Bottom-right overlay on hover
- **Image scale on hover:** `scale 0.5s ease-out` — subtle zoom
- **Border:** None visible — clean edge

#### Model Card (Workspace)
- **Shows:** Model name, speed, quality rating, cost
- **Layout:** Grid of cards
- **Info density:** Compact, scannable
- **Pinnable:** Star/pin icon to save favorites

### 10.3 Buttons

#### Primary Button
```css
background: #FFFFFF;        /* or #000000 in light sections */
color: #000000;             /* or #FFFFFF in light sections */
border-radius: 8px;
padding: 12px 20px;
font-weight: 500;
font-size: 14px;
transition: background-color 0.1s ease-out;
```
- **With icon:** Person icon + text (e.g., "Sign Up")
- **Hover:** Slight opacity change or background shift

#### Secondary Button (Outline/Ghost)
```css
background: #262626;        /* dark mode */
color: #FFFFFF;
border: none;               /* or subtle ring */
border-radius: 8px;
padding: 12px 20px;
font-weight: 500;
font-size: 14px;
```
- **With icon:** Arrow icon + text (e.g., "Launch App")

#### Icon Button
```css
background: transparent;
border: none;
border-radius: 9999px;      /* circular */
padding: 8px;
color: #A3A3A3;             /* muted */
```
- **Hover:** `color: #FFFFFF`, `background: rgba(255,255,255,0.1)`

### 10.4 Input / Search Bar

#### Prompt Input
```
[Prompt text area] | [Model selector: "Krea 1"] | [Generate button →]
```
- **Background:** `#262626` (dark surface)
- **Border:** Subtle inset ring `rgba(255,255,255,0.1)`
- **Radius:** 16px (large rounded)
- **Padding:** 16px
- **Placeholder text:** `#737373`
- **Text color:** `#FFFFFF`

#### Search Input
- **Icon:** Magnifying glass left-aligned
- **Background:** `#262626`
- **Radius:** 8px

### 10.5 Modals & Overlays

- **Backdrop:** Semi-transparent dark overlay
- **Shadow:** `shadow-2xl` — `rgba(0,0,0,0.25) 0px 25px 50px -12px`
- **Radius:** 16px
- **Animation:** Opacity + scale entrance (`enter` keyframe)
- **Backdrop filter:** `blur(24px)` for frosted glass effect

### 10.6 Marquee / Carousel

- **Brand logos carousel:** Infinite horizontal scroll
- **Animation:** `marquee-left` at 32s linear infinite
- **Edge mask:** Horizontal linear gradient fade (white→transparent on both edges)
- **Gap variable:** `--gap` CSS custom property

### 10.7 Badges & Tags

- **"New" badges:** Small pill shape (radius 9999px)
- **Font:** 11–12px, weight 500
- **Colors:** Subtle background (`#262626`), white text

### 10.8 Accordion / Collapsible

- **Animation:** `accordion-down` / `accordion-up` keyframes
- **Height transition:** `0px` → `var(--bits-accordion-content-height)`
- **Compatible with:** Bits UI / Radix / Reka / Kobalte

### 10.9 Toggle Switch

- **Animation:** `background-color 0.218s, border-color 0.218s`
- **Smooth state transition** between on/off

### 10.10 Thumbnail Strip (Left sidebar in generate view)

```
[ + ] ← New generation button
[thumb 1] ← Active (highlighted border)
[thumb 2]
[thumb 3]
[thumb N]
```
- **Thumbnail size:** ~56×56px
- **Active border:** White ring
- **Radius:** 8px
- **Layout:** Vertical strip, left edge

---

## 11. Layout Patterns

### Overall App Layout

```
┌─────────────────────────────────────────────────────┐
│                    Top Nav Bar                       │ 56px
├────────┬────────────────────────────────────────────┤
│        │                                            │
│  Left  │            Main Content Area               │
│ Thumb  │                                            │
│ Strip  │     [Prompt/Input Area on left]             │
│ (~80px)│     [Generated Results Grid on right]       │
│        │                                            │
│        │                                            │
│        │                                            │
└────────┴────────────────────────────────────────────┘
```

### Landing Page Layout

```
Section 1: Hero (dark bg)
  - Full-width centered text
  - H1 at 72–96px
  - CTAs center-aligned

Section 2: App Preview (dark bg)
  - Embedded app screenshot/demo
  - Shows top nav + generation interface

Section 3: Features (alternating dark/white sections)
  - Image + text side-by-side

Section 4: Brand Marquee
  - Infinite scroll logos (Lego, Samsung, Nike, Microsoft, Shopify)

Section 5: Pricing
  - Card grid: Free | Basic ($9) | Pro | Max | Business | Enterprise

Section 6: Footer
  - Multi-column links
```

### Content Grid

| Context | Columns | Gap |
|---------|---------|-----|
| Generated images | 2 columns | 8–12px |
| Feature showcase | 2–3 columns | 40–44px |
| Pricing cards | 6 columns (responsive) | 16px |
| Model selection | 3–4 columns grid | 16px |

### Responsive Breakpoints (Estimated)

| Breakpoint | Target |
|------------|--------|
| `≤640px` | Mobile — single column, stacked layout |
| `641–1024px` | Tablet — 2 columns, collapsed sidebar |
| `1025–1440px` | Desktop — full layout, fixed sidebar |
| `>1440px` | Wide — centered content, max-width container |

### Key Dimensions

| Element | Width/Height |
|---------|-------------|
| Top nav height | 56px |
| Left thumbnail strip | ~80px |
| Content max-width | ~1200px (landing page sections) |
| App content area | Fluid, fills remaining space |
| Sidebar (redesign) | ~240px estimated |

---

## 12. Design Tokens (CSS Custom Properties)

```css
:root {
  /* ============ COLORS ============ */

  /* Backgrounds */
  --color-bg-primary: #000000;
  --color-bg-secondary: #101010;
  --color-bg-tertiary: #262626;
  --color-bg-elevated: #262626;
  --color-bg-surface-light: #F5F5F5;
  --color-bg-white: #FFFFFF;

  /* Text */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #A3A3A3;
  --color-text-tertiary: #737373;
  --color-text-muted: #525252;
  --color-text-on-light: #000000;
  --color-text-on-light-secondary: #404040;

  /* Borders */
  --color-border-subtle: rgba(255, 255, 255, 0.1);
  --color-border-light: #E5E5E5;

  /* Accents / Interactive */
  --color-accent-primary: #FFFFFF;
  --color-accent-hover: rgba(255, 255, 255, 0.1);
  --color-accent-cta-bg: #FFFFFF;
  --color-accent-cta-text: #000000;
  --color-accent-secondary-bg: #262626;
  --color-accent-secondary-text: #FFFFFF;

  /* Semantic */
  --color-error: #EF4444;
  --color-overlay: rgba(0, 0, 0, 0.7);
  --color-overlay-heavy: rgba(0, 0, 0, 0.8);

  /* ============ TYPOGRAPHY ============ */

  --font-family: "Suisse Intl", ui-sans-serif, system-ui, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";

  /* Sizes */
  --font-size-nano: 11px;
  --font-size-micro: 12px;
  --font-size-caption: 13px;
  --font-size-label: 14px;
  --font-size-body-sm: 15px;
  --font-size-body: 16px;
  --font-size-body-lg: 18px;
  --font-size-h4: 20px;
  --font-size-h3: 24px;
  --font-size-h2: 30px;
  --font-size-h1: 36px;
  --font-size-display-lg: 72px;
  --font-size-display-xl: 96px;

  /* Weights */
  --font-weight-regular: 400;
  --font-weight-book: 450;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Line Heights */
  --line-height-tight: 1.0;
  --line-height-snug: 1.25;
  --line-height-normal: 1.4;
  --line-height-relaxed: 1.5;

  /* ============ SPACING ============ */

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 28px;
  --space-8: 32px;
  --space-10: 40px;
  --space-11: 44px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-40: 160px;

  /* ============ BORDERS ============ */

  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 32px;
  --radius-full: 9999px;

  --border-width: 1px;
  --border-style: solid;

  /* ============ SHADOWS ============ */

  --shadow-sm: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-ring: inset 0 0 0 0.5px rgba(255, 255, 255, 0.1);
  --shadow-ring-sm: inset 0 0 0 0.5px rgba(255, 255, 255, 0.1),
    rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-2xl: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;

  /* ============ EFFECTS ============ */

  --backdrop-blur: blur(24px);
  --blur-sm: blur(2px);
  --opacity-overlay: 0.7;
  --opacity-muted: 0.5;
  --opacity-subtle: 0.3;
  --opacity-ghost: 0.1;

  /* ============ TRANSITIONS ============ */

  --transition-fast: 0.1s ease-out;
  --transition-base: 0.2s ease-out;
  --transition-smooth: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 0.5s ease;
  --transition-reveal: 0.7s cubic-bezier(0.4, 0, 0.2, 1);

  /* ============ LAYOUT ============ */

  --nav-height: 56px;
  --sidebar-width: 240px;
  --thumbnail-strip-width: 80px;
  --content-max-width: 1200px;
}
```

---

## 13. Technology Stack (Detected)

| Layer | Technology | Evidence |
|-------|-----------|----------|
| **Framework** | SvelteKit | Svelte-prefixed keyframe names (`svelte-1bdl1zz-marquee-left`) |
| **CSS Framework** | Tailwind CSS v4 | `enter`/`exit` keyframes with `--tw-*` CSS variables |
| **Component Library** | Bits UI (Svelte port of Radix) | `--bits-accordion-content-height`, `--bits-collapsible-content-height` variables |
| **Font** | Suisse Intl (Swiss Typefaces) | Self-hosted custom web font |
| **Animations** | CSS-only | `motionLibraries: ["css-only"]` detected |
| **Icons** | Mixed (solid + line) | Solid 1px stroke (majority) + Line 2px stroke (secondary) |

---

## 14. Icons

### Icon Styles (HIGH confidence)

| Style | Stroke Width | Count (approx) | Usage |
|-------|-------------|-----------------|-------|
| **Solid** | 1px | ~60% of icons | Nav icons, action icons, primary UI |
| **Line** | 2px | ~35% of icons | Feature icons, decorative icons |
| **Line (thin)** | 1.5px | ~5% of icons | Specific utility icons |

### Icon Notes
- **Dual-style system:** Solid for primary/active states, line for secondary
- **Consistent stroke on solid:** 1px across all solid icons
- **Line icons thicker:** 2px stroke — bolder, more prominent
- **Icon set:** Likely Lucide or custom SVG set (not identifiable from CSS alone)

---

## 15. Key Design Decisions for DesignDNA Implementation

### Must Adopt
1. **Achromatic palette** — Pure grayscale, no brand hue color
2. **Suisse Intl → Inter** — Use Inter as the free alternative (closest match with weight 450 support via variable font)
3. **Dark mode-first** — Dark as default, light mode as toggle option
4. **8px base spacing** — Consistent 4px grid
5. **Rounded corners** — 8px default, 16px for containers
6. **Minimal shadows** — Use inset ring borders instead of box-shadows for depth
7. **Single font family** — One font does everything (headings, body, labels)
8. **Content-first** — UI chrome minimal, content is the hero
9. **Glassmorphism-lite** — backdrop-blur(24px) for overlays only, not full glass

### Adapt for DesignDNA
1. **Left sidebar nav** — DesignDNA has fewer tools, so sidebar can be simpler
2. **Image cards** — Adapt for design analysis results display
3. **Prompt input** — Adapt for analysis/synthesis input
4. **Thumbnail strip** — Adapt for uploaded/analyzed design previews
5. **Tabs** — Use Krea's icon-tab pattern for feature switching

### Skip
1. **Marquee animation** — Not needed for DesignDNA
2. **96px display text** — Too large for tool app; cap at 36px
3. **Brand logos section** — Not applicable
4. **Audio wave animation** — Not applicable

---

## Sources

| Source | Type | Confidence |
|--------|------|------------|
| krea.ai (homepage) | Puppeteer CSS extraction | 🟢 HIGH |
| krea.ai viewport screenshot | LLM Vision analysis | 🟡 MEDIUM |
| krea.ai/blog/redesign | Web content extraction | 🟢 HIGH |
| krea.ai/pricing | Web content extraction | 🟢 HIGH |
| krea.ai/apps | Web content extraction | 🟢 HIGH |
| krea.ai/app | Web content extraction | 🟡 MEDIUM (requires login) |
| Tavily search results | Web search / image descriptions | 🟡 MEDIUM |
| Medium/review articles | Third-party analysis | 🟡 MEDIUM |

---

*Generated by Design Ops Agent — 2026-03-17*
*Puppeteer extraction data saved at: `/tmp/krea-extraction.json`*
*Viewport screenshot: `krea-ai-viewport-*.png`*
