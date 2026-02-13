import SEO from "@/components/SEO";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import PageLayout from "@/components/PageLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Bed, Bath, Users, MapPin, Search, SlidersHorizontal, Heart } from "lucide-react";

export default function Properties() {
  const { t, isArabic, lang } = useLanguage();
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [bedroomFilter, setBedroomFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: properties, isLoading } = trpc.properties.list.useQuery({});
  const { data: citiesData } = trpc.cities.list.useQuery();

  const filtered = useMemo(() => {
    if (!properties) return [];
    return properties.filter((p) => {
      if (cityFilter !== "all" && String(p.cityId) !== cityFilter) return false;
      if (bedroomFilter !== "all" && String(p.bedrooms) !== bedroomFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const title = (lang === "ar" ? p.titleAr : p.titleEn).toLowerCase();
        if (!title.includes(q)) return false;
      }
      return true;
    });
  }, [properties, cityFilter, bedroomFilter, searchQuery, lang]);

  return (
    <PageLayout>
      <SEO title={isArabic ? "العقارات" : "Properties"} description={isArabic ? "تصفح الشقق الفندقية والإيجارات قصيرة المدى في المملكة العربية السعودية." : "Browse premium serviced apartments and short-term rentals across Saudi Arabia."} url="/properties" />
      {/* Hero */}
      <section className="py-16 bg-[#0B1E2D]">
        <div className="container">
          <h1 className="text-4xl font-bold text-white mb-4">{t("properties.title")}</h1>
          <p className="text-white/70">{isArabic ? "اكتشف أفضل العقارات للإيجار القصير في السعودية" : "Discover the best short-term rental properties in Saudi Arabia"}</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b sticky top-16 md:top-20 z-30">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("properties.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-10"
              />
            </div>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t("properties.filter.city")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                {citiesData?.map((city) => (
                  <SelectItem key={city.id} value={String(city.id)}>
                    {lang === "ar" ? city.nameAr : city.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={bedroomFilter} onValueChange={setBedroomFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t("properties.filter.bedrooms")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                {[1, 2, 3, 4, 5].map((n) => (
                  <SelectItem key={n} value={String(n)}>{n} {t("properties.bedrooms")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 bg-[#F5F7FA]">
        <div className="container">
          <p className="text-sm text-muted-foreground mb-6">
            {filtered.length} {isArabic ? "عقار" : "properties"}
          </p>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="border-0 animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200 rounded-t-lg" />
                  <CardContent className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">{isArabic ? "لا توجد عقارات مطابقة" : "No matching properties found"}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((property) => {
                const imgs = property.images as string[] | null;
                return (
                  <Link key={property.id} href={`/properties/${property.id}`}>
                    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white">
                      <div className="aspect-[4/3] bg-gradient-to-br from-[#0B1E2D] to-[#1a3a4f] relative overflow-hidden">
                        {imgs && imgs[0] && (
                          <img src={imgs[0]} alt={String(lang === "ar" ? property.titleAr : property.titleEn)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        )}
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
                            <span className="text-xl font-bold text-[#3ECFC0]">{t("common.sar")} {String(property.priceLow || 0)}</span>
                            <span className="text-xs text-muted-foreground ms-1">/ {isArabic ? "ليلة" : "night"}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
