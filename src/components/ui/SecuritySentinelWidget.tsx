"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, CheckCircle2, ChevronUp, ChevronDown, KeyRound, HardDrive } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { MAX_FILE_SIZE_LABEL } from "@/lib/security/fileValidator";

export function SecuritySentinelWidget() {
  const { user, isAuthenticated, lockWorkspace } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isAuthenticated || !user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="mb-3 w-80 rounded-2xl bg-[#0d1424]/95 backdrop-blur-2xl border border-blue-500/30 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.6)] text-slate-100 text-xs space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                  StudyOS Sentinel
                </span>
              </div>
              <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 font-semibold">
                Score: {user.securityScore}/100
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  Google OAuth Identity
                </span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3 h-3" /> Active
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                  Upload Vault Guard
                </span>
                <span className="text-slate-400 font-mono text-[10px]">
                  Strict ≤ {MAX_FILE_SIZE_LABEL}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  Local Storage Shield
                </span>
                <span className="text-emerald-400 text-[10px] font-semibold">AES-256</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex gap-2">
              <button
                onClick={lockWorkspace}
                className="flex-1 py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center gap-1.5 text-[11px] font-medium transition-colors"
              >
                <KeyRound className="w-3 h-3 text-amber-400" />
                Lock Workspace
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#0d1424]/90 hover:bg-[#131d33] border border-blue-500/30 text-white shadow-[0_4px_25px_rgba(37,99,235,0.35)] backdrop-blur-xl transition-all"
      >
        <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
          <Shield className="w-3.5 h-3.5" />
        </div>
        <div className="text-left">
          <p className="text-[11px] font-bold text-slate-200 leading-tight">Shield Active</p>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 ml-1" />
        )}
      </motion.button>
    </div>
  );
}
