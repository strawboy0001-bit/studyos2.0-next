"use client";

import React from "react";

export function SecurityMeshBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1] bg-[#070b16]">
      {/* Precision micro-dot grid for subtle architectural depth */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.6) 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />
      {/* 1px hairline horizontal guide rule */}
      <div className="absolute top-16 left-0 right-0 h-px bg-white/[0.04]" />
    </div>
  );
}
