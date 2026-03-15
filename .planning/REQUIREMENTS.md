# Requirements — DesignDNA v1

## v1 Requirements

### App Shell & UX
- [ ] **APP-01**: Landing screen với 3 action routes (Analyze 1 Design / Compare 2-5 Designs / placeholder cho future)
- [ ] **APP-02**: Dark mode elegant UI — premium design-tool aesthetic, clean spacing, subtle animations
- [ ] **APP-03**: Loading states/skeletons during AI analysis và generation
- [ ] **APP-04**: Responsive layout (desktop-first, mobile-friendly)

### F1 — Design DNA Analysis
- [ ] **F1-01**: User upload image (PNG/JPEG/WEBP) via drag-drop hoặc file picker
- [ ] **F1-02**: User chọn analysis mode: Quick Scan (Visual only) hoặc Deep Analysis (Visual + Buyer)
- [ ] **F1-03**: Visual DNA — Composition analysis (grid type, symmetry, focal point, visual flow, density)
- [ ] **F1-04**: Visual DNA — Color analysis (palette HEX codes, harmony type, 60-30-10 ratio, temperature)
- [ ] **F1-05**: Visual DNA — Typography analysis (font classification, hierarchy levels, spacing, Google Fonts suggestions)
- [ ] **F1-06**: Visual DNA — Graphics analysis (illustration style, primary/secondary elements, effects, detail level)
- [ ] **F1-07**: Visual DNA — POD Technical (best print method, suitable products, garment colors, size scalability)
- [ ] **F1-08**: Buyer DNA — Persona (age range, gender lean, interests, values, lifestyle, spending mindset, online communities)
- [ ] **F1-09**: Buyer DNA — Identity Signals (tribal belonging, message to world, aesthetic identity)
- [ ] **F1-10**: Buyer DNA — Emotional Triggers (primary emotion, trigger description, secondary emotions, emotional arc)
- [ ] **F1-11**: Buyer DNA — Occasion & Timing (best seasons, events, mood triggers, gift potential, evergreen vs viral, wear context)
- [ ] **F1-12**: Buyer DNA — "Made For Me" Decisions (list of specific design decisions + why each creates personal resonance + what would break if changed)
- [ ] **F1-13**: DNA Card UI — 2-tab display (Visual DNA tab + Buyer DNA tab) showing all analysis results
- [ ] **F1-14**: Action buttons from DNA Card: "Create: Same Buyer" / "Create: New Buyer" / "Copy DNA JSON"

### F2 — Creative Generation
- [ ] **F2-01**: 3 Generation modes: "Same Buyer, New Design" / "Same Style, New Buyer" / "Full Remix"
- [ ] **F2-02**: Creativity Level slider (5 levels: Faithful → Inspired → Remixed → Original → Radical)
- [ ] **F2-03**: SHIFT+B dimension controls — 6 toggles (Subject, Harmony, Identity, Form, Text, Buyer Emotion) with Keep/Change + text input for changes
- [ ] **F2-04**: Specificity Level selector (General / Niche / Hyper-niche)
- [ ] **F2-05**: Generate image from DNA insights via Gemini image generation
- [ ] **F2-06**: Buyer Fit analysis on generated design (buyer match %, emotion match %, originality %, "made for me" signal count)
- [ ] **F2-07**: Chat-based refinement — text input to iterate on generated image
- [ ] **F2-08**: Download generated image button

### F3 — Batch Compare
- [ ] **F3-01**: Upload 2-5 images for batch comparison
- [ ] **F3-02**: Visual pattern analysis across all designs (common colors, typography trends, composition patterns, illustration styles)
- [ ] **F3-03**: Buyer Overlap Map (shared persona, shared identity, shared emotion, shared occasion patterns)
- [ ] **F3-04**: "Made For Me" patterns — what winning designs have in common in terms of buyer resonance
- [ ] **F3-05**: Winning Formula output (keep / experiment with / avoid + auto-generated design brief)
- [ ] **F3-06**: "Generate from Formula" button → routes to F2 with formula pre-filled

## v2 Requirements (Deferred)

- Save/load analysis history (requires backend storage)
- User accounts and workspace
- Export DNA Card as PDF/image
- Share analysis via link
- Design collection management
- A/B test suggestions between designs

## Out of Scope

- Trend Advisor via Google Search — quá generic cho ngách đặc thù
- SVG/vector output — Gemini generates raster only
- Real-time canvas editing — AI Studio is prompt-based
- Marketplace integration — cần custom backend ngoài AI Studio
- Exact font name identification — Gemini limitation

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| APP-01..04 | Phase 3 | ● Complete |
| F1-01..14 | Phase 3 | ● Complete |
| F2-01..08 | Phase 4 | ● Complete |
| F3-01..06 | Phase 5 | ○ Pending |
