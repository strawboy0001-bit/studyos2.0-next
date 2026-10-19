"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  FileText,
  Lock,
  ArrowRight,
  Brain,
  HardDrive,
  BarChart3,
  Calendar,
  Layers,
  GraduationCap,
  Fingerprint,
  CheckCircle2
} from "lucide-react";
import { GoogleAuthModal, GoogleIcon } from "./GoogleAuthModal";
import { MAX_FILE_SIZE_LABEL } from "@/lib/security/fileValidator";
import { useAuth } from "@/lib/auth/AuthContext";

export function AuthLandingGateway() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { loginAsGuest, loginWithGoogle, savedAccounts } = useAuth();
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const handleInstantGuest = async () => {
    setIsGuestLoading(true);
    try {
      await loginAsGuest();
    } finally {
      setIsGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 selection:bg-blue-600/30 selection:text-white font-sans overflow-x-hidden relative">
      <GoogleAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Subtle, refined background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-blue-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 blur-[140px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Clean Top Navigation Bar */}
      <header className="relative z-40 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
              StudyOS<span className="text-blue-400">.Ai</span>
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#security" className="hover:text-white transition-colors">Security Vault</a>
          <a href="#workflow" className="hover:text-white transition-colors">Adaptive Learning</a>
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleInstantGuest}
            disabled={isGuestLoading}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.3)] flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
            <span>{isGuestLoading ? "Entering..." : "⚡ Quick Play (Guest)"}</span>
          </button>

          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.35)] flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <GoogleIcon className="w-3.5 h-3.5" />
            <span>Google Login</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-20 max-w-7xl mx-auto px-6 pt-14 pb-24">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Tag Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold backdrop-blur-md"
          >
            <span>Academic Operating System 2.0 • 1-Tap Entry Enabled</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.15]"
          >
            Master every subject with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-cyan-300">
              intelligent study workflows
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Organize study materials, generate adaptive flashcards, practice comprehensive quizzes, and boost your daily focus with Pomodoro task planning.
          </motion.p>

          {/* Free Fire style Quick Resume if previously played */}
          {savedAccounts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 p-2 px-4 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs text-white"
            >
              <span>Welcome back, <strong>{savedAccounts[0].name}</strong>!</span>
              <button
                onClick={() => loginWithGoogle({ name: savedAccounts[0].name, email: savedAccounts[0].email })}
                className="px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-500 font-bold text-[11px] transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                Resume Session ▶
              </button>
            </motion.div>
          )}

          {/* Primary CTA Buttons (Free Fire Style) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            {/* Instant Guest Access - 1-Tap Play */}
            <button
              type="button"
              onClick={handleInstantGuest}
              disabled={isGuestLoading}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-[0_0_30px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-ping" />
              <span>{isGuestLoading ? "Launching..." : "⚡ 1-Tap Guest Access"}</span>
              <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Google Login */}
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>Sign In with Google</span>
            </Link>

            {/* Fast Modal Dialog */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all"
            >
              Quick Login Pass
            </button>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 pt-3">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" /> Isolated Local Sandbox
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Max {MAX_FILE_SIZE_LABEL} Restricted Vault
            </span>
            <span className="flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-indigo-400" /> Verified Google Account
            </span>
          </div>
        </div>

        {/* Unseen Power Focus Showcase Banner */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-14 max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-[#0c1224] via-[#160c1c] to-[#0c1224] border border-red-500/25 p-6 sm:p-8 shadow-[0_20px_50px_rgba(239,68,68,0.12)] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group"
        >
          {/* Ambient red backlight */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-600/10 blur-[90px] rounded-full pointer-events-none" />

          {/* Image Artwork Container */}
          <div className="relative shrink-0 w-48 sm:w-56 rounded-2xl overflow-hidden border border-red-500/30 shadow-2xl group-hover:scale-[1.02] transition-transform duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/unseen.png"
              alt="UNSEEN Power • Transformation Quietly Begins"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <span className="absolute bottom-2.5 left-3 text-[10px] font-black uppercase tracking-wider text-red-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-red-500/30">
              UNSEEN • 085
            </span>
          </div>

          {/* Text Content */}
          <div className="flex-1 text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>THE ACADEMIC FOCUS MINDSET</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              &quot;Transformation Quietly Begins. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-200">
                Covered, but never contained.&quot;
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              True mastery is forged in unseen hours of deep study, silent focus, and consistent recall. StudyOS provides the sanctuary to forge your knowledge before stepping into the arena.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
              <span className="text-red-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Veiled • Untold • Hidden
              </span>
              <span className="text-slate-400">
                StudyOS Focus Philosophy
              </span>
            </div>
          </div>
        </motion.div>

        {/* Hero Feature Cards Showcase */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-3xl bg-[#0c1224] border border-white/10 p-6 shadow-sm hover:border-blue-500/30 transition-all space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Pomodoro Task Planner</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Structured focus intervals with customizable study sprints, break timers, and daily schedule tracking.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-blue-400 flex items-center gap-1">
              <span>Deep work enabled</span>
            </div>
          </motion.div>

          {/* 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl bg-[#0c1224] border border-white/10 p-6 shadow-sm hover:border-indigo-500/30 transition-all space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Adaptive Flashcards</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                SM-2 spaced repetition scheduler with multiple card templates, deck management, and 3D card flips.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-indigo-400 flex items-center gap-1">
              <span>Optimized retention</span>
            </div>
          </motion.div>

          {/* 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="rounded-3xl bg-[#0c1224] border border-white/10 p-6 shadow-sm hover:border-purple-500/30 transition-all space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Quiz Centre & Explanations</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Comprehensive AI-generated test sets with correct/incorrect review modes and in-depth answer explanations.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-purple-400 flex items-center gap-1">
              <span>Review mistake mode</span>
            </div>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <section id="features" className="mt-24 max-w-5xl mx-auto">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              A Complete Academic Workspace
            </h2>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Everything you need to organize courses, manage deadlines, and master difficult material.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0c1224] border border-white/10 space-y-2.5">
              <HardDrive className="w-5 h-5 text-indigo-400" />
              <h4 className="font-bold text-white text-sm">Study Materials Vault</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clean document repository supporting PDF, DOCX, TXT, and lecture images with local SHA-256 validation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c1224] border border-white/10 space-y-2.5">
              <FileText className="w-5 h-5 text-blue-400" />
              <h4 className="font-bold text-white text-sm">Lecture Notes</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rich notes with tagging, instant search, subject grouping, and AI synthesis helpers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c1224] border border-white/10 space-y-2.5">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <h4 className="font-bold text-white text-sm">Goal Milestones</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Break major academic targets down into actionable steps with real-time completion tracking.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c1224] border border-white/10 space-y-2.5">
              <Lock className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-white text-sm">100% Client-First</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                All records, flashcards, and notes reside securely inside your browser's local sandbox.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Banner */}
        <div className="mt-20 p-8 rounded-3xl bg-[#0c1224] border border-white/10 text-center relative overflow-hidden max-w-4xl mx-auto">
          <div className="relative z-10 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Ready to elevate your academic performance?
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Sign in with your Google email to start managing your courses and focus sessions.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Sign in with Google</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-white/[0.06] py-6 max-w-7xl mx-auto px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-slate-300">StudyOS 2.0</span>
          <span>— Academic Operating System</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Google OAuth Verified
          </span>
          <span>Terms & Privacy</span>
        </div>
      </footer>
    </div>
  );
}
