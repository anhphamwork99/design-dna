<agent_role>
You are a Prompt Engineer specializing in structured JSON output from Gemini LLMs. You write precise, schema-enforced prompts that produce consistent, parseable results. You understand POD (Print-on-Demand) design analysis domain.
</agent_role>

<project_context>
- Project: DesignDNA — AI-powered design analysis tool for POD sellers
- Stack: React 19 + Vite 6 + @google/genai SDK
- Current task: Fix 4 API prompt schema gaps identified in requirements review
</project_context>

<files_to_read>
- `projects/design-dna/.planning/REQUIREMENTS.md` — requirements spec
- `projects/design-dna/app/src/api.ts` — the ONLY file to edit
</files_to_read>

<your_task>
Fix 4 prompt schema gaps in `app/src/api.ts` ONLY. DO NOT touch any .tsx files.

---

## Fix 1 — F1-04: Add `proportion` to color palette in analysis prompts

In both `quickScanPrompt` and `deepAnalysisPrompt`, the color palette currently requests:
```
palette array of exactly 5 objects with hex/name/role
```

**Change to:**
```
palette array of exactly 5 objects with hex/name/role/proportion (proportion is an integer percentage summing to 100 across all 5, following a dominant-secondary-accent distribution like 40/25/20/10/5)
```

This applies to BOTH the quickScanPrompt (line ~12) and deepAnalysisPrompt (line ~14) — the visual_dna section references "same structure as Quick Scan".

---

## Fix 2 — F1-12: Add `what_would_break` to "Made For Me" decisions

In `deepAnalysisPrompt`, the made_for_me_decisions currently requests:
```
each with decision string and why_it_works string
```

**Change to:**
```
each with decision string, why_it_works string, and what_would_break string (what specific quality or resonance would be lost if this design decision were changed)
```

---

## Fix 3 — F3-02: Add `visual_patterns` to batch analysis prompt

In `analyzeBatch()`, the prompt schema currently has `batch_analysis` with only `buyer_overlap`, `made_for_me_patterns`, `specificity_ladder`, and `winning_formula`.

**Add a new `visual_patterns` object** at the top of `batch_analysis`:

```json
"visual_patterns": {
  "common_colors": "string describing shared color patterns across designs",
  "typography_trends": "string describing shared typography patterns",
  "composition_patterns": "string describing shared layout/composition patterns",
  "illustration_styles": "string describing shared illustration/graphic styles"
}
```

Insert this BEFORE `buyer_overlap` in the JSON schema.

---

## Fix 4 — F3-05: Add keep/experiment/avoid to winning formula

In `analyzeBatch()`, the `winning_formula` currently has:
```json
"winning_formula": {
  "summary": "string",
  "suggested_brief": "string"
}
```

**Change to:**
```json
"winning_formula": {
  "keep": ["string array of elements that work well and should be kept"],
  "experiment_with": ["string array of elements that could be varied or improved"],
  "avoid": ["string array of elements or approaches to avoid"],
  "summary": "string",
  "suggested_brief": "string"
}
```

---

## Rules
- ONLY edit `app/src/api.ts`
- Be careful with string escaping — prompts are template literals
- Keep existing response parsing logic unchanged
- Verify build: `cd projects/design-dna/app && npx vite build --mode production 2>&1 | head -10`
</your_task>

<output_requirements>
- Updated file: `projects/design-dna/app/src/api.ts`
- Verify build passes
</output_requirements>

<when_complete>
✅ API PROMPTS EXECUTOR COMPLETE

📁 Files Modified:
- `projects/design-dna/app/src/api.ts`

📝 Summary:
- Added `proportion` field to color palette schema (both quickScan + deep prompts)
- Added `what_would_break` field to made_for_me_decisions
- Added `visual_patterns` section to batch analysis prompt
- Added `keep/experiment_with/avoid` arrays to winning_formula schema
- Build verified

🔙 Quay lại orchestrator session và nói: "api prompts fix complete"
</when_complete>
