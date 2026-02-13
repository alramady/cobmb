import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2, Users, TrendingUp, MapPin, Star, ArrowRight, ArrowLeft,
  Home as HomeIcon, Key, Paintbrush, Headphones, UserCheck, Clock,
  ChevronRight, ChevronLeft, Bed, Bath, Maximize
} from "lucide-react";

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function AnimatedCounter({ target, suffix = "", label }: { target: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          setVisible(true);
          let startTime = 0;
          const duration = 2500;
          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            setCount(Math.floor(easedProgress * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div
      ref={ref}
      className={`text-center transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#3ECFC0] tabular-nums">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="w-8 h-0.5 bg-[#3ECFC0]/30 mx-auto mt-3 mb-2 rounded-full" />
      <p className="text-sm md:text-base text-muted-foreground font-medium">{label}</p>
    </div>
  );
}

export default function Home() {
  const { t, isArabic, lang } = useLanguage();
  const { data: featuredProperties } = trpc.properties.featured.useQuery();
  const { data: citiesData } = trpc.cities.list.useQuery();
  const { data: heroVideo } = trpc.settings.heroVideo.useQuery();
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  const stats = [
    { value: 7, suffix: "+", label: t("stats.years") },
    { value: 1321, suffix: "+", label: t("stats.properties") },
    { value: 80, suffix: "%+", label: t("stats.occupancy") },
    { value: 3, suffix: "", label: t("stats.cities") },
  ];

  const services = [
    { icon: HomeIcon, title: t("services.property"), desc: isArabic ? "إدارة شاملة لعقارك" : "Complete property management" },
    { icon: Key, title: t("services.str"), desc: isArabic ? "تشغيل الإيجار القصير" : "Short-term rental operations" },
    { icon: TrendingUp, title: t("services.revenue"), desc: isArabic ? "تسعير ديناميكي وتحسين العوائد" : "Dynamic pricing & yield optimization" },
    { icon: Paintbrush, title: t("services.care"), desc: isArabic ? "تجديد وتصميم داخلي" : "Renovation & interior design" },
    { icon: Headphones, title: t("services.guest"), desc: isArabic ? "دعم الضيوف على مدار الساعة" : "24/7 guest support" },
    { icon: Users, title: t("services.coliving"), desc: isArabic ? "حلول السكن المشترك" : "Co-living solutions" },
  ];

  const steps = [
    { num: "01", title: t("how.step1.title"), desc: t("how.step1.desc") },
    { num: "02", title: t("how.step2.title"), desc: t("how.step2.desc") },
    { num: "03", title: t("how.step3.title"), desc: t("how.step3.desc") },
  ];

  return (
    <PageLayout>
      <SEO
        title={isArabic ? "الرئيسية" : "Home"}
        description={isArabic ? "إدارة إيجارات قصيرة المدى متميزة في المملكة العربية السعودية. الرياض، جدة، المدينة المنورة." : "Premium short-term rental management in Saudi Arabia. Riyadh, Jeddah, Madinah. Property management, guest services, and revenue optimization."}
        url="/"
      />
      {/* Hero Section with Video Background */}
      <section className="relative min-h-[90vh] flex items-center bg-[#0B1E2D] overflow-hidden">
        {/* Video Background */}
        {heroVideo?.videoUrl ? (
          <video
            key={heroVideo.videoUrl}
            autoPlay
            muted
            loop
            playsInline
            poster={heroVideo.posterUrl || undefined}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={heroVideo.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 right-20 w-96 h-96 bg-[#3ECFC0] rounded-full blur-[150px]" />
            <div className="absolute bottom-20 left-20 w-72 h-72 bg-[#C9A96E] rounded-full blur-[120px]" />
          </div>
        )}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1E2D]/70 via-[#0B1E2D]/50 to-[#0B1E2D]/80" />
        <div className="container relative z-10 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3ECFC0]/10 border border-[#3ECFC0]/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#3ECFC0] animate-pulse" />
              <span className="text-[#3ECFC0] text-sm font-medium">
                {isArabic ? "الآن في المملكة العربية السعودية" : "Now in Saudi Arabia"}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              {t("hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/owners">
                <Button size="lg" className="bg-[#3ECFC0] text-[#0B1E2D] hover:bg-[#B8F0E8] font-semibold text-lg px-8 py-6 rounded-xl">
                  {t("hero.cta.list")}
                  <Arrow className="h-5 w-5 ms-2" />
                </Button>
              </Link>
              <Link href="/booking">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold text-lg px-8 py-6 rounded-xl bg-transparent">
                  {t("hero.cta.book")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, i) => (
              <AnimatedCounter key={i} target={stat.value} suffix={stat.suffix} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-[#F5F7FA]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1E2D] mb-4">{t("services.title")}</h2>
            <div className="w-20 h-1 bg-[#3ECFC0] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <Card key={i} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-[#3ECFC0]/10 flex items-center justify-center mb-4 group-hover:bg-[#3ECFC0]/20 transition-colors">
                    <service.icon className="h-6 w-6 text-[#3ECFC0]" />
                  </div>
                  <h3 className="font-semibold text-lg text-[#0B1E2D] mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/services">
              <Button variant="outline" className="border-[#3ECFC0] text-[#3ECFC0] hover:bg-[#3ECFC0]/10">
                {isArabic ? "عرض جميع الخدمات" : "View All Services"}
                <Arrow className="h-4 w-4 ms-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[#0B1E2D]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("how.title")}</h2>
            <div className="w-20 h-1 bg-[#C9A96E] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="text-6xl font-bold text-[#3ECFC0]/20 mb-4">{step.num}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-white/60">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Model */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1E2D] mb-4">{t("revenue.title")}</h2>
            <div className="w-20 h-1 bg-[#C9A96E] mx-auto rounded-full" />
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex-1 text-center p-8 rounded-2xl bg-[#3ECFC0]/10 border-2 border-[#3ECFC0]">
                <div className="text-5xl font-bold text-[#3ECFC0] mb-2">70%</div>
                <p className="font-semibold text-[#0B1E2D]">{t("revenue.owner")}</p>
              </div>
              <div className="text-3xl font-bold text-[#C9A96E]">:</div>
              <div className="flex-1 text-center p-8 rounded-2xl bg-[#0B1E2D]/5 border-2 border-[#0B1E2D]/20">
                <div className="text-5xl font-bold text-[#0B1E2D] mb-2">30%</div>
                <p className="font-semibold text-[#0B1E2D]">{t("revenue.cobnb")}</p>
              </div>
            </div>
            <p className="text-center text-muted-foreground text-sm">{t("revenue.note")}</p>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {featuredProperties && featuredProperties.length > 0 && (
        <section className="py-20 bg-[#F5F7FA]">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-[#0B1E2D]">{t("properties.featured")}</h2>
              <Link href="/properties">
                <Button variant="ghost" className="text-[#3ECFC0] hover:text-[#3ECFC0]/80">
                  {t("properties.view_all")} <Arrow className="h-4 w-4 ms-1" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.slice(0, 6).map((property) => (
                <Link key={property.id} href={`/properties/${property.id}`}>
                  <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0">
                    <div className="aspect-[4/3] bg-gradient-to-br from-[#0B1E2D] to-[#1a3a4f] relative overflow-hidden">
                      {(() => { const imgs = property.images as string[] | null; return imgs && imgs[0] ? <img src={imgs[0]} alt={String(lang === "ar" ? property.titleAr : property.titleEn)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : null; })()}
                      {property.isFeatured && (
                        <span className="absolute top-3 start-3 px-3 py-1 bg-[#C9A96E] text-white text-xs font-semibold rounded-full">
                          {isArabic ? "مميز" : "Featured"}
                        </span>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg text-[#0B1E2D] mb-2 line-clamp-1">
                        {lang === "ar" ? property.titleAr : property.titleEn}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Bed className="h-4 w-4" /> {String(property.bedrooms ?? 0)}</span>
                        <span className="flex items-center gap-1"><Bath className="h-4 w-4" /> {String(property.bathrooms ?? 0)}</span>
                        <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {String(property.maxGuests ?? 0)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold text-[#3ECFC0]">{t("common.sar")} {String(property.priceNightly || property.priceLow || 0)}</span>
                          <span className="text-xs text-muted-foreground ms-1">{t("pricing.per_night")}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* City Selector */}
      <section className="py-20 bg-[#0B1E2D]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("cities.title")}</h2>
            <div className="w-20 h-1 bg-[#C9A96E] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { slug: "riyadh", nameAr: "الرياض", nameEn: "Riyadh", neighborhoods: 25, emoji: "🏙️" },
              { slug: "jeddah", nameAr: "جدة", nameEn: "Jeddah", neighborhoods: 25, emoji: "🌊" },
              { slug: "madinah", nameAr: "المدينة المنورة", nameEn: "Madinah", neighborhoods: 20, emoji: "🕌" },
            ].map((city) => (
              <Link key={city.slug} href={`/cities/${city.slug}`}>
                <Card className="group overflow-hidden bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                  <div className="aspect-[16/10] bg-gradient-to-br from-[#1a3a4f] to-[#0B1E2D] flex items-center justify-center text-6xl">
                    {city.emoji}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {isArabic ? city.nameAr : city.nameEn}
                    </h3>
                    <p className="text-[#3ECFC0] text-sm">{city.neighborhoods} {t("cities.neighborhoods")}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1E2D] mb-4">
              {isArabic ? "آراء عملائنا" : "What Our Clients Say"}
            </h2>
            <div className="w-20 h-1 bg-[#3ECFC0] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: isArabic ? "أحمد المطيري" : "Ahmed Al-Mutairi",
                role: isArabic ? "مالك عقار - الرياض" : "Property Owner - Riyadh",
                text: isArabic ? "لم أتوقع أن أحقق عائد أكثر من 8% على شقتي. شكراً لكم على إدارة استثماري بهذا الاحتراف." : "I never thought it was possible to get more than 8% yield on my apartment. Thank you for managing my investment so professionally.",
                rating: 5,
              },
              {
                name: isArabic ? "سارة الحربي" : "Sarah Al-Harbi",
                role: isArabic ? "مالكة عقار - جدة" : "Property Owner - Jeddah",
                text: isArabic ? "سعيدة جداً باختياري العمل مع CoBnB. من الاستشارة الأولى وحتى إدراج الشقة، الخدمة كانت ممتازة." : "So happy I chose to work with CoBnB. From initial consultation through apartment listing, the service was impeccable.",
                rating: 5,
              },
              {
                name: isArabic ? "خالد العتيبي" : "Khalid Al-Otaibi",
                role: isArabic ? "مالك عقار - المدينة" : "Property Owner - Madinah",
                text: isArabic ? "تسويق CoBnB مذهل حقاً. حققوا في شهر واحد ما لم أستطع تحقيقه في 4 أشهر بمفردي." : "CoBnB's marketing is truly impressive. They achieved in one month what I couldn't in 4 months on my own.",
                rating: 5,
              },
            ].map((testimonial, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-[#C9A96E] text-[#C9A96E]" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-[#0B1E2D]">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#3ECFC0] to-[#2ab5a6]">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1E2D] mb-4">
            {isArabic ? "حقق أقصى استفادة من عقارك" : "Maximize Your Property's Potential"}
          </h2>
          <p className="text-[#0B1E2D]/70 text-lg mb-8 max-w-2xl mx-auto">
            {isArabic ? "احصل على تقييم إيجار مجاني واكتشف كم يمكن أن يحقق عقارك" : "Get a free rental forecast and discover how much your property can earn"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/owners">
              <Button size="lg" className="bg-[#0B1E2D] text-white hover:bg-[#0B1E2D]/90 font-semibold text-lg px-8 py-6 rounded-xl">
                {t("owner.cta")}
                <Arrow className="h-5 w-5 ms-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-[#0B1E2D]/30 text-[#0B1E2D] hover:bg-[#0B1E2D]/10 font-semibold text-lg px-8 py-6 rounded-xl bg-transparent">
                {t("contact.title")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Partners & Press Sections */}
      <PartnersShowcase isArabic={isArabic} />

      {/* OTA Partners */}
      <OTAPartners isArabic={isArabic} />
    </PageLayout>
  );
}

// ─── Partners Showcase (Press + Clients) ─────────────────────────────
function PartnersShowcase({ isArabic }: { isArabic: boolean }) {
  const { data: pressPartners } = trpc.partners.byCategory.useQuery({ category: "press" });
  const { data: clientPartners } = trpc.partners.byCategory.useQuery({ category: "client" });

  const hasPress = pressPartners && pressPartners.length > 0;
  const hasClients = clientPartners && clientPartners.length > 0;

  if (!hasPress && !hasClients) return null;

  return (
    <>
      {/* Press / Honorable Mentions */}
      {hasPress && (
        <section className="py-16 bg-slate-50 border-t overflow-hidden">
          <div className="container mb-8 text-center">
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">
              {isArabic ? "إشادات مشرّفة" : "Honorable Mentions"}
            </p>
            <h3 className="text-xl font-bold text-[#0B1E2D]">
              {isArabic ? "كما ظهرنا في" : "As Featured In"}
            </h3>
          </div>
          <div className="relative">
            <div className="flex animate-marquee gap-12 items-center">
              {[...pressPartners, ...pressPartners].map((p: any, i: number) => (
                <div key={`${p.id}-${i}`} className="flex-shrink-0 px-4">
                  {p.logo ? (
                    <img src={p.logo} alt={p.nameEn} className="h-10 object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300" />
                  ) : (
                    <span className="text-slate-400 font-semibold text-sm whitespace-nowrap">{isArabic ? p.nameAr : p.nameEn}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            .animate-marquee { animation: marquee 30s linear infinite; width: max-content; }
            .animate-marquee:hover { animation-play-state: paused; }
          `}</style>
        </section>
      )}

      {/* Client Partners */}
      {hasClients && (
        <section className="py-16 bg-white border-t">
          <div className="container text-center">
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">
              {isArabic ? "شراكات موثوقة" : "Trusted Partnerships"}
            </p>
            <h3 className="text-xl font-bold text-[#0B1E2D] mb-8">
              {isArabic ? "نعمل مع أفضل العملاء والشركاء" : "Working With the Best Clients & Partners"}
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {clientPartners.map((p: any) => (
                <div key={p.id} className="group">
                  {p.logo ? (
                    <img src={p.logo} alt={p.nameEn} className="h-12 object-contain grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-100 transition-all duration-300" />
                  ) : (
                    <div className="px-6 py-3 border border-gray-200 rounded-xl text-gray-400 font-semibold text-sm group-hover:text-[#0B1E2D] group-hover:border-teal-300 transition-colors">
                      {isArabic ? p.nameAr : p.nameEn}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

// ─── OTA Partners (dynamic from DB with fallback) ────────────────────
function OTAPartners({ isArabic }: { isArabic: boolean }) {
  const { data: otaPartners } = trpc.partners.byCategory.useQuery({ category: "ota" });
  const names = otaPartners && otaPartners.length > 0
    ? otaPartners.map((p: any) => ({ name: isArabic ? p.nameAr : p.nameEn, logo: p.logo }))
    : [{ name: "Airbnb", logo: null }, { name: "Booking.com", logo: null }, { name: "Agoda", logo: null }];

  return (
    <section className="py-12 bg-white border-t">
      <div className="container">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {isArabic ? "شركاء التوزيع عبر منصات الحجز العالمية" : "Distribution Partners Across Global OTA Platforms"}
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {names.map((item: any, i: number) => (
              <div key={i} className="group">
                {item.logo ? (
                  <img src={item.logo} alt={item.name} className="h-10 object-contain grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all" />
                ) : (
                  <div className="px-6 py-3 border border-gray-200 rounded-xl text-gray-400 font-semibold text-lg">
                    {item.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
