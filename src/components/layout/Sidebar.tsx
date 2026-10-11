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
    <div className="flex h-full w-full flex-col bg-transparent text-slate-200">
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-white font-sans">
            StudyOS<span className="text-blue-400">.Ai</span>
          </span>
        </Link>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
          PRO
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-3.5 py-4 overflow-y-auto space-y-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-3 mb-1">
          Workspace
        </div>

        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-x-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.15)]"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent"
              }`}
            >
              <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        <div className="pt-4 mt-auto">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-3 mb-1">
            System
          </div>
          <Link
            href="/settings"
            onClick={onNavigate}
            className={`flex items-center gap-x-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
              pathname === "/settings"
                ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent"
            }`}
          >
            <Settings className="h-4 w-4 shrink-0 text-slate-400" />
            <span>Settings & Security</span>
          </Link>
        </div>

        {/* User Card with Google Status */}
        {user && (
          <div className="pt-3 border-t border-white/5">
            <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/30 transition-all">
              <div className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <GoogleIcon className="w-3 h-3 shrink-0" />
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={lockWorkspace}
                  title="Lock Workspace Session"
                  className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 p-1 rounded hover:bg-white/5 transition-colors"
                >
                  <Lock className="w-3 h-3" />
                  <span>Lock</span>
                </button>
                <button
                  onClick={logout}
                  title="Sign Out of Google"
                  className="text-[10px] text-slate-400 hover:text-red-400 flex items-center gap-1 p-1 rounded hover:bg-white/5 transition-colors"
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
