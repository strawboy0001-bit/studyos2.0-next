"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  FileText,
  Lock,
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  Brain,
  HardDrive,
  BarChart3,
  Calendar,
  Layers,
  GraduationCap,
  Fingerprint
} from "lucide-react";
import { GoogleAuthModal, GoogleIcon } from "./GoogleAuthModal";
import { MAX_FILE_SIZE_LABEL } from "@/lib/security/fileValidator";

export function AuthLandingGateway() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#070b19] text-white selection:bg-blue-500/30 selection:text-white font-sans overflow-x-hidden relative">
      <GoogleAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Floating Design Pills mirroring the reference artwork */}
      <div className="hidden lg:block pointer-events-none select-none z-30">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed left-6 top-1/3 -rotate-12 bg-white/90 text-slate-900 font-bold px-5 py-2 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white text-xs uppercase tracking-wider"
        >
          Website
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="fixed left-8 top-1/2 -rotate-6 bg-white/90 text-slate-900 font-bold px-5 py-2 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white text-xs uppercase tracking-wider"
        >
          UI / UX
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="fixed right-8 top-1/3 rotate-12 bg-white/90 text-slate-900 font-bold px-5 py-2 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white text-xs uppercase tracking-wider"
        >
          Security
        </motion.div>
      </div>

      {/* Background Lighting Gradients & Radial Beams */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-600/25 via-indigo-600/10 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 blur-[140px] rounded-full" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Top Navigation Bar */}
      <header className="relative z-40 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.5)] border border-white/20">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
              StudyOS<span className="text-blue-400">.Ai</span>
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#security" className="hover:text-white transition-colors">Security Vault</a>
          <a href="#uploads" className="hover:text-white transition-colors">File Protections</a>
          <a href="#about" className="hover:text-white transition-colors">Architecture</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAuthModal(true)}
            className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-full hover:bg-white/5 transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-[0_0_25px_rgba(37,99,235,0.4)] border border-blue-400/30 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <GoogleIcon className="w-4 h-4" />
            <span>Sign In with Google</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-20 max-w-7xl mx-auto px-6 pt-10 pb-24">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Tag Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-semibold backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.15)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Study Smarter With StudyOS.Ai</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]"
          >
            Save Time & Master <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
              Every Subject
            </span>{" "}
            <span className="inline-flex items-center align-middle">
              <span className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-blue-500/20 border border-blue-400/40 inline-flex items-center justify-center text-blue-300 ml-2">
                <Brain className="w-5 h-5 sm:w-7 sm:h-7" />
              </span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300/80 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Synthesize lecture notes, practice adaptive flashcards, and protect your study materials with our high-security AI academic operating system.
          </motion.p>

          {/* Primary CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-[0_0_35px_rgba(37,99,235,0.5)] border border-blue-400/40 flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 group"
            >
              <GoogleIcon className="w-5 h-5" />
              <span>Sign In with Google</span>
              <ArrowRight className="w-5 h-5 text-blue-200 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-2">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" /> End-to-End Client Sandbox
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Max {MAX_FILE_SIZE_LABEL} Restricted Vault
            </span>
            <span className="flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-indigo-400" /> OAuth 2.0 Identity
            </span>
          </div>
        </div>

        {/* Triple Card Showcase (Styled after AirLume.Ai hero) */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center max-w-6xl mx-auto">
          {/* Left Card: Security & Points */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="lg:col-span-3 rounded-3xl bg-[#0f172a]/70 backdrop-blur-2xl border border-white/10 p-6 shadow-[0_15px_40px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-blue-500/40 transition-all"
          >
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 font-medium">Your StudyOS Points</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-white">13,200</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Ready
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Points Available for AI Synthesis</p>
              </div>

              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-blue-300">Next Security Tier</p>
                  <p className="text-[10px] text-slate-400">256-Bit Vault at 900 pts</p>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400" />
              </div>

              {/* Skeletal bars */}
              <div className="space-y-2 pt-1">
                <div className="h-3 w-3/4 rounded-full bg-white/10" />
                <div className="h-3 w-1/2 rounded-full bg-white/5" />
              </div>
            </div>
          </motion.div>

          {/* Center Card: Smart Search & Document Engine Phone Frame */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-6 rounded-3xl bg-gradient-to-b from-[#111936] to-[#0c1228] border border-blue-500/30 p-6 sm:p-8 shadow-[0_20px_60px_rgba(37,99,235,0.25)] relative overflow-hidden text-center"
          >
            {/* Top ambient highlight */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-blue-500/30 blur-2xl" />

            <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-blue-300 mb-4">
              StudyOS Smart Inspection
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Scanning 200+ Document <br />
              Formats In Real-Time
            </h3>

            <div className="my-6 flex items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center font-bold text-lg text-white bg-blue-600/20 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                94%
              </div>
              <div className="text-left text-xs text-slate-300">
                <p className="font-semibold text-white">Retention Score Boost</p>
                <p className="text-slate-400">Validated against spaced repetition protocols</p>
              </div>
            </div>

            {/* Document preview graphic */}
            <div className="rounded-2xl bg-black/40 border border-white/10 p-4 text-left flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate">Quantum_Mechanics_Lecture_04.pdf</span>
                  <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    Verified Clean
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">SHA-256 Validated • 2.4 MB • Zero Malware</p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 border border-white/40" />
                <div className="w-6 h-6 rounded-full bg-indigo-600 border border-white/40" />
                <div className="w-6 h-6 rounded-full bg-purple-600 border border-white/40" />
              </div>
              <span className="font-medium text-slate-300">99.2% Security Score • Client Isolated</span>
            </div>
          </motion.div>

          {/* Right Card: Best Deal / AI Prediction (Glowing Neon Card) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="lg:col-span-3 rounded-3xl bg-gradient-to-b from-[#152347] to-[#0f172a] border border-blue-400/50 p-6 shadow-[0_0_40px_rgba(59,130,246,0.3)] relative overflow-hidden group hover:border-blue-400 transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Best Plan Generated</span>
              </div>

              <div>
                <p className="text-[11px] text-slate-400">Optimization Metric</p>
                <h4 className="text-xl font-bold text-white mt-1">Calculus III → Mastery</h4>
                <div className="text-2xl font-black text-blue-300 mt-1">Only 14 Days</div>
                <p className="text-[11px] text-emerald-400 mt-0.5 font-medium">Saved 28% Study Time</p>
              </div>

              {/* Progress arc graphic */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-300">AI Daily Forecast</span>
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-xs font-bold">
                  →
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Grid Section (Modeled after bottom 8 cards of reference image) */}
        <section id="features" className="mt-28">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              AI Features & Security Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              AI-Powered Features, Study Effortless With StudyOS
            </h2>
            <p className="text-sm text-slate-400">
              Enjoy seamless material uploads, restricted secure vaults, and personalized flashcards powered by StudyOS AI for academic success.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1 */}
            <div className="p-6 rounded-3xl bg-[#0f172a]/80 border border-white/10 hover:border-blue-500/40 transition-all hover:bg-[#121c33] group">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-4 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base mb-1 group-hover:text-blue-300 transition-colors">
                Real-Time Document Security
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Strict binary header inspection blocks malicious executables or scripts before storage.
              </p>
              <button onClick={() => setShowAuthModal(true)} className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2 */}
            <div className="p-6 rounded-3xl bg-[#0f172a]/80 border border-white/10 hover:border-blue-500/40 transition-all hover:bg-[#121c33] group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-4">
                <HardDrive className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base mb-1 group-hover:text-blue-300 transition-colors">
                Strict File Upload Vault
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Limited strictly to PDF, DOCX, TXT, PNG/JPG with a strict {MAX_FILE_SIZE_LABEL} file size cap.
              </p>
              <button onClick={() => setShowAuthModal(true)} className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3 */}
            <div className="p-6 rounded-3xl bg-[#0f172a]/80 border border-white/10 hover:border-blue-500/40 transition-all hover:bg-[#121c33] group">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base mb-1 group-hover:text-blue-300 transition-colors">
                Smart Spaced Repetition
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                SM-2 algorithmic review scheduler calculates optimal intervals for maximum memory retention.
              </p>
              <button onClick={() => setShowAuthModal(true)} className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4 */}
            <div className="p-6 rounded-3xl bg-[#0f172a]/80 border border-white/10 hover:border-blue-500/40 transition-all hover:bg-[#121c33] group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base mb-1 group-hover:text-blue-300 transition-colors">
                Exam Readiness Alerts
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Real-time countdown and study workload forecasting keeps you ahead of finals.
              </p>
              <button onClick={() => setShowAuthModal(true)} className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 5 */}
            <div className="p-6 rounded-3xl bg-[#0f172a]/80 border border-white/10 hover:border-blue-500/40 transition-all hover:bg-[#121c33] group">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base mb-1 group-hover:text-blue-300 transition-colors">
                Adaptive Flashcards
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Instant interactive decks with flip animation, performance grading, and tag filtering.
              </p>
              <button onClick={() => setShowAuthModal(true)} className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 6 */}
            <div className="p-6 rounded-3xl bg-[#0f172a]/80 border border-white/10 hover:border-blue-500/40 transition-all hover:bg-[#121c33] group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base mb-1 group-hover:text-blue-300 transition-colors">
                Academic Metric Tracker
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Visual progress bars, completed goal metrics, and daily productivity streak logs.
              </p>
              <button onClick={() => setShowAuthModal(true)} className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 7 */}
            <div className="p-6 rounded-3xl bg-[#0f172a]/80 border border-white/10 hover:border-blue-500/40 transition-all hover:bg-[#121c33] group">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base mb-1 group-hover:text-blue-300 transition-colors">
                Zero Cloud Data Leaks
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                100% of your notes and documents stay strictly in your local browser sandbox.
              </p>
              <button onClick={() => setShowAuthModal(true)} className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 8 */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900/40 to-[#0f172a] border border-blue-500/40 hover:border-blue-400 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-4 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                <GoogleIcon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base mb-1 group-hover:text-blue-300 transition-colors">
                Secure Google Identity
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Instant OAuth 2.0 single sign-on with multi-session protection and verified profile syncing.
              </p>
              <button onClick={() => setShowAuthModal(true)} className="text-xs font-semibold text-blue-300 hover:text-white flex items-center gap-1">
                Sign in now <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Bottom Callout Banner */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-blue-600/20 border border-blue-500/30 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-3xl" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Ready to Upgrade Your Academic Performance?
            </h3>
            <p className="text-sm text-slate-300">
              Get started in seconds with your verified Google account. No credit card required.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:scale-105"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-white/5 py-8 max-w-7xl mx-auto px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-slate-400">StudyOS 2.0</span>
          <span>— High-Security Academic Operating System</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Google OAuth Verified
          </span>
          <span>Zero Server Tracking</span>
          <span>Terms & Privacy</span>
        </div>
      </footer>
    </div>
  );
}
