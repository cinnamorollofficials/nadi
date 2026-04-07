import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { GoogleLogin } from '@react-oauth/google';
import TextField from '../components/TextField';
import { useSettings } from '../context/SettingsContext';
import apiClient from '../api/client';

const Login = () => {
    const navigate = useNavigate();
    const { logo, app_name } = useSettings();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember_me: false,
    });
    const [errors, setErrors] = useState({});

    const loginMutation = useMutation({
        mutationFn: async (credentials) => {
            const response = await apiClient.post('/auth/login', credentials);
            return response.data;
        },
        onSuccess: (data) => {
            if (data.data.requires_2fa) {
                navigate('/2fa-challenge', { state: { tempToken: data.data.temp_token } });
                return;
            }
            localStorage.setItem('token', data.data.access_token);
            if (data.data.refresh_token) {
                localStorage.setItem('refresh_token', data.data.refresh_token);
            }
            localStorage.setItem('user', JSON.stringify(data.data.user));
            navigate('/dashboard');
        },
        onError: (error) => {
            setErrors({
                submit: error.response?.data?.meta?.message || 'Invalid email or password',
            });
        },
    });

    const googleLoginMutation = useMutation({
        mutationFn: async (credential) => {
            const response = await apiClient.post('/auth/google', { credential });
            return response.data;
        },
        onSuccess: (data) => {
            localStorage.setItem('token', data.data.access_token);
            if (data.data.refresh_token) {
                localStorage.setItem('refresh_token', data.data.refresh_token);
            }
            localStorage.setItem('user', JSON.stringify(data.data.user));
            navigate('/dashboard');
        },
        onError: (error) => {
            setErrors({
                submit: error.response?.data?.meta?.message || 'Google login failed',
            });
        },
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        loginMutation.mutate(formData);
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background decorative elements - Humanist Health Style */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[130px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-nadi-rose/10 rounded-full blur-[130px] animate-pulse delay-700" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[150px]" />

            <div className="w-full max-w-sm relative z-10">
                {/* Main Card */}
                <div className="bg-surface-container rounded-2xl border border-outline-variant/30 shadow-xl overflow-hidden">
                    {/* Card Header (Pola Desain File Sharer) */}
                    <div className="px-5 py-4 border-b border-outline-variant/20 bg-surface-container-low flex items-center justify-between">
                        <p className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">
                            Secure Access
                        </p>
                        <div className="flex items-center gap-1.5 opacity-60">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">Encrypted</span>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Branding inside card body for modern look */}
                        <div className="text-center mb-8">
                            {logo ? (
                                <div className="w-16 h-16 mx-auto rounded-2xl border border-outline-variant/40 bg-white dark:bg-white/5 p-3 mb-4 shadow-sm">
                                    <img 
                                        src={`${import.meta.env.VITE_API_URL}/public/storage/${logo}`} 
                                        alt="Logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            )}
                            <h1 className="text-xl font-bold text-surface-on">Welcome Back</h1>
                            <p className="text-xs text-surface-on-variant mt-1.5 opacity-80">Sign in to your account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {errors.submit && (
                                <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-medium text-center">
                                    {errors.submit}
                                </div>
                            )}

                            <TextField
                                label="Email address"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                error={errors.email}
                                required
                            />

                            <div className="space-y-1">
                                <TextField
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    error={errors.password}
                                    required
                                />
                                <div className="flex justify-end pr-1">
                                    <Link to="/forgot-password" title="forgot-password" className="text-[11px] font-bold text-primary hover:text-primary-600 transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-center px-1">
                                <label className="flex items-center cursor-pointer group">
                                    <div className="relative flex items-center justify-center w-4 h-4 mr-2">
                                        <input 
                                            type="checkbox" 
                                            name="remember_me"
                                            checked={formData.remember_me}
                                            onChange={handleChange}
                                            className="peer appearance-none w-4 h-4 border border-outline rounded bg-surface-container-high checked:bg-primary checked:border-primary transition-all duration-200" 
                                        />
                                        <svg className="absolute w-3 h-3 text-on-primary opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-[11px] text-surface-on-variant font-medium">Remember me for 30 days</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loginMutation.isPending}
                                className="w-full flex items-center justify-center gap-2 py-4 px-6 mt-4 rounded-2xl bg-primary text-white text-sm font-bold shadow-xl shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loginMutation.isPending ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                                        Verifying…
                                    </>
                                ) : 'Sign In'}
                            </button>

                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-outline-variant/30"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-surface-on-variant bg-surface-container px-2">
                                    Or continue with
                                </div>
                            </div>

                            <div className="w-full rounded-2xl overflow-hidden border border-outline-variant/30">
                                <GoogleLogin
                                    onSuccess={(credentialResponse) => {
                                        googleLoginMutation.mutate(credentialResponse.credential);
                                    }}
                                    onError={() => {
                                        setErrors({ submit: 'Google Login Failed' });
                                    }}
                                    useOneTap
                                    theme="outline"
                                    shape="rectangular"
                                    width="100%"
                                />
                            </div>
                        </form>

                        <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center">
                            <p className="text-xs text-surface-on-variant">
                                New to {app_name}?{' '}
                                <Link to="/register" className="text-primary font-bold hover:underline">
                                    Create account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom navigation */}
                <div className="mt-6 flex items-center justify-center gap-4">
                    <Link to="/" className="text-[11px] font-bold text-surface-on-variant hover:text-primary uppercase tracking-wider transition-colors">
                        Home
                    </Link>
                    <span className="w-1 h-1 rounded-full bg-outline-variant/60" />
                    <Link to="/help" className="text-[11px] font-bold text-surface-on-variant hover:text-primary uppercase tracking-wider transition-colors">
                        Help
                    </Link>
                    <span className="w-1 h-1 rounded-full bg-outline-variant/60" />
                    <Link to="/privacy" className="text-[11px] font-bold text-surface-on-variant hover:text-primary uppercase tracking-wider transition-colors">
                        Privacy
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
