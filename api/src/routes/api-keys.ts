import { Hono } from 'hono';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { authMiddleware } from '../middleware/auth.js';
import { encrypt } from '../lib/crypto.js';

type Env = {
    Variables: {
        user: User;
        supabase: SupabaseClient;
    };
};

export const apiKeysRoute = new Hono<Env>();

// All routes require authentication
apiKeysRoute.use('/*', authMiddleware);

/**
 * GET /api/api-keys — Check if user has a saved API key.
 * Returns { hasKey: boolean } — NEVER returns the actual key.
 */
apiKeysRoute.get('/api-keys', async (c) => {
    const user = c.get('user');
    const supabase = c.get('supabase');

    try {
        const { data, error } = await supabase
            .from('api_keys')
            .select('id')
            .eq('user_id', user.id)
            .eq('provider', 'gemini')
            .maybeSingle();

        if (error) {
            return c.json(
                { code: 'DB_ERROR', message: 'Failed to check API key status' },
                500,
            );
        }

        return c.json({ hasKey: !!data });
    } catch {
        return c.json(
            { code: 'INTERNAL_ERROR', message: 'Unexpected error' },
            500,
        );
    }
});

/**
 * POST /api/api-keys — Save or update API key.
 * Body: { key: string }
 * Encrypts before storing. Upserts (replaces existing key for same provider).
 */
apiKeysRoute.post('/api-keys', async (c) => {
    const user = c.get('user');
    const supabase = c.get('supabase');

    try {
        const body = await c.req.json<{ key: string }>();
        if (!body.key || typeof body.key !== 'string' || body.key.trim() === '') {
            return c.json(
                { code: 'VALIDATION_ERROR', message: 'API key is required' },
                400,
            );
        }

        const encryptedKey = encrypt(body.key.trim());

        // Check if key already exists for this user + provider
        const { data: existing } = await supabase
            .from('api_keys')
            .select('id')
            .eq('user_id', user.id)
            .eq('provider', 'gemini')
            .maybeSingle();

        if (existing) {
            // Update existing key
            const { error } = await supabase
                .from('api_keys')
                .update({ encrypted_key: encryptedKey })
                .eq('id', existing.id);

            if (error) {
                return c.json(
                    { code: 'DB_ERROR', message: 'Failed to update API key' },
                    500,
                );
            }

            return c.json({ success: true, message: 'API key updated' });
        }

        // Insert new key
        const { error } = await supabase.from('api_keys').insert({
            user_id: user.id,
            encrypted_key: encryptedKey,
            provider: 'gemini',
        });

        if (error) {
            return c.json(
                { code: 'DB_ERROR', message: 'Failed to save API key' },
                500,
            );
        }

        return c.json({ success: true, message: 'API key saved' }, 201);
    } catch {
        return c.json(
            { code: 'INTERNAL_ERROR', message: 'Unexpected error' },
            500,
        );
    }
});

/**
 * DELETE /api/api-keys — Remove saved API key.
 */
apiKeysRoute.delete('/api-keys', async (c) => {
    const user = c.get('user');
    const supabase = c.get('supabase');

    try {
        const { error } = await supabase
            .from('api_keys')
            .delete()
            .eq('user_id', user.id)
            .eq('provider', 'gemini');

        if (error) {
            return c.json(
                { code: 'DB_ERROR', message: 'Failed to remove API key' },
                500,
            );
        }

        return c.json({ success: true, message: 'API key removed' });
    } catch {
        return c.json(
            { code: 'INTERNAL_ERROR', message: 'Unexpected error' },
            500,
        );
    }
});
