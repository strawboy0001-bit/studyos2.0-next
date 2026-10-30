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
      <div className="md:hidden flex items-center justify-between h-16 px-5 bg-[#040f26]/95 border-b border-sky-500/15 z-30 relative shrink-0 w-full text-white backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0084ff] flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold tracking-tight text-white font-sans">
              StudyOS
            </span>
            <span className="text-[11px] font-semibold text-sky-400 font-mono">
              .ai
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover border border-sky-400/30"
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
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar panel */}
          <div className="relative flex w-72 flex-col bg-[#040f26] border-r border-sky-500/15 h-full z-50 animate-in slide-in-from-left duration-200">
            <div className="absolute top-3 right-3 z-10">
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
