---
phase: 7C-pattern-library
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - app/src/patternStorage.ts
  - app/src/CompareScreens.tsx
autonomous: true

must_haves:
  truths:
    - "User can save Compare result as named pattern via popup"
    - "Saved pattern persists across page refresh in localStorage"
    - "Save button shows disabled '✓ Saved' state after saving"
    - "Toast notification appears briefly after save"
  artifacts:
    - path: "app/src/patternStorage.ts"
      provides: "Pattern types, localStorage CRUD, thumbnail resize"
      exports: ["SavedPattern", "savePattern", "getPatterns", "getPattern", "deletePattern"]
    - path: "app/src/CompareScreens.tsx"
      provides: "Save as Pattern button + naming popup + toast"
  key_links:
    - from: "app/src/CompareScreens.tsx"
      to: "app/src/patternStorage.ts"
      via: "savePattern() call on popup confirm"
      pattern: "savePattern"
---

<objective>
Pattern Storage Layer + Save Flow on Compare Results

Purpose: Enable saving Compare results as named, reusable patterns with all batch_analysis data + source thumbnails. This is the foundation all other plans depend on.
Output: patternStorage.ts utility module + "Save as Pattern" button with popup on CompareScreens.tsx
</objective>

<execution_context>
@.agent/skills/gsd/gsd-execution/execute-plan.md
@.agent/skills/gsd/_gsd-shared/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md
@.planning/phases/7C-pattern-library/7C-CONTEXT.md
@app/src/CompareScreens.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create Pattern Storage Utility</name>
  <files>app/src/patternStorage.ts</files>
  <action>
Create `app/src/patternStorage.ts` with:

**Types:**
```typescript
interface SavedPattern {
  id: string;              // crypto.randomUUID()
  name: string;            // user-given name
  createdAt: string;       // ISO date
  sourceImageCount: number;
  thumbnails: string[];    // resized base64 data URIs (max ~100x100px each)
  summary: string;         // from winning_formula.summary
  batchAnalysis: object;   // full batch_analysis object
}
```

**Functions:**
- `savePattern(name: string, batchAnalysis: any, sourceImages: {data: string}[]): SavedPattern` — Creates pattern, resizes source images to thumbnails (~100x100 using canvas), stores in localStorage under key `designdna_patterns`
- `getPatterns(): SavedPattern[]` — Returns all saved patterns, sorted newest first
- `getPattern(id: string): SavedPattern | null` — Get single pattern by id
- `deletePattern(id: string): void` — Remove pattern from localStorage
- `isCompareResultSaved(batchAnalysis: any): boolean` — Check if this exact result is already saved (compare by winning_formula.summary + sourceImageCount to avoid duplicates)

**Thumbnail resize logic:** Use an offscreen canvas to resize each source image to max 100x100px maintaining aspect ratio, then export as JPEG base64 at quality 0.6 (balance quality vs localStorage size).

localStorage key: `designdna_patterns`, value: JSON.stringify(SavedPattern[])
  </action>
  <verify>
File exists, exports all types and functions, TypeScript compiles: `cd app && npx tsc --noEmit app/src/patternStorage.ts`
  </verify>
  <done>
patternStorage.ts created with SavedPattern type, savePattern, getPatterns, getPattern, deletePattern, isCompareResultSaved functions. Thumbnail resize via offscreen canvas.
  </done>
</task>

<task type="auto">
  <name>Task 2: Add Save as Pattern to Compare Results</name>
  <files>app/src/CompareScreens.tsx</files>
  <action>
Modify `CompareResultsScreen` in CompareScreens.tsx:

1. **Import** `savePattern, isCompareResultSaved` from `./patternStorage`

2. **Add state:**
   - `showSavePopup: boolean` (false)
   - `patternName: string` ('')
   - `isSaved: boolean` — initialized via `isCompareResultSaved()` check on mount
   - `showToast: boolean` (false)

3. **Add "Save as Pattern" button** — place near top of results, next to or replacing the existing "Use Winning Formula" button area:
   - If `!isSaved`: Button with text "Save as Pattern", onClick → `setShowSavePopup(true)`
   - If `isSaved`: Disabled button "✓ Saved" with muted styling

4. **Save Popup Modal** — Simple overlay modal:
   - Input field with placeholder "Name your pattern..."
   - "Save" button (disabled if name empty) + "Cancel" button
   - On Save: call `savePattern(patternName, compareResult.batch_analysis, uploadedImages)`, set `isSaved = true`, close popup, show toast
   - Style: bg-bg-surface1 border, rounded-xl, shadow-lg, centered overlay with backdrop

5. **Toast notification** — Lightweight:
   - Fixed position bottom-center
   - Text: "✓ Pattern saved!"
   - Auto-dismiss after 2.5 seconds via setTimeout
   - Animate: fade in/out using motion/react

6. **DO NOT remove "Use Winning Formula" button yet** — that's done in Plan 04

Note: `uploadedImages` for thumbnails — the compare flow already has the uploaded images in state. Pass the image data array to `savePattern`.
  </action>
  <verify>
`npm run build` passes. Visual check: Compare Results screen shows "Save as Pattern" button. Clicking opens popup. Saving shows toast and button becomes disabled "✓ Saved".
  </verify>
  <done>
"Save as Pattern" button + popup + toast notification implemented on CompareResultsScreen. Pattern saves to localStorage via patternStorage utility.
  </done>
</task>

</tasks>

<verification>
1. `npm run build` passes with no TypeScript errors
2. Save a pattern from Compare Results → check localStorage `designdna_patterns` key has data
3. Refresh page → pattern still in localStorage
4. Re-enter Compare Results → button shows "✓ Saved" for already-saved result
</verification>

<success_criteria>
- patternStorage.ts utility fully functional with CRUD operations
- "Save as Pattern" button appears on Compare Results screen
- Popup modal allows naming and saving
- Toast notification confirms save
- Button disables after save ("✓ Saved" state)
- Pattern data persists in localStorage across refreshes
</success_criteria>

<output>
After completion, create `.planning/phases/7C-pattern-library/7C-01-SUMMARY.md`
</output>
