"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    // Set initial state
    setIsOnline(navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showStatus) return null;

  return (
    <div className="fixed top-4 left-4 z-50 animate-in slide-in-from-left duration-300">
      <Card className={`${
        isOnline 
          ? 'bg-green-100 border-green-300' 
          : 'bg-red-100 border-red-300'
      } shadow-lg`}>
        <CardContent className="p-3">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className={`w-3 h-3 rounded-full ${
              isOnline ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className={`text-sm font-medium ${
              isOnline ? 'text-green-800' : 'text-red-800'
            }`}>
              {isOnline ? 'متصل - يتم حفظ العداد العالمي' : 'غير متصل - سيتم المزامنة عند الاتصال'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}