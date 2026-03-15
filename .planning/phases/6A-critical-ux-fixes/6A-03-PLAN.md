---
phase: 6A-critical-ux-fixes
plan: 03
type: execute
wave: 3
depends_on: [01, 02]
files_modified: [app/src/App.tsx, app/src/api.ts]
autonomous: true

must_haves:
  truths:
    - "User clicks 'Analyze' and gets BOTH Visual DNA + Buyer DNA in one call"
    - "No Quick Scan / Deep Analysis mode selection on Upload screen"
    - "Visual DNA data is NOT lost when Buyer DNA arrives"
    - "Results show both tabs populated from a single API call"
  artifacts:
    - path: "app/src/App.tsx"
      provides: "Unified analysis flow — no mode selection, single analyze action"
    - path: "app/src/api.ts"
      provides: "Single analyzeDesign call that returns both visual_dna and buyer_dna"
  key_links:
    - from: "app/src/App.tsx"
      to: "app/src/api.ts"
      via: "analyzeDesign() always called with mode='deep'"
---

<objective>
Merge Quick Scan and Deep Analysis into a single unified "Analyze" action that returns both Visual DNA + Buyer DNA.

Purpose: User testing showed that having to choose between Quick Scan / Deep Analysis, then optionally upgrading, is confusing and causes a data loss bug (Visual DNA gets overwritten when upgrading to Deep Analysis).

Output: Simplified flow — upload → analyze (single button) → results with both tabs populated
</objective>

<execution_context>
@.agent/skills/gsd/gsd-execution/execute-plan.md
@.agent/skills/gsd/_gsd-shared/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md
@app/src/App.tsx
@app/src/api.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Simplify api.ts — always return full analysis</name>
  <files>app/src/api.ts</files>
  <action>
Update the `analyzeDesign` function:

1. Remove the `mode` parameter — always use the deep analysis model (`gemini-3.1-pro-preview`) and deep prompt
2. The function should always return `{ visual_dna, buyer_dna }` — both populated
3. Remove `quickScanPrompt` variable (no longer needed)
4. Rename `deepAnalysisPrompt` to just `analysisPrompt`
5. Remove the conditional `if (mode === 'quick')` return at the bottom
6. Keep the same response parsing logic

Update the function signature:
```typescript
export async function analyzeDesign(
  base64Image: string,
  mimeType: string,
  apiKey: string
) {
```

Note: Remove the `mode` parameter entirely. Callers will be updated in Task 2.
  </action>
  <verify>`npm run build` will show errors from callers — that's expected, fixed in Task 2</verify>
  <done>analyzeDesign always returns full Visual + Buyer DNA</done>
</task>

<task type="auto">
  <name>Task 2: Simplify App.tsx — remove mode selection, unified analyze</name>
  <files>app/src/App.tsx</files>
  <action>
Multiple changes in App.tsx:

**1. Remove AnalysisMode type and state:**
- Remove `type AnalysisMode = 'quick' | 'deep';` (line 9)
- Remove `const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('quick');` (line 14)

**2. Simplify handleAnalyze:**
- Remove the `mode` parameter — it's always a full analysis now
- Update the `analyzeDesign` call to remove the `mode` argument:
  ```typescript
  const result = await analyzeDesign(uploadedImage.data, uploadedImage.type, currentApiKey);
  ```
- Remove references to `analysisMode` in error messages

**3. Simplify UploadScreen:**
- Remove the mode selection cards (Quick Scan / Deep Analysis toggle, lines ~488-505)
- Remove `analysisMode`, `setAnalysisMode` props from UploadScreen
- Keep just the image upload + a single "Analyze Design" button
- The button label stays "Analyze Design"

**4. Fix UploadScreen usage in App JSX:**
- Remove `analysisMode={analysisMode}` and `setAnalysisMode={setAnalysisMode}` props
- Keep `onAnalyze={() => handleAnalyze()}` (no mode argument)

**5. Simplify AnalyzingScreen:**
- Remove `analysisMode` prop 
- Remove the mode display in the timer text — change from `({analysisMode === 'quick' ? 'Quick Scan' : 'Deep Analysis'})` to just show "Analyzing... Xs"
- Remove `onTryQuickScan` prop and the "Try Quick Scan Instead" fallback button in error state

**6. Fix AnalyzingScreen usage in App JSX:**
- Remove `analysisMode={analysisMode}` prop
- Remove `onTryQuickScan={() => handleAnalyze('quick')}` prop

**7. Simplify ResultsScreen:**
- Remove `analysisMode` prop and `onRunDeepAnalysis` prop
- Remove the "Upgrade to Deep Analysis" button/section (since we always do full analysis now)
- Both Visual DNA and Buyer DNA tabs should always be populated
- Remove the null check/disabled state for Buyer DNA tab

**8. Fix ResultsScreen usage in App JSX:**
- Remove `analysisMode={analysisMode}` and `onRunDeepAnalysis={() => handleAnalyze('deep')}` props
  </action>
  <verify>
- `npm run build` passes
- Upload → single "Analyze Design" button → both tabs populated
- No mode selection UI anywhere
  </verify>
  <done>Unified single analysis flow, no Quick/Deep choice, both DNA types always returned</done>
</task>

</tasks>

<verification>
1. `npm run build` passes
2. Upload image → click "Analyze Design" → results show both Visual DNA + Buyer DNA tabs
3. No Quick Scan / Deep Analysis toggle in Upload screen
4. No "Upgrade to Deep Analysis" button in Results screen
5. Buyer DNA tab is always populated (never null)
6. Error handling still works (retry, cancel)
</verification>

<success_criteria>
- Single "Analyze Design" action, no mode selection
- Both Visual DNA and Buyer DNA returned from single API call
- No data loss between tabs
- All error handling preserved
- Clean build
</success_criteria>

<output>
After completion, create `.planning/phases/6A-critical-ux-fixes/6A-03-SUMMARY.md`
</output>
