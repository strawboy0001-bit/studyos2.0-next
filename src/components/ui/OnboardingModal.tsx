"use client";

import { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
            className="bg-white/40 backdrop-blur-2xl border border-white/60 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-w-md w-full relative overflow-hidden"
          >
            {/* Decorative background circle */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)]0 rounded-full opacity-10 blur-3xl pointer-events-none"></div>

            <div className="flex justify-center mb-6 relative z-10">
              <motion.div 
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                className="bg-white/60 backdrop-blur-lg border border-white/60 p-4 rounded-2xl text-violet-700 shadow-sm"
              >
                <GraduationCap className="h-10 w-10" />
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative z-10"
            >
              <h2 className="text-3xl font-black text-center text-slate-900 mb-2 tracking-tight">Welcome to StudyOS.</h2>
              <p className="text-center text-slate-500 mb-8 font-medium">Let's personalize your learning experience.</p>
            </motion.div>
            
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-bold text-slate-700 mb-1.5">What is your name?</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  required
                  className="w-full px-4 py-3 bg-white border border-white/60 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all text-slate-900 shadow-sm font-medium"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-bold text-slate-700 mb-1.5">What are you studying?</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. Computer Science"
                  required
                  className="w-full px-4 py-3 bg-white border border-white/60 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all text-slate-900 shadow-sm font-medium"
                />
              </motion.div>
              
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-[0_4px_16px_rgba(139,92,246,0.3)] border border-white/20 text-white font-bold py-3.5 rounded-xl hover:from-violet-600 hover:to-fuchsia-600 transition-colors shadow-md mt-6"
              >
                Begin Journey
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
