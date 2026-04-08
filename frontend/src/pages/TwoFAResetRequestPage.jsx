import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../api/client";
import toast from "react-hot-toast";
import { useSettings } from "../context/SettingsContext";

const TwoFAResetRequestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tempToken = location.state?.tempToken;
  const [isSent, setIsSent] = useState(false);
  const { logo, app_name } = useSettings();

  const resetRequestMutation = useMutation({
    mutationFn: async (temp_token) => {
      const res = await apiClient.post("/auth/2fa/reset-request", {
        temp_token,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.meta?.message || "Reset link sent to your email!");
      setIsSent(true);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.meta?.message || "Failed to send reset link.",
      );
    },
  });

  const handleRequest = () => {
    if (!tempToken) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }
    resetRequestMutation.mutate(tempToken);
  };

  if (isSent) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-primary/5 blur-[120px]" />
        <div className="w-full max-w-sm relative z-10">
          <div className="bg-surface-container rounded-2xl border border-outline-variant/30 shadow-xl overflow-hidden text-center">
            <div className="px-5 py-4 border-b border-outline-variant/20 bg-surface-container-low">
              <p className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">
                Email Sent
              </p>
            </div>
            <div className="p-8 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h1 className="text-xl font-bold text-surface-on">
                  Check your email
                </h1>
                <p className="text-xs text-surface-on-variant leading-relaxed">
                  We've sent a secure link to disable 2FA to your registered
                  email address.
                </p>
              </div>
              <div className="pt-4">
                <Link
                  to="/login"
                  className="px-8 py-3 rounded-full bg-primary text-on-primary text-sm font-bold shadow-md shadow-primary/20 hover:brightness-110 inline-block transition-all"
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

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-primary/5 blur-[120px]" />
      <div className="w-full max-w-sm relative z-10">
        <div className="bg-surface-container rounded-2xl border border-outline-variant/30 shadow-xl overflow-hidden">
          {/* Card Header */}
          <div className="px-5 py-4 border-b border-outline-variant/20 bg-surface-container-low flex items-center justify-between">
            <p className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">
              2FA Recovery
            </p>
            <div className="flex items-center gap-1.5 opacity-60">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">
                Identity Mode
              </span>
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
                    onClick={
                      // navigate to home page
                      navigate("/")
                    }
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 mx-auto rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4">
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              )}
              <h1 className="text-xl font-bold text-surface-on">
                Reset 2FA Access
              </h1>
              <p className="text-xs text-surface-on-variant mt-1.5 opacity-80 px-2">
                Lost access to your authenticator? We'll send a link to your
                email to safely disable 2FA.
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-center text-amber-700 dark:text-amber-400">
                By continuing, you confirm you've lost access to your 2FA
                device.
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleRequest}
                  disabled={resetRequestMutation.isPending}
                  className="w-full h-12 rounded-full bg-primary text-on-primary font-bold shadow-md shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resetRequestMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                      Sending Link…
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/2fa-challenge", { state: { tempToken } })
                  }
                  className="w-full text-xs font-bold text-surface-on-variant uppercase tracking-wider hover:text-primary transition-colors py-2"
                >
                  ← Back to Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFAResetRequestPage;
