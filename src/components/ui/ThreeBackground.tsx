"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  color: string;
}

export default function ThreeBackground({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Color palette: Emerald (#34d399, #10b981), Indigo (#818cf8, #6366f1), Amber (#fbbf24)
    const COLORS = [
      "rgba(52, 211, 153, ", // Emerald #34d399
      "rgba(129, 140, 248, ", // Indigo #818cf8
      "rgba(16, 185, 129, ", // Emerald dark
      "rgba(99, 102, 241, ", // Indigo dark
      "rgba(251, 191, 36, ", // Amber highlight
    ];

    const PARTICLE_COUNT = 75;
    const particles: Particle[] = [];

    // Initialize 3D perspective particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 800 + 200, // 3D depth layer
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        vz: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2.2 + 1.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    const fov = 400; // Field of view for 3D projection

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Subtle Radial Glow Aura
      const centerX = width / 2;
      const centerY = height / 2;
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        50,
        centerX,
        centerY,
        Math.max(width, height) / 1.4
      );
      gradient.addColorStop(0, "rgba(79, 70, 229, 0.18)"); // Indigo core
      gradient.addColorStop(0.45, "rgba(13, 148, 136, 0.12)"); // Teal middle
      gradient.addColorStop(1, "rgba(15, 23, 42, 0)"); // Fade to dark
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Update and Project Particles
      const projected: { x: number; y: number; scale: number; p: Particle }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Wrap around bounds in 3D
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        if (p.z < 100) p.z = 900;
        if (p.z > 900) p.z = 100;

        // 3D Perspective Projection
        const scale = fov / (fov + p.z);
        const projX = (p.x - width / 2) * scale + width / 2;
        const projY = (p.y - height / 2) * scale + height / 2;

        projected.push({ x: projX, y: projY, scale, p });
      }

      // 3. Connect Dynamic Lines between close nodes (Perspective-aware)
      const maxDistance = 125;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.35 * Math.min(p1.scale, p2.scale) * 1.8;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);

            // Interpolate line color between emerald and indigo
            const lineGrad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            lineGrad.addColorStop(0, `rgba(52, 211, 153, ${alpha})`); // Emerald #34d399
            lineGrad.addColorStop(1, `rgba(129, 140, 248, ${alpha})`); // Indigo #818cf8

            ctx.strokeStyle = lineGrad;
            ctx.lineWidth = Math.min(p1.scale, p2.scale) * 1.5;
            ctx.stroke();
          }
        }
      }

      // 4. Draw Particles with soft glow
      for (let i = 0; i < projected.length; i++) {
        const { x, y, scale, p } = projected[i];
        const rad = p.radius * scale * 1.5;
        const alpha = Math.min(1, 0.4 + scale * 0.6);

        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.8, rad), 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.shadowColor = `${p.color}0.8)`;
        ctx.shadowBlur = 8 * scale;
        ctx.fill();

        // Reset shadow for next draws
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
