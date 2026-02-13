import { useLanguage } from "@/contexts/LanguageContext";
import PageLayout from "@/components/PageLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Target, Eye, Heart, Shield, Users, Award, Globe, TrendingUp } from "lucide-react";

export default function About() {
  const { t, isArabic, lang } = useLanguage();
  const { data: team } = trpc.team.list.useQuery();

  const values = [
    { icon: Shield, titleAr: "الثقة والشفافية", titleEn: "Trust & Transparency", descAr: "نؤمن بالشفافية الكاملة في كل تعاملاتنا مع ملاك العقارات والضيوف", descEn: "We believe in complete transparency in all our dealings with property owners and guests" },
    { icon: Award, titleAr: "التميز في الخدمة", titleEn: "Service Excellence", descAr: "نسعى لتقديم أعلى معايير الخدمة في كل تفاصيل عملنا", descEn: "We strive to deliver the highest service standards in every detail of our work" },
    { icon: Globe, titleAr: "الابتكار والتقنية", titleEn: "Innovation & Technology", descAr: "نستخدم أحدث التقنيات لتحسين تجربة الضيوف وزيادة عوائد الملاك", descEn: "We leverage cutting-edge technology to enhance guest experience and maximize owner returns" },
    { icon: Heart, titleAr: "الضيافة السعودية", titleEn: "Saudi Hospitality", descAr: "نجمع بين الضيافة العربية الأصيلة والمعايير العالمية", descEn: "We blend authentic Arabian hospitality with global standards" },
  ];

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative py-24 bg-[#0B1E2D] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#3ECFC0] rounded-full blur-[150px]" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{t("about.title")}</h1>
            <p className="text-xl text-white/70">
              {isArabic
                ? "من ماليزيا إلى المملكة العربية السعودية — نقدم خبرة 7 سنوات في إدارة الإيجارات القصيرة لسوق المملكة المتنامي"
                : "From Malaysia to Saudi Arabia — bringing 7 years of short-term rental management expertise to the Kingdom's growing market"}
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#0B1E2D] mb-6">{t("about.story")}</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  {isArabic
                    ? "تأسست CoBnB في ماليزيا عام 2018 كشركة متخصصة في إدارة الإيجارات القصيرة. خلال 7 سنوات، نجحنا في إدارة أكثر من 1,300 عقار وحققنا معدل إشغال يتجاوز 80%."
                    : "CoBnB was founded in Malaysia in 2018 as a company specializing in short-term rental management. Over 7 years, we have successfully managed over 1,300 properties and achieved an occupancy rate exceeding 80%."}
                </p>
                <p>
                  {isArabic
                    ? "اليوم، نوسع عملياتنا إلى المملكة العربية السعودية، مستفيدين من رؤية 2030 والنمو الهائل في قطاع السياحة والضيافة. نبدأ بثلاث مدن رئيسية: الرياض وجدة والمدينة المنورة."
                    : "Today, we are expanding our operations to Saudi Arabia, leveraging Vision 2030 and the tremendous growth in the tourism and hospitality sector. We start with three key cities: Riyadh, Jeddah, and Madinah."}
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#0B1E2D] to-[#1a3a4f] rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">{isArabic ? "أرقامنا تتحدث" : "Our Numbers Speak"}</h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "7+", label: isArabic ? "سنوات خبرة" : "Years Experience" },
                  { value: "1,321+", label: isArabic ? "عقار مُدار" : "Properties Managed" },
                  { value: "80%+", label: isArabic ? "معدل إشغال" : "Occupancy Rate" },
                  { value: "4.8★", label: isArabic ? "تقييم الضيوف" : "Guest Rating" },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl font-bold text-[#3ECFC0]">{stat.value}</div>
                    <div className="text-sm text-white/60 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision 2030 */}
      <section className="py-20 bg-[#F5F7FA]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3ECFC0]/10 border border-[#3ECFC0]/20 mb-6">
              <TrendingUp className="h-4 w-4 text-[#3ECFC0]" />
              <span className="text-[#3ECFC0] text-sm font-medium">{t("about.vision")}</span>
            </div>
            <h2 className="text-3xl font-bold text-[#0B1E2D] mb-6">
              {isArabic ? "متوافقون مع رؤية المملكة 2030" : "Aligned with Saudi Vision 2030"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {isArabic
                ? "تستهدف رؤية 2030 استقبال 150 مليون زائر سنوياً بحلول 2030. نحن نساهم في تحقيق هذا الهدف من خلال توفير إقامات عالية الجودة تلبي احتياجات الزوار المحليين والدوليين."
                : "Vision 2030 targets welcoming 150 million visitors annually by 2030. We contribute to achieving this goal by providing high-quality accommodations that meet the needs of both domestic and international visitors."}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { value: "150M", label: isArabic ? "زائر مستهدف بحلول 2030" : "Target visitors by 2030" },
                { value: "10%", label: isArabic ? "مساهمة السياحة في الناتج المحلي" : "Tourism GDP contribution" },
                { value: "1M+", label: isArabic ? "وظيفة جديدة في القطاع" : "New sector jobs" },
              ].map((stat, i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-[#3ECFC0]">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0B1E2D] mb-4">{t("about.values")}</h2>
            <div className="w-20 h-1 bg-[#C9A96E] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#3ECFC0]/10 flex items-center justify-center shrink-0">
                    <value.icon className="h-6 w-6 text-[#3ECFC0]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#0B1E2D] mb-2">{isArabic ? value.titleAr : value.titleEn}</h3>
                    <p className="text-sm text-muted-foreground">{isArabic ? value.descAr : value.descEn}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {team && team.length > 0 && (
        <section className="py-20 bg-[#F5F7FA]">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#0B1E2D] mb-4">{t("about.team")}</h2>
              <div className="w-20 h-1 bg-[#3ECFC0] mx-auto rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member) => (
                <Card key={member.id} className="border-0 overflow-hidden">
                  <div className="aspect-[4/3] bg-gradient-to-br from-[#0B1E2D] to-[#1a3a4f] flex items-center justify-center">
                    {member.image ? (
                      <img src={member.image} alt={String(lang === "ar" ? member.nameAr : member.nameEn)} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="h-16 w-16 text-[#3ECFC0]/30" />
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg text-[#0B1E2D]">{lang === "ar" ? member.nameAr : member.nameEn}</h3>
                    <p className="text-sm text-[#3ECFC0]">{lang === "ar" ? member.roleAr : member.roleEn}</p>
                    {(lang === "ar" ? member.bioAr : member.bioEn) && (
                      <p className="text-sm text-muted-foreground mt-2">{String(lang === "ar" ? member.bioAr : member.bioEn)}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
}
