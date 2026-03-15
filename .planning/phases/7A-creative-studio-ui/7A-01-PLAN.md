---
phase: 7A-creative-studio-ui
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - app/src/CreativeStudio.tsx
  - app/src/App.tsx
autonomous: true

must_haves:
  truths:
    - "3-panel layout renders: left config (280px) + center canvas (flex-1) + right panel (300px)"
    - "Left panel shows Original Design section with 80×80 thumbnail + DNA chips"
    - "Left panel shows Creativity Level slider (1-5) with labels"
    - "Left panel shows 6 dimensions with Keep/Change toggles"
    - "Center canvas shows empty state with Create Design CTA before generation"
    - "Center canvas shows generated artwork at max size after generation"
    - "Center canvas shows Create New Design + Download buttons after generation"
    - "Right panel shows Buyer Fit scores after generation"
    - "No chat refinement UI exists"
    - "File is named CreativeStudio.tsx, not GenerationScreen.tsx"
  artifacts:
    - path: "app/src/CreativeStudio.tsx"
      provides: "3-panel Creative Studio screen"
      min_lines: 300
    - path: "app/src/App.tsx"
      provides: "Updated import and routing for CreativeStudio"
      contains: "CreativeStudio"
  key_links:
    - from: "app/src/App.tsx"
      to: "app/src/CreativeStudio.tsx"
      via: "import"
      pattern: "import.*CreativeStudio"
    - from: "app/src/CreativeStudio.tsx"
      to: "app/src/api.ts"
      via: "generateDesignImage call"
      pattern: "generateDesignImage"
---

<objective>
Redesign GenerationScreen into CreativeStudio with 3-panel Playground layout.

Purpose: Transform the Generation screen from a single-column form into a professional AI workspace — left panel (config), center canvas (artwork + actions), right panel (evaluation). Desktop-only.

Output: `CreativeStudio.tsx` replacing `GenerationScreen.tsx`, updated routing in `App.tsx`.
</objective>

<execution_context>
@.agent/skills/gsd/gsd-execution/execute-plan.md
@.agent/skills/gsd/_gsd-shared/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/7A-creative-studio-ui/7A-UX-SPEC.md
@app/src/GenerationScreen.tsx
@app/src/App.tsx
@app/src/api.ts
@app/src/index.css
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create CreativeStudio.tsx with 3-panel layout</name>
  <files>app/src/CreativeStudio.tsx</files>
  <action>
Create `app/src/CreativeStudio.tsx` — a complete rewrite of `GenerationScreen.tsx` using the 3-panel Playground layout from `7A-UX-SPEC.md`.

**Root structure:**
```tsx
<div className="flex flex-col h-screen bg-bg-base">
  {/* Topbar: h-14 with back button + "Creative Studio" title */}
  
  <div className="flex flex-1 overflow-hidden">
    {/* Left Panel: w-[280px] flex-shrink-0 border-r overflow-y-auto p-4 space-y-4 */}
    {/* Center Canvas: flex-1 flex flex-col items-center justify-center p-6 */}
    {/* Right Panel: w-[300px] flex-shrink-0 border-l overflow-y-auto p-4 */}
  </div>
</div>
```

**LEFT PANEL — Configuration only (no action buttons):**

1. **Your Original section** — `bg-bg-surface2/50 p-3 rounded-xl border`:
   - Image: 80×80px from `uploadedImage.data` (get from `analysisResult` — extract first image from the result object)
   - Name: truncated, 13px
   - DNA chips: 2-4 chips showing style, palette, tribe, emotion (from `analysisResult.visual_dna` and `analysisResult.buyer_dna`)
   - Section label: "YOUR ORIGINAL" — `text-[11px] uppercase tracking-wider text-text-tertiary`

2. **Creativity Level** — slider (1-5):
   - Keep existing `creativity` state + `creativityLabels` mapping
   - Labels: 1=Faithful, 2=Inspired, 3=Remixed, 4=Original, 5=Radical
   - Display current label below slider
   - Default: 2

3. **What to Change** — 6 dimensions with Keep/Change toggles:
   - Use EXISTING `shifts` state object (same shape: `{S: {keep, value}, H: {keep, value}, ...}`)
   - Update `shiftConfig` display names:
     - S → "Visual Style" (placeholder: "e.g., Watercolor landscape")
     - H → "Colors" (placeholder: "e.g., Cool blues and teals")
     - I → "Graphics" (placeholder: "e.g., Cat instead of dog")
     - F → "Typography" (placeholder: "e.g., Bold hand-lettered")
     - T → "Theme & Mood" (placeholder: "e.g., Calm serenity")
     - B → "Audience" (placeholder: "e.g., Yoga moms 30-40")
   - REMOVE circular letter badges (no `<div className="w-6 h-6 rounded-full">S</div>`)
   - Keep/Change as segmented control buttons
   - Show text input ONLY when "Change" is selected (progressive disclosure)
   - Smart defaults: S (Change), H (Change), I (Keep), F (Keep), T (Change), B (Keep)

4. **Applied Patterns** — placeholder section:
   - Label: "APPLIED PATTERNS"
   - If no patterns: disabled "+ Add Pattern" button with tooltip "Coming soon"
   - If `prefilledBrief` prop: show chip with brief text + × remove button
   
**CENTER CANVAS — artwork + all actions:**

Before generation (empty state):
```tsx
<EmptyCanvasState>
  ✨ icon (w-20 h-20 rounded-2xl bg-bg-surface1 border)
  "Ready to create" — 18px font-semibold
  "Configure your design controls on the left" — 14px text-text-secondary
  [✨ Create Design] — Primary button, ai-gradient bg, large
</EmptyCanvasState>
```

After generation:
```tsx
<>
  <img src={generatedImage} className="max-w-full max-h-[calc(100%-60px)] object-contain rounded-xl" />
  <div className="flex gap-3 mt-4">
    [✨ Create New Design] — secondary button (bg-bg-surface1 border)
    [⬇ Download] — secondary button with Download icon
  </div>
</>
```

Loading state:
- Center canvas: pulsing placeholder with sparkle animation
- Button area hidden

**RIGHT PANEL — Buyer Fit (after generation only):**
- Empty until `showResult` is true
- After generation: show Buyer Fit scores card with progress bars
- Move the existing `buyerFit` display logic from GenerationScreen into this panel
- Compact card: Match %, Emotion %, Originality %, Signals count

**WHAT TO KEEP FROM GenerationScreen.tsx:**
- `creativity` state + labels
- `shifts` state object + toggle logic
- `constructPrompt()` function (remove `specificity` interpolation only)
- `handleGenerate()` function
- `handleDownload()` function
- `buyerFit` state + `analyzeBuyerFit` call
- `generatedImage` state
- `isGenerating` + `error` states

**WHAT TO REMOVE:**
- `mode` state (GenerationMode union type)
- `specificity` state (SpecificityLevel type)
- 3 mode cards (Same Buyer / New Buyer / Full Remix)
- Specificity selector (General / Niche / Hyper Niche)
- Letter badges on dimensions
- `handleChatSend()` + chat UI entirely (no chat in 7A)
- `chatMessages` state
- Single column `max-w-[800px]` container

**WHAT TO ADD:**
- 3-panel flex layout (full viewport height)
- Topbar with back button + title
- EmptyCanvasState component
- Right panel with Buyer Fit scores
- Panel dividers (border-r, border-l)
- ARIA roles: left panel `role="form"`, center `role="main"`, right `role="complementary"`
  </action>
  <verify>
`npm run build` passes with no TypeScript errors.
File `app/src/CreativeStudio.tsx` exists with 3-panel layout.
`GenerationScreen.tsx` is no longer imported anywhere.
  </verify>
  <done>
CreativeStudio.tsx renders with 3 panels. Left has Original + slider + toggles + patterns. Center has empty state with Create Design CTA (or artwork + actions after generation). Right has Buyer Fit after generation. No chat anywhere.
  </done>
</task>

<task type="auto">
  <name>Task 2: Update App.tsx routing and imports</name>
  <files>app/src/App.tsx</files>
  <action>
1. Replace `import GenerationScreen from './GenerationScreen'` with `import CreativeStudio from './CreativeStudio'`

2. In the Screen type union, rename `'generation'` to `'creative-studio'` if present, OR keep as-is and just swap the component.

3. Where `<GenerationScreen` is rendered, change to `<CreativeStudio`:
   - Keep existing props: `analysisResult`, `onNavigate`, `prefilledBrief`, `initialGenMode`
   - Add `uploadedImage` prop (pass the uploaded image data so CreativeStudio can show the 80×80 thumbnail in left panel)

4. Verify `onNavigate('generation')` calls from other screens still work (or update to new screen name).

5. Do NOT delete `GenerationScreen.tsx` yet — keep it as backup. Just ensure it's not imported or referenced.

6. Commit: `feat(7A-01): create CreativeStudio with 3-panel layout`
  </action>
  <verify>
`npm run build` passes.
Navigation to Creative Studio from DNA card works.
`grep -r "GenerationScreen" app/src/App.tsx` returns nothing.
  </verify>
  <done>
App.tsx imports and renders CreativeStudio instead of GenerationScreen. All navigation paths still work. Build passes clean.
  </done>
</task>

</tasks>

<verification>
1. `npm run build` — no errors
2. Open app → upload image → analyze → navigate to Creative Studio
3. Verify 3-panel layout renders correctly:
   - Left: has Original section, slider, 6 toggles, patterns
   - Center: shows empty state with Create Design button
4. Click Create Design → artwork appears in center canvas
5. After generation: Create New Design + Download buttons visible below artwork
6. Right panel: Buyer Fit scores visible after generation
7. No chat input anywhere on the screen
</verification>

<success_criteria>
- CreativeStudio.tsx exists with 3-panel Playground layout
- GenerationScreen.tsx no longer imported
- All generation functionality works (create, download)
- Buyer Fit scores display in right panel
- No chat refinement UI
- Build passes clean
</success_criteria>

<output>
After completion, create `.planning/phases/7A-creative-studio-ui/7A-01-SUMMARY.md`
</output>
