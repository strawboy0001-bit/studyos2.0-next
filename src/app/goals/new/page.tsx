"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, CheckSquare, Search, FileText, AlertTriangle, CheckCircle2 } from "lucide-react";
import { goalRepo, taskRepo } from "@/lib/db/repositories";

export default function NewGoalWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Goal Data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [dataSource, setDataSource] = useState("manual"); // manual, upload, search
  
  // Generated Tasks & Challenges
  const [generatedTasks, setGeneratedTasks] = useState([
    "Review core concepts and definitions",
    "Find reliable video tutorials on the topic",
    "Complete 3 practice exercises",
    "Test knowledge with a flashcard session"
  ]);
  const [challenges] = useState([
    { issue: "Procrastination due to overwhelming scope", solution: "Focus only on one 25-minute Pomodoro session at a time." },
    { issue: "Difficulty finding quality resources", solution: "Stick to verified University playlists or official documentation." }
  ]);

  const handleSimulateBreakdown = () => {
    setIsLoading(true);
    // Simulate AI or processing delay
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 1500);
  };

  const handleSaveGoal = async () => {
    if (!title) return;
    
    // Save Goal
    const goal = await goalRepo.create({
      title,
      description,
      targetDate: targetDate ? new Date(targetDate) : undefined,
      progress: 0,
      status: "active"
    });

    // Save Tasks linked to this goal
    for (const taskTitle of generatedTasks) {
      await taskRepo.create({
        title: taskTitle,
        goalId: goal.id,
        priority: "medium",
        status: "pending"
      });
    }

    router.push("/goals");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create a New Goal</h1>
        <p className="text-slate-500 mt-1">We&apos;ll help you break down your objective into actionable steps.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className={`flex flex-col items-center ${step >= 1 ? 'text-violet-700' : 'text-slate-400'}`}>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-2 font-bold ${step >= 1 ? 'bg-white/50 backdrop-blur-md border border-white/50 text-violet-700' : 'bg-slate-100 text-slate-400'}`}>1</div>
          <span className="text-xs font-medium">Define</span>
        </div>
        <div className={`flex-1 h-1 mx-4 rounded-full ${step >= 2 ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-[0_4px_16px_rgba(139,92,246,0.3)] border border-white/20' : 'bg-slate-200'}`} />
        <div className={`flex flex-col items-center ${step >= 2 ? 'text-violet-700' : 'text-slate-400'}`}>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-2 font-bold ${step >= 2 ? 'bg-white/50 backdrop-blur-md border border-white/50 text-violet-700' : 'bg-slate-100 text-slate-400'}`}>2</div>
          <span className="text-xs font-medium">Data Source</span>
        </div>
        <div className={`flex-1 h-1 mx-4 rounded-full ${step >= 3 ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-[0_4px_16px_rgba(139,92,246,0.3)] border border-white/20' : 'bg-slate-200'}`} />
        <div className={`flex flex-col items-center ${step >= 3 ? 'text-violet-700' : 'text-slate-400'}`}>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-2 font-bold ${step >= 3 ? 'bg-white/50 backdrop-blur-md border border-white/50 text-violet-700' : 'bg-slate-100 text-slate-400'}`}>3</div>
          <span className="text-xs font-medium">Review Plan</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800">What do you want to achieve?</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Goal Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master React Hooks, Prepare for Midterm"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add some context about why this is important..."
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Completion Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                onClick={() => setStep(2)}
                disabled={!title}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-[0_4px_16px_rgba(139,92,246,0.3)] border border-white/20 text-white px-6 py-2 rounded-md hover:from-violet-600 hover:to-fuchsia-600 disabled:opacity-50 transition-colors"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800">How should we create your plan?</h2>
            <p className="text-slate-500 text-sm">Provide context to generate accurate sub-tasks and resources.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => setDataSource('manual')}
                className={`p-4 rounded-xl border-2 text-left flex flex-col gap-2 transition-colors ${dataSource === 'manual' ? 'border-blue-500 bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)]' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className={`p-2 rounded-lg w-fit ${dataSource === 'manual' ? 'bg-white/50 backdrop-blur-md border border-white/50 text-violet-700' : 'bg-slate-100 text-slate-500'}`}>
                  <CheckSquare className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-800">Manual Entry</h3>
                <p className="text-xs text-slate-500">I will break down the tasks myself or start from scratch.</p>
              </button>

              <button 
                onClick={() => setDataSource('upload')}
                className={`p-4 rounded-xl border-2 text-left flex flex-col gap-2 transition-colors ${dataSource === 'upload' ? 'border-blue-500 bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)]' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className={`p-2 rounded-lg w-fit ${dataSource === 'upload' ? 'bg-white/50 backdrop-blur-md border border-white/50 text-violet-700' : 'bg-slate-100 text-slate-500'}`}>
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-800">Upload Syllabus</h3>
                <p className="text-xs text-slate-500">Extract tasks automatically from a PDF or DOCX file.</p>
              </button>

              <button 
                onClick={() => setDataSource('search')}
                className={`p-4 rounded-xl border-2 text-left flex flex-col gap-2 transition-colors ${dataSource === 'search' ? 'border-blue-500 bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)]' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className={`p-2 rounded-lg w-fit ${dataSource === 'search' ? 'bg-white/50 backdrop-blur-md border border-white/50 text-violet-700' : 'bg-slate-100 text-slate-500'}`}>
                  <Search className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-800">Web Resources</h3>
                <p className="text-xs text-slate-500">Find YouTube videos and articles to build a plan.</p>
              </button>
            </div>

            {dataSource === 'upload' && (
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50">
                <FileText className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-600 mb-2">Drag and drop your syllabus file here</p>
                <p className="text-xs text-slate-400 mb-4">Supports PDF, DOCX, TXT</p>
                <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-md text-sm font-medium">Browse Files</button>
              </div>
            )}

            {dataSource === 'search' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800 text-sm">
                <Sparkles className="h-5 w-5 shrink-0" />
                <p>We&apos;ll suggest a learning path and trusted resources based on the title <strong>&quot;{title}&quot;</strong>.</p>
              </div>
            )}

            <div className="pt-4 flex justify-between">
              <button 
                onClick={() => setStep(1)}
                className="text-slate-500 px-4 py-2 hover:text-slate-700 transition-colors"
              >
                Back
              </button>
              <button 
                onClick={handleSimulateBreakdown}
                disabled={isLoading}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-[0_4px_16px_rgba(139,92,246,0.3)] border border-white/20 text-white px-6 py-2 rounded-md hover:from-violet-600 hover:to-fuchsia-600 transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                ) : (
                  <><Sparkles className="h-4 w-4" /> Generate Plan</>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Your Action Plan</h2>
            <p className="text-slate-500 text-sm">Review and edit the breakdown for <strong>{title}</strong>.</p>

            <div className="bg-slate-50 rounded-lg p-4 border space-y-3">
              <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                <CheckSquare className="h-4 w-4" /> Generated Tasks
              </h3>
              {generatedTasks.map((task, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-white p-3 rounded border shadow-sm">
                  <input type="text" value={task} onChange={(e) => {
                    const newTasks = [...generatedTasks];
                    newTasks[idx] = e.target.value;
                    setGeneratedTasks(newTasks);
                  }} className="flex-1 outline-none text-sm" />
                  <button onClick={() => setGeneratedTasks(generatedTasks.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-500 text-sm">Remove</button>
                </div>
              ))}
              <button 
                onClick={() => setGeneratedTasks([...generatedTasks, "New Task"])}
                className="text-sm text-violet-700 font-medium hover:underline mt-2 inline-block"
              >
                + Add another task
              </button>
            </div>

            {dataSource === 'search' && (
              <div className="bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)] border border-white/60 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  <Search className="h-4 w-4 text-violet-700" /> Suggested Resources
                </h3>
                <div className="text-sm text-blue-800 bg-white p-3 rounded shadow-sm border border-white/60 flex justify-between">
                  <span>Introduction to {title || "Topic"} (YouTube)</span>
                  <span className="text-xs bg-white/50 backdrop-blur-md border border-white/50 px-2 py-1 rounded">Video</span>
                </div>
                <div className="text-sm text-blue-800 bg-white p-3 rounded shadow-sm border border-white/60 flex justify-between">
                  <span>Official Documentation Guide</span>
                  <span className="text-xs bg-white/50 backdrop-blur-md border border-white/50 px-2 py-1 rounded">Article</span>
                </div>
                <p className="text-xs text-violet-600 italic">These resources will be saved to your Goal details.</p>
              </div>
            )}

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-orange-800 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Anticipated Challenges & Solutions
              </h3>
              <p className="text-xs text-orange-700 mb-2">Watch out for these common pitfalls.</p>
              <div className="space-y-3">
                {challenges.map((c, idx) => (
                  <div key={idx} className="bg-white p-3 rounded shadow-sm border border-orange-100 text-sm">
                    <p className="font-semibold text-slate-800 mb-1">Issue: {c.issue}</p>
                    <p className="text-slate-600"><strong>Solution:</strong> {c.solution}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button 
                onClick={() => setStep(2)}
                className="text-slate-500 px-4 py-2 hover:text-slate-700 transition-colors"
              >
                Back
              </button>
              <button 
                onClick={handleSaveGoal}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" /> Save Goal & Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
