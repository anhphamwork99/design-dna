---
phase: 7A-creative-studio-ui
plan: 02
type: execute
wave: 1
depends_on: ["7A-01"]
files_modified:
  - app/src/CreativeStudio.tsx
autonomous: true

must_haves:
  truths:
    - "Applied Patterns section shows disabled '+ Add Pattern' button when no patterns"
    - "When prefilledBrief prop is passed, a chip with brief text appears in Applied Patterns section"
    - "Chip has × button to remove the pattern"
    - "Removing pattern clears Applied Patterns but does NOT clear user-typed dimension inputs"
    - "prefilledBrief data is included in the generation prompt"
  artifacts:
    - path: "app/src/CreativeStudio.tsx"
      provides: "Applied Patterns section with chip management"
      contains: "appliedPatterns"
  key_links:
    - from: "app/src/CreativeStudio.tsx"
      to: "app/src/CreativeStudio.tsx"
      via: "prefilledBrief → appliedPatterns state → constructPrompt"
      pattern: "prefilledBrief"
---

<objective>
Wire up Applied Patterns section in CreativeStudio — handle prefilledBrief from Compare Results, chip display/removal, and prompt integration.

Purpose: Enable the bridge between Compare Results screen and Creative Studio. When user clicks "Create inspired design" from Compare, the pattern info should appear as a removable chip.

Output: Updated `CreativeStudio.tsx` with working Applied Patterns section.
</objective>

<execution_context>
@.agent/skills/gsd/gsd-execution/execute-plan.md
@.agent/skills/gsd/_gsd-shared/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md
@.planning/phases/7A-creative-studio-ui/7A-UX-SPEC.md
@.planning/phases/7A-creative-studio-ui/7A-01-SUMMARY.md
@app/src/CreativeStudio.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Implement Applied Patterns chip management</name>
  <files>app/src/CreativeStudio.tsx</files>
  <action>
In `CreativeStudio.tsx`, enhance the Applied Patterns section:

1. **State management:**
```tsx
const [appliedPattern, setAppliedPattern] = useState<string | null>(prefilledBrief || null);
```

2. **Applied Patterns section (left panel):**

When `appliedPattern` is null:
```tsx
<div className="...">
  <label className="text-[11px] uppercase tracking-wider text-text-tertiary mb-2">
    Applied Patterns
  </label>
  <button disabled className="px-3 py-1.5 text-[12px] text-text-tertiary bg-bg-surface1 rounded-lg border border-border-default opacity-50 cursor-not-allowed" title="Pattern library coming in Phase 7C">
    + Add Pattern
  </button>
</div>
```

When `appliedPattern` has value (from prefilledBrief):
```tsx
<div className="...">
  <label>Applied Patterns</label>
  <div className="flex flex-wrap gap-1.5">
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/10 text-accent text-[11px] rounded-md border border-accent/20">
      <span className="truncate max-w-[200px]">{appliedPattern}</span>
      <button onClick={handleRemovePattern} className="..." aria-label={`Remove pattern ${appliedPattern}`}>×</button>
    </span>
  </div>
</div>
```

3. **Remove handler:**
```tsx
const handleRemovePattern = () => {
  setAppliedPattern(null);
  // Do NOT clear user-typed dimension inputs — preserve their work
};
```

4. **Update constructPrompt():**
Ensure pattern text is included in the generation prompt when present:
```tsx
if (appliedPattern) {
  prompt += `\nApplied Pattern/Inspiration: ${appliedPattern}\n`;
}
```

5. Commit: `feat(7A-02): wire Applied Patterns with prefilledBrief`
  </action>
  <verify>
`npm run build` passes.
When navigating from Compare Results with prefilledBrief: chip appears in Applied Patterns section.
Clicking × removes the chip but does not clear dimension text inputs.
When no prefilledBrief: disabled "+ Add Pattern" button shown.
  </verify>
  <done>
Applied Patterns section displays prefilled brief as removable chip. Pattern text is included in generation prompt. Remove pattern preserves user-typed dimension values.
  </done>
</task>

</tasks>

<verification>
1. `npm run build` — no errors
2. Navigate to Creative Studio directly (no prefilledBrief) → "+ Add Pattern" button disabled
3. Navigate from Compare Results with a brief → chip appears with brief text
4. Click × on chip → chip removed, but dimension inputs retain their values
5. Generate with pattern → verify prompt includes "Applied Pattern" section
6. Generate without pattern → verify prompt does NOT include pattern section
</verification>

<success_criteria>
- Applied Patterns section handles both empty and populated states
- prefilledBrief prop is bridged correctly
- Pattern removal is safe (no side effects on other inputs)
- Build passes clean
</success_criteria>

<output>
After completion, create `.planning/phases/7A-creative-studio-ui/7A-02-SUMMARY.md`
</output>
