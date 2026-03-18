import { createMiddleware } from 'hono/factory';
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { CloudflareBindings } from '../app.js';

/**
 * Auth middleware — verifies Supabase JWT from Authorization header.
 *
 * Sets on context:
 * - `user` — the authenticated Supabase user object
 * - `supabase` — a per-request Supabase client scoped to the user's JWT (respects RLS)
 */
export const authMiddleware = createMiddleware<{
    Bindings: CloudflareBindings;
    Variables: { user: User; supabase: SupabaseClient };
}>(async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return c.json(
            { code: 'UNAUTHORIZED', message: 'Missing or invalid token' },
            401,
        );
    }

    const token = authHeader.replace('Bearer ', '');

    // Create a per-request Supabase client with the user's JWT
    const supabase = createClient(
        c.env.SUPABASE_URL,
        c.env.SUPABASE_ANON_KEY,
        { global: { headers: { Authorization: `Bearer ${token}` } } },
    );

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
        return c.json(
            { code: 'UNAUTHORIZED', message: 'Invalid or expired token' },
            401,
        );
    }

    c.set('user', user);
    c.set('supabase', supabase); // User-scoped client for RLS
    await next();
});
