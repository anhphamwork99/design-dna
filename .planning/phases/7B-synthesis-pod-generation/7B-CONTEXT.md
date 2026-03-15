# Phase 7B: Concept Synthesis + POD-Ready Generation — Context

**Gathered:** 2026-03-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement mandatory AI synthesis step (concept creation) + multimodal artwork generation with POD quality enforcement inside the existing Creative Studio 3-panel layout.

**What this phase delivers:**
1. `synthesizeConcept()` API — takes original DNA + shifts + creativity + patterns → returns 3 concepts
2. Concept review carousel UI in center canvas
3. `generateArtwork()` refactored to multimodal (text + original image)
4. Aspect ratio selection
5. POD quality enforcement via synthesis prompt
6. Download with concept-derived filename

**What this phase does NOT deliver:**
- Chat-based refinement (deferred)
- Pattern Library (Phase 7C)
- History/persistence (Phase 8)

</domain>

<decisions>
## Implementation Decisions

### Concept Synthesis Flow
- **3 concepts by default** — `synthesizeConcept()` returns 3 distinct concepts per call
- **Horizontal carousel** in center canvas — user swipes/arrows between concepts, focus 1 at a time
- **No inline edit** — user selects 1 concept or clicks "Regenerate All" to get 3 new ones
- **Rich concept card** — each card displays:
  - Title (AI-generated)
  - Visual Direction (2-3 sentences describing the design approach)
  - Target Buyer (who this concept speaks to)
  - Coherence Notes (why this concept is unified, not a Frankenstein mix)
  - Key Elements chips (e.g., "Watercolor", "Cat motif", "Cool tones") for quick scanning

### Data Flow: Keep/Change → Synthesis → Generation
- Keep/Change toggles and text inputs feed into `synthesizeConcept()`, NOT directly into image generation
- **Keep** = use original DNA value for that dimension in synthesis prompt
- **Change** + text = use user-provided value
- **Change** + empty = AI decides freely (influenced by creativity level)
- Help text under each Change input: "Leave empty to let AI decide"

### Multimodal Generation
- **Creativity level drives image role** in generation prompt:
  - Level 1-2 (Faithful/Inspired): Original image as strong base/reference → output closely resembles original
  - Level 3 (Remixed): Original image as style reference → AI takes inspiration but creates freely
  - Level 4-5 (Original/Radical): Original image as loose context → AI nearly fully free
- **1 artwork per generation** — no batch artwork generation
- After artwork, 3 retry tiers:
  1. **"Regenerate Artwork"** — same concept, generate new artwork
  2. **"Try Different Concept"** — return to carousel, pick different concept (concepts still cached)
  3. **"Start Over"** — generate 3 new concepts from scratch

### POD Quality Enforcement
- **POD constraints live in synthesis prompt only** — concept is already "POD-ready by design"
- Generation prompt just executes the concept + original image, no separate POD constraints layer
- POD rules: flat illustration, white/transparent bg, no 3D/effects, print-ready, clean isolation

### Aspect Ratio
- **Dropdown in left panel** — new "Output Size" section below Applied Patterns
- **Default: 1:1** — user can change before or after concept selection
- **All API-supported ratios** — planner to research exact Gemini API supported ratios
- Aspect ratio affects generation only, NOT concept synthesis

### Download
- **PNG only** — POD standard format
- **Filename from concept title** — `designdna-[concept-title-slug].png`
- Download button in center canvas after artwork generation (existing behavior)

### Chat Refinement
- **Deferred** — not included in Phase 7B
- User iterates via the 3 retry tiers instead (regenerate artwork / try different concept / start over)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `CreativeStudio.tsx` (561 lines) — 3-panel layout with Keep/Change toggles, creativity slider, applied patterns. All left panel controls ready for synthesis input
- `api.ts` — 4 existing functions: `analyzeDesign()`, `generateDesignImage()`, `analyzeBatch()`, `analyzeBuyerFit()`. Generation currently text-only, needs multimodal refactor
- `constructPrompt()` in CreativeStudio — builds text prompt from shifts + creativity. Will be replaced by `synthesizeConcept()` call
- `handleGenerate()` — orchestrates generation + buyer fit scoring. Needs refactor to 2-step flow (synthesis → generation)
- `framer-motion` (motion/react) already imported — available for carousel animations

### Established Patterns
- State management: React `useState` hooks, no external state library
- API pattern: async functions in `api.ts` returning parsed JSON, called from component handlers
- Error handling: try/catch with error state, displayed in center canvas
- Loading states: boolean flags (`isGenerating`), visual feedback in center canvas
- UI tokens: CSS custom properties (bg-bg-surface1, text-text-secondary, border-border-default, etc.)

### Integration Points
- `CreativeStudio` receives props: `analysisResult`, `uploadedImage`, `onNavigate`, `prefilledBrief`, `initialGenMode`
- `uploadedImage.data` — base64 string with original image, needed for multimodal generation
- `analysisResult` — full visual_dna + buyer_dna object, needed for `Keep` values in synthesis
- `generateDesignImage()` in api.ts — currently text-only, hardcoded 1:1/1K. Needs: multimodal input (image parts), dynamic aspect ratio
- Settings modal dispatched via `CustomEvent('open-settings')` — API key stored in `localStorage.designdna_api_key`
- Buyer fit scoring (`analyzeBuyerFit()`) — currently runs after generation, keep this behavior

### New Code Needed
- `synthesizeConcept()` in api.ts — new API function using gemini-2.5-pro, returns 3 SynthesizedConcept objects
- `SynthesizedConcept` interface — title, description, visualDirection, targetBuyer, coherenceNotes, keyElements[]
- Carousel component in center canvas — navigate 3 concept cards
- Refactored `generateDesignImage()` — accept image parts + dynamic aspect ratio
- New center canvas states: concept-loading → concept-review → artwork-loading → artwork-display

</code_context>

<specifics>
## Specific Ideas

- Concept cards should feel premium — match the dark elegant aesthetic of the existing UI
- Key Elements chips on concept cards use the same chip styling as "Your Original" section (bg-bg-surface2, rounded, small text)
- Carousel arrows should be subtle, not jarring — think Google AI Studio concept navigation
- "Regenerate All" should show loading state replacing all 3 cards simultaneously
- Synthesis model: gemini-2.5-pro (strong reasoning for concept creation) — confirmed in PROJECT.md
- Generation model: gemini-2.5-flash-image (multimodal input) — confirmed in PROJECT.md
- POD reference artwork: `.planning/deliverables/reference-pod-artwork/README.md` — flat illustration, white bg, bold typography, character elements, print-ready isolation

</specifics>

<deferred>
## Deferred Ideas

- **Chat-based refinement (F2-10)** — was originally scoped for 7B, user chose to defer. Iteration is handled via the 3 retry tiers for now. Consider as Phase 7B.5 or fold into a future UX enhancement phase.
- **Suggestions/presets for Change inputs** — dropdown suggestions like "Pastel", "Earth tones" for Colors. Currently text input only. Could enhance UX for non-designer users in a future phase.

</deferred>

---

*Phase: 7B-synthesis-pod-generation*
*Context gathered: 2026-03-16*
