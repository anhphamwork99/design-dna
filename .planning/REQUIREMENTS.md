# Requirements — DesignDNA v1

## v1 Requirements

### App Shell & UX
- [x] **APP-01**: Landing screen với action routes (Analyze / Compare)
- [x] **APP-02**: Dark mode elegant UI — premium design-tool aesthetic
- [x] **APP-03**: Loading states/skeletons during AI analysis và generation
- [x] **APP-04**: Responsive layout (desktop-first, mobile-friendly)

### F1 — Design DNA Analysis
- [x] **F1-01**: User upload image (PNG/JPEG/WEBP) via drag-drop hoặc file picker
- [x] ~~**F1-02**: User chọn analysis mode~~ → Merged vào single unified analysis (Phase 6A)
- [x] **F1-03**: Visual DNA — Composition analysis (grid type, symmetry, focal point, visual flow, density)
- [x] **F1-04**: Visual DNA — Color analysis (palette HEX codes, harmony type, 60-30-10 ratio, temperature)
- [x] **F1-05**: Visual DNA — Typography analysis (font classification, hierarchy levels, spacing, Google Fonts suggestions)
- [x] **F1-06**: Visual DNA — Graphics analysis (illustration style, primary/secondary elements, effects, detail level)
- [x] **F1-07**: Visual DNA — POD Technical (best print method, suitable products, garment colors, size scalability)
- [x] **F1-08**: Buyer DNA — Persona (age range, gender lean, interests, values, lifestyle, spending mindset, online communities)
- [x] **F1-09**: Buyer DNA — Identity Signals (tribal belonging, message to world, aesthetic identity)
- [x] **F1-10**: Buyer DNA — Emotional Triggers (primary emotion, trigger description, secondary emotions, emotional arc)
- [x] **F1-11**: Buyer DNA — Occasion & Timing (best seasons, events, mood triggers, gift potential, evergreen vs viral, wear context)
- [x] **F1-12**: Buyer DNA — "Made For Me" Decisions (specific design decisions + why + what would break)
- [x] **F1-13**: DNA Card UI — 2-tab display (Visual DNA tab + Buyer DNA tab)
- [x] **F1-14**: Action buttons from DNA Card: "Create Similar Design" / "Remix for Different Audience" / "Copy DNA JSON"

### F2 — Creative Studio _(redesigned 2026-03-16)_

> **Architecture change:** Generation screen → Creative Studio. Original design required, optional patterns, mandatory AI synthesis before generation.

- [ ] **F2-01**: Creative Studio screen — complete redesign của Generation screen
- [ ] **F2-02**: Original design always visible — image thumbnail + DNA summary as ground truth
- [ ] **F2-03**: Design Controls — simplified SHIFT+B (6 dimensions: Style, Colors, Graphics, Typography, Theme, Audience) với Keep/Change toggles
- [ ] **F2-04**: Creativity Level slider (5 levels: Faithful → Inspired → Remixed → Original → Radical)
- [ ] **F2-05**: Pattern integration UI — "Applied Patterns" section, add/remove patterns from library (or from current compare result)
- [x] **F2-06**: AI Concept Synthesis (new API: `synthesizeConcept()`) — mandatory step trước generation, tạo unified concept
- [x] **F2-07**: Concept review card — 3 concepts trong horizontal carousel (title, description, visual direction, target buyer, coherence notes, key elements chips)
- [x] **F2-08**: Multimodal artwork generation — gửi original image + synthesized prompt + POD constraints cho Gemini image gen
- [x] **F2-09**: POD-ready output enforcement — flat illustration, white/transparent bg, no 3D/effects/gradients, print-ready (enforced in synthesis prompt)
- [ ] **F2-10**: Chat-based refinement — ~~deferred~~ (tạm bỏ theo user decision, thay bằng 3 retry tiers)
- [x] **F2-11**: Download generated image (filename from concept title)
- [x] **F2-12**: Aspect ratio selection (1:1, 4:5, 3:4, 4:3, 16:9, 9:16) for different POD product types

### F3 — Batch Compare & Pattern Save
- [x] **F3-01**: Upload 2-5 images for batch comparison
- [x] **F3-02**: Visual pattern analysis across designs (common colors, typography trends, composition, illustration styles)
- [x] **F3-03**: Buyer Overlap Map (shared persona, shared identity, shared emotion, shared occasion)
- [x] **F3-04**: "Made For Me" patterns — what winning designs have in common
- [x] **F3-05**: Winning Formula output (keep / experiment with / avoid + summary)
- [ ] **F3-06**: Save as Pattern — save compare result as reusable named Pattern in localStorage
- [ ] **F3-07**: After save → option to go to Creative Studio with pattern pre-applied

### F4 — Pattern Library _(new 2026-03-16)_
- [ ] **F4-01**: Pattern list view — show saved patterns with name, source count, created date, summary
- [ ] **F4-02**: Pattern detail view — expandable detail showing visual patterns, buyer overlap, winning formula
- [ ] **F4-03**: Delete pattern
- [ ] **F4-04**: Apply pattern → navigate to Creative Studio with pattern pre-loaded
- [ ] **F4-05**: Pattern persistence in localStorage

### F5 — History & Persistence _(was F4/6C)_
- [ ] **F5-01**: Save analysis results to localStorage (persist across refresh)
- [ ] **F5-02**: Save generated artworks with their DNA context
- [ ] **F5-03**: "My Designs" section on Landing
- [ ] **F5-04**: Delete saved items
- [ ] **F5-05**: Graceful fallback when localStorage is full

## v2 Requirements (Deferred)

- User accounts and cloud sync
- Export DNA Card as PDF/image
- Share analysis via link
- Design collection management
- A/B test suggestions between designs
- Pattern merging (combine 2 patterns into 1)

## Out of Scope

- Trend Advisor via Google Search — quá generic cho ngách đặc thù
- SVG/vector output — Gemini generates raster only
- Real-time canvas editing — prompt-based generation
- Marketplace integration — cần custom backend
- Exact font name identification — Gemini limitation

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| APP-01..04 | Phase 3 + 6A | ● Complete |
| F1-01..14 | Phase 3 + 6A | ● Complete |
| F2-01..12 | Phase 7A + 7B | 🔲 Planned |
| F3-01..05 | Phase 5 | ● Complete |
| F3-06..07 | Phase 7C | 🔲 Planned |
| F4-01..05 | Phase 7C | 🔲 Planned |
| F5-01..05 | Phase 8 | 🔲 Planned |

---
*Last updated: 2026-03-16 after architecture redesign*
