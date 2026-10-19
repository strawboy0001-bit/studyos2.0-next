"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { goalRepo, taskRepo } from "@/lib/db/repositories";
import { ArrowLeft, Target, CheckCircle2, Circle, Trash2, Plus, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import type { Task } from "@/lib/db/schema";

export default function GoalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const goalId = params?.id as string;

  const goal = useLiveQuery(() => (goalId ? db.goals.get(goalId) : undefined), [goalId]);
  const tasks = useLiveQuery(() => (goalId ? db.tasks.where("goalId").equals(goalId).toArray() : []), [goalId]);

  const [newTaskTitle, setNewQuickTaskTitle] = useState("");

  if (!goal) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-slate-400 text-xs">
        <Target className="w-8 h-8 mx-auto mb-2 text-slate-500 animate-pulse" />
        <p>Loading goal details...</p>
      </div>
    );
  }

  const handleToggleTask = async (id: string, currentStatus: Task["status"]) => {
    const newStatus: Task["status"] = currentStatus === "completed" ? "pending" : "completed";
    await taskRepo.updateStatus(id, newStatus);

    // Recalculate goal progress
    if (tasks && tasks.length > 0) {
      const willBeCompletedCount = tasks.filter((t) => (t.id === id ? newStatus === "completed" : t.status === "completed")).length;
      const progress = Math.round((willBeCompletedCount / tasks.length) * 100);
      await goalRepo.update(goal.id, { progress });
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await taskRepo.create({
      title: newTaskTitle.trim(),
      goalId: goal.id,
      priority: "medium",
      status: "pending",
    });

    setNewQuickTaskTitle("");

    // Recalculate progress
    const updatedTasks = await db.tasks.where("goalId").equals(goal.id).toArray();
    const completedCount = updatedTasks.filter((t) => t.status === "completed").length;
    const progress = Math.round((completedCount / updatedTasks.length) * 100);
    await goalRepo.update(goal.id, { progress });
  };

  const handleDeleteGoal = async () => {
    if (confirm("Are you sure you want to delete this goal and its tasks?")) {
      await goalRepo.delete(goal.id);
      if (tasks) {
        for (const t of tasks) {
          await taskRepo.delete(t.id);
        }
      }
      router.push("/goals");
    }
  };

  const isCompleted = goal.status === "completed";

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32 text-slate-100 font-sans">
      <div className="flex items-center justify-between">
        <Link
          href="/goals"
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Goals</span>
        </Link>

        <button
          onClick={handleDeleteGoal}
          className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-white/5 transition-colors"
          title="Delete Goal"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Goal Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0c1224] border border-white/10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border inline-block ${
                isCompleted
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-blue-500/10 text-blue-400 border-blue-500/20"
              }`}
            >
              {isCompleted ? "Completed Milestone" : "Active Target"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{goal.title}</h1>
          </div>

          <button
            onClick={async () => {
              const newStatus = isCompleted ? "active" : "completed";
              await goalRepo.update(goal.id, { status: newStatus });
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 self-start sm:self-auto ${
              isCompleted
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isCompleted ? "Marked Complete" : "Mark as Complete"}</span>
          </button>
        </div>

        {goal.description && (
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{goal.description}</p>
        )}

        {/* Progress Bar & Target Date */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Milestone Completion</span>
            <span className="font-bold text-white">{goal.progress}%</span>
          </div>

          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${isCompleted ? "bg-emerald-400" : "bg-blue-500"}`}
              style={{ width: `${goal.progress}%` }}
            />
          </div>

          {goal.targetDate && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Target Date: {new Date(goal.targetDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Linked Tasks Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0c1224] border border-white/10 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h2 className="text-base font-bold text-white">Action Steps & Sub-Tasks</h2>
            <p className="text-xs text-slate-400">Complete items to advance overall goal progress</p>
          </div>
          <span className="text-xs text-slate-400">{tasks?.length || 0} tasks</span>
        </div>

        {/* Add Sub-task form */}
        <form onSubmit={handleAddTask} className="flex gap-2">
          <input
            type="text"
            placeholder="Add a new action step..."
            value={newTaskTitle}
            onChange={(e) => setNewQuickTaskTitle(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>

        {/* Tasks List */}
        <div className="space-y-2.5 pt-1">
          {tasks && tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => handleToggleTask(task.id, task.status)}
                    className="text-slate-500 hover:text-blue-400 transition-colors"
                  >
                    {task.status === "completed" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>
                  <span
                    className={`text-xs truncate ${
                      task.status === "completed" ? "text-slate-500 line-through" : "text-white font-medium"
                    }`}
                  >
                    {task.title}
                  </span>
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
            ))
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs">
              No tasks linked to this goal yet. Add one above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
