"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { GoogleIcon } from "@/components/auth/GoogleAuthModal";
import Link from "next/link";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithGoogleAccount, loginWithGoogle, savedAccounts, removeSavedAccount } = useAuth();

  const urlError = searchParams.get("error");
  const urlDetail = searchParams.get("detail");

  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(() => {
    if (urlError === "cancelled") return "Google Sign-In was cancelled or access was denied.";
    if (urlError === "missing_credentials")
      return "Google OAuth credentials not configured in .env.local. Authenticate using your Google ID or verified Scholar profile below.";
    if (urlError === "invalid_state") return "Security state mismatch detected. Please try signing in again.";
    if (urlError) return `Authentication notice: ${urlError.replace(/_/g, " ")}`;
    return null;
  });

  const [showConfigGuide, setShowConfigGuide] = useState(false);

  const handleInstantPersona = async (pName: string, pEmail: string, pDegree: string, pInst: string, pAvatar: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle({
        name: pName,
        email: pEmail,
        degree: pDegree,
        institution: pInst,
        avatarUrl: pAvatar,
      });
      router.push("/");
    } catch {
      setErrorMessage("Sign-in failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const validateEmail = (val: string) => {
    return /\S+@\S+\.\S+/.test(val);
  };

  const handleEmailNext = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setErrorMessage("Enter an email or phone number");
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setErrorMessage("Please enter a valid academic or personal email address.");
      return;
    }

    setStep("password");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!password.trim()) {
      setErrorMessage("Enter your password");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((r) => setTimeout(r, 600));

      await signInWithGoogleAccount({
        email,
        password,
        name: name.trim() || undefined,
        institution: institution.trim() || undefined,
        degree: degree.trim() || undefined,
      });

      router.push("/");
    } catch {
      setErrorMessage("Failed to sign in. Please verify your credentials.");
      setIsSubmitting(false);
    }
  };

  const handleSelectSaved = async (savedEmail: string, savedName: string) => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle({ email: savedEmail, name: savedName });
      router.push("/");
    } catch {
      setEmail(savedEmail);
      setName(savedName);
      setStep("password");
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = (demoEmail: string, demoName: string, demoDegree: string, demoInst: string) => {
    setEmail(demoEmail);
    setName(demoName);
    setDegree(demoDegree);
    setInstitution(demoInst);
    setPassword("GoogleAcademic#2026");
    setStep("password");
  };

  return (
    <div className="min-h-screen bg-[#030d22] flex flex-col items-center justify-center p-4 selection:bg-sky-500/30 font-sans text-slate-100">
      {/* Background subtle illumination */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-sky-500/10 blur-[140px] rounded-full" />
      </div>

      {/* Main Google Accounts Container */}
      <div className="relative w-full max-w-[460px] bg-[#040f26]/90 border border-sky-400/25 rounded-3xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(2,11,28,0.85)] backdrop-blur-xl overflow-hidden">
        {/* Indeterminate loading bar */}
        {isSubmitting && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-sky-950/40 overflow-hidden">
            <div className="h-full bg-[#0084ff] animate-[shimmer_1.5s_infinite] w-full" />
          </div>
        )}

        {/* Unseen Power Art Badge */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl overflow-hidden border border-red-500/30 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/unseen.png" alt="UNSEEN" className="w-full h-full object-cover" />
          </div>
          <span className="text-[10px] font-black tracking-widest text-red-400 uppercase bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
            UNSEEN • POWER
          </span>
        </div>

        {/* Google Header Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 shadow-inner">
            <GoogleIcon className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            {step === "email" ? "Sign in with Google" : "Verify Password"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {step === "email" ? (
              <span>Authenticate your academic workspace session</span>
            ) : (
              <span>Enter your password to unlock StudyOS</span>
            )}
          </p>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="leading-relaxed">{errorMessage}</span>
              {urlDetail && (
                <p className="font-mono text-[10px] text-slate-400 mt-1 truncate">{urlDetail}</p>
              )}
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-amber-400 hover:text-white p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Official Google OAuth 2.0 Sign-In */}
        {step === "email" && (
          <div className="space-y-3 mb-6">
            <a
              href="/api/auth/google"
              className="w-full p-3.5 rounded-xl bg-[#0084ff] hover:bg-[#0074e0] text-white font-medium text-xs flex items-center justify-between transition-colors group cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-3 text-left">
                <GoogleIcon className="w-4 h-4" />
                <div>
                  <div className="font-semibold text-xs text-white">Continue with Google Account</div>
                  <p className="text-[11px] text-white/70">Official Google OAuth 2.0 Identity Protocol</p>
                </div>
              </div>
              <span className="text-xs text-white/90 group-hover:translate-x-0.5 transition-transform">▶</span>
            </a>

            {/* Quick Preset Characters */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                1-Tap Instant Scholar Personas:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleInstantPersona("Alex Rivera", "alex.rivera.cs@gmail.com", "Computer Science & AI", "Stanford University", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80")}
                  className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-sky-400/40 hover:bg-white/[0.07] transition-all text-center flex flex-col items-center group cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80" alt="Alex" className="w-9 h-9 rounded-full object-cover mb-1 border border-white/10 group-hover:scale-105 transition-transform" />
                  <span className="text-[11px] font-bold text-white">Alex</span>
                  <span className="text-[9px] text-slate-400">Stanford</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInstantPersona("Sarah Chen", "sarah.chen.mit@gmail.com", "Biomedical Engineering", "MIT", "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80")}
                  className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-sky-400/40 hover:bg-white/[0.07] transition-all text-center flex flex-col items-center group cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80" alt="Sarah" className="w-9 h-9 rounded-full object-cover mb-1 border border-white/10 group-hover:scale-105 transition-transform" />
                  <span className="text-[11px] font-bold text-white">Sarah</span>
                  <span className="text-[9px] text-slate-400">MIT</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInstantPersona("Dr. Elena Vance", "elena.vance.edu@gmail.com", "Cognitive Neuroscience", "Cambridge Academy", "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80")}
                  className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-sky-400/40 hover:bg-white/[0.07] transition-all text-center flex flex-col items-center group cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80" alt="Elena" className="w-9 h-9 rounded-full object-cover mb-1 border border-white/10 group-hover:scale-105 transition-transform" />
                  <span className="text-[11px] font-bold text-white">Elena</span>
                  <span className="text-[9px] text-slate-400">Cambridge</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 my-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                Or enter custom email
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
          </div>
        )}

        {/* Step 1: Email Form */}
        {step === "email" && (
          <form onSubmit={handleEmailNext} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Google or University Email
              </label>
              <input
                type="email"
                autoFocus
                required
                placeholder="name@gmail.com or edu email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 focus:border-sky-400 focus:bg-white/[0.06] text-white text-xs placeholder-slate-500 outline-none transition-all"
              />
            </div>

            {/* Saved Accounts list */}
            {savedAccounts.length > 0 && (
              <div className="pt-2 border-t border-white/5">
                <p className="text-[11px] text-slate-400 font-medium mb-1.5">Recently used accounts:</p>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {savedAccounts.map((acc) => (
                    <div
                      key={acc.id}
                      onClick={() => handleSelectSaved(acc.email, acc.name)}
                      className="p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-sky-400/30 hover:bg-white/[0.05] cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={acc.avatarUrl}
                          alt={acc.name}
                          className="w-6 h-6 rounded-full object-cover shrink-0 border border-white/10"
                        />
                        <div className="truncate text-left">
                          <p className="text-xs font-semibold text-white truncate">{acc.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{acc.email}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSavedAccount(acc.id);
                        }}
                        className="text-slate-500 hover:text-red-400 p-1"
                        title="Remove from list"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  handleQuickDemo(
                    "surya.academic@gmail.com",
                    "Surya K.",
                    "Software Engineering",
                    "Institute of Technology"
                  )
                }
                className="text-xs font-semibold text-sky-400 hover:text-sky-300"
              >
                Quick Demo Account
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#0084ff] hover:bg-[#0074e0] text-white font-semibold text-xs transition-all shadow-sm"
              >
                Next
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Password Form */}
        {step === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="p-2 px-3 rounded-full bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 text-xs font-bold">
                  {email.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-white truncate max-w-[240px] font-medium">{email}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setPassword("");
                }}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold ml-2 shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Enter Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoFocus
                  required
                  placeholder="Account password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 focus:border-sky-400 focus:bg-white/[0.06] text-white text-xs placeholder-slate-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="mt-2.5 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showPass"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-sky-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="showPass" className="text-xs text-slate-400 cursor-pointer">
                  Show password
                </label>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setPassword("");
                }}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-2.5 rounded-full bg-[#0084ff] hover:bg-[#0074e0] text-white font-semibold text-xs transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Enter Workspace</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Expandable Google OAuth Cloud Configuration Guide */}
        <div className="mt-6 pt-4 border-t border-white/5">
          <button
            type="button"
            onClick={() => setShowConfigGuide(!showConfigGuide)}
            className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>Google Cloud OAuth Setup Guide</span>
            </span>
            {showConfigGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showConfigGuide && (
            <div className="mt-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-300 text-[11px] space-y-2 animate-in fade-in">
              <p className="font-semibold text-white">To enable direct Google Cloud OAuth:</p>
              <ol className="list-decimal list-inside space-y-1 text-slate-400">
                <li>Create an OAuth 2.0 Client ID at Google Cloud Console.</li>
                <li>Add Authorized Redirect URI:</li>
              </ol>
              <div className="p-2 rounded bg-black/40 font-mono text-[10px] text-blue-300 break-all select-all">
                http://localhost:3000/api/auth/callback/google
              </div>
              <p className="text-[10px] text-slate-400">
                Set <code className="text-white">GOOGLE_CLIENT_ID</code> and <code className="text-white">GOOGLE_CLIENT_SECRET</code> in your <code className="text-white">.env.local</code>.
              </p>
            </div>
          )}
        </div>

        {/* Security badge at bottom */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Google OAuth 2.0 Identity
          </span>
          <Link href="/" className="text-slate-400 hover:text-white">
            Return Home
          </Link>
        </div>
      </div>

      {/* Footer links */}
      <footer className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
        <span>StudyOS 2.0 Academic Operating System</span>
        <span>•</span>
        <span>Client-Isolated Sandbox</span>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070b19] flex items-center justify-center text-white text-xs">
          Loading sign in...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
