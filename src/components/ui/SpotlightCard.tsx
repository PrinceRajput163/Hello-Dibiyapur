"use client";

import React, { useState, useRef } from "react";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  innerClassName?: string;
}

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(99, 102, 241, 0.14)",
  innerClassName = "p-6 sm:p-8",
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-3xl p-[1.5px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${className}`}
      {...props}
    >
      {/* 1. Base Static Border */}
      <div className="absolute inset-0 rounded-3xl border border-slate-100/90 pointer-events-none transition-opacity duration-300 group-hover:opacity-0" />

      {/* 2. Interactive Glowing Border Gradient Spotlight Layer */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300 z-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-emerald-500 via-indigo-500 to-cyan-400"
        style={{
          maskImage: `radial-gradient(300px circle at ${position.x}px ${position.y}px, black 30%, transparent 80%)`,
          WebkitMaskImage: `radial-gradient(300px circle at ${position.x}px ${position.y}px, black 30%, transparent 80%)`,
        }}
      />

      {/* 3. Card Inner Container */}
      <div className={`relative h-full w-full rounded-[calc(1.5rem-1.5px)] bg-white overflow-hidden z-10 ${innerClassName}`}>
        {/* Interactive Inner Spotlight Light */}
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
          style={{
            opacity,
            background: `radial-gradient(420px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          {children}
        </div>
      </div>
    </div>
  );
}
