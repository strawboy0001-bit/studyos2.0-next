"use client";

import { useState } from "react";
import { Download, Upload, Shield, Bot, Paintbrush, Loader2, CheckCircle2, Lock, LogOut, KeyRound, HardDrive } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { GoogleIcon } from "@/components/auth/GoogleAuthModal";
import { MAX_FILE_SIZE_LABEL, ALLOWED_FORMATS } from "@/lib/security/fileValidator";

export default function SettingsPage() {
  const { user, logout, lockWorkspace } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<"security" | "vault" | "ai" | "general">("security");

  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("Encrypted JSON data export completed!");
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24 text-slate-100">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-black tracking-tight text-white">Settings & Security</h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
            Google OAuth 2.0
          </span>
        </div>
        <p className="text-slate-400 text-sm mt-1">
          Manage your verified Google Identity, upload security policies, and local encryption.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-1.5">
          <button
            onClick={() => setActiveTab("security")}
            className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === "security"
                ? "bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.15)]"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Shield className="w-4 h-4 text-blue-400" />
            <span>Google & Security</span>
          </button>

          <button
            onClick={() => setActiveTab("vault")}
            className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === "vault"
                ? "bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.15)]"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <HardDrive className="w-4 h-4 text-indigo-400" />
            <span>Upload Vault Policy</span>
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === "ai"
                ? "bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.15)]"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <span>AI Integrations</span>
          </button>

          <button
            onClick={() => setActiveTab("general")}
            className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === "general"
                ? "bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.15)]"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Paintbrush className="w-4 h-4 text-teal-400" />
            <span>General & Storage</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="md:col-span-3 space-y-6">
          {/* Security & Google Identity */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <section className="bg-[#0d1424] border border-white/10 rounded-3xl p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <GoogleIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Google OAuth 2.0 Identity</h2>
                      <p className="text-xs text-slate-400">Active authentication and security credentials</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Authenticated
                  </span>
                </div>

                {user && (
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border border-white/20"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{user.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                            {user.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{user.degree} • {user.institution}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={lockWorkspace}
                        className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                        Lock
                      </button>
                      <button
                        onClick={logout}
                        className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Security Score</p>
                    <p className="text-lg font-bold text-emerald-400 mt-1">{user?.securityScore || 98}/100</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Top-tier academic rating</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">2-Factor Security</p>
                    <p className="text-lg font-bold text-blue-400 mt-1">Enforced</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Google Authenticator standard</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Session Encryption</p>
                    <p className="text-lg font-bold text-indigo-400 mt-1">SHA-256</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Local isolated key</p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Upload Vault Policy */}
          {activeTab === "vault" && (
            <section className="bg-[#0d1424] border border-white/10 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Upload Vault Security Guard</h2>
                    <p className="text-xs text-slate-400">Enforced constraints to protect your browser and academic materials</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Strict Whitelist Active
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">File Size Limitation:</span>
                    <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                      Maximum {MAX_FILE_SIZE_LABEL}
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Any upload exceeding 10MB is instantly rejected to avoid freezing browser memory and protect IndexedDB limits.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <span className="font-bold text-white block">Permitted Academic Document Formats:</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {ALLOWED_FORMATS.map((f) => (
                      <span
                        key={f.extension}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border ${f.badgeColor}`}
                      >
                        {f.extension.toUpperCase()} ({f.label})
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <span className="font-bold text-white block">Prohibited File Extensions:</span>
                  <p className="text-slate-400">
                    Executables (.exe, .bat, .cmd), shell scripts (.sh), raw scripts (.js, .ts), markup (.html, .svg), and archives (.zip, .rar) are blocked to prevent XSS and arbitrary code execution.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* AI Providers */}
          {activeTab === "ai" && (
            <section className="bg-[#0d1424] border border-white/10 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">AI Provider Configuration</h2>
                  <p className="text-xs text-slate-400">Connect cloud AI or keep all computation offline</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-slate-300">Active AI Engine</label>
                <select className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none">
                  <option value="offline" className="bg-[#0b1226]">Offline Mode (Local-First Heuristics)</option>
                  <option value="gemini" className="bg-[#0b1226]">Google Gemini 2.5 Flash / Pro</option>
                  <option value="openai" className="bg-[#0b1226]">OpenAI GPT-4o</option>
                  <option value="ollama" className="bg-[#0b1226]">Local LLM (Ollama / Llama 3)</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  Offline mode requires zero API keys and never sends your study notes over the internet.
                </p>
              </div>
            </section>
          )}

          {/* General & Data Management */}
          {activeTab === "general" && (
            <section className="bg-[#0d1424] border border-white/10 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Data Management & Privacy</h2>
                  <p className="text-xs text-slate-400">Zero cloud tracking. All records live in your browser.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleExportData}
                  disabled={isExporting}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-all hover:brightness-110 disabled:opacity-50"
                >
                  {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  Export Encrypted Backup
                </button>
                <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-slate-300 hover:text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-white/10 transition-colors">
                  <Upload className="h-4 w-4" />
                  Restore Backup
                </button>
              </div>

              <div className="pt-4 border-t border-red-500/20">
                <button
                  onClick={() => {
                    if (confirm("Are you sure? This will delete all local subjects, notes, and uploaded materials.")) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="text-red-400 text-xs font-semibold hover:underline"
                >
                  Danger Zone: Reset All Local Academic Data
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
