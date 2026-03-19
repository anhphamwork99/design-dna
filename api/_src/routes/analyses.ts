import { Hono } from 'hono';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { authMiddleware } from '../middleware/auth.js';
import { uploadThumbnail, isBase64DataUrl } from '../lib/storage.js';
import type { CloudflareBindings } from '../app.js';

type Env = {
    Bindings: CloudflareBindings;
    Variables: {
        user: User;
        supabase: SupabaseClient;
    };
};

export const analysesRoute = new Hono<Env>();

// All routes require authentication
analysesRoute.use('/*', authMiddleware);

/**
 * POST /api/analyses — Save a new analysis.
 * Body: { name: string, thumbnail?: string, resultJson: object }
 */
analysesRoute.post('/analyses', async (c) => {
    const user = c.get('user');
    const supabase = c.get('supabase');

    try {
        const body = await c.req.json<{
            name?: string;
            thumbnail?: string;
            resultJson: unknown;
        }>();

        if (!body.resultJson || typeof body.resultJson !== 'object') {
            return c.json(
                { code: 'VALIDATION_ERROR', message: 'resultJson is required and must be an object' },
                400,
            );
        }

        // Upload thumbnail to Storage if it's a base64 data URL
        let thumbnailValue = body.thumbnail || null;
        if (thumbnailValue && isBase64DataUrl(thumbnailValue)) {
            const fileId = crypto.randomUUID();
            thumbnailValue = await uploadThumbnail(
                c.env.SUPABASE_URL,
                c.env.SUPABASE_SERVICE_ROLE_KEY,
                thumbnailValue,
                `analyses/${user.id}/${fileId}.jpg`,
            );
        }

        const { data, error } = await supabase
            .from('analyses')
            .insert({
                user_id: user.id,
                name: body.name || null,
                thumbnail: thumbnailValue,
                result_json: body.resultJson,
            })
            .select('id, name, created_at')
            .single();

        if (error) {
            return c.json(
                { code: 'DB_ERROR', message: 'Failed to save analysis' },
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
 * GET /api/analyses — List user's analyses.
 * Query params: ?limit=20&offset=0
 * Returns array of { id, name, thumbnail, created_at } — NO result_json for performance.
 */
analysesRoute.get('/analyses', async (c) => {
    const supabase = c.get('supabase');

    try {
        const limit = Math.min(Number(c.req.query('limit')) || 20, 100);
        const offset = Number(c.req.query('offset')) || 0;

        const { data, error } = await supabase
            .from('analyses')
            .select('id, name, thumbnail, created_at')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            return c.json(
                { code: 'DB_ERROR', message: 'Failed to list analyses' },
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
 * GET /api/analyses/:id — Get a single analysis with full result_json.
 */
analysesRoute.get('/analyses/:id', async (c) => {
    const supabase = c.get('supabase');
    const id = c.req.param('id');

    try {
        const { data, error } = await supabase
            .from('analyses')
            .select('id, name, thumbnail, result_json, created_at')
            .eq('id', id)
            .maybeSingle();

        if (error) {
            return c.json(
                { code: 'DB_ERROR', message: 'Failed to retrieve analysis' },
                500,
            );
        }

        if (!data) {
            return c.json(
                { code: 'NOT_FOUND', message: 'Analysis not found' },
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
 * DELETE /api/analyses/:id — Delete an analysis.
 */
analysesRoute.delete('/analyses/:id', async (c) => {
    const supabase = c.get('supabase');
    const id = c.req.param('id');

    try {
        // Check if analysis exists first (RLS ensures only user's own)
        const { data: existing, error: findError } = await supabase
            .from('analyses')
            .select('id')
            .eq('id', id)
            .maybeSingle();

        if (findError) {
            return c.json(
                { code: 'DB_ERROR', message: 'Failed to find analysis' },
                500,
            );
        }

        if (!existing) {
            return c.json(
                { code: 'NOT_FOUND', message: 'Analysis not found' },
                404,
            );
        }

        const { error } = await supabase
            .from('analyses')
            .delete()
            .eq('id', id);

        if (error) {
            return c.json(
                { code: 'DB_ERROR', message: 'Failed to delete analysis' },
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
