<agent_role>
You are a React Frontend Engineer. You make precise, targeted edits to React components to align them with product requirements. You understand POD (Print-on-Demand) design tools and batch comparison UIs.
</agent_role>

<project_context>
- Project: DesignDNA — AI-powered design analysis tool for POD sellers
- Stack: React 19 + Vite 6 + TailwindCSS v4 + lucide-react + motion (framer-motion)
- Current task: Fix 2 requirement gaps in `CompareScreens.tsx` ONLY
- API returns `any` typed results, so new fields will render fine once API sends them
</project_context>

<files_to_read>
- `projects/design-dna/.planning/REQUIREMENTS.md` — requirements spec
- `projects/design-dna/app/src/CompareScreens.tsx` — the ONLY file to edit
</files_to_read>

<your_task>
Fix 2 requirement gaps in `app/src/CompareScreens.tsx` ONLY. DO NOT touch api.ts, App.tsx, or GenerationScreen.tsx.

---

## Fix 1 — F3-02: Add Visual Pattern Analysis section

In `CompareResultsScreen`, the results currently show: Winning Formula → Buyer Overlap → Pattern Analysis.

**Add a new "Visual Patterns" section** BEFORE "Buyer Overlap" (between Winning Formula card and Buyer Overlap).

The data comes from `analysis?.visual_patterns` with fields: `common_colors`, `typography_trends`, `composition_patterns`, `illustration_styles`.

**Implementation:**

```tsx
{/* Section: Visual Patterns — INSERT between Winning Formula and Buyer Overlap */}
{analysis?.visual_patterns && (
  <motion.div variants={itemVariants}>
    <h3 className="text-[16px] font-semibold mb-4">Visual Patterns</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="bg-bg-surface1 border border-border-default rounded-lg p-4">
        <span className="text-[12px] text-text-secondary uppercase tracking-wider font-semibold block mb-1">Common Colors</span>
        <span className="text-[14px] text-text-primary">{analysis.visual_patterns.common_colors || 'N/A'}</span>
      </div>
      <div className="bg-bg-surface1 border border-border-default rounded-lg p-4">
        <span className="text-[12px] text-text-secondary uppercase tracking-wider font-semibold block mb-1">Typography Trends</span>
        <span className="text-[14px] text-text-primary">{analysis.visual_patterns.typography_trends || 'N/A'}</span>
      </div>
      <div className="bg-bg-surface1 border border-border-default rounded-lg p-4">
        <span className="text-[12px] text-text-secondary uppercase tracking-wider font-semibold block mb-1">Composition Patterns</span>
        <span className="text-[14px] text-text-primary">{analysis.visual_patterns.composition_patterns || 'N/A'}</span>
      </div>
      <div className="bg-bg-surface1 border border-border-default rounded-lg p-4">
        <span className="text-[12px] text-text-secondary uppercase tracking-wider font-semibold block mb-1">Illustration Styles</span>
        <span className="text-[14px] text-text-primary">{analysis.visual_patterns.illustration_styles || 'N/A'}</span>
      </div>
    </div>
  </motion.div>
)}
```

**Section order after fix:** Winning Formula → **Visual Patterns** → Buyer Overlap → Pattern Analysis

---

## Fix 2 — F3-05: Add keep/experiment/avoid to Winning Formula card

In `CompareResultsScreen`, the Winning Formula card currently shows `summary` + `suggested_brief` + "Generate" button.

**Add 3 categorized lists** between the summary paragraph and the suggested brief box.

The data comes from `analysis?.winning_formula?.keep` (array), `analysis?.winning_formula?.experiment_with` (array), `analysis?.winning_formula?.avoid` (array).

**Implementation — insert between the summary `<p>` and the suggested brief `<div>`:**

```tsx
{/* Keep / Experiment / Avoid — insert after summary paragraph, before suggested brief */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
  {/* Keep */}
  <div className="bg-success-subtle border border-success/20 rounded-lg p-4">
    <span className="text-[12px] text-success uppercase tracking-wider font-semibold block mb-2">✅ Keep</span>
    <ul className="flex flex-col gap-1.5">
      {analysis?.winning_formula?.keep?.map((item: string, i: number) => (
        <li key={i} className="text-[13px] text-text-primary">{item}</li>
      ))}
    </ul>
  </div>
  {/* Experiment With */}
  <div className="bg-warning-subtle border border-warning/20 rounded-lg p-4">
    <span className="text-[12px] text-warning uppercase tracking-wider font-semibold block mb-2">🧪 Experiment</span>
    <ul className="flex flex-col gap-1.5">
      {analysis?.winning_formula?.experiment_with?.map((item: string, i: number) => (
        <li key={i} className="text-[13px] text-text-primary">{item}</li>
      ))}
    </ul>
  </div>
  {/* Avoid */}
  <div className="bg-error-subtle border border-error/20 rounded-lg p-4">
    <span className="text-[12px] text-error uppercase tracking-wider font-semibold block mb-2">❌ Avoid</span>
    <ul className="flex flex-col gap-1.5">
      {analysis?.winning_formula?.avoid?.map((item: string, i: number) => (
        <li key={i} className="text-[13px] text-text-primary">{item}</li>
      ))}
    </ul>
  </div>
</div>
```

Note: `bg-success-subtle`, `bg-warning-subtle`, `bg-error-subtle` are semantic tokens already defined in the `@theme` block of `index.css`. They will resolve correctly.

---

## Rules
- ONLY edit `app/src/CompareScreens.tsx`
- Make precise, targeted changes — don't rewrite entire components
- Use `motion.div variants={itemVariants}` for the new Visual Patterns section (stagger animation is already set up from previous fix)
- Keep all existing functionality intact
- Verify build: `cd projects/design-dna/app && npx vite build --mode production 2>&1 | head -10`
</your_task>

<output_requirements>
- Updated file: `projects/design-dna/app/src/CompareScreens.tsx`
- Verify build passes
</output_requirements>

<when_complete>
✅ COMPARE SCREENS REQUIREMENTS FIX COMPLETE

📁 Files Modified:
- `projects/design-dna/app/src/CompareScreens.tsx`

📝 Summary:
- Added Visual Patterns section (common colors, typography, composition, illustration) to batch results
- Added keep/experiment/avoid categorized lists to Winning Formula card with semantic colors
- Build verified

🔙 Quay lại orchestrator session và nói: "compare reqs fix complete"
</when_complete>
