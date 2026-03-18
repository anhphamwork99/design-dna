import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from './contexts/AuthContext';
import authBg from './assets/background-update.webp';

interface RegisterScreenProps {
    onSwitchToLogin: () => void;
}

export default function RegisterScreen({ onSwitchToLogin }: RegisterScreenProps) {
    const { signUp, signInWithGoogle } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error: authError } = await signUp(email, password, name || undefined);
        if (authError) {
            setError(authError.message);
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError(null);
        const { error: authError } = await signInWithGoogle();
        if (authError) {
            setError(authError.message);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${authBg})` }}
            />
            {/* Light Overlay */}
            <div className="absolute inset-0 bg-white/60" />

            <div className="w-full max-w-[400px] flex flex-col items-center relative z-10">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-8 h-8 rounded ai-gradient"></div>
                    <span className="font-semibold text-[20px]">DesignDNA</span>
                </div>

                {/* Card */}
                <div className="w-full bg-bg-surface1/90 backdrop-blur-xl border border-border-default rounded-xl p-8">
                    <h1 className="text-[20px] font-semibold mb-1">Create your account</h1>
                    <p className="text-[14px] text-text-secondary mb-6">
                        Get started with DesignDNA for free
                    </p>

                    {/* Google Button */}
                    <button
                        type="button"
                        onClick={handleGoogle}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-800 font-medium py-[14px] px-6 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
                            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
                            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
                            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 2.58 9 3.58Z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-border-default"></div>
                        <span className="text-[12px] text-text-tertiary uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-border-default"></div>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="register-name" className="text-[14px] text-text-secondary font-medium">
                                Name
                            </label>
                            <input
                                id="register-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                className="w-full bg-bg-surface1 border border-border-default hover:border-border-hover focus:border-accent focus:ring-1 focus:ring-accent rounded-lg px-[14px] py-[10px] text-[14px] text-text-primary outline-none transition-all placeholder:text-text-tertiary"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="register-email" className="text-[14px] text-text-secondary font-medium">
                                Email
                            </label>
                            <input
                                id="register-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full bg-bg-surface1 border border-border-default hover:border-border-hover focus:border-accent focus:ring-1 focus:ring-accent rounded-lg px-[14px] py-[10px] text-[14px] text-text-primary outline-none transition-all placeholder:text-text-tertiary"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="register-password" className="text-[14px] text-text-secondary font-medium">
                                Password
                            </label>
                            <input
                                id="register-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="w-full bg-bg-surface1 border border-border-default hover:border-border-hover focus:border-accent focus:ring-1 focus:ring-accent rounded-lg px-[14px] py-[10px] text-[14px] text-text-primary outline-none transition-all placeholder:text-text-tertiary"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-[13px] text-error"
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="w-full ai-gradient text-white font-medium py-[14px] px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && (
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            )}
                            Create Account
                        </button>
                    </form>
                </div>

                {/* Switch to Login */}
                <p className="mt-6 text-[14px] text-text-secondary">
                    Already have an account?{' '}
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="text-accent hover:underline font-medium"
                    >
                        Sign in
                    </button>
                </p>
            </div>
        </motion.div>
    );
}
