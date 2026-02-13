import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Crown, Sparkles, Star, Shield, Gem, Home, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import SEO from "@/components/SEO";
import { trpc } from "@/lib/trpc";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HERO_IMAGES = [
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/NrkyHIIWPYfNhfgQ.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/VCTAxNYfkqVfkWYV.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/ILlekwslGTWetwJA.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/yCsBXECCoeDPMinq.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/DLyLheqCxngcGold.jpg",
];

const LOCCITANE_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/dWVZhcirsWFGSCWk.jpg";

export default function CoBnBPlus() {
  const { isArabic } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: propertiesData } = trpc.properties.featured.useQuery();

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const features = [
    {
      icon: Home,
      titleEn: "Designer-Furnished",
      titleAr: "تأثيث فاخر",
      descEn: "Every residence is thoughtfully designed with premium furnishings and refined interiors, creating a space that feels elevated, modern, and timeless.",
      descAr: "كل مسكن مصمم بعناية بأثاث فاخر وتصاميم داخلية راقية، لخلق مساحة تشعرك بالرقي والعصرية والأناقة الخالدة.",
    },
    {
      icon: Gem,
      titleEn: "Luxury-Grade Comfort",
      titleAr: "راحة بمستوى فاخر",
      descEn: "Premium bedding, intuitive living touches, and refined comfort come together to create a calmer environment — supporting deeper rest and effortless living.",
      descAr: "مفارش فاخرة ولمسات معيشية مدروسة وراحة راقية تتضافر لخلق بيئة هادئة — تدعم الراحة العميقة والعيش بلا عناء.",
    },
    {
      icon: Star,
      titleEn: "Curated Premium Stay Support",
      titleAr: "دعم إقامة متميز ومنسّق",
      descEn: "Thoughtfully managed guest support focused on comfort and convenience, with flexible services tailored to each residence and stay type.",
      descAr: "دعم ضيوف مُدار بعناية يركز على الراحة والملاءمة، مع خدمات مرنة مصممة لكل مسكن ونوع إقامة.",
    },
    {
      icon: Sparkles,
      titleEn: "Elevated Luxury Amenities",
      titleAr: "وسائل راحة فاخرة راقية",
      descEn: "Thoughtfully curated amenities featuring L'OCCITANE en Provence bath essentials, bringing a refined sensory experience to every elevated CoBnB+ stay.",
      descAr: "وسائل راحة منتقاة بعناية تتضمن مستحضرات الاستحمام من لوكسيتان إن بروفانس، لتجربة حسية راقية في كل إقامة متميزة من كوبي إن بي+.",
    },
  ];

  const properties = propertiesData?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-[#0A0A0A]" dir={isArabic ? "rtl" : "ltr"}>
      <SEO
        title={isArabic ? "كوبي إن بي+ — الفخامة في أبسط صورها" : "CoBnB+ — Luxury Living Simplified"}
        description={isArabic
          ? "مجموعة حصرية من العقارات الفاخرة المصممة بعناية فائقة في أرقى أحياء المملكة."
          : "Exclusive collection of meticulously designed luxury properties in Saudi Arabia's most prestigious neighborhoods."}
        url="/cobnb-plus"
      />
      <Navbar />

      {/* Hero — Full-screen image carousel like Malaysia reference */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background image carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={HERO_IMAGES[currentSlide]}
              alt="Luxury interior"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />

        {/* Carousel navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="h-8 w-8" />
        </button>

        {/* Hero content */}
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-4 tracking-tight">
              <span className="text-teal-400" style={{ fontFamily: "'Playfair Display', serif" }}>COBNB</span>
              <span className="text-white text-4xl md:text-5xl lg:text-6xl align-super">+</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 font-light tracking-[0.3em] uppercase">
              {isArabic ? "الفخامة في أبسط صورها" : "Luxury Living Simplified"}
            </p>
          </motion.div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentSlide ? "bg-teal-400 w-8" : "bg-white/30 hover:bg-white/50"}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Premium Amenities Partner — L'OCCITANE */}
      <section className="py-16 bg-[#0A0A0A] border-t border-white/5">
        <div className="container text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-white/40 mb-8">
            {isArabic ? "شريك وسائل الراحة الفاخرة" : "Premium Amenities Partner"}
          </p>
          <img
            src={LOCCITANE_LOGO}
            alt="L'OCCITANE EN PROVENCE"
            className="h-16 md:h-20 mx-auto object-contain brightness-0 invert opacity-80"
          />
        </div>
      </section>

      {/* What is CoBnB+? */}
      <section className="py-24 md:py-32 bg-[#0A0A0A]">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
                {isArabic ? (
                  <>ما هو كوبي إن بي<span className="text-teal-400">⁺</span> ؟</>
                ) : (
                  <>What is COBNB<span className="text-teal-400">⁺</span> ?</>
                )}
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent mx-auto mb-10" />
              <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-3xl mx-auto">
                {isArabic
                  ? "كوبي إن بي⁺ هي تجربة إقامة فاخرة تقدم منازل مفروشة بتصاميم راقية مع خدمات ضيافة متميزة ووسائل راحة مدروسة — مصممة للضيوف الذين يقدّرون الراحة والملاءمة والعيش الراقي."
                  : "COBNB⁺ is a premium stay experience offering designer-furnished homes with elevated hospitality services and thoughtful amenities — crafted for guests who value comfort, convenience, and refined living."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Makes CoBnB+ Different? */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-[#0A0A0A] to-[#0B1520]">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {isArabic ? (
                <>ما الذي يميز كوبي إن بي <span className="text-teal-400">+</span> ؟</>
              ) : (
                <>What Makes COBNB <span className="text-teal-400">+</span> Different?</>
              )}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-10 hover:border-teal-500/20 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500/15 to-teal-500/5 flex items-center justify-center mb-6 group-hover:from-teal-500/25 group-hover:to-teal-500/10 transition-all duration-500">
                  <f.icon className="h-7 w-7 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{isArabic ? f.titleAr : f.titleEn}</h3>
                <p className="text-white/40 leading-relaxed text-[15px]">{isArabic ? f.descAr : f.descEn}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Properties */}
      {properties.length > 0 && (
        <section className="py-24 md:py-32 bg-[#0B1520]">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-16"
            >
              {properties.map((property: any, i: number) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}
                >
                  {/* Property image */}
                  <div className="w-full md:w-1/2">
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden group">
                      <img
                        src={Array.isArray(property.images) && property.images[0] ? property.images[0] : ""}
                        alt={isArabic ? property.titleAr : property.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  </div>

                  {/* Property info */}
                  <div className="w-full md:w-1/2 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-teal-400 text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>COBNB</span>
                      <span className="text-white text-lg align-super font-bold">+</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      {isArabic ? property.titleAr : property.titleEn}
                    </h3>
                    <p className="text-white/40 leading-relaxed text-base">
                      {isArabic ? property.descriptionAr : property.descriptionEn}
                    </p>
                    <Link href={`/properties/${property.id}`}>
                      <span className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors text-sm font-medium cursor-pointer mt-4">
                        {isArabic ? "اعرف المزيد" : "Learn more"}
                        <ArrowRight className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
                      </span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* For Property Owners CTA */}
      <section className="py-24 md:py-32 bg-[#0A0A0A] border-t border-white/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Shield className="h-10 w-10 text-teal-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {isArabic ? "لأصحاب العقارات" : "For Property Owners"}
            </h2>
            <p className="text-lg text-white/40 mb-10 max-w-2xl mx-auto leading-relaxed">
              {isArabic
                ? "انضم لبرنامج كوبي إن بي+ وحوّل عقارك إلى مصدر دخل فاخر. نتولى كل شيء من التصميم والتأثيث إلى إدارة الضيوف والصيانة."
                : "Join the CoBnB+ program and transform your property into a premium income source. We handle everything from design and furnishing to guest management and maintenance."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/for-owners">
                <Button size="lg" className="bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-white px-8 text-base rounded-xl h-12 shadow-lg shadow-teal-500/20">
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
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
