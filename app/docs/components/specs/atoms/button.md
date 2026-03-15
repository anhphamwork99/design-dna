# Component Spec: Button

## 1. Overview
| Field | Value |
|-------|-------|
| Purpose | Triggers an action or navigates to a new screen |
| Category | Action |
| Tier | Atom |
| Token prefix | `--ds-comp-btn-*` |
| Complexity | High (4 type variants × 2 sizes × focus/disabled states) |
| Priority | Must |
| Implementation | `App.tsx`, `GenerationScreen.tsx`, `CompareScreens.tsx` — inline classes |

## 2. Anatomy

```
┌──────────────────────────────────────┐
│  [icon?]  Label  [subtitle?]         │ ← Content layer
│            State Layer               │ ← hover/focus overlay
│           Container                  │ ← bg + border + radius
└──────────────────────────────────────┘
```

| Slot | Required | Default | Sizing |
|------|----------|---------|--------|
| Label | ✅ | — | `text-[14px] font-medium` |
| Icon (leading) | ❌ | — | `w-4 h-4`, Lucide icon |
| Subtitle | ❌ | — | `text-[12px] font-normal`, below label |

## 3. Variants

### 3.1 Type Variants

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| **Primary (AI)** | `ai-gradient` (`#0096ED → #7C3AED`) | `#FFFFFF` | none | Main CTA: Analyze, Generate, Upload |
| **Primary (Solid)** | `bg-accent` (`#0096ED`) | `#FFFFFF` | none | Confirm actions: Save API Key, Retry |
| **Secondary** | `transparent` | `text-text-primary` | `1px border-border-default` | Alternative: Remix, Change API Key |
| **Tertiary/Ghost** | `transparent` | `text-text-secondary` | none | Low-emphasis: Cancel, Copy, Analyze Another |

### 3.2 Size Variants

| Size | Height | Padding | Font | Icon | Touch Target |
|------|--------|---------|------|------|-------------|
| `md` (default) | ~46px | `py-3 px-5` | `14px/500` | `16px` | ✅ 46px ≥ 44px |
| `sm` | ~36px | `py-2 px-4` | `14px/500` | `16px` | ⚠️ 36px — add invisible padding to 44px |

### 3.3 With Subtitle

Used on Results screen CTAs. Label + subtitle stack vertically:
```
Create Similar Design          ← 14px/500 white
Same audience, fresh design    ← 12px/400 white/70%
```
Container: `text-left` alignment.

## 4. State Matrix

### Primary (AI Gradient)

| State | Background | Text | Border | Opacity | Cursor | ARIA |
|-------|-----------|------|--------|---------|--------|------|
| default | `ai-gradient` | `#FFF` | — | 1 | pointer | — |
| hover | `ai-gradient` | `#FFF` | — | 0.9 | pointer | — |
| active | `ai-gradient` | `#FFF` | — | 0.85 | pointer | — |
| focus | `ai-gradient` | `#FFF` | `ring-2 ring-accent ring-offset-2` | 1 | — | — |
| disabled | `ai-gradient` | `#FFF` | — | 0.4 | not-allowed | `aria-disabled="true"` |
| loading | `ai-gradient` | spinner | — | 0.7 | wait | `aria-busy="true"` |

### Secondary

| State | Background | Text | Border | Opacity | Cursor |
|-------|-----------|------|--------|---------|--------|
| default | transparent | `text-primary` | `border-default` | 1 | pointer |
| hover | `bg-surface2` | `text-primary` | `border-default` | 1 | pointer |
| focus | transparent | `text-primary` | `ring-2 ring-accent` | 1 | — |
| disabled | transparent | `text-tertiary` | `border-default` | 0.4 | not-allowed |

### Tertiary/Ghost

| State | Background | Text | Border | Cursor |
|-------|-----------|------|--------|--------|
| default | transparent | `text-secondary` | — | pointer |
| hover | transparent | `text-primary` | — | pointer |
| focus | transparent | `text-primary` | `ring-2 ring-accent` | — |

> **Compound states:** hover+focus applies both hover effect + focus ring. Disabled overrides ALL interaction states.

## 5. Accessibility

### Contrast Checks

| Pair | Foreground | Background | Ratio | Pass? |
|------|-----------|-----------|-------|-------|
| AI btn text | `#FFFFFF` | `#0096ED` | 3.5:1 | ✅ Large text (14px bold = large) |
| Secondary text | `rgba(255,255,255,0.92)` | `#0B0F19` | 15.2:1 | ✅ |
| Ghost text | `rgba(255,255,255,0.60)` | `#0B0F19` | 9.1:1 | ✅ |

### Touch Targets
- `md`: 46px ✅ meets SC 2.5.5 (44px recommended)
- `sm`: 36px ⚠️ — invisible padding strategy needed

### ARIA
- `role="button"` (native `<button>`)
- Focus indicator: `focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base`
- Icon-only: requires `aria-label`

### Color-Only Check
- Disabled: opacity change + `cursor: not-allowed` ✅ (2 indicators)
- Loading: spinner replaces content + `aria-busy` ✅

## 6. Token Mapping

| Property | Component Token | Global Fallback | Resolved |
|----------|----------------|-----------------|----------|
| bg (primary) | `--ds-comp-btn-bg-primary` | `--color-accent` | `#0096ED` |
| bg (AI) | `--ds-comp-btn-bg-ai` | `.ai-gradient` | `linear-gradient(135deg, #0096ED, #7C3AED)` |
| bg (secondary) | `--ds-comp-btn-bg-secondary` | `transparent` | — |
| text (on-primary) | `--ds-comp-btn-text-inverse` | `--color-text-inverse` | `#FFFFFF` |
| text (secondary) | `--ds-comp-btn-text-default` | `--color-text-primary` | `rgba(255,255,255,0.92)` |
| text (ghost) | `--ds-comp-btn-text-ghost` | `--color-text-secondary` | `rgba(255,255,255,0.60)` |
| border | `--ds-comp-btn-border` | `--color-border-default` | `rgba(255,255,255,0.06)` |
| radius | `--ds-comp-btn-radius` | `8px` | `8px` |
| padding-v | `--ds-comp-btn-py` | `space.3` | `12px` |
| padding-h | `--ds-comp-btn-px` | `space.5` | `20px` |
| font-size | `--ds-comp-btn-font-size` | `type.body` | `14px` |
| font-weight | `--ds-comp-btn-font-weight` | `500` | `500` |
| transition | `--ds-comp-btn-transition` | `--ds-motion-duration-fast` | `150ms ease` |
| focus-ring | `--ds-comp-btn-focus-ring` | `--color-accent-ring` | `rgba(0,150,237,0.25)` |

## 7. Edge Cases

| Edge Case | Behavior |
|-----------|---------|
| Text truncation | Labels should not truncate — if too long, let button grow. Max-width not enforced. |
| Empty state | Minimum width `auto`. Icon-only variant = square aspect, `aria-label` required. |
| Loading state | Spinner replaces label text. Icon dims. Container stays same width (prevent layout shift). |
| Icon-only | Square aspect ratio with equal padding. Touch target ≥ 44px. |
| Full-width | Add `w-full` class. Text center-aligns. |
| With subtitle | `text-left` alignment. Subtitle wraps freely within container width. |

## 8. Micro-Interactions

| Interaction | Behavior | Reduced Motion |
|------------|---------|----------------|
| Loading → Success | Spinner fades → checkmark fades in → resets after 2s | Instant swap, no fade |
| Copy DNA JSON | Label swaps to "Copied!" with `Check` icon → resets after 2s | Instant swap |
| AI button shimmer | Subtle gradient shift on hover (2s ease infinite) | Static gradient |
