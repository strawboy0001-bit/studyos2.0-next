"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { db } from "@/lib/db";

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  degree: string;
  institution: string;
  role: "Student" | "Researcher" | "Academic Fellow";
  authProvider: "google" | "guest" | "local";
  token: string;
  verified: boolean;
  lastLogin: string;
  securityScore: number;
  twoFactorEnabled: boolean;
}

export interface SavedAccount {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  lastLogin: string;
}

interface AuthContextType {
  user: GoogleUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLocked: boolean;
  savedAccounts: SavedAccount[];
  lockWorkspace: () => void;
  unlockWorkspace: () => void;
  loginWithGoogle: (customData?: Partial<GoogleUser>) => Promise<GoogleUser>;
  loginAsGuest: (nickname?: string) => Promise<GoogleUser>;
  signInWithGoogleAccount: (params: {
    email: string;
    password?: string;
    name?: string;
    degree?: string;
    institution?: string;
  }) => Promise<GoogleUser>;
  hydrateServerSession: (googleUser: GoogleUser) => Promise<void>;
  removeSavedAccount: (id: string) => void;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<GoogleUser>) => Promise<void>;
}

const STORAGE_KEY = "studyos_auth_session_v2";
const SAVED_ACCOUNTS_KEY = "studyos_saved_accounts_v1";

function deriveNameFromEmail(email: string): string {
  const localPart = email.split("@")[0] || "";
  const parts = localPart.split(/[._-]/).filter(Boolean);
  if (parts.length === 0) return "Google Scholar";
  return parts
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function generateAvatar(name: string, email: string): string {
  const seed = encodeURIComponent(email || name);
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=2563eb,3b82f6,1d4ed8,4338ca&textColor=ffffff`;
}

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

  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(SAVED_ACCOUNTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Check server session on mount
  useEffect(() => {
    async function checkServerSession() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data.authenticated && data.user) {
          const s = data.user;
          const restoredUser: GoogleUser = {
            id: s.id,
            name: s.name,
            email: s.email,
            avatarUrl: s.avatarUrl || generateAvatar(s.name, s.email),
            degree: "Academic Studies",
            institution: "Verified Google Account",
            role: "Student",
            authProvider: "google",
            token: `g_oauth2_server_token`,
            verified: true,
            lastLogin: new Date().toISOString(),
            securityScore: 100,
            twoFactorEnabled: true,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(restoredUser));
          setUser(restoredUser);
        }
      } catch {
        // ignore network error
      }
    }

    if (!user) {
      checkServerSession();
    }
  }, [user]);

  // Sync saved accounts to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(savedAccounts));
      } catch {
        // ignore
      }
    }
  }, [savedAccounts]);

  const saveToHistory = useCallback((newUser: GoogleUser) => {
    setSavedAccounts((prev) => {
      const filtered = prev.filter((acc) => acc.email.toLowerCase() !== newUser.email.toLowerCase());
      const updated: SavedAccount = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatarUrl: newUser.avatarUrl,
        lastLogin: newUser.lastLogin,
      };
      return [updated, ...filtered].slice(0, 5);
    });
  }, []);

  const hydrateServerSession = useCallback(
    async (googleUser: GoogleUser) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(googleUser));
      setUser(googleUser);
      setIsLocked(false);
      saveToHistory(googleUser);

      try {
        await db.profile.put({
          id: 1,
          name: googleUser.name,
          degree: `${googleUser.degree} • ${googleUser.institution}`,
          createdAt: new Date(),
        });
      } catch {
        // ignore
      }
    },
    [saveToHistory]
  );

  const signInWithGoogleAccount = useCallback(
    async (params: {
      email: string;
      password?: string;
      name?: string;
      degree?: string;
      institution?: string;
    }): Promise<GoogleUser> => {
      const cleanEmail = params.email.trim();
      const cleanName = params.name?.trim() || deriveNameFromEmail(cleanEmail);
      const token = `g_oauth2_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
      const avatarUrl = generateAvatar(cleanName, cleanEmail);

      const loggedUser: GoogleUser = {
        id: `g_user_${cleanEmail.replace(/[^a-zA-Z0-9]/g, "_")}`,
        name: cleanName,
        email: cleanEmail,
        avatarUrl,
        degree: params.degree?.trim() || "Academic Studies",
        institution: params.institution?.trim() || "Google Verified Academy",
        role: "Student",
        authProvider: "google",
        token,
        verified: true,
        lastLogin: new Date().toISOString(),
        securityScore: 99,
        twoFactorEnabled: true,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
      setUser(loggedUser);
      setIsLocked(false);
      saveToHistory(loggedUser);

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
    },
    [saveToHistory]
  );

  const loginWithGoogle = useCallback(
    async (customData?: Partial<GoogleUser>): Promise<GoogleUser> => {
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
      saveToHistory(loggedUser);

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
    },
    [saveToHistory]
  );

  const loginAsGuest = useCallback(
    async (nickname?: string): Promise<GoogleUser> => {
      const guestCode = Math.floor(1000 + Math.random() * 9000);
      const guestName = nickname?.trim() || `Cadet #${guestCode}`;
      const guestId = `guest_${Date.now()}`;
      const token = `guest_token_${Math.random().toString(36).substring(2)}`;

      const loggedUser: GoogleUser = {
        id: guestId,
        name: guestName,
        email: `cadet.${guestCode}@studyos.local`,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=Cadet${guestCode}`,
        degree: "Autonomous Scholar",
        institution: "StudyOS Field Station",
        role: "Student",
        authProvider: "guest",
        token,
        verified: true,
        lastLogin: new Date().toISOString(),
        securityScore: 92,
        twoFactorEnabled: false,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
      setUser(loggedUser);
      setIsLocked(false);
      saveToHistory(loggedUser);

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
    },
    [saveToHistory]
  );

  const removeSavedAccount = useCallback((id: string) => {
    setSavedAccounts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
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

    try {
      if (updates.name || updates.degree || updates.institution) {
        await db.profile.update(1, {
          ...(updates.name ? { name: updates.name } : {}),
          ...(updates.degree ? { degree: `${updates.degree} • ${updates.institution || ""}` } : {}),
        });
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isLocked,
        savedAccounts,
        lockWorkspace,
        unlockWorkspace,
        loginWithGoogle,
        loginAsGuest,
        signInWithGoogleAccount,
        hydrateServerSession,
        removeSavedAccount,
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
