"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Settings2,
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  SkipForward,
  Volume2,
  VolumeX,
  Target
} from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { taskRepo } from "@/lib/db/repositories";
import Link from "next/link";
import type { Task } from "@/lib/db/schema";

export default function PlannerPage() {
  const tasks = useLiveQuery(() => db.tasks.toArray());
  const subjects = useLiveQuery(() => db.subjects.toArray());

  // Focus Timer Config
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [dailyGoalHours, setDailyGoalHours] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Focus Timer Runtime State
  const [mode, setMode] = useState<"focus" | "shortBreak" | "longBreak">("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [newQuickTaskTitle, setNewQuickTaskTitle] = useState("");

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play audio chime using Web Audio API synthesis
  const playChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // Audio autoplay restrictions fallback gracefully
    }
  }, [soundEnabled]);

  // Load preferences from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("studyos_pomodoro_settings");
      if (stored) {
        try {
          const cfg = JSON.parse(stored);
          if (cfg.work) {
            setWorkDuration(cfg.work);
            setTimeLeft(cfg.work * 60);
          }
          if (cfg.shortBreak) setShortBreakDuration(cfg.shortBreak);
          if (cfg.longBreak) setLongBreakDuration(cfg.longBreak);
          if (cfg.dailyGoal) setDailyGoalHours(cfg.dailyGoal);
          if (typeof cfg.sound === "boolean") setSoundEnabled(cfg.sound);
        } catch {
          // ignore
        }
      }
    }
  }, []);

  // Timer Tick Hook
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            playChime();
            setIsRunning(false);

            if (mode === "focus") {
              const newCount = sessionsCompleted + 1;
              setSessionsCompleted(newCount);
              // Every 4 focus sessions, trigger long break
              if (newCount % 4 === 0) {
                setMode("longBreak");
                return longBreakDuration * 60;
              } else {
                setMode("shortBreak");
                return shortBreakDuration * 60;
              }
            } else {
              setMode("focus");
              return workDuration * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, mode, sessionsCompleted, workDuration, shortBreakDuration, longBreakDuration, playChime]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === "focus") setTimeLeft(workDuration * 60);
    else if (mode === "shortBreak") setTimeLeft(shortBreakDuration * 60);
    else setTimeLeft(longBreakDuration * 60);
  };

  const switchMode = (newMode: "focus" | "shortBreak" | "longBreak") => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === "focus") setTimeLeft(workDuration * 60);
    else if (newMode === "shortBreak") setTimeLeft(shortBreakDuration * 60);
    else setTimeLeft(longBreakDuration * 60);
  };

  const skipSession = () => {
    setIsRunning(false);
    if (mode === "focus") {
      setMode("shortBreak");
      setTimeLeft(shortBreakDuration * 60);
    } else {
      setMode("focus");
      setTimeLeft(workDuration * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleToggleTask = async (id: string, currentStatus: Task["status"]) => {
    const newStatus: Task["status"] = currentStatus === "completed" ? "pending" : "completed";
    await taskRepo.updateStatus(id, newStatus);
  };

  const handleAddQuickTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuickTaskTitle.trim()) return;

    await taskRepo.create({
      title: newQuickTaskTitle.trim(),
      priority: "high",
      status: "pending",
    });
    setNewQuickTaskTitle("");
  };

  const pendingTasks = tasks?.filter((t) => t.status !== "completed") || [];
  const completedTasks = tasks?.filter((t) => t.status === "completed") || [];

  // Total timer seconds for calculating circular progress
  const totalSeconds =
    mode === "focus"
      ? workDuration * 60
      : mode === "shortBreak"
      ? shortBreakDuration * 60
      : longBreakDuration * 60;
  const progressRatio = Math.max(0, Math.min(1, 1 - timeLeft / totalSeconds));
  const strokeDashoffset = 440 * (1 - progressRatio);

  const focusedHours = ((sessionsCompleted * workDuration) / 60).toFixed(1);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-32 text-slate-100 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-black tracking-tight text-white">Study Planner & Pomodoro</h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> Spider-Sense Tempo
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              Earth-65 Protocol
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Focus sprints paired with scheduled daily milestones to maximize deep academic retention.
          </p>
        </div>

        <Link
          href="/settings"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <Settings2 className="w-4 h-4 text-slate-400" />
          <span>Timer Settings</span>
        </Link>
      </div>

      {/* Earth-65 Gwen Stacy Focus Tempo Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#180a1c] via-[#0c1224] to-[#081826] border border-pink-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-pink-500/40 shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.35)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gwen.png" alt="Gwen" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-pink-400 tracking-wider">Gwen Stacy • Earth-65 Focus Tempo</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">Reflex Rhythm</span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Stay in the pocket. 25 minutes of unbroken focus followed by a 5-minute breather builds peak reflex stamina.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pomodoro Focus Timer Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0c1224] border border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.3)] flex flex-col items-center text-center relative overflow-hidden">
            {/* Top Mode Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#070b19] border border-white/10 text-xs mb-8">
              <button
                onClick={() => switchMode("focus")}
                className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                  mode === "focus"
                    ? "bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sprint ({workDuration}m)
              </button>
              <button
                onClick={() => switchMode("shortBreak")}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  mode === "shortBreak"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Break ({shortBreakDuration}m)
              </button>
              <button
                onClick={() => switchMode("longBreak")}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  mode === "longBreak"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Rest ({longBreakDuration}m)
              </button>
            </div>

            {/* Circular Progress Ring */}
            <div className="relative w-64 h-64 flex items-center justify-center my-2 select-none">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className="stroke-white/5"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Progress Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className={
                    mode === "focus"
                      ? "stroke-pink-500"
                      : mode === "shortBreak"
                      ? "stroke-cyan-400"
                      : "stroke-purple-400"
                  }
                  strokeWidth="8"
                  strokeDasharray="440"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
              </svg>

              {/* Time Display Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black tracking-tight text-white font-mono">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                  {mode === "focus" ? "Spider-Sense Focus" : "Reflex Recharge"}
                </span>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-center gap-3 mt-6 w-full max-w-xs">
              <button
                onClick={resetTimer}
                className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-400 hover:text-white transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={toggleTimer}
                className={`flex-1 py-3 px-6 rounded-2xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                  isRunning
                    ? "bg-rose-600 hover:bg-rose-500 text-white"
                    : mode === "focus"
                    ? "bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 hover:brightness-110 text-white font-black shadow-[0_0_25px_rgba(236,72,153,0.4)]"
                    : "bg-cyan-600 hover:bg-cyan-500 text-white"
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Focus</span>
                  </>
                )}
              </button>

              <button
                onClick={skipSession}
                className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-400 hover:text-white transition-colors"
                title="Skip to next session"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-400 hover:text-white transition-colors"
                title={soundEnabled ? "Mute chimes" : "Enable chimes"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            {/* Daily Sessions Stats */}
            <div className="mt-8 pt-6 border-t border-white/5 w-full grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] uppercase font-bold text-slate-400">Pomodoros Done</p>
                <p className="text-xl font-black text-amber-400 mt-0.5">{sessionsCompleted}</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] uppercase font-bold text-slate-400">Focused Time</p>
                <p className="text-xl font-black text-teal-400 mt-0.5">{focusedHours} hrs</p>
              </div>
            </div>
          </div>

          {/* Unseen Power Focus Artwork Card */}
          <div className="p-5 rounded-3xl bg-[#0c1224] border border-red-500/20 shadow-sm relative overflow-hidden flex items-center gap-4 group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-red-500/30 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/unseen.png"
                alt="UNSEEN Power"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                UNSEEN POWER • 085
              </span>
              <h4 className="text-xs font-bold text-white mt-1 leading-snug">
                &quot;Covered, but never contained.&quot;
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                Transformation quietly begins in silent, uninterrupted focus.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Daily Focus Schedule & Tasks (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Daily Goal Card */}
          <div className="p-6 rounded-3xl bg-[#0c1224] border border-white/10 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white">Daily Target Progress</h3>
              </div>
              <p className="text-xs text-slate-400">
                {focusedHours} of {dailyGoalHours} hours completed today
              </p>
            </div>

            <div className="w-48 space-y-1 text-right">
              <span className="text-xs font-bold text-teal-400">
                {Math.min(100, Math.round((Number(focusedHours) / dailyGoalHours) * 100))}%
              </span>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-400 transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.round((Number(focusedHours) / dailyGoalHours) * 100))}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Today's Schedule & Action Items */}
          <div className="p-6 rounded-3xl bg-[#0c1224] border border-white/10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <h3 className="text-base font-bold text-white">Active Focus Schedule</h3>
              </div>
              <span className="text-xs text-slate-400">
                {pendingTasks.length} pending • {completedTasks.length} done
              </span>
            </div>

            {/* Quick Add Focus Task Form */}
            <form onSubmit={handleAddQuickTask} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a priority task to tackle in your next Pomodoro..."
                value={newQuickTaskTitle}
                onChange={(e) => setNewQuickTaskTitle(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </form>

            {/* Task Timeline */}
            <div className="space-y-3 pt-1">
              {pendingTasks.length === 0 ? (
                <div className="text-center py-12 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold text-white">All scheduled tasks completed!</p>
                  <p className="text-xs text-slate-500">Add a new task above or relax during your break.</p>
                </div>
              ) : (
                pendingTasks.map((task, idx) => {
                  const linkedSubject = subjects?.find((s) => s.id === task.subjectId);
                  return (
                    <div
                      key={task.id}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-500/30 transition-all flex items-start justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleTask(task.id, task.status)}
                          className="mt-0.5 text-slate-500 hover:text-amber-400 transition-colors"
                          title="Mark complete"
                        >
                          <Circle className="w-4 h-4" />
                        </button>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-500">
                              Block #{idx + 1} (est. {workDuration}m)
                            </span>
                            {linkedSubject && (
                              <span className="text-[10px] text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                                {linkedSubject.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

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
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
