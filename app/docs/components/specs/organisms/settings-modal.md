# Component Spec: Settings Modal

## 1. Overview
| Field | Value |
|-------|-------|
| Purpose | Overlay dialog for API key configuration |
| Category | Containment |
| Tier | Organism |
| Token prefix | `--ds-comp-modal-*` |
| Complexity | High (overlay + form + animation) |
| Priority | Must |
| Composition | Overlay backdrop + Modal panel + Close button + Form (Label + Input + Submit) |

## 2. Anatomy
```
┌──────────────── Overlay ────────────────────────┐
│ bg-black/60 backdrop-blur-sm                    │
│                                                 │
│    ┌────────────────────────────────────────┐   │
│    │ [✕]                                    │   │ ← Close button
│    │                                        │   │
│    │ Settings                               │   │ ← h2 20px semibold
│    │ API Key ___________________________    │   │ ← Input
│    │ [   Save API Key   ]                   │   │ ← Primary button
│    │                                        │   │
│    │ Get from ai.google.dev                 │   │ ← Link
│    └────────────────────────────────────────┘   │
│    max-w-[400px], bg-surface1, rounded-xl       │
└─────────────────────────────────────────────────┘
```

| Slot | Required | Sizing |
|------|----------|--------|
| Overlay | ✅ | `fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm` |
| Panel | ✅ | `max-w-[400px] bg-surface1 border border-border-default rounded-xl p-6` |
| Close button | ✅ | `X w-5 h-5`, absolute top-4 right-4 |
| Title | ✅ | `text-[20px] font-semibold mb-6` |
| Input | ✅ | Full width, standard input spec |
| Submit | ✅ | Primary button, full width |
| Help link | ❌ | `text-[12px] text-text-secondary underline` |

## 3. Variants
| Variant | Trigger | Differences |
|---------|---------|------------|
| First-run | No API key saved | Auto-opens on app load. No close button (or shows warning). |
| Settings | User clicks ⚙️ | Close button visible. Key pre-filled if exists. |

## 4. State Matrix

### Overlay
| State | Visual |
|-------|--------|
| entering | `opacity 0 → 1`, 200ms |
| visible | `opacity 1` |
| exiting | `opacity 1 → 0`, 200ms |

### Panel
| State | Transform | Opacity |
|-------|----------|---------|
| entering | `scale 0.95→1, y 10→0` | `0 → 1` |
| visible | `scale 1, y 0` | `1` |
| exiting | `scale 1→0.95, y 0→10` | `1 → 0` |

### Close Button
| State | Color | Cursor |
|-------|-------|--------|
| default | `text-secondary` | pointer |
| hover | `text-primary` | pointer |
| focus | `text-primary + ring-2` | — |

### Input
| State | Border | Ring |
|-------|--------|------|
| default | `border-border-default` | — |
| hover | `border-border-hover` | — |
| focus | `border-accent` | `ring-1 ring-accent` |

## 5. Accessibility
- `role="dialog"` with `aria-modal="true"` on panel
- `aria-labelledby` pointing to title
- Focus trap: Tab cycles within modal only
- `Escape` key closes modal
- Overlay click closes modal
- Return focus to trigger button on close

### Contrast
| Pair | Ratio | Pass? |
|------|-------|-------|
| Title on surface1 | 13:1 | ✅ |
| Input text on surface1 | 13:1 | ✅ |
| Placeholder on surface1 | 4.8:1 | ✅ |

## 6. Token Mapping
| Property | Component Token | Resolved |
|----------|----------------|----------|
| overlay-bg | `--ds-comp-modal-overlay-bg` | `rgba(0,0,0,0.60)` |
| overlay-blur | `--ds-comp-modal-overlay-blur` | `backdrop-blur-sm` (4px) |
| panel-bg | `--ds-comp-modal-panel-bg` | `var(--color-bg-surface1)` |
| panel-border | `--ds-comp-modal-panel-border` | `var(--color-border-default)` |
| panel-radius | `--ds-comp-modal-panel-radius` | `12px` (rounded-xl) |
| panel-padding | `--ds-comp-modal-panel-padding` | `24px` (p-6) |
| panel-max-width | `--ds-comp-modal-panel-max-w` | `400px` |
| z-index | `--ds-comp-modal-z` | `100` |

## 7. Edge Cases
| Edge Case | Behavior |
|-----------|---------|
| No API key on load | Modal auto-opens, cannot be dismissed without entering key |
| Invalid key | Shown via error on API call, not in modal itself |
| Very long key | Input scrolls horizontally, no truncation |
| Mobile | Panel goes full-width with `mx-4` margin |

## 8. Micro-Interactions
| Interaction | Spec | Reduced Motion |
|------------|------|----------------|
| Open | Overlay fade 200ms + Panel scale(0.95→1) + y(10→0), 200ms ease-out | Instant |
| Close | Reverse of open, 200ms | Instant |
| Overlay click | Closes modal | Same |
| Escape key | Closes modal | Same |
