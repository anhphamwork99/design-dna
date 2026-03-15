<agent_role>
You are a React Frontend Engineer specializing in navigation and userflow UX. You fix routing, user confirmation flows, and navigation consistency issues with precision.
</agent_role>

<project_context>
- Project: DesignDNA — AI-powered design analysis tool
- Stack: React 19 + Vite 6 + TailwindCSS v4 + lucide-react + motion
- Current task: Fix 3 UX issues in `GenerationScreen.tsx` and `CompareScreens.tsx`
- **IMPORTANT:** Another parallel agent is modifying `App.tsx` at the same time, adding a new prop `initialGenMode?: string` to GenerationScreen. You must receive and use this prop.
</project_context>

<files_to_read>
- `projects/design-dna/app/src/GenerationScreen.tsx` — file to edit
- `projects/design-dna/app/src/CompareScreens.tsx` — file to edit
</files_to_read>

<your_task>
Fix 3 UX issues across `GenerationScreen.tsx` and `CompareScreens.tsx`. DO NOT touch App.tsx or any other file.

---

## Fix C2 (CRITICAL, GenerationScreen side): Receive and use `initialGenMode` prop

Another agent is modifying App.tsx to pass `initialGenMode?: string` as a new prop to GenerationScreen.

**Step 1:** Update the `GenerationScreenProps` interface to accept the new prop:
```tsx
interface GenerationScreenProps {
  key?: string;
  analysisResult: any;
  onNavigate: (screen: any) => void;
  prefilledBrief?: string;
  initialGenMode?: string;  // ADD THIS
}
```

**Step 2:** Destructure it in the component:
```tsx
export default function GenerationScreen({ analysisResult, onNavigate, prefilledBrief, initialGenMode }: GenerationScreenProps) {
```

**Step 3:** Use `initialGenMode` to set the initial mode state. Update the initial `useState` for mode:

**Current:**
```tsx
const [mode, setMode] = useState<GenerationMode>(prefilledBrief ? 'full_remix' : 'same_buyer');
```

**Change to:**
```tsx
const [mode, setMode] = useState<GenerationMode>(
  prefilledBrief ? 'full_remix' 
  : (initialGenMode === 'new_buyer' ? 'new_buyer' 
  : initialGenMode === 'full_remix' ? 'full_remix' 
  : 'same_buyer')
);
```

This ensures:
- If `prefilledBrief` exists (from Winning Formula), use `full_remix`
- If `initialGenMode` is `'new_buyer'`, pre-select "New Buyer, Same Style"
- If `initialGenMode` is `'full_remix'`, pre-select "Full Remix"
- Default: `'same_buyer'`

---

## Fix M1 (MAJOR, CompareScreens side): Standardize back navigation in Compare Results

In `CompareResultsScreen`, the "New Comparison" button is in the header right-aligned. This is inconsistent with other screens that use left-aligned "← {name}" pattern.

**Current (around line 260-268):**
```tsx
<div className="flex items-center justify-between mb-8">
  <h1 className="text-[32px] font-bold tracking-tight">Winning Formula</h1>
  <button 
    onClick={handleNewComparison}
    className="flex items-center text-text-secondary hover:text-text-primary text-[14px] transition-colors"
  >
    <ArrowLeft className="w-4 h-4 mr-2" /> New Comparison
  </button>
</div>
```

**Fix:** Move "← Home" to left (consistent with other screens), keep "New Comparison" as a separate action.

```tsx
<div className="mb-8">
  <button 
    onClick={() => onNavigate('landing')}
    className="flex items-center text-text-secondary hover:text-text-primary text-[14px] mb-4 transition-colors"
  >
    <ArrowLeft className="w-4 h-4 mr-2" /> Home
  </button>
  <h1 className="text-[32px] font-bold tracking-tight">Winning Formula</h1>
</div>
```

Then move "New Comparison" to the bottom of the results, as a secondary action next to "Generate from Formula":

Find the existing "Generate from Formula" button (around line 295-300) and add "New Comparison" next to it:

```tsx
<div className="flex flex-col sm:flex-row gap-3">
  <button 
    onClick={handleGenerate}
    className="flex-1 ai-gradient text-white font-medium py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
  >
    Generate from Formula ✨
  </button>
  <button 
    onClick={handleNewComparison}
    className="flex-1 border border-border-default text-text-primary font-medium py-3 px-6 rounded-lg hover:bg-bg-surface2 transition-colors"
  >
    New Comparison
  </button>
</div>
```

---

## Fix M4 (MAJOR): "New Comparison" confirmation before wiping state

In `CompareResultsScreen`, the `handleNewComparison` function immediately wipes images:

**Current:**
```tsx
const handleNewComparison = () => {
  setCompareImages([]);
  onNavigate('compare_upload');
};
```

**Fix:** Add a browser confirmation dialog:
```tsx
const handleNewComparison = () => {
  if (window.confirm('Start a new comparison? Current results will be lost.')) {
    setCompareImages([]);
    onNavigate('compare_upload');
  }
};
```

---

## Rules
- ONLY edit `GenerationScreen.tsx` and `CompareScreens.tsx`
- Make precise, targeted changes
- Keep all existing functionality intact
- The `initialGenMode` prop will be passed from App.tsx by the other agent — just make sure GenerationScreen accepts it
- Verify build: `cd projects/design-dna/app && npx vite build --mode production 2>&1 | head -10`
  - Note: Build might show a TypeScript warning about `initialGenMode` not being passed yet if the other agent hasn't finished. This is OK — it's an optional prop (`?`), so it will compile fine.
</your_task>

<output_requirements>
- Updated files:
  - `projects/design-dna/app/src/GenerationScreen.tsx`
  - `projects/design-dna/app/src/CompareScreens.tsx`
- Verify build passes
</output_requirements>

<when_complete>
✅ GEN + COMPARE UX FIX COMPLETE

📁 Files Modified:
- `projects/design-dna/app/src/GenerationScreen.tsx`
- `projects/design-dna/app/src/CompareScreens.tsx`

📝 Summary:
- GenerationScreen now accepts and uses `initialGenMode` prop for mode pre-selection
- Compare Results: moved back navigation to top-left "← Home", repositioned "New Comparison" to bottom
- "New Comparison" now shows confirmation dialog before wiping state
- Build verified

🔙 Quay lại orchestrator session và nói: "gen compare ux fix complete"
</when_complete>
