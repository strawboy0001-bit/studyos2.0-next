"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Square, Calendar as CalendarIcon, Clock, Settings2 } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

export default function PlannerPage() {
  const tasks = useLiveQuery(() => db.tasks.toArray());
  
  // Focus Timer State
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (mode === "focus") {
        setMode("break");
        setTimeLeft(5 * 60); // 5 min break
        alert("Focus session complete! Time for a break.");
      } else {
        setMode("focus");
        setTimeLeft(25 * 60);
        alert("Break over! Ready to focus?");
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === "focus" ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const pendingTasks = tasks?.filter(t => t.status !== "completed") || [];

  return (
    <div className="space-y-6 font-serif">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-amber-950">Study Planner</h1>
          <p className="text-amber-900/70 mt-1">Manage your time and focus sessions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Planner View */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/60 backdrop-blur-md border border-amber-900/10 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-amber-700" /> Today's Schedule
              </h2>
              <button className="text-sm font-medium text-amber-700 hover:underline">Regenerate Plan</button>
            </div>
            
            {pendingTasks.length === 0 ? (
              <div className="text-center py-8 text-amber-900/50">
                No tasks scheduled for today.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative pl-6 border-l-2 border-amber-900/10 space-y-8">
                  {pendingTasks.map((task, idx) => (
                    <div key={task.id} className="relative">
                      <div className="absolute -left-[31px] bg-white border-2 border-amber-300 rounded-full h-4 w-4 top-1 shadow-sm" />
                      <div className="bg-white/80 border border-amber-900/5 rounded-lg p-4 hover:border-amber-300 transition-colors shadow-sm">
                        <div className="text-xs font-semibold text-amber-700/60 mb-1">
                          {9 + idx}:00 AM - {10 + idx}:00 AM
                        </div>
                        <h3 className="font-medium text-amber-950">{task.title}</h3>
                        <p className="text-sm text-amber-900/60 mt-1">Estimated: 1 hour • Priority: {task.priority}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Focus Timer & Stats */}
        <div className="space-y-6">
          <div className="bg-white/60 backdrop-blur-md border border-amber-900/10 rounded-xl p-6 shadow-sm text-center">
            <h2 className="font-bold text-amber-950 mb-6 flex items-center justify-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" /> Focus Timer
            </h2>
            
            <div className="flex justify-center gap-4 mb-6">
              <button 
                onClick={() => { setMode('focus'); setTimeLeft(25 * 60); setIsRunning(false); }}
                className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${mode === 'focus' ? 'bg-indigo-100/80 text-indigo-800' : 'text-amber-900/60 hover:bg-white/50'}`}
              >
                Pomodoro
              </button>
              <button 
                onClick={() => { setMode('break'); setTimeLeft(5 * 60); setIsRunning(false); }}
                className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${mode === 'break' ? 'bg-amber-100 text-amber-800' : 'text-amber-900/60 hover:bg-white/50'}`}
              >
                Short Break
              </button>
            </div>

            <div className="text-6xl font-black text-amber-950 mb-8 tracking-tight font-sans">
              {formatTime(timeLeft)}
            </div>

            <div className="flex justify-center gap-4">
              <button 
                onClick={toggleTimer}
                className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-white transition-colors shadow-md ${isRunning ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-amber-800 hover:bg-amber-900'}`}
              >
                {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                {isRunning ? 'Pause' : 'Start'}
              </button>
              <button 
                onClick={resetTimer}
                className="p-3 bg-white border border-amber-900/10 text-amber-900/60 rounded-lg hover:bg-amber-50 transition-colors shadow-sm"
                title="Reset Timer"
              >
                <Square className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="bg-white/40 backdrop-blur-sm border border-amber-900/5 rounded-xl p-6">
            <h3 className="font-semibold text-amber-950 flex items-center gap-2 mb-4">
              <Settings2 className="h-4 w-4 text-amber-700" /> Daily Availability
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center bg-white/70 p-3 rounded shadow-sm border border-amber-900/5">
                <span className="text-amber-900/70">Max Study Hours</span>
                <span className="font-medium text-amber-950">4 hrs</span>
              </div>
              <div className="flex justify-between items-center bg-white/70 p-3 rounded shadow-sm border border-amber-900/5">
                <span className="text-amber-900/70">Preferred Time</span>
                <span className="font-medium text-amber-950">Morning</span>
              </div>
              <button className="w-full text-amber-700 font-medium hover:underline text-center mt-2">
                Edit Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
