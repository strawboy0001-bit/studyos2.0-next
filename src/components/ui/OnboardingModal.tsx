"use client";

import { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { GraduationCap } from "lucide-react";

export function OnboardingModal() {
  const profile = useLiveQuery(() => db.profile.get(1));
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [degree, setDegree] = useState("");

  // Only show if the query has completed and profile is genuinely undefined
  useEffect(() => {
    if (profile === undefined) {
      // It's still loading, do nothing
    } else if (profile === null || !profile) {
      // We know there's no profile
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !degree.trim()) return;

    await db.profile.add({
      id: 1,
      name,
      degree,
      createdAt: new Date()
    });

    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/20 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-md border border-amber-900/10 p-8 rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center mb-6">
          <div className="bg-amber-100/50 p-4 rounded-full text-amber-700">
            <GraduationCap className="h-10 w-10" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-amber-950 mb-2 font-serif">Welcome to StudyOS.</h2>
        <p className="text-center text-amber-900/70 mb-8">Let's personalize your learning experience.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-amber-950 mb-1">What is your name?</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ayanokoji"
              required
              className="w-full px-4 py-3 bg-white/50 border border-amber-900/20 rounded-xl outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-all text-amber-950"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-950 mb-1">What are you studying?</label>
            <input
              type="text"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              placeholder="e.g. High School, B.S. Computer Science"
              required
              className="w-full px-4 py-3 bg-white/50 border border-amber-900/20 rounded-xl outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-all text-amber-950"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-amber-800 text-white font-medium py-3 rounded-xl hover:bg-amber-900 transition-colors shadow-sm mt-4"
          >
            Begin Journey
          </button>
        </form>
      </div>
    </div>
  );
}
