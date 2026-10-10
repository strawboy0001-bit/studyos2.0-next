"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { taskRepo } from "@/lib/db/repositories";
import { CheckSquare, Circle, CheckCircle2, ListTodo, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TasksPage() {
  const tasks = useLiveQuery(() => db.tasks.toArray());
  const goals = useLiveQuery(() => db.goals.toArray());

  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleToggleTask = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    await taskRepo.updateStatus(id, newStatus as any);
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
    return <div className="text-center py-12 text-slate-500">Loading tasks...</div>;
  }

  const pendingTasks = tasks.filter(t => t.status !== "completed");
  const completedTasks = tasks.filter(t => t.status === "completed");

  const getGoalName = (goalId?: string) => {
    if (!goalId || !goals) return null;
    return goals.find(g => g.id === goalId)?.title;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tasks & To-Dos</h1>
          <p className="text-slate-500 mt-1">Manage your daily action items.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-4">
        <form onSubmit={handleQuickAdd} className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1 px-4 py-2 border-0 bg-slate-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-slate-900 text-white p-2 rounded-md hover:bg-slate-800 flex items-center justify-center">
            <Plus className="h-5 w-5" />
          </button>
        </form>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed rounded-xl flex flex-col items-center">
          <ListTodo className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No tasks yet</h3>
          <p className="text-slate-500 mt-1 mb-4">Add your first task above, or generate them from a Goal.</p>
          <Link href="/goals/new" className="bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)] text-violet-700 px-4 py-2 rounded-md font-medium hover:bg-white/50 backdrop-blur-md border border-white/50 transition-colors">
            Break Down a Goal
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                <Circle className="h-4 w-4 text-violet-600" /> Pending ({pendingTasks.length})
              </h2>
              {pendingTasks.map(task => (
                <div key={task.id} className="bg-white p-4 rounded-lg border shadow-sm flex items-start gap-3 hover:border-blue-300 transition-colors group">
                  <button onClick={() => handleToggleTask(task.id, task.status)} className="mt-1 text-slate-300 hover:text-violet-600">
                    <Circle className="h-5 w-5" />
                  </button>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{task.title}</p>
                    {task.goalId && (
                      <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
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
              <h2 className="font-semibold text-slate-500 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> Completed ({completedTasks.length})
              </h2>
              {completedTasks.map(task => (
                <div key={task.id} className="bg-slate-50 p-4 rounded-lg border flex items-start gap-3 opacity-60 hover:opacity-100 transition-opacity">
                  <button onClick={() => handleToggleTask(task.id, task.status)} className="mt-1 text-green-500">
                    <CheckCircle2 className="h-5 w-5" />
                  </button>
                  <div className="flex-1">
                    <p className="font-medium text-slate-600 line-through">{task.title}</p>
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
