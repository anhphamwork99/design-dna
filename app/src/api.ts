import { GoogleGenAI } from "@google/genai";

// ── Types ──────────────────────────────────────────────────────────

export interface SynthesizedConcept {
  title: string;
  description: string;
  visualDirection: string;
  targetBuyer: string;
  coherenceNotes: string;
  keyElements: string[];
}

export interface SynthesizeInput {
  originalDna: any;
  shifts: Record<string, { keep: boolean; value: string }>;
  creativity: number;
  appliedPattern?: string;
}

export interface GenerateArtworkInput {
  concept: SynthesizedConcept;
  originalImage: string;
  originalMimeType: string;
  aspectRatio: string;
  creativity: number;
}

// ── Helpers ────────────────────────────────────────────────────────

function cleanJsonResponse(text: string): string {
  let clean = text.trim();
  if (clean.startsWith('```json')) clean = clean.substring(7);
  else if (clean.startsWith('```')) clean = clean.substring(3);
  if (clean.endsWith('```')) clean = clean.substring(0, clean.length - 3);
  return clean.trim();
}

const CREATIVITY_SYNTHESIS_LABELS: Record<number, string> = {
  1: "Stay very close to original — subtle refinements only",
  2: "Keep the spirit, reinterpret elements freely",
  3: "Recognizable roots but new creative direction",
  4: "Loose inspiration — create something substantially new",
  5: "Radical departure — keep only the emotional core",
};

const CREATIVITY_IMAGE_ROLES: Record<number, string> = {
  1: "Use the provided image as a STRONG REFERENCE. The new design should closely resemble the original in style and composition.",
  2: "Use the provided image as a STRONG REFERENCE. Keep the visual language but allow creative reinterpretation of elements.",
  3: "Use the provided image as a STYLE REFERENCE. Draw inspiration from its visual language but create a distinctly new design.",
  4: "The provided image is for CONTEXT ONLY. Create a substantially different design that shares only thematic elements.",
  5: "The provided image is for CONTEXT ONLY. Create a completely new design — only the emotional essence should carry over.",
};

const DIMENSION_LABELS: Record<string, { name: string; dnaPath: (dna: any) => string }> = {
  S: { name: 'Visual Style', dnaPath: (d) => d?.visual_dna?.graphics?.style || 'N/A' },
  H: { name: 'Colors', dnaPath: (d) => d?.visual_dna?.color?.harmony || 'N/A' },
  I: { name: 'Graphics', dnaPath: (d) => d?.visual_dna?.graphics?.primary_element || 'N/A' },
  F: { name: 'Typography', dnaPath: (d) => d?.visual_dna?.typography?.fonts?.[0]?.classification || 'N/A' },
  T: { name: 'Theme & Mood', dnaPath: (d) => d?.buyer_dna?.emotional_triggers?.primary_emotion || 'N/A' },
  B: { name: 'Audience', dnaPath: (d) => `${d?.buyer_dna?.persona?.age_range || 'N/A'}, ${d?.buyer_dna?.identity_signals?.tribe || 'N/A'}` },
};

// ── analyzeDesign ──────────────────────────────────────────────────

export async function analyzeDesign(
  base64Image: string,
  mimeType: string,
  apiKey: string
) {
  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3.1-pro-preview';

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
      "hierarchy_levels": "integer", "suggested_google_fonts": ["string"]
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

  const prompt = analysisPrompt;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image.split(',')[1],
            mimeType
          }
        },
        {
          text: prompt
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  return JSON.parse(cleanJsonResponse(text));
}

// ── synthesizeConcept ──────────────────────────────────────────────

export async function synthesizeConcept(
  apiKey: string,
  input: SynthesizeInput
): Promise<SynthesizedConcept[]> {
  const ai = new GoogleGenAI({ apiKey });

  // Build dimension directives
  const dimensionDirectives = Object.entries(DIMENSION_LABELS).map(([key, config]) => {
    const shift = input.shifts[key];
    if (!shift) return '';
    if (shift.keep) {
      return `- PRESERVE ${config.name}: ${config.dnaPath(input.originalDna)}`;
    }
    if (shift.value) {
      return `- CHANGE ${config.name} to: ${shift.value}`;
    }
    return `- REIMAGINE ${config.name} freely`;
  }).filter(Boolean).join('\n');

  const creativityInstruction = CREATIVITY_SYNTHESIS_LABELS[input.creativity] || CREATIVITY_SYNTHESIS_LABELS[3];

  const synthesisPrompt = `You are a Print-on-Demand design strategist. Create exactly 3 distinct concept options for a new design.

## Original Design DNA
Visual: ${JSON.stringify(input.originalDna?.visual_dna?.summary || 'N/A')}
Style: ${input.originalDna?.visual_dna?.graphics?.style || 'N/A'}
Colors: ${input.originalDna?.visual_dna?.color?.harmony || 'N/A'} (${input.originalDna?.visual_dna?.color?.temperature || 'N/A'})
Primary Element: ${input.originalDna?.visual_dna?.graphics?.primary_element || 'N/A'}
Typography: ${input.originalDna?.visual_dna?.typography?.fonts?.[0]?.classification || 'N/A'}
Buyer Tribe: ${input.originalDna?.buyer_dna?.identity_signals?.tribe || 'N/A'}
Primary Emotion: ${input.originalDna?.buyer_dna?.emotional_triggers?.primary_emotion || 'N/A'}
Persona: ${input.originalDna?.buyer_dna?.persona?.age_range || 'N/A'}, ${input.originalDna?.buyer_dna?.persona?.lifestyle || 'N/A'}

## User's Design Directions
${dimensionDirectives}

## Creativity Level: ${input.creativity}/5
${creativityInstruction}

${input.appliedPattern ? `## Applied Pattern/Inspiration\n${input.appliedPattern}\n` : ''}
## CRITICAL: POD Production Constraints
All concepts MUST be POD-ready:
- Flat illustration style — clean lines, cartoon/hand-drawn aesthetic
- White or transparent background — NO gradients, textures, or scenes in background
- Bold decorative typography — mixed fonts, playful lettering
- Print-ready isolation — artwork floats cleanly, easy to place on garments
- No 3D effects, shadows, lighting, glass morphism, or photorealistic rendering
- Designs must work printed on t-shirts, hoodies, mugs

## Output
Return a JSON array of exactly 3 concept objects. Each concept must offer a DISTINCT creative direction — do not make 3 similar variations.

Each concept object:
{
  "title": "Short catchy concept name (3-5 words)",
  "description": "2-3 sentences describing the overall design concept",
  "visualDirection": "Specific visual instructions: illustration style, composition, key visual elements",
  "targetBuyer": "Who would buy this — age, interests, tribe, occasion",
  "coherenceNotes": "Why this concept works as a unified whole — what ties the elements together",
  "keyElements": ["element1", "element2", "element3", "element4"]
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: { parts: [{ text: synthesisPrompt }] },
    config: { responseMimeType: "application/json" },
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");

  const parsed = JSON.parse(cleanJsonResponse(text));
  const concepts: SynthesizedConcept[] = Array.isArray(parsed) ? parsed : parsed.concepts || [];

  if (concepts.length === 0) throw new Error("No concepts generated");
  return concepts.slice(0, 3);
}

// ── generateArtwork (multimodal) ───────────────────────────────────

export async function generateArtwork(
  apiKey: string,
  input: GenerateArtworkInput
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });

  const imageRole = CREATIVITY_IMAGE_ROLES[input.creativity] || CREATIVITY_IMAGE_ROLES[3];

  const prompt = `Create a Print-on-Demand ready design based on this concept.

## Concept: ${input.concept.title}
${input.concept.description}

## Visual Direction
${input.concept.visualDirection}

## Target Buyer
${input.concept.targetBuyer}

## Image Reference Instruction
${imageRole}

Generate exactly ONE image. The design must be print-ready for garments.`;

  const parts: any[] = [];

  // Add original image as multimodal input
  if (input.originalImage) {
    const imageData = input.originalImage.includes(',')
      ? input.originalImage.split(',')[1]
      : input.originalImage;
    parts.push({
      inlineData: {
        data: imageData,
        mimeType: input.originalMimeType || 'image/png',
      },
    });
  }

  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts },
    config: {
      imageConfig: {
        aspectRatio: input.aspectRatio as any,
        imageSize: "1K",
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image generated by Gemini");
}

// ── generateDesignImage (DEPRECATED) ───────────────────────────────
/** @deprecated Use generateArtwork() instead — supports multimodal input + dynamic aspect ratio */
export async function generateDesignImage(
  apiKey: string,
  prompt: string
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: "1K"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image generated by Gemini");
}

export async function analyzeBatch(
  images: { data: string; name: string; type: string }[],
  apiKey: string
) {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Act as a Print-on-Demand merchandising analyst. Analyze these successful designs as a batch to find their shared visual and buyer psychological patterns. Output ONLY a valid JSON object with EXACTLY this structure, no markdown formatting outside the JSON: 
  {
    "batch_analysis": {
      "visual_patterns": {
        "common_colors": "string describing shared color patterns across designs",
        "typography_trends": "string describing shared typography patterns",
        "composition_patterns": "string describing shared layout/composition patterns",
        "illustration_styles": "string describing shared illustration/graphic styles"
      },
      "buyer_overlap": {
        "shared_persona": "string",
        "shared_identity": "string",
        "shared_emotion": "string",
        "shared_occasion": "string"
      },
      "made_for_me_patterns": [ "string", "string" ],
      "specificity_ladder": {
        "generic": "string",
        "niche": "string",
        "hyper_niche": "string"
      },
      "winning_formula": {
        "keep": ["string array of elements that work well and should be kept"],
        "experiment_with": ["string array of elements that could be varied or improved"],
        "avoid": ["string array of elements or approaches to avoid"],
        "summary": "string",
        "suggested_brief": "string"
      }
    }
  }`;

  const parts: any[] = images.map(img => ({
    inlineData: {
      data: img.data.split(',')[1],
      mimeType: img.type
    }
  }));
  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: { parts },
    config: {
      responseMimeType: "application/json",
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  return JSON.parse(cleanJsonResponse(text));
}

export async function analyzeBuyerFit(
  apiKey: string,
  prompt: string
): Promise<any> {
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          text: `Evaluate how well this design concept matches the target buyer. Score the following out of 100: buyer_match, emotion_match, originality. And a made_for_me_signal_count out of 5. Return ONLY a JSON object with these exactly 4 integer keys.\n\nDesign Concept:\n${prompt}`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  return JSON.parse(cleanJsonResponse(text));
}
