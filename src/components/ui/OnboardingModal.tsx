"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function OnboardingModal() {
  const profile = useLiveQuery(() => db.profile.get(1));
  const [hasDismissed, setHasDismissed] = useState(false);
  const [name, setName] = useState("");
  const [degree, setDegree] = useState("");

  const isOpen = profile === null && !hasDismissed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !degree.trim()) return;

    await db.profile.add({
      id: 1,
      name,
      degree,
      createdAt: new Date()
    });

    setHasDismissed(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-[#0d1424] border border-white/10 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] max-w-md w-full relative overflow-hidden text-slate-100"
          >
            <div className="flex justify-center mb-6 relative z-10">
              <div className="bg-blue-600/20 border border-blue-500/30 p-4 rounded-2xl text-blue-400 shadow-sm">
                <GraduationCap className="h-10 w-10" />
              </div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-black text-center text-white mb-2 tracking-tight">Welcome to StudyOS.</h2>
              <p className="text-center text-slate-400 mb-8 font-medium">Let&apos;s personalize your learning experience.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1.5">What is your name?</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-blue-500 text-white shadow-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1.5">What are you studying?</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. Computer Science"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-blue-500 text-white shadow-sm font-medium"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 border border-white/20 text-white font-bold py-3.5 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-colors shadow-md mt-6"
              >
                Begin Journey
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
