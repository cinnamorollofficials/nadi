import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../api/client";
import { useSettings } from "../context/SettingsContext";
import { safeStringify } from "../utils/json";

const TwoFAChallengePage = () => {
  const { logo, app_name } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const tempToken = location.state?.tempToken;
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const verifyMutation = useMutation({
    mutationFn: async ({ temp_token, code }) => {
      const res = await apiClient.post("/auth/2fa/verify", {
        temp_token,
        code,
      });
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.access_token);
      if (data.data.refresh_token) {
        localStorage.setItem("refresh_token", data.data.refresh_token);
      }
      localStorage.setItem("user", safeStringify(data.data.user));
      const destination = data.data.user.role_id === 3 ? "/dashboard" : "/admin";
      navigate(destination);
    },
    onError: (err) => {
      setError(
        err.response?.data?.meta?.message || "Invalid code. Please try again.",
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!tempToken) {
      setError("Session expired. Please login again.");
      return;
    }
    verifyMutation.mutate({ temp_token: tempToken, code });
  };

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
                    onClick={() => navigate("/")}
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              )}
              <h1 className="text-xl font-bold text-surface-on">
                Two-Factor Auth
              </h1>
              <p className="text-xs text-surface-on-variant mt-1.5 opacity-80">
                Enter the 6-digit code from your app
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-medium text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest px-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-full h-14 bg-surface-container-highest border border-outline rounded-xl text-center text-3xl tracking-[0.5em] font-mono text-surface-on focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                disabled={verifyMutation.isPending || code.length !== 6}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-primary text-on-primary text-sm font-bold shadow-md shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifyMutation.isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                    Verifying…
                  </>
                ) : (
                  "Unlock Account"
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-outline-variant/30 flex flex-col gap-3 items-center">
              <button
                type="button"
                onClick={() =>
                  navigate("/twofa/reset-request", { state: { tempToken } })
                }
                className="text-xs font-bold text-primary hover:underline"
              >
                Lost access to OTP?
              </button>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-[10px] font-bold text-surface-on-variant uppercase tracking-wider hover:text-primary transition-colors"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFAChallengePage;
