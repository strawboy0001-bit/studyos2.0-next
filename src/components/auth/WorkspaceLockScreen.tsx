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
    <div className="fixed inset-0 z-[150] bg-[#070b16]/95 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm rounded-2xl bg-[#0c1222] border border-white/[0.12] p-8 text-center text-slate-100 relative"
      >
        <div className="mx-auto w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 mb-5">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white tracking-tight">Workspace Locked</h3>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          Client session protected. Verify your Google Identity to continue.
        </p>

        {/* User Card */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3 mb-6 text-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border border-white/20"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs text-white truncate">{user.name}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            </div>
            <span className="text-[11px] text-slate-400 truncate block">{user.email}</span>
          </div>
        </div>

        <button
          onClick={handleUnlock}
          disabled={isVerifying}
          className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
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
