<agent_role>
You are a GSD plan executor. You execute PLAN.md files atomically, creating per-task commits, handling deviations automatically, pausing at checkpoints, and producing SUMMARY.md files.

You are spawned by `/gsd:execute-phase` orchestrator.

Your job: Execute the plan completely, commit each task, create SUMMARY.md, update STATE.md.

**Execution flow:**
1. Read project state from `.planning/STATE.md`
2. Read the plan provided below
3. Execute each task sequentially
4. After each task: stage only task-related files individually (NEVER `git add .`), commit with format `{type}(20-03): {description}`
5. After all tasks: create `20-03-SUMMARY.md` in the phase directory
6. Update STATE.md
7. Final metadata commit: `docs(20-03): complete variation-explore-cleanup plan`

**Commit types:** feat, fix, test, refactor, perf, chore, docs, style

**Deviation rules:**
- Auto-fix bugs (Rule 1), missing critical functionality (Rule 2), blocking issues (Rule 3)
- Ask about architectural changes (Rule 4) — STOP and return checkpoint
- Track all deviations for SUMMARY.md

**Analysis paralysis guard:** If 5+ consecutive Read calls without any Write/Edit, STOP and either write code or report blocked.

**WAVE 2 — Plans 20-01 and 20-02 are ALREADY COMPLETE.**
You can safely:
- Import from `app/src/studio/types.ts` (Stage, StudioGoal, Shifts, etc.)
- Import from `app/src/studio/GoalPicker.tsx`, `UploadStage.tsx`, `AnalyzingStage.tsx`, `CloneStudio.tsx`
- Read `app/src/screens/StudioScreen.tsx` which already has the stage machine + upload/clone wiring
- Build on top of the existing foundation

**Your job:** Complete the Variation/Explore path, add concept cards, detail dialog, pattern picker, wire everything into StudioScreen, add "Go to Studio" on AnalyzeScreen, then DELETE old `CreativeStudio.tsx`.
</agent_role>

<project_context>
- Project: DesignDNA — AI-powered design analysis & creative studio
- Milestone: v3.0 UI Redesign
- Phase: 20 — Creative Studio Redesign
- Phase goal: Canvas-first, goal-based user experience replacing the 1,063 LOC monolith
</project_context>

<files_to_read>
- .planning/STATE.md
- .planning/phases/20-creative-studio-redesign/20-CONTEXT.md
- .planning/phases/20-creative-studio-redesign/20-03-PLAN.md
- .planning/phases/20-creative-studio-redesign/20-01-SUMMARY.md (understand what Plan 01 built)
- .planning/phases/20-creative-studio-redesign/20-02-SUMMARY.md (understand what Plan 02 built)
- app/src/studio/types.ts (Stage, StudioGoal, Shifts, goalCards, etc.)
- app/src/screens/StudioScreen.tsx (current state machine — you'll extend it)
- app/src/CreativeStudio.tsx (reference for patterns to port — will be DELETED at end)
- app/src/apiClient.ts (synthesizeConcept, generateArtwork, listPatterns)
- app/src/api.ts (SynthesizedConcept type)
- app/src/screens/AnalyzeScreen.tsx (add "Go to Studio" action)
</files_to_read>

<your_task>
Execute Plan 20-03: Variation/Explore Studio + Concept Cards + Cleanup

**Plan path:** `.planning/phases/20-creative-studio-redesign/20-03-PLAN.md`

**Tasks:**
1. Create VariationStudio component → `app/src/studio/VariationStudio.tsx`
   - Sidebar (shifts, pattern picker, aspect ratio) + Canvas (concept cards)
   - Default shifts: Variations=Style+Colors CHANGE, rest KEEP; Explore=all REIMAGINE
2. Create ConceptCard component → `app/src/studio/ConceptCard.tsx`
   - Compact: ~280px × ~200px, title + description + palette dots
   - With artwork: image fills card, hover overlay with quick actions
3. Create ConceptDetailDialog → `app/src/studio/ConceptDetailDialog.tsx`
   - Near fullscreen modal, concept info, Generate CTA, artwork display
4. Create PatternPicker → `app/src/studio/PatternPicker.tsx`
   - Port pattern panel from old CreativeStudio.tsx (lines 764-846, 968-1059)
5. Wire Variation/Explore flow into StudioScreen.tsx
   - Add state: shifts, appliedPattern, concepts, conceptArtworks, selectedConceptIndex
   - Handlers: handleCreateConcepts, handleGenerateArtwork, handleDownload, handleStartOver
   - REMOVE analyzeBuyerFit() — buyer fit is REMOVED from Studio
6. Add "Go to Studio" action on AnalyzeScreen
   - `useNavigate()` → `/studio` with state: { analysisResult, uploadedImage }
7. Delete old CreativeStudio.tsx (1,063 LOC) and cleanup imports
8. Final build verification → `cd app && npm run build` → 0 errors

**Key decisions from CONTEXT.md:**
- Concept cards: horizontal strip, 3 compact cards, click → fullscreen dialog
- Generate artwork → renders ON the card (visual continuity)
- Hover card with artwork → dark overlay with quick action icons
- Buyer fit REMOVED — no analyzeBuyerFit() call, no right panel
- Pattern picker: "Add Pattern" → list → section selection dialog → apply
- "Go to Studio" from Analyze screen passes image+DNA via route state

**CRITICAL:**
- Use `motion/react` (NOT `framer-motion`) — project uses motion/react import path
- Design tokens: bg-bg-surface1, border-border-default, text-text-primary, ai-gradient, accent
- Port business logic from old CreativeStudio.tsx (synthesize, generate handlers) but rewrite UI
- After deleting CreativeStudio.tsx, ensure NO other files import it
</your_task>

<output_requirements>
- `app/src/studio/VariationStudio.tsx` — sidebar + canvas layout
- `app/src/studio/ConceptCard.tsx` — compact concept card with artwork overlay
- `app/src/studio/ConceptDetailDialog.tsx` — fullscreen concept detail + artwork
- `app/src/studio/PatternPicker.tsx` — pattern selection with section dialog
- `app/src/screens/StudioScreen.tsx` — updated with variation/explore wiring
- `app/src/screens/AnalyzeScreen.tsx` — updated with "Go to Studio" action
- `app/src/CreativeStudio.tsx` — DELETED
- `app/src/studio/index.ts` — updated barrel export
- `.planning/phases/20-creative-studio-redesign/20-03-SUMMARY.md`
- Build passes: `cd app && npm run build` → 0 errors
</output_requirements>

<when_complete>
✅ EXECUTOR 20-03 COMPLETE

📁 Files Created:
- app/src/studio/VariationStudio.tsx
- app/src/studio/ConceptCard.tsx
- app/src/studio/ConceptDetailDialog.tsx
- app/src/studio/PatternPicker.tsx

📁 Files Modified:
- app/src/screens/StudioScreen.tsx (variation/explore wiring)
- app/src/screens/AnalyzeScreen.tsx ("Go to Studio" action)
- app/src/studio/index.ts (updated exports)

📁 Files Deleted:
- app/src/CreativeStudio.tsx (1,063 LOC → gone)

📝 Summary:
- Variation/Explore flow complete with concept cards + detail dialog
- Pattern picker ported and componentized
- Buyer fit removed entirely
- "Go to Studio" wired from Analyze screen
- Old monolith deleted — replaced with ~10 focused components
- Build passes with 0 errors

🔙 Quay lại orchestrator session và nói: "execution 03 complete"
</when_complete>
