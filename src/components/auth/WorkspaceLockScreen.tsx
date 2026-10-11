"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowRight, LogOut, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { GoogleIcon } from "./GoogleAuthModal";

export function WorkspaceLockScreen() {
  const { user, unlockWorkspace, logout } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);

  if (!user) return null;

  const handleUnlock = () => {
    setIsVerifying(true);
    setTimeout(() => {
      unlockWorkspace();
      setIsVerifying(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-[#070b19]/95 backdrop-blur-2xl flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm rounded-3xl bg-[#0d1424] border border-blue-500/30 p-8 shadow-[0_0_60px_rgba(37,99,235,0.3)] text-center text-slate-100 relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-blue-600/20 blur-2xl pointer-events-none" />

        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">Workspace Locked</h3>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          Client session protected. Verify your Google Identity to continue.
        </p>

        {/* User Card */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3.5 mb-6 text-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-11 h-11 rounded-full object-cover border border-white/20"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-white truncate">{user.name}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            </div>
            <span className="text-xs text-slate-400 truncate block">{user.email}</span>
          </div>
        </div>

        <button
          onClick={handleUnlock}
          disabled={isVerifying}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(37,99,235,0.4)] border border-blue-400/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <GoogleIcon className="w-4 h-4" />
          <span>{isVerifying ? "Verifying Token..." : "Unlock with Google"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={logout}
          className="mt-4 text-xs text-slate-500 hover:text-slate-300 flex items-center justify-center gap-1.5 mx-auto transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Switch or Sign Out Account
        </button>
      </motion.div>
    </div>
  );
}
