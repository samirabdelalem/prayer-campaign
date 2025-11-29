"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getDaysSinceJoining, getUserStats, getStoredPrayerData } from "@/lib/storage";

export default function UserStats({ globalCount }: { globalCount: number }) {
  const [stats, setStats] = useState({
    personalTotal: 0,
    dailyCount: 0,
    joinDate: '',
    achievements: [] as string[],
    userId: ''
  });
  const [daysSinceJoining, setDaysSinceJoining] = useState(0);

  useEffect(() => {
    const userStats = getUserStats();
    // Remove globalTotal from userStats since we're getting it from props
    const { globalTotal, ...localStats } = userStats;
    setStats(localStats as any);
    const days = getDaysSinceJoining();
    setDaysSinceJoining(days);
  }, []);

  const averagePerDay = stats.personalTotal > 0 && daysSinceJoining > 0 
    ? Math.round(stats.personalTotal / daysSinceJoining) 
    : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Force Gregorian calendar by using 'en-US' locale and then converting to Arabic numerals
    const gregorianDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Convert English month names to Arabic equivalents
    const monthMap: Record<string, string> = {
      'January': 'يناير',
      'February': 'فبراير',
      'March': 'مارس',
      'April': 'أبريل',
      'May': 'مايو',
      'June': 'يونيو',
      'July': 'يوليو',
      'August': 'أغسطس',
      'September': 'سبتمبر',
      'October': 'أكتوبر',
      'November': 'نوفمبر',
      'December': 'ديسمبر'
    };
    
    // Parse the English date and convert to Arabic format
    const [month, day, year] = gregorianDate.split(' ');
    const arabicMonth = monthMap[month] || month;
    const arabicDay = day.replace(',', '');
    
    return `${arabicDay} ${arabicMonth} ${year}`;
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-bold text-blue-800">
            إحصائياتك الشخصية
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-700">
              {stats.personalTotal.toLocaleString('en-US')}
            </div>
            <div className="text-xs text-blue-600">إجمالي صلواتك</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-blue-700">
              {stats.dailyCount.toLocaleString('en-US')}
            </div>
            <div className="text-xs text-blue-600">صلوات اليوم</div>
          </div>
        </div>

        {/* Details are now always visible, aligned with other sections */}
        <div className="space-y-1 pt-2 border-t border-blue-200">
          <div className="flex justify-between text-xs">
            <span className="text-blue-600">تاريخ الانضمام:</span>
            <span className="text-blue-800 font-medium">
              {formatDate(stats.joinDate)}
            </span>
          </div>
          
          <div className="flex justify-between text-xs">
            <span className="text-blue-600">الأيام منذ الانضمام:</span>
            <span className="text-blue-800 font-medium">
              {daysSinceJoining.toLocaleString('en-US')} يوم
            </span>
          </div>
          
          <div className="flex justify-between text-xs">
            <span className="text-blue-600">متوسط الصلوات يومياً:</span>
            <span className="text-blue-800 font-medium">
              {averagePerDay.toLocaleString('en-US')} صلاة
            </span>
          </div>
          
          <div className="flex justify-between text-xs">
            <span className="text-blue-600">الإنجازات المحققة:</span>
            <span className="text-blue-800 font-medium">
              {stats.achievements.length.toLocaleString('en-US')} إنجاز
            </span>
          </div>

          <div className="bg-blue-100 p-1 rounded-lg mt-2">
            <p className="text-xs text-blue-700 text-center">
              🔒 بياناتك محفوظة محلياً
            </p>
          </div>
        </div>

        {/* Progress indicator for next achievement */}
        <div className="mt-2 space-y-1">
          {(() => {
            // Define achievement thresholds (doubling starting from 1000)
            const achievements = [
              { threshold: 1000, label: "1000 صلاة", achieved: stats.personalTotal >= 1000 },
              { threshold: 2000, label: "2000 صلاة", achieved: stats.personalTotal >= 2000 },
              { threshold: 4000, label: "4000 صلاة", achieved: stats.personalTotal >= 4000 },
              { threshold: 8000, label: "8000 صلاة", achieved: stats.personalTotal >= 8000 },
              { threshold: 16000, label: "16000 صلاة", achieved: stats.personalTotal >= 16000 }
            ];
            
            // Find the next achievement or the last one if all are achieved
            const nextAchievement = achievements.find(a => !a.achieved) || achievements[achievements.length - 1];
            
            // Calculate progress percentage
            const progress = Math.min((stats.personalTotal / nextAchievement.threshold) * 100, 100);
            
            return (
              <>
                <div className="flex justify-between text-xs text-blue-600">
                  <span>التقدم نحو {nextAchievement.label}</span>
                  <span>{Math.min(stats.personalTotal, nextAchievement.threshold)}/{nextAchievement.threshold}</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-1">
                  <div 
                    className="bg-blue-600 h-1 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </>
            );
          })()}
        </div>
      </CardContent>
    </Card>
  );
}