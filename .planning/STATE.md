# Project State — DesignDNA

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-16)

**Core value:** Giúp POD sellers hiểu tại sao design bán tốt — visual + buyer psychology — rồi tạo original designs qua Creative Studio
**Architecture:** Original (required) + Patterns (optional) → AI Synthesis (mandatory) → POD-ready Artwork
**Current focus:** Milestone v2.0 — Backend System (defining requirements)

## Current Phase

| Field | Value |
|-------|-------|
| Milestone | v2.0 — Backend System |
| Phase | 11 — Server Persistence — Analyses |
| Status | ● In Progress (2/3 plans complete) |
| Plan 11-01 | ✅ Backend Analyses CRUD Routes |
| Plan 11-02 | ✅ Auto-Save Analysis + Frontend API Integration |
| Plan 11-03 | ⬜ My Analyses UI — Landing Card + List + View |

## Phase Progress

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 8 | Supabase + Backend Scaffold | ● Complete | 100% |
| 9 | Authentication | ● Complete | 100% |
| 10 | API Proxy + Prompt Protection | ● Complete | 100% |
| 11 | Server Persistence — Analyses | ◐ In Progress | 66% |
| 12 | Server Persistence — Patterns | ○ Not Started | 0% |
| 13 | localStorage Migration | ○ Not Started | 0% |

## Architecture Decisions (2026-03-16)

| Decision | Description |
|----------|-------------|
| Original = ground truth | Generation LUÔN bắt đầu từ 1 analyzed design |
| Patterns = reusable assets | Compare results saved as named Patterns, apply 0/1/many |
| Synthesis = mandatory | AI creates unified concept BEFORE artwork generation |
| Multimodal generation | Original image + text prompt sent to Gemini |
| POD-ready output | Flat illustration, white bg, no effects — enforced via prompt |

## Research & References

| File | Content |
|------|---------|
| `.planning/research/DESIGN-ANALYSIS-FRAMEWORK.md` | 6-Layer Design Analysis framework, SHIFT method |
| `.planning/research/DESIGN-ANALYSIS-LEARNINGS.md` | Key learnings from design research |
| `.planning/research/AI-STUDIO-CAPABILITIES.md` | Google AI Studio features, models, prompting |
| `.planning/research/AI-STUDIO-LEARNINGS.md` | Key learnings from AI Studio research |
| `.planning/references/APP-CONCEPT-V2.md` | Complete app concept v2 |
| `.planning/deliverables/reference-pod-artwork/` | Desired POD output style |

## Key Context

- **Build method:** Direct code implementation in IDE (since Phase 6)
- **UI Style:** Dark mode elegant, plain language (no jargon — Phase 6A)
- **Analysis model:** gemini-3.1-pro-preview (unified deep analysis)
- **Synthesis model:** gemini-2.5-pro (concept creation — reasoning)
- **Image gen model:** gemini-2.5-flash-image (multimodal input)
- **Buyer fit model:** gemini-3-flash-preview (scoring)

Last session: 2026-03-17T13:28
Stopped at: Phase 11-02 complete — Auto-Save Analysis implemented
Next action: Phase 11-03 — My Analyses UI — Landing Card + List + View

## Roadmap Evolution

- Milestone v1.0 archived to MILESTONES.md (11 phases, all complete)
- Milestone v2.0 started: Backend System
- Stack: Supabase (Auth + DB) + Hono (API Proxy)
- 22 requirements across 5 categories, mapped to 6 phases

---
*Last updated: 2026-03-17 — Milestone v2.0 roadmap created*
