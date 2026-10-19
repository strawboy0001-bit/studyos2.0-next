"use client";

import React from "react";

export function SecurityMeshBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1] bg-[#070b19]">
      {/* Subtle, soft ambient illumination */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[70vw] h-[450px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] bg-indigo-500/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Subtle modern dot grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.4) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
