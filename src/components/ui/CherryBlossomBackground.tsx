"use client";

import React, { useId } from "react";

// Deterministic pseudo-random seed helper for pure React renders
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const STATIC_PETALS = Array.from({ length: 40 }).map((_, i) => ({
  id: i,
  left: pseudoRandom(i * 13 + 7) * 100,
  duration: 10 + pseudoRandom(i * 17 + 3) * 15,
  delay: pseudoRandom(i * 23 + 5) * 8,
  size: 8 + pseudoRandom(i * 29 + 11) * 8,
}));

export function CherryBlossomBackground() {
  const compId = useId();

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]" 
      style={{ backgroundColor: '#070b19' }}
    >
      <div className="absolute inset-0 bg-blue-950/20" />

      {STATIC_PETALS.map((petal) => (
        <div
          key={`${compId}-${petal.id}`}
          className="absolute top-[-10%] rounded-full opacity-40"
          style={{
            left: `${petal.left}%`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            backgroundColor: '#60a5fa',
            animation: `fall ${petal.duration}s linear ${petal.delay}s infinite`,
            boxShadow: '0 0 6px rgba(96, 165, 250, 0.4)',
          }}
        />
      ))}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fall {
          0% { top: -10%; transform: translateX(0px); }
          100% { top: 110%; transform: translateX(40px); }
        }
      `}} />
    </div>
  );
}
