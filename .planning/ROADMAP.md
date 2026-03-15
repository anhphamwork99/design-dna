# Roadmap — DesignDNA v1

## Milestone: v1.0 — Full Feature App via AI Studio

**Delivery method:** Mỗi phase tạo deliverable (prompt/config/style guide) → paste vào Google AI Studio → verify → iterate

---

### Phase 1: UI/UX Style Definition
**Goal:** Chốt visual design direction, color tokens, component patterns, typography → tạo style guide mà AI Studio sẽ follow

**Requirements:** APP-02, APP-04 (partial)

**Plans:** 1 plan

Plans:
- [x] 01-01-PLAN.md — Create comprehensive STYLE-GUIDE.md with all design tokens, component patterns, layout specs, and quick reference table

**Success Criteria:**
- [x] Color palette (dark mode) defined với HEX codes
- [x] Typography system chọn (Google Fonts) 
- [x] Component patterns documented (cards, buttons, tabs, sliders, upload zones)
- [x] Style guide document hoàn thiện, ready để embed vào System Instructions

**Deliverable:** `.planning/deliverables/STYLE-GUIDE.md`

---

### Phase 2: AI Studio Configuration
**Goal:** Tạo System Instructions + Structured Output schemas + model selection config cho AI Studio project

**Requirements:** Foundation cho tất cả F1/F2/F3 features

**Plans:** 1 plan

Plans:
- [x] 02-01-PLAN.md — Create AI-STUDIO-CONFIG.md with System Instructions (condensed style guide), JSON schemas, model mapping, prompt templates

**Success Criteria:**
- [x] System Instructions draft hoàn thiện (role, capabilities, constraints, output formats)
- [x] JSON schemas cho DNA analysis output (Visual DNA + Buyer DNA)  
- [x] JSON schemas cho Batch Compare output
- [x] Model selection mapping documented
- [x] AI Studio settings guide (model, framework, instructions)

**Deliverable:** `.planning/deliverables/AI-STUDIO-CONFIG.md`

---

### Phase 3: Build Prompt — App Shell + F1 Analysis
**Goal:** Tạo prompt cho AI Studio Build Mode để generate: landing screen, upload flow, DNA analysis, DNA Card UI

**Requirements:** APP-01, APP-03, APP-04, F1-01..F1-14

**Plans:** 1 plan

Plans:
- [x] 03-01-PLAN.md — App scaffold prompt (mock data) + API wiring prompt + fix templates

**Success Criteria:**
- [x] Build prompt tạo được landing screen với 3 actions
- [x] Upload image flow hoạt động
- [x] Analysis mode selection (Quick Scan / Deep Analysis) 
- [x] DNA Card UI hiển thị đúng 2 tabs (Visual + Buyer)
- [x] Loading states during analysis
- [x] Dark mode styling theo Phase 1 style guide

**Deliverable:** `.planning/deliverables/BUILD-PROMPT-SHELL-F1.md`

---

### Phase 4: Build Prompt — F2 Creative Generation
**Goal:** Tạo prompt cho AI Studio Build Mode để add: generation mode selection, SHIFT+B controls, creativity slider, image generation, buyer fit analysis, chat refinement

**Requirements:** F2-01..F2-08

**Plans:** 1 plan

Plans:
- [x] 04-01-PLAN.md — Generation UI scaffold, API wiring, fix templates

**Success Criteria:**
- [x] 3 generation modes hoạt động (Same Buyer / New Buyer / Full Remix)
- [x] Creativity Level slider (5 levels) ảnh hưởng prompt generation
- [x] SHIFT+B controls với 6 dimensions (keep/change toggles + text input)
- [x] AI generates image và hiển thị result
- [x] Buyer Fit analysis hiển thị scores
- [x] Chat refinement multi-turn hoạt động  
- [x] Download button hoạt động

**Deliverable:** `.planning/deliverables/BUILD-PROMPT-F2.md`

---

### Phase 5: Build Prompt — F3 Batch Compare
**Goal:** Tạo prompt cho AI Studio Build Mode để add: multi-image upload, cross-design analysis, buyer overlap map, winning formula

**Requirements:** F3-01..F3-06

**Plans:** 1 plan

Plans:
- [x] 05-01-PLAN.md — Batch Compare UI scaffold, API wiring, fix templates

**Success Criteria:**
- [x] Upload 2-5 images interface hoạt động
- [x] Visual pattern analysis across designs
- [x] Buyer Overlap Map hiển thị đúng
- [x] "Made For Me" patterns identified
- [x] Winning Formula output với actionable brief
- [x] "Generate from Formula" routes đúng sang F2

**Deliverable:** `.planning/deliverables/BUILD-PROMPT-F3.md`

---

### Phase 6A: Critical UX Fixes
**Goal:** Fix userflow issues identified in real user testing — simplify landing, fix analyzing screen, merge analysis modes, improve UX copy

**Source:** User testing feedback — 2026-03-15 (Issues UX-1 through UX-6)

**Plans:** TBD

Plans:
- [ ] 6A-01-PLAN.md — Landing simplification: remove/replace "Generate Design" card, simplify action button labels on DNA Card
- [ ] 6A-02-PLAN.md — Analyzing screen: keep uploaded image visible, skeleton only analysis content, add scan effect
- [ ] 6A-03-PLAN.md — Parallel analysis: merge Quick/Deep into single "Full Analysis" call, fix Visual DNA data loss, progressive reveal
- [ ] 6A-04-PLAN.md — UX copy overhaul: replace jargon ("SHIFT+B Dimensions", "Specificity Level") with user-friendly language

**Success Criteria:**
- [ ] Landing has 2 clear actions (Analyze + Compare) + optional "My Designs" (if 6C done)
- [ ] Analyzing screen shows uploaded image with scan animation, only skeletons DNA content
- [ ] Single "Analyze" action runs both Visual + Buyer DNA in parallel
- [ ] Visual DNA data persists when Buyer DNA completes
- [ ] All technical jargon replaced with plain language

**Deliverable:** Build prompts for each fix task

---

### Phase 6B: Generation Screen Redesign + POD Quality
**Goal:** Redesign Generation screen from scratch (via `/design:screen-create`), add image reference to generation API, enforce POD print-ready output quality

**Source:** User testing feedback — UX-6, FEAT-1, FEAT-3

**Plans:** TBD

Plans:
- [ ] 6B-01-PLAN.md — `/design:screen-create` for new Generation screen: simplify 15+ controls into preset-based wizard
- [ ] 6B-02-PLAN.md — POD quality prompt constraints: flat illustration, white bg, no effects, print-ready
- [ ] 6B-03-PLAN.md — Image reference in generation: send original image + analysis DNA as generation context

**Success Criteria:**
- [ ] Generation screen is intuitive for new users (≤5 interactive elements visible)
- [ ] Generated artwork: flat illustration, clean lines, white/transparent background
- [ ] Generated artwork matches reference image style (POD-standard)
- [ ] Original image is used as style reference during generation
- [ ] No surface effects, lighting, 3D, glass, or photorealistic elements in output

**Reference:** See `.planning/deliverables/reference-pod-artwork/` for desired output style

**Deliverable:** Screen design spec + build prompts

---

### Phase 6C: History & Persistence
**Goal:** Add client-side persistence so users can view past analyses and generated designs

**Source:** User testing feedback — FEAT-2

**Plans:** TBD

Plans:
- [ ] 6C-01-PLAN.md — localStorage persistence layer: save/load analysis results + generated images
- [ ] 6C-02-PLAN.md — "My Designs" UI on Landing: grid of saved designs with quick-view

**Success Criteria:**
- [ ] Analysis results persist across page refresh (localStorage)
- [ ] Generated images saved with their DNA context
- [ ] "My Designs" section on Landing shows saved items (max 10-20)
- [ ] User can delete saved items
- [ ] Graceful fallback when localStorage is full

**Deliverable:** Build prompts for persistence layer + UI

---

## Phase Summary

| Phase | Name | Requirements | Deliverable | Status |
|-------|------|-------------|-------------|--------|
| 1 | UI/UX Style Definition | APP-02, APP-04 | STYLE-GUIDE.md | ✅ Done |
| 2 | AI Studio Configuration | Foundation | AI-STUDIO-CONFIG.md | ✅ Done |
| 3 | Build Prompt: Shell + F1 | APP-01,03,04 + F1-* | BUILD-PROMPT-SHELL-F1.md | ✅ Done |
| 4 | Build Prompt: F2 | F2-* | BUILD-PROMPT-F2.md | ✅ Done |
| 5 | Build Prompt: F3 | F3-* | BUILD-PROMPT-F3.md | ✅ Done |
| 6A | Critical UX Fixes | UX-1..6 | Build prompts | 🔲 Planned |
| 6B | Generation Redesign + POD Quality | UX-6, FEAT-1, FEAT-3 | Screen spec + build prompts | 🔲 Planned |
| 6C | History & Persistence | FEAT-2 | Build prompts | 🔲 Planned |
