---
phase: 7C-pattern-library
plan: 02
type: execute
wave: 2
depends_on: [01]
files_modified:
  - app/src/PatternLibrary.tsx
  - app/src/PatternDetail.tsx
  - app/src/App.tsx
autonomous: true

must_haves:
  truths:
    - "User can see Pattern Library entry on Landing when patterns exist"
    - "User can browse list of saved patterns with thumbnails and summaries"
    - "User can click pattern to view full detail page"
    - "User can delete a pattern from detail page"
    - "Pattern Library hidden when no patterns saved"
  artifacts:
    - path: "app/src/PatternLibrary.tsx"
      provides: "Pattern list page with cards"
      exports: ["default"]
    - path: "app/src/PatternDetail.tsx"
      provides: "Pattern detail page with full data display"
      exports: ["default"]
    - path: "app/src/App.tsx"
      provides: "New Screen routes and Landing entry point"
  key_links:
    - from: "app/src/App.tsx"
      to: "app/src/PatternLibrary.tsx"
      via: "Screen type 'pattern_library' renders PatternLibrary"
      pattern: "pattern_library"
    - from: "app/src/PatternLibrary.tsx"
      to: "app/src/patternStorage.ts"
      via: "getPatterns() to load list"
      pattern: "getPatterns"
    - from: "app/src/PatternDetail.tsx"
      to: "app/src/patternStorage.ts"
      via: "getPattern(id) to load detail, deletePattern(id) to remove"
      pattern: "getPattern|deletePattern"
---

<objective>
Pattern Library Pages + Landing Entry Point

Purpose: Users can browse, view, and manage saved patterns from the Landing screen. This is the Library's read/manage side.
Output: PatternLibrary.tsx (list), PatternDetail.tsx (detail), updated App.tsx routes + Landing entry
</objective>

<execution_context>
@.agent/skills/gsd/gsd-execution/execute-plan.md
@.agent/skills/gsd/_gsd-shared/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md
@.planning/phases/7C-pattern-library/7C-CONTEXT.md
@.planning/phases/7C-pattern-library/7C-01-SUMMARY.md
@app/src/App.tsx
@app/src/CompareScreens.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create Pattern Library List Page</name>
  <files>app/src/PatternLibrary.tsx</files>
  <action>
Create `app/src/PatternLibrary.tsx`:

**Props:**
```typescript
interface PatternLibraryProps {
  onNavigate: (screen: string, data?: any) => void;
}
```

**Layout:** Full-screen page matching app design language (dark mode tokens).

**Structure:**
1. **Header bar** — "Pattern Library" title + back button (→ landing)
2. **Pattern grid/list** — Load patterns via `getPatterns()` from patternStorage
3. **Each card shows:**
   - Pattern name (bold, 16px)
   - Row of thumbnails (small, max 4-5 shown, 40x40px rounded)
   - Created date (text-tertiary, 12px, relative format like "2 days ago" or ISO date)
   - 1-line summary from `winning_formula.summary` (text-secondary, 13px, truncated)
4. **Click card** → navigate to `pattern_detail` with pattern ID
5. **Empty state** — should not normally be visible (Landing hides entry when 0 patterns), but as safeguard: "No patterns saved yet. Use Compare to analyze designs and save patterns."

**Styling:** Cards use bg-bg-surface1, border-border-default, rounded-xl, hover:bg-bg-surface2 transition. Grid layout: 1 column on narrow, 2 columns on wider. Match existing app aesthetics.
  </action>
  <verify>
File exists, TypeScript compiles. Component renders pattern list from localStorage.
  </verify>
  <done>
PatternLibrary.tsx renders list of saved patterns with thumbnails, names, dates, summaries. Click navigates to detail.
  </done>
</task>

<task type="auto">
  <name>Task 2: Create Pattern Detail Page</name>
  <files>app/src/PatternDetail.tsx</files>
  <action>
Create `app/src/PatternDetail.tsx`:

**Props:**
```typescript
interface PatternDetailProps {
  patternId: string;
  onNavigate: (screen: string) => void;
}
```

**Layout:** Full-screen page, flat layout similar to CompareResultsScreen.

**Structure:**
1. **Header** — Back button (→ pattern_library) + pattern name + delete button (trash icon, red on hover)
2. **Metadata bar** — Created date + source image count + thumbnails row
3. **Content sections** — Render all `batchAnalysis` data in flat layout:
   - **Winning Formula**: summary, keep items (green chips), experiment_with items (yellow chips), avoid items (red chips), suggested_brief
   - **Visual Patterns**: common_colors, common_style, common_graphics, common_typography
   - **Buyer Overlap**: shared traits, common emotions, common tribes
   - **Made For Me Patterns**: common hooks, differentiation signals
   - **Specificity Ladder**: specificity insights

   Reuse visual style from CompareResultsScreen — same chip colors, section headers, spacing.

4. **Delete flow** — Click delete → confirm dialog ("Delete pattern '{name}'?") → yes → `deletePattern(id)` → navigate back to pattern_library

**No Apply button** — apply only from Creative Studio (per CONTEXT.md decision).
  </action>
  <verify>
File exists, TypeScript compiles. Component renders full pattern detail with all batch_analysis sections.
  </verify>
  <done>
PatternDetail.tsx renders full pattern data in flat layout, with delete functionality. Visual style matches CompareResultsScreen.
  </done>
</task>

<task type="auto">
  <name>Task 3: Wire Routes + Landing Entry Point</name>
  <files>app/src/App.tsx</files>
  <action>
Update `app/src/App.tsx`:

1. **Import** PatternLibrary and PatternDetail components

2. **Update Screen type union** — add `'pattern_library' | 'pattern_detail'`

3. **Add state** for selected pattern ID:
   ```typescript
   const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
   ```

4. **Add navigation handler** — Create wrapper function for pattern navigation:
   ```typescript
   const handlePatternNavigate = (screen: string, data?: any) => {
     if (screen === 'pattern_detail' && data?.patternId) {
       setSelectedPatternId(data.patternId);
     }
     setCurrentScreen(screen as Screen);
   };
   ```

5. **Add Screen renders:**
   ```tsx
   {currentScreen === 'pattern_library' && (
     <PatternLibrary onNavigate={handlePatternNavigate} />
   )}
   {currentScreen === 'pattern_detail' && selectedPatternId && (
     <PatternDetail patternId={selectedPatternId} onNavigate={setCurrentScreen} />
   )}
   ```

6. **Landing entry point** — Add 3rd card on Landing screen (below existing Analyze + Compare):
   - Only render when `getPatterns().length > 0`
   - Card: icon (e.g., BookOpen or Layers from lucide-react), title "Pattern Library", subtitle "Browse saved patterns from Compare analysis"
   - onClick → `setCurrentScreen('pattern_library')`
   - Style: same as Analyze/Compare cards but use a distinct accent (e.g., slightly different gradient or icon color)
  </action>
  <verify>
`npm run build` passes. Landing shows Pattern Library card when patterns exist. Navigation to list and detail pages works. Delete returns to list.
  </verify>
  <done>
App.tsx has new Screen routes for pattern_library and pattern_detail. Landing conditionally shows Pattern Library entry. Full navigation flow works.
  </done>
</task>

</tasks>

<verification>
1. `npm run build` passes
2. Save a pattern (Plan 01) → Landing shows Pattern Library card
3. Click → PatternLibrary list shows saved pattern with correct info
4. Click pattern → PatternDetail shows full data matching Compare Results layout
5. Delete pattern → returns to list → Landing hides entry if 0 patterns
</verification>

<success_criteria>
- PatternLibrary.tsx renders list with thumbnails, names, dates, summaries
- PatternDetail.tsx renders full batch_analysis data in flat layout
- Delete flow with confirmation works correctly
- App.tsx routes added for pattern_library and pattern_detail
- Landing conditionally shows Pattern Library entry when ≥1 pattern exists
- All navigation flows work correctly
</success_criteria>

<output>
After completion, create `.planning/phases/7C-pattern-library/7C-02-SUMMARY.md`
</output>
