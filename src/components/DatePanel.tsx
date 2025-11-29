"use client";

import { useState, useEffect } from "react";
import moment from "moment-hijri";

// Helper function to get initial date values
const getInitialDates = () => {
  const now = new Date();
  
  // Format Gregorian date in numeric format (day/month/year)
  const gregorianDate = now.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });
  
  // Format Hijri date in numeric format (day/month/year)
  const hijriDateFormatted = moment(now).format('iDD/iMM/iYYYY');
  
  // Format time in English with Arabic morning/evening (short form)
  const hours = now.getHours();
  const period = hours >= 12 ? 'م' : 'ص';
  const timeFormatted = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }) + ' ' + period;
  
  return {
    gregorian: gregorianDate,
    hijri: hijriDateFormatted,
    time: timeFormatted
  };
};

export default function DatePanel() {
  const [currentDate, setCurrentDate] = useState(getInitialDates);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const updateDates = () => {
      setCurrentDate(getInitialDates());
    };

    updateDates();
    // Update every second to keep time accurate
    const interval = setInterval(updateDates, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-200 rounded-xl shadow-md p-3">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="text-center md:text-right">
          <div className="text-xs text-emerald-600 font-medium"></div>
          <div className="text-emerald-800 font-bold text-sm">{currentDate.gregorian}</div>
        </div>
        
        <div className="hidden md:block w-px h-8 bg-emerald-200"></div>
        
        <div className="text-center md:text-left">
          <div className="text-xs text-amber-600 font-medium"></div>
          <div className="text-amber-800 font-bold text-sm">{currentDate.hijri}</div>
        </div>
        
        <div className="hidden md:block w-px h-8 bg-emerald-200"></div>
        
        <div className="text-center">
          <div className="text-xs text-blue-600 font-medium"></div>
          <div className="text-blue-800 font-bold text-sm">{currentDate.time}</div>
        </div>
      </div>
    </div>
  );
}