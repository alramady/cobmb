import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Crown, Sparkles, Star, Shield, Gem, Home, ArrowRight, CheckCircle2 } from "lucide-react";
import SEO from "@/components/SEO";

export default function CoBnBPlus() {
  const { isArabic } = useLanguage();

  const features = [
    {
      icon: Home,
      titleEn: "Designer-Furnished",
      titleAr: "تأثيث فاخر",
      descEn: "Every CoBnB+ property is professionally designed with premium furniture, curated art, and thoughtful layouts that blend Saudi heritage with modern luxury.",
      descAr: "كل عقار في كوبي إن بي+ مصمم باحترافية بأثاث فاخر ولوحات فنية مختارة وتصاميم مدروسة تمزج بين التراث السعودي والفخامة العصرية.",
    },
    {
      icon: Gem,
      titleEn: "Luxury-Grade Comfort",
      titleAr: "راحة بمستوى فاخر",
      descEn: "Premium linens, high-thread-count bedding, rain showers, and top-tier appliances ensure every moment of your stay feels five-star.",
      descAr: "مفارش فاخرة وأسرّة عالية الجودة ودش مطري وأجهزة من الدرجة الأولى تضمن أن كل لحظة في إقامتك تشعرك بالفخامة.",
    },
    {
      icon: Star,
      titleEn: "Curated Premium Stay Support",
      titleAr: "دعم إقامة متميز",
      descEn: "Dedicated concierge service, priority maintenance, airport transfers, and personalized recommendations for dining, entertainment, and experiences.",
      descAr: "خدمة كونسيرج مخصصة وصيانة ذات أولوية ونقل من المطار وتوصيات شخصية للمطاعم والترفيه والتجارب.",
    },
    {
      icon: Sparkles,
      titleEn: "Elevated Luxury Amenities",
      titleAr: "وسائل راحة فاخرة",
      descEn: "Premium toiletries from world-class brands, Nespresso machines, smart home systems, and welcome packages that set the tone for an unforgettable stay.",
      descAr: "مستحضرات عناية من أفخم العلامات التجارية وآلات نسبريسو وأنظمة منزل ذكي وحزم ترحيبية تضع الأساس لإقامة لا تُنسى.",
    },
  ];

  const benefits = [
    { en: "Professionally designed interiors", ar: "تصاميم داخلية احترافية" },
    { en: "Premium brand amenities", ar: "وسائل راحة من علامات تجارية فاخرة" },
    { en: "Dedicated concierge service", ar: "خدمة كونسيرج مخصصة" },
    { en: "Priority 24/7 maintenance", ar: "صيانة على مدار الساعة بأولوية" },
    { en: "Airport transfer arrangements", ar: "ترتيبات النقل من المطار" },
    { en: "Smart home technology", ar: "تقنية المنزل الذكي" },
    { en: "Welcome packages & gifts", ar: "حزم ترحيبية وهدايا" },
    { en: "Flexible booking terms", ar: "شروط حجز مرنة" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A]" dir={isArabic ? "rtl" : "ltr"}>
      <SEO title={isArabic ? "كوبي إن بي+ — الفخامة في أبسط صورها" : "CoBnB+ — Luxury Living Simplified"} description={isArabic ? "مجموعة حصرية من العقارات الفاخرة المصممة بعناية فائقة في أرقى أحياء المملكة." : "Exclusive collection of meticulously designed luxury properties in Saudi Arabia's most prestigious neighborhoods."} url="/cobnb-plus" />
      <Navbar />

      {/* Hero — Full-screen dark luxury */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0B1E2D]/80 to-[#0A0A0A]" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-500 rounded-full blur-[100px]" />
        </div>

        <div className="container relative z-10 text-center py-24">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-teal-500/10 border border-amber-500/20 rounded-full px-5 py-2 mb-8">
            <Crown className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-amber-300 font-medium tracking-wider uppercase">
              {isArabic ? "تجربة فاخرة" : "Premium Experience"}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            <span className="text-white">COBNB</span>
            <span className="bg-gradient-to-r from-teal-400 to-teal-300 bg-clip-text text-transparent">+</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/50 font-light tracking-wide mb-4">
            {isArabic ? "الفخامة في أبسط صورها" : "Luxury Living Simplified"}
          </p>

          <p className="text-base md:text-lg text-white/30 max-w-2xl mx-auto mb-12">
            {isArabic
              ? "اكتشف مجموعة حصرية من العقارات الفاخرة المصممة بعناية فائقة في أرقى أحياء المملكة العربية السعودية"
              : "Discover an exclusive collection of meticulously designed luxury properties in Saudi Arabia's most prestigious neighborhoods"}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/properties">
              <Button size="lg" className="bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-white px-8 text-base rounded-xl h-12 shadow-lg shadow-teal-500/20">
                {isArabic ? "استكشف العقارات الفاخرة" : "Explore Premium Properties"}
                <ArrowRight className={`h-4 w-4 ms-2 ${isArabic ? "rotate-180" : ""}`} />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 px-8 text-base rounded-xl h-12 bg-transparent">
                {isArabic ? "تواصل معنا" : "Contact Us"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What is CoBnB+? */}
      <section className="py-20 md:py-28 bg-[#0B1E2D]/50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {isArabic ? "ما هو كوبي إن بي+؟" : "What is CoBnB+?"}
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-teal-500 to-amber-500 mx-auto mb-8" />
            <p className="text-lg text-white/60 leading-relaxed mb-6">
              {isArabic
                ? "كوبي إن بي+ هو برنامجنا الحصري للعقارات الفاخرة. كل عقار يحمل علامة + يمثل أعلى معايير الجودة والتصميم والخدمة. من التأثيث الفاخر إلى خدمة الكونسيرج المخصصة، نضمن تجربة إقامة لا مثيل لها."
                : "CoBnB+ is our exclusive premium property program. Every property bearing the + mark represents the highest standards of quality, design, and service. From luxury furnishings to dedicated concierge service, we guarantee an unparalleled stay experience."}
            </p>
            <p className="text-base text-white/40 leading-relaxed">
              {isArabic
                ? "نختار بعناية كل عقار ونشرف على تجهيزه وتأثيثه وفقاً لأعلى المعايير العالمية، مع لمسة سعودية أصيلة تعكس كرم الضيافة وعراقة التراث."
                : "We carefully select each property and oversee its preparation and furnishing according to the highest international standards, with an authentic Saudi touch that reflects the generosity of hospitality and the richness of heritage."}
            </p>
          </div>
        </div>
      </section>

      {/* What Makes CoBnB+ Different? */}
      <section className="py-20 md:py-28 bg-[#0A0A0A]">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            {isArabic ? "ما الذي يميز كوبي إن بي+؟" : "What Makes CoBnB+ Different?"}
          </h2>
          <p className="text-center text-white/40 mb-16 max-w-2xl mx-auto">
            {isArabic
              ? "أربعة أركان تجعل كل إقامة تجربة استثنائية"
              : "Four pillars that make every stay an extraordinary experience"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <div key={i} className="group bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] rounded-2xl p-8 hover:border-teal-500/30 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-500/5 flex items-center justify-center mb-6 group-hover:from-teal-500/30 group-hover:to-teal-500/10 transition-all">
                  <f.icon className="h-7 w-7 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{isArabic ? f.titleAr : f.titleEn}</h3>
                <p className="text-white/50 leading-relaxed">{isArabic ? f.descAr : f.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Checklist */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-[#0B1E2D]/30 to-[#0A0A0A]">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  {isArabic ? "ماذا يشمل كوبي إن بي+؟" : "What's Included in CoBnB+?"}
                </h2>
                <p className="text-white/50 mb-8">
                  {isArabic
                    ? "كل عقار من عقارات كوبي إن بي+ يأتي مع مجموعة شاملة من الخدمات والمزايا الحصرية."
                    : "Every CoBnB+ property comes with a comprehensive suite of exclusive services and benefits."}
                </p>
                <div className="space-y-4">
                  {benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0" />
                      <span className="text-white/70 group-hover:text-white transition-colors">{isArabic ? b.ar : b.en}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-[#0B1E2D] to-[#1a3a4f] border border-white/10 overflow-hidden flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500/20 to-amber-500/10 flex items-center justify-center mx-auto mb-6">
                      <Crown className="h-12 w-12 text-amber-400" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">CoBnB<span className="text-teal-400">+</span></h3>
                    <p className="text-white/40 text-sm">{isArabic ? "معيار الفخامة الجديد" : "The New Standard of Luxury"}</p>
                    <div className="mt-8 flex justify-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Property Owners */}
      <section className="py-20 md:py-28 bg-[#0A0A0A]">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="h-12 w-12 text-teal-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {isArabic ? "لأصحاب العقارات" : "For Property Owners"}
            </h2>
            <p className="text-lg text-white/50 mb-8 max-w-2xl mx-auto">
              {isArabic
                ? "انضم لبرنامج كوبي إن بي+ وحوّل عقارك إلى مصدر دخل فاخر. نتولى كل شيء من التصميم والتأثيث إلى إدارة الضيوف والصيانة."
                : "Join the CoBnB+ program and transform your property into a premium income source. We handle everything from design and furnishing to guest management and maintenance."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/list-property">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-semibold px-8 text-base rounded-xl h-12">
                  {isArabic ? "سجّل عقارك" : "List Your Property"}
                  <ArrowRight className={`h-4 w-4 ms-2 ${isArabic ? "rotate-180" : ""}`} />
                </Button>
              </Link>
              <a href="https://wa.me/966504466528" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 px-8 text-base rounded-xl h-12 bg-transparent">
                  {isArabic ? "تحدث مع مستشار" : "Talk to an Advisor"}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
