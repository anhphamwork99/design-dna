import { GoogleGenAI } from '@google/genai';
import type { SupabaseClient } from '@supabase/supabase-js';
import { decrypt } from './crypto.js';

/**
 * Get a Gemini AI client for a specific user.
 * Fetches the user's encrypted API key from DB, decrypts it,
 * and returns a ready-to-use GoogleGenAI instance.
 *
 * @throws {{ code: string; message: string }} if no API key found
 */
export async function getGeminiClient(
    supabase: SupabaseClient,
    userId: string,
): Promise<GoogleGenAI> {
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

    const apiKey = decrypt(data.encrypted_key);
    return new GoogleGenAI({ apiKey });
}
