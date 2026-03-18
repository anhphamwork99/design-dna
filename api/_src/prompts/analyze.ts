/**
 * analyzeDesign — Parallel dual-model analysis.
 *
 * Splits the analysis into two concurrent Gemini calls:
 *   1. Visual DNA  → gemini-2.5-flash  (fast, ~5-10s)
 *   2. Buyer DNA   → gemini-2.5-pro    (deep reasoning, ~20s)
 *
 * Both run in parallel via Promise.all(), so total time ≈ max(flash, pro) ≈ 20s
 * instead of a single pro call doing both (~30s+).
 */

import type { GoogleGenAI } from '@google/genai';
import { cleanJsonResponse } from './helpers.js';

// ── Visual DNA (Flash) ─────────────────────────────────────────────

const VISUAL_DNA_PROMPT = `Analyze this design's VISUAL properties. Output ONLY a JSON object with this exact structure:
{
  "visual_dna": {
    "summary": "2-3 sentences max describing the overall visual style",
    "composition": {"grid_type": "string", "symmetry": "string", "focal_point": "string", "visual_flow": "string", "density": "string"},
    "color": {
      "palette": [{"hex": "#HEX", "name": "string", "role": "Dominant/Secondary/Accent", "proportion": "integer proportion summing to 100"}],
      "harmony": "string", "contrast": "string", "temperature": "string"
    },
    "typography": {
      "fonts": [{"classification": "string", "weight": "string", "case": "string", "role": "string"}],
      "hierarchy_levels": "integer", "suggested_google_fonts": ["string"],
      "text_content": {"primary": "The main quote/slogan/text on the design (exact wording)", "secondary": "Any secondary text (exact wording, empty string if none)"}
    },
    "graphics": {"style": "string", "primary_element": "string", "secondary_elements": ["string"], "effects": ["string"], "detail_level": "string"},
    "pod_technical": {"best_print_method": "string", "suitable_products": ["string"], "recommended_garment_colors": [{"name": "string", "hex": "#HEX"}], "scalability": "string"}
  }
}

Important Rules:
- visual_dna.color.palette must have exactly 5 colors. Proportions sum to 100 following a dominant-secondary-accent pattern.
- Focus ONLY on observable visual properties — do NOT infer buyer psychology.`;

// ── Buyer DNA (Pro) ────────────────────────────────────────────────

const BUYER_DNA_PROMPT = `Analyze this design to understand WHO would buy it and WHY. Focus on buyer psychology, identity, and emotional triggers. Output ONLY a JSON object with this exact structure:
{
  "buyer_dna": {
    "persona": {"age_range": "25-35", "gender_lean": "string", "interests": ["string"], "values": ["string"], "lifestyle": "string", "spending_mindset": "string", "online_communities": ["string"]},
    "identity_signals": {"primary": "string", "message_to_world": "string", "tribe": "string", "aesthetic_identity": "string"},
    "emotional_triggers": {"primary_emotion": "string", "trigger_description": "string (2-3 sentences)", "secondary_emotions": ["string"], "emotional_arc": "string"},
    "occasion_timing": {"best_seasons": ["string"], "events": ["string"], "mood_triggers": "string", "gift_potential": {"score": "string", "who_buys_for_whom": "string"}, "evergreen_vs_viral": "string", "wear_context": "string"},
    "made_for_me_decisions": [{"decision": "Analytical title", "why_it_works": "Conversational explanation", "what_would_break": "Specific loss explanation"}]
  }
}

Important Rules:
- made_for_me_decisions must have exactly 3-5 items.
- Commit to one primary buyer profile. If design is ambiguous, add a brief note in lifestyle.
- Study the design's visual style, colors, text content, and imagery to infer buyer psychology — but output ONLY buyer_dna, not visual analysis.`;

// ── Shared helpers ─────────────────────────────────────────────────

function buildImageParts(imageData: string, mimeType: string) {
  const base64Data = imageData.includes(',') ? imageData.split(',')[1] : imageData;
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
}

async function callGemini(
  ai: GoogleGenAI,
  model: string,
  imageData: string,
  mimeType: string,
  prompt: string,
): Promise<any> {
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        buildImageParts(imageData, mimeType),
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: 'application/json',
    },
  });

  const text = response.text;
  if (!text) throw new Error(`No response from ${model}`);
  return JSON.parse(cleanJsonResponse(text));
}

// ── Main export ────────────────────────────────────────────────────

export async function analyzeDesign(
  ai: GoogleGenAI,
  imageData: string,
  mimeType: string,
): Promise<any> {
  const t0 = Date.now();

  // Fire both in parallel — Flash for visual, Pro for buyer
  const [visualResult, buyerResult] = await Promise.all([
    callGemini(ai, 'gemini-2.5-flash', imageData, mimeType, VISUAL_DNA_PROMPT)
      .then(r => { console.log(`  ⚡ Visual DNA (flash): ${Date.now() - t0}ms`); return r; }),
    callGemini(ai, 'gemini-2.5-pro', imageData, mimeType, BUYER_DNA_PROMPT)
      .then(r => { console.log(`  🧠 Buyer DNA (pro): ${Date.now() - t0}ms`); return r; }),
  ]);

  console.log(`  ✅ Total analysis: ${Date.now() - t0}ms`);

  // Merge into unified DNA object
  return {
    visual_dna: visualResult.visual_dna,
    buyer_dna: buyerResult.buyer_dna,
  };
}
