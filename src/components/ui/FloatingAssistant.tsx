"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";

export function FloatingAssistant() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSpeech, setShowSpeech] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Animate in after a short delay on mount
    const timer = setTimeout(() => setIsVisible(true), 1000);
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

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-4 animate-in slide-in-from-bottom-12 fade-in duration-700 ease-out">
      
      {showSpeech && (
        <div className="relative bg-white/90 backdrop-blur-md border border-pink-100 p-4 rounded-2xl shadow-xl max-w-[200px] mb-8 animate-in zoom-in-95 fade-in duration-300">
          <button 
            onClick={() => setShowSpeech(false)}
            className="absolute -top-2 -right-2 bg-pink-100 text-pink-500 rounded-full p-1 hover:bg-pink-200 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
          <p className="text-sm text-pink-900 font-medium leading-relaxed">
            {getSpeechText()}
          </p>
          {/* Speech bubble tail */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white/90 border-b border-r border-pink-100 transform rotate-45"></div>
        </div>
      )}

      <div className="relative flex flex-col items-center group cursor-pointer" onClick={() => setShowSpeech(!showSpeech)}>
        <div className="h-48 w-48 relative drop-shadow-2xl transition-transform hover:scale-105 hover:-translate-y-2 duration-300">
          {/* Using mix-blend-multiply to remove the stark white background from the generated image if needed, or just let it float */}
          <Image 
            src="/bocchi-assistant.jpg" 
            alt="Assistant" 
            fill
            className="object-contain rounded-full mix-blend-multiply" 
          />
        </div>
        {!showSpeech && (
          <div className="absolute -top-4 right-0 bg-pink-500 text-white p-2 rounded-full shadow-lg animate-bounce">
            <MessageCircle className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
}
