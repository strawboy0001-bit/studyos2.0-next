"use client";

import React from "react";

export function SecurityMeshBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1] bg-[#030c20]">
      {/* High-res anime azure sky & ocean horizon backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-35 brightness-95 saturate-110"
        style={{
          backgroundImage: `url('/sky_horizon.png')`,
        }}
      />
      {/* Atmospheric deep sapphire ocean gradient vignette for flawless text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030e24]/80 via-[#04163a]/65 to-[#020b1c]/90" />

      {/* Precision micro-dot grid for crisp architectural depth */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(125, 211, 252, 0.8) 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />
      {/* 1px azure hairline horizontal guide rule */}
      <div className="absolute top-16 left-0 right-0 h-px bg-sky-400/15" />
    </div>
  );
}
