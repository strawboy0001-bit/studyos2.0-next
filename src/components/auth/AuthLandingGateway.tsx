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
  const { loginWithGoogle, savedAccounts } = useAuth();
  const [sakuraEnabled, setSakuraEnabled] = useState(true);

  const toggleSakura = () => {
    const next = !sakuraEnabled;
    setSakuraEnabled(next);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("studyos:toggle-sakura", { detail: { enabled: next } }));
    }
  };

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 selection:bg-blue-600/30 selection:text-white font-sans overflow-x-hidden relative">
      <GoogleAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Clean Top Navigation Bar */}
      <header className="relative z-40 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold tracking-tight text-white font-sans">
              StudyOS
            </span>
            <span className="text-[11px] font-semibold text-blue-400 font-mono">
              .ai
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
            onClick={toggleSakura}
            className="surface-2 hairline-border text-slate-300 hover:text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Toggle Zen Sakura Petals"
          >
            <span className="text-sm leading-none">🌸</span>
            <span>{sakuraEnabled ? "Sakura: On" : "Sakura: Off"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            className="surface-2 hairline-border text-slate-200 hover:text-white font-medium text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Fingerprint className="w-3.5 h-3.5 text-blue-400" />
            <span>Google ID</span>
          </button>

          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-4 py-1.5 rounded-lg flex items-center gap-2 transition-colors"
          >
            <GoogleIcon className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-20 max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Outline Tag */}
          <div className="inline-flex">
            <span className="tag-outline">
              ACADEMIC OPERATING SYSTEM 2.0 • GOOGLE VERIFIED
            </span>
          </div>

          {/* Main Title: Crisp Pure White */}
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.12]">
            Master every subject with <br />
            intelligent study workflows.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Organize study materials, generate adaptive flashcards, practice comprehensive quizzes, and boost your daily focus with Pomodoro task planning.
          </p>

          {/* Quick Resume if previously authenticated */}
          {savedAccounts.length > 0 && (
            <div className="inline-flex items-center gap-3 p-2 px-4 rounded-xl surface-1 hairline-border text-xs text-white">
              <span>Verified Google Account: <strong>{savedAccounts[0].name}</strong></span>
              <button
                onClick={() => loginWithGoogle({ name: savedAccounts[0].name, email: savedAccounts[0].email })}
                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 font-medium text-[11px] transition-colors"
              >
                Enter Workspace
              </button>
            </div>
          )}

          {/* Primary CTA Buttons: Pure Flat Accent */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* Direct Google OAuth Login */}
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>Sign In with Google</span>
              <ArrowRight className="w-4 h-4 text-white/80" />
            </Link>

            {/* Google ID Input Modal */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl surface-2 hairline-border text-slate-200 hover:text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Fingerprint className="w-4 h-4 text-blue-400" />
              <span>Enter with Google ID</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 pt-2">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" /> Google OAuth 2.0 Security
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Max {MAX_FILE_SIZE_LABEL} Restricted Vault
            </span>
            <span className="flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-slate-400" /> Verified Google Account
            </span>
          </div>
        </div>

        {/* Unseen Focus Mindset Module */}
        <div className="mt-14 max-w-4xl mx-auto rounded-2xl bg-[#0c1222] border border-white/[0.08] p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8">
          {/* Image Container */}
          <div className="relative shrink-0 w-44 sm:w-52 rounded-xl overflow-hidden border border-white/[0.08]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/unseen.png"
              alt="Deep Academic Focus"
              className="w-full h-auto object-cover"
            />
            <span className="absolute bottom-2.5 left-2.5 text-[10px] font-mono text-slate-300 bg-black/70 px-2 py-0.5 rounded border border-white/10">
              FOCUS • 085
            </span>
          </div>

          {/* Text Content */}
          <div className="flex-1 text-left space-y-3">
            <div className="flex items-center gap-2">
              <span className="tag-outline">
                THE STUDY MINDSET
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
              &quot;Transformation Quietly Begins. <br className="hidden sm:inline" />
              Covered, but never contained.&quot;
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              True mastery is forged in unseen hours of deep study, silent focus, and consistent recall. StudyOS provides the sanctuary to organize your knowledge before stepping into the arena.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-4 text-xs">
              <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Isolated Environment
              </span>
              <span className="text-slate-500">
                Focus Philosophy
              </span>
            </div>
          </div>
        </div>

        {/* Spider-Gwen Study Companion Banner: Restrained & Refined */}
        <div className="mt-8 max-w-4xl mx-auto rounded-2xl bg-[#0c1222] border border-white/[0.08] p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8">
          {/* Image Container */}
          <div className="relative shrink-0 w-44 sm:w-52 rounded-xl overflow-hidden border border-white/[0.08]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gwen.png"
              alt="Gwen Stacy"
              className="w-full h-auto object-cover"
            />
            <span className="absolute bottom-2.5 left-2.5 text-[10px] font-mono text-slate-300 bg-black/70 px-2 py-0.5 rounded border border-white/10">
              GWEN STACY
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 text-left space-y-3">
            <div className="flex items-center gap-2">
              <span className="tag-outline">
                COGNITIVE COMPANION
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
              Agile Neural Reflexes. <br />
              Glide Through Complex Courses.
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              StudyOS pairs high-precision focus intervals with lightweight adaptive recall. Your intelligent copilot keeps your momentum sharp and consistent without overwhelming your workspace with AI clutter.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-4 text-xs font-medium">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Web-Linked Tasks
              </span>
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Focused Assistant
              </span>
              <span className="text-slate-500">
                Zero AI Clutter • Pure Flow
              </span>
            </div>
          </div>
        </div>

        {/* Hero Feature Cards: Neutral + One Flat Accent */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {/* 1 */}
          <div className="rounded-2xl bg-[#0c1222] border border-white/[0.08] hover:border-white/[0.16] p-6 transition-colors space-y-4">
            <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-blue-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Pomodoro Task Planner</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Structured focus intervals with customizable study sprints, break timers, and daily schedule tracking.
              </p>
            </div>
            <div className="pt-2 text-xs font-medium text-slate-400 flex items-center gap-1">
              <span>Deep work enabled</span>
            </div>
          </div>

          {/* 2 */}
          <div className="rounded-2xl bg-[#0c1222] border border-white/[0.08] hover:border-white/[0.16] p-6 transition-colors space-y-4">
            <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Adaptive Flashcards</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                SM-2 spaced repetition scheduler with multiple card templates, deck management, and active recall.
              </p>
            </div>
            <div className="pt-2 text-xs font-medium text-slate-400 flex items-center gap-1">
              <span>Optimized retention</span>
            </div>
          </div>

          {/* 3 */}
          <div className="rounded-2xl bg-[#0c1222] border border-white/[0.08] hover:border-white/[0.16] p-6 transition-colors space-y-4">
            <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-blue-400">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Quiz Centre & Explanations</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Comprehensive academic test sets with correct/incorrect review modes and in-depth answer explanations.
              </p>
            </div>
            <div className="pt-2 text-xs font-medium text-slate-400 flex items-center gap-1">
              <span>Mistake review mode</span>
            </div>
          </div>
        </div>

        {/* Complete Features Section */}
        <section id="features" className="mt-20 max-w-5xl mx-auto">
          <div className="text-center space-y-1.5 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              A Complete Academic Workspace
            </h2>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Everything you need to organize courses, manage deadlines, and master difficult material.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0c1222] border border-white/[0.08] space-y-2">
              <HardDrive className="w-4 h-4 text-slate-300" />
              <h4 className="font-semibold text-white text-xs">Study Materials Vault</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Clean document repository supporting PDF, DOCX, TXT, and lecture images with local SHA-256 validation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c1222] border border-white/[0.08] space-y-2">
              <FileText className="w-4 h-4 text-slate-300" />
              <h4 className="font-semibold text-white text-xs">Lecture Notes</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Rich notes with tagging, instant search, subject grouping, and AI synthesis helpers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c1222] border border-white/[0.08] space-y-2">
              <BarChart3 className="w-4 h-4 text-slate-300" />
              <h4 className="font-semibold text-white text-xs">Goal Milestones</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Break major academic targets down into actionable steps with real-time completion tracking.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c1222] border border-white/[0.08] space-y-2">
              <Lock className="w-4 h-4 text-slate-300" />
              <h4 className="font-semibold text-white text-xs">100% Client-First</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                All records, flashcards, and notes reside securely inside your browser&apos;s local sandbox.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Banner */}
        <div className="mt-16 p-8 rounded-2xl bg-[#0c1222] border border-white/[0.08] text-center max-w-4xl mx-auto">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white">
              Ready to elevate your academic performance?
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Sign in with your Google email to start managing your courses and focus sessions.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Sign in with Google</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-white/[0.08] py-6 max-w-7xl mx-auto px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
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
