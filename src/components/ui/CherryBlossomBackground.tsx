"use client";

import { useEffect, useState } from "react";

export function CherryBlossomBackground() {
  const [petals, setPetals] = useState<{ id: number; left: number; animationDuration: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate a fixed number of petals
    const newPetals = Array.from({ length: 300 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      animationDuration: 10 + Math.random() * 15, // 10-25 seconds
      delay: Math.random() * 10, // 0-10 seconds delay
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]" 
      style={{ 
        backgroundImage: 'url("/bg-anime.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark/Light overlay to ensure text readability if needed, but we rely on glassmorphism panels */}
      <div className="absolute inset-0 bg-white/20"></div>

      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute top-[-10%] rounded-full opacity-60 cherry-petal"
          style={{
            left: `${petal.left}%`,
            width: `${8 + Math.random() * 8}px`,
            height: `${8 + Math.random() * 8}px`,
            backgroundColor: '#ffb7c5',
            animation: `fall ${petal.animationDuration}s linear ${petal.delay}s infinite, sway ${3 + Math.random() * 4}s ease-in-out ${petal.delay}s infinite alternate`,
            boxShadow: '0 0 6px rgba(255, 183, 197, 0.8)',
          }}
        />
      ))}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fall {
          0% {
            top: -10%;
          }
          100% {
            top: 110%;
          }
        }
        @keyframes sway {
          0% {
            transform: translateX(0px) rotate(0deg);
          }
          100% {
            transform: translateX(50px) rotate(45deg);
          }
        }
        
        .cherry-petal {
          border-radius: 50% 0 50% 50%;
        }
      `}} />
    </div>
  );
}
