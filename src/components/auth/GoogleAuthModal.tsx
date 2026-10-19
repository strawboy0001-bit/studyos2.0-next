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
  const { loginAsGuest, loginWithGoogle, signInWithGoogleAccount, savedAccounts } = useAuth();

  const [activeTab, setActiveTab] = useState<"instant" | "custom">("instant");
  const [step, setStep] = useState<"form" | "complete">("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");

  const handleGuestLogin = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await loginAsGuest(guestName.trim() || undefined);
      setStep("complete");
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess?.();
        onClose();
        router.push("/");
      }, 500);
    } catch {
      setErrorMessage("Could not initialize guest session. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleGoogleQuick = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      // Check if server OAuth is available
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
      setErrorMessage("Google Sign-In failed. Try 1-Tap Guest Access.");
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
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await signInWithGoogleAccount({ email, password });
      setStep("complete");
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess?.();
        onClose();
        router.push("/");
      }, 500);
    } catch {
      setErrorMessage("Invalid credentials. Try 1-Tap Guest or a Quick Profile.");
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
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="relative w-full max-w-md rounded-3xl bg-[#0c1224] border border-blue-500/20 shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden text-slate-100 z-10"
          >
            {/* Top progress indicator */}
            {isSubmitting && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue-900/40 overflow-hidden">
                <div className="h-full bg-blue-500 animate-[pulse_1s_infinite] w-full" />
              </div>
            )}

            {/* Header */}
            <div className="p-6 pb-3 flex items-start justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">StudyOS Pass</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      1-Tap Access
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Instant academic entry like Free Fire</p>
                </div>
              </div>

              {!isSubmitting && (
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Success Animation */}
            {step === "complete" ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Workspace Unlocked!</h4>
                  <p className="text-xs text-slate-400 mt-1">Deploying local academic sandbox...</p>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                {/* Tabs */}
                <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/[0.03] border border-white/10 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab("instant")}
                    className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === "instant"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Quick Play (1-Tap)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("custom")}
                    className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === "custom"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Email & Password</span>
                  </button>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {activeTab === "instant" ? (
                  <div className="space-y-3.5">
                    {/* Primary Free Fire style 1-Tap Guest button */}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleGuestLogin}
                      className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(79,70,229,0.45)] transition-all flex items-center justify-between group active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
                        </div>
                        <div>
                          <div className="font-extrabold flex items-center gap-1.5">
                            <span>1-Tap Guest Access</span>
                            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded uppercase">Fastest</span>
                          </div>
                          <p className="text-[11px] text-white/80 font-normal">Jump straight in • Zero password needed</p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 group-hover:text-white transition-all" />
                    </button>

                    {/* Google OAuth Button */}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleGoogleQuick}
                      className="w-full p-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      <GoogleIcon className="w-4 h-4" />
                      <span>Continue with Google Account</span>
                    </button>

                    {/* Quick Character / Profile Pickers (Free Fire Style) */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Or Pick Cadet Persona:
                        </span>
                        <span className="text-[10px] text-slate-500">1-click switch</span>
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
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>{isSubmitting ? "Authenticating..." : "Sign In & Enter"}</span>
                      </button>
                    </div>
                  </form>
                )}

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-blue-400" /> Free Fire-Grade Fast Access
                  </span>
                  <span>Instant IndexedDB Storage</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
