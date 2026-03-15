# Roadmap — DesignDNA v1

## Milestone: v1.0 — Full Feature App

**Architecture:** 3-layer pipeline: Understand (Analyze + Compare) → Ideate (Creative Studio + Synthesis) → Create (POD-ready Artwork)

---

### Phase 1: UI/UX Style Definition ✅
**Goal:** Chốt visual design direction, color tokens, component patterns, typography

**Requirements:** APP-02, APP-04 (partial)

Plans:
- [x] 01-01-PLAN.md — Create comprehensive STYLE-GUIDE.md

**Deliverable:** `.planning/deliverables/STYLE-GUIDE.md`

---

### Phase 2: AI Studio Configuration ✅
**Goal:** Tạo System Instructions + Structured Output schemas + model selection config

**Requirements:** Foundation cho tất cả features

Plans:
- [x] 02-01-PLAN.md — Create AI-STUDIO-CONFIG.md

**Deliverable:** `.planning/deliverables/AI-STUDIO-CONFIG.md`

---

### Phase 3: Build — App Shell + F1 Analysis ✅
**Goal:** Landing screen, upload flow, DNA analysis, DNA Card UI

**Requirements:** APP-01, APP-03, APP-04, F1-01..F1-14

Plans:
- [x] 03-01-PLAN.md — App scaffold + API wiring

**Deliverable:** `.planning/deliverables/BUILD-PROMPT-SHELL-F1.md`

---

### Phase 4: Build — F2 Creative Generation (v1) ✅
**Goal:** Generation mode selection, SHIFT+B controls, creativity slider, image gen, buyer fit, chat refinement

**Requirements:** F2-01..F2-08 (original version, before architecture redesign)

Plans:
- [x] 04-01-PLAN.md — Generation UI scaffold, API wiring

**Deliverable:** `.planning/deliverables/BUILD-PROMPT-F2.md`

---

### Phase 5: Build — F3 Batch Compare ✅
**Goal:** Multi-image upload, cross-design analysis, buyer overlap map, winning formula

**Requirements:** F3-01..F3-05

Plans:
- [x] 05-01-PLAN.md — Batch Compare UI scaffold, API wiring

**Deliverable:** `.planning/deliverables/BUILD-PROMPT-F3.md`

---

### Phase 6A: Critical UX Fixes ✅
**Goal:** Fix userflow issues identified in real user testing

**Source:** User testing feedback — 2026-03-15 (Issues UX-1 through UX-6)

Plans:
- [x] 6A-01-PLAN.md — Landing simplification + button labels
- [x] 6A-02-PLAN.md — Analyzing screen redesign (image visible + scan effect)
- [x] 6A-03-PLAN.md — Merge Quick/Deep into unified analysis
- [x] 6A-04-PLAN.md — UX copy overhaul (jargon → plain language)

**Deliverable:** Direct code implementation

---

### Phase 7A: Creative Studio — UI Redesign ✅
**Goal:** Redesign Generation screen thành Creative Studio. Simplify 15+ controls thành layout rõ ràng với 3 sections: Original + Design Controls + Applied Patterns

**Requirements:** F2-01, F2-02, F2-03, F2-04, F2-05

**Architecture context:** Generation luôn bắt đầu từ 1 analyzed design (ground truth). Controls modify DNA dimensions. Patterns (từ Compare) là optional add-ons.

Plans:
- [x] 7A-01-PLAN.md — Creative Studio layout + simplified controls UI
- [x] 7A-02-PLAN.md — Pattern integration UI (apply/remove patterns from Creative Studio)

**Success Criteria:**
- [x] Creative Studio shows original design image + DNA summary (always visible)
- [x] Design Controls simplified: 6 dimensions với keep/change toggle (no 3-mode card selector)
- [x] Creativity Level slider retained (5 levels)
- [x] "Applied Patterns" section: add patterns (from library or current compare result), remove
- [x] ≤8 interactive elements visible before action (down from 15+)

**Deliverable:** Direct code implementation

---

### Phase 7B: Concept Synthesis + POD-Ready Generation ✅
**Goal:** Implement mandatory AI synthesis step (concept creation) + multimodal generation with POD quality enforcement

**Requirements:** F2-06, F2-07, F2-08, F2-09, F2-10, F2-11, F2-12

**Architecture context:** TRƯỚC KHI generate artwork, AI phải synthesize original DNA + modifications + applied patterns thành 1 unified concept. Generation gửi concept + original image (multimodal) + POD constraints.

Plans:
- [x] 7B-01-PLAN.md — `synthesizeConcept()` + `generateArtwork()` API functions (multimodal, POD-enforced)
- [x] 7B-02-PLAN.md — Concept carousel UI, retry tiers, aspect ratio dropdown

**Success Criteria:**
- [x] "Create Concepts" → AI returns 3 SynthesizedConcept (title, description, visual direction, buyer target, coherence notes, key elements)
- [x] User browses 3 concepts in horizontal carousel, selects one
- [x] "Generate Artwork" sends concept + original image to Gemini (multimodal input)
- [x] Output: flat illustration, white/transparent bg, no 3D/effects, print-ready (POD constraints in synthesis)
- [x] Original uploaded image used as style reference (creativity level drives reference strength)
- [x] 3 retry tiers: Regenerate Artwork, Try Different Concept, Start Over
- [x] Download button works (filename from concept title)
- [x] Aspect ratio options: 1:1, 4:5, 3:4, 4:3, 16:9, 9:16

**Reference:** `.planning/deliverables/reference-pod-artwork/` for desired output quality

**Deliverable:** Direct code implementation


---

### Phase 7C: Pattern Library + Save Flow
**Goal:** Enable saving Compare results as reusable Patterns + Pattern Library UI

**Requirements:** F3-06, F3-07, F4-01..F4-05

**Architecture context:** Patterns là tài sản tái sử dụng. User tích lũy patterns từ nhiều lần Compare, apply 0/1/nhiều khi tạo artwork trong Creative Studio.

Plans:
- [ ] 7C-01-PLAN.md — Pattern data model + localStorage persistence + save from Compare results
- [ ] 7C-02-PLAN.md — Pattern Library UI (list, view detail, delete, apply → navigate to Creative Studio)

**Success Criteria:**
- [ ] After Compare → "Save as Pattern" button (user names the pattern)
- [ ] Pattern saved to localStorage with full structured data (visual patterns, buyer overlap, winning formula, specificity ladder)
- [ ] Pattern Library accessible from Landing screen (if patterns exist)
- [ ] Pattern list: name, source count, created date, summary preview
- [ ] Pattern detail: expandable view with all data
- [ ] Delete pattern action
- [ ] "Apply Pattern" → opens Creative Studio with pattern pre-loaded

**Deliverable:** Direct code implementation

---

### Phase 8: History & Persistence
**Goal:** Client-side persistence for analysis results and generated artworks

**Requirements:** F5-01..F5-05

Plans:
- [ ] 8-01-PLAN.md — localStorage persistence layer (analyses + artworks)
- [ ] 8-02-PLAN.md — "My Designs" UI on Landing

**Success Criteria:**
- [ ] Analysis results persist across page refresh
- [ ] Generated images saved with DNA context + synthesis concept
- [ ] "My Designs" section on Landing shows saved items
- [ ] Delete saved items
- [ ] Graceful fallback when localStorage full

**Deliverable:** Direct code implementation

---

## Phase Summary

| Phase | Name | Requirements | Status |
|-------|------|-------------|--------|
| 1 | UI/UX Style Definition | APP-02, APP-04 | ✅ Done |
| 2 | AI Studio Configuration | Foundation | ✅ Done |
| 3 | Build: Shell + F1 | APP-01..04 + F1-* | ✅ Done |
| 4 | Build: F2 Generation (v1) | F2-* (original) | ✅ Done |
| 5 | Build: F3 Batch Compare | F3-01..05 | ✅ Done |
| 6A | Critical UX Fixes | UX-1..6 | ✅ Done |
| **7A** | **Creative Studio — UI Redesign** | **F2-01..05** | ✅ Done |
| **7B** | **Concept Synthesis + POD Generation** | **F2-06..12** | ✅ Done |
| **7C** | **Pattern Library + Save Flow** | **F3-06..07, F4-*** | 🔲 Planned |
| 8 | History & Persistence | F5-* | 🔲 Planned |
