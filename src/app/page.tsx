"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import PrayerCounter from "@/components/PrayerCounter";
import PrayerButton from "@/components/PrayerButton";
import StatsDisplay from "@/components/StatsDisplay";
import ShareButtons from "@/components/ShareButtons";

import UserStats from "@/components/UserStats";

import DatePanel from "@/components/DatePanel";
import { 
  getStoredPrayerData, 
  incrementPrayerCount, 
  PrayerData, 
  getGlobalPrayerCount, 
  setGlobalPrayerCount
} from "@/lib/storage";
import { prayerCountAPI, setupEventListeners } from "@/lib/api";

export default function HomePage() {
  const [prayerData, setPrayerData] = useState<PrayerData>({
    totalCount: 0,
    dailyCount: 0,
    lastPrayerDate: new Date().toDateString(),
    achievements: [],
    joinDate: new Date().toISOString(),
    userId: ''
  });
  const [totalGlobalCount, setTotalGlobalCount] = useState(0);
  const [isClient, setIsClient] = useState(false);
  // const [showCelebration, setShowCelebration] = useState(false);
  // const [celebrationMessage, setCelebrationMessage] = useState("");
  // const [isFirstTime, setIsFirstTime] = useState(false);

  // Load saved counts on component mount
  useEffect(() => {
    setIsClient(true);
    
    // Setup event listeners for API sync
    setupEventListeners();
    
    const initializeData = async () => {
      // Load user data
      const data = getStoredPrayerData();
      setPrayerData(data);
      
      // Load global count from API
      try {
        const globalCount = await prayerCountAPI.getGlobalCount();
        setTotalGlobalCount(globalCount);
        setGlobalPrayerCount(globalCount); // Cache locally
      } catch (error) {
        console.error('Error loading global count:', error);
        // Fallback to cached count
        const cachedCount = getGlobalPrayerCount();
        setTotalGlobalCount(cachedCount);
      }
    };

    initializeData();
  }, []);

  const handlePrayerClick = async () => {
    // Update personal count immediately
    const newData = incrementPrayerCount();
    setPrayerData(newData);

    // Update global count via API
    try {
      const newGlobalCount = await prayerCountAPI.incrementGlobalCount(1);
      setTotalGlobalCount(newGlobalCount);
    } catch (error) {
      console.error('Error updating global count:', error);
      // Fallback: update local cache
      const currentGlobal = totalGlobalCount;
      const newGlobalCount = currentGlobal + 1;
      setTotalGlobalCount(newGlobalCount);
      setGlobalPrayerCount(newGlobalCount);
      
      // Add to pending increments for later sync
      prayerCountAPI.addPendingIncrement(1);
    }
  };

  // Show a simple loading state on the server, and the full app on the client
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-emerald-700">جارٍ تحميل حملة الصلاة على النبي...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          {/* Main Title */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-800 mb-4 font-amiri">
              حملة الصلاة على النبي
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-emerald-600 to-amber-500 mx-auto mb-4"></div>
            <p className="text-base md:text-lg text-emerald-700 font-amiri leading-relaxed">
              &quot;إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا&quot;
            </p>
            <p className="text-sm text-emerald-600 mt-3">
              سورة الأحزاب - آية 56
            </p>
          </div>

          {/* Date Panel */}
          <div className="mb-6 max-w-2xl mx-auto">
            <DatePanel />
          </div>

          {/* Global Counter Display - Enhanced Visibility */}
          <div className="mb-6">
            <PrayerCounter
              count={totalGlobalCount}
              title="إجمالي الصلوات في الحملة"
              subtitle="صلاة على النبي محمد صلى الله عليه وسلم"
              gradient="from-emerald-100 to-amber-100"
              textColor="text-emerald-700"
              onClick={handlePrayerClick}
            />
          </div>

          {/* Prayer Button Below Counter */}
          <div className="mb-6 flex justify-center">
            <PrayerButton onClick={handlePrayerClick} size="md" />
          </div>

          {/* Campaign Message */}
          <div className="mb-8 max-w-2xl mx-auto">
            <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border-2 border-emerald-300 shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center justify-center" style={{ paddingTop: '0.5px', paddingBottom: '0.5px' }}>
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2 animate-ping"></div>
                  <h3 className="text-lg font-bold text-emerald-800">
                    معاً نحو الهدف!
                  </h3>
                  <div className="w-3 h-3 bg-emerald-500 rounded-full ml-2 animate-ping"></div>
                </div>
                <p className="text-emerald-700 text-center" style={{ paddingLeft: '0.5px', paddingRight: '0.5px', paddingBottom: '0.5px' }}>
                  كل صلاة تزيد هذا العدد، وكل صلاة أجر وثواب. 
                  انضم إلينا لنحقق معاً هدفًا عظيمًا من الصلاة على النبي الأعظم 🌟
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Personal Stats */}
          <div className="mb-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <StatsDisplay
                  dailyCount={prayerData.dailyCount}
                  totalCount={prayerData.totalCount}
                />
              </div>
              <div>
                <UserStats globalCount={totalGlobalCount} />
              </div>
            </div>
          </div>
          
          {/* Full Width Achievements Section */}
          <div className="mb-1 w-full">
            <Card className="bg-gradient-to-r from-amber-50 to-white border-amber-200 mx-auto max-w-4xl">
              <CardContent className="p-3">
                <h3 className="text-base font-bold text-amber-800 mb-2 text-center">
                  الإنجازات
                </h3>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2">
                  {/* Achievements will be rendered here */}
                  {[
                    { title: "المبتدئ", description: "1000 صلاة", threshold: 1000, achieved: prayerData.totalCount >= 1000, icon: "🌱" },
                    { title: "المثابر", description: "2000 صلاة", threshold: 2000, achieved: prayerData.totalCount >= 2000, icon: "⭐" },
                    { title: "المحب", description: "4000 صلاة", threshold: 4000, achieved: prayerData.totalCount >= 4000, icon: "💚" },
                    { title: "المداوم", description: "8000 صلاة", threshold: 8000, achieved: prayerData.totalCount >= 8000, icon: "👑" },
                    { title: "العاشق", description: "16000 صلاة", threshold: 16000, achieved: prayerData.totalCount >= 16000, icon: "✨" }
                  ].map((achievement, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg text-center transition-all duration-300 ${
                        achievement.achieved
                          ? 'bg-amber-100 border-2 border-amber-300 scale-105'
                          : 'bg-gray-100 border-2 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="text-lg mb-1">{achievement.icon}</div>
                      <div className="text-xs font-bold text-amber-800">
                        {achievement.title}
                      </div>
                      <div className="text-xs text-amber-600">
                        {achievement.description}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-1 px-4 bg-white/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center text-emerald-800 mb-6 font-amiri">
            فضل الصلاة على النبي
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
              <CardContent className="p-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <Image src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f7eea48f-411d-4b0c-b54b-e9d129d70632.png" alt="مسجد" width={24} height={24} />
                </div>
                <h3 className="text-lg font-bold text-emerald-800 mb-1 text-center">
                  عشر حسنات
                </h3>
                <p className="text-emerald-700 text-center text-sm">
                  &quot;من صلى علي صلاة صلى الله عليه بها عشراً&quot;
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
              <CardContent className="p-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <Image src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/67baaf7c-a4ed-4091-898c-149c026c076a.png" alt="دعاء" width={24} height={24} />
                </div>
                <h3 className="text-lg font-bold text-amber-800 mb-1 text-center">
                  رفع الدرجات
                </h3>
                <p className="text-amber-700 text-center text-sm">
                  &quot;ورفع له عشر درجات وحط عنه عشر خطيئات&quot;
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
              <CardContent className="p-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <Image src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f7eea48f-411d-4b0c-b54b-e9d129d70632.png" alt="قلب" width={24} height={24} />
                </div>
                <h3 className="text-lg font-bold text-amber-800 mb-1 text-center">
                  شفاعة النبي
                </h3>
                <p className="text-amber-700 text-center text-sm">
                  &quot;أولى الناس بي يوم القيامة أكثرهم علي صلاة&quot;
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
              <CardContent className="p-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <Image src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/18a75d79-15de-4dea-89ef-aa56c75a1a4d.png" alt="نور" width={24} height={24} />
                </div>
                <h3 className="text-lg font-bold text-amber-800 mb-1 text-center">
                  كفاية الهموم
                </h3>
                <p className="text-amber-700 text-center text-sm">
                  &quot;إذاً يكفيك الله ما أهمك من دنياك وآخرتك&quot;
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section className="py-6 px-4">
        <div className="container mx-auto max-w-2xl">
          <ShareButtons 
            prayerCount={prayerData.totalCount}
          />
        </div>
      </section>

      {/* Privacy & Data Info */}
      <section className="py-3 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-white border-gray-200">
            <CardContent className="p-3">
              <h3 className="text-base font-bold text-gray-800 mb-2 text-center">
                🔒 خصوصية وحفظ البيانات
              </h3>
              
              <div className="grid md:grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-2xl mb-1">💾</div>
                  <h4 className="font-bold text-gray-800 mb-1 text-sm">حفظ محلي</h4>
                  <p className="text-xs text-gray-600">
                    جميع بياناتك محفوظة في متصفحك فقط
                    <br />
                    لا يتم إرسالها لأي خادم
                  </p>
                </div>
                
                <div>
                  <div className="text-2xl mb-1">🔄</div>
                  <h4 className="font-bold text-gray-800 mb-1 text-sm">حفظ تلقائي</h4>
                  <p className="text-xs text-gray-600">
                    يتم حفظ تقدمك تلقائياً
                    <br />
                    حتى عند إغلاق المتصفح
                  </p>
                </div>
                
                <div>
                  <div className="text-2xl mb-1">🛡️</div>
                  <h4 className="font-bold text-gray-800 mb-1 text-sm">خصوصية كاملة</h4>
                  <p className="text-xs text-gray-600">
                    لا نجمع أي معلومات شخصية
                    <br />
                    بياناتك تبقى معك فقط
                  </p>
                </div>
              </div>

              <div className="mt-3 p-2 bg-emerald-50 rounded-lg">
                <p className="text-xs text-emerald-700 text-center">
                  <strong>ملاحظة:</strong> إذا قمت بمسح بيانات المتصفح أو استخدام وضع التصفح الخاص، 
                  ستفقد تقدمك المحفوظ. للحفاظ على بياناتك، تجنب مسح بيانات الموقع.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}