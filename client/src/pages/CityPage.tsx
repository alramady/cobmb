import { Link, useParams } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import PageLayout from "@/components/PageLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, ArrowRight, ArrowLeft } from "lucide-react";

export default function CityPage() {
  const { citySlug } = useParams<{ citySlug: string }>();
  const { t, isArabic, lang } = useLanguage();
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  const { data: city, isLoading } = trpc.cities.getBySlug.useQuery({ slug: citySlug || "" });
  const { data: neighborhoods } = trpc.neighborhoods.byCity.useQuery(
    { cityId: city?.id || 0 },
    { enabled: !!city?.id }
  );

  if (isLoading) {
    return <PageLayout><div className="py-20 text-center"><div className="animate-spin h-8 w-8 border-2 border-[#3ECFC0] border-t-transparent rounded-full mx-auto" /></div></PageLayout>;
  }

  if (!city) {
    return <PageLayout><div className="py-20 text-center"><p className="text-muted-foreground">{isArabic ? "المدينة غير موجودة" : "City not found"}</p></div></PageLayout>;
  }

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative py-24 bg-[#0B1E2D] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#3ECFC0] rounded-full blur-[150px]" />
        </div>
        {city.heroImage && <div className="absolute inset-0"><img src={city.heroImage} alt="" className="w-full h-full object-cover opacity-30" /></div>}
        <div className="container relative z-10">
          <Link href="/" className="text-sm text-[#3ECFC0] hover:underline mb-4 inline-block">{t("nav.home")}</Link>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{lang === "ar" ? city.nameAr : city.nameEn}</h1>
          <p className="text-xl text-white/70 max-w-2xl">{String(lang === "ar" ? city.descriptionAr || "" : city.descriptionEn || "")}</p>
          <div className="mt-6 flex gap-4">
            <div className="px-4 py-2 bg-white/10 rounded-lg">
              <span className="text-2xl font-bold text-[#3ECFC0]">{neighborhoods?.length || 0}</span>
              <span className="text-white/60 text-sm ms-2">{t("cities.neighborhoods")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Neighborhoods Grid */}
      <section className="py-16 bg-[#F5F7FA]">
        <div className="container">
          <h2 className="text-3xl font-bold text-[#0B1E2D] mb-8">
            {isArabic ? `أحياء ${city.nameAr}` : `${city.nameEn} Neighborhoods`}
          </h2>
          {neighborhoods && neighborhoods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {neighborhoods.map((nh) => (
                <Link key={nh.id} href={`/cities/${citySlug}/${nh.slug}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white cursor-pointer">
                    <div className="aspect-[16/10] bg-gradient-to-br from-[#0B1E2D] to-[#1a3a4f] relative overflow-hidden">
                      {nh.heroImage && <img src={nh.heroImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 start-4">
                        <h3 className="text-xl font-bold text-white">{lang === "ar" ? nh.nameAr : nh.nameEn}</h3>
                        {nh.zone && <span className="text-xs text-white/70">{String(nh.zone)}</span>}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> {lang === "ar" ? nh.nameAr : nh.nameEn}
                        </span>
                        {nh.avgNightlyRate && (
                          <span className="text-[#3ECFC0] font-semibold">{t("common.sar")} {nh.avgNightlyRate}/{isArabic ? "ليلة" : "night"}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">{isArabic ? "لا توجد أحياء بعد" : "No neighborhoods yet"}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0B1E2D]">
        <div className="container text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            {isArabic ? `تملك عقار في ${city.nameAr}؟` : `Own property in ${city.nameEn}?`}
          </h2>
          <p className="text-white/60 mb-6">{isArabic ? "احصل على تقييم إيجار مجاني اليوم" : "Get a free rental forecast today"}</p>
          <Link href="/contact">
            <Button className="bg-[#3ECFC0] text-[#0B1E2D] hover:bg-[#B8F0E8] font-semibold px-8 py-6 rounded-xl">
              {t("owner.cta")} <Arrow className="h-5 w-5 ms-2" />
            </Button>
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
