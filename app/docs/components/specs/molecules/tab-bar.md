# Component Spec: Tab Bar

## 1. Overview
| Field | Value |
|-------|-------|
| Purpose | Switch between content panels within a screen |
| Category | Navigation |
| Tier | Molecule |
| Token prefix | `--ds-comp-tab-*` |
| Complexity | Medium (2 states per tab, animated indicator) |
| Priority | Must |
| Composition | Container (border-b) + Tab Buttons × N + Active Indicator (animated div) |

## 2. Anatomy
```
┌────────────────────────────────────────────┐
│  [TAB 1]        [TAB 2]                    │ ← Buttons
│  ═══════                                   │ ← Active indicator (2px accent)
│────────────────────────────────────────────│ ← Border bottom
└────────────────────────────────────────────┘
```
| Slot | Required | Sizing |
|------|----------|--------|
| Container | ✅ | `flex border-b border-border-default` |
| Tab Button | ✅ (2+) | `py-3 px-5 text-[13px] font-medium uppercase tracking-[0.05em]` |
| Active Indicator | ✅ | `h-[2px] bg-accent`, animated via `layoutId` |

## 3. Variants
| Variant | Usage | Tab Count |
|---------|-------|-----------|
| Results tabs | Design Breakdown / Target Audience | 2 |
| Skeleton tabs | Same visual, non-interactive (during loading) | 2 |

**Size:** Single size — min touch target ~46px height (meets 44px).

## 4. State Matrix

### Tab Button
| State | Text Color | Indicator | Cursor |
|-------|-----------|-----------|--------|
| active | `text-primary` | 2px accent bar (animated) | default |
| inactive | `text-secondary` | none | pointer |
| inactive:hover | `text-primary` | none | pointer |
| focus-visible | current color | `ring-2 ring-accent ring-offset-2 ring-offset-bg-base` | — |

### Skeleton State (AnalyzingScreen)
| State | Behavior |
|-------|---------|
| loading | Real tab labels shown, first tab active with accent bar, non-clickable |

## 5. Accessibility
- `role="tablist"` on container, `role="tab"` on each button, `role="tabpanel"` on content
- `aria-selected="true"` on active tab
- Keyboard: `Tab` moves to tab bar → `Left/Right` arrows switch tabs → `Tab` moves to content
- Focus: `focus-visible:ring-2 focus-visible:ring-accent`
- Active indicator animated with `layoutId` — provides visual continuity

### Contrast
| Pair | Ratio | Pass? |
|------|-------|-------|
| Active text on base | 15.2:1 | ✅ |
| Inactive text on base | 9.1:1 | ✅ |
| Accent bar on base | 5.2:1 | ✅ |

## 6. Token Mapping
| Property | Component Token | Resolved |
|----------|----------------|----------|
| border-bottom | `--ds-comp-tab-border` | `var(--color-border-default)` |
| text-active | `--ds-comp-tab-text-active` | `var(--color-text-primary)` |
| text-inactive | `--ds-comp-tab-text-inactive` | `var(--color-text-secondary)` |
| indicator-color | `--ds-comp-tab-indicator` | `var(--color-accent)` = `#0096ED` |
| indicator-height | `--ds-comp-tab-indicator-h` | `2px` |
| font-size | `--ds-comp-tab-font-size` | `13px` |
| font-weight | `--ds-comp-tab-font-weight` | `500` |
| letter-spacing | `--ds-comp-tab-tracking` | `0.05em` |
| text-transform | `--ds-comp-tab-transform` | `uppercase` |
| padding-v | `--ds-comp-tab-py` | `12px` (py-3) |
| padding-h | `--ds-comp-tab-px` | `20px` (px-5) |

## 7. Edge Cases
| Edge Case | Behavior |
|-----------|---------|
| Single tab | Active indicator always visible, no switching |
| No content for tab | Show empty state component in tab panel |
| Tab overflow | Not applicable (max 2 tabs currently) |

## 8. Micro-Interactions
| Interaction | Spec | Reduced Motion |
|------------|------|----------------|
| Tab switch indicator | `layoutId="activeTab"` — Framer Motion shared layout. Slides horizontally between tabs. | Instant position change |
| Content swap | `key={activeTab}` triggers exit/enter animation in content area | Instant swap |
| Tab switch content | `opacity 0→1, y 12→0`, 300ms ease-out | No translate, instant opacity |
