"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  BookOpen, 
  Files, 
  Edit3, 
  Layers, 
  CheckSquare, 
  Calendar, 
  Target, 
  Settings,
  HelpCircle,
  GraduationCap,
  LogOut,
  Lock
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { GoogleIcon } from "@/components/auth/GoogleAuthModal";

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'My Subjects', href: '/subjects', icon: BookOpen },
  { name: 'Study Materials', href: '/materials', icon: Files },
  { name: 'Notes', href: '/notes', icon: Edit3 },
  { name: 'Flashcards', href: '/flashcards', icon: Layers },
  { name: 'Quizzes', href: '/quizzes', icon: HelpCircle },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Planner', href: '/planner', icon: Calendar },
  { name: 'Goals', href: '/goals', icon: Target },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, logout, lockWorkspace } = useAuth();

  return (
    <div className="flex h-full w-full flex-col bg-[#080d1a] text-slate-200 border-r border-white/[0.08]">
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center justify-between px-5 border-b border-white/[0.08]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white transition-transform group-hover:scale-105">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold tracking-tight text-white font-sans">
              StudyOS
            </span>
            <span className="text-[11px] font-semibold text-blue-400 font-mono">
              .ai
            </span>
          </div>
        </Link>
        <span className="tag-outline">
          PRO
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-3 py-4 overflow-y-auto space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-1.5">
          Workspace
        </div>

        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-x-3 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-blue-600/10 text-white border border-blue-500/25"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}

        {/* Gwen Stacy Copilot Companion Mini-Card */}
        <div className="pt-4 mt-auto">
          <div className="my-2 p-3 rounded-2xl bg-[#0c1222] border border-white/[0.08] flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/gwen.png" alt="Gwen" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-white">Gwen Stacy</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <p className="text-[10px] text-slate-400 truncate">Study Strategy Copilot</p>
            </div>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-1.5">
            System
          </div>
          <Link
            href="/settings"
            onClick={onNavigate}
            className={`flex items-center gap-x-3 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
              pathname === "/settings"
                ? "bg-blue-600/10 text-white border border-blue-500/25"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent"
            }`}
          >
            <Settings className="h-4 w-4 shrink-0 text-slate-400" />
            <span>Settings & Security</span>
          </Link>
        </div>

        {/* User Profile Card with Google Status */}
        {user && (
          <div className="pt-3 border-t border-white/[0.08]">
            <div className="p-3 rounded-2xl bg-[#0c1222] border border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                    <GoogleIcon className="w-3 h-3 shrink-0" />
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                <button
                  onClick={lockWorkspace}
                  title="Lock Workspace Session"
                  className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/[0.05] transition-colors"
                >
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Lock</span>
                </button>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="text-[11px] text-slate-400 hover:text-red-400 flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/[0.05] transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
