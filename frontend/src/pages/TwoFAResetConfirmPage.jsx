import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../api/client";
import toast from "react-hot-toast";
import { useSettings } from "../context/SettingsContext";

const TwoFAResetConfirmPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { logo, app_name } = useSettings();

  const confirmMutation = useMutation({
    mutationFn: async (token) => {
      const res = await apiClient.post("/auth/2fa/reset-confirm", { token });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.meta?.message || "2FA disabled successfully!");
      setIsConfirmed(true);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.meta?.message || "Failed to disable 2FA.",
      );
    },
  });

  const handleConfirm = () => {
    if (!token) {
      toast.error("Token is missing.");
      return;
    }
    confirmMutation.mutate(token);
  };

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-green-500/5 blur-[120px]" />
        <div className="w-full max-w-sm relative z-10">
          <div className="bg-surface-container rounded-2xl border border-outline-variant/30 shadow-xl overflow-hidden text-center">
            <div className="px-5 py-4 border-b border-outline-variant/20 bg-surface-container-low">
              <p className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">
                Success
              </p>
            </div>
            <div className="p-8 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h1 className="text-xl font-bold text-surface-on">
                  2FA Disabled
                </h1>
                <p className="text-xs text-surface-on-variant leading-relaxed px-4">
                  Your account is now accessible without 2FA. You can re-enable
                  it later in your profile settings.
                </p>
              </div>
              <div className="pt-4">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-3 rounded-full bg-primary text-on-primary text-sm font-bold shadow-md shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  Continue to Login
                </button>
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
              Final Confirmation
            </p>
            <div className="flex items-center gap-1.5 opacity-60">
              <span className="w-1.5 h-1.5 rounded-full bg-error" />
              <span className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">
                Action Required
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
                    onClick={() => navigate("/")}
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              )}
              <h1 className="text-xl font-bold text-surface-on">Disable 2FA</h1>
              <p className="text-xs text-surface-on-variant mt-1.5 opacity-80 px-4 leading-relaxed">
                Please confirm that you want to permanently disable Two-Factor
                Authentication for this account.
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-3.5 rounded-xl bg-error/10 border border-error/20 text-xs font-semibold text-center text-error">
                This action will reduce the security level of your account.
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleConfirm}
                  disabled={confirmMutation.isPending || !token}
                  className="w-full h-12 rounded-full bg-primary text-on-primary font-bold shadow-md shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {confirmMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                      Processing…
                    </span>
                  ) : (
                    "Confirm & Disable 2FA"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full text-xs font-bold text-surface-on-variant uppercase tracking-wider hover:text-primary transition-colors py-2"
                >
                  ← Cancel & Exit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFAResetConfirmPage;
