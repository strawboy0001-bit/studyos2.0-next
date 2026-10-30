"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { AuthLandingGateway } from "./AuthLandingGateway";
import { WorkspaceLockScreen } from "./WorkspaceLockScreen";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { SecuritySentinelWidget } from "@/components/ui/SecuritySentinelWidget";
import { SecurityMeshBackground } from "@/components/ui/SecurityMeshBackground";
import { CherryBlossomBackground } from "@/components/ui/CherryBlossomBackground";
import { FloatingAssistant } from "@/components/ui/FloatingAssistant";
import { GraduationCap, Shield } from "lucide-react";

export function AuthGatekeeper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, isLocked } = useAuth();

  // If user is directly visiting public routes like /login or an API route, allow direct render
  if (pathname?.startsWith("/login") || pathname?.startsWith("/api")) {
    return (
      <>
        <CherryBlossomBackground />
        {children}
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070b16] flex flex-col items-center justify-center text-white select-none">
        <SecurityMeshBackground />
        <CherryBlossomBackground />
        <div className="relative flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-xl bg-blue-600 hairline-border flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 hairline-border flex items-center justify-center">
              <Shield className="w-3 h-3 text-blue-400" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-1 justify-center">
              StudyOS<span className="text-blue-400">.ai</span>
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
    return (
      <>
        <CherryBlossomBackground />
        <AuthLandingGateway />
      </>
    );
  }

  // Authenticated workspace
  return (
    <>
      <SecurityMeshBackground />
      <CherryBlossomBackground />
      {isLocked && <WorkspaceLockScreen />}
      <SecuritySentinelWidget />
      <FloatingAssistant />
      <div className="flex flex-col md:flex-row h-screen overflow-hidden relative z-10 w-full">
        <MobileHeader />
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-20 bg-[#0b1226]/90 hairline-border border-r border-t-0 border-b-0 border-l-0">
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
