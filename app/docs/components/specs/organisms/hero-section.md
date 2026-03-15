# Component Spec: Hero Section (Buyer DNA)

## 1. Overview
| Field | Value |
|-------|-------|
| Purpose | Display the highest-priority insight in the Buyer DNA tab with distinct visual emphasis |
| Category | Data Display |
| Tier | Organism |
| Token prefix | `--ds-comp-hero-*` |
| Complexity | Medium |
| Priority | Must |
| Composition | Accent border + Heading + Subtitle + Data Card list |

## 2. Anatomy
```
┌──────────────────────────────────────────────┐
│ ▎ Why It Feels Personal          ← H3 18px   │
│ ▎ The specific design decisions...← subtitle  │
│ ▎                                             │
│ ▎ ┌────────────────────────────────────────┐  │
│ ▎ │ Decision title     ← 14px semibold    │  │
│ ▎ │ Why it works       ← 14px italic      │  │
│ ▎ │ ⚠️ What breaks...  ← 12px tertiary    │  │
│ ▎ └────────────────────────────────────────┘  │
│ ▎                                             │
│ ▎ ┌────────────────────────────────────────┐  │
│ ▎ │ Next decision card...                  │  │
│ ▎ └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
  ↑ border-l-2 accent
```

| Slot | Required | Sizing |
|------|----------|--------|
| Container | ✅ | `border-l-2 border-l-accent pl-5` |
| Heading | ✅ | `text-[18px] font-bold mb-1` |
| Subtitle | ✅ | `text-[13px] text-text-tertiary mb-4` |
| Decision cards | ✅ | `bg-surface2 p-4 rounded-lg`, stacked `gap-3` |

## 3. Variants
Single variant — used only in Buyer DNA tab.

### Decision Card Content
| Slot | Required | Style |
|------|----------|-------|
| Decision title | ✅ | `text-[14px] font-semibold mb-1` |
| Why it works | ✅ | `text-[14px] text-text-secondary italic` |
| What breaks | ❌ | `text-[12px] text-text-tertiary mt-2` with ⚠️ prefix |

## 4. State Matrix
Display-only — no interactive states.

## 5. Accessibility
- `<section>` with `aria-labelledby` pointing to heading ID
- Heading level: `<h3>` — consistent with sibling sections in the tab
- Accent border is decorative — not sole indicator (heading size also distinguishes)

### Contrast
| Pair | Ratio | Pass? |
|------|-------|-------|
| Heading on base | 15.2:1 | ✅ |
| Subtitle tertiary on base | 7.3:1 | ✅ |
| Decision title on surface2 | 10:1 | ✅ |
| Italic text on surface2 | 5.8:1 | ✅ |
| Warning text on surface2 | 4.8:1 | ✅ |

## 6. Token Mapping
| Property | Component Token | Resolved |
|----------|----------------|----------|
| border-left-color | `--ds-comp-hero-accent` | `var(--color-accent)` = `#0096ED` |
| border-left-width | `--ds-comp-hero-border-width` | `2px` |
| padding-left | `--ds-comp-hero-pl` | `20px` (pl-5) |
| heading-size | `--ds-comp-hero-heading-size` | `18px` |
| heading-weight | `--ds-comp-hero-heading-weight` | `700` (bold) |
| subtitle-size | `--ds-comp-hero-subtitle-size` | `13px` |
| subtitle-color | `--ds-comp-hero-subtitle-color` | `var(--color-text-tertiary)` |
| card-bg | `--ds-comp-hero-card-bg` | `var(--color-bg-surface2)` = `#1E293B` |
| card-padding | `--ds-comp-hero-card-padding` | `16px` (p-4) |
| card-radius | `--ds-comp-hero-card-radius` | `8px` (rounded-lg) |
| card-gap | `--ds-comp-hero-card-gap` | `12px` (gap-3) |

## 7. Edge Cases
| Edge Case | Behavior |
|-----------|---------|
| No decisions data | Section not rendered |
| Single decision | One card, no gap |
| Missing `what_would_break` | Warning line not shown (conditional render) |
| Very long decision text | Text wraps freely within card |

## 8. Micro-Interactions
| Interaction | Spec | Reduced Motion |
|------------|------|----------------|
| Section entrance | `opacity 0→1, y 12→0`, 300ms ease-out, stagger 100ms | Instant |
| Cards stagger | Each card inherits parent `staggerChildren` | N/A |
