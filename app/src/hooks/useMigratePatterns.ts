import { useState, useEffect, useRef } from 'react';
import { listPatterns, savePattern } from '../apiClient';

// ── Types ──────────────────────────────────────────────────────────

interface LegacyPattern {
    id: string;
    name: string;
    createdAt: string;
    sourceImageCount: number;
    thumbnails: string[];
    summary: string;
    batchAnalysis: any;
}

export interface MigrationState {
    status: 'idle' | 'detected' | 'migrating' | 'done' | 'error';
    localPatternCount: number;
    migratedCount: number;
    skippedCount: number;
    error: string | null;
}

const STORAGE_KEY = 'designdna_patterns';

// ── Hook ───────────────────────────────────────────────────────────

export function useMigratePatterns(token: string | null) {
    const [state, setState] = useState<MigrationState>({
        status: 'idle',
        localPatternCount: 0,
        migratedCount: 0,
        skippedCount: 0,
        error: null,
    });

    const hasChecked = useRef(false);

    // Detection: run once when token becomes available
    useEffect(() => {
        if (!token || hasChecked.current) return;
        hasChecked.current = true;

        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return; // no data → stay idle

            const patterns: LegacyPattern[] = JSON.parse(raw);
            if (!Array.isArray(patterns) || patterns.length === 0) return;

            setState(s => ({
                ...s,
                status: 'detected',
                localPatternCount: patterns.length,
            }));
        } catch {
            // corrupt data → stay idle
        }
    }, [token]);

    // Migration logic
    const startMigration = async () => {
        if (!token) return;

        setState(s => ({ ...s, status: 'migrating', migratedCount: 0, skippedCount: 0, error: null }));

        try {
            // Read localStorage patterns
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                setState(s => ({ ...s, status: 'done' }));
                return;
            }

            const localPatterns: LegacyPattern[] = JSON.parse(raw);
            if (!Array.isArray(localPatterns) || localPatterns.length === 0) {
                setState(s => ({ ...s, status: 'done' }));
                return;
            }

            // Fetch existing server patterns for duplicate detection
            const serverPatterns = await listPatterns(token);

            let migrated = 0;
            let skipped = 0;

            for (const lp of localPatterns) {
                // Duplicate check: name + createdAt
                const isDuplicate = serverPatterns.some(
                    sp => sp.name === lp.name && sp.created_at === lp.createdAt
                );

                if (isDuplicate) {
                    skipped++;
                    setState(s => ({ ...s, skippedCount: skipped }));
                    continue;
                }

                // Upload to server
                await savePattern(token, {
                    name: lp.name,
                    summary: lp.summary || 'No summary',
                    sourceImageCount: lp.sourceImageCount || 0,
                    thumbnails: lp.thumbnails || [],
                    batchAnalysis: lp.batchAnalysis || null,
                });

                migrated++;
                setState(s => ({ ...s, migratedCount: migrated }));
            }

            // Clear localStorage after successful migration
            localStorage.removeItem(STORAGE_KEY);

            setState(s => ({
                ...s,
                status: 'done',
                migratedCount: migrated,
                skippedCount: skipped,
            }));
        } catch (err: any) {
            console.error('Pattern migration failed:', err);
            // Do NOT clear localStorage on error — user can retry
            setState(s => ({
                ...s,
                status: 'error',
                error: err?.message || 'Unknown error occurred',
            }));
        }
    };

    // Dismiss: user declines migration
    const dismiss = () => {
        setState(s => ({ ...s, status: 'idle' }));
    };

    return { state, startMigration, dismiss };
}
