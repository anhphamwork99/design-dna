/**
 * AI proxy routes — 6 endpoints for Gemini AI operations.
 * All routes require auth middleware and use encrypted API keys from DB.
 *
 * Error format (PROXY-04): { code: string, message: string }
 * Timeout (PROXY-05): No aggressive timeouts — generation routes may take 60-120s.
 */

import { Hono } from 'hono';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { authMiddleware } from '../middleware/auth.js';
import { getGeminiClient } from '../lib/gemini.js';

import { analyzeDesign } from '../prompts/analyze.js';
import { synthesizeConcept } from '../prompts/synthesize.js';
import { generateArtwork } from '../prompts/generate.js';
import { cloneDesign } from '../prompts/clone.js';
import { analyzeBatch } from '../prompts/compare.js';
import { analyzeBuyerFit } from '../prompts/buyer-fit.js';

import type {
    SynthesizeInput,
    GenerateArtworkInput,
    CloneDesignInput,
    ImageInput,
} from '../types.js';

// ── Hono Env typing ────────────────────────────────────────────────

type Env = {
    Variables: {
        user: User;
        supabase: SupabaseClient;
    };
};

// ── Helper: map Gemini errors to user-friendly messages ────────────

function mapGeminiError(err: unknown): { code: string; message: string; status: number } {
    const msg = err instanceof Error ? err.message : String(err);

    if (msg.includes('NO_API_KEY') || (typeof err === 'object' && err !== null && 'code' in err && (err as any).code === 'NO_API_KEY')) {
        return { code: 'NO_API_KEY', message: 'No Gemini API key configured. Add one in Settings.', status: 400 };
    }
    if (msg.includes('API key not valid') || msg.includes('PERMISSION_DENIED')) {
        return { code: 'INVALID_API_KEY', message: 'Your Gemini API key is invalid or has been revoked. Please update it in Settings.', status: 401 };
    }
    if (msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
        return { code: 'QUOTA_EXCEEDED', message: 'Gemini API quota exceeded. Please wait or upgrade your API plan.', status: 429 };
    }
    if (msg.includes('too large') || msg.includes('INVALID_ARGUMENT')) {
        return { code: 'INVALID_INPUT', message: 'The image may be too large or in an unsupported format. Try a smaller image.', status: 400 };
    }
    if (msg.includes('SAFETY') || msg.includes('blocked')) {
        return { code: 'CONTENT_BLOCKED', message: 'The content was blocked by safety filters. Try a different image or concept.', status: 400 };
    }

    return { code: 'AI_ERROR', message: msg || 'An unexpected AI error occurred.', status: 500 };
}

// ── Route group ────────────────────────────────────────────────────

export const aiRoute = new Hono<Env>();

// All AI routes require authentication
aiRoute.use('/ai/*', authMiddleware);

// ── POST /api/ai/analyze ───────────────────────────────────────────

aiRoute.post('/ai/analyze', async (c) => {
    try {
        const user = c.get('user');
        const supabase = c.get('supabase');
        const { imageData, mimeType } = await c.req.json<{
            imageData: string;
            mimeType: string;
        }>();

        if (!imageData || !mimeType) {
            return c.json({ code: 'VALIDATION_ERROR', message: 'imageData and mimeType are required' }, 400);
        }

        const ai = await getGeminiClient(supabase, user.id);
        const result = await analyzeDesign(ai, imageData, mimeType);
        return c.json(result);
    } catch (err) {
        console.error('[ai/analyze] Error:', err);
        const mapped = mapGeminiError(err);
        return c.json({ code: mapped.code, message: mapped.message }, mapped.status as any);
    }
});

// ── POST /api/ai/compare ──────────────────────────────────────────

aiRoute.post('/ai/compare', async (c) => {
    try {
        const user = c.get('user');
        const supabase = c.get('supabase');
        const { images } = await c.req.json<{ images: ImageInput[] }>();

        if (!images || !Array.isArray(images) || images.length < 2) {
            return c.json({ code: 'VALIDATION_ERROR', message: 'At least 2 images are required for comparison' }, 400);
        }
        if (images.length > 5) {
            return c.json({ code: 'VALIDATION_ERROR', message: 'Maximum 5 images allowed for comparison' }, 400);
        }

        const ai = await getGeminiClient(supabase, user.id);
        const result = await analyzeBatch(ai, images);
        return c.json(result);
    } catch (err) {
        const mapped = mapGeminiError(err);
        return c.json({ code: mapped.code, message: mapped.message }, mapped.status as any);
    }
});

// ── POST /api/ai/synthesize ────────────────────────────────────────

aiRoute.post('/ai/synthesize', async (c) => {
    try {
        const user = c.get('user');
        const supabase = c.get('supabase');
        const input = await c.req.json<SynthesizeInput>();

        if (!input.originalDna || !input.shifts) {
            return c.json({ code: 'VALIDATION_ERROR', message: 'originalDna and shifts are required' }, 400);
        }

        const ai = await getGeminiClient(supabase, user.id);
        const concepts = await synthesizeConcept(ai, input);
        return c.json(concepts);
    } catch (err) {
        const mapped = mapGeminiError(err);
        return c.json({ code: mapped.code, message: mapped.message }, mapped.status as any);
    }
});

// ── POST /api/ai/generate ──────────────────────────────────────────

aiRoute.post('/ai/generate', async (c) => {
    try {
        const user = c.get('user');
        const supabase = c.get('supabase');
        const input = await c.req.json<GenerateArtworkInput>();

        if (!input.concept || !input.aspectRatio) {
            return c.json({ code: 'VALIDATION_ERROR', message: 'concept and aspectRatio are required' }, 400);
        }

        const ai = await getGeminiClient(supabase, user.id);
        const dataUrl = await generateArtwork(ai, input);
        return c.json({ imageDataUrl: dataUrl });
    } catch (err) {
        const mapped = mapGeminiError(err);
        return c.json({ code: mapped.code, message: mapped.message }, mapped.status as any);
    }
});

// ── POST /api/ai/clone ─────────────────────────────────────────────

aiRoute.post('/ai/clone', async (c) => {
    try {
        const user = c.get('user');
        const supabase = c.get('supabase');
        const input = await c.req.json<CloneDesignInput>();

        if (!input.originalImage || !input.aspectRatio) {
            return c.json({ code: 'VALIDATION_ERROR', message: 'originalImage and aspectRatio are required' }, 400);
        }

        const ai = await getGeminiClient(supabase, user.id);
        const dataUrl = await cloneDesign(ai, input);
        return c.json({ imageDataUrl: dataUrl });
    } catch (err) {
        const mapped = mapGeminiError(err);
        return c.json({ code: mapped.code, message: mapped.message }, mapped.status as any);
    }
});

// ── POST /api/ai/buyer-fit ─────────────────────────────────────────

aiRoute.post('/ai/buyer-fit', async (c) => {
    try {
        const user = c.get('user');
        const supabase = c.get('supabase');
        const { conceptText } = await c.req.json<{ conceptText: string }>();

        if (!conceptText || typeof conceptText !== 'string') {
            return c.json({ code: 'VALIDATION_ERROR', message: 'conceptText is required' }, 400);
        }

        const ai = await getGeminiClient(supabase, user.id);
        const scores = await analyzeBuyerFit(ai, conceptText);
        return c.json(scores);
    } catch (err) {
        const mapped = mapGeminiError(err);
        return c.json({ code: mapped.code, message: mapped.message }, mapped.status as any);
    }
});
