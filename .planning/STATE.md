# DesignDNA — Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-17)

**Core value:** Giúp POD sellers hiểu CHÍNH XÁC tại sao một design bán tốt — rồi tạo designs original có cùng sức hấp dẫn
**Current focus:** v3.0 UI Redesign — Krea AI-inspired

## Current Phase

| Field | Value |
|-------|-------|
| Milestone | v3.0 — UI Redesign |
| Phase | Not started (defining requirements) |
| Status | Defining requirements |
| Last activity | 2026-03-17 — Milestone v3.0 started |

## Milestone History

| Milestone | Phases | Status |
|-----------|--------|--------|
| v1.0 — Full Feature App | 1 → 7C (11 phases) | ✅ Shipped 2026-03-17 |
| v2.0 — Backend System | 8 → 13 (6 phases) | ✅ Shipped 2026-03-17 |

See `.planning/MILESTONES.md` for full history.

## Architecture Summary

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite SPA |
| Backend API | Hono (TypeScript) |
| Database | Supabase PostgreSQL + RLS |
| Auth | Supabase Auth (email + Google OAuth) |
| AI | Gemini (4 models via server-side proxy) |
| Encryption | AES-256-GCM (API keys) |

## Key Models

- **Analysis:** gemini-3.1-pro-preview
- **Synthesis:** gemini-2.5-pro
- **Image gen:** gemini-2.5-flash-image (multimodal input)
- **Buyer fit:** gemini-3-flash-preview (scoring)

## Accumulated Context

- v3.0 scope: 100% UI redesign, no new features
- Design reference: Krea AI (light, clean, minimal, left sidebar)
- All existing features preserved: Analysis, Creative Studio, Compare, Pattern Library, My Analyses, Settings

Last session: 2026-03-17T16:58
Stopped at: Defining v3.0 requirements
Next action: Research → Requirements → Roadmap
