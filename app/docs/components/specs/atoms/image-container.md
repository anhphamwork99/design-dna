# Component Spec: Image Container

## 1. Overview
| Field | Value |
|-------|-------|
| Purpose | Wrap and display uploaded/analyzed images with consistent styling |
| Category | Containment |
| Tier | Atom |
| Token prefix | `--ds-comp-img-*` |
| Complexity | Low (2 variants) |

## 2. Anatomy
```
┌──────────────────────────────────┐
│ ┌──────────────────────────────┐ │
│ │        Image content         │ │ ← object-contain, rounded-lg
│ └──────────────────────────────┘ │
│  Container (surface2, p-2)      │
└──────────────────────────────────┘
  rounded-xl, border-default
```

## 3. Variants
| Variant | Extras | Usage |
|---------|--------|-------|
| Static | None | Results, Upload preview |
| Scanning | `.animate-scan-line` overlay | Analyzing screen |

## 4. State Matrix
Display-only. Scanning variant has continuous animation.

## 5. Accessibility
- `alt="Analyzed design"` on image
- Scanning animation: `aria-hidden="true"` on scan line div

## 6. Token Mapping
| Property | Component Token | Resolved |
|----------|----------------|----------|
| bg | `--ds-comp-img-bg` | `var(--color-bg-surface2)` = `#1E293B` |
| border | `--ds-comp-img-border` | `var(--color-border-default)` |
| padding | `--ds-comp-img-padding` | `8px` (p-2) |
| outer-radius | `--ds-comp-img-outer-radius` | `12px` (rounded-xl) |
| inner-radius | `--ds-comp-img-inner-radius` | `8px` (rounded-lg) |
| scan-color | `--ds-comp-img-scan-color` | `var(--color-accent)` |

## 7. Edge Cases
| Edge Case | Behavior |
|-----------|---------|
| No image | Skeleton placeholder (aspect-square, shimmer) |
| Portrait image | `object-contain` preserves ratio |
| Mobile | `max-h-[300px]` to prevent taking too much space |

## 8. Micro-Interactions
| Interaction | Spec |
|------------|------|
| Scan line | `top: 0→100%`, 2s ease-in-out infinite. Gradient: `transparent → accent → transparent`. Glow: `box-shadow 0 0 15px accent, 0 0 30px accent`. |
| Reduced Motion | Static accent line at 50% position, no animation |
