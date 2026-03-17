/**
 * analyzeDesign — Single design deep analysis.
 * Moved from app/src/api.ts (lines 254-322).
 *
 * Note: Image arrives already resized from frontend (resizeImageIfNeeded
 * uses Canvas API which is browser-only).
 */

import type { GoogleGenAI } from '@google/genai';
import { cleanJsonResponse } from './helpers.js';

export async function analyzeDesign(
  ai: GoogleGenAI,
  imageData: string,
  mimeType: string,
): Promise<any> {
  const model = 'gemini-2.5-pro';

  const analysisPrompt = `Analyze this design completely. Output ONLY a JSON object with this exact structure:
{
  "visual_dna": {
    "summary": "2-3 sentences max",
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
  },
  "buyer_dna": {
    "persona": {"age_range": "25-35", "gender_lean": "string", "interests": ["string"], "values": ["string"], "lifestyle": "string", "spending_mindset": "string", "online_communities": ["string"]},
    "identity_signals": {"primary": "string", "message_to_world": "string", "tribe": "string", "aesthetic_identity": "string"},
    "emotional_triggers": {"primary_emotion": "string", "trigger_description": "string (2-3 sentences)", "secondary_emotions": ["string"], "emotional_arc": "string"},
    "occasion_timing": {"best_seasons": ["string"], "events": ["string"], "mood_triggers": "string", "gift_potential": {"score": "string", "who_buys_for_whom": "string"}, "evergreen_vs_viral": "string", "wear_context": "string"},
    "made_for_me_decisions": [{"decision": "Analytical title", "why_it_works": "Conversational explanation", "what_would_break": "Specific loss explanation"}]
  }
}

Important Rules:
- visual_dna.color.palette must have exactly 5 colors. Proportions sum to 100 following a dominant-secondary-accent pattern.
- buyer_dna.made_for_me_decisions must have exactly 3-5 items.
- Commit to one primary buyer profile. If design is ambiguous, add a brief note in lifestyle.`;

  // Strip data URI prefix if present (e.g. "data:image/png;base64,...")
  const base64Data = imageData.includes(',') ? imageData.split(',')[1] : imageData;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType,
          },
        },
        {
          text: analysisPrompt,
        },
      ],
    },
    config: {
      responseMimeType: 'application/json',
    },
  });

  const text = response.text;
  if (!text) throw new Error('No response from Gemini');
  return JSON.parse(cleanJsonResponse(text));
}
