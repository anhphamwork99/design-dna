import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Service role Supabase client — bypasses RLS.
 * Use for server-side admin operations only.
 * For user-scoped queries, use the per-request client from auth middleware.
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
