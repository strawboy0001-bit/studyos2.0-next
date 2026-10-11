"use client";

import React from "react";

export function SecurityMeshBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1] bg-[#070b19]">
      {/* Dynamic ambient radial gradients */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[600px] bg-gradient-to-b from-blue-600/15 via-indigo-600/5 to-transparent blur-3xl opacity-80" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
      <div className="absolute top-1/3 right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 blur-[140px] rounded-full" />

      {/* Cyber/Academic Grid Line Pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}
