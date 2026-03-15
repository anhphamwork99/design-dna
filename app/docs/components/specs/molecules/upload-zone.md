# Component Spec: Upload Zone

## 1. Overview
| Field | Value |
|-------|-------|
| Purpose | Accept file uploads via click or drag-and-drop |
| Category | Input |
| Tier | Molecule |
| Token prefix | `--ds-comp-upload-*` |
| Complexity | Medium (3 states, drag interaction) |
| Priority | Must |
| Composition | Container (dashed border) + Icon + Title + Subtitle + Format hint + hidden `<input type="file">` |

## 2. Anatomy
```
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
│                                        │
│            ☁️ (UploadCloud)            │ ← 48px icon
│                                        │
│    Drop image here or click to browse  │ ← Title
│           PNG, JPEG, WEBP              │ ← Format hint
│                                        │
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
          dashed border
```

| Slot | Required | Sizing |
|------|----------|--------|
| Icon | ✅ | `UploadCloud w-12 h-12 text-text-secondary` |
| Title | ✅ | `text-[16px] font-medium text-text-primary mb-1` |
| Subtitle | ❌ | `text-[14px] text-text-secondary mb-2` |
| Format hint | ✅ | `text-[12px] text-text-tertiary` |

## 3. Variants
| Variant | Usage | Differences |
|---------|-------|------------|
| Single image | Upload screen | One file accepted at a time |
| Multi image | Compare Upload | Up to 5 files, shows thumbnail strip |

## 4. State Matrix
| State | Border | Background | Icon color | Cursor |
|-------|--------|-----------|------------|--------|
| default | `2px dashed white/15` | `bg-surface1` | `text-secondary` | pointer |
| hover | `2px dashed accent` | `bg-surface1` | `text-secondary` | pointer |
| drag-active | `2px dashed accent` | `bg-accent/5` | `text-accent` | copy |
| has-file | Hidden — replaced by Image Container + filename | — | — | — |

## 5. Accessibility
- `role="button"` on the clickable container
- Hidden `<input type="file" accept="image/*">` triggered by click
- `aria-label="Upload design image"`
- Keyboard: `Enter/Space` opens file picker
- Drag-and-drop: `onDragOver`, `onDragLeave`, `onDrop` handlers

## 6. Token Mapping
| Property | Component Token | Resolved |
|----------|----------------|----------|
| bg | `--ds-comp-upload-bg` | `var(--color-bg-surface1)` = `#111827` |
| border | `--ds-comp-upload-border` | `rgba(255,255,255,0.15)` |
| border-active | `--ds-comp-upload-border-active` | `var(--color-accent)` = `#0096ED` |
| bg-drag | `--ds-comp-upload-bg-drag` | `rgba(0,150,237,0.05)` |
| radius | `--ds-comp-upload-radius` | `12px` (rounded-xl) |
| padding | `--ds-comp-upload-padding` | `48px 24px` |

## 7. Edge Cases
| Edge Case | Behavior |
|-----------|---------|
| Invalid file type | Ignore silently (accept attribute filters) |
| File too large | Currently no size validation — recommended: add 10MB limit warning |
| Multiple files (single mode) | Only first file accepted |
| Browser no drag support | Click-to-browse always works as fallback |

## 8. Micro-Interactions
| Interaction | Spec | Reduced Motion |
|------------|------|----------------|
| Drag enter | Border + bg transition, 200ms ease | Instant change |
| Drag leave | Reverse transition, 200ms | Instant |
| File accepted | Zone replaced by Image Container — page transition | Same |
