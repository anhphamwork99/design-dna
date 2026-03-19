# DesignDNA Style Guide

Last updated: 2026-03-19
Status: Active
Scope: Current light-first UI system for the React app in `app/`

## Purpose

This document defines the active visual and layout system for DesignDNA.

Use it to:

- build new screens
- refactor old screens
- keep shared components visually consistent
- prevent fallback to the old dark-mode design direction

For implementation priority, see `DESIGN.md`.

## Design Direction

DesignDNA uses a light-first creative-tool aesthetic:

- bright achromatic surfaces
- subtle border-first depth
- restrained blue accent for standard UI actions
- multicolor mesh gradient for AI moments only
- spacious desktop shell with left sidebar navigation

The intended feel is premium, calm, and product-focused. It should feel more like a precise creative workspace than a marketing site.

## Core Principles

- Prefer semantic tokens over hardcoded colors.
- Prefer reusable primitives over screen-local styling.
- Keep hierarchy through spacing, type, and border contrast before using shadow.
- Reserve gradient treatment for AI actions, highlighted states, and branded moments.
- Keep desktop navigation consistent across screens.

## Anti-Patterns

- Do not reintroduce dark-mode tokens or dark surfaces.
- Do not add one-off accent colors without extending tokens first.
- Do not create alternate desktop navigation models per screen.
- Do not use gradients on every CTA.
- Do not solve reusable UI with inline classes if a shared primitive already fits.

## Tokens

### Theme tokens

Primary theme tokens live in `app/src/index.css`.

#### Backgrounds

- `bg-base`: `#FAFAFA`
- `bg-surface1`: `#FFFFFF`
- `bg-surface2`: `#F5F5F5`
- `bg-surface3`: `#E5E5E5`

#### Borders

- `border-default`: `rgba(0, 0, 0, 0.08)`
- `border-hover`: `rgba(0, 0, 0, 0.12)`
- `border-active`: `rgba(0, 0, 0, 0.18)`

#### Accent

- `accent`: `#0096ED`
- `accent-hover`: `#0082D4`
- `accent-subtle`: `rgba(0, 150, 237, 0.08)`
- `accent-ring`: `rgba(0, 150, 237, 0.20)`

#### Text

- `text-primary`: `#171717`
- `text-secondary`: `#525252`
- `text-tertiary`: `#A3A3A3`
- `text-inverse`: `#FFFFFF`
- `text-brand`: `#0096ED`

#### Semantic

- `success`: `#22C55E`
- `warning`: `#F59E0B`
- `error`: `#EF4444`

#### State

- `state-hover`: `rgba(0, 0, 0, 0.04)`
- `state-active`: `rgba(0, 0, 0, 0.06)`

### Plain CSS variables

Supporting variables live in `app/src/styles/tokens.css`.

- `--shadow-sm`
- `--shadow-card`
- `--shadow-elevated`
- `--shadow-modal`
- `--gradient-mesh`
- `--sidebar-width`
- `--sidebar-collapsed-width`
- `--content-max-width`
- transition variables

### Gradient usage

The AI gradient is the current mesh gradient:

`linear-gradient(135deg, #fef3c7 0%, #f9a8d4 25%, #c084fc 50%, #818cf8 75%, #60a5fa 100%)`

Use it for:

- AI primary buttons
- AI loading indicators
- small branded highlights

Do not use it as a general page background.

## Typography

### Fonts

- primary UI font: Inter
- logo font: Dancing Script

### Type scale in current UI

- page title: `32px`, bold, tight tracking
- section title: `20px`, semibold
- card/subsection title: `16px`, medium or semibold
- body copy: `14px`
- metadata/helper text: `12px`

### Guidance

- Use `text-primary` for headings and key values.
- Use `text-secondary` for descriptions and labels.
- Use `text-tertiary` for placeholders, timestamps, and low-emphasis meta.

## Spacing And Radius

### Spacing rhythm

Use a 4px base unit and keep these values as the default rhythm:

- 8px for tight inline spacing
- 12px for compact control spacing
- 16px for list gaps and compact card padding
- 24px for standard card padding
- 32px for section separation

### Radius

- small controls: 8px to 10px
- cards and panels: 12px to 16px
- icon-only round actions: full round when the shape is meant to read as an icon button

## Layout System

### Authenticated shell

The standard desktop application layout is:

- left sidebar
- right content pane
- full viewport height
- content scroll inside `main`

Rules:

- Keep auth outside the shell.
- Keep page-level UI inside the shell.
- Do not add a second top-level navigation bar on content screens.

### Sidebar

Sidebar is the main navigation contract.

- expanded width: 240px
- collapsed width: 64px
- groups: Workspace, Tools, Footer
- active item: filled surface state, semibold text

### Studio workspace

Studio is intentionally immersive.

- sidebar remains visible on the goal picker
- sidebar hides after entering active studio stages
- studio takes over the full workspace area

Preserve this unless the whole studio UX is redesigned.

## Shared Components

Current shared primitives:

- `Button`
- `Card`
- `DataPairRow`
- `DataPointCard`
- `TagChip`
- `Input`
- `Modal`
- `Badge`
- `UploadZone`
- `EmptyState`
- `ErrorBanner`
- `LoadingSpinner`
- `ContextMenu`
- `DataGrid`
- `ImageLightbox`

### Component guidance

#### Button

Use variants consistently:

- `primary`: main CTA
- `secondary`: neutral bordered action
- `ghost`: low-emphasis text action
- `icon`: compact icon action

Use gradient treatment only when the action is AI-driven or intentionally branded.

#### Card

Default card behavior:

- surface1 background
- subtle border
- rounded corners
- hover border emphasis only when interactive

#### Input

Default field behavior:

- light surface background
- subtle border
- accent focus state
- inline label and helper/error text

#### Modal

Use modal for lightweight flows only. Do not expand modal complexity indefinitely when the feature wants to become a screen.

#### DataGrid

Use `DataGrid` as the default pattern for:

- searchable collections
- grid/list toggles
- empty states
- loading skeletons
- reusable card or row renderers

Extend it before creating new listing systems.

#### Data display primitives

Use the shared data-display primitives for structured AI output and details-heavy screens:

- `DataPairRow`: label/value rows inside analytical sections
- `DataPointCard`: labeled stat or attribute card
- `TagChip`: reusable chip for lists of concepts, fonts, values, products, or attributes

Do not recreate these shapes ad hoc inside screens when the content is still a standard label/value or chip pattern.

## Screen Patterns

### Collection screens

Reference screens:

- `LibraryScreen`
- `MyAnalysesScreen`

Pattern:

- title and count
- search input
- grid/list toggle
- card or row rendering
- context menu actions
- empty state CTA

### Form screens

Reference screens:

- `LoginScreen`
- `RegisterScreen`
- `SettingsModal`

Pattern:

- centered panel
- clean vertical rhythm
- standard field spacing
- inline validation or error text

These screens should gradually converge on shared `Input` and `Button` usage.

### Workspace screens

Reference screen:

- `StudioScreen`

Pattern:

- explicit stage machine
- workspace top bar or breadcrumb
- immersive flow once the user commits to work
- overlays for concept/detail moments rather than full route churn

### Analysis screens

Reference screens:

- `AnalyzeScreen`
- `ViewAnalysisScreen`

Pattern:

- route-level screen owns fetching and flow
- upload, loading, and result states should be separate subcomponents
- visual and buyer result areas should be reusable tab components
- repeated stat cards, rows, and chips should come from shared data-display primitives
- keep image/result split layout consistent between editable and read-only analysis views

## Motion

Current motion language should stay subtle:

- fast transitions for hover and focus
- simple fade and translate for view transitions
- restrained loading animations
- no decorative motion that competes with work content

Default timing:

- fast: 100ms
- base: 200ms
- slow: 500ms

## Accessibility And Interaction

- Keep visible focus states.
- Keep navigation labels readable in expanded mode.
- Use `aria-label` on compact icon triggers and menus.
- Ensure hover-only affordances still have keyboard access.
- Build explicit empty, loading, and error states for every new screen.

## Implementation Notes

- `README.md` and `DESIGN.md` should stay aligned with this file.
- If this file conflicts with code, fix the file or the code immediately. Do not let both versions drift.
