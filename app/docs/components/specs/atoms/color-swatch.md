# Component Spec: Color Swatch

## 1. Overview
| Field | Value |
|-------|-------|
| Purpose | Display a color from the design's palette with hex, name, and role |
| Category | Data Display |
| Tier | Atom |
| Token prefix | `--ds-comp-swatch-*` |
| Complexity | Low |
| Priority | Must |

## 2. Anatomy
### Palette Bar (Proportional)
```
┌─────────────────────────────────────────┐
│ ████████████  ██████████  ██████        │ ← Segments by proportion
└─────────────────────────────────────────┘
  h-10, rounded-lg, overflow-hidden
```

### Individual Swatch Chip
```
┌──────────────────────────────────────┐
│  ●  Color Name                       │
│     ROLE · #HEX                      │
│  Container (surface2, rounded-lg)    │
└──────────────────────────────────────┘
```

| Slot | Required | Sizing |
|------|----------|--------|
| Dot | ✅ | `w-5 h-5 rounded-full border border-white/20 shadow-sm` |
| Name | ✅ | `text-[12px] font-medium text-text-primary` |
| Role | ✅ | `text-[11px] text-text-tertiary uppercase tracking-wider` |
| Hex | ✅ | `text-[11px] text-text-tertiary` |
| Container | ✅ | `bg-surface2 px-3 py-2 rounded-lg flex items-center gap-2` |

## 3. Variants
| Variant | Usage |
|---------|-------|
| Palette bar | Full-width proportional color bar in Design Breakdown tab |
| Chip list | Individual labeled swatches below the bar |

## 4. State Matrix
Display-only — no interactive states.

## 5. Accessibility
- Color dot has `title` attribute with hex value
- Color name + hex text provides non-color information ✅ (2 indicators)
- `aria-hidden="true"` on decorative dot

## 6. Token Mapping
| Property | Component Token | Resolved |
|----------|----------------|----------|
| bar-height | `--ds-comp-swatch-bar-h` | `40px` (h-10) |
| bar-radius | `--ds-comp-swatch-bar-radius` | `8px` (rounded-lg) |
| chip-bg | `--ds-comp-swatch-chip-bg` | `var(--color-bg-surface2)` |
| chip-padding | `--ds-comp-swatch-chip-padding` | `8px 12px` |
| chip-radius | `--ds-comp-swatch-chip-radius` | `8px` |
| dot-size | `--ds-comp-swatch-dot-size` | `20px` |
| dot-border | `--ds-comp-swatch-dot-border` | `rgba(255,255,255,0.20)` |

## 7. Edge Cases
| Edge Case | Behavior |
|-----------|---------|
| Only 1 color | Single bar segment at 100% width |
| White/light color | `border border-white/20` ensures visibility on dark bg |
| Very small proportion | Minimum segment width ~20px so it's visible |

## 8. Micro-Interactions
None — static display. Inherits parent stagger animation.
