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
    <div className="space-y-6 max-w-7xl mx-auto pb-24 text-slate-100 font-sans">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-[#0c1222] border border-white/[0.08] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="tag-outline">
                <GoogleIcon className="w-3.5 h-3.5" />
                <span>Verified Scholar</span>
              </span>
              <span className="tag-outline">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Encrypted Sandbox</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {user ? `Welcome back, ${user.name}` : "Academic Workspace"}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm font-normal max-w-xl">
              {user
                ? `${user.degree} • ${user.institution}`
                : "Your client-isolated academic operating system is active."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/planner"
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-200 text-xs font-medium transition-colors flex items-center gap-2"
            >
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Pomodoro</span>
            </Link>
            <Link
              href="/materials"
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-200 text-xs font-medium transition-colors flex items-center gap-2"
            >
              <Files className="w-4 h-4 text-slate-400" />
              <span>Vault</span>
            </Link>
            <Link
              href="/tasks"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview Grid: Neutral + One Flat Accent */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Courses */}
        <Link
          href="/subjects"
          className="rounded-2xl bg-[#0c1222] p-5 border border-white/[0.08] hover:border-white/[0.16] transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <BookOpen className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
              <span>Curriculum Courses</span>
            </div>
            <span className="tag-outline text-[10px]">
              Active
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-white tracking-tight">{subjects?.length ?? 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">Organized in curriculum</p>
        </Link>

        {/* Pending Tasks */}
        <Link
          href="/tasks"
          className="rounded-2xl bg-[#0c1222] p-5 border border-white/[0.08] hover:border-white/[0.16] transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <Target className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
              <span>Pending Tasks</span>
            </div>
            <span className="tag-outline text-[10px]">
              {pendingTasks.length} Open
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-white tracking-tight">{pendingTasks.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">{completedTasks.length} items completed</p>
        </Link>

        {/* Flashcards */}
        <Link
          href="/flashcards"
          className="rounded-2xl bg-[#0c1222] p-5 border border-white/[0.08] hover:border-white/[0.16] transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <Layers className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
              <span>Flashcard Cards</span>
            </div>
            <span className="tag-outline text-[10px]">
              {dueFlashcards.length} Due
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-white tracking-tight">{flashcards?.length ?? 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">SM-2 Spaced Repetition</p>
        </Link>

        {/* Materials Vault */}
        <Link
          href="/materials"
          className="rounded-2xl bg-[#0c1222] p-5 border border-white/[0.08] hover:border-white/[0.16] transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <HardDrive className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
              <span>Vault Documents</span>
            </div>
            <span className="tag-outline text-[10px]">
              ≤ 10MB
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-white tracking-tight">{materials?.length ?? 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">{formatBytes(totalVaultSize)} secured</p>
        </Link>
      </div>

      {/* Study Rhythm Companion Module: Restrained & Sophisticated */}
      <div className="rounded-2xl bg-[#0c1222] border border-white/[0.08] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-white/20 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gwen.png" alt="Gwen Stacy" className="w-full h-full object-cover" />
          </div>

          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <span className="tag-outline text-[10px]">
                STUDY STRATEGY
              </span>
              <span className="text-xs text-slate-400 font-medium">Gwen Stacy</span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-white leading-tight">
              &quot;Stay in the groove. Sharp reflexes beat cramming.&quot;
            </h3>
            <p className="text-xs text-slate-400">
              Active recall drills and spaced repetition keep your retention high without burnout.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
          <Link
            href="/planner"
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors text-center"
          >
            Start Focus Sprint
          </Link>
          <Link
            href="/quizzes"
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white font-medium text-xs transition-colors text-center"
          >
            Reflex Quiz
          </Link>
        </div>
      </div>

      {/* Main Two-Column Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Launchpad */}
        <div className="rounded-2xl bg-[#0c1222] border border-white/[0.08] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <h3 className="font-semibold text-white text-sm">Academic Launchpad</h3>
            <span className="tag-outline text-[10px]">Ready</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/planner"
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-colors group text-left space-y-2"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 group-hover:text-blue-400 transition-colors">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Pomodoro Timer</p>
                <p className="text-[11px] text-slate-400">Focus sprints & breaks</p>
              </div>
            </Link>

            <Link
              href="/quizzes"
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-colors group text-left space-y-2"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 group-hover:text-blue-400 transition-colors">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">AI Quiz Centre</p>
                <p className="text-[11px] text-slate-400">{quizzes?.length || 0} active test sets</p>
              </div>
            </Link>

            <Link
              href="/flashcards"
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-colors group text-left space-y-2"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 group-hover:text-blue-400 transition-colors">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Flashcard Decks</p>
                <p className="text-[11px] text-slate-400">{dueFlashcards.length} cards due today</p>
              </div>
            </Link>

            <Link
              href="/notes"
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-colors group text-left space-y-2"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 group-hover:text-blue-400 transition-colors">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Lecture Notes</p>
                <p className="text-[11px] text-slate-400">Encrypted note store</p>
              </div>
            </Link>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Current Streak Active</span>
            </span>
            <Link href="/planner" className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors">
              Focus Session <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Priority Action Items */}
        <div className="rounded-2xl bg-[#0c1222] border border-white/[0.08] p-6 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <h3 className="font-semibold text-white text-sm">Priority Action Items</h3>
            <Link href="/tasks" className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
              View all ({tasks?.length || 0})
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {pendingTasks.length > 0 ? (
              <div className="space-y-2">
                {pendingTasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] rounded-xl flex justify-between items-center transition-colors"
                  >
                    <span className="font-medium text-xs text-white truncate max-w-xs">{task.title}</span>
                    <span className="tag-outline text-[10px] capitalize">
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="h-9 w-9 bg-white/[0.04] border border-white/[0.08] rounded-xl flex items-center justify-center mx-auto mb-2 text-slate-400">
                  <CheckSquare className="h-4 w-4" />
                </div>
                <p className="text-slate-300 font-medium text-xs">All tasks completed</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Add new tasks from the Tasks tab or Planner.</p>
              </div>
            )}
          </div>

          <div className="pt-2">
            <Link
              href="/tasks"
              className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-2"
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
