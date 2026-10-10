import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyOS",
  description: "Personal academic operating system",
};

import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { OnboardingModal } from "@/components/ui/OnboardingModal";
import { CherryBlossomBackground } from "@/components/ui/CherryBlossomBackground";
import { FloatingAssistant } from "@/components/ui/FloatingAssistant";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-slate-900 font-sans bg-slate-50/30 selection:bg-blue-200">
        <CherryBlossomBackground />
        <OnboardingModal />
        <FloatingAssistant />
        <div className="flex flex-col md:flex-row h-screen overflow-hidden relative z-10 w-full">
          <MobileHeader />
          <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-20 backdrop-blur-xl bg-white/70 border-r border-blue-100 shadow-[4px_0_24px_rgba(59,130,246,0.08)]">
            <Sidebar />
          </div>
          <div className="md:pl-64 flex flex-col flex-1 h-full w-full z-0 overflow-hidden">
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
