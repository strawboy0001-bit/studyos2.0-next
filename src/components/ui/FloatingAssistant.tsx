"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MessageCircle, X, Sparkles, Zap, ChevronUp, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingAssistant() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSpeech, setShowSpeech] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Animate in smoothly after a short delay on mount
    const timer = setTimeout(() => setIsVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  // Spider-Gwen / Earth-65 dynamic study quotes based on route
  const getSpeechText = () => {
    if (pathname === "/")
      return "Earth-65 frequency locked! Ready to swing through today's syllabus? Let's stay in the groove.";
    if (pathname.includes("/tasks"))
      return "Spider-sense is tingling — lots of tasks today! Knock them down one by one with rhythm.";
    if (pathname.includes("/planner"))
      return "Pomodoro focus sprint engaged. 25 minutes of unbroken flow. Keep your focus tight!";
    if (pathname.includes("/flashcards"))
      return "Active recall drills! Muscle memory and neural reflexes get sharper with every flip.";
    if (pathname.includes("/quizzes"))
      return "Exam mode! Trust your prep and read each question with sharp focus. You've got this.";
    if (pathname.includes("/materials"))
      return "Knowledge vault secure. Index your lecture notes so they're always a reflex away.";
    if (pathname.includes("/notes"))
      return "Capture concepts while they're fresh. Clean notes make exam week an effortless breeze.";
    return "Focus, rhythm, and agility. Your personal Earth-65 study copilot is standing by.";
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 flex items-end gap-3 select-none"
          drag
          dragMomentum={false}
          initial={{ y: 80, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Speech Dialogue Bubble */}
          <AnimatePresence>
            {showSpeech && !isMinimized && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.85, x: 20 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative bg-[#0c1224]/95 backdrop-blur-xl border border-pink-500/30 p-4 rounded-3xl shadow-[0_15px_40px_rgba(236,72,153,0.25)] max-w-[240px] mb-4 text-left"
              >
                <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-pink-500/20">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                    <span className="text-[10px] font-black tracking-wider text-pink-400 uppercase">
                      GWEN • EARTH-65
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSpeech(false);
                    }}
                    className="text-slate-400 hover:text-white p-0.5 rounded-md hover:bg-white/10 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>

                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {getSpeechText()}
                </p>

                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-pink-300 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" /> Spider-Verse Copilot
                  </span>
                  <span className="text-[9px] text-slate-400">Light AI</span>
                </div>

                {/* Speech Bubble Tail */}
                <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#0c1224] border-b border-r border-pink-500/30 transform rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Assistant Avatar Trigger */}
          <div
            className="relative flex flex-col items-center group cursor-pointer"
            onClick={() => {
              if (isMinimized) {
                setIsMinimized(false);
                setShowSpeech(true);
              } else {
                setShowSpeech(!showSpeech);
              }
            }}
          >
            <motion.div
              className={`relative overflow-hidden rounded-full border-2 transition-all duration-300 ${
                isMinimized
                  ? "w-12 h-12 border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.4)]"
                  : "w-20 h-20 sm:w-24 sm:h-24 border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.5)]"
              }`}
              whileHover={{ scale: 1.08, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src="/gwen.png"
                alt="Gwen Stacy - Earth-65"
                fill
                className="object-cover pointer-events-none select-none"
                priority
              />

              {/* Spider-Verse Pink / Cyan Rim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-pink-900/40 via-transparent to-cyan-500/20 pointer-events-none" />
            </motion.div>

            {/* Quick Toggle Icon */}
            <motion.div
              className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-cyan-500 text-white p-1 rounded-full shadow-lg border border-white/20"
              whileHover={{ scale: 1.2 }}
            >
              {showSpeech ? (
                <Zap className="h-3 w-3 fill-current" />
              ) : (
                <MessageCircle className="h-3 w-3 animate-pulse" />
              )}
            </motion.div>

            {/* Earth-65 Mini Badge */}
            {!isMinimized && (
              <span className="mt-1 text-[9px] font-black uppercase tracking-wider text-pink-300 bg-[#0c1224]/90 px-2 py-0.5 rounded-full border border-pink-500/30 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
                Earth-65
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
