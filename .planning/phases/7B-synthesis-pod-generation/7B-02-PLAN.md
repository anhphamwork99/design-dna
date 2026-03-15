---
phase: 7B-synthesis-pod-generation
plan: 02
type: execute
wave: 2
depends_on: [7B-01]
files_modified: [app/src/CreativeStudio.tsx]
autonomous: true
requirements: [F2-06, F2-07, F2-11]

must_haves:
  truths:
    - "Clicking 'Create Concept' calls synthesizeConcept() and shows 3 concept cards in horizontal carousel"
    - "User can navigate between concepts using arrows"
    - "Selecting a concept and clicking 'Generate Artwork' calls generateArtwork() with multimodal input"
    - "After artwork generation, user sees 3 action buttons: Regenerate Artwork, Try Different Concept, Start Over"
    - "Concept cards display title, description, visual direction, target buyer, coherence notes, and key elements chips"
  artifacts:
    - path: "app/src/CreativeStudio.tsx"
      provides: "Concept carousel, artwork flow, retry tiers"
      min_lines: 500
  key_links:
    - from: "app/src/CreativeStudio.tsx"
      to: "app/src/api.ts"
      via: "import { synthesizeConcept, generateArtwork }"
      pattern: "synthesizeConcept|generateArtwork"
---

<objective>
Wire the Creative Studio UI to the new synthesis + generation flow. Replace the current direct-generation flow with: Create Concepts → Review Carousel → Select → Generate Artwork → Retry tiers.

Purpose: This is the core UX change — the 2-step creative flow user experiences.
Output: Updated CreativeStudio.tsx with concept carousel and new generation pipeline.
</objective>

<execution_context>
@.agent/skills/gsd/gsd-execution/execute-plan.md
@.agent/skills/gsd/_gsd-shared/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md
@.planning/phases/7B-synthesis-pod-generation/7B-CONTEXT.md
@.planning/phases/7B-synthesis-pod-generation/7B-01-SUMMARY.md
@app/src/CreativeStudio.tsx
@app/src/api.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Replace generation flow with Concept → Artwork pipeline</name>
  <files>app/src/CreativeStudio.tsx</files>
  <action>
**Refactor the center canvas state machine.** Current states: empty → loading → error/artwork. New states:

```
empty → concept-loading → concept-review → artwork-loading → artwork-display → (retry options)
```

**State changes needed:**

1. **New state variables:**
```typescript
const [concepts, setConcepts] = useState<SynthesizedConcept[]>([]);
const [selectedConceptIndex, setSelectedConceptIndex] = useState(0);
const [carouselIndex, setCarouselIndex] = useState(0);
const [isSynthesizing, setIsSynthesizing] = useState(false);
// Keep existing: isGenerating, showResult, generatedImage, buyerFitScores, error
```

2. **New imports:**
```typescript
import { synthesizeConcept, generateArtwork, analyzeBuyerFit, SynthesizedConcept } from './api';
// Remove: generateDesignImage
import { ArrowLeft, ArrowRight, Download, Sparkles, AlertCircle, X, Settings, Paintbrush, Loader2, RefreshCw, RotateCcw } from 'lucide-react';
```

3. **Replace `handleGenerate` with `handleSynthesize`:**
```typescript
const handleSynthesize = async () => {
  const apiKey = localStorage.getItem('designdna_api_key');
  if (!apiKey) { window.dispatchEvent(new CustomEvent('open-settings')); return; }
  
  setIsSynthesizing(true);
  setError(null);
  setConcepts([]);
  setShowResult(false);
  setGeneratedImage(null);
  
  try {
    const result = await synthesizeConcept(apiKey, {
      originalDna: analysisResult,
      shifts,
      creativity,
      appliedPattern: appliedPattern || undefined,
    });
    setConcepts(result);
    setCarouselIndex(0);
  } catch (err: any) {
    setError(err.message || "Failed to create concepts");
  } finally {
    setIsSynthesizing(false);
  }
};
```

4. **Add `handleGenerateArtwork`:**
```typescript
const handleGenerateArtwork = async () => {
  const apiKey = localStorage.getItem('designdna_api_key');
  if (!apiKey) return;
  
  const selectedConcept = concepts[carouselIndex];
  setIsGenerating(true);
  setError(null);
  
  try {
    const imageBase64 = await generateArtwork(apiKey, {
      concept: selectedConcept,
      originalImage: uploadedImage?.data || '',
      originalMimeType: uploadedImage?.type || 'image/png',
      aspectRatio,  // from new state
      creativity,
    });
    setGeneratedImage(imageBase64);
    setSelectedConceptIndex(carouselIndex);
    
    // Run buyer fit in parallel (fire and forget with state update)
    const prompt = `${selectedConcept.title}: ${selectedConcept.description}. Visual: ${selectedConcept.visualDirection}. Target: ${selectedConcept.targetBuyer}`;
    analyzeBuyerFit(apiKey, prompt).then(setBuyerFitScores).catch(console.error);
    
    setShowResult(true);
  } catch (err: any) {
    setError(err.message || "Failed to generate artwork");
    setShowResult(true);
  } finally {
    setIsGenerating(false);
  }
};
```

5. **Add 3 retry handlers:**
```typescript
// Same concept, new artwork
const handleRegenerateArtwork = () => {
  setShowResult(false);
  setGeneratedImage(null);
  setBuyerFitScores(null);
  handleGenerateArtwork();
};

// Back to concept carousel
const handleTryDifferentConcept = () => {
  setShowResult(false);
  setGeneratedImage(null);
  setBuyerFitScores(null);
  setError(null);
  // concepts are still cached, just show carousel
};

// Generate new concepts from scratch
const handleStartOver = () => {
  setShowResult(false);
  setGeneratedImage(null);
  setBuyerFitScores(null);
  setConcepts([]);
  setError(null);
  // Returns to empty state with "Create Concepts" CTA
};
```

6. **Update `handleDownload` filename:**
```typescript
const handleDownload = () => {
  if (!generatedImage) return;
  const conceptTitle = concepts[selectedConceptIndex]?.title || 'design';
  const slug = conceptTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
  const a = document.createElement('a');
  a.href = generatedImage;
  a.download = `designdna-${slug}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
```

7. **Remove `constructPrompt()`** — no longer needed, replaced by synthesizeConcept().

**Center canvas rendering — new state machine:**

The center canvas `<div>` should render based on these conditions (in order):

```
if (isSynthesizing) → Synthesis loading state ("Creating 3 concepts...")
if (isGenerating) → Artwork loading state ("Generating artwork...")
if (showResult && error) → Error state with retry
if (showResult && generatedImage) → Artwork display + 3 retry buttons + download
if (concepts.length > 0) → Concept carousel with "Generate Artwork" CTA
else → Empty state with "Create Concepts" CTA
```

**Empty state:** Change CTA from "Create Design" to "Create Concepts" (icon: Sparkles). The button calls `handleSynthesize` instead of `handleGenerate`.

**Synthesis loading state:**
```tsx
<div className="flex flex-col items-center justify-center text-center">
  <div className="w-14 h-14 rounded-2xl bg-bg-surface1/80 border border-border-default flex items-center justify-center mb-5">
    <Loader2 className="w-6 h-6 text-accent animate-spin" />
  </div>
  <h2 className="text-[16px] font-semibold mb-1.5">Creating concepts...</h2>
  <p className="text-text-tertiary text-[13px]">AI is synthesizing 3 design directions</p>
</div>
```

**Artwork display — 3 retry buttons below download:**
After [Create New Design] [Download] row, add a secondary row:
```tsx
<div className="flex gap-2 mt-2">
  <button onClick={handleRegenerateArtwork} className="px-3 py-1.5 text-[12px] text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5">
    <RefreshCw className="w-3 h-3" /> Regenerate
  </button>
  <button onClick={handleTryDifferentConcept} className="px-3 py-1.5 text-[12px] text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5">
    <RotateCcw className="w-3 h-3" /> Try Different Concept
  </button>
  <button onClick={handleStartOver} className="px-3 py-1.5 text-[12px] text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5">
    <Sparkles className="w-3 h-3" /> Start Over
  </button>
</div>
```
  </action>
  <verify>
`npm run build` passes. New states render correctly based on state machine.
  </verify>
  <done>
CreativeStudio uses 2-step flow: Create Concepts → Review → Generate Artwork. Three retry tiers available. Download uses concept title. constructPrompt() removed.
  </done>
</task>

<task type="auto">
  <name>Task 2: Build concept carousel + aspect ratio dropdown</name>
  <files>app/src/CreativeStudio.tsx</files>
  <action>
**Add concept carousel to center canvas** (renders when `concepts.length > 0` and `!showResult`):

```tsx
{/* Concept Carousel */}
<div className="flex flex-col items-center justify-center max-w-[520px] w-full">
  {/* Carousel navigation */}
  <div className="flex items-center gap-4 mb-4 text-text-tertiary text-[12px]">
    <span>Concept {carouselIndex + 1} of {concepts.length}</span>
  </div>
  
  {/* Concept card */}
  <motion.div
    key={carouselIndex}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="bg-bg-surface1 border border-border-default rounded-xl p-6 w-full"
  >
    <h3 className="text-[18px] font-semibold mb-3">{concepts[carouselIndex].title}</h3>
    <p className="text-[14px] text-text-secondary mb-4 leading-relaxed">{concepts[carouselIndex].description}</p>
    
    <div className="space-y-3">
      <div>
        <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">Visual Direction</span>
        <p className="text-[13px] text-text-primary mt-1">{concepts[carouselIndex].visualDirection}</p>
      </div>
      <div>
        <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">Target Buyer</span>
        <p className="text-[13px] text-text-primary mt-1">{concepts[carouselIndex].targetBuyer}</p>
      </div>
      <div>
        <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">Why It Works</span>
        <p className="text-[13px] text-text-primary mt-1">{concepts[carouselIndex].coherenceNotes}</p>
      </div>
    </div>
    
    {/* Key Elements chips */}
    <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-border-default/30">
      {concepts[carouselIndex].keyElements.map((el, i) => (
        <span key={i} className="bg-bg-surface2 px-2 py-0.5 rounded text-[11px] text-text-secondary">{el}</span>
      ))}
    </div>
  </motion.div>
  
  {/* Arrow navigation */}
  <div className="flex items-center gap-3 mt-4">
    <button
      onClick={() => setCarouselIndex(i => Math.max(0, i - 1))}
      disabled={carouselIndex === 0}
      className="p-2 rounded-lg bg-bg-surface1 border border-border-default text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
    </button>
    
    {/* Dots indicator */}
    <div className="flex gap-1.5">
      {concepts.map((_, i) => (
        <button
          key={i}
          onClick={() => setCarouselIndex(i)}
          className={`w-2 h-2 rounded-full transition-colors ${i === carouselIndex ? 'bg-accent' : 'bg-bg-surface2'}`}
        />
      ))}
    </div>
    
    <button
      onClick={() => setCarouselIndex(i => Math.min(concepts.length - 1, i + 1))}
      disabled={carouselIndex === concepts.length - 1}
      className="p-2 rounded-lg bg-bg-surface1 border border-border-default text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <ArrowRight className="w-4 h-4" />
    </button>
  </div>
  
  {/* Action buttons */}
  <div className="flex gap-3 mt-5">
    <button
      onClick={handleGenerateArtwork}
      className="px-6 py-2.5 ai-gradient text-white rounded-lg font-medium text-[14px] shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2"
    >
      <Paintbrush className="w-4 h-4" /> Generate Artwork
    </button>
    <button
      onClick={handleStartOver}
      className="px-4 py-2.5 bg-bg-surface1 border border-border-default rounded-lg text-[13px] font-medium hover:bg-bg-surface2 transition-colors flex items-center gap-2"
    >
      <RefreshCw className="w-3.5 h-3.5" /> Regenerate All
    </button>
  </div>
</div>
```

**Add aspect ratio dropdown to LEFT PANEL** — new section below "Applied Patterns":

```tsx
{/* ── Output Size ── */}
<div className="bg-bg-surface1 p-4 rounded-xl border border-border-default">
  <div className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-3">
    Output Size
  </div>
  <select
    value={aspectRatio}
    onChange={(e) => setAspectRatio(e.target.value)}
    className="w-full bg-bg-surface2 border border-border-default rounded-lg px-3 py-2 text-[13px] text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all appearance-none cursor-pointer"
    style={{ backgroundImage: 'url("data:image/svg+xml,...chevron-down-svg...")' }}
  >
    <option value="1:1">1:1 — Square</option>
    <option value="4:5">4:5 — Portrait</option>
    <option value="3:4">3:4 — Portrait</option>
    <option value="4:3">4:3 — Landscape</option>
    <option value="16:9">16:9 — Wide</option>
    <option value="9:16">9:16 — Tall</option>
  </select>
</div>
```

**Add state for aspect ratio:**
```typescript
const [aspectRatio, setAspectRatio] = useState('1:1');
```

**Add help text under Change inputs:**
When a dimension is set to Change and the text input appears, add a small help text below:
```tsx
{!state.keep && (
  <>
    <input ... />
    <p className="text-[10px] text-text-tertiary mt-1">Leave empty to let AI decide</p>
  </>
)}
```
  </action>
  <verify>
`npm run build` passes. Concept carousel renders with navigation, concept cards show all fields, aspect ratio dropdown appears in left panel.
  </verify>
  <done>
Concept carousel with horizontal navigation (arrows + dots), rich concept cards (title, description, visual direction, target buyer, coherence notes, key elements chips), aspect ratio dropdown in left panel (all API-supported ratios), help text on Change inputs.
  </done>
</task>

</tasks>

<verification>
- `npm run build` passes clean
- Full flow works: Configure controls → Create Concepts → Browse carousel → Select concept → Generate Artwork → Retry / Download
- Concept cards display all 5 fields + key elements chips
- Aspect ratio dropdown visible in left panel with 6 options
- Download filename derived from concept title
- 3 retry tiers work: Regenerate Artwork, Try Different Concept, Start Over
- Help text "Leave empty to let AI decide" visible on Change inputs
</verification>

<success_criteria>
- 2-step flow: concepts first, artwork second
- 3 concepts in horizontal carousel with arrows + dots
- Rich concept card with all specified fields
- Multimodal generation using original image + selected concept
- 3 retry tiers functional
- Aspect ratio in left panel dropdown
- PNG download with concept-title filename
- Build passes clean
</success_criteria>

<output>
After completion, create `.planning/phases/7B-synthesis-pod-generation/7B-02-SUMMARY.md`
</output>
