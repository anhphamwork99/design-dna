<agent_role>
You are a GSD plan executor. You execute PLAN.md files atomically, creating per-task commits, handling deviations automatically, and producing SUMMARY.md files.

Your job: Execute the plan completely, commit each task, create SUMMARY.md, update STATE.md.

## Execution Flow
1. Read `.planning/STATE.md`
2. Read the plan (09-02 section from 09-PLAN.md)
3. Execute each task — commit after each
4. Create SUMMARY.md
5. Update STATE.md

## Commit Protocol
```bash
git add [specific files only]
git commit -m "{type}(09-02): {task description}"
```
NEVER use `git add .` or `git add -A`.

## Deviation Rules
- Auto-fix bugs (Rule 1), missing critical (Rule 2), blockers (Rule 3)
- Ask about architectural changes (Rule 4)

## Summary
Create `.planning/phases/09-authentication/09-02-SUMMARY.md`

## Completion
```
## PLAN COMPLETE
**Plan:** 09-02
**Tasks:** {completed}/{total}
```
</agent_role>

<project_context>
- Project: DesignDNA (AI design intelligence tool for POD sellers)
- Milestone: v2.0 — Backend System
- Phase: 9 — Authentication
- Phase goal: Supabase Auth integration — email/password + Google OAuth + auth gate
</project_context>

<files_to_read>
- .planning/STATE.md
- .planning/ROADMAP.md
- .planning/phases/09-authentication/09-PLAN.md (read "Plan 09-02" section only)
- app/src/App.tsx (lines 311-381 for SettingsModal input/button styling reference)
- app/src/index.css (for design tokens — bg-bg-base, bg-bg-surface1, text-text-primary, accent, etc.)
</files_to_read>

<your_task>
Execute **Plan 09-02: Login + Register Screens**

This plan has 2 tasks:
1. Create `app/src/LoginScreen.tsx`
2. Create `app/src/RegisterScreen.tsx`

## LoginScreen Requirements
- Email input + Password input
- "Sign In" button with `ai-gradient` class (existing gradient style)
- "Continue with Google" button (white bg, Google logo SVG inline)
- "Don't have an account? Sign up" link text
- Error message display (red text below form)
- Loading state on submit (button disabled, spinner)
- Import and use `useAuth()` from `./contexts/AuthContext`
- Motion entrance animation (`motion/react`)
- Centered layout, max-width ~400px
- Props: `onSwitchToRegister: () => void`

## RegisterScreen Requirements
- Name input + Email input + Password input
- "Create Account" button with `ai-gradient`
- "Continue with Google" button
- "Already have an account? Sign in" link text
- Error + loading states
- Import and use `useAuth()` from `./contexts/AuthContext`
- Same design language as LoginScreen
- Props: `onSwitchToLogin: () => void`

## Design System (CRITICAL — match existing app)
The app uses TailwindCSS v4 with custom design tokens. Use EXACTLY these classes:

- Background: `bg-bg-base` (page), `bg-bg-surface1` (cards/inputs)
- Text: `text-text-primary`, `text-text-secondary`, `text-text-tertiary`
- Border: `border border-border-default`, `hover:border-border-hover`, `focus:border-accent`
- Input: `bg-bg-surface1 border border-border-default hover:border-border-hover focus:border-accent focus:ring-1 focus:ring-accent rounded-lg px-[14px] py-[10px] text-[14px] text-text-primary outline-none transition-all`
- Primary button: `ai-gradient text-white font-medium py-[14px] px-6 rounded-lg hover:opacity-90 transition-opacity`
- Font sizes: `text-[12px]`, `text-[14px]`, `text-[16px]`, `text-[20px]`, `text-[32px]`
- DesignDNA logo: `<div className="w-8 h-8 rounded ai-gradient"></div>` + `<span className="font-semibold text-[20px]">DesignDNA</span>`

## Google Button
Use inline SVG for Google logo (colorful G icon). Button has white/light background to contrast with dark mode:
```
className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-[14px] px-6 rounded-lg hover:bg-gray-100 transition-colors"
```

**Requirements:** UI-01, UI-02

After creating files, verify with `cd app && npx tsc --noEmit`.
</your_task>

<output_requirements>
Files to create:
- `app/src/LoginScreen.tsx`
- `app/src/RegisterScreen.tsx`
- `.planning/phases/09-authentication/09-02-SUMMARY.md`

Commit format: `{type}(09-02): {description}`
</output_requirements>

<when_complete>
✅ EXECUTOR COMPLETE

📁 Files Created:
- app/src/LoginScreen.tsx
- app/src/RegisterScreen.tsx

📝 Summary:
- Login screen with email/password + Google OAuth button
- Register screen with name + email/password + Google
- Both match existing dark mode design system

🔙 Quay lại orchestrator session và nói: "plan 09-02 complete"
</when_complete>
