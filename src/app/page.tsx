"use client";

import React from "react";
import {
  BookOpen,
  Target,
  CheckSquare,
  Files,
  Plus,
  ShieldCheck,
  Sparkles,
  Layers,
  HardDrive
} from "lucide-react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { useAuth } from "@/lib/auth/AuthContext";
import { GoogleIcon } from "@/components/auth/GoogleAuthModal";
import { formatBytes } from "@/lib/security/fileValidator";

export default function DashboardPage() {
  const { user } = useAuth();
  const tasks = useLiveQuery(() => db.tasks.toArray());
  const subjects = useLiveQuery(() => db.subjects.toArray());
  const materials = useLiveQuery(() => db.materials.toArray());
  const flashcards = useLiveQuery(() => db.flashcards.toArray());

  const pendingTasks = tasks?.filter((t) => t.status !== "completed") || [];
  const completedTasks = tasks?.filter((t) => t.status === "completed") || [];
  const totalVaultSize = materials?.reduce((acc, m) => acc + (m.fileSize || 0), 0) || 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-32 text-slate-100 font-sans">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 border border-blue-400/30 p-8 sm:p-10 text-white shadow-[0_15px_50px_rgba(37,99,235,0.3)] overflow-hidden">
        {/* Ambient lighting inside banner */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-400/20 blur-3xl rounded-full" />
        <div className="absolute right-1/3 -bottom-16 w-60 h-60 bg-indigo-400/20 blur-3xl rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200">
              <GoogleIcon className="w-3.5 h-3.5" />
              <span>Google Identity Verified • Workspace Encrypted</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {user ? `Welcome back, ${user.name}` : "StudyOS.Ai // Dashboard"}
            </h1>
            <p className="text-white/80 text-sm font-medium max-w-xl">
              {user
                ? `${user.degree} • ${user.institution}`
                : "Your high-security academic workspace is active and isolated."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/materials"
              className="px-4 py-2.5 rounded-full bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all shadow-md flex items-center gap-2"
            >
              <Files className="w-4 h-4 text-blue-600" />
              <span>Secure Vault</span>
            </Link>
            <Link
              href="/tasks"
              className="px-4 py-2.5 rounded-full bg-blue-500/30 hover:bg-blue-500/40 text-white border border-white/20 font-bold text-xs transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Quick Task</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Subjects */}
        <div className="rounded-3xl bg-[#0d1424] p-6 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold">
              <BookOpen className="h-4 w-4 text-blue-400" />
              <span>Registered Subjects</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Active
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-white">{subjects?.length ?? 4}</p>
          <p className="text-[11px] text-slate-500 mt-1">Organized in local curriculum</p>
        </div>

        {/* Pending Tasks */}
        <div className="rounded-3xl bg-[#0d1424] p-6 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold">
              <Target className="h-4 w-4 text-teal-400" />
              <span>Open Action Items</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Tasks
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-teal-400">{pendingTasks.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">{completedTasks.length} items completed</p>
        </div>

        {/* Secure Vault Materials */}
        <div className="rounded-3xl bg-[#0d1424] p-6 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold">
              <HardDrive className="h-4 w-4 text-indigo-400" />
              <span>Vault Materials</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Max 10MB
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-indigo-400">{materials?.length ?? 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">{formatBytes(totalVaultSize)} encrypted</p>
        </div>

        {/* Flashcards */}
        <div className="rounded-3xl bg-[#0d1424] p-6 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold">
              <Layers className="h-4 w-4 text-purple-400" />
              <span>Flashcard Decks</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              SM-2 Active
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-purple-400">{flashcards?.length ?? 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">Adaptive repetition ready</p>
        </div>
      </div>

      {/* Main Content Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Launch & Security Status */}
        <div className="rounded-3xl bg-[#0d1424] border border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col justify-between">
          <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Quick Academic Actions</h3>
            <span className="text-xs text-blue-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> High Performance
            </span>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <Link
              href="/materials"
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/40 hover:bg-blue-600/10 text-blue-400 transition-all group"
            >
              <Files className="h-7 w-7 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xs text-white">Upload Material</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Strict ≤ 10MB Vault</span>
            </Link>

            <Link
              href="/notes"
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-teal-500/40 hover:bg-teal-600/10 text-teal-400 transition-all group"
            >
              <BookOpen className="h-7 w-7 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xs text-white">Lecture Notes</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Rich Text & Code</span>
            </Link>

            <Link
              href="/flashcards"
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 hover:bg-purple-600/10 text-purple-400 transition-all group"
            >
              <Layers className="h-7 w-7 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xs text-white">Review Decks</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Spaced Repetition</span>
            </Link>

            <Link
              href="/tasks"
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-500/40 hover:bg-amber-600/10 text-amber-400 transition-all group"
            >
              <CheckSquare className="h-7 w-7 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xs text-white">Daily Tasks</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Action Checklist</span>
            </Link>
          </div>

          <div className="p-4 mx-6 mb-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between text-xs text-blue-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Google OAuth 2.0 Security Active</span>
            </div>
            <span className="font-mono text-[11px] text-slate-400">SHA-256</span>
          </div>
        </div>

        {/* Today's Priorities */}
        <div className="rounded-3xl bg-[#0d1424] border border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col h-full">
          <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Priority Action Items</h3>
            <Link href="/tasks" className="text-xs font-bold text-blue-400 hover:text-blue-300">
              View all ({tasks?.length || 0})
            </Link>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center">
            {pendingTasks.length > 0 ? (
              <div className="space-y-3 w-full">
                {pendingTasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 bg-white/[0.03] border border-white/10 hover:border-blue-500/30 rounded-2xl flex justify-between items-center transition-all"
                  >
                    <span className="font-semibold text-xs text-white truncate max-w-xs">{task.title}</span>
                    <span className="text-[10px] font-bold text-blue-300 px-2.5 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded-full capitalize">
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="h-12 w-12 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-emerald-400">
                  <CheckSquare className="h-6 w-6" />
                </div>
                <p className="text-slate-300 font-bold text-sm">All tasks completed!</p>
                <p className="text-xs text-slate-500 mt-1">Add new assignments from the Tasks tab.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
