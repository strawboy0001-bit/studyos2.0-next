"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between h-16 px-6 bg-white/70 backdrop-blur-xl border-b border-pink-100 z-30 relative shadow-sm shrink-0 w-full">
        <h1 className="text-xl font-black text-pink-500 tracking-tight font-sans">StudyOS<span className="text-pink-300">.</span></h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-pink-500 p-2 rounded-lg hover:bg-pink-100/50 transition-colors">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Overlay background */}
          <div className="fixed inset-0 bg-pink-900/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          {/* Sidebar panel */}
          <div className="relative flex w-64 flex-col bg-white shadow-xl h-full z-50 animate-in slide-in-from-left-full duration-200">
             <div className="absolute top-0 right-0 -mr-12 pt-4">
                <button
                  type="button"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none bg-white/10 hover:bg-white/20 text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            <Sidebar onNavigate={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
