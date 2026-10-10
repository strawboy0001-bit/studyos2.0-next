"use client";

import { BookOpen, Calendar, Target, Clock, CheckSquare, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import Image from "next/image";

export default function DashboardPage() {
  const profile = useLiveQuery(() => db.profile.get(1));
  const tasks = useLiveQuery(() => db.tasks.toArray());
  
  const pendingTasks = tasks?.filter(t => t.status !== "completed") || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-32">
      <div className="bg-blue-400 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -left-16 -top-16 w-64 h-64 bg-blue-300 rounded-full opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tight mb-2">
            {profile ? `Study_OS // ${profile.name}` : "Study_OS // Dashboard"}
          </h1>
          <p className="text-blue-100 font-medium">
            {profile ? `Class: ${profile.degree}` : "Let's do our best today!"}
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl bg-white/80 backdrop-blur-md p-6 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            <h3 className="font-bold text-blue-900/60 text-sm">Subjects</h3>
          </div>
          <p className="mt-4 text-4xl font-black text-blue-500">4</p>
        </div>
        <div className="rounded-3xl bg-white/80 backdrop-blur-md p-6 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-indigo-500" />
            <h3 className="font-bold text-blue-900/60 text-sm">Active Goals</h3>
          </div>
          <p className="mt-4 text-4xl font-black text-indigo-500">2</p>
        </div>
        <div className="rounded-3xl bg-white/80 backdrop-blur-md p-6 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-400" />
            <h3 className="font-bold text-blue-900/60 text-sm">Study Time</h3>
          </div>
          <p className="mt-4 text-4xl font-black text-blue-400">2.5<span className="text-sm font-bold text-blue-900/30 ml-2">hrs</span></p>
        </div>
        <div className="rounded-3xl bg-white/80 backdrop-blur-md p-6 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-blue-900/60 text-sm">Upcoming Exams</h3>
          </div>
          <p className="mt-4 text-4xl font-black text-blue-600">1</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="rounded-3xl bg-white/80 backdrop-blur-md shadow-sm border border-blue-100 overflow-hidden">
          <div className="border-b border-blue-100 px-6 py-4">
            <h3 className="font-bold text-blue-950 text-lg">Quick Actions</h3>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <Link href="/tasks/new" className="flex flex-col items-center justify-center p-6 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-500 transition-colors">
              <Target className="h-8 w-8 mb-3" />
              <span className="font-bold text-sm">Add Task</span>
            </Link>
            <Link href="/notes/new" className="flex flex-col items-center justify-center p-6 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-500 transition-colors">
              <BookOpen className="h-8 w-8 mb-3" />
              <span className="font-bold text-sm">New Note</span>
            </Link>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="rounded-3xl bg-white/80 backdrop-blur-md shadow-sm border border-blue-100 overflow-hidden flex flex-col h-full">
          <div className="border-b border-blue-100 px-6 py-4 flex items-center justify-between">
            <h3 className="font-bold text-blue-950 text-lg">Today's Priorities</h3>
            <Link href="/tasks" className="text-sm font-bold text-blue-500 hover:text-blue-600">View all</Link>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
            {pendingTasks.length > 0 ? (
              <div className="space-y-4 w-full text-left">
                {pendingTasks.slice(0,3).map(task => (
                   <div key={task.id} className="p-4 bg-blue-50 rounded-2xl flex justify-between items-center border border-blue-100/50">
                     <span className="font-bold text-blue-950">{task.title}</span>
                     <span className="text-xs font-bold text-blue-500 px-3 py-1 bg-white rounded-full">{task.priority}</span>
                   </div>
                ))}
              </div>
            ) : (
              <>
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <CheckSquare className="h-8 w-8 text-blue-400" />
                </div>
                <p className="text-blue-900/60 font-bold">All tasks done! Good job!</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
