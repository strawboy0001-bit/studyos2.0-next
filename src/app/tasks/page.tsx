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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Tasks & To-Dos</h1>
          <p className="text-slate-400 text-xs mt-1">Manage your academic action items.</p>
        </div>
      </div>

      <div className="bg-[#0d1424] rounded-2xl border border-white/10 p-3 shadow-sm">
        <form onSubmit={handleQuickAdd} className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="What needs to be accomplished today?"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500/50"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl flex items-center justify-center transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
          </button>
        </form>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-16 bg-[#0b1226]/50 border border-dashed border-white/10 rounded-3xl flex flex-col items-center">
          <ListTodo className="h-12 w-12 text-slate-500 mb-4" />
          <h3 className="text-lg font-bold text-white">No tasks yet</h3>
          <p className="text-slate-400 text-xs mt-1 mb-4">Add your first task above, or generate them from a Goal.</p>
          <Link
            href="/goals/new"
            className="bg-blue-600/20 text-blue-300 border border-blue-500/30 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-blue-600/30 transition-colors"
          >
            Break Down a Goal
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Circle className="h-3.5 w-3.5 text-blue-400" /> Pending Action Items ({pendingTasks.length})
              </h2>
              {pendingTasks.map(task => (
                <div
                  key={task.id}
                  className="bg-[#0d1424] p-4 rounded-2xl border border-white/10 shadow-sm flex items-start gap-3 hover:border-blue-500/40 transition-colors group"
                >
                  <button
                    onClick={() => handleToggleTask(task.id, task.status)}
                    className="mt-1 text-slate-500 hover:text-blue-400"
                  >
                    <Circle className="h-4 w-4" />
                  </button>
                  <div className="flex-1">
                    <p className="font-semibold text-xs text-white">{task.title}</p>
                    {task.goalId && (
                      <span className="inline-block mt-1 text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded">
                        Goal: {getGoalName(task.goalId) || "Unknown"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Completed ({completedTasks.length})
              </h2>
              {completedTasks.map(task => (
                <div
                  key={task.id}
                  className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 flex items-start gap-3 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <button
                    onClick={() => handleToggleTask(task.id, task.status)}
                    className="mt-1 text-emerald-400"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                  <div className="flex-1">
                    <p className="font-medium text-xs text-slate-400 line-through">{task.title}</p>
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
