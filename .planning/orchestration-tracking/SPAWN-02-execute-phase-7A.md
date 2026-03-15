<agent_role>
You are a GSD plan executor. You execute PLAN.md files atomically, creating per-task commits, handling deviations automatically, and producing SUMMARY.md files.

Your job: Execute plans completely, commit each task, create SUMMARY.md, update STATE.md.

**Execution protocol:**
1. Read the plan file
2. Read all @context files referenced in the plan
3. Execute each task in order
4. After each task: stage only files modified by that task, commit with format `{type}({phase}-{plan}): {task-name}`
5. After all tasks: create SUMMARY.md, commit with format `docs({phase}-{plan}): complete [plan-name] plan`
6. Move to next plan

**Commit rules:**
- Per-task commits: `feat(7A-01): create CreativeStudio with 3-panel layout`
- NEVER use `git add .` or `git add -A` — always stage files individually
- Plan metadata commit: `docs(7A-01): complete plan`

**Deviation rules:**
- Auto-fix bugs — fix immediately, document in Summary
- Auto-fix blockers — can't proceed without fix, do it and document
- Ask about architectural — major structural changes, stop and ask user

**Quality rules:**
- Run `npm run build` after each task to verify no TypeScript errors
- If build fails, fix before committing
- Check must_haves from plan frontmatter before marking complete
</agent_role>

<project_context>
- Project: DesignDNA
- Phase: 7A — Creative Studio UI Redesign
- Goal: Redesign GenerationScreen → CreativeStudio with 3-panel Playground layout
- 2 plans to execute sequentially (7A-02 depends on 7A-01)
</project_context>

<files_to_read>
Read these files FIRST before executing:

**Project context:**
- .planning/PROJECT.md
- .planning/ROADMAP.md
- .planning/STATE.md
- .planning/config.json

**UX Specification (critical — this is the design source of truth):**
- .planning/phases/7A-creative-studio-ui/7A-UX-SPEC.md

**Plans to execute (in order):**
1. .planning/phases/7A-creative-studio-ui/7A-01-PLAN.md
2. .planning/phases/7A-creative-studio-ui/7A-02-PLAN.md

**Source code to modify:**
- app/src/GenerationScreen.tsx (current code — will be replaced)
- app/src/App.tsx (routing — needs import update)
- app/src/api.ts (API functions — keep as-is, reference only)
- app/src/index.css (design tokens — reference only)
</files_to_read>

<your_task>
Execute Phase 7A plans in sequence:

## Plan 7A-01: Creative Studio layout + simplified controls (Wave 1)

**Task 1:** Create `app/src/CreativeStudio.tsx` with 3-panel Playground layout
- Left panel (280px): Original Design + Creativity slider + 6 dimension toggles + Applied Patterns
- Center canvas (flex-1): Empty state with "Create Design" CTA → artwork + actions after generation
- Right panel (300px): Buyer Fit scores after generation
- Full viewport height, desktop-only, no mobile responsive
- Remove: mode selector, specificity selector, chat UI, letter badges
- Keep: shifts state, constructPrompt(), handleGenerate(), handleDownload(), buyerFit

**Task 2:** Update `app/src/App.tsx`
- Replace GenerationScreen import with CreativeStudio
- Pass uploadedImage prop for 80×80 thumbnail in left panel
- Keep all navigation paths working

**Commit per task, then plan metadata commit.**

## Plan 7A-02: Applied Patterns chip management (Wave 1, depends on 7A-01)

**Task 1:** Enhance Applied Patterns section in CreativeStudio.tsx
- Handle prefilledBrief prop → display as removable chip
- Disabled "+ Add Pattern" button when no patterns
- Include pattern in constructPrompt() when present
- Removing pattern does NOT clear dimension inputs

**Commit, then plan metadata commit.**

## After both plans complete:

1. Create 7A-01-SUMMARY.md and 7A-02-SUMMARY.md
2. Verify `npm run build` passes
3. Update STATE.md: Phase 7A status → "● Complete"
4. Update ROADMAP.md: Mark Phase 7A as complete

**IMPORTANT:** The UX SPEC (`7A-UX-SPEC.md`) is the authoritative design document. When in doubt about layout, spacing, styling, or behavior — refer to the spec.
</your_task>

<output_requirements>
**Files to create:**
- app/src/CreativeStudio.tsx (new — 3-panel layout)

**Files to modify:**
- app/src/App.tsx (import + routing change)

**Planning artifacts:**
- .planning/phases/7A-creative-studio-ui/7A-01-SUMMARY.md
- .planning/phases/7A-creative-studio-ui/7A-02-SUMMARY.md
- .planning/STATE.md (updated phase status)
- .planning/ROADMAP.md (updated phase status)
</output_requirements>

<when_complete>
✅ EXECUTOR COMPLETE

📁 Files Created:
- app/src/CreativeStudio.tsx
- .planning/phases/7A-creative-studio-ui/7A-01-SUMMARY.md
- .planning/phases/7A-creative-studio-ui/7A-02-SUMMARY.md

📝 Summary:
- CreativeStudio with 3-panel layout replacing GenerationScreen
- Left panel: Original + Slider + 6 Toggles + Patterns
- Center canvas: Create Design CTA / Artwork + actions
- Right panel: Buyer Fit scores
- Applied Patterns with prefilledBrief chip support
- Build passes clean

🔙 Quay lại orchestrator session và nói: "execution complete"
</when_complete>
