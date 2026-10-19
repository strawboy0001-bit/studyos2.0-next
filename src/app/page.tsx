"use client";

import React from "react";
import {
  BookOpen,
  Target,
  CheckSquare,
  Files,
  Plus,
  Layers,
  HardDrive,
  Clock,
  BrainCircuit,
  ArrowRight,
  Flame
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
  const quizzes = useLiveQuery(() => db.quizzes.toArray());

  const pendingTasks = tasks?.filter((t) => t.status !== "completed") || [];
  const completedTasks = tasks?.filter((t) => t.status === "completed") || [];
  const dueFlashcards = flashcards?.filter((c) => new Date(c.nextReviewDate) <= new Date()) || [];
  const totalVaultSize = materials?.reduce((acc, m) => acc + (m.fileSize || 0), 0) || 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-32 text-slate-100 font-sans">
      {/* Clean Welcome Banner */}
      <div className="relative rounded-3xl bg-[#0c1224] border border-white/10 p-8 sm:p-10 shadow-sm overflow-hidden">
        {/* Subtle illumination */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-300">
              <GoogleIcon className="w-3.5 h-3.5" />
              <span>Google Identity Verified • Local Client Sandbox</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {user ? `Welcome back, ${user.name}` : "Academic Workspace"}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm font-medium max-w-xl">
              {user
                ? `${user.degree} • ${user.institution}`
                : "Your high-security academic workspace is active and isolated."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/planner"
              className="px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-semibold text-xs transition-all flex items-center gap-2"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Pomodoro Timer</span>
            </Link>
            <Link
              href="/materials"
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold text-xs transition-all flex items-center gap-2"
            >
              <Files className="w-4 h-4 text-blue-400" />
              <span>Vault</span>
            </Link>
            <Link
              href="/tasks"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Subjects */}
        <Link
          href="/subjects"
          className="rounded-3xl bg-[#0c1224] p-6 border border-white/10 shadow-sm hover:border-blue-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold">
              <BookOpen className="h-4 w-4 text-blue-400" />
              <span>Courses</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Active
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-white">{subjects?.length ?? 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">Organized in curriculum</p>
        </Link>

        {/* Pending Tasks */}
        <Link
          href="/tasks"
          className="rounded-3xl bg-[#0c1224] p-6 border border-white/10 shadow-sm hover:border-teal-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold">
              <Target className="h-4 w-4 text-teal-400" />
              <span>Pending Tasks</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Tasks
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-teal-400">{pendingTasks.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">{completedTasks.length} items completed</p>
        </Link>

        {/* Flashcards */}
        <Link
          href="/flashcards"
          className="rounded-3xl bg-[#0c1224] p-6 border border-white/10 shadow-sm hover:border-purple-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold">
              <Layers className="h-4 w-4 text-purple-400" />
              <span>Flashcards</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                dueFlashcards.length > 0
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                  : "bg-white/5 text-slate-400 border-white/10"
              }`}
            >
              {dueFlashcards.length} Due
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-purple-400">{flashcards?.length ?? 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">SM-2 Spaced Repetition</p>
        </Link>

        {/* Secure Vault Materials */}
        <Link
          href="/materials"
          className="rounded-3xl bg-[#0c1224] p-6 border border-white/10 shadow-sm hover:border-indigo-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold">
              <HardDrive className="h-4 w-4 text-indigo-400" />
              <span>Vault Materials</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              ≤ 10MB
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-indigo-400">{materials?.length ?? 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">{formatBytes(totalVaultSize)} stored</p>
        </Link>
      </div>

      {/* Main Two-Column Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Launchpad */}
        <div className="rounded-3xl bg-[#0c1224] border border-white/10 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-bold text-white text-base">Academic Launchpad</h3>
            <span className="text-xs text-blue-400 font-semibold">Ready for study</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/planner"
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all group text-left space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  Pomodoro Timer
                </p>
                <p className="text-[11px] text-slate-400">Focus sprints & breaks</p>
              </div>
            </Link>

            <Link
              href="/quizzes"
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all group text-left space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
                  AI Quiz Centre
                </p>
                <p className="text-[11px] text-slate-400">{quizzes?.length || 0} active test sets</p>
              </div>
            </Link>

            <Link
              href="/flashcards"
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all group text-left space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                  Flashcard Decks
                </p>
                <p className="text-[11px] text-slate-400">{dueFlashcards.length} cards due today</p>
              </div>
            </Link>

            <Link
              href="/notes"
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all group text-left space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                  Lecture Notes
                </p>
                <p className="text-[11px] text-slate-400">Encrypted note store</p>
              </div>
            </Link>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Current Streak: Active</span>
            </span>
            <Link href="/planner" className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
              Start Focus Session <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Priority Action Items */}
        <div className="rounded-3xl bg-[#0c1224] border border-white/10 shadow-sm p-6 space-y-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-bold text-white text-base">Priority Action Items</h3>
            <Link href="/tasks" className="text-xs font-semibold text-blue-400 hover:text-blue-300">
              View all ({tasks?.length || 0})
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {pendingTasks.length > 0 ? (
              <div className="space-y-2.5">
                {pendingTasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 bg-white/[0.02] border border-white/10 hover:border-blue-500/30 rounded-2xl flex justify-between items-center transition-all"
                  >
                    <span className="font-semibold text-xs text-white truncate max-w-xs">{task.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                        task.priority === "high"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="h-10 w-10 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-2 text-emerald-400">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <p className="text-slate-300 font-bold text-xs">All tasks completed!</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Add new tasks from the Tasks tab or Planner.</p>
              </div>
            )}
          </div>

          <div className="pt-2">
            <Link
              href="/tasks"
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Assignment</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
