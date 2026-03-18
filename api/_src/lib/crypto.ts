import { createCipheriv, createDecipheriv, randomBytes, createHash, scryptSync } from 'crypto';

/**
 * Fast key derivation using SHA-256 (for new encryptions).
 * Suitable for data-at-rest encryption (not password hashing).
 */
function deriveKeyFast(encryptionKey: string): Buffer {
    return createHash('sha256').update(encryptionKey).digest();
}

/**
 * Legacy key derivation using scryptSync (for decrypting old data).
 * scryptSync is intentionally slow — only used for backward compatibility.
 */
function deriveKeyLegacy(encryptionKey: string): Buffer {
    return scryptSync(encryptionKey, 'salt', 32);
}

const ALGORITHM = 'aes-256-gcm';

// Prefix to distinguish new-format encrypted strings
const V2_PREFIX = 'v2:';

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * Uses fast SHA-256 key derivation. Prefixed with "v2:" to distinguish from legacy.
 * Returns: v2:iv:authTag:ciphertext (all hex).
 *
 * @param text - The plaintext to encrypt
 * @param encryptionKey - The raw encryption key (from env binding)
 */
export function encrypt(text: string, encryptionKey: string): string {
    const iv = randomBytes(16);
    const key = deriveKeyFast(encryptionKey);
    const cipher = createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${V2_PREFIX}${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypt a previously encrypted string.
 * Auto-detects format:
 * - "v2:iv:authTag:ciphertext" → uses fast SHA-256 key
 * - "iv:authTag:ciphertext" (legacy) → uses slow scryptSync key
 *
 * @param encryptedText - The encrypted string
 * @param encryptionKey - The raw encryption key (from env binding)
 */
export function decrypt(encryptedText: string, encryptionKey: string): string {
    let ivHex: string, authTagHex: string, encrypted: string;
    let key: Buffer;

    if (encryptedText.startsWith(V2_PREFIX)) {
        // New format: v2:iv:authTag:ciphertext
        const parts = encryptedText.slice(V2_PREFIX.length).split(':');
        [ivHex, authTagHex, encrypted] = parts;
        key = deriveKeyFast(encryptionKey);
    } else {
        // Legacy format: iv:authTag:ciphertext (scryptSync)
        [ivHex, authTagHex, encrypted] = encryptedText.split(':');
        key = deriveKeyLegacy(encryptionKey);
    }

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
