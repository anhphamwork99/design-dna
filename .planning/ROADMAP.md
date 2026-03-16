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

### Phase 7B.1: Pipeline Quality Redesign ✅ (INSERTED)
**Goal:** Redesign synthesis → generation pipeline to maximize output quality. Fix DNA utilization gap (25% → 100%), add text content + color palette to concept schema, implement fidelity gradient for creativity×dimensions.

**Depends on:** Phase 7B
**Source:** Real user testing feedback (2026-03-16) + first-principles audit

**Changes:**
1. **Full DNA packaging** — synthesis receives ALL 30+ DNA fields (not cherry-picked 8)
2. **Expanded concept schema** — add `suggestedText` (primary quote, tagline, text style), `colorPalette` (hex colors), `madeForMeHook`
3. **Fidelity gradient** — creativity level modulates HOW STRICTLY each dimension is followed (not how much DNA to send)
4. **Informed REIMAGINE** — "Change + empty" includes original value as context (not blind "freely")
5. **Rich generation prompt** — inject text content, specific hex colors, background rules into image gen
6. **UI updates** — concept card shows suggested text, color palette swatches, made-for-me hook

Plans:
- [x] 01: API pipeline redesign — full DNA, fidelity gradient, expanded schema
- [x] 02: Concept card UI enrichment — text, palette, hook

**Success Criteria:**
- [x] Synthesis receives full DNA (visual_dna + buyer_dna complete) — packageFullDna() sends ALL fields
- [x] Concepts include `suggestedText.primary`, `colorPalette[]`, `madeForMeHook`
- [x] Creativity level uses fidelity gradient (CREATIVITY_FIDELITY replaces CREATIVITY_SYNTHESIS_LABELS)
- [x] Generation prompt includes text content + hex palette from concept
- [x] REIMAGINE directives include original value context via richContext()
- [x] Concept card UI shows text preview + color swatches + made-for-me hook
- [ ] Output quality improvement verified with same test image (manual testing)

**Reference:** `.planning/phases/7B.1-pipeline-quality-redesign/DESIGN.md` (pipeline redesign spec)

**Deliverable:** Direct code implementation

---

### Phase 7B.2: Typography & Decoration Quality ✅ (INSERTED — Resolved)
**Goal:** Nâng chất lượng typography decoration trong generated artwork lên ngang bằng artwork gốc.

**Depends on:** Phase 7B.1
**Source:** User testing feedback (2026-03-16)

**Resolution:** Two-pass pipeline (Pass 1: illustration-only → Pass 2: text decoration overlay) đã được implement trong Phase 7B/7B.1 sessions, giải quyết root cause (single-pass AI generates both illustration AND text). Phase resolved without separate execution.

**Current Architecture:**
```
Pass 1: generateArtwork() → illustration ONLY (no text in prompt)
    ↓
Pass 2: AI text decoration → integrates decorated typography as integral part of composition
    ↓
Original image passed as style reference in both passes
```

**Deliverable:** Already implemented in `app/src/api.ts` (lines 424-696)

---

### Phase 7C: Pattern Library + Save Flow
**Goal:** Enable saving Compare results as reusable Patterns + Pattern Library UI

**Requirements:** F3-06, F3-07, F4-01..F4-05

**Architecture context:** Patterns là tài sản tái sử dụng. User tích lũy patterns từ nhiều lần Compare, apply vào Creative Studio qua Library panel. Bỏ "Use Winning Formula" shortcut — flow duy nhất qua Library.

**Plans:** 3 plans in 2 waves

Plans:
- [ ] 7C-01-PLAN.md — Pattern storage utility + Save flow on Compare Results (Wave 1)
- [ ] 7C-02-PLAN.md — Pattern Library pages + Landing entry point (Wave 2)
- [ ] 7C-03-PLAN.md — Apply Pattern in Creative Studio + remove prefilledBrief (Wave 2)

**Success Criteria:**
- [ ] After Compare → "Save as Pattern" button with naming popup
- [ ] Pattern saved to localStorage with full batch_analysis + resized thumbnails
- [ ] Pattern Library accessible from Landing screen (if patterns exist)
- [ ] Pattern list: name, thumbnails, created date, summary
- [ ] Pattern detail: dedicated page with flat layout (like Compare Results)
- [ ] Delete pattern with confirm dialog
- [ ] Creative Studio: + Add Pattern → panel → section selection → apply as chip
- [ ] Only 1 pattern applied at a time
- [ ] "Use Winning Formula" completely removed
- [ ] prefilledBrief prop chain completely removed

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
| **7B.1** | **Pipeline Quality Redesign** | **Quality fix** | ✅ Done |
| **7B.2** | **Typography & Decoration Quality** | **Quality fix** | ✅ Resolved |
| **7C** | **Pattern Library + Save Flow** | **F3-06..07, F4-*** | 🔲 Planned |
| 8 | History & Persistence | F5-* | 🔲 Planned |
