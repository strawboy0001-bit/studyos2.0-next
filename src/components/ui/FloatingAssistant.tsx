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
          className="fixed bottom-5 right-5 z-40 flex items-end gap-3 select-none"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Study Strategy Popover */}
          <AnimatePresence>
            {showSpeech && !isMinimized && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.15 }}
                className="relative surface-1 hairline-border p-4 rounded-2xl max-w-[270px] mb-2 text-left shadow-[0_12px_40px_rgba(2,11,28,0.7)]"
              >
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 hairline-b">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold text-white">
                      Gwen Stacy
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="tag-outline text-[10px]">
                      STRATEGY
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSpeech(false);
                      }}
                      className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/[0.06] transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {getSpeechText()}
                </p>

                <div className="mt-3 pt-2 hairline-t flex items-center justify-between text-[11px] text-slate-400">
                  <span>Contextual Assistant</span>
                  <span className="text-sky-400 font-mono text-[10px]">Active</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Assistant Avatar Trigger */}
          <button
            type="button"
            className="relative flex flex-col items-center group cursor-pointer focus:outline-none"
            onClick={() => {
              if (isMinimized) {
                setIsMinimized(false);
                setShowSpeech(true);
              } else {
                setShowSpeech(!showSpeech);
              }
            }}
          >
            <div
              className={`relative overflow-hidden rounded-full border border-sky-400/30 bg-[#040f26] shadow-[0_4px_20px_rgba(0,132,255,0.25)] transition-transform duration-200 group-hover:scale-105 ${
                isMinimized
                  ? "w-10 h-10"
                  : "w-12 h-12"
              }`}
            >
              <Image
                src="/gwen.png"
                alt="Gwen Stacy"
                fill
                className="object-cover pointer-events-none select-none"
                priority
              />
            </div>

            {/* Flat Accent Status Badge */}
            <div className="absolute -top-0.5 -right-0.5 bg-[#0084ff] text-white p-1 rounded-full border border-[#030d22]">
              {showSpeech ? (
                <MessageCircle className="h-2.5 w-2.5" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block" />
              )}
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
