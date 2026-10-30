"use client";

import React, { useEffect, useRef, useState } from "react";

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  opacity: number;
  swayAmplitude: number;
  swaySpeed: number;
  swayOffset: number;
}

export function CherryBlossomBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [enabled, setEnabled] = useState(true);

  // Check user preference on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("studyos_zen_sakura");
      if (stored !== null) {
        setEnabled(stored === "true");
      }

      const handleToggle = (e: CustomEvent<{ enabled: boolean }>) => {
        setEnabled(e.detail.enabled);
        localStorage.setItem("studyos_zen_sakura", String(e.detail.enabled));
      };

      window.addEventListener("studyos:toggle-sakura" as any, handleToggle);
      return () => {
        window.removeEventListener("studyos:toggle-sakura" as any, handleToggle);
      };
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Number of subtle petals
    const PETAL_COUNT = Math.min(30, Math.floor(width / 45));
    const petals: Petal[] = [];

    const createPetal = (initialY = -20): Petal => ({
      x: Math.random() * width,
      y: initialY === -20 ? Math.random() * -50 : initialY,
      size: Math.random() * 8 + 7,
      speedY: Math.random() * 0.75 + 0.45,
      speedX: Math.random() * 0.4 - 0.1,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.015,
      flip: Math.random() * Math.PI,
      flipSpeed: Math.random() * 0.02 + 0.01,
      opacity: Math.random() * 0.35 + 0.25,
      swayAmplitude: Math.random() * 1.5 + 0.5,
      swaySpeed: Math.random() * 0.02 + 0.01,
      swayOffset: Math.random() * Math.PI * 2,
    });

    // Seed initial petals distributed across viewport
    for (let i = 0; i < PETAL_COUNT; i++) {
      petals.push(createPetal(Math.random() * height));
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time * p.swaySpeed + p.swayOffset) * p.swayAmplitude * 0.5;
        p.rotation += p.rotationSpeed;
        p.flip += p.flipSpeed;

        // Reset if offscreen
        if (p.y > height + 20) {
          petals[i] = createPetal(-20);
          continue;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(1, Math.cos(p.flip));

        // Soft, organic petal shape
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(p.size * 0.5, -p.size * 0.8, p.size * 1.1, -p.size * 0.3, p.size, p.size * 0.6);
        ctx.bezierCurveTo(p.size * 0.8, p.size * 1.2, p.size * 0.2, p.size * 1.1, 0, p.size * 0.5);
        ctx.bezierCurveTo(-p.size * 0.2, p.size * 1.1, -p.size * 0.8, p.size * 1.2, -p.size, p.size * 0.6);
        ctx.bezierCurveTo(-p.size * 1.1, -p.size * 0.3, -p.size * 0.5, -p.size * 0.8, 0, 0);
        ctx.closePath();

        // Delicate Sakura gradient: soft powder pink with subtle translucent white core
        const grad = ctx.createRadialGradient(0, p.size * 0.2, 0, 0, p.size * 0.2, p.size);
        grad.addColorStop(0, `rgba(255, 225, 235, ${p.opacity})`);
        grad.addColorStop(0.7, `rgba(255, 192, 203, ${p.opacity * 0.8})`);
        grad.addColorStop(1, `rgba(244, 143, 177, ${p.opacity * 0.4})`);

        ctx.fillStyle = grad;
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] select-none"
      aria-hidden="true"
    />
  );
}
