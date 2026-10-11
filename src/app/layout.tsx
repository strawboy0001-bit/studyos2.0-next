import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { AuthGatekeeper } from "@/components/auth/AuthGatekeeper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyOS.Ai // Secure Academic Operating System",
  description: "Next-generation AI academic workspace with verified Google Authentication, restricted document vault, and adaptive learning tools.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col text-slate-100 font-sans bg-[#070b19] selection:bg-blue-600/30 selection:text-white">
        <AuthProvider>
          <AuthGatekeeper>
            {children}
          </AuthGatekeeper>
        </AuthProvider>
      </body>
    </html>
  );
}
