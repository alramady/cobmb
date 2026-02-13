import { useLanguage } from "@/contexts/LanguageContext";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";

export default function Privacy() {
  const { isArabic } = useLanguage();

  return (
    <PageLayout>
      <SEO title={isArabic ? "سياسة الخصوصية" : "Privacy Policy"} description={isArabic ? "سياسة الخصوصية لموقع كوبي إن بي" : "CoBnB KSA Privacy Policy"} url="/privacy" />
      <section className="py-16 bg-[#0B1E2D]">
        <div className="container"><h1 className="text-4xl font-bold text-white">{isArabic ? "سياسة الخصوصية" : "Privacy Policy"}</h1></div>
      </section>
      <section className="py-16 bg-white">
        <div className="container max-w-3xl prose prose-lg">
          {isArabic ? (
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>نحن في CoBnB KSA نلتزم بحماية خصوصيتك. توضح هذه السياسة كيف نجمع ونستخدم ونحمي معلوماتك الشخصية.</p>
              <h2 className="text-xl font-bold text-[#0B1E2D]">المعلومات التي نجمعها</h2>
              <p>نجمع المعلومات التي تقدمها لنا مباشرة مثل الاسم والبريد الإلكتروني ورقم الهاتف عند التسجيل أو التواصل معنا.</p>
              <h2 className="text-xl font-bold text-[#0B1E2D]">كيف نستخدم معلوماتك</h2>
              <p>نستخدم معلوماتك لتقديم خدماتنا وتحسينها، والتواصل معك بشأن حجوزاتك واستفساراتك.</p>
              <h2 className="text-xl font-bold text-[#0B1E2D]">حماية المعلومات</h2>
              <p>نتخذ إجراءات أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التغيير أو الإفصاح.</p>
              <h2 className="text-xl font-bold text-[#0B1E2D]">حقوقك</h2>
              <p>يحق لك الوصول إلى معلوماتك الشخصية وتصحيحها أو حذفها. تواصل معنا لممارسة هذه الحقوق.</p>
            </div>
          ) : (
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>At CoBnB KSA, we are committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information.</p>
              <h2 className="text-xl font-bold text-[#0B1E2D]">Information We Collect</h2>
              <p>We collect information you provide directly, such as name, email, and phone number when registering or contacting us.</p>
              <h2 className="text-xl font-bold text-[#0B1E2D]">How We Use Your Information</h2>
              <p>We use your information to provide and improve our services, and to communicate with you about your bookings and inquiries.</p>
              <h2 className="text-xl font-bold text-[#0B1E2D]">Information Protection</h2>
              <p>We implement appropriate security measures to protect your information from unauthorized access, alteration, or disclosure.</p>
              <h2 className="text-xl font-bold text-[#0B1E2D]">Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.</p>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
