"use client";

import { useState } from "react";
import { Menu, X, GraduationCap } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/lib/auth/AuthContext";

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between h-16 px-5 bg-[#0b1226]/90 backdrop-blur-2xl border-b border-white/10 z-30 relative shadow-sm shrink-0 w-full text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-white font-sans">
            StudyOS<span className="text-blue-400">.Ai</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover border border-white/20"
            />
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-300 p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Overlay background */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar panel */}
          <div className="relative flex w-72 flex-col bg-[#0b1226] border-r border-white/10 shadow-2xl h-full z-50 animate-in slide-in-from-left duration-200">
            <div className="absolute top-3 right-3">
              <button
                type="button"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Sidebar onNavigate={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
