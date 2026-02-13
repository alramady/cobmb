import SEO from "@/components/SEO";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Key, TrendingUp, Paintbrush, Headphones, Users, ArrowRight, ArrowLeft, CheckCircle, Building2 } from "lucide-react";

export default function Services() {
  const { t, isArabic } = useLanguage();
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  const services = [
    {
      icon: Key,
      titleAr: "إدارة الإيجار القصير",
      titleEn: "Short-Term Rental Management",
      descAr: "إدارة شاملة لعقارك على منصات الإيجار القصير مثل Airbnb و Booking.com و Agoda. نتولى كل شيء من الإدراج والتسعير إلى إدارة الحجوزات والتواصل مع الضيوف.",
      descEn: "Complete management of your property on short-term rental platforms like Airbnb, Booking.com, and Agoda. We handle everything from listing and pricing to booking management and guest communication.",
      features: [
        { ar: "إدراج احترافي على جميع المنصات", en: "Professional listing on all platforms" },
        { ar: "تصوير احترافي للعقار", en: "Professional property photography" },
        { ar: "إدارة الحجوزات والتقويم", en: "Booking & calendar management" },
        { ar: "التواصل مع الضيوف 24/7", en: "24/7 guest communication" },
      ],
    },
    {
      icon: TrendingUp,
      titleAr: "إدارة الإيرادات",
      titleEn: "Revenue Management",
      descAr: "تسعير ديناميكي يعتمد على البيانات لتحقيق أقصى عائد من عقارك. نحلل السوق والمواسم والطلب لضبط الأسعار بشكل مستمر.",
      descEn: "Data-driven dynamic pricing to maximize your property's revenue. We analyze market conditions, seasons, and demand to continuously adjust pricing.",
      features: [
        { ar: "تسعير ديناميكي حسب الموسم", en: "Seasonal dynamic pricing" },
        { ar: "تحليل المنافسين", en: "Competitor analysis" },
        { ar: "تقارير أداء شهرية", en: "Monthly performance reports" },
        { ar: "تحسين معدل الإشغال", en: "Occupancy rate optimization" },
      ],
    },
    {
      icon: Paintbrush,
      titleAr: "العناية بالعقار والتجديد",
      titleEn: "Property Care & Renovation",
      descAr: "نحافظ على عقارك في أفضل حالة من خلال الصيانة الدورية والتنظيف الاحترافي. كما نقدم خدمات التصميم الداخلي والتجديد.",
      descEn: "We keep your property in top condition through regular maintenance and professional cleaning. We also offer interior design and renovation services.",
      features: [
        { ar: "تنظيف احترافي بعد كل إقامة", en: "Professional cleaning after each stay" },
        { ar: "صيانة دورية ووقائية", en: "Regular preventive maintenance" },
        { ar: "تصميم داخلي وتأثيث", en: "Interior design & furnishing" },
        { ar: "تجديد وترقية العقار", en: "Property renovation & upgrade" },
      ],
    },
    {
      icon: Headphones,
      titleAr: "تجربة الضيف",
      titleEn: "Guest Experience",
      descAr: "نضمن تجربة استثنائية لكل ضيف من لحظة الحجز حتى المغادرة. دعم على مدار الساعة بالعربية والإنجليزية.",
      descEn: "We ensure an exceptional experience for every guest from booking to checkout. 24/7 support in Arabic and English.",
      features: [
        { ar: "استقبال الضيوف وتسليم المفاتيح", en: "Guest check-in & key handover" },
        { ar: "دليل إقامة رقمي", en: "Digital stay guide" },
        { ar: "دعم طوارئ 24/7", en: "24/7 emergency support" },
        { ar: "إدارة التقييمات والردود", en: "Review management & responses" },
      ],
    },
    {
      icon: Users,
      titleAr: "السكن المشترك",
      titleEn: "Co-Living",
      descAr: "حلول سكن مشترك مبتكرة للمهنيين والطلاب. نوفر بيئة معيشية مريحة ومجتمعية.",
      descEn: "Innovative co-living solutions for professionals and students. We provide comfortable, community-oriented living environments.",
      features: [
        { ar: "غرف مفروشة بالكامل", en: "Fully furnished rooms" },
        { ar: "مساحات مشتركة مصممة", en: "Designed common spaces" },
        { ar: "خدمات تنظيف وصيانة", en: "Cleaning & maintenance services" },
        { ar: "فعاليات مجتمعية", en: "Community events" },
      ],
    },
    {
      icon: Building2,
      titleAr: "إدارة العقارات",
      titleEn: "Property Management",
      descAr: "إدارة عقارية شاملة تشمل التأجير والصيانة والتقارير المالية. نتعامل مع عقارك كأنه عقارنا.",
      descEn: "Comprehensive property management including leasing, maintenance, and financial reporting. We treat your property as our own.",
      features: [
        { ar: "إدارة العقود والتأجير", en: "Contract & leasing management" },
        { ar: "تقارير مالية شفافة", en: "Transparent financial reports" },
        { ar: "إدارة المرافق", en: "Facility management" },
        { ar: "استشارات استثمارية", en: "Investment consulting" },
      ],
    },
  ];

  return (
    <PageLayout>
      <SEO title={isArabic ? "خدماتنا" : "Our Services"} description={isArabic ? "إدارة عقارات متكاملة وخدمات ضيوف وتحسين العوائد للإيجارات قصيرة المدى." : "Full-service property management, guest services, and revenue optimization for short-term rentals."} url="/services" />
      {/* Hero */}
      <section className="relative py-24 bg-[#0B1E2D] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-[#C9A96E] rounded-full blur-[120px]" />
        </div>
        <div className="container relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{t("services.title")}</h1>
          <p className="text-xl text-white/70 max-w-2xl">
            {isArabic
              ? "حلول متكاملة لإدارة عقارك وتحقيق أقصى عائد من الإيجار القصير"
              : "Comprehensive solutions to manage your property and maximize short-term rental returns"}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container space-y-16">
          {services.map((service, i) => (
            <div key={i} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className="w-14 h-14 rounded-xl bg-[#3ECFC0]/10 flex items-center justify-center mb-4">
                  <service.icon className="h-7 w-7 text-[#3ECFC0]" />
                </div>
                <h2 className="text-2xl font-bold text-[#0B1E2D] mb-4">{isArabic ? service.titleAr : service.titleEn}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{isArabic ? service.descAr : service.descEn}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-[#3ECFC0] mt-0.5 shrink-0" />
                      <span className="text-sm text-foreground">{isArabic ? feature.ar : feature.en}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`bg-gradient-to-br from-[#0B1E2D] to-[#1a3a4f] rounded-2xl aspect-[4/3] flex items-center justify-center ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                <service.icon className="h-24 w-24 text-[#3ECFC0]/20" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#3ECFC0] to-[#2ab5a6]">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-[#0B1E2D] mb-4">
            {isArabic ? "جاهز لتحقيق أقصى استفادة من عقارك؟" : "Ready to Maximize Your Property's Potential?"}
          </h2>
          <p className="text-[#0B1E2D]/70 mb-8 max-w-xl mx-auto">
            {isArabic ? "تواصل معنا اليوم للحصول على استشارة مجانية" : "Contact us today for a free consultation"}
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-[#0B1E2D] text-white hover:bg-[#0B1E2D]/90 font-semibold px-8 py-6 rounded-xl">
              {t("contact.title")} <Arrow className="h-5 w-5 ms-2" />
            </Button>
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
