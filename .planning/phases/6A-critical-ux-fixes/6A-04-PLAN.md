---
phase: 6A-critical-ux-fixes
plan: 04
type: execute
wave: 4
depends_on: [01, 02, 03]
files_modified: [app/src/App.tsx, app/src/GenerationScreen.tsx]
autonomous: true

must_haves:
  truths:
    - "No jargon labels: 'SHIFT+B Dimensions', 'Specificity Level' replaced with plain language"
    - "Generation screen control labels are user-friendly"
    - "Analysis results sections have context-appropriate headings"
    - "All technical terms have brief explanatory text"
  artifacts:
    - path: "app/src/App.tsx"
      provides: "User-friendly labels in analysis results"
    - path: "app/src/GenerationScreen.tsx"
      provides: "Plain language labels for generation controls"
---

<objective>
Replace technical jargon with plain, user-friendly language across the app.

Purpose: User testing showed that terms like "SHIFT+B Dimensions", "Specificity Level", "Creativity Level", and "Buyer DNA" confuse new users who don't have a mental model for these concepts.

Output: All user-facing labels, headings, and descriptions use plain language with optional brief explanations.
</objective>

<execution_context>
@.agent/skills/gsd/gsd-execution/execute-plan.md
@.agent/skills/gsd/_gsd-shared/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md
@app/src/App.tsx
@app/src/GenerationScreen.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix UX copy in ResultsScreen (App.tsx)</name>
  <files>app/src/App.tsx</files>
  <action>
In the `ResultsScreen` component, update the following labels:

**Tab labels:**
- "Visual DNA" → "Design Breakdown" (tab still renders same content)
- "Buyer DNA" → "Target Audience" (tab still renders same content)

**Section headings inside Visual DNA tab:**
- Keep headings as-is (Composition, Color, Typography, Graphics, POD Technical) — these are already reasonably clear
- But for POD Technical section heading: "POD Technical" → "Print Recommendations"

**Section headings inside Buyer DNA tab:**
Keep the section content structure but update confusing headings:
- "Identity Signals" → "What This Design Says"
- "Emotional Triggers" → "Why People Buy This"
- "Occasion & Timing" → "When & Where It Sells"
- "Made For Me Decisions" heading → "Why It Feels Personal"

**For the "Made For Me" cards:**
- Keep the `decision` and `why_it_works` fields as-is
- If `what_would_break` field exists, label it: "If changed:" instead of raw field name

All changes are label-only — do NOT change the data structure, variable names, or rendering logic.
  </action>
  <verify>
- `npm run build` passes
- Visual check: new headings appear in results tabs
  </verify>
  <done>ResultsScreen uses plain language headings</done>
</task>

<task type="auto">
  <name>Task 2: Fix UX copy in GenerationScreen</name>
  <files>app/src/GenerationScreen.tsx</files>
  <action>
In the `GenerationScreen` component, update these labels:

**Section headings:**
- "SHIFT+B Dimensions" → "Design Controls" or "What to Change"
- "Specificity Level" → "Audience Focus" with subtitle "How niche should the target be?"
- "Creativity Level" → "How Different?" with subtitle "From subtle tweaks to radical redesign"

**SHIFT+B dimension labels (the 6 toggles):**
- S (Style) → "Visual Style" 
- H (Hue/Color) → "Colors"
- I (Imagery) → "Graphics & Characters"
- F (Font) → "Typography"
- T (Theme) → "Theme & Mood"
- B (Buyer) → "Target Audience"

For each dimension toggle:
- "keep" label → "Keep original"
- "change" label → "Change this"

**Specificity level options:**
- "general" → "Broad Appeal" with description "Reaches the widest audience"
- "niche" → "Focused" with description "Targets a specific interest group"
- "hyper_niche" → "Ultra-Specific" with description "Laser-focused on a micro-community"

All changes are label-only. Do NOT change the internal state values (still 'keep'/'change', still 'general'/'niche'/'hyper_niche' internally).
  </action>
  <verify>
- `npm run build` passes
- Visual check: generation controls use plain language
  </verify>
  <done>GenerationScreen uses user-friendly labels throughout</done>
</task>

</tasks>

<verification>
1. `npm run build` passes
2. Results screen: tabs labeled "Design Breakdown" / "Target Audience"
3. Results screen: section headings use plain language
4. Generation screen: no "SHIFT+B" or "Specificity Level" jargon visible
5. Generation screen: dimension names are self-explanatory
6. All internal state values unchanged (only labels affected)
</verification>

<success_criteria>
- Zero jargon in user-facing UI
- All labels self-explanatory without documentation
- Internal values/state unchanged
- Clean build
</success_criteria>

<output>
After completion, create `.planning/phases/6A-critical-ux-fixes/6A-04-SUMMARY.md`
</output>
