import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Create a service role Supabase client — bypasses RLS.
 * Use for server-side admin operations only.
 * For user-scoped queries, use the per-request client from auth middleware.
 *
 * In Cloudflare Workers, env vars are passed per-request via bindings.
 * This factory creates a client from those bindings.
 */
export function createSupabaseAdmin(supabaseUrl: string, serviceRoleKey: string): SupabaseClient {
    return createClient(supabaseUrl, serviceRoleKey);
}
