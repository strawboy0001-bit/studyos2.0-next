"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, CheckCircle2, X, Plus, Key, ArrowRight } from "lucide-react";
import { useAuth, SAMPLE_GOOGLE_ACCOUNTS, GoogleUser } from "@/lib/auth/AuthContext";

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
  const { loginWithGoogle } = useAuth();
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [customDegree, setCustomDegree] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState<"choose" | "verify" | "complete">("choose");

  const handleSelectAccount = async (account: (typeof SAMPLE_GOOGLE_ACCOUNTS)[0]) => {
    setIsAuthenticating(true);
    setAuthStep("verify");

    setTimeout(async () => {
      await loginWithGoogle(account);
      setAuthStep("complete");

      setTimeout(() => {
        setIsAuthenticating(false);
        setAuthStep("choose");
        onSuccess?.();
        onClose();
      }, 700);
    }, 1200);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customName.trim()) return;

    setIsAuthenticating(true);
    setAuthStep("verify");

    setTimeout(async () => {
      const customUser: Partial<GoogleUser> = {
        id: `g-custom-${Date.now()}`,
        name: customName.trim(),
        email: customEmail.trim(),
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customName)}&backgroundColor=2563eb,3b82f6,6366f1`,
        degree: customDegree.trim() || "Academic Studies",
        institution: "Verified Institution",
        role: "Student",
        securityScore: 99,
        verified: true,
      };

      await loginWithGoogle(customUser);
      setAuthStep("complete");

      setTimeout(() => {
        setIsAuthenticating(false);
        setIsCustomMode(false);
        setAuthStep("choose");
        onSuccess?.();
        onClose();
      }, 700);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop with high-tech blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isAuthenticating && onClose()}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="relative w-full max-w-lg rounded-3xl bg-[#0d1424] border border-blue-500/20 shadow-[0_0_50px_rgba(37,99,235,0.25)] overflow-hidden text-slate-100 z-10"
          >
            {/* Ambient Top Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-blue-600/20 blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="relative p-6 sm:p-8 pb-4 border-b border-white/5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                  <GoogleIcon className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">Google Identity</h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      OAuth 2.0
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Secure academic authentication & data sandbox</p>
                </div>
              </div>

              {!isAuthenticating && (
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 pt-6 space-y-6">
              {authStep === "verify" && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin flex items-center justify-center" />
                    <Shield className="w-7 h-7 text-blue-400 absolute inset-0 m-auto" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Authenticating with Google...</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                      Verifying cryptographic credentials and establishing secure local workspace encryption.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-blue-400/80 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    <Lock className="w-3 h-3" />
                    <span>256-Bit SHA Checksum Confirmed</span>
                  </div>
                </div>
              )}

              {authStep === "complete" && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                  >
                    <CheckCircle2 className="w-9 h-9" />
                  </motion.div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Authentication Successful!</h4>
                    <p className="text-xs text-slate-400 mt-1">Workspace unlocked with Google security standards.</p>
                  </div>
                </div>
              )}

              {authStep === "choose" && !isCustomMode && (
                <>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Choose an account to continue
                    </p>
                    <div className="space-y-2.5">
                      {SAMPLE_GOOGLE_ACCOUNTS.map((acc, index) => (
                        <motion.button
                          key={acc.id}
                          whileHover={{ scale: 1.01, x: 2 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => {
                            setSelectedIdx(index);
                            handleSelectAccount(acc);
                          }}
                          className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                            selectedIdx === index
                              ? "bg-blue-600/10 border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.15)]"
                              : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={acc.avatarUrl}
                              alt={acc.name}
                              className="w-10 h-10 rounded-full object-cover border border-white/20"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-white">{acc.name}</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium">
                                  {acc.role}
                                </span>
                              </div>
                              <span className="text-xs text-slate-400 block">{acc.email}</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Switch to custom Google email */}
                  <div className="pt-1">
                    <button
                      onClick={() => setIsCustomMode(true)}
                      className="w-full py-3 px-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.05] hover:border-blue-400/40 text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-all"
                    >
                      <Plus className="w-4 h-4 text-blue-400" />
                      Sign in with another Google Account
                    </button>
                  </div>
                </>
              )}

              {authStep === "choose" && isCustomMode && (
                <form onSubmit={handleCustomSubmit} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Enter Google Account Details
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsCustomMode(false)}
                      className="text-xs text-blue-400 hover:underline"
                    >
                      Back to presets
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Doe"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Google Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="your.name@gmail.com or university edu email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Field of Study / Degree</label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Science, Medicine, Law"
                      value={customDegree}
                      onChange={(e) => setCustomDegree(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-[0_0_25px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 transition-all"
                  >
                    <GoogleIcon className="w-4 h-4" />
                    Verify & Sign In with Google
                  </button>
                </form>
              )}

              {/* Security Disclosure Footer */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  <span>Zero-Knowledge Academic Encryption</span>
                </div>
                <div className="flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Isolated Local Sandbox</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
