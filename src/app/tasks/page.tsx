"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { taskRepo } from "@/lib/db/repositories";
import { Circle, CheckCircle2, ListTodo, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Task } from "@/lib/db/schema";

export default function TasksPage() {
  const tasks = useLiveQuery(() => db.tasks.toArray());
  const goals = useLiveQuery(() => db.goals.toArray());

  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleToggleTask = async (id: string, currentStatus: Task["status"]) => {
    const newStatus: Task["status"] = currentStatus === "completed" ? "pending" : "completed";
    await taskRepo.updateStatus(id, newStatus);
  };

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    await taskRepo.create({
      title: newTaskTitle,
      priority: "medium",
      status: "pending"
    });
    setNewTaskTitle("");
  };

  if (tasks === undefined) {
    return <div className="text-center py-12 text-slate-400">Loading tasks...</div>;
  }

  const pendingTasks = tasks.filter(t => t.status !== "completed");
  const completedTasks = tasks.filter(t => t.status === "completed");

  const getGoalName = (goalId?: string) => {
    if (!goalId || !goals) return null;
    return goals.find(g => g.id === goalId)?.title;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24 text-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Tasks & Assignments</h1>
            <span className="tag-outline">
              {pendingTasks.length} Pending
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">Manage, prioritize, and execute academic action items.</p>
        </div>
      </div>

      {/* Gwen Stacy Mission Motivator Card */}
      <div className="p-4 rounded-2xl surface-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-sky-400/30 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gwen.png" alt="Gwen" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">Gwen Stacy</span>
              <span className="tag-outline text-[10px]">EXECUTION STRATEGY</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Knock out the rapid 5-minute action items first. Once you gain momentum, tackling major coursework becomes effortless.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Add Form */}
      <div className="surface-1 rounded-2xl p-3">
        <form onSubmit={handleQuickAdd} className="flex gap-2.5 items-center">
          <input
            type="text"
            placeholder="Add a new academic action item or study objective..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1 px-4 py-2.5 surface-2 hairline-border rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400"
          />
          <button
            type="submit"
            className="bg-[#0084ff] hover:bg-[#0074e0] text-white p-2.5 rounded-xl flex items-center justify-center transition-colors shrink-0 shadow-sm"
          >
            <Plus className="h-4 w-4" />
          </button>
        </form>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-16 surface-1 border border-dashed border-sky-400/25 rounded-2xl flex flex-col items-center">
          <ListTodo className="h-10 w-10 text-slate-500 mb-3" />
          <h3 className="text-base font-semibold text-white">No tasks yet</h3>
          <p className="text-slate-400 text-xs mt-1 mb-4">Add your first task above, or generate them from a Goal.</p>
          <Link
            href="/goals"
            className="bg-[#0084ff] hover:bg-[#0074e0] text-white px-4 py-2 rounded-xl text-xs font-medium transition-colors shadow-sm"
          >
            Break Down a Goal
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div className="space-y-2.5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Circle className="h-3.5 w-3.5 text-sky-400" /> Pending Action Items ({pendingTasks.length})
              </h2>
              {pendingTasks.map(task => (
                <div
                  key={task.id}
                  className="surface-1 p-3.5 rounded-xl hover:border-sky-400/35 transition-colors group flex items-start gap-3"
                >
                  <button
                    onClick={() => handleToggleTask(task.id, task.status)}
                    className="mt-0.5 text-slate-500 hover:text-sky-400 transition-colors"
                  >
                    <Circle className="h-4 w-4" />
                  </button>
                  <div className="flex-1">
                    <p className="font-medium text-xs text-white">{task.title}</p>
                    {task.goalId && (
                      <span className="tag-outline text-[10px] mt-1">
                        Goal: {getGoalName(task.goalId) || "Course Goal"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Completed ({completedTasks.length})
              </h2>
              {completedTasks.map(task => (
                <div
                  key={task.id}
                  className="bg-[#0c1222]/50 p-3 rounded-xl border border-white/[0.04] flex items-start gap-3 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <button
                    onClick={() => handleToggleTask(task.id, task.status)}
                    className="mt-0.5 text-emerald-400"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                  <div className="flex-1">
                    <p className="font-normal text-xs text-slate-400 line-through">{task.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
