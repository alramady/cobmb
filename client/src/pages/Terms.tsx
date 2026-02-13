import { useLanguage } from "@/contexts/LanguageContext";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";

export default function Terms() {
  const { isArabic } = useLanguage();

  return (
    <PageLayout>
      <SEO title={isArabic ? "الشروط والأحكام" : "Terms & Conditions"} description={isArabic ? "الشروط والأحكام لموقع كوبي إن بي" : "CoBnB KSA Terms and Conditions"} url="/terms" />
      <section className="py-16 bg-[#0B1E2D]">
        <div className="container"><h1 className="text-4xl font-bold text-white">{isArabic ? "الشروط والأحكام" : "Terms & Conditions"}</h1></div>
      </section>
      <section className="py-16 bg-white">
        <div className="container max-w-3xl prose prose-lg">
          {isArabic ? (
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>مرحباً بك في CoBnB KSA. باستخدامك لموقعنا وخدماتنا، فإنك توافق على الشروط والأحكام التالية.</p>
              <h2 className="text-xl font-bold text-[#0B1E2D]">الخدمات</h2>
              <p>نقدم خدمات إدارة الإيجار القصير للعقارات في المملكة العربية السعودية. تشمل خدماتنا إدراج العقارات وإدارة الحجوزات والتواصل مع الضيوف.</p>
              <h2 className="text-xl font-bold text-[#0B1E2D]">نموذج الإيرادات</h2>
              <p>نعمل بنموذج تقاسم الأرباح 70/30 حيث يحصل المالك على 70% من الإيرادات ونحصل على 30% مقابل خدمات الإدارة الشاملة.</p>
              <h2 className="text-xl font-bold text-[#0B1E2D]">المسؤولية</h2>
              <p>نبذل قصارى جهدنا لتقديم أفضل خدمة ممكنة. ومع ذلك، لا نتحمل المسؤولية عن أي أضرار ناتجة عن استخدام خدماتنا.</p>
              <h2 className="text-xl font-bold text-[#0B1E2D]">التعديلات</h2>
              <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطارك بأي تغييرات جوهرية.</p>
            </div>
          ) : (
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>Welcome to CoBnB KSA. By using our website and services, you agree to the following terms and conditions.</p>
              <h2 className="text-xl font-bold text-[#0B1E2D]">Services</h2>
              <p>We provide short-term rental management services for properties in Saudi Arabia. Our services include property listing, booking management, and guest communication.</p>
              <h2 className="text-xl font-bold text-[#0B1E2D]">Revenue Model</h2>
              <p>We operate on a 70/30 profit-sharing model where the owner receives 70% of revenue and we receive 30% for comprehensive management services.</p>
              <h2 className="text-xl font-bold text-[#0B1E2D]">Liability</h2>
              <p>We strive to provide the best possible service. However, we are not liable for any damages resulting from the use of our services.</p>
              <h2 className="text-xl font-bold text-[#0B1E2D]">Modifications</h2>
              <p>We reserve the right to modify these terms at any time. You will be notified of any material changes.</p>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
