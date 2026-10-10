"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingAssistant() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSpeech, setShowSpeech] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Animate in after a short delay on mount
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Update speech text based on route
  const getSpeechText = () => {
    if (pathname === '/') return "H-hi! Welcome back... I-I'll do my best to help you study today!";
    if (pathname.includes('/tasks')) return "Uwaah... so many tasks! W-we can do this if we take it one step at a time!";
    if (pathname.includes('/planner')) return "T-time management is important... Please don't overwork yourself.";
    if (pathname.includes('/flashcards')) return "M-memorization is hard, but repetition is key! I'm cheering for you.";
    return "I-I'm here if you need anything... Please don't stare too much though.";
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed bottom-6 right-6 z-50 flex items-end gap-4"
          drag
          dragMomentum={false}
          initial={{ y: 100, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.5 }}
          transition={{ type: "spring", bounce: 0.5, duration: 1 }}
        >
          
          <AnimatePresence>
            {showSpeech && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="relative bg-white/90 backdrop-blur-md border border-pink-100 p-4 rounded-2xl shadow-xl max-w-[200px] mb-8"
              >
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSpeech(false);
                  }}
                  className="absolute -top-2 -right-2 bg-pink-100 text-pink-500 rounded-full p-1 hover:bg-pink-200 transition-colors z-10"
                >
                  <X className="h-3 w-3" />
                </button>
                <p className="text-sm text-pink-900 font-medium leading-relaxed">
                  {getSpeechText()}
                </p>
                {/* Speech bubble tail */}
                <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white/90 border-b border-r border-pink-100 transform rotate-45"></div>
              </motion.div>
            )}
          </AnimatePresence>

          <div 
            className="relative flex flex-col items-center group cursor-grab active:cursor-grabbing" 
            onClick={() => setShowSpeech(!showSpeech)}
          >
            <motion.div 
              className="h-48 w-48 relative drop-shadow-2xl"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Image 
                src="/bocchi-assistant.jpg" 
                alt="Assistant" 
                fill
                className="object-contain rounded-full mix-blend-multiply pointer-events-none" 
              />
            </motion.div>
            <AnimatePresence>
              {!showSpeech && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-4 right-0 bg-pink-500 text-white p-2 rounded-full shadow-lg"
                >
                  <MessageCircle className="h-4 w-4 animate-bounce" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
