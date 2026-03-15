# Component Spec: Tag Chip

## 1. Overview
| Field | Value |
|-------|-------|
| Purpose | Display a categorical value as a compact, inline pill |
| Category | Communication |
| Tier | Atom |
| Token prefix | `--ds-comp-tag-*` |
| Complexity | Low (1 type variant, 1 size) |
| Priority | Must |

## 2. Anatomy
```
┌────────────────┐
│  Label Text    │ ← Content: text-[13px]
│  Container     │ ← bg-surface2, border, rounded-md
└────────────────┘
```
| Slot | Required | Default | Sizing |
|------|----------|---------|--------|
| Label | ✅ | — | `text-[13px]` |

## 3. Variants
| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| Default | `bg-surface2` | `text-primary` (implicit) | `1px border-hover` |

**Size:** Single size only — `px-2 py-1 rounded-md`.

## 4. State Matrix
| State | Background | Text | Border | Cursor |
|-------|-----------|------|--------|--------|
| default | `bg-surface2` | `text-primary` | `border-hover` | default |

> Tag chips are display-only (non-interactive). No hover/focus/disabled states needed.

## 5. Accessibility
- Semantic: `<span>` — no interactive role needed
- Contrast: `rgba(255,255,255,0.92)` on `#1E293B` = ~10:1 ✅
- Not a link or button — no keyboard focus needed

## 6. Token Mapping
| Property | Component Token | Resolved |
|----------|----------------|----------|
| bg | `--ds-comp-tag-bg` | `var(--color-bg-surface2)` = `#1E293B` |
| text | `--ds-comp-tag-text` | `var(--color-text-primary)` |
| border | `--ds-comp-tag-border` | `var(--color-border-hover)` = `rgba(255,255,255,0.10)` |
| radius | `--ds-comp-tag-radius` | `6px` (rounded-md) |
| padding-h | `--ds-comp-tag-px` | `8px` |
| padding-v | `--ds-comp-tag-py` | `4px` |
| font-size | `--ds-comp-tag-font-size` | `13px` |

## 7. Edge Cases
| Edge Case | Behavior |
|-----------|---------|
| Long text | No truncation — wraps in flex container |
| Empty | Not rendered (conditional `?.map()`) |
| Many items | `flex-wrap gap-2` — wraps to next line |

## 8. Micro-Interactions
None — static display component.

### Inline List Pattern (Composition)
Tags are commonly used inside an **Inline Tag List** pattern:
```
┌─────────────────────────────────────────────────┐
│ Label (text-secondary, min-w-[120px])           │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐            │
│ │ Tag1 │ │ Tag2 │ │ Tag3 │ │ Tag4 │            │
│ └──────┘ └──────┘ └──────┘ └──────┘            │
│ border-b border-border-default                  │
└─────────────────────────────────────────────────┘
```
