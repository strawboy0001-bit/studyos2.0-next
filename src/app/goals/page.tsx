"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Target, Plus, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import { goalRepo } from "@/lib/db/repositories";
import type { Goal } from "@/lib/db/schema";

export default function GoalsPage() {
  const goals = useLiveQuery(() => db.goals.toArray());

  const handleComplete = async (id: string, currentStatus: Goal["status"]) => {
    const newStatus: Goal["status"] = currentStatus === "completed" ? "active" : "completed";
    await goalRepo.update(id, { status: newStatus });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-32 text-slate-100 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Academic Goals & Milestones</h1>
            <span className="tag-outline">
              {goals?.length || 0} Targets
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">Set high-impact targets and monitor progress across your semester.</p>
        </div>
        <Link
          href="/goals/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Goal</span>
        </Link>
      </div>

      {/* Gwen Stacy Goals Motivator Card */}
      <div className="p-4 rounded-2xl bg-[#0c1222] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/20 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gwen.png" alt="Gwen" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">Gwen Stacy</span>
              <span className="tag-outline text-[10px]">GOAL VELOCITY</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Aim high, break it down, hit the targets. Big ambitions become reality when you execute milestones one day at a time.
            </p>
          </div>
        </div>
      </div>

      {goals === undefined ? (
        <div className="text-slate-400 text-center py-12 text-xs">Loading goals...</div>
      ) : goals.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-[#0c1222] border border-dashed border-white/[0.08] p-8 space-y-3">
          <Target className="h-10 w-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">No active goals yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Define target grades, research milestones, or study streaks to break down into daily tasks.
          </p>
          <div className="pt-2">
            <Link
              href="/goals/new"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Start a Goal</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const isDone = goal.status === "completed";

            return (
              <div
                key={goal.id}
                className="rounded-2xl bg-[#0c1222] border border-white/[0.08] p-5 hover:border-white/[0.16] transition-colors flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl border ${
                          isDone
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-white/[0.04] border-white/[0.08] text-slate-300"
                        }`}
                      >
                        <Target className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {goal.title}
                        </h3>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border inline-block mt-0.5 ${
                            isDone
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-white/[0.04] text-slate-400 border-white/[0.08]"
                          }`}
                        >
                          {isDone ? "Completed" : "In Progress"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleComplete(goal.id, goal.status)}
                      className={`p-1.5 rounded-xl transition-colors ${
                        isDone ? "text-emerald-400 hover:text-slate-400" : "text-slate-500 hover:text-emerald-400"
                      }`}
                      title={isDone ? "Mark active" : "Mark completed"}
                    >
                      {isDone ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed min-h-[36px]">
                    {goal.description || "Academic milestone objective."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 space-y-3">
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>Progress</span>
                    <span className="font-bold text-white">{goal.progress}%</span>
                  </div>

                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${isDone ? "bg-emerald-400" : "bg-blue-500"}`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>

                  <div className="pt-2 flex justify-between items-center text-xs">
                    <span className="text-slate-500 text-[11px]">
                      {goal.targetDate ? `Target: ${new Date(goal.targetDate).toLocaleDateString()}` : "Ongoing milestone"}
                    </span>
                    <Link
                      href={`/goals/${goal.id}`}
                      className="text-blue-400 hover:text-blue-300 flex items-center font-semibold text-xs"
                    >
                      <span>Details</span>
                      <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
