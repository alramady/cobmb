import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClientAuth } from "@/hooks/useClientAuth";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CheckCircle, LogIn } from "lucide-react";
import { toast } from "sonner";


export default function Booking() {
  const { t, isArabic } = useLanguage();
  const { isAuthenticated, client } = useClientAuth();
  const params = new URLSearchParams(window.location.search);
  const propertyId = params.get("property");

  const [form, setForm] = useState({ checkIn: "", checkOut: "", guests: 1, notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const { data: property } = trpc.properties.getById.useQuery(
    { id: Number(propertyId) },
    { enabled: !!propertyId }
  );

  const createBooking = trpc.account.createBooking.useMutation({
    onSuccess: () => { setSubmitted(true); toast.success(isArabic ? "تم إرسال طلب الحجز" : "Booking request submitted"); },
    onError: (err) => toast.error(err.message),
  });

  if (!isAuthenticated) {
    return (
      <PageLayout>
        <SEO title={isArabic ? "حجز" : "Booking"} description={isArabic ? "احجز إقامتك في أفضل الشقق المفروشة في السعودية" : "Book your stay at the best furnished apartments in Saudi Arabia"} url="/booking" />
        <div className="py-20 text-center">
          <LogIn className="h-16 w-16 text-[#3ECFC0] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#0B1E2D] mb-4">{isArabic ? "سجل الدخول للحجز" : "Sign In to Book"}</h2>
          <p className="text-muted-foreground mb-6">{isArabic ? "يجب تسجيل الدخول لإتمام الحجز" : "You need to sign in to complete your booking"}</p>
          <Link href="/login">
            <Button className="bg-[#3ECFC0] text-[#0B1E2D] hover:bg-[#B8F0E8] font-semibold px-8 py-6">{t("nav.login")}</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEO title={isArabic ? "حجز" : "Booking"} description={isArabic ? "احجز إقامتك في أفضل الشقق المفروشة في السعودية" : "Book your stay at the best furnished apartments in Saudi Arabia"} url="/booking" />
      <section className="py-16 bg-[#0B1E2D]">
        <div className="container">
          <h1 className="text-4xl font-bold text-white mb-4">{isArabic ? "حجز" : "Booking"}</h1>
        </div>
      </section>
      <section className="py-12 bg-[#F5F7FA]">
        <div className="container max-w-2xl">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-[#3ECFC0] mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-[#0B1E2D] mb-2">{isArabic ? "تم إرسال طلب الحجز!" : "Booking Request Sent!"}</h2>
                  <p className="text-muted-foreground">{isArabic ? "سنتواصل معك قريباً لتأكيد الحجز" : "We'll contact you soon to confirm your booking"}</p>
                </div>
              ) : (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!propertyId) return toast.error(isArabic ? "اختر عقاراً أولاً" : "Select a property first");
                  createBooking.mutate({
                    propertyId: Number(propertyId),
                    checkIn: form.checkIn,
                    checkOut: form.checkOut,
                    guests: form.guests,
                    specialRequests: form.notes,
                  });
                }} className="space-y-6">
                  {property && (
                    <div className="p-4 bg-[#0B1E2D] rounded-xl text-white mb-4">
                      <h3 className="font-semibold">{isArabic ? property.titleAr : property.titleEn}</h3>
                      <p className="text-sm text-white/60 mt-1">{t("common.sar")} {String(property.priceNightly || property.priceLow || 0)} {t("pricing.per_night")}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-[#0B1E2D] mb-1.5 block">{isArabic ? "تاريخ الوصول" : "Check-in"} *</label>
                      <Input required type="date" value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#0B1E2D] mb-1.5 block">{isArabic ? "تاريخ المغادرة" : "Check-out"} *</label>
                      <Input required type="date" value={form.checkOut} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#0B1E2D] mb-1.5 block">{isArabic ? "عدد الضيوف" : "Guests"}</label>
                    <Input type="number" min={1} max={20} value={form.guests} onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#0B1E2D] mb-1.5 block">{isArabic ? "ملاحظات" : "Notes"}</label>
                    <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder={isArabic ? "أي طلبات خاصة؟" : "Any special requests?"} />
                  </div>
                  <Button type="submit" disabled={createBooking.isPending} className="w-full bg-[#3ECFC0] text-[#0B1E2D] hover:bg-[#B8F0E8] font-semibold py-6">
                    {createBooking.isPending ? (isArabic ? "جاري الإرسال..." : "Submitting...") : (isArabic ? "تأكيد الحجز" : "Confirm Booking")}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
}
