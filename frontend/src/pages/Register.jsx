import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import TextField from '../components/TextField';
import { useSettings } from '../context/SettingsContext';
import apiClient from '../api/client';

const Register = () => {
    const navigate = useNavigate();
    const { logo, app_name } = useSettings();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        roleId: 3,
    });
    const [errors, setErrors] = useState({});

    const registerMutation = useMutation({
        mutationFn: async (userData) => {
            const { confirmPassword, ...dataToSend } = userData;
            const response = await apiClient.post('/auth/register', {
                ...dataToSend,
                role_id: userData.roleId,
            });
            return response.data;
        },
        onSuccess: () => {
            navigate('/login');
        },
        onError: (error) => {
            setErrors({
                submit: error.response?.data?.meta?.message || 'Registration failed. Please try again.',
            });
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name || formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        registerMutation.mutate(formData);
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];
        return { strength, label: labels[strength], color: colors[strength] };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />

            <div className="w-full max-w-md relative z-10">
                {/* Main Card */}
                <div className="bg-surface-container rounded-2xl border border-outline-variant/30 shadow-xl overflow-hidden">
                    {/* Card Header */}
                    <div className="px-5 py-4 border-b border-outline-variant/20 bg-surface-container-low flex items-center justify-between">
                        <p className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">
                            Join {app_name}
                        </p>
                        <div className="flex items-center gap-1.5 opacity-60">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">New Account</span>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Branding */}
                        <div className="text-center mb-6">
                            {logo ? (
                                <div className="w-12 h-12 mx-auto rounded-xl border border-outline-variant/40 bg-surface-container-high p-2 mb-3 shadow-sm">
                                    <img 
                                        src={`${import.meta.env.VITE_API_URL}/public/storage/${logo}`} 
                                        alt="Logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                            )}
                            <h1 className="text-xl font-bold text-surface-on">Create Account</h1>
                            <p className="text-xs text-surface-on-variant mt-1 opacity-80">Start your journey with us</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {errors.submit && (
                                <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-medium text-center">
                                    {errors.submit}
                                </div>
                            )}

                            <TextField
                                label="Full name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                error={errors.name}
                                required
                            />

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

                            <div className="space-y-2">
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
                                {formData.password && (
                                    <div className="px-1">
                                        <div className="flex gap-1 mb-1">
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded ${level <= passwordStrength.strength ? passwordStrength.color : 'bg-outline-variant/30'}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-[10px] font-bold uppercase tracking-tight text-surface-on-variant opacity-70">
                                            Strength: {passwordStrength.label}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <TextField
                                label="Confirm password"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                error={errors.confirmPassword}
                                required
                            />

                            <div className="pt-2 px-1">
                                <label className="flex items-start cursor-pointer">
                                    <input type="checkbox" className="mr-2 mt-0.5 rounded border-outline" required />
                                    <span className="text-[11px] text-surface-on-variant leading-relaxed">
                                        I agree to the{' '}
                                        <a href="#" className="text-primary font-bold hover:underline">Terms of Service</a>
                                        {' '}and{' '}
                                        <a href="#" className="text-primary font-bold hover:underline">Privacy Policy</a>
                                    </span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={registerMutation.isPending}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 mt-2 rounded-full bg-primary text-on-primary text-sm font-bold shadow-md shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {registerMutation.isPending ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                                        Creating Account…
                                    </>
                                ) : 'Create Account'}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center">
                            <p className="text-xs text-surface-on-variant">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary font-bold hover:underline">
                                    Sign in
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
                </div>
            </div>
        </div>
    );
};

export default Register;
