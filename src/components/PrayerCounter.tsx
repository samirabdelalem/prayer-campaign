"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface PrayerCounterProps {
  count: number;
  title: string;
  subtitle?: string;
  gradient?: string;
  textColor?: string;
  onClick?: () => void;
}

export default function PrayerCounter({ 
  count, 
  title, 
  subtitle, 
  gradient = "from-emerald-100 to-amber-100",
  textColor = "text-emerald-700",
  onClick
}: PrayerCounterProps) {
  const [displayCount, setDisplayCount] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    // Update display count immediately without animation
    setDisplayCount(count);
  }, [count]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
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
    }
  };

  return (
    <Card 
      className={`bg-gradient-to-r ${gradient} border-emerald-200 shadow-xl transform transition-all duration-200 ${isPressed ? 'scale-95' : 'hover:scale-105'} relative overflow-hidden cursor-pointer`}
      onClick={handleCardClick}
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
      
      <CardContent className="p-4 text-center relative z-10">
        <h2 className="text-lg font-bold text-emerald-800 mb-2 font-amiri">
          {title}
        </h2>
        <div 
          className={`text-3xl sm:text-4xl md:text-6xl font-bold ${textColor} mb-1`}
        >
          {formatNumber(displayCount)}
        </div>
        {subtitle && (
          <p className="text-emerald-600 text-sm">
            {subtitle}
          </p>
        )}
        
        {/* Decorative elements with equal spacing */}
        <div className="flex justify-center mt-2">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse mx-0.5"></div>
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse delay-100 mx-0.5"></div>
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse delay-200 mx-0.5"></div>
        </div>
      </CardContent>
    </Card>
  );
}
