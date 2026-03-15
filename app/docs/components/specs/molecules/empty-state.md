# Component Spec: Empty State

## 1. Overview
| Field | Value |
|-------|-------|
| Purpose | Indicate no content available with a call to action |
| Category | Feedback |
| Tier | Molecule |
| Token prefix | `--ds-comp-empty-*` |
| Complexity | Low |
| Composition | Icon + Heading + Description + CTA Button |

## 2. Anatomy
```
        [📷]        ← Icon (w-12 h-12 tertiary)
  No Analysis Data   ← Heading (20px semibold)
  Upload a design    ← Description (14px secondary)
  to get started
  [Upload a Design]  ← Primary CTA button
```
Layout: `flex flex-col items-center text-center gap-4 pt-24`

| Slot | Required | Sizing |
|------|----------|--------|
| Icon | ✅ | Lucide icon, `w-12 h-12 text-text-tertiary` |
| Heading | ✅ | `text-[20px] font-semibold` |
| Description | ✅ | `text-[14px] text-text-secondary max-w-[400px]` |
| CTA | ✅ | Primary button spec (atom) |

## 3. Variants
| Context | Icon | Heading | CTA |
|---------|------|---------|-----|
| No analysis data | `ImageOff` | "No Analysis Data" | "Upload a Design" |
| (Future) No generations | `Palette` | "No Generations Yet" | "Generate" |

## 4. State Matrix
Display-only — CTA button follows Button atom spec.

## 5. Accessibility
- Heading: `<h2>` for page-level empty state
- CTA: standard Button a11y with `focus-visible:ring`
- Screen reader: heading+description provide full context

## 6. Token Mapping
| Property | Component Token | Resolved |
|----------|----------------|----------|
| icon-size | `--ds-comp-empty-icon-size` | `48px` |
| icon-color | `--ds-comp-empty-icon-color` | `var(--color-text-tertiary)` |
| heading-size | `--ds-comp-empty-heading-size` | `20px` |
| heading-weight | `--ds-comp-empty-heading-weight` | `600` |
| desc-color | `--ds-comp-empty-desc-color` | `var(--color-text-secondary)` |
| desc-max-width | `--ds-comp-empty-desc-max-w` | `400px` |
| padding-top | `--ds-comp-empty-pt` | `96px` (pt-24) |
| gap | `--ds-comp-empty-gap` | `16px` (gap-4) |

## 7. Edge Cases
| Edge Case | Behavior |
|-----------|---------|
| Navigation error | Same pattern — icon change |
| Mobile | Padding-top reduces to pt-16 |

## 8. Micro-Interactions
| Interaction | Spec |
|------------|------|
| Entry | `opacity 0→1, y 8→0`, 200ms ease-out |
| Reduced Motion | Instant |
