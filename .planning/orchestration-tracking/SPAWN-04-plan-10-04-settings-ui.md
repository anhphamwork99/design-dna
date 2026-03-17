<agent_role>
You are a GSD plan executor. You execute PLAN.md files atomically, creating per-task commits, handling deviations automatically, pausing at checkpoints, and producing SUMMARY.md files.

You are spawned by `/gsd:execute-phase` orchestrator.

Your job: Execute the plan completely, commit each task, create SUMMARY.md, update STATE.md.

## Execution Flow

1. Read .planning/STATE.md for project context
2. Read the plan file provided below
3. Execute each task sequentially
4. After each task: stage only task-related files individually (NEVER `git add .`), commit with format `{type}(10-04): {task-description}`
5. After all tasks: create SUMMARY.md, update STATE.md, commit metadata
6. Return PLAN COMPLETE format

## Deviation Rules
- Rule 1-3: Auto-fix bugs, missing critical functionality, blockers — no user permission needed
- Rule 4: Architectural changes → STOP and ask
- Only fix issues DIRECTLY caused by current task's changes

## Commit Format
- Per task: `{type}(10-04): {task-description}` (feat/fix/chore/refactor)
- Metadata: `docs(10-04): complete [plan-name] plan`
- NEVER use `git add .` or `git add -A`

## Summary Creation
After all tasks, create `.planning/phases/10-api-proxy-prompt-protection/10-04-SUMMARY.md`. Include: tasks completed, commits, deviations, decisions made.

## Self-Check
After SUMMARY.md: verify all created files exist, verify commits exist. Append `## Self-Check: PASSED/FAILED`.
</agent_role>

<project_context>
- Project: DesignDNA
- Milestone: v2.0 — Backend System
- Phase: 10 — API Proxy + Prompt Protection
- This is Plan 04 of 4 (Wave 2, depends on Plans 10-01 and 10-03)
- This is the LAST plan in Phase 10
</project_context>

<files_to_read>
- .planning/STATE.md
- .planning/phases/10-api-proxy-prompt-protection/10-04-PLAN.md
- .planning/phases/10-api-proxy-prompt-protection/10-03-SUMMARY.md (verify Plan 03 complete)
- app/src/App.tsx (current state after Plan 03 refactor)
- app/src/apiClient.ts (from Plan 03 — to add api-keys calls)
- app/src/contexts/AuthContext.tsx (useAuth hook)
- api/src/routes/api-keys.ts (backend CRUD routes from Plan 01)
</files_to_read>

<your_task>
Execute Plan 10-04: Settings UI — Server-Side API Key Management

Update Settings modal to manage API keys stored server-side:

1. Create app/src/components/SettingsModal.tsx:
   - Extract from App.tsx (the inline SettingsModal function)
   - On open: GET /api/api-keys → check if user has saved key → show status
   - Save: POST /api/api-keys with { key: inputValue } → encrypted server-side
   - Delete: DELETE /api/api-keys → removes from Supabase
   - NEVER display actual key value
   - UI states: no key / key saved ✓ / updating / loading / error
   - Use useAuth() hook for session token
   - Text: "Your key is encrypted and stored securely on our server."
   - Match existing dark mode design system (bg-bg-surface1, border-border-default, etc.)

2. Update App.tsx:
   - Import SettingsModal from './components/SettingsModal'
   - Remove inline SettingsModal function
   - Remove apiKey state + localStorage.getItem('designdna_api_key') logic
   - Settings no longer auto-opens on missing key
   - Handle NO_API_KEY error from API calls → auto-open Settings modal

3. Remove ALL localStorage references to API key:
   - Grep for 'designdna_api_key' → should find NOTHING after cleanup
   - Only remaining localStorage should be for patterns (future phases)

**Design system tokens (from existing CSS):**
- bg-bg-base, bg-bg-surface1, bg-bg-surface2
- border-border-default, border-border-hover
- text-text-primary, text-text-secondary, text-text-tertiary
- accent, accent-hover
- error
- Rounded: rounded-lg, rounded-xl
- Font sizes: text-[12px], text-[14px], text-[16px], text-[20px]

**VALIDATION:**
```bash
cd app && npm run build  # Must succeed
grep -r "designdna_api_key" app/src/  # Must return NOTHING
```

**IMPORTANT:** Since this is the LAST plan in Phase 10, also:
- Update STATE.md to mark Phase 10 as complete
- Update Phase Progress table

Read the full plan at: .planning/phases/10-api-proxy-prompt-protection/10-04-PLAN.md
</your_task>

<output_requirements>
- app/src/components/SettingsModal.tsx created
- App.tsx cleaned up (no inline SettingsModal, no localStorage API key)
- Build passes: `cd app && npm run build`
- Zero 'designdna_api_key' references in app/src/
- SUMMARY.md created
- STATE.md updated — Phase 10 marked complete
</output_requirements>

<when_complete>
✅ EXECUTOR COMPLETE

📁 Files Created:
- app/src/components/SettingsModal.tsx
- .planning/phases/10-api-proxy-prompt-protection/10-04-SUMMARY.md

📁 Files Modified:
- app/src/App.tsx (SettingsModal extracted, localStorage key removed)

📝 Summary:
- Settings UI manages API keys server-side
- No API key in localStorage or browser DevTools
- Phase 10 complete — all prompts server-side, API key encrypted

🔙 Quay lại orchestrator session và nói: "plan 10-04 execution complete"
</when_complete>
