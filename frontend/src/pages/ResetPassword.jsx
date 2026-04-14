import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { resetPassword, validateResetToken } from "../api/auth";
import TextField from "../components/TextField";
import { useSettings } from "../context/SettingsContext";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const { logo, app_name } = useSettings();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validate token when component mounts
  const {
    data: tokenValidation,
    isLoading: isValidatingToken,
    error: tokenError,
  } = useQuery({
    queryKey: ["validateResetToken", token],
    queryFn: () => validateResetToken(token),
    enabled: !!token,
    retry: false,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successfully!");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.meta?.message || "Failed to reset password.",
      );
    },
  });

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing token");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    resetPasswordMutation.mutate({ token, password });
  };

  // Don't render anything if no token
  if (!token) return null;

  // Show loading while validating token
  if (isValidatingToken) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />

        <div className="w-full max-w-sm relative z-10">
          <div className="bg-surface-container rounded-2xl overflow-hidden">
            <div className="p-6">
              <div className="text-center py-8">
                <div className="w-8 h-8 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm text-surface-on-variant">
                  Validating reset link...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (tokenError) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />

        <div className="w-full max-w-sm relative z-10">
          <div className="bg-surface-container rounded-2xl overflow-hidden">
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
                  <div className="w-14 h-14 mx-auto rounded-xl bg-error/10 flex items-center justify-center text-error mb-4">
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
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                )}
                <h1 className="text-xl font-bold text-surface-on">
                  Invalid Reset Link
                </h1>
                <p className="text-xs text-surface-on-variant mt-1.5 opacity-80">
                  {tokenError?.response?.data?.meta?.message || 
                   "This password reset link is invalid or has expired."}
                </p>
              </div>

              <div className="space-y-4">
                <Link
                  to="/forgot-password"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-primary text-on-primary text-sm font-bold shadow-md shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.98]"
                >
                  Request New Reset Link
                </Link>
                
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full border border-outline-variant text-surface-on text-sm font-bold transition-all hover:bg-surface-container-high active:scale-[0.98]"
                >
                  ← Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Token is valid, show the reset password form
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-sm relative z-10">
        {/* Main Card */}
        <div className="bg-surface-container rounded-2xl overflow-hidden">
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
                <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              )}
              <h1 className="text-xl font-bold text-surface-on">
                Reset Password
              </h1>
              <p className="text-xs text-surface-on-variant mt-1.5 opacity-80">
                Please enter your new password to restore access.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
              />

              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                required
              />

              <button
                type="submit"
                disabled={resetPasswordMutation.isPending}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 mt-2 rounded-full bg-primary text-on-primary text-sm font-bold shadow-md shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resetPasswordMutation.isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                    Updating…
                  </>
                ) : (
                  "Save New Password"
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center">
              <Link
                to="/login"
                className="text-xs font-bold text-primary hover:underline"
              >
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;