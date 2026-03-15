# Component Spec: Skeleton Loader

## 1. Overview
| Field | Value |
|-------|-------|
| Purpose | Indicate content is loading with a shimmer placeholder |
| Category | Feedback |
| Tier | Atom |
| Token prefix | `--ds-comp-skeleton-*` |
| Complexity | Low |
| Priority | Must |

## 2. Anatomy
```
┌──────────────────────────────────┐
│  ▒▒▒▒▒▒ shimmer sweep ▒▒▒▒▒▒    │ ← Pseudo-element ::after
│  Container (bg-surface2)         │ ← Static background
└──────────────────────────────────┘
```
| Slot | Required | Sizing |
|------|----------|--------|
| Container | ✅ | Varies by context |

## 3. Variants

| Variant | Height | Width | Usage |
|---------|--------|-------|-------|
| Heading | `h-5` (20px) | `w-[200px]` | Section title placeholder |
| Text line 100% | `h-4` (16px) | `w-full` | Full-width text line |
| Text line 80% | `h-4` (16px) | `w-[80%]` | Paragraph variation |
| Text line 60% | `h-4` (16px) | `w-[60%]` | Short line variation |
| Image | aspect-ratio | `w-full` | Image placeholder |

## 4. State Matrix
Single state — always animating. No interaction states.

## 5. Accessibility
- `aria-hidden="true"` on skeleton elements (decorative)
- Screen readers should read "Loading" on parent container
- Use `aria-busy="true"` on parent section

## 6. Token Mapping
| Property | Component Token | Resolved |
|----------|----------------|----------|
| bg | `--ds-comp-skeleton-bg` | `var(--color-bg-surface2)` = `#1E293B` |
| shimmer-highlight | `--ds-comp-skeleton-highlight` | `rgba(255,255,255,0.05)` → `0.1` gradient |
| radius | `--ds-comp-skeleton-radius` | `rounded` (Tailwind default ~4px) |
| duration | `--ds-comp-skeleton-duration` | `1.5s` |
| timing | `--ds-comp-skeleton-timing` | `linear infinite` |

## 7. Edge Cases
| Edge Case | Behavior |
|-----------|---------|
| Container not visible | Animation should not run (performance) |
| Screen > content | Skeleton blocks match expected content layout |
| Reduced motion | Replace sweep animation with static pulse (opacity 0.5 → 1) |

## 8. Micro-Interactions
| Interaction | Spec |
|------------|------|
| Shimmer sweep | `translateX(-100% → 100%)`, linear gradient `90deg`: transparent → `rgba(255,255,255,0.05)` 20% → `rgba(255,255,255,0.1)` 60% → transparent |
| Duration | 1.5s infinite linear |
| Reduced Motion | `opacity: 0.5 → 1`, 2s ease-in-out infinite |

### CSS Implementation (index.css)
```css
.animate-shimmer { position: relative; overflow: hidden; }
.animate-shimmer::after {
  content: '';
  position: absolute; inset: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(90deg, transparent 0, rgba(255,255,255,0.05) 20%, rgba(255,255,255,0.1) 60%, transparent);
  animation: shimmer 1.5s infinite linear;
}
```
