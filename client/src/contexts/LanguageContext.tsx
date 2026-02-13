import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type Language = "ar" | "en";
type Direction = "rtl" | "ltr";

interface LanguageContextType {
  lang: Language;
  dir: Direction;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  isArabic: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<string, Record<Language, string>> = {
  // Navigation
  "nav.home": { ar: "الرئيسية", en: "Home" },
  "nav.about": { ar: "من نحن", en: "About Us" },
  "nav.services": { ar: "خدماتنا", en: "Services" },
  "nav.properties": { ar: "العقارات", en: "Properties" },
  "nav.cities": { ar: "المدن", en: "Cities" },
  "nav.blog": { ar: "المدونة", en: "Blog" },
  "nav.contact": { ar: "تواصل معنا", en: "Contact" },
  "nav.booking": { ar: "احجز إقامتك", en: "Book a Stay" },
  "nav.owners": { ar: "لملاك العقارات", en: "For Owners" },
  "nav.careers": { ar: "وظائف", en: "Careers" },
  "nav.login": { ar: "تسجيل الدخول", en: "Login" },
  "nav.register": { ar: "إنشاء حساب", en: "Register" },
  "nav.dashboard": { ar: "لوحة التحكم", en: "Dashboard" },
  "nav.admin": { ar: "الإدارة", en: "Admin" },
  "nav.app": { ar: "التطبيق", en: "CoBnB+ App" },

  // Hero
  "hero.title": { ar: "خبير الإيجار القصير — الآن في السعودية", en: "The BNB Expert — Now in Saudi Arabia" },
  "hero.subtitle": { ar: "إدارة إيجارات قصيرة المدى متميزة | الرياض • جدة • المدينة المنورة", en: "Premium Short-Term Rental Management | Riyadh • Jeddah • Madinah" },
  "hero.cta.list": { ar: "أدرج عقارك", en: "List Your Property" },
  "hero.cta.book": { ar: "احجز إقامتك", en: "Book a Stay" },

  // Stats
  "stats.years": { ar: "سنوات خبرة", en: "Years Experience" },
  "stats.properties": { ar: "عقار مُدار", en: "Properties Managed" },
  "stats.occupancy": { ar: "معدل إشغال", en: "Average Occupancy" },
  "stats.cities": { ar: "مدن سعودية", en: "Saudi Cities" },
  "stats.revenue": { ar: "هدف الإيرادات السنوية", en: "Annual Revenue Target" },

  // Services
  "services.title": { ar: "خدماتنا", en: "Our Services" },
  "services.str": { ar: "إدارة الإيجار القصير", en: "Short-Term Rental Management" },
  "services.revenue": { ar: "إدارة الإيرادات", en: "Revenue Management" },
  "services.care": { ar: "العناية بالعقار والتجديد", en: "Property Care & Renovation" },
  "services.guest": { ar: "تجربة الضيف", en: "Guest Experience" },
  "services.coliving": { ar: "السكن المشترك", en: "Co-Living" },
  "services.property": { ar: "إدارة العقارات", en: "Property Management" },

  // How it works
  "how.title": { ar: "كيف يعمل", en: "How It Works" },
  "how.step1.title": { ar: "تواصل معنا", en: "Contact Us" },
  "how.step1.desc": { ar: "تواصل معنا لترتيب زيارة ميدانية واجتماع", en: "Contact us to arrange a site visit & meeting" },
  "how.step2.title": { ar: "احصل على عرض سعر", en: "Get a Quote" },
  "how.step2.desc": { ar: "احصل على عرض سعر من متخصص الإيجار لدينا", en: "Get a quote from our rental specialist" },
  "how.step3.title": { ar: "سجّل وراقب العوائد", en: "Sign Up & Earn" },
  "how.step3.desc": { ar: "سجّل وراقب العوائد تتدفق", en: "Sign up & watch the yields come in" },

  // Revenue Model
  "revenue.title": { ar: "نموذج الإيرادات", en: "Revenue Model" },
  "revenue.owner": { ar: "لمالك العقار", en: "Property Owner" },
  "revenue.cobnb": { ar: "رسوم إدارة CoBnB", en: "CoBnB Management Fee" },
  "revenue.note": { ar: "جميع المصاريف التشغيلية محسوبة قبل توزيع الأرباح", en: "All operational expenses fully accounted before profit distribution" },

  // Cities
  "cities.riyadh": { ar: "الرياض", en: "Riyadh" },
  "cities.jeddah": { ar: "جدة", en: "Jeddah" },
  "cities.madinah": { ar: "المدينة المنورة", en: "Madinah" },
  "cities.title": { ar: "مدننا", en: "Our Cities" },
  "cities.neighborhoods": { ar: "أحياء", en: "Neighborhoods" },
  "cities.properties_count": { ar: "عقارات", en: "Properties" },

  // Properties
  "properties.title": { ar: "العقارات", en: "Properties" },
  "properties.search": { ar: "ابحث عن عقار", en: "Search Properties" },
  "properties.filter.city": { ar: "المدينة", en: "City" },
  "properties.filter.neighborhood": { ar: "الحي", en: "Neighborhood" },
  "properties.filter.bedrooms": { ar: "غرف النوم", en: "Bedrooms" },
  "properties.filter.price": { ar: "نطاق السعر", en: "Price Range" },
  "properties.per_night": { ar: "ر.س / ليلة", en: "SAR / night" },
  "properties.bedrooms": { ar: "غرف نوم", en: "Bedrooms" },
  "properties.bathrooms": { ar: "حمامات", en: "Bathrooms" },
  "properties.guests": { ar: "ضيوف", en: "Guests" },
  "properties.sqm": { ar: "م²", en: "sqm" },
  "properties.featured": { ar: "عقارات مميزة", en: "Featured Properties" },
  "properties.view_all": { ar: "عرض الكل", en: "View All" },
  "properties.book_now": { ar: "احجز الآن", en: "Book Now" },
  "properties.inquire": { ar: "استفسر الآن", en: "Inquire Now" },

  // Neighborhoods
  "neighborhood.stats.avg_rate": { ar: "متوسط سعر الليلة", en: "Avg. Nightly Rate" },
  "neighborhood.stats.properties": { ar: "عدد العقارات", en: "Property Count" },
  "neighborhood.stats.walk_time": { ar: "وقت المشي للمعلم", en: "Walk to Landmark" },
  "neighborhood.stats.zone": { ar: "المنطقة", en: "District Zone" },
  "neighborhood.about": { ar: "عن هذا الحي", en: "About This Neighborhood" },
  "neighborhood.landmarks": { ar: "المعالم الرئيسية", en: "Key Landmarks" },
  "neighborhood.pricing": { ar: "دليل الأسعار", en: "Pricing Guide" },
  "neighborhood.available": { ar: "العقارات المتاحة", en: "Available Properties" },
  "neighborhood.nearby": { ar: "أحياء مجاورة", en: "Nearby Neighborhoods" },
  "neighborhood.cta": { ar: "تملك عقار هنا؟ احصل على تقييم إيجار مجاني", en: "Own property here? Get a free rental forecast" },

  // About
  "about.title": { ar: "من نحن", en: "About Us" },
  "about.story": { ar: "قصتنا", en: "Our Story" },
  "about.vision": { ar: "رؤية 2030", en: "Vision 2030" },
  "about.values": { ar: "قيمنا", en: "Our Values" },
  "about.team": { ar: "فريقنا", en: "Our Team" },

  // Contact
  "contact.title": { ar: "تواصل معنا", en: "Contact Us" },
  "contact.name": { ar: "الاسم", en: "Name" },
  "contact.email": { ar: "البريد الإلكتروني", en: "Email" },
  "contact.phone": { ar: "رقم الهاتف", en: "Phone" },
  "contact.message": { ar: "الرسالة", en: "Message" },
  "contact.send": { ar: "إرسال", en: "Send Message" },
  "contact.city": { ar: "المدينة", en: "City" },
  "contact.property_type": { ar: "نوع العقار", en: "Property Type" },

  // Blog
  "blog.title": { ar: "المدونة", en: "Blog & Newsroom" },
  "blog.read_more": { ar: "اقرأ المزيد", en: "Read More" },
  "blog.categories.saudi_tourism": { ar: "السياحة السعودية ورؤية 2030", en: "Saudi Tourism & Vision 2030" },
  "blog.categories.property_investment": { ar: "الاستثمار العقاري", en: "Property Investment" },
  "blog.categories.travel_guides": { ar: "أدلة السفر", en: "Travel Guides" },
  "blog.categories.industry_news": { ar: "أخبار القطاع", en: "Industry News" },

  // Booking
  "booking.title": { ar: "احجز إقامتك", en: "Book a Stay" },
  "booking.check_in": { ar: "تاريخ الوصول", en: "Check-in" },
  "booking.check_out": { ar: "تاريخ المغادرة", en: "Check-out" },
  "booking.guests_count": { ar: "عدد الضيوف", en: "Guests" },

  // Owner
  "owner.title": { ar: "شاركنا", en: "Partner With Us" },
  "owner.calculator": { ar: "حاسبة الإيرادات", en: "Revenue Calculator" },
  "owner.cta": { ar: "احصل على تقييم إيجار مجاني", en: "Get Your Free Rental Forecast" },

  // Footer
  "footer.tagline": { ar: "خبير الإيجار القصير في السعودية", en: "The BNB Expert in Saudi Arabia" },
  "footer.quick_links": { ar: "روابط سريعة", en: "Quick Links" },
  "footer.services": { ar: "خدماتنا", en: "Our Services" },
  "footer.contact_info": { ar: "معلومات التواصل", en: "Contact Info" },
  "footer.privacy": { ar: "سياسة الخصوصية", en: "Privacy Policy" },
  "footer.terms": { ar: "الشروط والأحكام", en: "Terms & Conditions" },
  "footer.rights": { ar: "جميع الحقوق محفوظة", en: "All Rights Reserved" },

  // Common
  "common.loading": { ar: "جاري التحميل...", en: "Loading..." },
  "common.error": { ar: "حدث خطأ", en: "An error occurred" },
  "common.save": { ar: "حفظ", en: "Save" },
  "common.cancel": { ar: "إلغاء", en: "Cancel" },
  "common.delete": { ar: "حذف", en: "Delete" },
  "common.edit": { ar: "تعديل", en: "Edit" },
  "common.add": { ar: "إضافة", en: "Add" },
  "common.search": { ar: "بحث", en: "Search" },
  "common.all": { ar: "الكل", en: "All" },
  "common.sar": { ar: "ر.س", en: "SAR" },
  "common.view_details": { ar: "عرض التفاصيل", en: "View Details" },
  "common.back": { ar: "رجوع", en: "Back" },
  "common.next": { ar: "التالي", en: "Next" },
  "common.previous": { ar: "السابق", en: "Previous" },
  "common.submit": { ar: "إرسال", en: "Submit" },
  "common.success": { ar: "تم بنجاح", en: "Success" },

  // Account
  "account.my_bookings": { ar: "حجوزاتي", en: "My Bookings" },
  "account.my_favorites": { ar: "المفضلة", en: "My Favorites" },
  "account.my_reviews": { ar: "تقييماتي", en: "My Reviews" },
  "account.my_properties": { ar: "عقاراتي", en: "My Properties" },
  "account.profile": { ar: "الملف الشخصي", en: "Profile" },
  "account.logout": { ar: "تسجيل الخروج", en: "Logout" },
  "account.settings": { ar: "الإعدادات", en: "Settings" },

  // Pricing
  "pricing.starting_from": { ar: "ابتداءً من", en: "Starting from" },
  "pricing.per_night": { ar: "/ الليلة", en: "/ night" },
  "pricing.peak": { ar: "موسم الذروة", en: "Peak Season" },
  "pricing.high": { ar: "موسم مرتفع", en: "High Season" },
  "pricing.low": { ar: "موسم منخفض", en: "Low Season" },
  "pricing.contact": { ar: "تواصل للأسعار", en: "Contact for pricing" },

  // Amenities
  "amenity.WiFi": { ar: "واي فاي", en: "WiFi" },
  "amenity.Parking": { ar: "موقف سيارات", en: "Parking" },
  "amenity.Pool": { ar: "مسبح", en: "Pool" },
  "amenity.Gym": { ar: "صالة رياضية", en: "Gym" },
  "amenity.Kitchen": { ar: "مطبخ", en: "Kitchen" },
  "amenity.Washer": { ar: "غسالة", en: "Washer" },
  "amenity.Dryer": { ar: "مجفف", en: "Dryer" },
  "amenity.AC": { ar: "مكيف", en: "AC" },
  "amenity.TV": { ar: "تلفاز", en: "TV" },
  "amenity.Workspace": { ar: "مساحة عمل", en: "Workspace" },
  "amenity.Balcony": { ar: "شرفة", en: "Balcony" },
  "amenity.Elevator": { ar: "مصعد", en: "Elevator" },
  "amenity.Security": { ar: "أمن", en: "Security" },
  "amenity.Garden": { ar: "حديقة", en: "Garden" },
  "amenity.BBQ Area": { ar: "منطقة شواء", en: "BBQ Area" },
  "amenity.Kids Play Area": { ar: "منطقة ألعاب أطفال", en: "Kids Play Area" },
  "amenity.Maid Room": { ar: "غرفة خادمة", en: "Maid Room" },
  "amenity.Storage": { ar: "مخزن", en: "Storage" },
  "amenity.Smart Home": { ar: "منزل ذكي", en: "Smart Home" },
  "amenity.Concierge": { ar: "خدمة الكونسيرج", en: "Concierge" },
  "amenity.Room Service": { ar: "خدمة الغرف", en: "Room Service" },
  "amenity.Spa": { ar: "سبا", en: "Spa" },
  "amenity.Sauna": { ar: "ساونا", en: "Sauna" },
  "amenity.Jacuzzi": { ar: "جاكوزي", en: "Jacuzzi" },
  "amenity.Iron": { ar: "مكواة", en: "Iron" },
  "amenity.CCTV": { ar: "كاميرات مراقبة", en: "CCTV" },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("cobnb-lang") as Language) || "ar";
    }
    return "ar";
  });

  const dir: Direction = lang === "ar" ? "rtl" : "ltr";

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("cobnb-lang", newLang);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.body.style.fontFamily = lang === "ar"
      ? "'Cairo', 'Tajawal', 'Noto Sans Arabic', sans-serif"
      : "'Inter', 'DM Sans', system-ui, sans-serif";
  }, [lang, dir]);

  const t = useCallback((key: string): string => {
    return translations[key]?.[lang] || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, dir, setLang, t, isArabic: lang === "ar" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
