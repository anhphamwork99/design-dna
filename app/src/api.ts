import { GoogleGenAI } from "@google/genai";

// ── Types ──────────────────────────────────────────────────────────

export interface SynthesizedConcept {
  title: string;
  description: string;
  visualDirection: string;
  targetBuyer: string;
  coherenceNotes: string;
  keyElements: string[];
  // Enriched fields (Phase 7B.1)
  suggestedText: {
    primary: string;      // Main quote/slogan ON the design
    secondary?: string;   // Tagline or subtitle
    textStyle: string;    // "bold hand-lettered" / "clean sans-serif" etc.
    textLayout?: string;  // "primary arched above, secondary below" etc.
  };
  colorPalette: Array<{
    hex: string;          // "#1E3A5F"
    name: string;         // "Deep Ocean"
    role: string;         // "Dominant" | "Secondary" | "Accent"
  }>;
  madeForMeHook: string; // Why buyer feels "this was made for ME"
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

// ── Creativity: Fidelity Gradient ──────────────────────────────────
// Creativity controls HOW STRICTLY each dimension is followed (not how much DNA to send)

const CREATIVITY_FIDELITY: Record<number, string> = {
  1: `Fidelity: VERY HIGH.
KEEP dimensions → must feel recognizably the same (same palette hex, same typography, same composition structure).
CHANGE dimensions → follow user direction closely, minimal artistic license.
REIMAGINE dimensions → vary within the same family (e.g., still earthy tones, still similar style).`,

  2: `Fidelity: HIGH.
KEEP dimensions → same visual language, can vary details (similar palette, same style family).
CHANGE dimensions → follow user direction, allow creative interpretation.
REIMAGINE dimensions → different but in the same creative neighborhood.`,

  3: `Fidelity: MODERATE.
KEEP dimensions → maintain the feeling/essence, execution can differ significantly.
CHANGE dimensions → user direction as starting point, push it further.
REIMAGINE dimensions → genuinely new approach, only loosely inspired by original.`,

  4: `Fidelity: LOW.
KEEP dimensions → vague echo of the original at most.
CHANGE dimensions → user direction as loose seed, interpret freely.
REIMAGINE dimensions → complete freedom, any direction.`,

  5: `Fidelity: MINIMAL.
KEEP dimensions → thematic whisper only, no visual resemblance needed.
CHANGE dimensions → user keywords as loose inspiration.
REIMAGINE dimensions → absolute creative freedom, surprise the user.`,
};

const CREATIVITY_IMAGE_ROLES: Record<number, string> = {
  1: "Use the provided image as a STRONG REFERENCE. The new design should closely resemble the original in style and composition.",
  2: "Use the provided image as a STRONG REFERENCE. Keep the visual language but allow creative reinterpretation of elements.",
  3: "Use the provided image as a STYLE REFERENCE. Draw inspiration from its visual language but create a distinctly new design.",
  4: "The provided image is for CONTEXT ONLY. Create a substantially different design that shares only thematic elements.",
  5: "The provided image is for CONTEXT ONLY. Create a completely new design — only the emotional essence should carry over.",
};

// ── Dimension Labels with Rich DNA Context ─────────────────────────

const DIMENSION_LABELS: Record<string, {
  name: string;
  richContext: (dna: any) => string;
  shortLabel: (dna: any) => string;
}> = {
  S: {
    name: 'Visual Style',
    richContext: (d) => `Style: ${d?.visual_dna?.graphics?.style || 'N/A'}, Primary element: ${d?.visual_dna?.graphics?.primary_element || 'N/A'}, Secondary: ${(d?.visual_dna?.graphics?.secondary_elements || []).join(', ') || 'none'}, Detail level: ${d?.visual_dna?.graphics?.detail_level || 'N/A'}, Effects: ${(d?.visual_dna?.graphics?.effects || []).join(', ') || 'none'}`,
    shortLabel: (d) => d?.visual_dna?.graphics?.style || 'N/A',
  },
  H: {
    name: 'Colors',
    richContext: (d) => {
      const palette = (d?.visual_dna?.color?.palette || []).map((c: any) => `${c.name} ${c.hex} (${c.role}, ${c.proportion}%)`).join(', ');
      return `Harmony: ${d?.visual_dna?.color?.harmony || 'N/A'}, Temperature: ${d?.visual_dna?.color?.temperature || 'N/A'}, Contrast: ${d?.visual_dna?.color?.contrast || 'N/A'}, Palette: [${palette}]`;
    },
    shortLabel: (d) => d?.visual_dna?.color?.harmony || 'N/A',
  },
  I: {
    name: 'Graphics',
    richContext: (d) => `Primary: ${d?.visual_dna?.graphics?.primary_element || 'N/A'}, Secondary: ${(d?.visual_dna?.graphics?.secondary_elements || []).join(', ') || 'none'}, Effects: ${(d?.visual_dna?.graphics?.effects || []).join(', ') || 'none'}`,
    shortLabel: (d) => d?.visual_dna?.graphics?.primary_element || 'N/A',
  },
  F: {
    name: 'Typography',
    richContext: (d) => {
      const fonts = (d?.visual_dna?.typography?.fonts || []).map((f: any) => `${f.classification} ${f.weight} ${f.case} (${f.role})`).join(', ');
      return `Fonts: [${fonts}], Hierarchy levels: ${d?.visual_dna?.typography?.hierarchy_levels || 'N/A'}, Suggested Google Fonts: ${(d?.visual_dna?.typography?.suggested_google_fonts || []).join(', ') || 'N/A'}`;
    },
    shortLabel: (d) => d?.visual_dna?.typography?.fonts?.[0]?.classification || 'N/A',
  },
  T: {
    name: 'Theme & Mood',
    richContext: (d) => `Primary emotion: ${d?.buyer_dna?.emotional_triggers?.primary_emotion || 'N/A'}, Trigger: ${d?.buyer_dna?.emotional_triggers?.trigger_description || 'N/A'}, Secondary: ${(d?.buyer_dna?.emotional_triggers?.secondary_emotions || []).join(', ') || 'none'}, Arc: ${d?.buyer_dna?.emotional_triggers?.emotional_arc || 'N/A'}`,
    shortLabel: (d) => d?.buyer_dna?.emotional_triggers?.primary_emotion || 'N/A',
  },
  B: {
    name: 'Audience',
    richContext: (d) => `Tribe: ${d?.buyer_dna?.identity_signals?.tribe || 'N/A'}, Age: ${d?.buyer_dna?.persona?.age_range || 'N/A'}, Interests: ${(d?.buyer_dna?.persona?.interests || []).join(', ') || 'N/A'}, Values: ${(d?.buyer_dna?.persona?.values || []).join(', ') || 'N/A'}, Identity message: "${d?.buyer_dna?.identity_signals?.message_to_world || 'N/A'}", Lifestyle: ${d?.buyer_dna?.persona?.lifestyle || 'N/A'}`,
    shortLabel: (d) => `${d?.buyer_dna?.persona?.age_range || 'N/A'}, ${d?.buyer_dna?.identity_signals?.tribe || 'N/A'}`,
  },
};

// ── Full DNA Packager ──────────────────────────────────────────────
// Always sends complete DNA to synthesis model — creativity controls fidelity, not exposure

function packageFullDna(dna: any): string {
  if (!dna) return 'No DNA available.';

  const v = dna.visual_dna || {};
  const b = dna.buyer_dna || {};

  const paletteStr = (v.color?.palette || []).map((c: any) =>
    `${c.name} ${c.hex} (${c.role}, ${c.proportion}%)`
  ).join(', ');

  const fontsStr = (v.typography?.fonts || []).map((f: any) =>
    `${f.classification} ${f.weight} ${f.case} (${f.role})`
  ).join(', ');

  const garmentColorsStr = (v.pod_technical?.recommended_garment_colors || []).map((c: any) =>
    `${c.name} ${c.hex}`
  ).join(', ');

  const madeForMeStr = (b.made_for_me_decisions || []).map((d: any) =>
    `• ${d.decision}: ${d.why_it_works}`
  ).join('\n');

  return `### Visual DNA
Summary: ${v.summary || 'N/A'}
Composition: ${v.composition?.grid_type || 'N/A'}, ${v.composition?.symmetry || 'N/A'}, focal: ${v.composition?.focal_point || 'N/A'}, flow: ${v.composition?.visual_flow || 'N/A'}, density: ${v.composition?.density || 'N/A'}
Color Palette: [${paletteStr}]
Color Harmony: ${v.color?.harmony || 'N/A'}, Temperature: ${v.color?.temperature || 'N/A'}, Contrast: ${v.color?.contrast || 'N/A'}
Typography: [${fontsStr}], Hierarchy: ${v.typography?.hierarchy_levels || 'N/A'} levels
Graphics: Style: ${v.graphics?.style || 'N/A'}, Primary: ${v.graphics?.primary_element || 'N/A'}, Secondary: ${(v.graphics?.secondary_elements || []).join(', ') || 'none'}, Effects: ${(v.graphics?.effects || []).join(', ') || 'none'}, Detail: ${v.graphics?.detail_level || 'N/A'}
POD Technical: Print: ${v.pod_technical?.best_print_method || 'N/A'}, Products: ${(v.pod_technical?.suitable_products || []).join(', ') || 'N/A'}, Garment colors: [${garmentColorsStr}]

### Buyer DNA
Persona: ${b.persona?.age_range || 'N/A'}, ${b.persona?.gender_lean || 'N/A'}, Interests: [${(b.persona?.interests || []).join(', ')}], Values: [${(b.persona?.values || []).join(', ')}], Lifestyle: ${b.persona?.lifestyle || 'N/A'}, Spending: ${b.persona?.spending_mindset || 'N/A'}
Identity: Primary: ${b.identity_signals?.primary || 'N/A'}, Message: "${b.identity_signals?.message_to_world || 'N/A'}", Tribe: ${b.identity_signals?.tribe || 'N/A'}, Aesthetic: ${b.identity_signals?.aesthetic_identity || 'N/A'}
Emotions: Primary: ${b.emotional_triggers?.primary_emotion || 'N/A'}, Trigger: "${b.emotional_triggers?.trigger_description || 'N/A'}", Secondary: [${(b.emotional_triggers?.secondary_emotions || []).join(', ')}], Arc: ${b.emotional_triggers?.emotional_arc || 'N/A'}
Occasion: Seasons: [${(b.occasion_timing?.best_seasons || []).join(', ')}], Events: [${(b.occasion_timing?.events || []).join(', ')}], Wear: ${b.occasion_timing?.wear_context || 'N/A'}, Gift: ${b.occasion_timing?.gift_potential?.score || 'N/A'} (${b.occasion_timing?.gift_potential?.who_buys_for_whom || 'N/A'})
Made-for-me decisions:
${madeForMeStr || '• N/A'}`;
}

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

  // Build dimension directives with RICH context
  const dimensionDirectives = Object.entries(DIMENSION_LABELS).map(([key, config]) => {
    const shift = input.shifts[key];
    if (!shift) return '';
    if (shift.keep) {
      return `- PRESERVE ${config.name}: ${config.richContext(input.originalDna)}`;
    }
    if (shift.value) {
      return `- CHANGE ${config.name} to: "${shift.value}" (original was: ${config.shortLabel(input.originalDna)})`;
    }
    // REIMAGINE — include original context so model knows what to diverge FROM
    return `- REIMAGINE ${config.name} — original: ${config.richContext(input.originalDna)} → create something DIFFERENT`;
  }).filter(Boolean).join('\n');

  const fidelityInstruction = CREATIVITY_FIDELITY[input.creativity] || CREATIVITY_FIDELITY[3];

  // Always package FULL DNA — creativity controls fidelity, not exposure
  const fullDna = packageFullDna(input.originalDna);

  const synthesisPrompt = `You are a Print-on-Demand design strategist. Your job: create 3 WILDLY DIFFERENT concept options.

## CRITICAL: DIVERSITY REQUIREMENT
The 3 concepts MUST differ across ALL of these dimensions:
1. **Different illustration style** — e.g., one minimalist line art, one bold cartoon, one vintage retro. NEVER repeat a style.
2. **Different color mood** — e.g., one warm earthy, one cool pastel, one high-contrast vibrant. NEVER use similar palettes.
3. **Different subject/composition** — e.g., one character-focused, one typography-heavy, one pattern/motif-based.
4. **Different emotional tone** — e.g., one playful humorous, one sentimental warm, one bold empowering.

If your 3 concepts feel like variations of ONE idea, you have FAILED. They must feel like they came from 3 DIFFERENT designers.

## Original Design DNA (FULL REFERENCE)
${fullDna}

## User's Design Directions
${dimensionDirectives}

## Creativity Level: ${input.creativity}/5
${fidelityInstruction}

${input.appliedPattern ? `## Applied Pattern/Inspiration\n${input.appliedPattern}\n` : ''}
## POD Production Constraints
All concepts MUST be POD-ready:
- Illustration-based (not photorealistic, no 3D rendering)
- Solid white background — clean, no gradients or textures behind the artwork
- Print-ready isolation — artwork floats cleanly on the background
- No glass morphism, shadows behind artwork, or complex layering
- Must work printed on t-shirts, hoodies, mugs
- Typography style is FLEXIBLE (can be hand-lettered, sans-serif, serif, display — varies per concept)

## Output
Return a JSON array of exactly 3 concept objects.

Each concept object:
{
  "title": "Short catchy concept name (3-5 words)",
  "description": "2-3 sentences describing the overall design concept",
  "visualDirection": "DETAILED visual instructions for the ILLUSTRATION ONLY: exact illustration style, composition layout, key visual elements, how they're arranged. Do NOT mention any text content here — text is handled separately in suggestedText.",
  "suggestedText": {
    "primary": "The main quote, slogan, or text that should appear ON the design (e.g., 'A GIRL & HER CATS')",
    "secondary": "Optional tagline or subtitle. Use actual words — NOT placeholders like '[Name Here]'. If the original has specific names/words, use them. Empty string if none needed.",
    "textStyle": "How the text should look: e.g., 'bold hand-lettered', 'clean sans-serif', 'vintage serif', 'playful script'",
    "textLayout": "Where text goes: e.g., 'primary text arched above illustration, secondary below' or 'primary centered top, secondary bottom'"
  },
  "colorPalette": [
    { "hex": "#HEXCODE", "name": "Color Name", "role": "Dominant" },
    { "hex": "#HEXCODE", "name": "Color Name", "role": "Secondary" },
    { "hex": "#HEXCODE", "name": "Color Name", "role": "Accent" }
  ],
  "targetBuyer": "Who would buy this — age, interests, tribe, occasion",
  "madeForMeHook": "One sentence: why the target buyer would feel THIS design was made specifically for THEM",
  "coherenceNotes": "Why this concept works as a unified whole — what ties visual + text + emotion together",
  "keyElements": ["element1", "element2", "element3", "element4"]
}

IMPORTANT:
- suggestedText.primary MUST be actual text content for the design (a quote, slogan, or statement) — NOT a description of what the text should say.
- suggestedText.secondary MUST be actual text or empty string. NEVER use placeholders like '[Pet Names Here]', '[Name]', '[Custom Text]'. If the original design has specific names/words, USE THOSE EXACT NAMES. If not applicable, use empty string.
- visualDirection MUST describe ONLY the visual illustration — do NOT mention any text, quotes, labels, or typography in visualDirection. All text-related info goes in suggestedText.
- colorPalette MUST have 3-5 specific hex colors. Do NOT use generic names without hex.
- Each concept's colorPalette should be DISTINCTLY different from the others.`;

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

  // Build color palette instruction
  const paletteInstruction = (input.concept.colorPalette || [])
    .map(c => `- ${c.name} (${c.hex}) — ${c.role}`)
    .join('\n');

  // Filter out placeholder secondary text (e.g., "[Pet Names Here]", "[Name]")
  const secondaryText = input.concept.suggestedText?.secondary || '';
  const isPlaceholder = /^\[.*\]$/.test(secondaryText.trim()) || secondaryText.includes('[') || secondaryText.trim() === '';
  const validSecondary = isPlaceholder ? '' : secondaryText;

  // Build text layout instruction
  const textLayout = input.concept.suggestedText?.textLayout || 'primary text prominently at top, secondary text below the illustration';

  const prompt = `Create a Print-on-Demand ready design based on this concept.

## Concept: ${input.concept.title}
${input.concept.description}

## Visual Direction (ILLUSTRATION ONLY)
${input.concept.visualDirection}

## Text Content — RENDER EXACTLY THESE AND NOTHING ELSE
Primary text: "${input.concept.suggestedText?.primary || ''}"
${validSecondary ? `Secondary text: "${validSecondary}"` : ''}
Text style: ${input.concept.suggestedText?.textStyle || 'bold decorative'}
Text layout: ${textLayout}

## Color Palette (USE these specific colors)
${paletteInstruction || 'Use colors appropriate for the concept'}

## Image Reference Instruction
${imageRole}

## MANDATORY OUTPUT RULES
- Background MUST be solid white (#FFFFFF). No gradients, no textures, no scenes behind the artwork.
- The design must float cleanly on the white background — isolated, print-ready.
- Illustration-based only. No photorealistic rendering, no 3D effects.
- ONE cohesive design composition.
- TEXT RULES (CRITICAL):
  • Render ONLY the exact text listed in "Text Content" above. No additional words, labels, or captions.
  • Do NOT label individual elements in the illustration (no floating names, no arrows, no tags).
  • The primary text must be clearly legible, prominent, and placed according to the text layout instruction.
  • Use ONE consistent font style for primary text and ONE for secondary text (if any).
  • Text should be integrated with the design composition, not floating randomly.

Generate exactly ONE image.`;

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
