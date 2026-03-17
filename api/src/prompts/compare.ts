/**
 * analyzeBatch — Batch comparison of 2-5 designs.
 * Moved from app/src/api.ts (lines 787-855).
 */

import type { GoogleGenAI } from '@google/genai';
import type { ImageInput } from '../types.js';
import { cleanJsonResponse } from './helpers.js';

export async function analyzeBatch(
    ai: GoogleGenAI,
    images: ImageInput[],
): Promise<any> {
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

    const parts: any[] = images.map((img) => ({
        inlineData: {
            data: img.data.includes(',') ? img.data.split(',')[1] : img.data,
            mimeType: img.type,
        },
    }));
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts },
        config: {
            responseMimeType: 'application/json',
        },
    });

    const text = response.text;
    if (!text) throw new Error('No response from Gemini');
    return JSON.parse(cleanJsonResponse(text));
}
