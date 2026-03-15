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

### Phase 6: Polish, QA & Iterate
**Goal:** Review toàn bộ app trong AI Studio, fix issues, polish UI, ensure tất cả flows hoạt động end-to-end

**Requirements:** All (cross-cutting)

**Success Criteria:**
- [ ] End-to-end flow: Upload → Analyze → DNA Card → Create → Generated Image → Download
- [ ] End-to-end flow: Upload 2-5 → Compare → Winning Formula → Generate from Formula
- [ ] UI consistent dark mode across all screens
- [ ] No broken states or dead-end flows
- [ ] Error handling for upload failures, generation failures

**Deliverable:** `.planning/deliverables/QA-CHECKLIST.md` + iteration prompts

---

## Phase Summary

| Phase | Name | Requirements | Deliverable |
|-------|------|-------------|-------------|
| 1 | UI/UX Style Definition | APP-02, APP-04 | STYLE-GUIDE.md |
| 2 | AI Studio Configuration | Foundation | AI-STUDIO-CONFIG.md |
| 3 | Build Prompt: Shell + F1 | APP-01,03,04 + F1-* | BUILD-PROMPT-SHELL-F1.md |
| 4 | Build Prompt: F2 | F2-* | BUILD-PROMPT-F2.md |
| 5 | Build Prompt: F3 | F3-* | BUILD-PROMPT-F3.md |
| 6 | Polish & QA | All | QA-CHECKLIST.md |
