# Phase 21: Compare Screen Redesign - Context

**Gathered:** 2026-03-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Redesign the Compare flow: upload designs → analyzing → view comparison results → save pattern / use in studio. All within the existing Compare route (`/compare`). No new capabilities — redesign only.

</domain>

<decisions>
## Implementation Decisions

### Design Selection Flow
- Upload mới only — không có "pick from My Analyses" modal
- Giữ upload trực tiếp 2-5 images như hiện tại
- Dùng shared UploadZone nếu phù hợp, hoặc custom zone cho multi-image

### Results Layout & Density
- Refactor results thành layout mới — agent dùng screen-create skill để thiết kế
- UX copy hiện tại không rõ ràng — agent dùng ux-writing skill để rewrite toàn bộ copy
- Kết quả cần readable, không phải wall-of-text dọc

### Post-comparison Actions
- **Save as Pattern là primary action** — nổi bật nhất
- **Use in Studio là secondary** — navigate to `/studio` với winning formula pre-loaded (auto "Explore" goal + shifts injected vào config)
- **New Comparison** — tertiary, ghost/text style
- **Button layout 2 hàng:**
  - Hàng 1: [Save as Pattern] full-width, primary style
  - Hàng 2: [Use in Studio] + [New Comparison] cùng hàng, secondary/ghost
- **Không confirm khi navigate away** — user tự do chuyển sang Studio hoặc New Comparison mà không bị cản, kể cả khi chưa save

### Loading & Empty States
- Loading animation dùng GIF giống Clone design flow (chibi mascot GIF)
- Không dùng skeleton shimmer cho analyzing state

### Agent's Discretion
- Results layout chi tiết (card grid, accordion, comparison matrix, etc.) — quyết định khi implement với screen-create
- UX copy cụ thể — quyết định khi implement với ux-writing skill
- Upload zone visual design (reuse shared UploadZone hay custom)
- Transition animations (nếu có)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/shared/UploadZone.tsx`: Drag & drop upload component — có thể reuse cho multi-image
- `components/shared/Card.tsx`: Surface card with border + hover
- `components/shared/Button.tsx`: Primary, secondary, ghost variants
- `components/shared/Modal.tsx`: Overlay with backdrop blur
- `components/shared/EmptyState.tsx`: Icon + title + description + CTA
- `components/shared/ErrorBanner.tsx`: Error message + retry
- `components/shared/Badge.tsx`: Small pill

### Established Patterns
- Stage-machine pattern (from Studio Phase 20): `type Step = 'upload' | 'analyzing' | 'results'`
- API client: `analyzeBatch()` function handles compare API call
- Auth context: `useAuth()` for session/token access
- Pattern save: `savePattern()`, `checkPatternSaved()` already exist in apiClient
- Error handling: comprehensive error mapping (timeout, API key, rate limit, etc.)

### Integration Points
- `CompareScreen.tsx` (150 LOC): Thin shell with step routing — can be refactored in place
- `CompareScreens.tsx` (565 LOC): 3 inline screens — target for redesign/replacement
- Route state passing to Studio: `navigate('/studio', { state: { ... } })` pattern from AnalyzeScreen
- Sidebar active state already wired for `/compare`

</code_context>

<specifics>
## Specific Ideas

- GIF loading animation giống Clone design (chibi mascot) — already exists in project
- UX copy cần được rewrite bằng ux-writing skill — hiện tại "Extract Winning Formula" và các labels không rõ ràng cho user
- "Use in Studio" phải pre-load winning formula vào Studio state, không để user tự tìm

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 21-compare-screen-redesign*
*Context gathered: 2026-03-18*
