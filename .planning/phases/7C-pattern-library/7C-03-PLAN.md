---
phase: 7C-pattern-library
plan: 03
type: execute
wave: 2
depends_on: [01]
files_modified:
  - app/src/CreativeStudio.tsx
  - app/src/api.ts
  - app/src/App.tsx
  - app/src/CompareScreens.tsx
autonomous: true

must_haves:
  truths:
    - "User can click + Add Pattern in Creative Studio to open pattern panel"
    - "User can select pattern and choose which sections to include"
    - "Applied pattern shows as chip with remove button"
    - "Applied pattern data is injected into synthesis prompt"
    - "Only 1 pattern applied at a time"
    - "prefilledBrief prop chain completely removed"
    - "Use Winning Formula button removed from Compare Results"
  artifacts:
    - path: "app/src/CreativeStudio.tsx"
      provides: "Add Pattern panel, section dialog, upgraded appliedPattern"
    - path: "app/src/api.ts"
      provides: "synthesizeConcept accepts structured pattern data"
    - path: "app/src/App.tsx"
      provides: "Cleaned up — no prefilledBrief state"
    - path: "app/src/CompareScreens.tsx"
      provides: "Cleaned up — no Use Winning Formula button"
  key_links:
    - from: "app/src/CreativeStudio.tsx"
      to: "app/src/patternStorage.ts"
      via: "getPatterns() to load panel list"
      pattern: "getPatterns"
    - from: "app/src/CreativeStudio.tsx"
      to: "app/src/api.ts"
      via: "passes structured pattern data to synthesizeConcept"
      pattern: "appliedPattern.*synthesizeConcept"
---

<objective>
Apply Pattern in Creative Studio + Remove prefilledBrief

Purpose: Complete the pattern integration by enabling Creative Studio to use saved patterns in synthesis, and clean up the old "Use Winning Formula" shortcut. This makes patterns the single entry point for cross-design insights.
Output: Functional "+ Add Pattern" flow in CreativeStudio + cleaned up prop chain
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
@app/src/CreativeStudio.tsx
@app/src/api.ts
@app/src/App.tsx
@app/src/CompareScreens.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Implement + Add Pattern Flow in Creative Studio</name>
  <files>app/src/CreativeStudio.tsx</files>
  <action>
Major update to CreativeStudio.tsx:

1. **New types:**
```typescript
interface AppliedPatternData {
  patternId: string;
  patternName: string;
  selectedSections: string[];  // e.g. ['winning_formula', 'visual_patterns', 'buyer_overlap']
  data: Record<string, any>;   // only selected sections' data
}
```

2. **Upgrade appliedPattern state:**
   - Change from `string | null` to `AppliedPatternData | null`
   - Remove `prefilledBrief` prop from component interface entirely
   - Remove `initialGenMode` prop (only used for prefilledBrief logic)
   - Update `getInitialShifts` — remove prefilledBrief branch
   - Update `getInitialCreativity` — remove prefilledBrief branch (default to 2)

3. **Add new state:**
   - `showPatternPanel: boolean` (false) — panel listing saved patterns
   - `showSectionDialog: boolean` (false) — section selection dialog
   - `pendingPattern: SavedPattern | null` (null) — pattern selected but sections not yet chosen

4. **Pattern Panel** — replaces disabled "+ Add Pattern" button area:
   - Button "+ Add Pattern" → `setShowPatternPanel(true)`
   - Panel slides down in left sidebar (inside "Applied Patterns" section, expanding)
   - Shows list of saved patterns from `getPatterns()`:
     - Each: pattern name + summary 1-line + small thumbnails
     - Click → set `pendingPattern`, open section dialog
   - Close button to dismiss panel

5. **Section Selection Dialog** — Overlay modal (similar to save popup):
   - Title: "Select sections from '{patternName}'"
   - Checkboxes for each available section:
     ```
     ☑ Winning Formula (keep/experiment/avoid)
     ☑ Visual Patterns (colors, style, graphics)
     ☑ Buyer Overlap (shared traits, emotions)
     ☑ Made For Me Patterns (hooks, differentiation)
     ☑ Specificity Ladder (specificity insights)
     ```
   - All checked by default
   - "Apply" button → create AppliedPatternData with only selected sections' data
   - "Cancel" → close dialog, clear pendingPattern

6. **Applied Pattern chip display** — update existing chip area:
   - Show pattern name + × remove button (same visual as before)
   - Remove button → `setAppliedPattern(null)`
   - Clicking "+ Add Pattern" when pattern already applied → replaces (opens panel again)

7. **Update handleSynthesize** — pass `appliedPattern?.data` instead of string to `synthesizeConcept`

8. **Clean up all prefilledBrief references:**
   - Remove from props interface
   - Remove from getInitialShifts/getInitialCreativity
   - Remove navigaton back target logic that checks prefilledBrief
   - Update topbar back button to always go to 'results'
  </action>
  <verify>
`npm run build` passes. No references to prefilledBrief in CreativeStudio.tsx. "+ Add Pattern" opens panel → select → dialog → apply → chip shown.
  </verify>
  <done>
CreativeStudio.tsx has fully functional pattern panel + section dialog. appliedPattern upgraded to structured data. All prefilledBrief references removed from component.
  </done>
</task>

<task type="auto">
  <name>Task 2: Update Synthesis Prompt + Remove prefilledBrief Chain</name>
  <files>app/src/api.ts, app/src/App.tsx, app/src/CompareScreens.tsx</files>
  <action>
**api.ts changes:**

1. Update `synthesizeConcept` function signature — change `appliedPattern` parameter type:
   - From: `appliedPattern?: string`
   - To: `appliedPattern?: { selectedSections: string[]; data: Record<string, any> }`

2. Update the synthesis prompt builder — where `appliedPattern` was injected as a brief string, now inject structured data:
   ```
   When appliedPattern exists, add to prompt:
   
   "PATTERN INSIGHTS (from cross-design analysis):
   
   [For each selectedSection in appliedPattern.data]:
   - If 'winning_formula': inject keep/experiment/avoid/suggested_brief
   - If 'visual_patterns': inject common_colors, common_style, etc.
   - If 'buyer_overlap': inject shared traits, emotions
   - If 'made_for_me_patterns': inject hooks, differentiation
   - If 'specificity_ladder': inject specificity insights
   
   Use these insights to inform your concept generation.
   They are creative input, not strict rules."
   ```

**App.tsx changes:**

1. Remove `prefilledBrief` state: `const [prefilledBrief, setPrefilledBrief] = useState<string | undefined>(undefined)`
2. Remove `prefilledBrief` prop from CreativeStudio render
3. Remove `initialGenMode` state if it only served prefilledBrief
4. Update CompareResultsScreen render — remove `setPrefilledBrief` prop
5. Update Screen type — ensure all screens still work without prefilledBrief routing

**CompareScreens.tsx changes:**

1. Remove "Use Winning Formula" button from CompareResultsScreen
2. Remove `setPrefilledBrief` from props interface
3. Remove all `setPrefilledBrief` calls
4. Keep "Save as Pattern" button (from Plan 01) as the only pattern-related action
  </action>
  <verify>
1. `npm run build` passes
2. `grep -rn "prefilledBrief" app/src/` returns 0 results
3. `grep -rn "Use Winning Formula" app/src/` returns 0 results
4. Synthesis with applied pattern includes structured data in prompt
  </verify>
  <done>
synthesizeConcept accepts structured pattern data. prefilledBrief completely removed from App.tsx, CompareScreens.tsx, and CreativeStudio.tsx. "Use Winning Formula" button removed. Pattern data flows cleanly: Library → Creative Studio → synthesis prompt.
  </done>
</task>

</tasks>

<verification>
1. `npm run build` passes
2. Zero references to `prefilledBrief` across entire codebase
3. Zero references to "Use Winning Formula" across entire codebase
4. Full flow: Compare → Save Pattern → Landing → Library → Creative Studio → + Add Pattern → select sections → Apply → Create Concepts (pattern data in prompt) → Generate Artwork
5. Remove pattern chip → synthesis works without pattern data
6. Apply new pattern while one exists → replaces cleanly
</verification>

<success_criteria>
- "+ Add Pattern" opens panel with saved patterns list
- Section selection dialog with checkboxes works correctly
- Applied pattern displays as chip with remove button
- Only 1 pattern at a time — new replaces old
- Structured pattern data injected into synthesis prompt
- prefilledBrief completely removed from entire codebase
- "Use Winning Formula" completely removed
- Full end-to-end flow works without errors
</success_criteria>

<output>
After completion, create `.planning/phases/7C-pattern-library/7C-03-SUMMARY.md`
</output>
