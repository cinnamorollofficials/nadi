import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { validateEmailToken } from "../api/auth";
import apiClient from "../api/client";
import { useSettings } from "../context/SettingsContext";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const { logo, app_name } = useSettings();
  const [success, setSuccess] = useState(false);

  // Validate token when component mounts
  const {
    data: tokenValidation,
    isLoading: isValidatingToken,
    error: tokenError,
  } = useQuery({
    queryKey: ["validateEmailToken", token],
    queryFn: () => validateEmailToken(token),
    enabled: !!token,
    retry: false,
  });

  const verifyMutation = useMutation({
    mutationFn: async (token) => {
      const response = await apiClient.post("/auth/verify-email", { token });
      return response.data;
    },
    onSuccess: () => {
      setSuccess(true);
      toast.success("Email verified successfully! You can now log in.");
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.meta?.message ||
          "Verification failed. The link may be invalid or expired.",
      );
    },
  });

  useEffect(() => {
    if (!token) {
      toast.error("Missing verification token");
      navigate("/login");
    }
  }, [token, navigate]);

  // Auto-verify when token validation succeeds
  useEffect(() => {
    if (tokenValidation && !tokenError && !verifyMutation.isPending && !success) {
      verifyMutation.mutate(token);
    }
  }, [tokenValidation, tokenError, token, verifyMutation, success]);

  // Don't render anything if no token
  if (!token) return null;

  // Show loading while validating token
  if (isValidatingToken) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full [120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full [120px]" />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-surface-container rounded-2xl border border-outline-variant/30  overflow-hidden">
            <div className="px-5 py-4 border-b border-outline-variant/20 bg-surface-container-low flex items-center justify-between">
              <p className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">
                Email Verification
              </p>
              <div className="flex items-center gap-1.5 opacity-60">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">
                  Validating
                </span>
              </div>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                {logo ? (
                  <div className="w-14 h-14 mx-auto rounded-2xl border border-outline-variant/40 bg-surface-container-high p-2 mb-4 ">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/public/storage/${logo}`}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                <h1 className="text-2xl font-bold text-surface-on">
                  Account Activation
                </h1>
              </div>

              <div className="text-center space-y-6">
                <div className="space-y-4 py-4">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-surface-on-variant px-6 line-clamp-2">
                    Validating verification link...
                  </p>
                </div>
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
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full [120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full [120px]" />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-surface-container rounded-2xl border border-outline-variant/30  overflow-hidden">
            <div className="px-5 py-4 border-b border-outline-variant/20 bg-surface-container-low flex items-center justify-between">
              <p className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">
                Email Verification
              </p>
              <div className="flex items-center gap-1.5 opacity-60">
                <span className="w-1.5 h-1.5 rounded-full bg-error" />
                <span className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">
                  Error
                </span>
              </div>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                {logo ? (
                  <div className="w-14 h-14 mx-auto rounded-2xl border border-outline-variant/40 bg-surface-container-high p-2 mb-4 ">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/public/storage/${logo}`}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-error/10 flex items-center justify-center text-error mb-4">
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
                <h1 className="text-2xl font-bold text-surface-on">
                  Invalid Verification Link
                </h1>
              </div>

              <div className="text-center space-y-6">
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto text-error shadow-inner">
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-surface-on">
                      Verification Failed
                    </h2>
                    <p className="text-sm text-surface-on-variant px-4">
                      {tokenError?.response?.data?.meta?.message || 
                       "This verification link is invalid or has expired."}
                    </p>
                  </div>
                  <div className="pt-4 flex flex-col gap-3">
                    <Link
                      to="/register"
                      className="w-full py-3 px-6 rounded-full bg-primary text-on-primary text-sm font-bold   transition-all hover:brightness-110 active:scale-[0.98]"
                    >
                      Register New Account
                    </Link>
                    <Link
                      to="/login"
                      className="text-xs text-primary font-bold hover:underline"
                    >
                      Back to Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Token is valid, show verification process or success
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full [120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full [120px]" />

      <div className="w-full max-w-md relative z-10">
        {/* Main Card */}
        <div className="bg-surface-container rounded-2xl border border-outline-variant/30  overflow-hidden">
          {/* Card Header */}
          <div className="px-5 py-4 border-b border-outline-variant/20 bg-surface-container-low flex items-center justify-between">
            <p className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">
              Email Verification
            </p>
            <div className="flex items-center gap-1.5 opacity-60">
              <span
                className={`w-1.5 h-1.5 rounded-full ${success ? "bg-green-500" : verifyMutation.isPending ? "bg-primary animate-pulse" : "bg-primary"}`}
              />
              <span className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">
                {success
                  ? "Success"
                  : verifyMutation.isPending
                    ? "Verifying"
                    : "Ready"}
              </span>
            </div>
          </div>

          <div className="p-8">
            {/* Branding */}
            <div className="text-center mb-8">
              {logo ? (
                <div className="w-14 h-14 mx-auto rounded-2xl border border-outline-variant/40 bg-surface-container-high p-2 mb-4 ">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/public/storage/${logo}`}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              <h1 className="text-2xl font-bold text-surface-on">
                Account Activation
              </h1>
            </div>

            <div className="text-center space-y-6">
              {verifyMutation.isPending ? (
                <div className="space-y-4 py-4">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-surface-on-variant px-6 line-clamp-2">
                    Verifying your email address with {app_name}. Please wait a
                    moment...
                  </p>
                </div>
              ) : success ? (
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500 shadow-inner">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-surface-on">
                      Email Verified!
                    </h2>
                    <p className="text-sm text-surface-on-variant px-4">
                      Your account is now active and ready to use. You can now
                      log in to your dashboard.
                    </p>
                  </div>
                  <div className="pt-4">
                    <Link
                      to="/login"
                      className="w-full inline-block py-3 px-6 rounded-full bg-primary text-on-primary text-sm font-bold   transition-all hover:brightness-110 active:scale-[0.98]"
                    >
                      Go to Sign In
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-surface-on-variant px-6 line-clamp-2">
                    Preparing to verify your email address...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Section */}
        {!verifyMutation.isPending && !isValidatingToken && (
          <div className="mt-8 flex items-center justify-center gap-4 text-xs font-bold text-surface-on-variant uppercase tracking-widest opacity-60">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="w-1 h-1 rounded-full bg-outline-variant" />
            <Link to="/help" className="hover:text-primary transition-colors">
              Help Center
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;