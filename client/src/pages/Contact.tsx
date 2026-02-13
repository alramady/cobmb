import SEO from "@/components/SEO";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import PageLayout from "@/components/PageLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const { t, isArabic } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "general", message: "" });
  const { data: settings } = trpc.settings.getMultiple.useQuery({ keys: ["site_phone", "site_email"] });
  const sitePhone = settings?.site_phone || "+966 50 446 6528";
  const siteEmail = settings?.site_email || "info@cobnb.sa";

  const submit = trpc.inquiries.create.useMutation({
    onSuccess: () => { setSubmitted(true); toast.success(isArabic ? "تم إرسال رسالتك بنجاح" : "Your message has been sent successfully"); },
    onError: () => toast.error(isArabic ? "حدث خطأ، حاول مرة أخرى" : "An error occurred, please try again"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit.mutate(form);
  };

  return (
    <PageLayout>
      <SEO title={isArabic ? "اتصل بنا" : "Contact Us"} description={isArabic ? "تواصل مع كوبي إن بي للاستفسار عن إدارة العقارات وفرص الشراكة." : "Get in touch with CoBnB KSA for property management inquiries and partnership opportunities."} url="/contact" />
      <section className="py-16 bg-[#0B1E2D]">
        <div className="container">
          <h1 className="text-4xl font-bold text-white mb-4">{t("contact.title")}</h1>
          <p className="text-white/70">{isArabic ? "نسعد بتواصلك معنا" : "We'd love to hear from you"}</p>
        </div>
      </section>

      <section className="py-16 bg-[#F5F7FA]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#3ECFC0]/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-[#3ECFC0]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0B1E2D]">{isArabic ? "البريد الإلكتروني" : "Email"}</h3>
                    <a href={`mailto:${siteEmail}`} className="text-sm text-muted-foreground hover:text-[#3ECFC0] transition-colors">{siteEmail}</a>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#3ECFC0]/10 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-[#3ECFC0]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0B1E2D]">{isArabic ? "الهاتف" : "Phone"}</h3>
                    <a href={`tel:${sitePhone}`} className="text-sm text-muted-foreground hover:text-[#3ECFC0] transition-colors" dir="ltr">{sitePhone}</a>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#3ECFC0]/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-[#3ECFC0]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0B1E2D]">{isArabic ? "العنوان" : "Address"}</h3>
                    <p className="text-sm text-muted-foreground">{isArabic ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  {submitted ? (
                    <div className="text-center py-12">
                      <CheckCircle className="h-16 w-16 text-[#3ECFC0] mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-[#0B1E2D] mb-2">{isArabic ? "شكراً لتواصلك!" : "Thank You!"}</h2>
                      <p className="text-muted-foreground">{isArabic ? "سنتواصل معك في أقرب وقت" : "We'll get back to you soon"}</p>
                      <Button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", type: "general", message: "" }); }} className="mt-6 bg-[#3ECFC0] text-[#0B1E2D]">
                        {isArabic ? "إرسال رسالة أخرى" : "Send Another Message"}
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-[#0B1E2D] mb-1.5 block">{isArabic ? "الاسم" : "Name"} *</label>
                          <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={isArabic ? "أدخل اسمك" : "Enter your name"} />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-[#0B1E2D] mb-1.5 block">{isArabic ? "البريد الإلكتروني" : "Email"} *</label>
                          <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={isArabic ? "أدخل بريدك" : "Enter your email"} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-[#0B1E2D] mb-1.5 block">{isArabic ? "الهاتف" : "Phone"}</label>
                          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={isArabic ? "رقم الهاتف" : "Phone number"} dir="ltr" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-[#0B1E2D] mb-1.5 block">{isArabic ? "نوع الاستفسار" : "Inquiry Type"}</label>
                          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">{isArabic ? "استفسار عام" : "General Inquiry"}</SelectItem>
                              <SelectItem value="owner">{isArabic ? "مالك عقار" : "Property Owner"}</SelectItem>
                              <SelectItem value="guest">{isArabic ? "حجز" : "Booking"}</SelectItem>
                              <SelectItem value="partnership">{isArabic ? "شراكة" : "Partnership"}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-[#0B1E2D] mb-1.5 block">{isArabic ? "الرسالة" : "Message"} *</label>
                        <Textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={isArabic ? "اكتب رسالتك هنا..." : "Write your message here..."} />
                      </div>
                      <Button type="submit" disabled={submit.isPending} className="w-full bg-[#3ECFC0] text-[#0B1E2D] hover:bg-[#B8F0E8] font-semibold py-6">
                        {submit.isPending ? (isArabic ? "جاري الإرسال..." : "Sending...") : (<><Send className="h-4 w-4 me-2" /> {t("contact.send")}</>)}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
