"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, CheckSquare, Search, FileText, AlertTriangle, CheckCircle2, ArrowLeft } from "lucide-react";
import { goalRepo, taskRepo } from "@/lib/db/repositories";
import Link from "next/link";

export default function NewGoalWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Goal Data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [dataSource, setDataSource] = useState("manual");

  // Generated Tasks & Challenges
  const [generatedTasks, setGeneratedTasks] = useState([
    "Review core concepts and foundational definitions",
    "Find trusted lecture series and documentation",
    "Complete 3 practical problem sets or lab exercises",
    "Test conceptual retention with flashcard reviews",
  ]);
  const [challenges] = useState([
    {
      issue: "Procrastination due to overwhelming scope",
      solution: "Focus strictly on one 25-minute Pomodoro session at a time.",
    },
    {
      issue: "Difficulty finding quality resources",
      solution: "Stick to verified university lecture syllabi and authoritative textbooks.",
    },
  ]);

  const handleSimulateBreakdown = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 1200);
  };

  const handleSaveGoal = async () => {
    if (!title.trim()) return;

    const goal = await goalRepo.create({
      title: title.trim(),
      description: description.trim() || undefined,
      targetDate: targetDate ? new Date(targetDate) : undefined,
      progress: 0,
      status: "active",
    });

    for (const taskTitle of generatedTasks) {
      if (taskTitle.trim()) {
        await taskRepo.create({
          title: taskTitle.trim(),
          goalId: goal.id,
          priority: "medium",
          status: "pending",
        });
      }
    }

    router.push("/goals");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-32 text-slate-100 font-sans">
      <div className="flex items-center gap-3">
        <Link
          href="/goals"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Create a New Goal</h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Break down broad objectives into structured tasks and daily milestones.
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        <div className={`flex flex-col items-center ${step >= 1 ? "text-blue-400" : "text-slate-500"}`}>
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center mb-1 text-xs font-bold border ${
              step >= 1
                ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                : "bg-white/5 border-white/10 text-slate-500"
            }`}
          >
            1
          </div>
          <span className="text-[11px] font-semibold">Define</span>
        </div>
        <div className={`flex-1 h-0.5 mx-3 rounded-full ${step >= 2 ? "bg-blue-500" : "bg-white/10"}`} />
        <div className={`flex flex-col items-center ${step >= 2 ? "text-blue-400" : "text-slate-500"}`}>
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center mb-1 text-xs font-bold border ${
              step >= 2
                ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                : "bg-white/5 border-white/10 text-slate-500"
            }`}
          >
            2
          </div>
          <span className="text-[11px] font-semibold">Method</span>
        </div>
        <div className={`flex-1 h-0.5 mx-3 rounded-full ${step >= 3 ? "bg-blue-500" : "bg-white/10"}`} />
        <div className={`flex flex-col items-center ${step >= 3 ? "text-blue-400" : "text-slate-500"}`}>
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center mb-1 text-xs font-bold border ${
              step >= 3
                ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                : "bg-white/5 border-white/10 text-slate-500"
            }`}
          >
            3
          </div>
          <span className="text-[11px] font-semibold">Review Plan</span>
        </div>
      </div>

      <div className="bg-[#0c1224] rounded-3xl shadow-sm border border-white/10 p-6 sm:p-8">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-white">What is your academic objective?</h2>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Goal Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master Distributed Systems CS402, Prepare for Midterm"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-blue-500 text-white text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Description (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add context on syllabus requirements, grading weights, or key concepts..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-blue-500 text-white text-xs outline-none h-24 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Completion Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-blue-500 text-white text-xs outline-none"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!title.trim()}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl disabled:opacity-50 transition-all shadow-sm"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white">How should we synthesize your action plan?</h2>
            <p className="text-xs text-slate-400">Choose how sub-tasks and milestones should be populated.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => setDataSource("manual")}
                className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                  dataSource === "manual"
                    ? "border-blue-500 bg-blue-600/10 text-white"
                    : "border-white/10 bg-white/[0.02] text-slate-400 hover:text-white"
                }`}
              >
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 w-fit">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-xs text-white">Manual / Structured</h3>
                <p className="text-[11px] text-slate-400">Build tasks yourself or adjust templates.</p>
              </button>

              <button
                onClick={() => setDataSource("upload")}
                className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                  dataSource === "upload"
                    ? "border-blue-500 bg-blue-600/10 text-white"
                    : "border-white/10 bg-white/[0.02] text-slate-400 hover:text-white"
                }`}
              >
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-xs text-white">From Vault Material</h3>
                <p className="text-[11px] text-slate-400">Sync from your uploaded PDF or DOCX syllabus.</p>
              </button>

              <button
                onClick={() => setDataSource("search")}
                className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                  dataSource === "search"
                    ? "border-blue-500 bg-blue-600/10 text-white"
                    : "border-white/10 bg-white/[0.02] text-slate-400 hover:text-white"
                }`}
              >
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 w-fit">
                  <Search className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-xs text-white">AI Learning Path</h3>
                <p className="text-[11px] text-slate-400">Generate milestones for &quot;{title}&quot;.</p>
              </button>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-slate-400 hover:text-white px-4 py-2 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSimulateBreakdown}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Action Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white">Your Action Plan</h2>
            <p className="text-xs text-slate-400">
              Review and customize the task breakdown for <strong className="text-white">{title}</strong>.
            </p>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-blue-400" /> Action Items
              </h3>
              {generatedTasks.map((task, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-white/[0.04] p-3 rounded-xl border border-white/10">
                  <input
                    type="text"
                    value={task}
                    onChange={(e) => {
                      const newTasks = [...generatedTasks];
                      newTasks[idx] = e.target.value;
                      setGeneratedTasks(newTasks);
                    }}
                    className="flex-1 outline-none text-xs text-white bg-transparent"
                  />
                  <button
                    onClick={() => setGeneratedTasks(generatedTasks.filter((_, i) => i !== idx))}
                    className="text-slate-500 hover:text-red-400 text-xs px-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => setGeneratedTasks([...generatedTasks, "New Action Item"])}
                className="text-xs text-blue-400 font-semibold hover:underline mt-1 inline-block"
              >
                + Add another task
              </button>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 space-y-2">
              <h3 className="font-bold text-xs text-amber-300 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" /> Anticipated Study Challenges & Solutions
              </h3>
              <div className="space-y-2 pt-1">
                {challenges.map((c, idx) => (
                  <div key={idx} className="bg-white/[0.03] p-3 rounded-xl border border-amber-500/10 text-xs space-y-1">
                    <p className="font-bold text-amber-200">Pitfall: {c.issue}</p>
                    <p className="text-slate-300">
                      <strong>Solution:</strong> {c.solution}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="text-xs text-slate-400 hover:text-white px-4 py-2 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSaveGoal}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Save Goal & Tasks</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
