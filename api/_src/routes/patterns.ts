import { Hono } from 'hono';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { authMiddleware } from '../middleware/auth.js';

type Env = {
    Variables: {
        user: User;
        supabase: SupabaseClient;
    };
};

export const patternsRoute = new Hono<Env>();

// All routes require authentication
patternsRoute.use('/*', authMiddleware);

/**
 * POST /api/patterns — Save a new pattern.
 * Body: { name: string, summary?: string, sourceImageCount?: number, thumbnails?: string[], batchAnalysis: object }
 */
patternsRoute.post('/patterns', async (c) => {
    const user = c.get('user');
    const supabase = c.get('supabase');

    try {
        const body = await c.req.json<{
            name?: string;
            summary?: string;
            sourceImageCount?: number;
            thumbnails?: string[];
            batchAnalysis: unknown;
        }>();

        if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
            return c.json(
                { code: 'VALIDATION_ERROR', message: 'Pattern name is required' },
                400,
            );
        }

        if (!body.batchAnalysis || typeof body.batchAnalysis !== 'object') {
            return c.json(
                { code: 'VALIDATION_ERROR', message: 'batchAnalysis is required and must be an object' },
                400,
            );
        }

        const { data, error } = await supabase
            .from('patterns')
            .insert({
                user_id: user.id,
                name: body.name.trim(),
                summary: body.summary || null,
                source_image_count: body.sourceImageCount || null,
                thumbnails: body.thumbnails || null,
                batch_analysis: body.batchAnalysis,
            })
            .select('id, name, created_at')
            .single();

        if (error) {
            return c.json(
                { code: 'DB_ERROR', message: 'Failed to save pattern' },
                500,
            );
        }

        return c.json(data, 201);
    } catch {
        return c.json(
            { code: 'INTERNAL_ERROR', message: 'Unexpected error' },
            500,
        );
    }
});

/**
 * GET /api/patterns — List user's patterns.
 * Returns array of { id, name, summary, source_image_count, thumbnails, created_at }.
 * Excludes batch_analysis for performance.
 */
patternsRoute.get('/patterns', async (c) => {
    const supabase = c.get('supabase');

    try {
        const { data, error } = await supabase
            .from('patterns')
            .select('id, name, summary, source_image_count, thumbnails, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            return c.json(
                { code: 'DB_ERROR', message: 'Failed to list patterns' },
                500,
            );
        }

        return c.json(data);
    } catch {
        return c.json(
            { code: 'INTERNAL_ERROR', message: 'Unexpected error' },
            500,
        );
    }
});

/**
 * GET /api/patterns/:id — Get a single pattern with full batch_analysis.
 */
patternsRoute.get('/patterns/:id', async (c) => {
    const supabase = c.get('supabase');
    const id = c.req.param('id');

    try {
        const { data, error } = await supabase
            .from('patterns')
            .select('id, name, summary, source_image_count, thumbnails, batch_analysis, created_at')
            .eq('id', id)
            .maybeSingle();

        if (error) {
            return c.json(
                { code: 'DB_ERROR', message: 'Failed to retrieve pattern' },
                500,
            );
        }

        if (!data) {
            return c.json(
                { code: 'NOT_FOUND', message: 'Pattern not found' },
                404,
            );
        }

        return c.json(data);
    } catch {
        return c.json(
            { code: 'INTERNAL_ERROR', message: 'Unexpected error' },
            500,
        );
    }
});

/**
 * DELETE /api/patterns/:id — Delete a pattern.
 */
patternsRoute.delete('/patterns/:id', async (c) => {
    const supabase = c.get('supabase');
    const id = c.req.param('id');

    try {
        // Check if pattern exists first (RLS ensures only user's own)
        const { data: existing, error: findError } = await supabase
            .from('patterns')
            .select('id')
            .eq('id', id)
            .maybeSingle();

        if (findError) {
            return c.json(
                { code: 'DB_ERROR', message: 'Failed to find pattern' },
                500,
            );
        }

        if (!existing) {
            return c.json(
                { code: 'NOT_FOUND', message: 'Pattern not found' },
                404,
            );
        }

        const { error } = await supabase
            .from('patterns')
            .delete()
            .eq('id', id);

        if (error) {
            return c.json(
                { code: 'DB_ERROR', message: 'Failed to delete pattern' },
                500,
            );
        }

        return c.json({ success: true });
    } catch {
        return c.json(
            { code: 'INTERNAL_ERROR', message: 'Unexpected error' },
            500,
        );
    }
});
