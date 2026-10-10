"use client";

import { useState } from "react";
import { Settings, Download, Upload, Shield, Bot, Paintbrush, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = () => {
    setIsExporting(true);
    // Simulate export delay
    setTimeout(() => {
      setIsExporting(false);
      alert("Data exported successfully! (Mocked)");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your preferences, data, and AI integrations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-1">
          <button className="w-full text-left px-4 py-2 bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)] text-blue-700 rounded-md font-medium">General</button>
          <button className="w-full text-left px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-md">AI Providers</button>
          <button className="w-full text-left px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-md">Data & Privacy</button>
        </div>

        <div className="md:col-span-3 space-y-8">
          
          {/* Appearance */}
          <section className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Paintbrush className="h-5 w-5 text-slate-400" /> Appearance
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Theme</label>
                <select className="w-full max-w-xs border rounded-md px-3 py-2 outline-none">
                  <option>System Default</option>
                  <option>Light</option>
                  <option>Dark (Coming soon)</option>
                </select>
              </div>
            </div>
          </section>

          {/* AI Configuration */}
          <section className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Bot className="h-5 w-5 text-slate-400" /> AI Provider Configuration
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              StudyOS works entirely offline by default. To enable automatic summaries, quizzes, and planners, configure an AI provider here or via server environment variables.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Active Provider</label>
                <select className="w-full border rounded-md px-3 py-2 outline-none bg-slate-50">
                  <option>None (Offline Mode)</option>
                  <option>OpenAI</option>
                  <option>Anthropic</option>
                  <option>Local (Ollama)</option>
                </select>
              </div>
              <div className="pt-2">
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
                  <strong>Note:</strong> Currently running in Offline Mode. Manual data entry is fully supported.
                </div>
              </div>
            </div>
          </section>

          {/* Data Management */}
          <section className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-slate-400" /> Data Management & Privacy
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              All your subjects, notes, and tasks are stored locally in your browser using IndexedDB. Clearing your browser data will delete this information.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleExportData}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-md hover:bg-slate-800 transition-colors font-medium disabled:opacity-50"
              >
                {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Export Data (JSON)
              </button>
              <button className="flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded-md hover:bg-slate-50 transition-colors font-medium">
                <Upload className="h-4 w-4" />
                Import Data
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-red-100">
              <button className="text-red-600 font-medium text-sm hover:underline">
                Danger Zone: Delete all local data
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
