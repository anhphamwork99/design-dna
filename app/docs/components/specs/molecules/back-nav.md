# Component Spec: Back Navigation

## 1. Overview
| Field | Value |
|-------|-------|
| Purpose | Navigate to the previous screen with a labeled link |
| Category | Navigation |
| Tier | Molecule |
| Token prefix | `--ds-comp-backnav-*` |
| Complexity | Low |
| Composition | ArrowLeft icon + Label text |

## 2. Anatomy
```
← Back to Upload
↑icon  ↑ label
```
| Slot | Required | Sizing |
|------|----------|--------|
| Icon | ✅ | `ArrowLeft w-4 h-4 mr-2` |
| Label | ✅ | `text-[14px]`, context-specific |

## 3. Variants
| Variant | Label | Target |
|---------|-------|--------|
| Upload → Home | "Home" | landing |
| Results → Upload | "Back to Upload" | upload |

## 4. State Matrix
| State | Text | Cursor |
|-------|------|--------|
| default | `text-secondary` | pointer |
| hover | `text-primary` | pointer |
| focus-visible | `text-primary + ring-2 ring-accent` | — |

## 5. Accessibility
- Semantic: `<button>` with screen reader text
- Focus: `focus-visible:ring-2 focus-visible:ring-accent`

## 6. Token Mapping
| Property | Component Token | Resolved |
|----------|----------------|----------|
| text-default | `--ds-comp-backnav-text` | `var(--color-text-secondary)` |
| text-hover | `--ds-comp-backnav-text-hover` | `var(--color-text-primary)` |
| icon-size | `--ds-comp-backnav-icon` | `16px` |
| font-size | `--ds-comp-backnav-font-size` | `14px` |
| margin-bottom | `--ds-comp-backnav-mb` | `24px` (mb-6) |
| transition | `--ds-comp-backnav-transition` | `150ms ease` |

## 7. Edge Cases
| Edge Case | Behavior |
|-----------|---------|
| First screen (Landing) | Back nav not rendered |

## 8. Micro-Interactions
Text color transition only (150ms). No translate/scale effects.
