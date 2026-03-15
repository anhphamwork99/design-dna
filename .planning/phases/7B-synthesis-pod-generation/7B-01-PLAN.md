---
phase: 7B-synthesis-pod-generation
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [app/src/api.ts]
autonomous: true
requirements: [F2-06, F2-08, F2-09, F2-12]

must_haves:
  truths:
    - "synthesizeConcept() returns array of 3 SynthesizedConcept objects"
    - "generateArtwork() accepts original image as multimodal input"
    - "generateArtwork() accepts dynamic aspect ratio parameter"
    - "POD constraints are embedded in synthesis prompt"
    - "Creativity level determines image role description in generation prompt"
  artifacts:
    - path: "app/src/api.ts"
      provides: "synthesizeConcept() and refactored generateArtwork()"
      exports: ["synthesizeConcept", "generateArtwork"]
  key_links:
    - from: "app/src/api.ts"
      to: "@google/genai"
      via: "GoogleGenAI SDK"
      pattern: "ai\\.models\\.generateContent"
---

<objective>
Create the two new API functions that power Phase 7B: `synthesizeConcept()` for AI concept creation and refactored `generateArtwork()` for multimodal image generation.

Purpose: These are the backend building blocks. The UI (Plan 02) will call these functions.
Output: Updated `api.ts` with 2 new/refactored exports.
</objective>

<execution_context>
@.agent/skills/gsd/gsd-execution/execute-plan.md
@.agent/skills/gsd/_gsd-shared/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/7B-synthesis-pod-generation/7B-CONTEXT.md
@app/src/api.ts
@.planning/deliverables/reference-pod-artwork/README.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create synthesizeConcept() API function</name>
  <files>app/src/api.ts</files>
  <action>
Add a new exported async function `synthesizeConcept()` to api.ts:

```typescript
interface SynthesizedConcept {
  title: string;
  description: string;
  visualDirection: string;
  targetBuyer: string;
  coherenceNotes: string;
  keyElements: string[];
}

interface SynthesizeInput {
  originalDna: any;           // analysisResult object
  shifts: Record<string, { keep: boolean; value: string }>;
  creativity: number;         // 1-5
  appliedPattern?: string;    // optional pattern text
}

export async function synthesizeConcept(
  apiKey: string,
  input: SynthesizeInput
): Promise<SynthesizedConcept[]>
```

**Model:** `gemini-2.5-pro` (strong reasoning for concept creation — confirmed in PROJECT.md)

**Prompt design:**
1. System context: "You are a Print-on-Demand design strategist. Create 3 distinct concept options for a new design."
2. Include original DNA (visual_dna + buyer_dna) from `input.originalDna`
3. For each dimension (S, H, I, F, T, B):
   - If `keep=true`: "PRESERVE the original [dimension]: [value from originalDna]"
   - If `keep=false` and value provided: "CHANGE [dimension] to: [user value]"
   - If `keep=false` and empty: "REIMAGINE [dimension] freely"
4. Include creativity level with semantic meaning:
   - 1: "Stay very close to original — subtle refinements only"
   - 2: "Keep the spirit, reinterpret elements freely"
   - 3: "Recognizable roots but new creative direction"
   - 4: "Loose inspiration — create something substantially new"
   - 5: "Radical departure — keep only the emotional core"
5. Include applied pattern if exists
6. **CRITICAL POD constraints in prompt:**
   - "All concepts MUST be POD-ready: flat illustration style, white/transparent background, no 3D effects, no shadows, no gradients in background, print-ready isolation, bold decorative typography"
   - "Designs must work printed on t-shirts, hoodies, mugs — clean isolation, no bleed"
7. Request 3 concepts as JSON array of SynthesizedConcept objects

**Config:** `responseMimeType: "application/json"`

Parse response, validate it's an array of 3, clean markdown code fences if present (reuse existing pattern from analyzeDesign).
  </action>
  <verify>
Add temporary test at bottom of file (comment out after verify):
```typescript
// Verify: synthesizeConcept is exported and has correct signature
// typeof synthesizeConcept === 'function'
```
`npm run build` passes with the new function.
  </verify>
  <done>
synthesizeConcept() exported from api.ts, accepts SynthesizeInput, returns Promise<SynthesizedConcept[]> (array of 3), uses gemini-2.5-pro, POD constraints embedded in synthesis prompt.
  </done>
</task>

<task type="auto">
  <name>Task 2: Refactor generateArtwork() to multimodal + dynamic aspect ratio</name>
  <files>app/src/api.ts</files>
  <action>
Refactor the existing `generateDesignImage()` function. **Rename to `generateArtwork()`** for consistency with the new flow.

New signature:
```typescript
interface GenerateArtworkInput {
  concept: SynthesizedConcept;  // selected concept
  originalImage: string;        // base64 data URL
  originalMimeType: string;     // e.g., "image/png"
  aspectRatio: string;          // e.g., "1:1", "4:5", "16:9", "9:16", "3:4", "4:3"
  creativity: number;           // 1-5, determines how strongly to reference original image
}

export async function generateArtwork(
  apiKey: string,
  input: GenerateArtworkInput
): Promise<string>  // returns base64 data URL
```

**Model:** `gemini-2.5-flash-image` (same as current)

**Multimodal prompt construction:**
1. Extract base64 data from `input.originalImage` (split on comma for data URL prefix)
2. Build prompt text from concept:
   - "Create a design based on this concept: [concept.title]"
   - "[concept.description]"
   - "Visual direction: [concept.visualDirection]"
   - "Target buyer: [concept.targetBuyer]"
3. **Creativity-driven image role instruction:**
   - Level 1-2: "Use the provided image as a STRONG REFERENCE. The new design should closely resemble the original in style and composition."
   - Level 3: "Use the provided image as a STYLE REFERENCE. Draw inspiration from its visual language but create a distinctly new design."
   - Level 4-5: "The provided image is for CONTEXT ONLY. Create a substantially different design that shares only the emotional essence."
4. Send as multimodal content: [inlineData (image), text (prompt)]

**Config:**
```typescript
config: {
  imageConfig: {
    aspectRatio: input.aspectRatio,
    imageSize: "1K"
  }
}
```

**Keep existing response parsing** — extract inlineData from candidates.

**Do NOT delete the old `generateDesignImage` yet** — keep it but add a `@deprecated` JSDoc comment. CreativeStudio.tsx still imports it; Plan 02 will switch the import.
  </action>
  <verify>
`npm run build` passes. Both `generateArtwork` and `generateDesignImage` (deprecated) are exported.
  </verify>
  <done>
generateArtwork() exported, accepts multimodal input (concept + original image + aspect ratio + creativity), uses gemini-2.5-flash-image, creativity level determines image reference strength. Old generateDesignImage marked deprecated.
  </done>
</task>

</tasks>

<verification>
- `npm run build` passes clean
- api.ts exports: analyzeDesign, generateDesignImage (deprecated), generateArtwork, synthesizeConcept, analyzeBatch, analyzeBuyerFit
- SynthesizedConcept interface is exported
- No runtime errors (type-only changes, no UI wiring yet)
</verification>

<success_criteria>
- synthesizeConcept() returns 3 concepts with title, description, visualDirection, targetBuyer, coherenceNotes, keyElements[]
- generateArtwork() sends original image + concept text + dynamic aspect ratio to Gemini
- POD constraints embedded in synthesis prompt (not generation prompt)
- Creativity level maps to image role semantics in generation prompt
- Build passes clean
</success_criteria>

<output>
After completion, create `.planning/phases/7B-synthesis-pod-generation/7B-01-SUMMARY.md`
</output>
