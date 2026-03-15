# DesignDNA — Component Registry

> Canonical component library catalog. Synced with [STYLE-GUIDE.md](../../.planning/deliverables/STYLE-GUIDE.md).
> Delivery target: **production-first** (codebase: `app/src/`)

---

## Component Specs

| Component | Category | Tier | Status | Used In | Spec Path | Implementation | Last Updated |
|-----------|----------|------|--------|---------|-----------|----------------|------------|
| Button (Primary) | Action | Atom | ✅ Active | Landing, Results, Generation, Upload, Empty State | `specs/atoms/button.md` | `App.tsx` inline | 2026-03-15 |
| Tag Chip | Communication | Atom | ✅ Active | Results (both tabs) | `specs/atoms/tag-chip.md` | `App.tsx` inline | 2026-03-15 |
| Color Swatch | Data Display | Atom | ✅ Active | Results (Design Breakdown) | `specs/atoms/color-swatch.md` | `App.tsx` inline | 2026-03-15 |
| Skeleton Loader | Feedback | Atom | ✅ Active | Analyzing | `specs/atoms/skeleton.md` | `index.css` + `App.tsx` | 2026-03-15 |
| Image Container | Containment | Atom | ✅ Active | Upload, Results, Analyzing | `specs/atoms/image-container.md` | `App.tsx` inline | 2026-03-15 |
| Data Card | Data Display | Molecule | ✅ Active | Results (both tabs) | `specs/molecules/data-card.md` | `App.tsx` inline | 2026-03-15 |
| Tab Bar | Navigation | Molecule | ✅ Active | Results | `specs/molecules/tab-bar.md` | `App.tsx` inline | 2026-03-15 |
| Upload Zone | Input | Molecule | ✅ Active | Upload, Compare Upload | `specs/molecules/upload-zone.md` | `App.tsx`, `CompareScreens.tsx` | 2026-03-15 |
| Back Navigation | Navigation | Molecule | ✅ Active | Upload, Results | `specs/molecules/back-nav.md` | `App.tsx` inline | 2026-03-15 |
| Error State | Feedback | Molecule | ✅ Active | Analyzing | `specs/molecules/error-state.md` | `App.tsx` inline | 2026-03-15 |
| Empty State | Feedback | Molecule | ✅ Active | Results (fallback) | `specs/molecules/empty-state.md` | `App.tsx` inline | 2026-03-15 |
| Page Header | Navigation | Organism | ✅ Active | All screens | `specs/organisms/page-header.md` | `App.tsx` inline | 2026-03-15 |
| Hero Section | Data Display | Organism | ✅ Active | Results (Buyer DNA) | `specs/organisms/hero-section.md` | `App.tsx` inline | 2026-03-15 |
| Settings Modal | Containment | Organism | ✅ Active | All screens (overlay) | `specs/organisms/settings-modal.md` | `App.tsx` inline | 2026-03-15 |

---

## Tier Definitions

| Tier | Definition | Count |
|------|-----------|-------|
| **Atom** | Single-purpose building block. No children components. | 5 |
| **Molecule** | Combines 2+ atoms into a functional unit. | 6 |
| **Organism** | Complex multi-molecule composition with behavior. | 3 |

---

## Token Namespace

All component tokens follow: `--ds-comp-{slug}-{property}`

| Component | Token Prefix |
|-----------|-------------|
| Button | `--ds-comp-btn-*` |
| Tag Chip | `--ds-comp-tag-*` |
| Color Swatch | `--ds-comp-swatch-*` |
| Skeleton | `--ds-comp-skeleton-*` |
| Image Container | `--ds-comp-img-*` |
| Data Card | `--ds-comp-card-*` |
| Tab Bar | `--ds-comp-tab-*` |
| Upload Zone | `--ds-comp-upload-*` |
| Back Nav | `--ds-comp-backnav-*` |
| Error State | `--ds-comp-error-*` |
| Empty State | `--ds-comp-empty-*` |
| Page Header | `--ds-comp-header-*` |
| Hero Section | `--ds-comp-hero-*` |
| Settings Modal | `--ds-comp-modal-*` |
