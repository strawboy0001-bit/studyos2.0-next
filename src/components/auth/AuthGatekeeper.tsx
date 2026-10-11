"use client";

import React from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { AuthLandingGateway } from "./AuthLandingGateway";
import { WorkspaceLockScreen } from "./WorkspaceLockScreen";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { SecuritySentinelWidget } from "@/components/ui/SecuritySentinelWidget";
import { SecurityMeshBackground } from "@/components/ui/SecurityMeshBackground";
import { GraduationCap, Shield } from "lucide-react";

export function AuthGatekeeper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, isLocked } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070b19] flex flex-col items-center justify-center text-white select-none">
        <SecurityMeshBackground />
        <div className="relative flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.6)]">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-500 border-2 border-[#070b19] flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-1 justify-center">
              StudyOS<span className="text-blue-400">.Ai</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Verifying encrypted academic session...</p>
          </div>
          <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="w-full h-full bg-blue-500 animate-[pulse_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated: Show landing gateway with Google Auth
  if (!isAuthenticated) {
    return <AuthLandingGateway />;
  }

  // Authenticated workspace
  return (
    <>
      <SecurityMeshBackground />
      {isLocked && <WorkspaceLockScreen />}
      <SecuritySentinelWidget />
      <div className="flex flex-col md:flex-row h-screen overflow-hidden relative z-10 w-full">
        <MobileHeader />
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-20 backdrop-blur-2xl bg-[#0b1226]/80 border-r border-white/10 shadow-[4px_0_30px_rgba(0,0,0,0.5)]">
          <Sidebar />
        </div>
        <div className="md:pl-64 flex flex-col flex-1 h-full w-full z-0 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
