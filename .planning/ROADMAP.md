# Roadmap — Milestone v2.0: Backend System

**Milestone:** v2.0 — Backend System (Supabase + Hono API Proxy)
**Created:** 2026-03-17
**Total phases:** 6
**Total requirements:** 22

---

### Phase 8: Supabase + Backend Scaffold
**Goal:** Setup Supabase project, database schema, Hono API proxy scaffold, and monorepo structure

**Requirements:** DATA-05, PROXY-03

**Architecture context:** Tạo foundation: Supabase project (auth + DB), tables với RLS, Hono project cho API proxy. Monorepo structure: `app/` (existing FE) + `api/` (Hono) + shared types.

Plans: ✅ 08-01 (Supabase Schema + SDK), ✅ 08-02 (Hono Scaffold)

**Success Criteria:**
- [x] Supabase project created with PostgreSQL tables (users profile, analyses, patterns, api_keys)
- [x] RLS policies active — users only access own rows
- [x] Hono backend scaffold running locally with health endpoint
- [x] Monorepo workspace configured (app/ + api/)
- [x] Rate-limit middleware configured on Hono
- [x] Environment variables documented (.env.example)

**Deliverable:** Direct code implementation

---

### Phase 9: Authentication
**Goal:** Supabase Auth integration — email/password + Google OAuth + auth gate

**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06, UI-01, UI-02, UI-03

**Architecture context:** Supabase SDK handles auth logic. Frontend cần: AuthContext provider, Login/Register screens, auth gate wrapper. Supabase dashboard cấu hình Google OAuth provider.

Plans: ✅ 09-01 (AuthContext), ✅ 09-02 (Login/Register), ✅ 09-03 (Auth Gate)

**Success Criteria:**
- [x] User can register with email/password → redirected to app
- [x] User can login with email/password
- [x] User can login with Google OAuth
- [x] Session persists across page refresh (auto-refresh)
- [x] Unauthenticated users see only Login screen
- [x] User can logout → returned to Login screen
- [x] Login page has email/password form + Google button
- [x] Register page has email/password + name form

**Deliverable:** Direct code implementation

---

### Phase 10: API Proxy + Prompt Protection
**Goal:** Move all Gemini prompts server-side, proxy AI calls through Hono backend

**Requirements:** PROXY-01, PROXY-04, PROXY-05, UI-06, PROXY-02

**Architecture context:** Đây là phase quan trọng nhất — chuyển toàn bộ business logic (prompts) từ `api.ts` client-side sang `api/src/prompts/` server-side. Frontend `apiClient.ts` gọi backend thay vì Gemini trực tiếp. API key management: user nhập key → encrypted → Supabase DB.

Plans: TBD

**Success Criteria:**
- [ ] All prompts removed from frontend code — zero prompt strings in `app/src/`
- [ ] Backend proxy endpoints: /analyze, /compare, /synthesize, /generate, /evaluate
- [ ] User's API key saved encrypted in Supabase, loaded per-request
- [ ] Settings UI: save/update/delete API key (stored server-side)
- [ ] Gemini errors mapped to consistent `{code, message}` JSON
- [ ] Generation calls handle 120s timeout without proxy killing the request
- [ ] Frontend DevTools shows NO prompt content in network requests

**Deliverable:** Direct code implementation

---

### Phase 11: Server Persistence — Analyses
**Goal:** Save analysis results to Supabase, "My Analyses" UI on Landing

**Requirements:** DATA-01, DATA-03, UI-04, UI-05

**Architecture context:** Sau khi analyze → auto-save result to Supabase. Landing có "My Analyses" card. List page hiển thị saved analyses. Click → view DNA Card in read mode.

Plans: TBD

**Success Criteria:**
- [ ] After analysis completes → result auto-saved to Supabase with thumbnail
- [ ] "My Analyses" card visible on Landing (shows count)
- [ ] Analysis list page: name, thumbnail, date, summary
- [ ] Click analysis → opens DNA Card with full data (read mode)
- [ ] Delete analysis with confirm dialog
- [ ] Data persists across devices (login from different browser → same data)

**Deliverable:** Direct code implementation

---

### Phase 12: Server Persistence — Patterns
**Goal:** Migrate Pattern Library from localStorage to Supabase

**Requirements:** DATA-02, DATA-04

**Architecture context:** Replace `patternStorage.ts` (localStorage) với Supabase SDK calls. PatternLibrary + PatternDetail + CreativeStudio pattern picker đều đọc từ server thay vì localStorage. Save pattern trong CompareScreens cũng ghi lên server.

Plans: TBD

**Success Criteria:**
- [ ] Save pattern (from Compare) writes to Supabase instead of localStorage
- [ ] Pattern Library reads from Supabase
- [ ] Pattern Detail reads from Supabase
- [ ] Creative Studio pattern picker reads from Supabase
- [ ] Delete pattern removes from Supabase
- [ ] Patterns persist across devices
- [ ] patternStorage.ts localStorage functions removed or deprecated

**Deliverable:** Direct code implementation

---

### Phase 13: localStorage Migration
**Goal:** One-time migration of existing localStorage patterns to Supabase on first login

**Requirements:** MIG-01, MIG-02, MIG-03

**Architecture context:** Users hiện tại có patterns trong localStorage. Khi họ login lần đầu, app detect và upload patterns lên Supabase. Idempotent — safe to run multiple times.

Plans: TBD

**Success Criteria:**
- [ ] On first login, app detects existing localStorage patterns
- [ ] Migration prompt shown to user (with pattern count)
- [ ] Patterns uploaded to Supabase with original names, dates, data
- [ ] Migration is idempotent (duplicate detection by name + created date)
- [ ] localStorage cleared after successful migration
- [ ] If no localStorage patterns, migration silently skipped

**Deliverable:** Direct code implementation

---

## Phase Summary

| # | Phase | Requirements | Status |
|---|-------|-------------|--------|
| 8 | Supabase + Backend Scaffold | DATA-05, PROXY-03 | 🔲 Planned |
| 9 | Authentication | AUTH-01..06, UI-01..03 | 🔲 Planned |
| 10 | API Proxy + Prompt Protection | PROXY-01..02,04..05, UI-06 | 🔲 Planned |
| 11 | Server Persistence — Analyses | DATA-01, DATA-03, UI-04..05 | 🔲 Planned |
| 12 | Server Persistence — Patterns | DATA-02, DATA-04 | 🔲 Planned |
| 13 | localStorage Migration | MIG-01..03 | 🔲 Planned |

## Requirement Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | 9 | 🔲 |
| AUTH-02 | 9 | 🔲 |
| AUTH-03 | 9 | 🔲 |
| AUTH-04 | 9 | 🔲 |
| AUTH-05 | 9 | 🔲 |
| AUTH-06 | 9 | 🔲 |
| PROXY-01 | 10 | 🔲 |
| PROXY-02 | 10 | 🔲 |
| PROXY-03 | 8 | 🔲 |
| PROXY-04 | 10 | 🔲 |
| PROXY-05 | 10 | 🔲 |
| DATA-01 | 11 | 🔲 |
| DATA-02 | 12 | 🔲 |
| DATA-03 | 11 | 🔲 |
| DATA-04 | 12 | 🔲 |
| DATA-05 | 8 | 🔲 |
| UI-01 | 9 | 🔲 |
| UI-02 | 9 | 🔲 |
| UI-03 | 9 | 🔲 |
| UI-04 | 11 | 🔲 |
| UI-05 | 11 | 🔲 |
| UI-06 | 10 | 🔲 |
| MIG-01 | 13 | 🔲 |
| MIG-02 | 13 | 🔲 |
| MIG-03 | 13 | 🔲 |
