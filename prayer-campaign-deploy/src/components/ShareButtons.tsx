"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ShareButtonsProps {
  prayerCount: number;
  // globalCount: number; // Unused
}

export default function ShareButtons({ prayerCount }: ShareButtonsProps) {
  const shareText = `🕌 انضم إلي في حملة الصلاة على النبي محمد صلى الله عليه وسلم

✨ وصلت إلى ${prayerCount.toLocaleString('en-US')} صلاة
"إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ

انضم الآن: ${typeof window !== 'undefined' ? window.location.origin : ''}`;

  const handleShare = async (platform?: string) => {
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'twitter') {
      const twitterText = `🕌 حملة الصلاة على النبي محمد ﷺ
وصلت إلى ${prayerCount.toLocaleString('en-US')} صلاة!
انضم الآن: ${url}`;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else {
      // Native share or copy to clipboard
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'حملة الصلاة على النبي',
            text: shareText,
            url: url
          });
        } catch (error) {
          console.log('Error sharing:', error);
          copyToClipboard();
        }
      } else {
        copyToClipboard();
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      // Show success message (you could add a toast here)
      alert('تم نسخ النص للحافظة!');
    } catch (error) {
      console.log('Error copying to clipboard:', error);
    }
  };

  return (
    <Card className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-none">
      <CardContent className="p-3">
        <h3 className="text-xl font-bold mb-2 text-center font-amiri">
          شارك الأجر والثواب
        </h3>
        <p className="text-emerald-100 text-center mb-3 text-sm leading-relaxed">
          &quot;من دل على خير فله مثل أجر فاعله&quot;
          <br />
          شارك الحملة مع الأصدقاء والعائلة
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          <Button
            onClick={() => handleShare('whatsapp')}
            className="bg-green-500 hover:bg-green-600 text-white border-none text-sm h-9"
          >
            واتساب
          </Button>
          
          <Button
            onClick={() => handleShare('telegram')}
            className="bg-blue-500 hover:bg-blue-600 text-white border-none text-sm h-9"
          >
            تليجرام
          </Button>
          
          <Button
            onClick={() => handleShare('twitter')}
            className="bg-sky-500 hover:bg-sky-600 text-white border-none text-sm h-9"
          >
            تويتر
          </Button>
          
          <Button
            onClick={() => handleShare('facebook')}
            className="bg-blue-700 hover:bg-blue-800 text-white border-none text-sm h-9"
          >
            فيسبوك
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => handleShare()}
            className="bg-white text-emerald-700 hover:bg-emerald-50 flex-1 text-sm h-9"
          >
            مشاركة عامة
          </Button>
          
          <Button
            onClick={copyToClipboard}
            className="bg-amber-500 hover:bg-amber-600 text-white flex-1 text-sm h-9"
          >
            نسخ النص
          </Button>
        </div>

        {/* Achievement sharing */}
        {prayerCount >= 100 && (
          <div className="mt-2 p-2 bg-amber-400/20 rounded-lg text-center">
            <p className="text-xs text-amber-100">
              🎉 تهانينا! وصلت إلى {prayerCount.toLocaleString('en-US')} صلاة
              <br />
              شارك إنجازك مع الآخرين
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
