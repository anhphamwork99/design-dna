# Component Spec: Data Card

## 1. Overview
| Field | Value |
|-------|-------|
| Purpose | Display a labeled data value in a structured container |
| Category | Data Display |
| Tier | Molecule |
| Token prefix | `--ds-comp-card-*` |
| Complexity | Medium (1 type, 3 grid layouts) |
| Priority | Must |
| Composition | Container + Label (text) + Value (text) |

## 2. Anatomy
```
┌──────────────────────────┐
│ Label    ← text-[12px]   │
│ Value    ← font-medium   │
│                          │
│ Container (surface2)     │
└──────────────────────────┘
```
| Slot | Required | Sizing |
|------|----------|--------|
| Label | ✅ | `text-text-secondary text-[12px] block mb-1` |
| Value | ✅ | `font-medium text-text-primary` (14px inherited) |

## 3. Variants

### 3.1 Grid Layouts
| Layout | Class | Usage |
|--------|-------|-------|
| 2-col | `grid grid-cols-1 sm:grid-cols-2 gap-3` | Persona (emotion, identity pairs) |
| 4-col | `grid grid-cols-2 sm:grid-cols-4 gap-3` | Persona demographics, Timing details |
| 3-col | `grid grid-cols-1 sm:grid-cols-3 gap-3` | Visual DNA (Typography, Composition) |

### 3.2 Content Variants
| Variant | Value Treatment | Example |
|---------|----------------|---------|
| Short value | Single line, `font-medium` | Age: `18-24` |
| Long value | `leading-tight`, may wrap 2 lines | Lifestyle: `Urban minimalist, tech-savvy` |
| Italic value | `italic` added | Message to World: `"I notice what others miss"` |

## 4. State Matrix
| State | Background | Border | Notes |
|-------|-----------|--------|-------|
| default | `bg-surface2` | `border-default` | Display-only, no interaction |

> Data Cards are non-interactive. No hover/focus/disabled states.

## 5. Accessibility
- Semantic: `<div>` with label as `<span>` — no ARIA needed for display
- Contrast: Label `rgba(255,255,255,0.60)` on `#1E293B` = ~5.8:1 ✅
- Contrast: Value `rgba(255,255,255,0.92)` on `#1E293B` = ~10:1 ✅

## 6. Token Mapping
| Property | Component Token | Resolved |
|----------|----------------|----------|
| bg | `--ds-comp-card-bg` | `var(--color-bg-surface2)` = `#1E293B` |
| border | `--ds-comp-card-border` | `var(--color-border-default)` = `rgba(255,255,255,0.06)` |
| radius | `--ds-comp-card-radius` | `8px` (rounded-lg) |
| padding | `--ds-comp-card-padding` | `12px` (p-3) |
| label-color | `--ds-comp-card-label` | `var(--color-text-secondary)` |
| label-size | `--ds-comp-card-label-size` | `12px` |
| value-color | `--ds-comp-card-value` | `var(--color-text-primary)` |
| value-weight | `--ds-comp-card-value-weight` | `500` |
| gap (grid) | `--ds-comp-card-gap` | `12px` (gap-3) |

## 7. Edge Cases
| Edge Case | Behavior |
|-----------|---------|
| Missing value | Show `—` dash placeholder |
| Very long value | `leading-tight`, text wraps within card. No truncation. |
| null/undefined | Card not rendered (conditional `?.` access) |

## 8. Micro-Interactions
| Interaction | Spec |
|------------|------|
| Stagger entrance | `opacity 0→1, y 12→0`, 300ms ease-out, stagger 100ms | 
| Reduced Motion | Instant appearance, no translate |
