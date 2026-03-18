import React, { useState, useEffect, useCallback } from 'react';
import { X, Key, Trash2, Loader2, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

type KeyStatus = 'loading' | 'no_key' | 'has_key' | 'updating' | 'saving' | 'deleting' | 'error';

interface SettingsModalProps {
    onClose: () => void;
}

async function apiFetch<T = any>(path: string, token: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}/api${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options?.headers,
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(err.message || `HTTP ${res.status}`);
    }

    return res.json();
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
    const { session } = useAuth();
    const [status, setStatus] = useState<KeyStatus>('loading');
    const [keyInput, setKeyInput] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Check key status on open
    const checkKeyStatus = useCallback(async () => {
        if (!session) return;
        setStatus('loading');
        setErrorMsg('');
        try {
            const data = await apiFetch<{ hasKey: boolean }>('/api-keys', session.access_token);
            setStatus(data.hasKey ? 'has_key' : 'no_key');
        } catch (err: any) {
            setStatus('error');
            setErrorMsg(err.message || 'Failed to check API key status');
        }
    }, [session]);

    useEffect(() => {
        checkKeyStatus();
    }, [checkKeyStatus]);

    // Save / Update key
    const handleSave = async () => {
        if (!session || !keyInput.trim()) return;
        const prevStatus = status;
        setStatus('saving');
        setErrorMsg('');
        try {
            await apiFetch('/api-keys', session.access_token, {
                method: 'POST',
                body: JSON.stringify({ key: keyInput.trim() }),
            });
            setKeyInput('');
            setStatus('has_key');
        } catch (err: any) {
            setStatus(prevStatus === 'updating' ? 'updating' : 'no_key');
            setErrorMsg(err.message || 'Failed to save API key');
        }
    };

    // Delete key
    const handleDelete = async () => {
        if (!session) return;
        setStatus('deleting');
        setErrorMsg('');
        try {
            await apiFetch('/api-keys', session.access_token, {
                method: 'DELETE',
            });
            setKeyInput('');
            setStatus('no_key');
        } catch (err: any) {
            setStatus('has_key');
            setErrorMsg(err.message || 'Failed to delete API key');
        }
    };

    const isActionInProgress = status === 'loading' || status === 'saving' || status === 'deleting';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative w-full max-w-[440px] bg-bg-surface1 border border-border-default rounded-xl p-6"
                role="dialog"
                aria-modal="true"
                aria-labelledby="settings-title"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
                    aria-label="Close settings"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 id="settings-title" className="text-[20px] font-semibold mb-6">Settings</h2>

                {/* API Key Section */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-text-secondary">
                        <Key className="w-4 h-4" />
                        <span className="text-[14px] font-medium">Gemini API Key</span>
                    </div>

                    {/* Loading state */}
                    {status === 'loading' && (
                        <div className="flex items-center justify-center py-6">
                            <Loader2 className="w-5 h-5 text-text-tertiary animate-spin" />
                        </div>
                    )}

                    {/* Key saved state */}
                    {status === 'has_key' && (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 bg-bg-surface2 p-3 rounded-lg border border-border-default">
                                <CheckCircle2 className="w-5 h-5 text-[#4ade80] flex-shrink-0" />
                                <span className="text-[14px] text-text-primary">Your API key is saved securely</span>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setStatus('updating'); setKeyInput(''); }}
                                    className="flex-1 px-4 py-2.5 text-[14px] font-medium border border-border-default rounded-lg hover:bg-bg-surface2 transition-colors text-text-primary"
                                >
                                    Update Key
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2.5 text-[14px] font-medium text-error border border-error/30 rounded-lg hover:bg-error/10 transition-colors flex items-center gap-1.5"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}

                    {/* No key / Updating state — show input */}
                    {(status === 'no_key' || status === 'updating' || status === 'saving') && (
                        <div className="flex flex-col gap-3">
                            <input
                                type="password"
                                value={keyInput}
                                onChange={(e) => setKeyInput(e.target.value)}
                                placeholder={status === 'updating' ? '••••••••' : 'Paste your Gemini API key'}
                                className="w-full px-4 py-3 text-[14px] bg-bg-base border border-border-default rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent transition-colors"
                                disabled={status === 'saving'}
                                autoFocus
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSave}
                                    disabled={!keyInput.trim() || status === 'saving'}
                                    className="flex-1 px-4 py-2.5 text-[14px] font-medium bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {status === 'saving' ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Key'
                                    )}
                                </button>
                                {status === 'updating' && (
                                    <button
                                        onClick={() => { setStatus('has_key'); setKeyInput(''); setErrorMsg(''); }}
                                        className="px-4 py-2.5 text-[14px] font-medium text-text-secondary hover:text-text-primary transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Deleting state */}
                    {status === 'deleting' && (
                        <div className="flex items-center justify-center py-6 gap-2">
                            <Loader2 className="w-5 h-5 text-text-tertiary animate-spin" />
                            <span className="text-[14px] text-text-secondary">Removing key...</span>
                        </div>
                    )}

                    {/* Error message */}
                    {(status === 'error' || errorMsg) && (
                        <div className="flex items-start gap-2 bg-error/10 p-3 rounded-lg border border-error/20">
                            <AlertTriangle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                            <div className="flex flex-col gap-2">
                                <span className="text-[13px] text-error">{errorMsg || 'Something went wrong'}</span>
                                {status === 'error' && (
                                    <button
                                        onClick={checkKeyStatus}
                                        className="text-[13px] text-accent hover:underline self-start"
                                    >
                                        Retry
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Security info */}
                    <div className="flex items-start gap-2 mt-1">
                        <ShieldCheck className="w-4 h-4 text-text-tertiary flex-shrink-0 mt-0.5" />
                        <p className="text-[12px] text-text-tertiary leading-relaxed">
                            Your key is encrypted and stored securely on our server. It's never exposed to the browser.
                        </p>
                    </div>
                </div>

                {/* Close button */}
                <div className="flex justify-end mt-6 pt-4 border-t border-border-default">
                    <button
                        onClick={onClose}
                        disabled={isActionInProgress}
                        className="px-5 py-2.5 text-[14px] font-medium bg-bg-surface2 text-text-primary rounded-lg hover:bg-bg-surface2/80 transition-colors border border-border-default"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
