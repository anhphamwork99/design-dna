import { createCipheriv, createDecipheriv, randomBytes, createHash, scryptSync } from 'crypto';

function getEncryptionKeyRaw(): string {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) throw new Error('ENCRYPTION_KEY env variable is not set');
    return key;
}

/**
 * Fast key derivation using SHA-256 (for new encryptions).
 * Suitable for data-at-rest encryption (not password hashing).
 */
function deriveKeyFast(): Buffer {
    return createHash('sha256').update(getEncryptionKeyRaw()).digest();
}

/**
 * Legacy key derivation using scryptSync (for decrypting old data).
 * scryptSync is intentionally slow — only used for backward compatibility.
 */
function deriveKeyLegacy(): Buffer {
    return scryptSync(getEncryptionKeyRaw(), 'salt', 32);
}

const ALGORITHM = 'aes-256-gcm';

// Prefix to distinguish new-format encrypted strings
const V2_PREFIX = 'v2:';

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * Uses fast SHA-256 key derivation. Prefixed with "v2:" to distinguish from legacy.
 * Returns: v2:iv:authTag:ciphertext (all hex).
 */
export function encrypt(text: string): string {
    const iv = randomBytes(16);
    const key = deriveKeyFast();
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
 */
export function decrypt(encryptedText: string): string {
    let ivHex: string, authTagHex: string, encrypted: string;
    let key: Buffer;

    if (encryptedText.startsWith(V2_PREFIX)) {
        // New format: v2:iv:authTag:ciphertext
        const parts = encryptedText.slice(V2_PREFIX.length).split(':');
        [ivHex, authTagHex, encrypted] = parts;
        key = deriveKeyFast();
    } else {
        // Legacy format: iv:authTag:ciphertext (scryptSync)
        [ivHex, authTagHex, encrypted] = encryptedText.split(':');
        key = deriveKeyLegacy();
    }

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
