---
phase: 05-build-prompt-f3
plan: 01
status: complete
started: 2026-03-15T18:25:09+07:00
completed: 2026-03-15T18:28:00+07:00
commits:
  - hash: 2fce521
    message: "feat(05-01): create build prompts for F3 Batch Compare"
---

# Summary — Plan 05-01: Build Prompts F3

## What Was Built

Created `.planning/deliverables/BUILD-PROMPT-F3.md` containing 3 prompts to add the Batch Compare feature to the existing DesignDNA app.

## Prompt Structure

| Prompt | Lines | Purpose |
|--------|-------|---------|
| Prompt 1 | ~75 | Batch Compare UI scaffold with mock data — multi-image upload grid, Winning Formula card, Buyer Overlap map, Pattern Analysis with Specificity Ladder. |
| Prompt 2 | ~45 | Wire Gemini API — send multiple `inlineData` image parts along with prompt, output forced to JSON, parsing logic to populate mock fields, and logic to pass brief to generation screen. |
| Prompt 3 | ~20 | 3 fix templates — file upload UX (multiple + visual X), Specificity Ladder CSS formatting, and React state routing for "Generate from Formula". |

## Key Decisions Honored

- ✅ Builds sequentially on top of Phase 4 delivered app.
- ✅ **Upload limitation:** Handled in the prompt to require >1 image to enable the "Extract Winning Formula" CTA.
- ✅ **Specificity Ladder:** Visual representation of generic vs niche vs hyper-niche messaging based on pattern overlap.
- ✅ **JSON Enforcement:** Directs Gemini 2.5 Pro to output ONLY valid JSON using a direct object schema, mapping perfectly to the UI mock variables.
- ✅ **Routing:** "Generate from Formula" uses a clear parameter pass (`setCurrentScreen` / props depending on architecture from P1) to bypass manual re-entry in F2.

## Files

| File | Lines | Status |
|------|-------|--------|
| `.planning/deliverables/BUILD-PROMPT-F3.md` | 158 | ✅ Created |
