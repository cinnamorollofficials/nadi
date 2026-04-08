import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { GoogleLogin } from "@react-oauth/google";
import TextField from "../components/TextField";
import { useSettings } from "../context/SettingsContext";
import apiClient from "../api/client";

const Login = () => {
  const navigate = useNavigate();
  const { logo, app_name } = useSettings();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember_me: false,
  });
  const [errors, setErrors] = useState({});

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await apiClient.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.data.requires_2fa) {
        navigate("/2fa-challenge", {
          state: { tempToken: data.data.temp_token },
        });
        return;
      }
      localStorage.setItem("token", data.data.access_token);
      if (data.data.refresh_token) {
        localStorage.setItem("refresh_token", data.data.refresh_token);
      }
      localStorage.setItem("user", JSON.stringify(data.data.user));
      navigate("/dashboard");
    },
    onError: (error) => {
      setErrors({
        submit:
          error.response?.data?.meta?.message || "Invalid email or password",
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    loginMutation.mutate(formData);
  };

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
              <div className="w-16 h-16 rounded-2xl bg-primary/20 backdrop-blur-md flex items-center justify-center text-primary mb-6 border border-white/10 shadow-2xl">
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
            )}
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-slate-400 mt-2 font-medium">
              Sign in to your {app_name} account
            </p>
          </div>

          <div className="max-w-md space-y-6 animate-slide-up">
            <div className="w-16 h-1 w-16 bg-primary rounded-full" />
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
              Cerdas Menjaga <br />
              <span className="text-primary">Kesehatan</span> <br />
              Masa Depan
            </h2>
            <p className="text-lg text-slate-300 font-medium leading-relaxed">
              Platform kesehatan terintegrasi dengan teknologi AI tercanggih
              untuk kualitas hidup yang lebih baik.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 xl:p-24 relative z-10 bg-white dark:bg-slate-950/20">
        <div className="lg:hidden absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[130px] animate-pulse" />
        <div className="lg:hidden absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-nadi-rose/10 rounded-full blur-[130px] animate-pulse delay-700" />

        <div className="w-full max-w-sm relative">
          <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-outline-variant/30 dark:border-transparent shadow-2xl overflow-hidden p-8">
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
                  <Link
                    to="/forgot-password"
                    title="forgot-password"
                    className="text-[11px] font-bold text-primary hover:text-primary-600 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div className="flex items-center px-1">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    name="remember_me"
                    checked={formData.remember_me}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-outline"
                  />
                  <span className="text-[11px] text-surface-on-variant font-medium ml-2">
                    Remember me for 30 days
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full py-4 px-6 mt-4 rounded-2xl bg-primary text-white text-sm font-bold shadow-xl shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginMutation.isPending ? "Verifying…" : "Sign In"}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant/30 dark:border-transparent"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-surface-on-variant bg-white dark:bg-slate-900 px-2">
                  Or continue with
                </div>
              </div>

              <div className="w-full rounded-2xl overflow-hidden border border-outline-variant/30 dark:border-transparent">
                <GoogleLogin
                  onSuccess={(credentialResponse) =>
                    googleLoginMutation.mutate(credentialResponse.credential)
                  }
                  onError={() => setErrors({ submit: "Google Login Failed" })}
                  useOneTap
                  theme="outline"
                  shape="rectangular"
                  width="100%"
                />
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-outline-variant/30 dark:border-transparent text-center">
              <p className="text-xs text-surface-on-variant">
                New to {app_name}?{" "}
                <Link
                  to="/register"
                  className="text-primary font-bold hover:underline"
                >
                  Create account
                </Link>
              </p>
            </div>
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

export default Login;
