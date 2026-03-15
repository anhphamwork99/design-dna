# Component Spec: Error State

## 1. Overview
| Field | Value |
|-------|-------|
| Purpose | Display error with context and recovery actions |
| Category | Feedback |
| Tier | Molecule |
| Token prefix | `--ds-comp-error-*` |
| Complexity | Medium |
| Composition | Container (accent-border) + Icon + Title + Message + Action buttons |

## 2. Anatomy
```
┌─────────────────────────────────────────────┐
│ ▎ ⚠️ Connection Failed    ← error icon+title│
│ ▎ Could not reach API...   ← message        │
│ ▎                                            │
│ ▎ [Retry] [Change API Key] [Cancel]          │
└─────────────────────────────────────────────┘
  border-l-4 border-l-error, bg-surface1, rounded-xl
```

| Slot | Required | Sizing |
|------|----------|--------|
| Container | ✅ | `bg-surface1 border-l-4 border-l-error rounded-xl p-4 flex flex-col gap-3` |
| Icon | ✅ | `AlertTriangle w-5 h-5 text-error` |
| Title | ✅ | `text-[14px] font-semibold text-error` |
| Message | ✅ | `text-[14px] text-text-secondary` |
| Actions | ✅ | `flex flex-wrap gap-3 mt-2` — Primary + Secondary + Ghost buttons |

## 3. Variants
| Error Type | Message | Actions |
|-----------|---------|---------|
| Network | "Could not reach..." | Retry + Cancel |
| API key | "Invalid API key..." | Retry + Change API Key + Cancel |
| Rate limit | "Rate limit exceeded..." | Retry + Cancel |
| Timeout | "Analysis took too long..." | Retry + Cancel |
| Parse | "Unexpected response..." | Retry + Cancel |

## 4. State Matrix
| State | Visual | Entry animation |
|-------|--------|----------------|
| entering | `opacity 0→1, y 10→0`, 200ms | Framer Motion |
| visible | Static | — |

## 5. Accessibility
- `role="alert"` on container for screen readers
- Error icon: `aria-hidden="true"` (decorative — title conveys meaning)
- Buttons: standard button a11y

### Color-Only Check
- Error indicated by: red border + red icon + red title text ✅ (3 indicators)

## 6. Token Mapping
| Property | Component Token | Resolved |
|----------|----------------|----------|
| bg | `--ds-comp-error-bg` | `var(--color-bg-surface1)` |
| border-color | `--ds-comp-error-border` | `var(--color-error)` = `#EF4444` |
| border-width | `--ds-comp-error-border-width` | `4px` |
| icon-color | `--ds-comp-error-icon` | `var(--color-error)` |
| title-color | `--ds-comp-error-title` | `var(--color-error)` |
| message-color | `--ds-comp-error-message` | `var(--color-text-secondary)` |
| radius | `--ds-comp-error-radius` | `12px` |
| padding | `--ds-comp-error-padding` | `16px` |

## 7. Edge Cases
| Edge Case | Behavior |
|-----------|---------|
| Very long error message | Text wraps freely |
| No recovery action | At minimum: Cancel button |

## 8. Micro-Interactions
| Interaction | Spec |
|------------|------|
| Entry | `opacity 0→1, y 10→0`, 200ms ease-out |
| Reduced Motion | Instant opacity, no translate |
