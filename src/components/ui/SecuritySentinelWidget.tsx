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
    <div className="fixed bottom-5 left-5 md:left-[17.5rem] z-40 select-none">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="mb-2 w-80 rounded-2xl bg-[#0c1222] border border-white/[0.12] p-4 text-slate-100 text-xs space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="font-semibold text-white tracking-tight text-xs">
                  Workspace Security
                </span>
              </div>
              <span className="tag-outline font-mono text-[10px]">
                Score: {user.securityScore}/100
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  Google Identity
                </span>
                <span className="text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                  Vault Limit
                </span>
                <span className="text-slate-400 font-mono text-[10px]">
                  Strict ≤ {MAX_FILE_SIZE_LABEL}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Local Sandbox
                </span>
                <span className="text-slate-300 text-[10px] font-mono">AES-256</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex gap-2">
              <button
                onClick={lockWorkspace}
                className="flex-1 py-1.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center gap-1.5 text-[11px] font-medium transition-colors"
              >
                <KeyRound className="w-3 h-3 text-slate-400" />
                Lock Workspace
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0c1222] hover:bg-[#121a30] border border-white/[0.12] text-white transition-colors"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span className="text-xs font-medium text-slate-200">Sandbox Secure</span>
        {isExpanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        )}
      </button>
    </div>
  );
}
