import SEO from "@/components/SEO";
import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import PageLayout from "@/components/PageLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, ArrowLeft, BookOpen } from "lucide-react";

const categories = [
  { key: "all", ar: "الكل", en: "All" },
  { key: "saudi_tourism", ar: "السياحة السعودية", en: "Saudi Tourism" },
  { key: "property_investment", ar: "الاستثمار العقاري", en: "Property Investment" },
  { key: "travel_guides", ar: "أدلة السفر", en: "Travel Guides" },
  { key: "industry_news", ar: "أخبار القطاع", en: "Industry News" },
];

export default function Blog() {
  const { t, isArabic, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  const { data: posts, isLoading } = trpc.blog.published.useQuery(
    activeCategory !== "all" ? { category: activeCategory } : {}
  );

  return (
    <PageLayout>
      <SEO title={isArabic ? "المدونة" : "Blog"} description={isArabic ? "رؤى حول السياحة السعودية والاستثمار العقاري وإدارة الإيجارات قصيرة المدى." : "Insights on Saudi tourism, property investment, and short-term rental management."} url="/blog" />
      <section className="py-16 bg-[#0B1E2D]">
        <div className="container">
          <h1 className="text-4xl font-bold text-white mb-4">{t("blog.title")}</h1>
          <p className="text-white/70">{isArabic ? "آخر الأخبار والمقالات عن سوق الإيجار القصير في السعودية" : "Latest news and articles about the short-term rental market in Saudi Arabia"}</p>
        </div>
      </section>

      <section className="py-4 bg-white border-b sticky top-16 md:top-20 z-30">
        <div className="container">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat.key
                    ? "bg-[#3ECFC0] text-[#0B1E2D]"
                    : "bg-gray-100 text-muted-foreground hover:bg-gray-200"
                }`}
              >
                {isArabic ? cat.ar : cat.en}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#F5F7FA]">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-0 animate-pulse">
                  <div className="aspect-[16/10] bg-gray-200 rounded-t-lg" />
                  <CardContent className="p-5 space-y-3"><div className="h-5 bg-gray-200 rounded w-3/4" /><div className="h-4 bg-gray-200 rounded w-full" /></CardContent>
                </Card>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all border-0 bg-white">
                    <div className="aspect-[16/10] bg-gradient-to-br from-[#0B1E2D] to-[#1a3a4f] relative overflow-hidden">
                      {post.featuredImage && <img src={post.featuredImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                      <span className="absolute top-3 start-3 px-3 py-1 bg-[#3ECFC0] text-[#0B1E2D] text-xs font-semibold rounded-full">
                        {categories.find((c) => c.key === post.category)?.[isArabic ? "ar" : "en"] || post.category}
                      </span>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg text-[#0B1E2D] mb-2 line-clamp-2">{lang === "ar" ? post.titleAr : post.titleEn}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{String(lang === "ar" ? post.excerptAr || "" : post.excerptEn || "")}</p>
                      <div className="flex items-center justify-between">
                        {post.publishedAt && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {new Date(post.publishedAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                          </span>
                        )}
                        <span className="text-sm text-[#3ECFC0] font-medium">{t("blog.read_more")} <Arrow className="h-3 w-3 inline" /></span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">{isArabic ? "لا توجد مقالات بعد" : "No articles yet"}</p>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
