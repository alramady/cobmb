import SEO from "@/components/SEO";
import { Link, useParams } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import PageLayout from "@/components/PageLayout";
import { trpc } from "@/lib/trpc";
import { MapView } from "@/components/Map";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Star, ArrowRight, ArrowLeft, Bed, Bath, Users, Clock, DollarSign, Navigation } from "lucide-react";

export default function NeighborhoodPage() {
  const { citySlug, neighborhoodSlug } = useParams<{ citySlug: string; neighborhoodSlug: string }>();
  const { t, isArabic, lang } = useLanguage();
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  const { data: nhData, isLoading } = trpc.neighborhoods.getBySlug.useQuery({
    citySlug: citySlug || "",
    slug: neighborhoodSlug || "",
  });

  const { data: properties } = trpc.properties.list.useQuery(
    { neighborhoodId: nhData?.id },
    { enabled: !!nhData?.id }
  );

  if (isLoading) {
    return <PageLayout><div className="py-20 text-center"><div className="animate-spin h-8 w-8 border-2 border-[#3ECFC0] border-t-transparent rounded-full mx-auto" /></div></PageLayout>;
  }

  if (!nhData) {
    return <PageLayout><div className="py-20 text-center"><p className="text-muted-foreground">{isArabic ? "الحي غير موجود" : "Neighborhood not found"}</p></div></PageLayout>;
  }

  const landmarks = (nhData.landmarks as Array<{ name: string; nameAr?: string }> | null) || [];
  const city = nhData.city;
  const lat = nhData.latitude ? parseFloat(nhData.latitude) : 24.7136;
  const lng = nhData.longitude ? parseFloat(nhData.longitude) : 46.6753;

  return (
    <PageLayout>
      <SEO title={isArabic ? nhData.nameAr : nhData.nameEn} description={(isArabic ? nhData.descriptionAr : nhData.descriptionEn)?.slice(0, 160) || ""} url={"/neighborhood/" + nhData.slug} />
      {/* Hero */}
      <section className="relative py-24 bg-[#0B1E2D] overflow-hidden min-h-[320px]">
        {nhData.heroImage && <div className="absolute inset-0"><img src={nhData.heroImage} alt="" className="w-full h-full object-cover opacity-60" /></div>}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E2D] via-[#0B1E2D]/50 to-[#0B1E2D]/30" />
        <div className="container relative z-10">
          <div className="flex items-center gap-2 text-sm text-[#3ECFC0] mb-4">
            <Link href="/" className="hover:underline">{t("nav.home")}</Link>
            <span>/</span>
            <Link href={`/cities/${citySlug}`} className="hover:underline">{lang === "ar" ? city.nameAr : city.nameEn}</Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{lang === "ar" ? nhData.nameAr : nhData.nameEn}</h1>
          <p className="text-white/70 max-w-2xl">{String(lang === "ar" ? nhData.descriptionAr || "" : nhData.descriptionEn || "")}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-white border-b">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {nhData.avgNightlyRate && (
              <div className="text-center">
                <DollarSign className="h-6 w-6 text-[#3ECFC0] mx-auto mb-2" />
                <div className="text-xl font-bold text-[#0B1E2D]">{t("common.sar")} {nhData.avgNightlyRate}</div>
                <div className="text-xs text-muted-foreground">{t("neighborhood.stats.avg_rate")}</div>
              </div>
            )}
            <div className="text-center">
              <Building2 className="h-6 w-6 text-[#3ECFC0] mx-auto mb-2" />
              <div className="text-xl font-bold text-[#0B1E2D]">{properties?.length || 0}</div>
              <div className="text-xs text-muted-foreground">{t("neighborhood.stats.properties")}</div>
            </div>
            {nhData.walkTimeToLandmark && (
              <div className="text-center">
                <Clock className="h-6 w-6 text-[#3ECFC0] mx-auto mb-2" />
                <div className="text-xl font-bold text-[#0B1E2D]">{nhData.walkTimeToLandmark}</div>
                <div className="text-xs text-muted-foreground">{t("neighborhood.stats.walk_time")}</div>
              </div>
            )}
            {nhData.zone && (
              <div className="text-center">
                <Navigation className="h-6 w-6 text-[#3ECFC0] mx-auto mb-2" />
                <div className="text-xl font-bold text-[#0B1E2D]">{String(nhData.zone)}</div>
                <div className="text-xs text-muted-foreground">{t("neighborhood.stats.zone")}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About + Map */}
      <section className="py-16 bg-[#F5F7FA]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* About */}
            <div>
              <h2 className="text-2xl font-bold text-[#0B1E2D] mb-4">{t("neighborhood.about")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{String(lang === "ar" ? nhData.profileAr || nhData.descriptionAr || "" : nhData.profileEn || nhData.descriptionEn || "")}</p>

              {/* Landmarks */}
              {landmarks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#0B1E2D] mb-3">{t("neighborhood.landmarks")}</h3>
                  <ul className="space-y-2">
                    {landmarks.map((lm, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-[#C9A96E] shrink-0" />
                        <span>{isArabic && lm.nameAr ? lm.nameAr : lm.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pricing Guide */}
              {(nhData.avgAdrPeak || nhData.avgAdrHigh || nhData.avgAdrLow) && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-[#0B1E2D] mb-3">{t("neighborhood.pricing")}</h3>
                  <div className="space-y-2">
                    {nhData.avgAdrPeak && (
                      <div className="flex justify-between py-2 border-b"><span className="text-sm text-muted-foreground">{t("pricing.peak")}</span><span className="font-semibold">{t("common.sar")} {nhData.avgAdrPeak}</span></div>
                    )}
                    {nhData.avgAdrHigh && (
                      <div className="flex justify-between py-2 border-b"><span className="text-sm text-muted-foreground">{t("pricing.high")}</span><span className="font-semibold">{t("common.sar")} {nhData.avgAdrHigh}</span></div>
                    )}
                    {nhData.avgAdrLow && (
                      <div className="flex justify-between py-2 border-b"><span className="text-sm text-muted-foreground">{t("pricing.low")}</span><span className="font-semibold">{t("common.sar")} {nhData.avgAdrLow}</span></div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <MapView
                initialCenter={{ lat, lng }}
                initialZoom={14}
                onMapReady={(map) => {
                  new google.maps.marker.AdvancedMarkerElement({
                    position: { lat, lng },
                    map,
                    title: lang === "ar" ? nhData.nameAr : nhData.nameEn,
                  });
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Properties in Neighborhood */}
      {properties && properties.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container">
            <h2 className="text-2xl font-bold text-[#0B1E2D] mb-8">{t("neighborhood.available")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => {
                const imgs = property.images as string[] | null;
                return (
                  <Link key={property.id} href={`/properties/${property.id}`}>
                    <Card className="group overflow-hidden hover:shadow-lg transition-all border-0">
                      <div className="aspect-[4/3] bg-gradient-to-br from-[#0B1E2D] to-[#1a3a4f] relative overflow-hidden">
                        {imgs && imgs[0] && <img src={imgs[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-[#0B1E2D] mb-2 line-clamp-1">{lang === "ar" ? property.titleAr : property.titleEn}</h3>
                        <div className="flex gap-3 text-xs text-muted-foreground mb-2">
                          <span className="flex items-center gap-1"><Bed className="h-3 w-3" /> {String(property.bedrooms ?? 0)}</span>
                          <span className="flex items-center gap-1"><Bath className="h-3 w-3" /> {String(property.bathrooms ?? 0)}</span>
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {String(property.maxGuests ?? 0)}</span>
                        </div>
                        <span className="text-lg font-bold text-[#3ECFC0]">{t("common.sar")} {String(property.priceNightly || property.priceLow || 0)}</span>
                        <span className="text-xs text-muted-foreground ms-1">{t("pricing.per_night")}</span>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-[#3ECFC0] to-[#2ab5a6]">
        <div className="container text-center">
          <h2 className="text-2xl font-bold text-[#0B1E2D] mb-4">{t("neighborhood.cta")}</h2>
          <Link href="/contact">
            <Button size="lg" className="bg-[#0B1E2D] text-white hover:bg-[#0B1E2D]/90 font-semibold px-8 py-6 rounded-xl">
              {t("owner.cta")} <Arrow className="h-5 w-5 ms-2" />
            </Button>
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
