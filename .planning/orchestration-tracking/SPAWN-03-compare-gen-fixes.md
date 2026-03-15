<agent_role>
You are a React Frontend Engineer specializing in UI component fixes. You make precise, targeted edits to React components to align them with design system specifications. You are meticulous about matching exact pixel values, animations, and patterns from the style guide.
</agent_role>

<project_context>
- Project: DesignDNA — a Raycast-inspired dark mode design analysis app
- Stack: React 19 + Vite 6 + TailwindCSS v4 + lucide-react + motion (framer-motion)
- Current task: Fix style review findings in CompareScreens.tsx and GenerationScreen.tsx
</project_context>

<files_to_read>
- `projects/design-dna/.planning/deliverables/STYLE-GUIDE.md` — the source-of-truth style contract
- `projects/design-dna/app/src/CompareScreens.tsx` — file to edit
- `projects/design-dna/app/src/GenerationScreen.tsx` — file to edit
</files_to_read>

<your_task>
Fix 3 findings across `CompareScreens.tsx` and `GenerationScreen.tsx`. DO NOT touch App.tsx or index.css.

---

## Finding #3 (MEDIUM, partial): `accent/5` → `accent/10`

### In CompareScreens.tsx:

Search for ALL instances of `bg-accent/5` and replace with `bg-accent/10`.

**Affected (~L92):**
```tsx
'border-accent bg-accent/5'
```
→
```tsx
'border-accent bg-accent/10'
```

### In GenerationScreen.tsx:

Search for ALL instances of `bg-accent/5` and replace with `bg-accent/10`.

**Affected (~L276, L284, L292):**
```tsx
'border-accent bg-accent/5'
```
→
```tsx
'border-accent bg-accent/10'
```

Also check for `accent/10` already existing and `accent/5` — replace ALL instances.

---

## Finding #11 (LOW): Compare Results missing stagger animation

In `CompareResultsScreen` (CompareScreens.tsx), the results content renders without stagger animation, unlike `ResultsScreen` in App.tsx which uses `containerVariants` + `itemVariants`.

**Add stagger animation to the results sections in `CompareResultsScreen`:**

1. Import `motion` is already available (it's imported at the top).

2. Define variants inside the component (before the return):
```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};
```

3. Wrap the right-side content column (`<div className="w-full md:w-[70%] flex flex-col gap-8">`) with `motion.div`:
```tsx
<motion.div 
  className="w-full md:w-[70%] flex flex-col gap-8"
  variants={containerVariants}
  initial="hidden"
  animate="show"
>
```

4. Wrap each major section (Winning Formula card, Buyer Overlap, Pattern Analysis) with `motion.div variants={itemVariants}`:
```tsx
<motion.div variants={itemVariants}>
  {/* Winning Formula card */}
</motion.div>

<motion.div variants={itemVariants}>
  {/* Buyer Overlap */}
</motion.div>

<motion.div variants={itemVariants}>
  {/* Pattern Analysis */}
</motion.div>
```

---

## Rules
- ONLY edit `CompareScreens.tsx` and `GenerationScreen.tsx`
- Make precise, targeted changes — don't rewrite entire components
- Keep all existing functionality intact
- Verify the app still compiles: `cd projects/design-dna/app && npx vite build --mode production 2>&1 | head -20`
</your_task>

<output_requirements>
- Updated files:
  - `projects/design-dna/app/src/CompareScreens.tsx`
  - `projects/design-dna/app/src/GenerationScreen.tsx`
- Verify build passes
</output_requirements>

<when_complete>
✅ COMPARE & GENERATION FIXES EXECUTOR COMPLETE

📁 Files Modified:
- `projects/design-dna/app/src/CompareScreens.tsx`
- `projects/design-dna/app/src/GenerationScreen.tsx`

📝 Summary:
- Replaced `bg-accent/5` → `bg-accent/10` across both files
- Added stagger animation to CompareResultsScreen (containerVariants + itemVariants)
- Build verified

🔙 Quay lại orchestrator session và nói: "compare gen fix complete"
</when_complete>
