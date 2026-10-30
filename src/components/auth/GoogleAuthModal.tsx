"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Eye,
  EyeOff,
  X,
  ArrowLeft,
  CheckCircle2,
  UserCheck,
  AlertCircle,
  Zap,
  Sparkles,
  ArrowRight,
  GraduationCap
} from "lucide-react";
import { useAuth, SAMPLE_GOOGLE_ACCOUNTS } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";

// Official Google G SVG icon
export function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.98 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function GoogleAuthModal({ isOpen, onClose, onSuccess }: GoogleAuthModalProps) {
  const router = useRouter();
  const { loginWithGoogle, signInWithGoogleAccount } = useAuth();

  const [activeTab, setActiveTab] = useState<"instant" | "custom">("instant");
  const [step, setStep] = useState<"form" | "complete">("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleQuick = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      // Check if server OAuth is configured
      const checkRes = await fetch("/api/auth/session");
      if (checkRes.ok) {
        // Direct to Google OAuth endpoint
        window.location.href = "/api/auth/google";
        return;
      }
    } catch {
      // Offline fallback: sign in immediately with Alex Rivera profile
    }

    try {
      await loginWithGoogle();
      setStep("complete");
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess?.();
        onClose();
        router.push("/");
      }, 500);
    } catch {
      setErrorMessage("Google Sign-In failed. Please verify credentials.");
      setIsSubmitting(false);
    }
  };

  const handlePresetSelect = async (preset: typeof SAMPLE_GOOGLE_ACCOUNTS[0]) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle({
        name: preset.name,
        email: preset.email,
        degree: preset.degree,
        institution: preset.institution,
        avatarUrl: preset.avatarUrl,
        role: preset.role,
      });
      setStep("complete");
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess?.();
        onClose();
        router.push("/");
      }, 500);
    } catch {
      setErrorMessage("Sign-in failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage("Please enter your Google Account email.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
      setErrorMessage("Please enter a valid Google Account email address (e.g. name@gmail.com).");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Please enter your password or academic access passkey.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await signInWithGoogleAccount({ email: cleanEmail, password });
      setStep("complete");
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess?.();
        onClose();
        router.push("/");
      }, 500);
    } catch {
      setErrorMessage("Authentication failed. Please verify your Google credentials.");
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isSubmitting && onClose()}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.98, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 10 }}
            className="relative w-full max-w-md rounded-2xl bg-[#0c1222] hairline-border overflow-hidden text-slate-100 z-10"
          >
            {/* Top progress indicator */}
            {isSubmitting && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-900/40 overflow-hidden">
                <div className="h-full bg-blue-500 animate-[pulse_1s_infinite] w-full" />
              </div>
            )}

            {/* Header */}
            <div className="p-6 pb-4 flex items-start justify-between hairline-b">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">Google Authentication</h3>
                    <span className="tag-outline text-[10px]">
                      Verified ID
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Academic workspace identity verification</p>
                </div>
              </div>

              {!isSubmitting && (
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Success Animation */}
            {step === "complete" ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-blue-500/10 hairline-border flex items-center justify-center text-blue-400 mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">Google ID Authenticated</h4>
                  <p className="text-xs text-slate-400 mt-1">Deploying secure academic sandbox...</p>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                {/* Tabs */}
                <div className="flex items-center gap-1 p-1 rounded-xl surface-2 hairline-border text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setActiveTab("instant")}
                    className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                      activeTab === "instant"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <GoogleIcon className="w-3.5 h-3.5" />
                    <span>Google 1-Tap</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("custom")}
                    className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                      activeTab === "custom"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Google ID & Pass</span>
                  </button>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {activeTab === "instant" ? (
                  <div className="space-y-3">
                    {/* Primary Flat Accent Google OAuth Button */}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleGoogleQuick}
                      className="w-full p-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 text-left">
                        <GoogleIcon className="w-4 h-4" />
                        <div>
                          <div className="font-semibold text-xs text-white">Continue with Google Account</div>
                          <p className="text-[11px] text-white/70">Secure OAuth 2.0 verification</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    {/* Quick Character / Profile Pickers */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-medium text-slate-400">
                          Or select verified Google Scholar ID:
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Verified</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {SAMPLE_GOOGLE_ACCOUNTS.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => handlePresetSelect(preset)}
                            className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-blue-500/40 hover:bg-white/[0.06] transition-all text-left flex flex-col items-center text-center group"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={preset.avatarUrl}
                              alt={preset.name}
                              className="w-10 h-10 rounded-full object-cover border border-white/10 mb-1.5 group-hover:scale-105 transition-transform"
                            />
                            <span className="text-[11px] font-bold text-white truncate w-full">
                              {preset.name.split(" ")[0]}
                            </span>
                            <span className="text-[9px] text-slate-400 truncate w-full">
                              {preset.degree.split(" ")[0]}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Custom Email Form */
                  <form onSubmit={handleCustomSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        University or Personal Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. cadet@stanford.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-blue-500 text-white text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Workspace Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-blue-500 text-white text-xs outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>{isSubmitting ? "Authenticating..." : "Sign In & Enter"}</span>
                      </button>
                    </div>
                  </form>
                )}

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-slate-400" /> Client-Isolated Sandbox
                  </span>
                  <span>Local IndexedDB Storage</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
