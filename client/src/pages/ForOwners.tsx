import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calculator, TrendingUp, Shield, CheckCircle, ArrowRight, ArrowLeft, DollarSign, PieChart, BarChart3 } from "lucide-react";

export default function ForOwners() {
  const { t, isArabic, lang } = useLanguage();
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  const { data: cities } = trpc.cities.list.useQuery();
  const { data: neighborhoods } = trpc.neighborhoods.all.useQuery();

  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("");
  const [bedrooms, setBedrooms] = useState(2);
  const [occupancyRate, setOccupancyRate] = useState([70]);

  const filteredNeighborhoods = useMemo(() => {
    if (!neighborhoods || !selectedCity) return [];
    return neighborhoods.filter((n) => String(n.cityId) === selectedCity);
  }, [neighborhoods, selectedCity]);

  const selectedNh = useMemo(() => {
    if (!selectedNeighborhood || !neighborhoods) return null;
    return neighborhoods.find((n) => String(n.id) === selectedNeighborhood) || null;
  }, [neighborhoods, selectedNeighborhood]);

  const revenue = useMemo(() => {
    const baseRate = selectedNh?.avgNightlyRate ? parseFloat(selectedNh.avgNightlyRate) : 500;
    const bedroomMultiplier = 1 + (bedrooms - 1) * 0.35;
    const nightlyRate = baseRate * bedroomMultiplier;
    const occupancy = occupancyRate[0] / 100;
    const daysPerMonth = 30;
    const monthlyGross = nightlyRate * daysPerMonth * occupancy;
    const ownerShare = monthlyGross * 0.70;
    const cobnbShare = monthlyGross * 0.30;
    const yearlyGross = monthlyGross * 12;
    const yearlyOwner = ownerShare * 12;
    return { nightlyRate: Math.round(nightlyRate), monthlyGross: Math.round(monthlyGross), ownerShare: Math.round(ownerShare), cobnbShare: Math.round(cobnbShare), yearlyGross: Math.round(yearlyGross), yearlyOwner: Math.round(yearlyOwner) };
  }, [selectedNh, bedrooms, occupancyRate]);

  const benefits = [
    { icon: TrendingUp, titleAr: "زيادة الإيرادات بنسبة 30-50%", titleEn: "Increase Revenue by 30-50%", descAr: "تسعير ديناميكي يعتمد على البيانات لتحقيق أقصى عائد", descEn: "Data-driven dynamic pricing to maximize returns" },
    { icon: Shield, titleAr: "حماية كاملة للعقار", titleEn: "Complete Property Protection", descAr: "تأمين شامل وفحص دقيق للضيوف", descEn: "Comprehensive insurance and thorough guest screening" },
    { icon: PieChart, titleAr: "نموذج 70/30 شفاف", titleEn: "Transparent 70/30 Model", descAr: "70% لك كمالك و30% لنا مقابل الإدارة الشاملة", descEn: "70% for you as owner and 30% for our comprehensive management" },
    { icon: BarChart3, titleAr: "تقارير أداء مفصلة", titleEn: "Detailed Performance Reports", descAr: "تقارير شهرية شفافة عن الإيرادات والإشغال", descEn: "Monthly transparent reports on revenue and occupancy" },
  ];

  return (
    <PageLayout>
      <SEO title={isArabic ? "لملاك العقارات" : "For Property Owners"} description={isArabic ? "حقق أقصى عائد من عقارك مع خبراء الإيجار القصير" : "Maximize your property revenue with short-term rental experts"} url="/owners" />
      <section className="relative py-24 bg-[#0B1E2D] overflow-hidden">
        <div className="absolute inset-0 opacity-20"><div className="absolute top-20 left-20 w-96 h-96 bg-[#C9A96E] rounded-full blur-[150px]" /></div>
        <div className="container relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{t("owner.title")}</h1>
          <p className="text-xl text-white/70 max-w-2xl">{isArabic ? "حقق أقصى عائد من عقارك مع خبراء الإيجار القصير" : "Maximize your property's revenue with short-term rental experts"}</p>
        </div>
      </section>

      {/* Revenue Calculator */}
      <section className="py-20 bg-white" id="calculator">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3ECFC0]/10 border border-[#3ECFC0]/20 mb-4">
              <Calculator className="h-4 w-4 text-[#3ECFC0]" />
              <span className="text-[#3ECFC0] text-sm font-medium">{t("calculator.title")}</span>
            </div>
            <h2 className="text-3xl font-bold text-[#0B1E2D]">{t("calculator.subtitle")}</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Inputs */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 space-y-6">
                <div>
                  <label className="text-sm font-medium text-[#0B1E2D] mb-2 block">{isArabic ? "المدينة" : "City"}</label>
                  <Select value={selectedCity} onValueChange={(v) => { setSelectedCity(v); setSelectedNeighborhood(""); }}>
                    <SelectTrigger><SelectValue placeholder={isArabic ? "اختر المدينة" : "Select city"} /></SelectTrigger>
                    <SelectContent>
                      {cities?.map((c) => <SelectItem key={c.id} value={String(c.id)}>{lang === "ar" ? c.nameAr : c.nameEn}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#0B1E2D] mb-2 block">{isArabic ? "الحي" : "Neighborhood"}</label>
                  <Select value={selectedNeighborhood} onValueChange={setSelectedNeighborhood} disabled={!selectedCity}>
                    <SelectTrigger><SelectValue placeholder={isArabic ? "اختر الحي" : "Select neighborhood"} /></SelectTrigger>
                    <SelectContent>
                      {filteredNeighborhoods.map((n) => <SelectItem key={n.id} value={String(n.id)}>{lang === "ar" ? n.nameAr : n.nameEn}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#0B1E2D] mb-2 block">{isArabic ? "عدد غرف النوم" : "Bedrooms"}: {bedrooms}</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} onClick={() => setBedrooms(n)} className={`w-12 h-12 rounded-lg font-semibold transition-colors ${bedrooms === n ? "bg-[#3ECFC0] text-[#0B1E2D]" : "bg-gray-100 text-muted-foreground hover:bg-gray-200"}`}>{n}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#0B1E2D] mb-2 block">{isArabic ? "معدل الإشغال المتوقع" : "Expected Occupancy Rate"}: {occupancyRate[0]}%</label>
                  <Slider value={occupancyRate} onValueChange={setOccupancyRate} min={30} max={95} step={5} className="mt-3" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>30%</span><span>95%</span></div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-[#0B1E2D] to-[#1a3a4f] text-white">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6">{t("calculator.results")}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-white/70">{isArabic ? "سعر الليلة المتوقع" : "Expected Nightly Rate"}</span>
                    <span className="text-xl font-bold text-[#3ECFC0]">{t("common.sar")} {revenue.nightlyRate}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-white/70">{isArabic ? "الإيراد الشهري الإجمالي" : "Monthly Gross Revenue"}</span>
                    <span className="text-xl font-bold">{t("common.sar")} {revenue.monthlyGross.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-white/70">{isArabic ? "حصتك (70%)" : "Your Share (70%)"}</span>
                    <span className="text-2xl font-bold text-[#C9A96E]">{t("common.sar")} {revenue.ownerShare.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-white/70">{isArabic ? "رسوم الإدارة (30%)" : "Management Fee (30%)"}</span>
                    <span className="font-semibold">{t("common.sar")} {revenue.cobnbShare.toLocaleString()}</span>
                  </div>
                  <div className="mt-6 p-4 bg-[#3ECFC0]/10 rounded-xl">
                    <div className="text-center">
                      <span className="text-sm text-[#3ECFC0]">{isArabic ? "العائد السنوي المتوقع" : "Expected Annual Return"}</span>
                      <div className="text-3xl font-bold text-[#3ECFC0] mt-1">{t("common.sar")} {revenue.yearlyOwner.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <Link href="/contact">
                  <Button className="w-full mt-6 bg-[#3ECFC0] text-[#0B1E2D] hover:bg-[#B8F0E8] font-semibold py-6">
                    {t("owner.cta")} <Arrow className="h-5 w-5 ms-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-[#F5F7FA]">
        <div className="container">
          <h2 className="text-3xl font-bold text-[#0B1E2D] text-center mb-12">{isArabic ? "لماذا CoBnB؟" : "Why CoBnB?"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#3ECFC0]/10 flex items-center justify-center shrink-0">
                    <b.icon className="h-6 w-6 text-[#3ECFC0]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#0B1E2D] mb-2">{isArabic ? b.titleAr : b.titleEn}</h3>
                    <p className="text-sm text-muted-foreground">{isArabic ? b.descAr : b.descEn}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-[#0B1E2D] text-center mb-12">{t("how.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", ar: "تواصل معنا", en: "Contact Us", descAr: "أرسل لنا تفاصيل عقارك", descEn: "Send us your property details" },
              { step: "02", ar: "تقييم العقار", en: "Property Assessment", descAr: "نقيم عقارك ونحدد العائد المتوقع", descEn: "We assess your property and estimate returns" },
              { step: "03", ar: "التجهيز والإدراج", en: "Setup & Listing", descAr: "نجهز عقارك وندرجه على المنصات", descEn: "We prepare and list your property" },
              { step: "04", ar: "استلم أرباحك", en: "Earn Revenue", descAr: "استلم 70% من الإيرادات شهرياً", descEn: "Receive 70% of revenue monthly" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#3ECFC0]/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#3ECFC0]">{s.step}</span>
                </div>
                <h3 className="font-semibold text-[#0B1E2D] mb-2">{isArabic ? s.ar : s.en}</h3>
                <p className="text-sm text-muted-foreground">{isArabic ? s.descAr : s.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
