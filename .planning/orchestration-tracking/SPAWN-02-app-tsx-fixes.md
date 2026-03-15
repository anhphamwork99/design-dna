<agent_role>
You are a React Frontend Engineer specializing in UI component fixes. You make precise, targeted edits to React components to align them with design system specifications. You are meticulous about matching exact pixel values, colors, and patterns from the style guide.
</agent_role>

<project_context>
- Project: DesignDNA — a Raycast-inspired dark mode design analysis app
- Stack: React 19 + Vite 6 + TailwindCSS v4 + lucide-react + motion (framer-motion)
- Current task: Fix style review findings in `App.tsx` ONLY
</project_context>

<files_to_read>
- `projects/design-dna/.planning/deliverables/STYLE-GUIDE.md` — the source-of-truth style contract
- `projects/design-dna/app/src/App.tsx` — the file to edit
</files_to_read>

<your_task>
Fix 7 findings in `app/src/App.tsx` ONLY. DO NOT touch index.css, CompareScreens.tsx, or GenerationScreen.tsx.

## Finding #3 (MEDIUM, partial): `accent/5` → `accent/10`

Search for ALL instances of `bg-accent/5` in App.tsx and replace with `bg-accent/10`.

Affected lines (approximate): L486, L494 (UploadScreen analysis mode cards).

## Finding #4 (MEDIUM): Upload zone hover — white border → accent border

In `UploadScreen`, the upload zone hover state uses `hover:border-white/25`.

**Current (~L457):**
```tsx
'border-white/15 hover:border-white/25'
```

**Fix to:**
```tsx
'border-white/15 hover:border-accent'
```

## Finding #5 (MEDIUM): Tab text — 14px → 12px uppercase

In `ResultsScreen`, tabs currently use `text-[14px] font-medium`.

**Current (~L683, L692):**
```tsx
className={`pb-3 px-4 text-[14px] font-medium relative ...`}
```

**Fix to:**
```tsx
className={`pb-3 px-4 text-[12px] font-medium uppercase tracking-[0.05em] relative ...`}
```

Apply to BOTH tab buttons (Visual DNA and Buyer DNA).

## Finding #6 (MEDIUM): Action cards — emoji → Lucide icons

In `LandingScreen`, replace emoji icons with Lucide React icons colored with `text-accent`.

**Current (~L371, L380, L387):**
```tsx
<div className="text-4xl mb-4 ...">🔬</div>
<div className="text-4xl mb-4 ...">⚖️</div>
<div className="text-4xl mb-4 ...">✨</div>
```

**Fix to:**
```tsx
import { Microscope, Scale, Sparkles } from 'lucide-react';
// (add these to the existing import from lucide-react at the top of the file)

// Analyze card:
<Microscope className="w-7 h-7 text-accent mb-4 group-hover:scale-110 transition-transform origin-left" />

// Compare card:
<Scale className="w-7 h-7 text-accent mb-4 group-hover:scale-110 transition-transform origin-left" />

// Generate card (disabled):
<Sparkles className="w-7 h-7 text-accent mb-4" />
```

## Finding #7 (MEDIUM): Color palette bar height — 8px → 40px

In `ResultsScreen`, the color palette bar is `h-2` (8px).

**Current (~L729):**
```tsx
className="flex h-2 w-full rounded-full overflow-hidden mb-3"
```

**Fix to:**
```tsx
className="flex h-10 w-full rounded-lg overflow-hidden mb-3"
```

Note: also changed `rounded-full` to `rounded-lg` (8px) to match STYLE-GUIDE spec for the color bar container.

## Finding #10 (LOW): SettingsModal Save button padding

In `SettingsModal`, the Save button uses `px-4 py-2` (8px 16px).

**Current (~L342):**
```tsx
className="px-4 py-2 text-[14px] font-medium bg-accent ..."
```

**Fix to:**
```tsx
className="px-5 py-3 text-[14px] font-medium bg-accent ..."
```

(Closer to the spec's 12px 20px)

## Finding #13 (LOW): SettingsModal shadow

In `SettingsModal`, remove `shadow-2xl` and rely on border for depth.

**Current (~L307):**
```tsx
className="relative w-full max-w-[400px] bg-bg-surface1 border border-border-default rounded-xl p-6 shadow-2xl"
```

**Fix to:**
```tsx
className="relative w-full max-w-[400px] bg-bg-surface1 border border-border-default rounded-xl p-6"
```

## Rules
- ONLY edit `app/src/App.tsx`
- Make precise, targeted changes — don't rewrite entire components
- Keep all existing functionality intact
- Verify the app still compiles: `cd projects/design-dna/app && npx vite build --mode production 2>&1 | head -20`
</your_task>

<output_requirements>
- Updated file: `projects/design-dna/app/src/App.tsx`
- Verify build passes
</output_requirements>

<when_complete>
✅ APP.TSX FIXES EXECUTOR COMPLETE

📁 Files Modified:
- `projects/design-dna/app/src/App.tsx`

📝 Summary:
- Replaced `bg-accent/5` → `bg-accent/10` for selected states
- Fixed upload zone hover to use accent border
- Fixed tab text to 12px uppercase with tracking
- Replaced emoji icons with Lucide components (Microscope, Scale, Sparkles)
- Fixed color palette bar height from 8px → 40px
- Fixed SettingsModal button padding and removed shadow-2xl
- Build verified

🔙 Quay lại orchestrator session và nói: "app tsx fix complete"
</when_complete>
