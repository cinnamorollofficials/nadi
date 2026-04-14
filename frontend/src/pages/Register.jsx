import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { GoogleLogin } from "@react-oauth/google";
import TextField from "../components/TextField";
import { useSettings } from "../context/SettingsContext";
import apiClient from "../api/client";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const { logo, registration_open } = useSettings();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleId: 3,
  });
  const [errors, setErrors] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);

  const isRegistrationClosed = registration_open === "false" || registration_open === false;

  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const { confirmPassword, ...dataToSend } = userData;
      const response = await apiClient.post("/auth/register", {
        ...dataToSend,
        role_id: userData.roleId,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Registration successful! Please check your email.");
      setIsRegistered(true);
    },
    onError: (error) => {
      setErrors({
        submit:
          error.response?.data?.meta?.message ||
          "Registration failed. Please try again.",
      });
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: async (credential) => {
      const response = await apiClient.post("/auth/google", { credential });
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.access_token);
      if (data.data.refresh_token) {
        localStorage.setItem("refresh_token", data.data.refresh_token);
      }
      localStorage.setItem("user", JSON.stringify(data.data.user));
      navigate("/dashboard");
    },
    onError: (error) => {
      setErrors({
        submit: error.response?.data?.meta?.message || "Google login failed",
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegistrationClosed) {
      toast.error("Registration is currently closed.");
      return;
    }
    setErrors({});
    const validationErrors = validateForm();
    const strength = getPasswordStrength(formData.password);
    if (strength.strength < 2) {
      toast.error("Please use a stronger password.");
      return;
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    registerMutation.mutate(formData);
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    const colors = [
      "",
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-green-600",
    ];
    return { strength, label: labels[strength], color: colors[strength] };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row relative overflow-hidden">
      {/* LEFT PANEL - Branding Visual (LG only) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] relative overflow-hidden bg-slate-950">
        <img
          src="/Users/hadigunawan/.gemini/antigravity/brain/e1d60941-6366-4919-bff9-48eb95d732d0/medical_ai_login_bg_1775549021496.png"
          alt="Medical AI Branding"
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-110 animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-20 w-full h-full">
          <div className="animate-slide-up">
            {logo ? (
              <div className="w-16 h-16 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-3 mb-6 shadow-2xl">
                <img
                  src={`${import.meta.env.VITE_API_URL}/public/storage/${logo}`}
                  alt="Logo"
                  onClick={() => navigate("/")}
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-primary/20 backdrop-blur-md flex items-center justify-center text-primary mb-6 border border-white/10 shadow-2xl shadow-primary/20">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
            )}
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {isRegistered
                ? "Success"
                : isRegistrationClosed
                  ? "Locked"
                  : "Create Account"}
            </h1>
            <p className="text-slate-400 mt-2 font-medium">
              {isRegistered
                ? "Check your mailbox"
                : isRegistrationClosed
                  ? "Registration closed"
                  : "Start your journey with NADI"}
            </p>
          </div>

          <div className="max-w-md space-y-6 animate-slide-up">
            <div className="w-16 h-1 w-16 bg-primary rounded-full" />
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
              Bergabung Bersama <br />
              <span className="text-primary">Nadi</span> <br />
              Sekarang
            </h2>
            <p className="text-lg text-slate-300 font-medium leading-relaxed">
              Mulai perjalanan kesehatan Anda dengan platform terpercaya. Data
              aman, diagnosis cerdas.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 xl:p-24 relative z-10 bg-white dark:bg-slate-950/20">
        <div className="lg:hidden absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[130px] animate-pulse" />
        <div className="lg:hidden absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-nadi-rose/10 rounded-full blur-[130px] animate-pulse delay-700" />

        <div className="w-full max-w-md relative">
          <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-outline-variant/30 dark:border-transparent shadow-2xl overflow-hidden p-8">
            {isRegistered ? (
              <div className="text-center py-4 space-y-6">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-green-500/10 flex items-center justify-center text-green-500 mb-6 shadow-inner">
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-surface-on tracking-tight">
                    Check Your Inbox
                  </h2>
                  <p className="text-sm text-surface-on-variant leading-relaxed px-6 opacity-80">
                    We've sent a verification link to{" "}
                    <span className="font-bold text-primary">
                      {formData.email}
                    </span>
                    .
                  </p>
                </div>
                <div className="pt-6">
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-3 px-8 rounded-full bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:brightness-110 transition-all font-bold"
                  >
                    Return to Sign In
                  </button>
                </div>
              </div>
            ) : isRegistrationClosed ? (
              <div className="text-center py-6 space-y-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-error/10 flex items-center justify-center text-error mb-4">
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-surface-on-variant px-4">
                  Registration is currently disabled.
                </p>
                <div className="pt-4">
                  <Link
                    to="/login"
                    className="px-8 py-3 rounded-full bg-primary text-white text-sm font-bold inline-block"
                  >
                    ← Back to Login
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errors.submit && (
                    <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-medium text-center">
                      {errors.submit}
                    </div>
                  )}
                  <TextField
                    label="Full Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
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
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded ${level <= passwordStrength.strength ? passwordStrength.color : "bg-outline-variant/30"}`}
                          />
                        ))}
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

                  <button
                    type="submit"
                    disabled={registerMutation.isPending || isRegistrationClosed}
                    className="w-full py-4 px-6 mt-4 rounded-2xl bg-primary text-white text-sm font-bold shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {registerMutation.isPending
                      ? "Creating Account…"
                      : isRegistrationClosed
                      ? "Registration Closed"
                      : "Create Account"}
                  </button>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-outline-variant/30 dark:border-transparent"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-surface-on-variant bg-white dark:bg-slate-900 px-2">
                      Or sign up with
                    </div>
                  </div>

                  <div className="w-full rounded-2xl overflow-hidden border border-outline-variant/30 dark:border-transparent">
                    <GoogleLogin
                      onSuccess={(res) =>
                        googleLoginMutation.mutate(res.credential)
                      }
                      onError={() => setErrors({ submit: "Google failed" })}
                      useOneTap
                      theme="outline"
                      shape="rectangular"
                      width="100%"
                    />
                  </div>
                </form>
                <div className="mt-8 pt-6 border-t border-outline-variant/30 dark:border-transparent text-center">
                  <p className="text-xs text-surface-on-variant">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-primary font-bold hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
                @keyframes pulse-slow { 0%, 100% { opacity: 0.5; transform: scale(1.1); } 50% { opacity: 0.7; transform: scale(1.15); } }
                .animate-pulse-slow { animation: pulse-slow 10s ease-in-out infinite; }
            `,
        }}
      />
    </div>
  );
};

export default Register;
