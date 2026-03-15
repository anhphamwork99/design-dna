---
phase: 6A-critical-ux-fixes
plan: 02
type: execute
wave: 2
depends_on: [01]
files_modified: [app/src/App.tsx]
autonomous: true

must_haves:
  truths:
    - "AnalyzingScreen shows the uploaded image (not a skeleton placeholder)"
    - "Only the analysis content area (right side) shows skeleton loaders"
    - "A scan effect animation overlays the uploaded image during analysis"
    - "Tab structure (Visual DNA / Buyer DNA) visible as skeletons during loading"
  artifacts:
    - path: "app/src/App.tsx"
      provides: "Improved AnalyzingScreen with image + scan effect + content-only skeletons"
---

<objective>
Fix the AnalyzingScreen to show the uploaded image with a scan effect instead of skeleton-ing everything.

Purpose: User testing showed the fully-skeletonized screen (including the image area) looks broken. Users lose context of what they uploaded.

Output: AnalyzingScreen that preserves the uploaded image, adds a scan animation overlay, and only skeletons the analysis content.
</objective>

<execution_context>
@.agent/skills/gsd/gsd-execution/execute-plan.md
@.agent/skills/gsd/_gsd-shared/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md
@app/src/App.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Pass uploadedImage to AnalyzingScreen</name>
  <files>app/src/App.tsx</files>
  <action>
1. Update the AnalyzingScreen props interface to accept `uploadedImage`:
   ```
   uploadedImage: { data: string; name: string; type: string } | null;
   ```

2. In the App component's JSX where AnalyzingScreen is rendered (around line 208-217), pass the uploadedImage prop:
   ```tsx
   <AnalyzingScreen
     key="analyzing"
     analysisMode={analysisMode}
     uploadedImage={uploadedImage}
     error={error}
     onRetry={() => handleAnalyze(analysisMode)}
     onTryQuickScan={() => handleAnalyze('quick')}
     onCancel={handleCancelAnalysis}
   />
   ```
  </action>
  <verify>`npm run build` passes — no type errors for the new prop</verify>
  <done>AnalyzingScreen receives uploadedImage prop</done>
</task>

<task type="auto">
  <name>Task 2: Redesign AnalyzingScreen layout with image + scan effect</name>
  <files>app/src/App.tsx, app/src/index.css</files>
  <action>
Replace the AnalyzingScreen component body (the JSX inside the return) with this layout:

**Left side (40%):** Show the actual uploaded image instead of a skeleton square.
- Use the same image container style as ResultsScreen: `bg-bg-surface2 p-2 rounded-xl border border-border-default`
- Add a **scan effect overlay** — a horizontal line that sweeps top-to-bottom repeatedly:

```css
/* Add to index.css */
@keyframes scan-line {
  0% { top: 0; }
  100% { top: 100%; }
}
.animate-scan-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
  box-shadow: 0 0 15px var(--color-accent), 0 0 30px var(--color-accent);
  animation: scan-line 2s ease-in-out infinite;
}
```

- Wrap image container in `relative overflow-hidden` and add the scan line div inside

**Right side (60%):** Keep the skeleton loaders for content only, but add structure:
- Show skeleton tab bar (Visual DNA / Buyer DNA labels as skeleton blocks)
- Show 5 skeleton content blocks (same as current)
- Keep the same gap and sizing

**Bottom center:** Keep the "Analyzing... Xs" timer and Cancel button.

If `uploadedImage` is null, fall back to a skeleton square (same as current behavior).
  </action>
  <verify>
- `npm run build` passes
- Visual check: uploaded image visible with scan line sweeping over it
- Skeleton content on right side only
- Error state still renders correctly
  </verify>
  <done>AnalyzingScreen shows uploaded image with scan effect, content-only skeletons</done>
</task>

</tasks>

<verification>
1. `npm run build` passes
2. Upload image → click Analyze → AnalyzingScreen shows the uploaded image (not skeleton)
3. Scan line animation sweeps over the image
4. Right side shows skeleton placeholders for DNA content
5. Error states still display correctly
6. Cancel button still works
</verification>

<success_criteria>
- Uploaded image is visible during analysis (not replaced by skeleton)
- Scan effect animation is smooth and visually appealing
- Only analysis content area shows skeletons
- All error handling preserved
</success_criteria>

<output>
After completion, create `.planning/phases/6A-critical-ux-fixes/6A-02-SUMMARY.md`
</output>
