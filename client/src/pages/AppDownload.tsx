import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Smartphone, Bell, Calendar, MapPin, Star, Shield, Zap, Globe,
  BarChart3, FileText, Eye, Wallet, ArrowRight,
} from "lucide-react";
import SEO from "@/components/SEO";

export default function AppDownload() {
  const { isArabic } = useLanguage();

  const guestFeatures = [
    { icon: Calendar, titleEn: "Instant Booking", titleAr: "حجز فوري", descEn: "Book your perfect stay in seconds with our streamlined booking flow.", descAr: "احجز إقامتك المثالية في ثوانٍ مع تجربة حجز سلسة." },
    { icon: Bell, titleEn: "Smart Notifications", titleAr: "إشعارات ذكية", descEn: "Get real-time updates on bookings, check-in details, and exclusive offers.", descAr: "احصل على تحديثات فورية عن الحجوزات وتفاصيل الوصول والعروض الحصرية." },
    { icon: MapPin, titleEn: "Explore Neighborhoods", titleAr: "استكشف الأحياء", descEn: "Discover the best neighborhoods across Saudi Arabia with detailed guides.", descAr: "اكتشف أفضل الأحياء في المملكة مع أدلة تفصيلية." },
    { icon: Star, titleEn: "Verified Reviews", titleAr: "تقييمات موثقة", descEn: "Read authentic reviews from real guests to make informed decisions.", descAr: "اقرأ تقييمات حقيقية من ضيوف حقيقيين لاتخاذ قرارات مدروسة." },
    { icon: Shield, titleEn: "Secure Payments", titleAr: "دفع آمن", descEn: "Multiple payment options with bank-level security for peace of mind.", descAr: "خيارات دفع متعددة بأمان مصرفي لراحة بالك." },
    { icon: Globe, titleEn: "Bilingual Support", titleAr: "دعم ثنائي اللغة", descEn: "Full Arabic and English support throughout the entire app experience.", descAr: "دعم كامل بالعربية والإنجليزية في جميع أنحاء التطبيق." },
  ];

  const ownerFeatures = [
    { icon: Eye, titleEn: "Live Monitoring", titleAr: "مراقبة مباشرة", descEn: "Track your property performance in real-time from anywhere.", descAr: "تابع أداء عقارك في الوقت الفعلي من أي مكان." },
    { icon: FileText, titleEn: "Monthly Statements", titleAr: "كشوفات شهرية", descEn: "Detailed financial reports delivered directly to your dashboard.", descAr: "تقارير مالية مفصلة تصل مباشرة إلى لوحة التحكم." },
    { icon: Wallet, titleEn: "Financial Transparency", titleAr: "شفافية مالية", descEn: "Complete visibility into revenue, expenses, and net income.", descAr: "رؤية كاملة للإيرادات والمصروفات وصافي الدخل." },
    { icon: BarChart3, titleEn: "Live Booking Status", titleAr: "حالة الحجز المباشرة", descEn: "See upcoming, active, and past bookings at a glance.", descAr: "شاهد الحجوزات القادمة والنشطة والسابقة بنظرة واحدة." },
  ];

  return (
    <div className="min-h-screen bg-white" dir={isArabic ? "rtl" : "ltr"}>
      <SEO title={isArabic ? "تحميل تطبيق CoBnB+" : "Download CoBnB+ App"} description={isArabic ? "تطبيق واحد لكل شيء — احجز إقامتك، تابع عقارك، واستمتع بتجربة ضيافة سعودية استثنائية." : "One app for everything — book your stay, manage your property, and enjoy an exceptional Saudi hospitality experience."} url="/app-download" />
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1E2D] via-[#0D2B3E] to-[#0B1E2D] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-1.5 mb-6">
                <Smartphone className="h-4 w-4 text-teal-400" />
                <span className="text-sm text-teal-300">{isArabic ? "تطبيق كوبي إن بي+" : "CoBnB+ App"}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {isArabic ? (
                  <><span className="text-teal-400">حمّل</span> تطبيق<br />COBNB+ الآن</>
                ) : (
                  <>Download<br /><span className="text-teal-400">COBNB+ APP</span><br />Now</>
                )}
              </h1>
              <p className="text-lg md:text-xl text-white/70 mb-8 max-w-lg">
                {isArabic
                  ? "تطبيق واحد لكل شيء — احجز إقامتك، تابع عقارك، واستمتع بتجربة ضيافة سعودية استثنائية."
                  : "One app for everything — book your stay, manage your property, and enjoy an exceptional Saudi hospitality experience."}
              </p>
              <div className="flex flex-wrap gap-4">
                <StoreButton type="apple" isArabic={isArabic} />
                <StoreButton type="google" isArabic={isArabic} />
              </div>
              <p className="text-xs text-white/40 mt-4 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                {isArabic ? "قريباً — التطبيق قيد التطوير" : "Coming Soon — App is under development"}
              </p>
            </div>
            <div className="hidden lg:flex justify-center">
              <PhoneMockup isArabic={isArabic} />
            </div>
          </div>
        </div>
      </section>

      {/* Guest Features */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-teal-50 rounded-full px-4 py-1.5 mb-4">
              <Star className="h-4 w-4 text-teal-600" />
              <span className="text-sm text-teal-700 font-medium">{isArabic ? "للضيوف" : "For Guests"}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0B1E2D] mb-4">
              {isArabic ? "مميزات التطبيق للضيوف" : "Guest App Features"}
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              {isArabic ? "كل ما تحتاجه لتجربة ضيافة استثنائية في تطبيق واحد" : "Everything you need for an exceptional hospitality experience in one app"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guestFeatures.map((f, i) => (
              <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
                    <f.icon className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="font-bold text-[#0B1E2D] mb-2">{isArabic ? f.titleAr : f.titleEn}</h3>
                  <p className="text-sm text-slate-600">{isArabic ? f.descAr : f.descEn}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Owner Section — Dark */}
      <section className="py-16 md:py-24 bg-[#0B1E2D] text-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 hidden lg:flex justify-center">
              <PhoneMockup isArabic={isArabic} variant="owner" />
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
                <BarChart3 className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-amber-300 font-medium">{isArabic ? "لأصحاب العقارات" : "For Property Owners"}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {isArabic ? (
                  <>تابع عقارك<br /><span className="text-teal-400">من أي مكان</span></>
                ) : (
                  <>Monitor Your Property<br /><span className="text-teal-400">From Anywhere</span></>
                )}
              </h2>
              <p className="text-lg text-white/60 mb-8">
                {isArabic
                  ? "تطبيق المالك يمنحك رؤية كاملة لأداء عقارك مع تقارير مالية شفافة وحالة الحجوزات في الوقت الفعلي."
                  : "The owner app gives you complete visibility into your property's performance with transparent financial reports and real-time booking status."}
              </p>
              <div className="space-y-4">
                {ownerFeatures.map((f, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0 group-hover:bg-teal-500/20 transition-colors">
                      <f.icon className="h-5 w-5 text-teal-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{isArabic ? f.titleAr : f.titleEn}</h3>
                      <p className="text-sm text-white/50">{isArabic ? f.descAr : f.descEn}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-teal-600 to-teal-500">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {isArabic ? "كن أول من يجرب التطبيق" : "Be the First to Try"}
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-lg mx-auto">
            {isArabic
              ? "سجل الآن للحصول على إشعار فور إطلاق تطبيق كوبي إن بي+"
              : "Register now to get notified when the CoBnB+ app launches"}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <StoreButton type="apple" isArabic={isArabic} dark />
            <StoreButton type="google" isArabic={isArabic} dark />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StoreButton({ type, isArabic, dark }: { type: "apple" | "google"; isArabic: boolean; dark?: boolean }) {
  return (
    <a href="#" onClick={(e) => e.preventDefault()} className="group">
      <div className={`flex items-center gap-3 rounded-xl px-5 py-3 transition-all ${
        dark
          ? "bg-white/10 hover:bg-white/20 border border-white/20"
          : "bg-white/10 hover:bg-white/15 border border-white/20"
      }`}>
        {type === "apple" ? (
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="white">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
        ) : (
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="white">
            <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.635-8.635z"/>
          </svg>
        )}
        <div>
          <p className="text-[10px] text-white/60 leading-none">
            {type === "apple" ? (isArabic ? "حمّل من" : "Download on the") : (isArabic ? "احصل عليه من" : "Get it on")}
          </p>
          <p className="text-sm font-semibold text-white">{type === "apple" ? "App Store" : "Google Play"}</p>
        </div>
      </div>
    </a>
  );
}

function PhoneMockup({ isArabic, variant = "guest" }: { isArabic: boolean; variant?: "guest" | "owner" }) {
  return (
    <div className="relative">
      <div className="w-72 h-[580px] bg-gradient-to-b from-slate-800 to-slate-900 rounded-[3rem] border-4 border-slate-700 shadow-2xl flex items-center justify-center">
        <div className="w-64 h-[540px] bg-gradient-to-b from-[#0B1E2D] to-[#1a3a4f] rounded-[2.5rem] flex flex-col items-center justify-center p-6 text-center">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${
            variant === "owner" ? "bg-amber-500/20" : "bg-teal-500/20"
          }`}>
            {variant === "owner" ? (
              <BarChart3 className="h-10 w-10 text-amber-400" />
            ) : (
              <Zap className="h-10 w-10 text-teal-400" />
            )}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">CoBnB+</h3>
          <p className="text-sm text-white/50">
            {variant === "owner"
              ? (isArabic ? "لوحة تحكم المالك" : "Owner Dashboard")
              : (isArabic ? "الخبير في الشقق الفندقية" : "The BnB Expert")}
          </p>
          <div className="mt-8 space-y-3 w-full">
            {variant === "owner" ? (
              <>
                <div className="bg-white/5 rounded-xl p-3 text-start">
                  <p className="text-[10px] text-white/40">{isArabic ? "الإيرادات الشهرية" : "Monthly Revenue"}</p>
                  <p className="text-lg font-bold text-teal-400">SAR 12,450</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-start">
                  <p className="text-[10px] text-white/40">{isArabic ? "نسبة الإشغال" : "Occupancy Rate"}</p>
                  <p className="text-lg font-bold text-amber-400">87%</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-start">
                  <p className="text-[10px] text-white/40">{isArabic ? "الحجوزات النشطة" : "Active Bookings"}</p>
                  <p className="text-lg font-bold text-white">3</p>
                </div>
              </>
            ) : (
              <>
                <div className="h-3 bg-white/10 rounded-full w-full" />
                <div className="h-3 bg-white/10 rounded-full w-3/4" />
                <div className="h-3 bg-white/10 rounded-full w-5/6" />
                <div className="h-10 bg-teal-500/20 rounded-xl w-full mt-4 flex items-center justify-center">
                  <span className="text-xs text-teal-400 font-medium">{isArabic ? "احجز الآن" : "Book Now"}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full blur-xl ${variant === "owner" ? "bg-amber-500/20" : "bg-teal-500/20"}`} />
      <div className={`absolute -bottom-4 -left-4 w-32 h-32 rounded-full blur-xl ${variant === "owner" ? "bg-teal-400/10" : "bg-teal-400/10"}`} />
    </div>
  );
}
