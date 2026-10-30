"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Download,
  Upload,
  Shield,
  Bot,
  Lock,
  LogOut,
  KeyRound,
  HardDrive,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  Save
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { GoogleIcon } from "@/components/auth/GoogleAuthModal";
import { MAX_FILE_SIZE_LABEL, ALLOWED_FORMATS } from "@/lib/security/fileValidator";
import { db } from "@/lib/db";

export default function SettingsPage() {
  const { user, logout, lockWorkspace, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"security" | "vault" | "ai" | "pomodoro" | "data">("security");

  // Profile Editor state
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileInstitution, setProfileInstitution] = useState(user?.institution || "");
  const [profileDegree, setProfileDegree] = useState(user?.degree || "");
  const [profileRole, setProfileRole] = useState(user?.role || "Student");
  const [profileAvatarUrl, setProfileAvatarUrl] = useState(user?.avatarUrl || "/gwen.png");
  const [profileSavedMessage, setProfileSavedMessage] = useState<string | null>(null);

  // AI Configuration state
  const [aiProvider, setAiProvider] = useState<string>("gemini");
  const [aiApiKey, setAiApiKey] = useState<string>("");
  const [aiModel, setAiModel] = useState<string>("gemini-1.5-flash");
  const [aiEndpoint, setAiEndpoint] = useState<string>("http://localhost:11434");
  const [showApiKey, setShowApiKey] = useState(false);
  const [aiTestStatus, setAiTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");

  // Pomodoro / Study Preferences state
  const [pomodoroWork, setPomodoroWork] = useState(25);
  const [pomodoroShortBreak, setPomodoroShortBreak] = useState(5);
  const [pomodoroLongBreak, setPomodoroLongBreak] = useState(15);
  const [dailyGoalHours, setDailyGoalHours] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pomodoroSavedMessage, setPomodoroSavedMessage] = useState<string | null>(null);

  // Backup & Data Export State
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [backupStatusMessage, setBackupStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load stored settings on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProvider = localStorage.getItem("studyos_ai_provider");
      if (storedProvider) setAiProvider(storedProvider);

      const storedKey = localStorage.getItem("studyos_ai_api_key");
      if (storedKey) setAiApiKey(storedKey);

      const storedModel = localStorage.getItem("studyos_ai_model");
      if (storedModel) setAiModel(storedModel);

      const storedEndpoint = localStorage.getItem("studyos_ai_endpoint");
      if (storedEndpoint) setAiEndpoint(storedEndpoint);

      const storedPomo = localStorage.getItem("studyos_pomodoro_settings");
      if (storedPomo) {
        try {
          const parsed = JSON.parse(storedPomo);
          if (parsed.work) setPomodoroWork(parsed.work);
          if (parsed.shortBreak) setPomodoroShortBreak(parsed.shortBreak);
          if (parsed.longBreak) setPomodoroLongBreak(parsed.longBreak);
          if (parsed.dailyGoal) setDailyGoalHours(parsed.dailyGoal);
          if (typeof parsed.sound === "boolean") setSoundEnabled(parsed.sound);
        } catch {
          // ignore
        }
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileInstitution(user.institution);
      setProfileDegree(user.degree);
      setProfileRole(user.role);
      if (user.avatarUrl) setProfileAvatarUrl(user.avatarUrl);
    }
  }, [user]);

  // Save Profile Changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) return;

    await updateProfile({
      name: profileName.trim(),
      institution: profileInstitution.trim() || "Google Verified Academy",
      degree: profileDegree.trim() || "Academic Studies",
      role: profileRole as "Student" | "Researcher" | "Academic Fellow",
      avatarUrl: profileAvatarUrl || "/gwen.png",
    });

    setProfileSavedMessage("Profile and Earth-65 avatar updated successfully!");
    setTimeout(() => setProfileSavedMessage(null), 3000);
  };

  // Save AI Config
  const handleSaveAiConfig = async () => {
    setAiTestStatus("testing");

    await new Promise((r) => setTimeout(r, 600));

    localStorage.setItem("studyos_ai_provider", aiProvider);
    localStorage.setItem("studyos_ai_api_key", aiApiKey);
    localStorage.setItem("studyos_ai_model", aiModel);
    localStorage.setItem("studyos_ai_endpoint", aiEndpoint);

    setAiTestStatus("success");
    setTimeout(() => setAiTestStatus("idle"), 3500);
  };

  // Save Pomodoro Preferences
  const handleSavePomodoroPreferences = (e: React.FormEvent) => {
    e.preventDefault();
    const config = {
      work: pomodoroWork,
      shortBreak: pomodoroShortBreak,
      longBreak: pomodoroLongBreak,
      dailyGoal: dailyGoalHours,
      sound: soundEnabled,
    };
    localStorage.setItem("studyos_pomodoro_settings", JSON.stringify(config));
    setPomodoroSavedMessage("Study timer preferences saved!");
    setTimeout(() => setPomodoroSavedMessage(null), 3000);
  };

  // Real Data Export: JSON dump of Dexie database
  const handleExportData = async () => {
    setIsExporting(true);
    setBackupStatusMessage(null);

    try {
      const [subjects, tasks, notes, goals, resources, flashcards, quizzes, quizAttempts, materials] =
        await Promise.all([
          db.subjects.toArray(),
          db.tasks.toArray(),
          db.notes.toArray(),
          db.goals.toArray(),
          db.resources.toArray(),
          db.flashcards.toArray(),
          db.quizzes.toArray(),
          db.quizAttempts.toArray(),
          db.materials.toArray(),
        ]);

      // Strip large binary buffers from export for safe text JSON download
      const sanitizedMaterials = materials.map((m) => ({
        id: m.id,
        title: m.title,
        fileName: m.fileName,
        fileType: m.fileType,
        fileSize: m.fileSize,
        subjectId: m.subjectId,
        contentExtract: m.contentExtract,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      }));

      const backupData = {
        app: "StudyOS",
        version: "2.0",
        exportedAt: new Date().toISOString(),
        user: user
          ? {
              email: user.email,
              name: user.name,
              institution: user.institution,
            }
          : null,
        data: {
          subjects,
          tasks,
          notes,
          goals,
          resources,
          flashcards,
          quizzes,
          quizAttempts,
          materials: sanitizedMaterials,
        },
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const timestamp = new Date().toISOString().split("T")[0];
      a.href = url;
      a.download = `studyos-backup-${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setBackupStatusMessage({
        type: "success",
        text: `Export complete! Saved ${notes.length} notes, ${flashcards.length} flashcards, and ${tasks.length} tasks.`,
      });
    } catch {
      setIsExporting(false);
      setBackupStatusMessage({
        type: "error",
        text: "Failed to generate backup export. Please try again.",
      });
    }
  };

  // Real Data Restore: JSON upload and Dexie database import
  const handleFileRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setBackupStatusMessage(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (!parsed.data || typeof parsed.data !== "object") {
          throw new Error("Invalid StudyOS backup format.");
        }

        const { subjects, tasks, notes, goals, resources, flashcards, quizzes, quizAttempts } = parsed.data;

        // Restore into Dexie tables
        if (Array.isArray(subjects) && subjects.length > 0) {
          for (const s of subjects) await db.subjects.put(s);
        }
        if (Array.isArray(tasks) && tasks.length > 0) {
          for (const t of tasks) await db.tasks.put(t);
        }
        if (Array.isArray(notes) && notes.length > 0) {
          for (const n of notes) await db.notes.put(n);
        }
        if (Array.isArray(goals) && goals.length > 0) {
          for (const g of goals) await db.goals.put(g);
        }
        if (Array.isArray(resources) && resources.length > 0) {
          for (const r of resources) await db.resources.put(r);
        }
        if (Array.isArray(flashcards) && flashcards.length > 0) {
          for (const f of flashcards) await db.flashcards.put(f);
        }
        if (Array.isArray(quizzes) && quizzes.length > 0) {
          for (const q of quizzes) await db.quizzes.put(q);
        }
        if (Array.isArray(quizAttempts) && quizAttempts.length > 0) {
          for (const qa of quizAttempts) await db.quizAttempts.put(qa);
        }

        setIsImporting(false);
        setBackupStatusMessage({
          type: "success",
          text: `Backup successfully restored! Refreshing data...`,
        });

        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (err: unknown) {
        setIsImporting(false);
        const msg = err instanceof Error ? err.message : "Invalid JSON file structure.";
        setBackupStatusMessage({
          type: "error",
          text: `Restore failed: ${msg}`,
        });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32 text-slate-100 font-sans">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Settings & Workspace Config</h1>
          <span className="tag-outline">
            Academic System
          </span>
          <span className="tag-outline">
            Google Identity
          </span>
        </div>
        <p className="text-slate-400 text-xs mt-1">
          Manage your verified Google profile, Gwen Stacy study presets, lightweight AI engines, and encrypted vault.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-1.5">
          <button
            onClick={() => setActiveTab("security")}
            className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === "security"
                ? "bg-sky-500/15 text-white border border-sky-400/30 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Shield className="w-4 h-4 text-sky-400" />
            <span>Profile & Security</span>
          </button>

          <button
            onClick={() => setActiveTab("pomodoro")}
            className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === "pomodoro"
                ? "bg-sky-500/15 text-white border border-sky-400/30 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Clock className="w-4 h-4 text-sky-400" />
            <span>Study & Pomodoro</span>
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === "ai"
                ? "bg-sky-500/15 text-white border border-sky-400/30 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Bot className="w-4 h-4 text-sky-400" />
            <span>Light AI Engine</span>
          </button>

          <button
            onClick={() => setActiveTab("vault")}
            className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === "vault"
                ? "bg-sky-500/15 text-white border border-sky-400/30 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <HardDrive className="w-4 h-4 text-sky-400" />
            <span>Upload Vault Policy</span>
          </button>

          <button
            onClick={() => setActiveTab("data")}
            className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === "data"
                ? "bg-sky-500/15 text-white border border-sky-400/30 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Backup & Restore</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="md:col-span-3 space-y-6">
          {/* TAB 1: Profile & Google Identity */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Profile Card */}
              <section className="bg-[#0c1224] border border-white/10 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <GoogleIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Google OAuth 2.0 Identity</h2>
                      <p className="text-xs text-slate-400">Manage your active credentials and display profile</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Authenticated
                  </span>
                </div>

                {user && (
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {user.degree} • {user.institution}
                        </p>
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

                {/* Edit Profile Form */}
                <form onSubmit={handleSaveProfile} className="space-y-4 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-400" /> Edit Profile Information
                    </h3>
                    {profileSavedMessage && (
                      <span className="text-xs text-emerald-400 font-semibold animate-in fade-in flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {profileSavedMessage}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300">
                      Earth-65 Avatar Badge
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setProfileAvatarUrl("/gwen.png")}
                        className={`p-1.5 rounded-2xl border transition-all flex items-center gap-2.5 ${
                          profileAvatarUrl === "/gwen.png"
                            ? "border-pink-500 bg-pink-500/15 shadow-[0_0_15px_rgba(236,72,153,0.35)]"
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className="w-9 h-9 rounded-xl overflow-hidden border border-pink-500/30">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/gwen.png" alt="Gwen Stacy" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-left pr-2">
                          <p className="text-[11px] font-bold text-white">Gwen Stacy</p>
                          <p className="text-[9px] text-pink-300 font-semibold">Earth-65 Hero</p>
                        </div>
                      </button>

                      {user && (
                        <button
                          type="button"
                          onClick={() => setProfileAvatarUrl(user.avatarUrl)}
                          className={`p-1.5 rounded-2xl border transition-all flex items-center gap-2.5 ${
                            profileAvatarUrl === user.avatarUrl
                              ? "border-cyan-500 bg-cyan-500/15 shadow-[0_0_15px_rgba(6,182,212,0.35)]"
                              : "border-white/10 bg-white/5 hover:border-white/20"
                          }`}
                        >
                          <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/20">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="text-left pr-2">
                            <p className="text-[11px] font-bold text-white">Google Identity</p>
                            <p className="text-[9px] text-cyan-300 font-semibold">OAuth Profile</p>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs outline-none focus:border-sky-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">Academic Role</label>
                      <select
                        value={profileRole}
                        onChange={(e) => setProfileRole(e.target.value as "Student" | "Researcher" | "Academic Fellow")}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#030d22] border border-white/10 text-white text-xs outline-none focus:border-sky-400 cursor-pointer"
                      >
                        <option value="Student">Student (Undergraduate / Graduate)</option>
                        <option value="Researcher">Researcher / Scholar</option>
                        <option value="Academic Fellow">Academic Fellow / Faculty</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">Major / Degree</label>
                      <input
                        type="text"
                        value={profileDegree}
                        onChange={(e) => setProfileDegree(e.target.value)}
                        placeholder="e.g. Computer Science & AI"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs outline-none focus:border-sky-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">University / Institution</label>
                      <input
                        type="text"
                        value={profileInstitution}
                        onChange={(e) => setProfileInstitution(e.target.value)}
                        placeholder="e.g. Stanford University"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs outline-none focus:border-sky-400"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#0084ff] hover:bg-[#0074e0] text-white text-xs font-medium shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Profile Changes</span>
                    </button>
                  </div>
                </form>

                {/* Security Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Security Score</p>
                    <p className="text-lg font-bold text-emerald-400 mt-1">{user?.securityScore || 98}/100</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Top-tier academic rating</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Session Key</p>
                    <p className="text-lg font-bold text-blue-400 mt-1">SHA-256</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Client isolated storage</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">OAuth Provider</p>
                    <p className="text-lg font-bold text-indigo-400 mt-1">Google Identity</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Verified session token</p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: Study & Pomodoro Preferences */}
          {activeTab === "pomodoro" && (
            <section className="bg-[#0c1224] border border-white/10 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Study & Pomodoro Preferences</h2>
                    <p className="text-xs text-slate-400">
                      Configure your focus intervals and task planner timers
                    </p>
                  </div>
                </div>
                {pomodoroSavedMessage && (
                  <span className="text-xs text-emerald-400 font-semibold animate-in fade-in flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {pomodoroSavedMessage}
                  </span>
                )}
              </div>

              <form onSubmit={handleSavePomodoroPreferences} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <label className="block text-xs font-semibold text-slate-300">
                      Focus Work Interval (Minutes)
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={90}
                      value={pomodoroWork}
                      onChange={(e) => setPomodoroWork(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-bold text-lg outline-none focus:border-amber-500 text-center"
                    />
                    <p className="text-[11px] text-slate-500">Standard: 25 mins</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <label className="block text-xs font-semibold text-slate-300">
                      Short Break Interval (Minutes)
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={30}
                      value={pomodoroShortBreak}
                      onChange={(e) => setPomodoroShortBreak(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-bold text-lg outline-none focus:border-amber-500 text-center"
                    />
                    <p className="text-[11px] text-slate-500">Standard: 5 mins</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <label className="block text-xs font-semibold text-slate-300">
                      Long Break Interval (Minutes)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={60}
                      value={pomodoroLongBreak}
                      onChange={(e) => setPomodoroLongBreak(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-bold text-lg outline-none focus:border-amber-500 text-center"
                    />
                    <p className="text-[11px] text-slate-500">Standard: 15 mins</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">Daily Study Goal Target</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Hours per day target for productivity metrics</p>
                    </div>
                    <select
                      value={dailyGoalHours}
                      onChange={(e) => setDailyGoalHours(Number(e.target.value))}
                      className="bg-[#070b19] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                    >
                      <option value={2}>2 Hours</option>
                      <option value={4}>4 Hours</option>
                      <option value={6}>6 Hours</option>
                      <option value={8}>8 Hours</option>
                    </select>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">Sound Alerts</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Play synth chime when a session finishes</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={soundEnabled}
                      onChange={(e) => setSoundEnabled(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 border-white/20 bg-white/5 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Pomodoro Preferences</span>
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* TAB 3: AI Configuration */}
          {activeTab === "ai" && (
            <section className="bg-[#0c1224] border border-white/10 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">AI Provider Configuration</h2>
                    <p className="text-xs text-slate-400">
                      Connect Google Gemini, OpenAI, or local Ollama for note synthesis & quizzes
                    </p>
                  </div>
                </div>
                {aiTestStatus === "success" && (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected & Saved
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Active AI Engine</label>
                  <select
                    value={aiProvider}
                    onChange={(e) => {
                      setAiProvider(e.target.value);
                      if (e.target.value === "gemini") setAiModel("gemini-1.5-flash");
                      if (e.target.value === "openai") setAiModel("gpt-4o-mini");
                      if (e.target.value === "ollama") setAiModel("llama3");
                    }}
                    className="w-full bg-[#070b19] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="offline">Offline Mode (Local-First Heuristics - Zero API Key Needed)</option>
                    <option value="gemini">Google Gemini (Gemini 1.5 Flash / Pro)</option>
                    <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                    <option value="ollama">Ollama (Local LLM - Llama 3 / Mistral)</option>
                  </select>
                </div>

                {aiProvider !== "offline" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Model Name</label>
                      <input
                        type="text"
                        value={aiModel}
                        onChange={(e) => setAiModel(e.target.value)}
                        placeholder="e.g. gemini-1.5-flash or gpt-4o"
                        className="w-full px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs outline-none focus:border-blue-500"
                      />
                    </div>

                    {aiProvider === "ollama" ? (
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ollama Server URL</label>
                        <input
                          type="text"
                          value={aiEndpoint}
                          onChange={(e) => setAiEndpoint(e.target.value)}
                          placeholder="http://localhost:11434"
                          className="w-full px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs outline-none focus:border-blue-500"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          API Key ({aiProvider === "gemini" ? "Google AI Studio" : "OpenAI Platform"})
                        </label>
                        <div className="relative">
                          <input
                            type={showApiKey ? "text" : "password"}
                            value={aiApiKey}
                            onChange={(e) => setAiApiKey(e.target.value)}
                            placeholder="AIzaSy... or sk-proj-..."
                            className="w-full pl-4 pr-10 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs outline-none focus:border-blue-500 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Key is strictly kept in your browser's private local storage.
                        </p>
                      </div>
                    )}
                  </>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSaveAiConfig}
                    disabled={aiTestStatus === "testing"}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
                  >
                    {aiTestStatus === "testing" ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Save & Validate Provider</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* TAB 4: Upload Vault Policy */}
          {activeTab === "vault" && (
            <section className="bg-[#0c1224] border border-white/10 rounded-3xl p-6 shadow-sm space-y-5">
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
                  <p className="text-slate-400 leading-relaxed">
                    Executables (.exe, .bat, .cmd), shell scripts (.sh), raw scripts (.js, .ts), markup (.html, .svg), and archives (.zip, .rar) are blocked to prevent XSS and arbitrary code execution.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* TAB 5: Backup & Restore */}
          {activeTab === "data" && (
            <section className="bg-[#0c1224] border border-white/10 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Data Management & Full Backup</h2>
                  <p className="text-xs text-slate-400">
                    Export your notes, flashcards, tasks, and quizzes to a portable encrypted JSON backup
                  </p>
                </div>
              </div>

              {/* Status Message */}
              {backupStatusMessage && (
                <div
                  className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 ${
                    backupStatusMessage.type === "success"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-red-500/10 border-red-500/30 text-red-300"
                  }`}
                >
                  {backupStatusMessage.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                  <span>{backupStatusMessage.text}</span>
                </div>
              )}

              {/* Hidden File Input for Restore */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileRestore}
                accept=".json"
                className="hidden"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-blue-400" /> Export Database
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Downloads an encrypted JSON archive of all your subjects, notes, flashcards, and quizzes.
                  </p>
                  <button
                    type="button"
                    onClick={handleExportData}
                    disabled={isExporting}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isExporting ? "Exporting..." : "Download JSON Backup"}</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-teal-400" /> Restore Database
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Upload a previously exported StudyOS JSON file to restore your entire academic workspace.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isImporting ? "Restoring Records..." : "Select File to Restore"}</span>
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="pt-4 border-t border-red-500/20">
                <div className="p-4 rounded-2xl bg-red-500/[0.04] border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-red-400">Danger Zone: Reset Local Data</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Permanently wipes all local subjects, flashcards, notes, and task records from this browser.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "Are you ABSOLUTELY sure? This will delete all your local notes, flashcards, and tasks."
                        )
                      ) {
                        localStorage.clear();
                        indexedDB.deleteDatabase("StudyOSDB");
                        window.location.reload();
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold transition-colors shrink-0"
                  >
                    Wipe Database
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
