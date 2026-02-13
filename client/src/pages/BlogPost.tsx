import SEO from "@/components/SEO";
import { Link, useParams } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import PageLayout from "@/components/PageLayout";
import { trpc } from "@/lib/trpc";
import { Calendar, ArrowLeft, ArrowRight, Tag } from "lucide-react";
import { Streamdown } from "streamdown";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { t, isArabic, lang } = useLanguage();
  const Arrow = isArabic ? ArrowRight : ArrowLeft;

  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery({ slug: slug || "" });

  if (isLoading) {
    return <PageLayout><div className="py-20 text-center"><div className="animate-spin h-8 w-8 border-2 border-[#3ECFC0] border-t-transparent rounded-full mx-auto" /></div></PageLayout>;
  }

  if (!post) {
    return <PageLayout><div className="py-20 text-center"><p className="text-muted-foreground">{isArabic ? "المقال غير موجود" : "Article not found"}</p></div></PageLayout>;
  }

  const tags = (post.tags as string[] | null) || [];

  return (
    <PageLayout>
      <SEO title={isArabic ? post.titleAr : post.titleEn} description={(isArabic ? post.excerptAr : post.excerptEn)?.slice(0, 160) || ""} url={"/blog/" + post.slug} />
      <article className="py-12 bg-white">
        <div className="container max-w-4xl">
          <Link href="/blog" className="text-sm text-[#3ECFC0] hover:underline flex items-center gap-1 mb-6">
            <Arrow className="h-4 w-4" /> {t("blog.title")}
          </Link>
          {post.featuredImage && (
            <div className="aspect-[2/1] rounded-2xl overflow-hidden mb-8">
              <img src={post.featuredImage} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-[#0B1E2D] mb-4">{lang === "ar" ? post.titleAr : post.titleEn}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> {new Date(post.publishedAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
              </span>
            )}
            {post.category && (
              <span className="px-3 py-1 bg-[#3ECFC0]/10 text-[#3ECFC0] rounded-full text-xs font-medium">{post.category}</span>
            )}
          </div>
          <div className="prose prose-lg max-w-none">
            <Streamdown>{String(lang === "ar" ? post.contentAr || "" : post.contentEn || "")}</Streamdown>
          </div>
          {tags.length > 0 && (
            <div className="mt-8 pt-6 border-t flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span key={i} className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs text-muted-foreground">
                  <Tag className="h-3 w-3" /> {String(tag)}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </PageLayout>
  );
}
