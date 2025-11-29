"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PrayerButtonProps {
  onClick: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function PrayerButton({ onClick, disabled = false, size = "md" }: PrayerButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };
    
    setRipples(prev => [...prev, newRipple]);
    setIsPressed(true);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    setTimeout(() => setIsPressed(false), 150);

    onClick();
  };

  const sizeClasses = {
    sm: "text-base px-4 py-2",
    md: "text-lg px-6 py-3", 
    lg: "text-xl md:text-2xl px-8 py-4"
  };

  return (
    <div className="relative">
      <Button
        onClick={handleClick}
        disabled={disabled}
        className={`
          bg-gradient-to-r from-emerald-600 to-emerald-700 
          hover:from-emerald-700 hover:to-emerald-800 
          text-white font-amiri rounded-2xl shadow-2xl 
          transform transition-all duration-200 
          hover:scale-105 active:scale-95
          ${sizeClasses[size]}
          ${isPressed ? 'scale-95' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          relative overflow-hidden
          min-h-[48px] // Ensure minimum touch target size
        `}
      >
        {/* Ripple effects */}
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="absolute bg-white/30 rounded-full animate-ping"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
            }}
          />
        ))}
        
        {/* Button text */}
        <span className="relative z-10">
          اللهم صل وسلم على نبينا محمد
        </span>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </Button>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-0.5 h-0.5 bg-amber-400 rounded-full animate-bounce ${
              isPressed ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              left: `${30 + i * 20}%`,
              top: `${20 + i * 10}%`,
              animationDelay: `${i * 100}ms`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    </div>
  );
}