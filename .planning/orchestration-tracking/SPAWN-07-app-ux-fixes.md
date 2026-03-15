<agent_role>
You are a React Frontend Engineer specializing in navigation and userflow. You fix routing, state management, and navigation UX issues with precision.
</agent_role>

<project_context>
- Project: DesignDNA — AI-powered design analysis tool
- Stack: React 19 + Vite 6 + TailwindCSS v4 + lucide-react + motion
- Current task: Fix 5 UX navigation/userflow issues in `App.tsx` ONLY
</project_context>

<files_to_read>
- `projects/design-dna/app/src/App.tsx` — the ONLY file to edit
</files_to_read>

<your_task>
Fix 5 UX issues in `app/src/App.tsx` ONLY. DO NOT touch any other files.

---

## Fix C1 (CRITICAL): Make logo clickable → navigate to Landing

In the `App` component, the header logo (`<div>` with AI gradient + "DesignDNA" text) is not clickable.

**Current (around line 180-183):**
```tsx
<div className="flex items-center">
  <div className="w-6 h-6 rounded ai-gradient mr-3"></div>
  <span className="font-semibold text-[16px]">DesignDNA</span>
</div>
```

**Fix:** Wrap in a clickable element that navigates to landing:
```tsx
<button onClick={() => setCurrentScreen('landing')} className="flex items-center hover:opacity-80 transition-opacity">
  <div className="w-6 h-6 rounded ai-gradient mr-3"></div>
  <span className="font-semibold text-[16px]">DesignDNA</span>
</button>
```

---

## Fix C2 (CRITICAL, App side): Pass generation mode to GenerationScreen

Add a new state `initialGenMode` to pass the desired mode to GenerationScreen.

**Step 1:** Add state in App component (near other state declarations):
```tsx
const [initialGenMode, setInitialGenMode] = useState<string | undefined>(undefined);
```

**Step 2:** Pass it to GenerationScreen as a prop (in the JSX where GenerationScreen is rendered):
```tsx
<GenerationScreen
  key="generation"
  analysisResult={analysisResult}
  onNavigate={setCurrentScreen}
  prefilledBrief={prefilledBrief}
  initialGenMode={initialGenMode}
/>
```

**Step 3:** In `ResultsScreen`, update the two action buttons. The component needs access to `setInitialGenMode`. Add it to the component's props.

Update ResultsScreen props to include:
```tsx
setInitialGenMode: (mode: string | undefined) => void;
```

Then update the two buttons (around the action bar at the bottom):

"Create: Same Buyer" button:
```tsx
<button 
  onClick={() => { setInitialGenMode('same_buyer'); onNavigate('generation'); }}
  className="px-5 py-2 rounded-lg ai-gradient text-white text-[14px] font-medium hover:opacity-90 transition-opacity"
>
  Create: Same Buyer
</button>
```

"Create: New Buyer" button:
```tsx
<button 
  onClick={() => { setInitialGenMode('new_buyer'); onNavigate('generation'); }}
  className="px-5 py-2 rounded-lg border border-border-default text-[14px] font-medium hover:bg-bg-surface2 transition-colors"
>
  Create: New Buyer
</button>
```

**Step 4:** Pass `setInitialGenMode` when rendering ResultsScreen:
```tsx
<ResultsScreen 
  key="results" 
  uploadedImage={uploadedImage}
  analysisMode={analysisMode}
  analysisResult={analysisResult}
  onRunDeepAnalysis={() => handleAnalyze('deep')}
  onNavigate={setCurrentScreen}
  setInitialGenMode={setInitialGenMode}
/>
```

---

## Fix C3 (CRITICAL): Cancel Compare Analysis routes to wrong screen

In `handleCancelAnalysis` function (around line 170-175), the cancel always routes to `'upload'`.

**Current:**
```tsx
const handleCancelAnalysis = () => {
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }
  setCurrentScreen('upload');
};
```

**Fix:** Make it context-aware. The simplest approach — check which analyzing screen we're on:

```tsx
const handleCancelAnalysis = () => {
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }
  setCurrentScreen(currentScreen === 'compare_analyzing' ? 'compare_upload' : 'upload');
};
```

---

## Fix M1 (MAJOR, App side): Standardize back navigation labels

Standardize all back buttons in App.tsx to use `← {Screen Name}` format, left-aligned.

**UploadScreen (line ~448-452):**
Currently: `← Home`
Keep as-is ✅ (correct)

**ResultsScreen back button:**
Currently there's no back button in ResultsScreen (the action bar has "Analyze Another" which is different).
No change needed.

---

## Fix m4 (MINOR): Add heading to Upload screen

In `UploadScreen`, add a page title after the back button and before the upload zone.

**After the back button (around line 452), before `<div className="max-w-[640px]">`:**

Add:
```tsx
<h1 className="text-[32px] font-bold tracking-tight mb-2">Analyze a Design</h1>
<p className="text-[14px] text-text-secondary mb-8">Upload a design image to decode its visual DNA and buyer psychology.</p>
```

Make sure to wrap this inside the `max-w-[640px] mx-auto` container, or place it above with proper centering.

---

## Rules
- ONLY edit `app/src/App.tsx`
- Make precise, targeted changes
- Keep all existing functionality intact
- Verify build: `cd projects/design-dna/app && npx vite build --mode production 2>&1 | head -10`
</your_task>

<output_requirements>
- Updated file: `projects/design-dna/app/src/App.tsx`
- Verify build passes
</output_requirements>

<when_complete>
✅ APP.TSX UX FIX COMPLETE

📁 Files Modified:
- `projects/design-dna/app/src/App.tsx`

📝 Summary:
- Logo now clickable → navigates to Landing
- Added initialGenMode state + pass to GenerationScreen
- "Create: Same Buyer" / "Create: New Buyer" now set correct mode before navigating
- Cancel analysis now context-aware (routes to correct upload screen)
- Added heading to Upload screen
- Build verified

🔙 Quay lại orchestrator session và nói: "app ux fix complete"
</when_complete>
