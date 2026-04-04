import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '../api/auth';
import TextField from '../components/TextField';
import { useSettings } from '../context/SettingsContext';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const { logo, app_name } = useSettings();

    const forgotPasswordMutation = useMutation({
        mutationFn: forgotPassword,
        onSuccess: (data) => {
            toast.success(data.message || 'Reset link sent! Check your email.');
            setEmail('');
        },
        onError: (error) => {
            toast.error(error.response?.data?.meta?.message || 'Failed to send reset link.');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Email is required');
            return;
        }
        forgotPasswordMutation.mutate(email);
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />

            <div className="w-full max-w-sm relative z-10">
                {/* Main Card */}
                <div className="bg-surface-container rounded-2xl border border-outline-variant/30 shadow-xl overflow-hidden">
                    {/* Card Header */}
                    <div className="px-5 py-4 border-b border-outline-variant/20 bg-surface-container-low flex items-center justify-between">
                        <p className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">
                            Account Recovery
                        </p>
                        <div className="flex items-center gap-1.5 opacity-60">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">Reset Mode</span>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Branding */}
                        <div className="text-center mb-8">
                            {logo ? (
                                <div className="w-14 h-14 mx-auto rounded-xl border border-outline-variant/40 bg-surface-container-high p-2.5 mb-4 shadow-sm">
                                    <img 
                                        src={`${import.meta.env.VITE_API_URL}/public/storage/${logo}`} 
                                        alt="Logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="w-14 h-14 mx-auto rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                            )}
                            <h1 className="text-xl font-bold text-surface-on">Forgot Password?</h1>
                            <p className="text-xs text-surface-on-variant mt-1.5 opacity-80">Enter your email and we'll send a link to reset your password.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <TextField
                                label="Email address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                            />

                            <button
                                type="submit"
                                disabled={forgotPasswordMutation.isPending}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-primary text-on-primary text-sm font-bold shadow-md shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {forgotPasswordMutation.isPending ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                                        Sending Link…
                                    </>
                                ) : 'Send Reset Link'}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center">
                            <Link to="/login" className="text-xs font-bold text-primary hover:underline">
                                ← Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
