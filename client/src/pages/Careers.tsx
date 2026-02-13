import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, MapPin, Clock, DollarSign, ChevronRight, Loader2, CheckCircle2, Building2, Users, Heart, Zap } from "lucide-react";
import SEO from "@/components/SEO";
import { toast } from "sonner";

export default function Careers() {
  const { isArabic } = useLanguage();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyJob, setApplyJob] = useState<any>(null);

  useEffect(() => {
    fetch("/api/public/careers")
      .then(r => r.json())
      .then(data => { setJobs(data.jobs || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white" dir={isArabic ? "rtl" : "ltr"}>
      <SEO title={isArabic ? "وظائف في كوبي إن بي" : "Careers at CoBnB"} description={isArabic ? "انضم لفريقنا وكن جزءاً من إعادة تعريف الضيافة في المملكة العربية السعودية." : "Join our team and be part of redefining hospitality in Saudi Arabia. Browse open positions."} url="/careers" />
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0B1E2D] via-[#0D2B3E] to-[#0B1E2D] text-white py-24 md:py-32">
        <div className="container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-1.5 mb-6">
            <Briefcase className="h-4 w-4 text-teal-400" />
            <span className="text-sm text-teal-300">{isArabic ? "انضم لفريقنا" : "Join Our Team"}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {isArabic ? "وظائف في كوبي إن بي" : "Careers at CoBnB"}
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            {isArabic
              ? "كن جزءاً من فريق يعيد تعريف الضيافة في المملكة العربية السعودية. نبحث عن أشخاص شغوفين ومبدعين."
              : "Be part of a team redefining hospitality in Saudi Arabia. We're looking for passionate, creative individuals to shape the future of short-term rentals."}
          </p>
        </div>
      </section>

      {/* Why CoBnB */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#0B1E2D] mb-12">
            {isArabic ? "لماذا كوبي إن بي؟" : "Why CoBnB?"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building2, titleEn: "Growth Industry", titleAr: "صناعة متنامية", descEn: "Saudi Arabia's tourism sector is booming under Vision 2030. Be at the forefront.", descAr: "قطاع السياحة في المملكة يزدهر ضمن رؤية 2030. كن في المقدمة." },
              { icon: Users, titleEn: "Great Team", titleAr: "فريق رائع", descEn: "Work with talented professionals from diverse backgrounds in a collaborative environment.", descAr: "اعمل مع محترفين موهوبين من خلفيات متنوعة في بيئة تعاونية." },
              { icon: Heart, titleEn: "Work-Life Balance", titleAr: "توازن الحياة", descEn: "Flexible working arrangements and competitive benefits package.", descAr: "ترتيبات عمل مرنة وحزمة مزايا تنافسية." },
              { icon: Zap, titleEn: "Innovation", titleAr: "الابتكار", descEn: "We embrace technology and innovation to deliver exceptional guest experiences.", descAr: "نتبنى التكنولوجيا والابتكار لتقديم تجارب ضيافة استثنائية." },
            ].map((item, i) => (
              <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-7 w-7 text-teal-600" />
                  </div>
                  <h3 className="font-bold text-[#0B1E2D] mb-2">{isArabic ? item.titleAr : item.titleEn}</h3>
                  <p className="text-sm text-slate-600">{isArabic ? item.descAr : item.descEn}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 md:py-20">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#0B1E2D] mb-4">
            {isArabic ? "الوظائف المتاحة" : "Open Positions"}
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-xl mx-auto">
            {isArabic ? "تصفح الفرص المتاحة حالياً وقدم طلبك" : "Browse current openings and submit your application"}
          </p>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-teal-500" /></div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl">
              <Briefcase className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                {isArabic ? "لا توجد وظائف متاحة حالياً" : "No Open Positions Right Now"}
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                {isArabic
                  ? "لا تقلق! يمكنك إرسال سيرتك الذاتية وسنتواصل معك عند توفر فرصة مناسبة."
                  : "Don't worry! Send us your resume and we'll reach out when a suitable opportunity arises."}
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {jobs.map((job: any) => (
                <Card key={job.id} className="border-0 shadow-sm hover:shadow-md transition-all group cursor-pointer" onClick={() => setApplyJob(job)}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#0B1E2D] group-hover:text-teal-600 transition-colors">
                          {isArabic ? job.titleAr : job.titleEn}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
                          {(job.departmentEn || job.departmentAr) && (
                            <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {isArabic ? job.departmentAr : job.departmentEn}</span>
                          )}
                          {(job.locationEn || job.locationAr) && (
                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {isArabic ? job.locationAr : job.locationEn}</span>
                          )}
                          {(job.typeEn || job.typeAr) && (
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {isArabic ? job.typeAr : job.typeEn}</span>
                          )}
                          {job.salaryRange && (
                            <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> {job.salaryRange}</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className={`h-5 w-5 text-slate-400 group-hover:text-teal-500 transition-colors ${isArabic ? "rotate-180" : ""}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {applyJob && <ApplyDialog isArabic={isArabic} job={applyJob} onClose={() => setApplyJob(null)} />}

      <Footer />
    </div>
  );
}

function ApplyDialog({ isArabic, job, onClose }: { isArabic: boolean; job: any; onClose: () => void }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", linkedinUrl: "", coverLetter: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/public/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id, ...form }),
      });
      if (res.ok) {
        setSubmitted(true);
        toast.success(isArabic ? "تم إرسال طلبك بنجاح" : "Application submitted successfully");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to submit");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#0B1E2D] mb-2">
              {isArabic ? "تم إرسال طلبك!" : "Application Submitted!"}
            </h3>
            <p className="text-slate-600">
              {isArabic
                ? "شكراً لاهتمامك. سنراجع طلبك ونتواصل معك قريباً."
                : "Thank you for your interest. We'll review your application and get back to you soon."}
            </p>
            <Button onClick={onClose} className="mt-6 bg-teal-600 hover:bg-teal-500 text-white">
              {isArabic ? "إغلاق" : "Close"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isArabic ? "التقديم على" : "Apply for"}: {isArabic ? job.titleAr : job.titleEn}
          </DialogTitle>
        </DialogHeader>
        {(job.descriptionEn || job.descriptionAr) && (
          <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600 mb-2">
            <h4 className="font-semibold text-[#0B1E2D] mb-1">{isArabic ? "الوصف" : "Description"}</h4>
            <p className="whitespace-pre-line">{isArabic ? job.descriptionAr : job.descriptionEn}</p>
          </div>
        )}
        {(job.requirementsEn || job.requirementsAr) && (
          <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600 mb-2">
            <h4 className="font-semibold text-[#0B1E2D] mb-1">{isArabic ? "المتطلبات" : "Requirements"}</h4>
            <p className="whitespace-pre-line">{isArabic ? job.requirementsAr : job.requirementsEn}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>{isArabic ? "الاسم الأول" : "First Name"} *</Label><Input value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required /></div>
            <div><Label>{isArabic ? "اسم العائلة" : "Last Name"} *</Label><Input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required /></div>
          </div>
          <div><Label>{isArabic ? "البريد الإلكتروني" : "Email"} *</Label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
          <div><Label>{isArabic ? "رقم الهاتف" : "Phone"}</Label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
          <div><Label>{isArabic ? "رابط لينكدإن" : "LinkedIn URL"}</Label><Input value={form.linkedinUrl} onChange={e => setForm({...form, linkedinUrl: e.target.value})} placeholder="https://linkedin.com/in/..." /></div>
          <div><Label>{isArabic ? "رسالة تعريفية" : "Cover Letter"}</Label><Textarea value={form.coverLetter} onChange={e => setForm({...form, coverLetter: e.target.value})} rows={4} placeholder={isArabic ? "أخبرنا عن نفسك..." : "Tell us about yourself..."} /></div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>{isArabic ? "إلغاء" : "Cancel"}</Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-500 text-white" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin me-2" />}
              {isArabic ? "إرسال الطلب" : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
