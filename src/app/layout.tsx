import type { Metadata } from "next";
import { Amiri, Cairo } from "next/font/google";
import "./globals.css";
// import { getIslamicDates } from "@/lib/dateUtils"; // Commented out to avoid unused variable warning

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-cairo",
});

// Get current dates at build time
// const { gregorian, hijri } = getIslamicDates(); // Commented out to avoid unused variable warning

export const metadata: Metadata = {
  title: "حملة الصلاة على النبي | صلى الله عليه وسلم",
  description: "انضم إلى حملة الصلاة على النبي محمد صلى الله عليه وسلم. كل نقرة صلاة، كل صلاة أجر وثواب",
  keywords: "الصلاة على النبي, محمد, صلى الله عليه وسلم, حملة, إسلام",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${amiri.variable} ${cairo.variable}`}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🕌</text></svg>" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${cairo.className} antialiased bg-gradient-to-br from-emerald-50 via-white to-amber-50 min-h-screen`}>
        <div className="relative min-h-screen">
          {/* Islamic Pattern Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          {/* Main Content */}
          <div className="relative z-10">
            {children}
          </div>
          
          {/* Footer */}
          <footer className="relative z-10 mt-auto py-8 text-center text-emerald-700/70">
            <div className="container mx-auto px-4">
              <div className="text-xs opacity-70">
                جميع الحقوق محفوظة © 2025
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
