# Phase 1: UI/UX Style Definition - Context

**Gathered:** 2026-03-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Chốt visual design direction hoàn chỉnh: color system, typography, component patterns, aesthetic references → output style guide document mà AI Studio System Instructions sẽ reference khi generate code. Phase này KHÔNG build code — chỉ tạo design specifications.

</domain>

<decisions>
## Implementation Decisions

### Color System & Surfaces
- Brand accent color: `#0096ED` (bright sky blue)
- Background: Cool dark with blue undertone (`#0B0F19` deep navy-black)
- Surface layers: Elevation by lightness + subtle border combo
  - Base: `#0B0F19`
  - Surface 1: `#111827`
  - Surface 2: `#1E293B`
  - Borders: `rgba(255,255,255,0.06)` hoặc tương đương
- Accent strategy: Mono-accent `#0096ED` cho tất cả interactive UI elements
- AI elements: Gradient treatment (e.g., `#0096ED → #7C3AED` blue-to-purple) cho AI-powered buttons, loading states, generate actions — phân biệt rõ "AI đang làm việc" vs "UI thường"
- No glow/glow effects — giữ flat, clean throughout

### Typography & Spacing
- Font family: Geometric sans-serif — Inter hoặc Plus Jakarta Sans (Google Fonts)
- Layout density: Spacious, breathable — nhiều whitespace, từng section rõ ràng, scroll dài nhưng dễ scan
- Heading scale: Large headlines
  - H1: 32px
  - H2: 20px
  - Body: 14px
  - Small/label: 12px
- Data display pattern: Inline `Label: Value` trên cùng 1 dòng — compact, dễ scan ngang
- Font weight strategy: Labels muted/regular, values bold/medium

### Card & Container Style
- DNA Card layout: **Split layout** — uploaded image cố định bên trái, DNA Card scrollable bên phải. User luôn thấy ảnh gốc khi đọc analysis.
- Color palette display: **Proportional color bar** — 5 ô màu ngang liền nhau theo 60-30-10 ratio, HEX codes bên dưới mỗi ô
- "Made For Me" decisions: **Stacked mini-cards** — tất cả decisions hiển thị đầy đủ, mỗi cái là 1 mini-card với icon + decision title + explanation. Không collapse/accordion.
- Upload zone design: Agent's discretion

### Aesthetic Reference & Mood
- Overall aesthetic: **Raycast style** — polished dark UI, strong visual hierarchy, smooth surfaces, slightly "alive" feel
- Micro-animations: **Thoughtful level** — fade transitions giữa screens, loading skeleton shimmer effect, DNA Card sections fade-in staggered khi kết quả trả về (cảm giác AI "đang nghĩ" → từng phần xuất hiện). Không quá rich/fancy.
- Landing screen: **Brief hero + actions** — 1-2 dòng tagline ở trên ("Understand why designs work. Create originals from insights."), rồi 3 action cards bên dưới (Analyze / Compare / future placeholder)
- Branding: **Logo icon + "DesignDNA" wordmark** trong topbar, luôn hiển thị trên mọi screen

### Agent's Discretion
- Upload zone visual design (dashed border vs solid card vs other)
- Exact border-radius values
- Exact spacing/gap values (consistent with spacious intent)
- Loading skeleton specific patterns
- Icon set choice (Lucide, Heroicons, or similar)
- Exact gradient direction and stops for AI elements
- Topbar height and structure
- Mobile responsive breakpoints and adaptations

</decisions>

<specifics>
## Specific Ideas

- "Raycast" là primary aesthetic reference — polished, strong hierarchy, smooth surfaces
- Brand color `#0096ED` phải được integrate harmoniously — background có blue undertone để accent "thuộc về" thay vì "đặt lên"
- AI elements (analyze button, generate button, loading states) dùng gradient để signal "AI hoạt động" — còn lại tất cả solid `#0096ED`
- Split layout cho DNA Card page là non-negotiable — user phải luôn thấy ảnh gốc khi đọc analysis
- Color palette trong DNA Card hiển thị proportional — visual, không chỉ text
- "Made For Me" decisions hiển thị full — không hide/collapse, đây là phần quan trọng nhất

</specifics>

<deferred>
## Deferred Ideas

- SHIFT+B controls UI design (slider, toggle details) — Phase 4 sẽ address khi build F2
- Generation result layout — Phase 4
- Batch compare multi-image upload UI — Phase 5
- Chat refinement UI — Phase 4

</deferred>

---

*Phase: 01-ui-ux-style-definition*
*Context gathered: 2026-03-15*
