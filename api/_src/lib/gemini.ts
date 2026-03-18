import type { SupabaseClient } from '@supabase/supabase-js';
import { decrypt } from './crypto.js';

// Lazy-loaded Gemini SDK — only imported when AI routes are actually called.
// This prevents cold start delay on simple routes (api-keys, analyses, patterns).
let _GoogleGenAI: typeof import('@google/genai').GoogleGenAI | null = null;

async function getGoogleGenAI() {
    if (!_GoogleGenAI) {
        const mod = await import('@google/genai');
        _GoogleGenAI = mod.GoogleGenAI;
    }
    return _GoogleGenAI;
}

/**
 * Get a Gemini AI client for a specific user.
 * Fetches the user's encrypted API key from DB, decrypts it,
 * and returns a ready-to-use GoogleGenAI instance.
 *
 * @param supabase - User-scoped Supabase client
 * @param userId - The authenticated user's ID
 * @param encryptionKey - The raw encryption key (from env binding)
 * @throws {{ code: string; message: string }} if no API key found
 */
export async function getGeminiClient(
    supabase: SupabaseClient,
    userId: string,
    encryptionKey: string,
) {
    const { data, error } = await supabase
        .from('api_keys')
        .select('encrypted_key')
        .eq('user_id', userId)
        .eq('provider', 'gemini')
        .single();

    if (error || !data) {
        throw {
            code: 'NO_API_KEY',
            message:
                'No Gemini API key configured. Add one in Settings.',
        };
    }

    const apiKey = decrypt(data.encrypted_key, encryptionKey);
    const GoogleGenAI = await getGoogleGenAI();
    return new GoogleGenAI({ apiKey });
}
