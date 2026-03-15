# Component Spec: Page Header

## 1. Overview
| Field | Value |
|-------|-------|
| Purpose | Global app header — branding + navigation + settings access |
| Category | Navigation |
| Tier | Organism |
| Token prefix | `--ds-comp-header-*` |
| Complexity | Low |
| Priority | Must |
| Composition | Container + Logo (Icon + Wordmark) + Settings Button |

## 2. Anatomy
```
┌──────────────────────────────────────────────────────────┐
│ [■] DesignDNA                                      [⚙️] │
│  ↑ Logo icon    ↑ Wordmark                   Settings ↑  │
│  ai-gradient    16px semibold                 icon-only   │
└──────────────────────────────────────────────────────────┘
  fixed top-0, z-50, h-14, bg-surface1, border-b
```

| Slot | Required | Sizing |
|------|----------|--------|
| Logo icon | ✅ | `w-6 h-6 rounded ai-gradient mr-3` |
| Wordmark | ✅ | `font-semibold text-[16px]` |
| Settings button | ✅ | `Settings w-5 h-5`, icon-only |

## 3. Variants
Single variant — persistent across all screens.

## 4. State Matrix
| Element | State | Visual | Cursor |
|---------|-------|--------|--------|
| Logo group | default | full opacity | pointer |
| Logo group | hover | `opacity-80` | pointer |
| Settings icon | default | `text-secondary` | pointer |
| Settings icon | hover | `text-primary` | pointer |
| Settings icon | focus | `ring-2 ring-accent` | — |

## 5. Accessibility
- Logo: `<button>` with `aria-label="Go to home page"` — navigates to landing
- Settings: `<button>` with `aria-label="Open settings"` — opens modal
- Header: `<header>` semantic element
- Keyboard: Both buttons focusable, activated with Enter/Space

### Contrast
| Pair | Ratio | Pass? |
|------|-------|-------|
| Wordmark on surface1 | 13:1 | ✅ |
| Settings icon on surface1 | 5.8:1 | ✅ |

## 6. Token Mapping
| Property | Component Token | Resolved |
|----------|----------------|----------|
| height | `--ds-comp-header-height` | `56px` (h-14) |
| bg | `--ds-comp-header-bg` | `var(--color-bg-surface1)` = `#111827` |
| border-bottom | `--ds-comp-header-border` | `var(--color-border-default)` |
| padding-h | `--ds-comp-header-px` | `24px` (px-6) |
| z-index | `--ds-comp-header-z` | `50` |
| position | — | `fixed top-0 left-0 right-0` |
| wordmark-size | `--ds-comp-header-wordmark-size` | `16px` |
| wordmark-weight | `--ds-comp-header-wordmark-weight` | `600` |
| logo-size | `--ds-comp-header-logo-size` | `24px` |
| logo-radius | `--ds-comp-header-logo-radius` | Tailwind `rounded` (~4px) |
| logo-bg | `--ds-comp-header-logo-bg` | `.ai-gradient` |

## 7. Edge Cases
| Edge Case | Behavior |
|-----------|---------|
| Very narrow viewport | Wordmark and settings icon always visible (no collapse) |
| Settings open | Modal opens as overlay, header stays behind |
| Content scroll | Header fixed — content scrolls underneath |

## 8. Micro-Interactions
| Interaction | Spec | Reduced Motion |
|------------|------|----------------|
| Logo hover | `opacity 1 → 0.8`, 150ms transition | Same |
| Settings hover | `text-secondary → text-primary`, 150ms | Same |
