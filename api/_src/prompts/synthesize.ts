/**
 * synthesizeConcept — Generate 3 wildly different design concepts.
 * Moved from app/src/api.ts (lines 377-476).
 */

import type { GoogleGenAI } from '@google/genai';
import type { SynthesizeInput, SynthesizedConcept } from '../types.js';
import {
    DIMENSION_LABELS,
    CREATIVITY_FIDELITY,
    packageFullDna,
    formatPatternInsights,
    cleanJsonResponse,
} from './helpers.js';

export async function synthesizeConcept(
    ai: GoogleGenAI,
    input: SynthesizeInput,
): Promise<SynthesizedConcept[]> {
    // Build dimension directives with RICH context
    const dimensionDirectives = Object.entries(DIMENSION_LABELS)
        .map(([key, config]) => {
            const shift = input.shifts[key];
            if (!shift) return '';
            if (shift.keep) {
                return `- PRESERVE ${config.name}: ${config.richContext(input.originalDna)}`;
            }
            if (shift.value) {
                return `- CHANGE ${config.name} to: "${shift.value}" (original was: ${config.shortLabel(input.originalDna)})`;
            }
            // REIMAGINE
            return `- REIMAGINE ${config.name} — original: ${config.richContext(input.originalDna)} → create something DIFFERENT`;
        })
        .filter(Boolean)
        .join('\n');

    const fidelityInstruction =
        CREATIVITY_FIDELITY[input.creativity] || CREATIVITY_FIDELITY[3];

    // Always package FULL DNA
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

${input.appliedPattern ? formatPatternInsights(input.appliedPattern) : ''}
## POD Production Constraints
All concepts MUST be POD-ready:
- Illustration-based (not photorealistic, no 3D rendering)
- Outermost background is solid white — the design's edges and transition into white is a CREATIVE CHOICE (open/fading, badge, freeform, etc.)
- Must work printed on t-shirts, hoodies, mugs
- Typography style is FLEXIBLE (can be hand-lettered, sans-serif, serif, display — varies per concept)

## Output
Return a JSON array of exactly 3 concept objects.

Each concept object:
{
  "title": "Short catchy concept name (3-5 words)",
  "description": "2-3 sentences describing the overall design concept",
  "visualDirection": "DETAILED visual instructions for the ILLUSTRATION ONLY: exact illustration style, composition layout, key visual elements, how they're arranged, AND the composition edge style (e.g., 'open composition with soft painterly edges dissolving into white background', 'scene vignette with brush stroke edges fading into white', 'enclosed in a circular badge with ornamental border', 'freeform silhouette with organic edges', etc.). Choose the edge style that best matches the original design's DNA and the concept's visual language. Do NOT mention any text content here — text is handled separately in suggestedText.",
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
        config: { responseMimeType: 'application/json' },
    });

    const text = response.text;
    if (!text) throw new Error('No response from Gemini');

    const parsed = JSON.parse(cleanJsonResponse(text));
    const concepts: SynthesizedConcept[] = Array.isArray(parsed)
        ? parsed
        : parsed.concepts || [];

    if (concepts.length === 0) throw new Error('No concepts generated');
    return concepts.slice(0, 3);
}
