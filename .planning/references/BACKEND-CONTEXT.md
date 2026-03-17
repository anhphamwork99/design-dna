# Backend System — Discussion Context

**Gathered:** 2026-03-17
**Status:** Ready for new milestone planning

## Motivation

Chuyển DesignDNA từ client-side SPA sang full-stack application:
1. **Persistence** — Lưu data server-side thay vì localStorage
2. **User accounts** — Auth + multi-device sync
3. **Bảo vệ nghiệp vụ** — API proxy để prompts/system instructions không bị lộ ở frontend

## Implementation Decisions

### Data Persistence
- Persist **Analysis results** (DNA Card JSON, ~50-100KB/analysis) — YES
- Persist **Patterns** (Compare results, JSON + thumbnails) — YES
- Persist **Generated artworks** (base64 images) — NO (user downloads manually)
- → Chỉ cần database, không cần cloud storage (S3, etc.)

### Authentication
- **Email/password** truyền thống — YES
- **Google OAuth** — YES
- **Bắt buộc login** mới dùng được app (no guest mode)

### API Proxy
- Backend proxy tất cả Gemini API calls — giấu prompts khỏi frontend
- **User vẫn nhập API key riêng** — backend chỉ proxy request, user tự trả phí
- API key lưu server-side (per user), không expose ở client

### Frontend Changes
- **"My Analyses"** — card riêng trên Landing Screen
- Click saved analysis → mở lại DNA Card (view mode)
- **Pattern Library** — migrate từ localStorage lên server
- Migration: khi user tạo account lần đầu → patterns localStorage tự động upload lên server

### Backend Stack
- **Agent's discretion**

## Deferred Ideas
- App-owned API key / free tier — tạm không (user tự nhập key)
- Generated artwork storage — tạm không persist
- Sharing/collaboration — chưa scope

---
*Context from discuss-phase session, 2026-03-17*
