# Problem Statement

## Statement

Khi user chọn Make Variants hoặc Explore New Ideas trong Studio, pipeline bắt buộc chạy `analyzeDesign()` (gemini-2.5-pro, ~30s+) trước khi user có thể tương tác với Studio canvas. Thời gian chờ 30s+ tạo trải nghiệm kém — cần giảm cả thời gian thực tế lẫn thời gian cảm nhận mà không giảm chất lượng phân tích.

## 6 Criteria Check

| # | Criterion | Pass? | Evidence |
|---|-----------|-------|----------|
| 1 | Specific — cụ thể, đo lường được | ✅ | 30s+ wait time, đo được from upload → studio ready |
| 2 | Actionable — team có thể hành động | ✅ | Full control over codebase (frontend + backend), model choice |
| 3 | Bounded — phạm vi rõ ràng | ✅ | Chỉ Studio flow (Variations/Explore), không ảnh hưởng Analyze/Compare |
| 4 | Decision-oriented — dẫn đến quyết định | ✅ | Chọn solution approach để implement |
| 5 | Time-bounded — có deadline | ✅ | User đang phản hồi → cần giải quyết sớm |
| 6 | Constraint-aware — hiểu ràng buộc | ✅ | Không giảm quality analysis, giữ architecture principles |

**Result: 6/6 — Problem statement validated.**

## Context

### Current Pipeline (Variations/Explore flow)

```
User picks goal → Upload image → analyzeDesign() [~30s+] → Studio canvas ready
                                       ↓
                              [BLOCKING WAIT — full screen mascot loader]
                                       ↓
                         User configures shifts → synthesizeConcept() → generateArtwork()
```

### Key Data Flow

```
analyzeDesign(image)
  → Model: gemini-2.5-pro
  → Input: image (base64) + analysis prompt
  → Output: { visual_dna, buyer_dna } — ~2-3KB JSON
  → Latency: 30s+ (model thinking + structured output)

synthesizeConcept(analysisResult, shifts, patterns)
  → Model: gemini-2.5-pro
  → Input: Full DNA (text-only, no image) + user shifts + applied pattern
  → Output: 3 SynthesizedConcept[] — ~3KB JSON
  → Uses: ALL of analysisResult (packaged via packageFullDna())

generateArtwork(concept, originalImage)
  → Model: gemini-2.5-flash-image (2 passes)
  → Input: concept text + original image (for style reference)
  → Output: image data URL
  → Uses: concept object + original image (NOT analysisResult directly)
```

### What synthesize actually uses from analysis

`packageFullDna()` uses EVERY field:
- visual_dna: summary, composition, color (palette, harmony, temp, contrast), typography (fonts, hierarchy, text_content), graphics (style, primary, secondary, effects, detail), pod_technical
- buyer_dna: persona, identity_signals, emotional_triggers, occasion_timing, made_for_me_decisions

`DIMENSION_LABELS` per-shift also uses specific DNA fields for PRESERVE/CHANGE/REIMAGINE context.

**Conclusion: synthesis depends on FULL analysis output — cannot skip or truncate analysis.**

## Constraints

1. Analysis quality MUST stay the same — full visual_dna + buyer_dna
2. Architecture principles: original = ground truth, synthesis = mandatory
3. Model: gemini-2.5-pro for analysis (best quality for structured vision+reasoning)
4. Frontend: React SPA, no SSR
5. Backend: Hono API proxy, user's own API key
