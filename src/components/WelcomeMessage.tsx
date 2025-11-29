"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WelcomeMessageProps {
  isNewUser: boolean;
  onClose: () => void;
}

export default function WelcomeMessage({ isNewUser, onClose }: WelcomeMessageProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isNewUser) {
      setIsVisible(true);
    }
  }, [isNewUser]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
      <Card className="bg-gradient-to-r from-emerald-50 to-amber-50 border-emerald-200 shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        <CardContent className="p-4 text-center">
          <div className="text-4xl mb-3">🕌</div>
          
          <h2 className="text-xl font-bold text-emerald-800 mb-3 font-amiri">
            أهلاً وسهلاً بك
          </h2>
          
          <p className="text-emerald-700 mb-4 text-sm leading-relaxed">
            مرحباً بك في حملة الصلاة على النبي محمد صلى الله عليه وسلم
            <br />
            <br />
            كل نقرة صلاة، وكل صلاة أجر وثواب
            <br />
            سيتم حفظ تقدمك تلقائياً في متصفحك
          </p>

          <div className="bg-emerald-100 p-3 rounded-lg mb-4">
            <p className="text-emerald-800 text-xs font-medium">
              &quot;إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا&quot;
            </p>
            <p className="text-emerald-600 text-xs mt-1">
              سورة الأحزاب - آية 56
            </p>
          </div>

          <Button
            onClick={handleClose}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-2 text-base font-amiri"
          >
            ابدأ الصلاة على النبي
          </Button>

          <p className="text-xs text-emerald-600 mt-3">
            بياناتك محفوظة محلياً في متصفحك فقط
          </p>
        </CardContent>
      </Card>
    </div>
  );
}