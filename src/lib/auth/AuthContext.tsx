"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { db } from "@/lib/db";

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  degree: string;
  institution: string;
  role: "Student" | "Researcher" | "Academic Fellow";
  authProvider: "google";
  token: string;
  verified: boolean;
  lastLogin: string;
  securityScore: number;
  twoFactorEnabled: boolean;
}

interface AuthContextType {
  user: GoogleUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLocked: boolean;
  lockWorkspace: () => void;
  unlockWorkspace: () => void;
  loginWithGoogle: (customData?: Partial<GoogleUser>) => Promise<GoogleUser>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<GoogleUser>) => Promise<void>;
}

const STORAGE_KEY = "studyos_auth_session_v2";

export const SAMPLE_GOOGLE_ACCOUNTS: Omit<GoogleUser, "token" | "lastLogin">[] = [
  {
    id: "g-user-101",
    name: "Alex Rivera",
    email: "alex.rivera.cs@gmail.com",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    degree: "Computer Science & AI",
    institution: "Stanford University",
    role: "Student",
    authProvider: "google",
    verified: true,
    securityScore: 98,
    twoFactorEnabled: true,
  },
  {
    id: "g-user-102",
    name: "Surya K.",
    email: "surya.academic@gmail.com",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80",
    degree: "Software Engineering & Data Systems",
    institution: "Institute of Technology",
    role: "Researcher",
    authProvider: "google",
    verified: true,
    securityScore: 96,
    twoFactorEnabled: true,
  },
  {
    id: "g-user-103",
    name: "Dr. Elena Vance",
    email: "elena.vance.edu@gmail.com",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80",
    degree: "Cognitive Neuroscience",
    institution: "Cambridge Academy",
    role: "Academic Fellow",
    authProvider: "google",
    verified: true,
    securityScore: 100,
    twoFactorEnabled: true,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GoogleUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    return null;
  });
  const [isLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const loginWithGoogle = useCallback(async (customData?: Partial<GoogleUser>): Promise<GoogleUser> => {
    const defaultAccount = SAMPLE_GOOGLE_ACCOUNTS[0];
    const token = `g_oauth2_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;

    const loggedUser: GoogleUser = {
      id: customData?.id || defaultAccount.id,
      name: customData?.name || defaultAccount.name,
      email: customData?.email || defaultAccount.email,
      avatarUrl: customData?.avatarUrl || defaultAccount.avatarUrl,
      degree: customData?.degree || defaultAccount.degree,
      institution: customData?.institution || defaultAccount.institution,
      role: customData?.role || defaultAccount.role,
      authProvider: "google",
      token,
      verified: true,
      lastLogin: new Date().toISOString(),
      securityScore: customData?.securityScore || 98,
      twoFactorEnabled: true,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
    setUser(loggedUser);
    setIsLocked(false);

    // Sync into IndexedDB UserProfile so all existing modules work seamlessly
    try {
      await db.profile.put({
        id: 1,
        name: loggedUser.name,
        degree: `${loggedUser.degree} • ${loggedUser.institution}`,
        createdAt: new Date(),
      });
    } catch {
      // IndexedDB sync is best-effort
    }

    return loggedUser;
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setIsLocked(false);
  }, []);

  const lockWorkspace = useCallback(() => {
    setIsLocked(true);
  }, []);

  const unlockWorkspace = useCallback(() => {
    setIsLocked(false);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<GoogleUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isLocked,
        lockWorkspace,
        unlockWorkspace,
        loginWithGoogle,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
