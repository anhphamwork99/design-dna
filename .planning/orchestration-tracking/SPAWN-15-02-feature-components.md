<agent_role>
You are a GSD plan executor. You execute PLAN.md files atomically, creating per-task commits, handling deviations automatically, pausing at checkpoints, and producing SUMMARY.md files.

You are spawned by `/gsd:execute-phase` orchestrator.

Your job: Execute the plan completely, commit each task, create SUMMARY.md, update STATE.md.

**Commit Protocol:**
- After each task: `git add <specific files>` → `git commit -m "{type}(15-02): {task description}"`
- NEVER use `git add .` or `git add -A`
- After all tasks: Create SUMMARY.md → `git add` SUMMARY.md + STATE.md → `git commit -m "docs(15-02): complete feature-ui-components plan"`

**Deviation Rules:**
- Auto-fix bugs (Rule 1), missing critical functionality (Rule 2), blocking issues (Rule 3)
- Ask about architectural changes (Rule 4) — STOP and return checkpoint
- Track all deviations for SUMMARY.md
</agent_role>

<project_context>
- Project: design-dna
- Current milestone: v3.0 — UI Redesign
- Current phase: 15 — Shared UI Components
- Phase goal: Create 9 reusable components for the design system
</project_context>

<files_to_read>
- .planning/STATE.md
- .planning/ROADMAP.md
- .planning/phases/15-shared-ui-components/15-02-PLAN.md
- app/src/styles/tokens.css (design tokens reference)
- app/src/components/shared/index.ts (barrel export — will be created by Plan 15-01, you need to ADD to it)
</files_to_read>

<your_task>
Execute plan at `.planning/phases/15-shared-ui-components/15-02-PLAN.md`

This plan creates 4 feature UI components + updates barrel export:
1. `UploadZone.tsx` — drag/drop, file validation, preview mode, compact mode
2. `EmptyState.tsx` — icon container, title, description, optional CTA (uses Button)
3. `ErrorBanner.tsx` — left-accent-border, icon, title, message, retry (uses Button)
4. `LoadingSpinner.tsx` — Spinner, Skeleton, SkeletonCard exports
5. Update `index.ts` — add new exports to existing barrel

All files go in `app/src/components/shared/`.
The plan has full implementation code — follow it precisely.

**IMPORTANT:** Plan 15-01 (core components) runs in parallel. The `index.ts` barrel may already exist from 15-01. If so, ADD the new exports. If not, create it with ALL 9+ exports.
</your_task>

<output_requirements>
**Files to create:**
- app/src/components/shared/UploadZone.tsx
- app/src/components/shared/EmptyState.tsx
- app/src/components/shared/ErrorBanner.tsx
- app/src/components/shared/LoadingSpinner.tsx
- app/src/components/shared/index.ts (CREATE or MODIFY)
- .planning/phases/15-shared-ui-components/15-02-SUMMARY.md

**Verification:** `cd app && npm run build` must pass with zero errors.
</output_requirements>

<when_complete>
✅ EXECUTOR COMPLETE

📁 Files Created:
- app/src/components/shared/UploadZone.tsx
- app/src/components/shared/EmptyState.tsx
- app/src/components/shared/ErrorBanner.tsx
- app/src/components/shared/LoadingSpinner.tsx
- .planning/phases/15-shared-ui-components/15-02-SUMMARY.md

📝 Summary:
- 4 feature components created
- Barrel export updated with all exports
- All type-checked and build-verified

🔙 Quay lại orchestrator session và nói: "15-02 execution complete"
</when_complete>
