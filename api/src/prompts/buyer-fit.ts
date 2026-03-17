/**
 * analyzeBuyerFit — Score how well a concept matches its target buyer.
 * Moved from app/src/api.ts (lines 857-880).
 */

import type { GoogleGenAI } from '@google/genai';
import { cleanJsonResponse } from './helpers.js';

export async function analyzeBuyerFit(
    ai: GoogleGenAI,
    conceptText: string,
): Promise<any> {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                {
                    text: `Evaluate how well this design concept matches the target buyer. Score the following out of 100: buyer_match, emotion_match, originality. And a made_for_me_signal_count out of 5. Return ONLY a JSON object with these exactly 4 integer keys.\n\nDesign Concept:\n${conceptText}`,
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
