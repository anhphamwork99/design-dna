# Requirements — Milestone v2.0: Backend System

## v2.0 Requirements

### Authentication (Supabase Auth)

- [x] **AUTH-01**: User can register with email and password *(Phase 9 ✓)*
- [x] **AUTH-02**: User can login with email and password *(Phase 9 ✓)*
- [x] **AUTH-03**: User can login with Google OAuth *(Phase 9 ✓)*
- [x] **AUTH-04**: Session auto-refreshes without user action (Supabase SDK) *(Phase 9 ✓)*
- [x] **AUTH-05**: App requires login — unauthenticated users see login screen only *(Phase 9 ✓)*
- [x] **AUTH-06**: User can logout *(Phase 9 ✓)*

### API Proxy (Hono Backend)

- [x] **PROXY-01**: All Gemini API calls route through backend — prompts/system instructions stored server-side only *(Phase 10 ✓)*
- [x] **PROXY-02**: User's Gemini API key stored encrypted in Supabase DB (per user) *(Phase 10 ✓)*
- [ ] **PROXY-03**: Rate limiting applied per user on AI endpoints *(scaffold — Phase 8 ✓)*
- [x] **PROXY-04**: Gemini errors mapped to consistent JSON format for frontend *(Phase 10 ✓)*
- [x] **PROXY-05**: Proxy handles long-running generation calls (120s timeout) *(Phase 10 ✓)*

### Server Persistence (Supabase PostgreSQL)

- [ ] **DATA-01**: Analysis results (DNA Card JSON) saved per user with thumbnail
- [ ] **DATA-02**: Patterns (Compare results JSON + thumbnails) saved per user
- [ ] **DATA-03**: User can list and delete their analyses
- [ ] **DATA-04**: User can list and delete their patterns
- [x] **DATA-05**: Row Level Security ensures users only access their own data *(Phase 8 ✓)*

### Frontend Auth & Data UI

- [x] **UI-01**: Login page with email/password form and Google sign-in button *(Phase 9 ✓)*
- [x] **UI-02**: Register page with email/password form *(Phase 9 ✓)*
- [x] **UI-03**: Auth gate redirects unauthenticated users to login *(Phase 9 ✓)*
- [ ] **UI-04**: "My Analyses" card on Landing + list page showing saved analyses
- [ ] **UI-05**: Clicking a saved analysis opens DNA Card in read mode
- [x] **UI-06**: Settings page: save/update/delete Gemini API key (stored server-side) *(Phase 10 ✓)*

### Migration

- [ ] **MIG-01**: On first login, detect existing patterns in localStorage
- [ ] **MIG-02**: Upload localStorage patterns to Supabase DB
- [ ] **MIG-03**: Clear localStorage pattern data after successful migration

## Future Requirements (Deferred)

- App-owned API key / free tier pricing
- Generated artwork server-side storage
- Sharing/collaboration features
- Password reset via email
- Search/filter analyses
- Data export (download all as JSON)

## Out of Scope

- Admin dashboard — single role (user) only
- Real-time sync — single user per session
- Complex RBAC — no roles beyond "authenticated user"
- Image/artwork persistence — user downloads manually

## Traceability

| Requirement | Phase |
|-------------|-------|
| AUTH-01..06 | 9 ✅ |
| PROXY-01, PROXY-02, PROXY-04, PROXY-05 | 10 ✅ |
| PROXY-03 | 8 ✅ |
| DATA-01, DATA-03 | 11 |
| DATA-02, DATA-04 | 12 |
| DATA-05 | 8 ✅ |
| UI-01..03 | 9 ✅ |
| UI-04, UI-05 | 11 |
| UI-06 | 10 ✅ |
| MIG-01..03 | 13 |
