import SEO from "@/components/SEO";
import { useState } from "react";
import { Link, useParams } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClientAuth } from "@/hooks/useClientAuth";
import PageLayout from "@/components/PageLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bed, Bath, Users, Maximize, MapPin, Star, Heart, Share2, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, isArabic, lang } = useLanguage();
  const { isAuthenticated } = useClientAuth();
  const [currentImage, setCurrentImage] = useState(0);
  const Arrow = isArabic ? ArrowRight : ArrowLeft;

  const { data: property, isLoading } = trpc.properties.getById.useQuery({ id: Number(id) });
  const addFav = trpc.account.addFavorite.useMutation({
    onSuccess: () => toast.success(isArabic ? "تمت الإضافة للمفضلة" : "Added to favorites"),
  });

  if (isLoading) {
    return (
      <PageLayout>
        <div className="py-20 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-[#3ECFC0] border-t-transparent rounded-full mx-auto" />
        </div>
      </PageLayout>
    );
  }

  if (!property) {
    return (
      <PageLayout>
        <div className="py-20 text-center">
          <p className="text-muted-foreground">{isArabic ? "العقار غير موجود" : "Property not found"}</p>
          <Link href="/properties"><Button className="mt-4">{t("common.back")}</Button></Link>
        </div>
      </PageLayout>
    );
  }

  const imgs = (property.images as string[] | null) || [];
  const amenities = (property.amenities as string[] | null) || [];

  return (
    <PageLayout>
      <SEO title={isArabic ? property.titleAr : property.titleEn} description={(isArabic ? property.descriptionAr : property.descriptionEn)?.slice(0, 160) || ""} url={"/property/" + property.id} />
      {/* Gallery */}
      <section className="bg-black">
        <div className="relative max-w-6xl mx-auto">
          <div className="aspect-[16/9] md:aspect-[2/1] relative overflow-hidden">
            {imgs.length > 0 ? (
              <img src={imgs[currentImage]} alt={String(lang === "ar" ? property.titleAr : property.titleEn)} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#0B1E2D] to-[#1a3a4f] flex items-center justify-center">
                <Maximize className="h-16 w-16 text-white/20" />
              </div>
            )}
            {imgs.length > 1 && (
              <>
                <button onClick={() => setCurrentImage((prev) => (prev - 1 + imgs.length) % imgs.length)} className="absolute start-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={() => setCurrentImage((prev) => (prev + 1) % imgs.length)} className="absolute end-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {imgs.map((_, i) => (
                    <button key={i} onClick={() => setCurrentImage(i)} className={`w-2 h-2 rounded-full transition-colors ${i === currentImage ? "bg-white" : "bg-white/40"}`} />
                  ))}
                </div>
              </>
            )}
          </div>
          {/* Thumbnails */}
          {imgs.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto">
              {imgs.map((img, i) => (
                <button key={i} onClick={() => setCurrentImage(i)} className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${i === currentImage ? "border-[#3ECFC0]" : "border-transparent"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Details */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Link href="/properties" className="text-sm text-[#3ECFC0] hover:underline flex items-center gap-1 mb-2">
                    <Arrow className="h-4 w-4" /> {t("properties.title")}
                  </Link>
                  <h1 className="text-3xl font-bold text-[#0B1E2D]">{lang === "ar" ? property.titleAr : property.titleEn}</h1>
                </div>
                <div className="flex gap-2">
                  {isAuthenticated && (
                    <button onClick={() => addFav.mutate({ propertyId: property.id })} className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-red-50 transition-colors">
                      <Heart className="h-5 w-5 text-red-400" />
                    </button>
                  )}
                  <button className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Share2 className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 py-4 border-y mb-6">
                <div className="flex items-center gap-2"><Bed className="h-5 w-5 text-[#3ECFC0]" /><span>{String(property.bedrooms ?? 0)} {t("properties.bedrooms")}</span></div>
                <div className="flex items-center gap-2"><Bath className="h-5 w-5 text-[#3ECFC0]" /><span>{String(property.bathrooms ?? 0)} {t("properties.bathrooms")}</span></div>
                <div className="flex items-center gap-2"><Users className="h-5 w-5 text-[#3ECFC0]" /><span>{String(property.maxGuests ?? 0)} {t("properties.guests")}</span></div>
                {property.sizeSqm && <div className="flex items-center gap-2"><Maximize className="h-5 w-5 text-[#3ECFC0]" /><span>{property.sizeSqm} {t("properties.sqm")}</span></div>}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[#0B1E2D] mb-3">{isArabic ? "عن هذا العقار" : "About This Property"}</h2>
                <p className="text-muted-foreground leading-relaxed">{String(lang === "ar" ? property.descriptionAr || "" : property.descriptionEn || "")}</p>
              </div>

              {/* Amenities */}
              {amenities.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-[#0B1E2D] mb-3">{isArabic ? "المرافق والخدمات" : "Amenities"}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {amenities.map((amenity, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-[#3ECFC0] shrink-0" />
                        <span>{String(amenity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Booking Sidebar */}
            <div>
              <Card className="sticky top-24 border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-[#0B1E2D] mb-4">{isArabic ? "الأسعار" : "Pricing"}</h3>
                  <div className="space-y-3 mb-6">
                    {property.pricePeak && (
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-muted-foreground">{t("pricing.peak")}</span>
                        <span className="font-semibold">{t("common.sar")} {property.pricePeak}</span>
                      </div>
                    )}
                    {property.priceHigh && (
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-muted-foreground">{t("pricing.high")}</span>
                        <span className="font-semibold">{t("common.sar")} {property.priceHigh}</span>
                      </div>
                    )}
                    {property.priceLow && (
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-muted-foreground">{t("pricing.low")}</span>
                        <span className="font-semibold">{t("common.sar")} {property.priceLow}</span>
                      </div>
                    )}
                  </div>
                  <Link href={`/booking?property=${property.id}`}>
                    <Button className="w-full bg-[#3ECFC0] text-[#0B1E2D] hover:bg-[#B8F0E8] font-semibold py-6">
                      {t("properties.book_now")}
                    </Button>
                  </Link>
                  <Link href={`/contact?property=${property.id}`}>
                    <Button variant="outline" className="w-full mt-3 border-[#3ECFC0] text-[#3ECFC0] hover:bg-[#3ECFC0]/10">
                      {t("properties.inquire")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
