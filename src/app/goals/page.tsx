"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Target, Plus, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { goalRepo } from "@/lib/db/repositories";

export default function GoalsPage() {
  const goals = useLiveQuery(() => db.goals.toArray());

  const handleComplete = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "active" : "completed";
    await goalRepo.update(id, { status: newStatus as any });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Goals</h1>
          <p className="text-slate-500 mt-1">Set targets and break them down into actionable steps.</p>
        </div>
        <Link
          href="/goals/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create New Goal
        </Link>
      </div>

      {goals === undefined ? (
        <div className="text-slate-500 text-center py-12">Loading goals...</div>
      ) : goals.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed rounded-xl flex flex-col items-center">
          <Target className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No active goals</h3>
          <p className="text-slate-500 mt-1 mb-4">Tell us what you want to achieve, and we'll help you get there.</p>
          <Link href="/goals/new" className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition-colors">
            Start a Goal
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-white border rounded-xl p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${goal.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                    <Target className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{goal.title}</h3>
                </div>
                <button
                  onClick={() => handleComplete(goal.id, goal.status)}
                  className={`p-1 rounded-full ${goal.status === 'completed' ? 'text-green-500 hover:text-slate-400' : 'text-slate-300 hover:text-green-500'}`}
                >
                  <CheckCircle2 className="h-6 w-6" />
                </button>
              </div>
              <p className="text-sm text-slate-500 mt-2 line-clamp-2 min-h-[40px]">
                {goal.description || "No description."}
              </p>

              <div className="mt-6 flex flex-col gap-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Progress</span>
                  <span className="font-medium">{goal.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${goal.status === 'completed' ? 'bg-green-500' : 'bg-purple-500'}`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t flex justify-between items-center text-sm">
                <span className="text-slate-500">
                  {goal.targetDate ? `Target: ${new Date(goal.targetDate).toLocaleDateString()}` : "No specific target date"}
                </span>
                <Link href={`/goals/${goal.id}`} className="text-blue-600 hover:underline flex items-center font-medium">
                  Details <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
