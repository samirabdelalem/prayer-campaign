"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StatsDisplayProps {
  dailyCount: number;
  totalCount: number;
  // globalCount: number; // Unused
}

export default function StatsDisplay({ dailyCount, totalCount }: StatsDisplayProps) {
  const [dailyGoal] = useState(100);
  // const [weeklyGoal] = useState(700);
  // const [monthlyGoal] = useState(3000);
  
  const dailyProgress = Math.min((dailyCount / dailyGoal) * 100, 100);
  // const weeklyProgress = Math.min((totalCount / weeklyGoal) * 100, 100);
  // const monthlyProgress = Math.min((totalCount / monthlyGoal) * 100, 100);

  // const achievements = [
  //   { 
  //     title: "المبتدئ", 
  //     description: "أول 10 صلوات", 
  //     threshold: 10, 
  //     achieved: totalCount >= 10,
  //     icon: "🌱"
  //   },
  //   { 
  //     title: "المثابر", 
  //     description: "100 صلاة", 
  //     threshold: 100, 
  //     achieved: totalCount >= 100,
  //     icon: "⭐"
  //   },
  //   { 
  //     title: "المحب", 
  //     description: "500 صلاة", 
  //     threshold: 500, 
  //     achieved: totalCount >= 500,
  //     icon: "💚"
  //   },
  //   { 
  //     title: "المداوم", 
  //     description: "1000 صلاة", 
  //     threshold: 1000, 
  //     achieved: totalCount >= 1000,
  //     icon: "👑"
  //   },
  //   { 
  //     title: "العاشق", 
  //     description: "5000 صلاة", 
  //     threshold: 5000, 
  //     achieved: totalCount >= 5000,
  //     icon: "✨"
  //   }
  // ];

  const getMotivationalMessage = () => {
    if (dailyCount === 0) return "ابدأ يومك بالصلاة على النبي";
    if (dailyCount < 10) return "بداية رائعة! استمر";
    if (dailyCount < 50) return "ممتاز! أنت في الطريق الصحيح";
    if (dailyCount < 100) return "مشاء الله! اقترب من الهدف اليومي";
    return "بارك الله فيك! تجاوزت الهدف اليومي";
  };

  return (
    <div className="space-y-4">
      {/* Daily Progress */}
      <Card className="bg-gradient-to-r from-emerald-50 to-white border-emerald-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-bold text-emerald-800">التقدم اليومي</h3>
            <span className="text-xs text-emerald-600">
              {dailyCount} / {dailyGoal}
            </span>
          </div>
          <Progress value={dailyProgress} className="h-2 mb-2" />
          <p className="text-xs text-emerald-700 text-center">
            {getMotivationalMessage()}
          </p>
        </CardContent>
      </Card>

      {/* Personal Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-white/80 border-emerald-200">
          <CardContent className="p-3 text-center">
            <h4 className="text-xs font-bold text-emerald-800 mb-1">
              صلواتك اليوم
            </h4>
            <div className="text-xl font-bold text-emerald-700">
              {dailyCount.toLocaleString('en-US')}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 border-emerald-200">
          <CardContent className="p-3 text-center">
            <h4 className="text-xs font-bold text-emerald-800 mb-1">
              إجمالي صلواتك
            </h4>
            <div className="text-xl font-bold text-emerald-700">
              {totalCount.toLocaleString('en-US')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      {/* Moved to main page to be full width */}
    </div>
  );
}
