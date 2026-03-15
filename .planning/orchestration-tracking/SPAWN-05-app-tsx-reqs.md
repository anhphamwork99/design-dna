<agent_role>
You are a React Frontend Engineer. You make precise, targeted edits to React components to align them with product requirements. You understand POD (Print-on-Demand) design tools.
</agent_role>

<project_context>
- Project: DesignDNA — AI-powered design analysis tool for POD sellers
- Stack: React 19 + Vite 6 + TailwindCSS v4 + lucide-react + motion (framer-motion)
- Current task: Fix 3 requirement gaps in `App.tsx` ONLY
- API returns `any` typed results, so new fields will render fine once API sends them
</project_context>

<files_to_read>
- `projects/design-dna/.planning/REQUIREMENTS.md` — requirements spec
- `projects/design-dna/app/src/App.tsx` — the ONLY file to edit
</files_to_read>

<your_task>
Fix 3 requirement gaps in `app/src/App.tsx` ONLY. DO NOT touch api.ts, CompareScreens.tsx, or GenerationScreen.tsx.

---

## Fix 1 — F1-14 (CRITICAL): Replace DNA Card action buttons

In `ResultsScreen`, the action bar at the bottom (around line 912-932) has wrong buttons.

**Current 3 buttons:**
1. "Analyze Another" → routes to upload
2. "Generate from DNA" → routes to generation  
3. "Compare Designs" → disabled

**Replace with these 3 buttons:**

### Button 1: "Create: Same Buyer"
- AI gradient style (same as current "Generate from DNA")
- onClick: navigate to 'generation' screen
- Before navigating, we need to somehow signal "same_buyer" mode. BUT since `GenerationScreen` already supports `prefilledBrief` and sets mode based on it, the simplest approach is: just navigate. The generation screen defaults to `same_buyer` mode already.
- Label: "Create: Same Buyer"
- Icon: add `Target` from lucide-react (already imported? check)

### Button 2: "Create: New Buyer"
- Secondary style (border, no fill)
- onClick: navigate to 'generation' screen
- Label: "Create: New Buyer"

### Button 3: "Copy DNA JSON"
- Ghost style (transparent bg, text-secondary)
- onClick: copy `JSON.stringify(analysisResult, null, 2)` to clipboard via `navigator.clipboard.writeText()`
- Show feedback: after click, change text to "Copied!" for 2 seconds, then revert
- Icon: add `Copy, Check` from lucide-react import

**Implementation:**

```tsx
// Add to lucide-react import at top: Copy, Check (if not already there)

// Inside ResultsScreen, add state for copy feedback:
const [copied, setCopied] = useState(false);

const handleCopyDNA = async () => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(analysisResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

// Replace the 3 buttons with:
<button 
  onClick={() => onNavigate('generation')}
  className="px-5 py-2 rounded-lg ai-gradient text-white text-[14px] font-medium hover:opacity-90 transition-opacity"
>
  Create: Same Buyer
</button>
<button 
  onClick={() => onNavigate('generation')}
  className="px-5 py-2 rounded-lg border border-border-default text-[14px] font-medium hover:bg-bg-surface2 transition-colors"
>
  Create: New Buyer
</button>
<button 
  onClick={handleCopyDNA}
  className="px-5 py-2 rounded-lg text-text-secondary hover:text-text-primary text-[14px] font-medium transition-colors flex items-center gap-2"
>
  {copied ? (
    <><Check className="w-4 h-4 text-success" /> Copied!</>
  ) : (
    <><Copy className="w-4 h-4" /> Copy DNA JSON</>
  )}
</button>
```

---

## Fix 2 — F1-04: Color palette bar — proportional widths

In `ResultsScreen`, the color palette bar (around line 729-733) renders equal widths.

**Current:**
```tsx
<div key={i} style={{ width: `${100 / (visualDNA.color.palette.length || 1)}%`, backgroundColor: c.hex }} />
```

**Change to:**
```tsx
<div key={i} style={{ width: `${c.proportion || (100 / (visualDNA.color.palette.length || 1))}%`, backgroundColor: c.hex }} />
```

This uses `c.proportion` if available (from updated API), otherwise falls back to equal distribution.

---

## Fix 3 — F1-12: Add "what would break" to Made For Me cards

In `ResultsScreen`, the Made For Me section (around line 838-844) renders `decision` + `why_it_works`.

**Current:**
```tsx
<div key={i} className="bg-bg-surface2 p-4 rounded-lg">
  <h4 className="text-[14px] font-semibold mb-1">{d.decision}</h4>
  <p className="text-[14px] text-text-secondary italic">{d.why_it_works}</p>
</div>
```

**Add the `what_would_break` field below `why_it_works`:**
```tsx
<div key={i} className="bg-bg-surface2 p-4 rounded-lg">
  <h4 className="text-[14px] font-semibold mb-1">{d.decision}</h4>
  <p className="text-[14px] text-text-secondary italic">{d.why_it_works}</p>
  {d.what_would_break && (
    <p className="text-[12px] text-text-tertiary mt-2">
      ⚠️ If changed: {d.what_would_break}
    </p>
  )}
</div>
```

---

## Rules
- ONLY edit `app/src/App.tsx`
- Make precise, targeted changes — don't rewrite entire components
- Add `Copy, Check` to the lucide-react import if not already there
- Keep all existing functionality intact
- Verify build: `cd projects/design-dna/app && npx vite build --mode production 2>&1 | head -10`
</your_task>

<output_requirements>
- Updated file: `projects/design-dna/app/src/App.tsx`
- Verify build passes
</output_requirements>

<when_complete>
✅ APP.TSX REQUIREMENTS FIX COMPLETE

📁 Files Modified:
- `projects/design-dna/app/src/App.tsx`

📝 Summary:
- Replaced 3 DNA Card action buttons with "Create: Same Buyer" / "Create: New Buyer" / "Copy DNA JSON"
- Added clipboard copy with "Copied!" feedback
- Made color palette bar use proportional widths from API
- Added "what would break" field to Made For Me cards
- Build verified

🔙 Quay lại orchestrator session và nói: "app tsx req fix complete"
</when_complete>
