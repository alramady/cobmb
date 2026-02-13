import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FileText, Plus, Edit, Trash2, Loader2, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "@/components/ImageUploader";
import { DataTable, type Column } from "./DataTable";

export function BlogTab({ isArabic }: { isArabic: boolean }) {
  const { data: posts, refetch } = trpc.admin.blog.list.useQuery();
  const deletePost = trpc.admin.blog.delete.useMutation({
    onSuccess: () => { refetch(); toast.success(isArabic ? "تم الحذف" : "Post deleted"); },
  });
  const [showCreate, setShowCreate] = useState(false);
  const [editPost, setEditPost] = useState<any>(null);

  const columns: Column<any>[] = [
    { key: "id", label: "ID", render: (r) => <span className="text-slate-500">#{r.id}</span> },
    {
      key: "featuredImage", label: "Image", labelAr: "الصورة", sortable: false,
      render: (r) => r.featuredImage ? (
        <img src={r.featuredImage} alt="" className="w-12 h-9 object-cover rounded" />
      ) : (
        <div className="w-12 h-9 bg-slate-100 rounded flex items-center justify-center"><FileText className="h-4 w-4 text-slate-300" /></div>
      ),
    },
    {
      key: "titleEn", label: "Title", labelAr: "العنوان",
      getValue: (r) => isArabic ? r.titleAr : r.titleEn,
      render: (r) => <span className="font-medium text-[#0B1E2D] max-w-[250px] truncate block">{isArabic ? r.titleAr : r.titleEn}</span>,
    },
    {
      key: "category", label: "Category", labelAr: "التصنيف",
      render: (r) => <span className="capitalize text-xs">{r.category?.replace("_", " ")}</span>,
    },
    {
      key: "status", label: "Status", labelAr: "الحالة",
      render: (r) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          r.status === "published" ? "bg-green-100 text-green-700" : r.status === "draft" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-600"
        }`}>{r.status}</span>
      ),
    },
    {
      key: "publishedAt", label: "Published", labelAr: "تاريخ النشر",
      getValue: (r) => r.publishedAt ? new Date(r.publishedAt).getTime() : 0,
      render: (r) => r.publishedAt ? <span className="text-xs text-slate-500">{new Date(r.publishedAt).toLocaleDateString()}</span> : <span className="text-slate-400">—</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{posts?.length || 0} {isArabic ? "مقال" : "posts"}</p>
        <Button className="bg-teal-600 hover:bg-teal-500 text-white" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 me-2" /> {isArabic ? "مقال جديد" : "New Post"}
        </Button>
      </div>
      <DataTable
        data={posts}
        columns={columns}
        isArabic={isArabic}
        searchPlaceholder="Search posts..."
        searchPlaceholderAr="بحث في المقالات..."
        filters={[
          {
            key: "status", label: "Status", labelAr: "الحالة",
            options: [
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "archived", label: "Archived" },
            ],
          },
          {
            key: "category", label: "Category", labelAr: "التصنيف",
            options: [
              { value: "saudi_tourism", label: "Saudi Tourism" },
              { value: "property_investment", label: "Property Investment" },
              { value: "travel_guides", label: "Travel Guides" },
              { value: "industry_news", label: "Industry News" },
            ],
          },
        ]}
        emptyIcon={<FileText className="h-12 w-12 mx-auto opacity-30" />}
        emptyText="No blog posts"
        emptyTextAr="لا توجد مقالات"
        actions={(row) => (
          <>
            <Button variant="outline" size="sm" className="h-8" onClick={() => window.open(`/blog/${row.slug}`, "_blank")}>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="sm" className="h-8" onClick={() => setEditPost(row)}>
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 h-8"
              onClick={() => { if (confirm("Delete this post?")) deletePost.mutate({ id: row.id }); }}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      />
      {showCreate && <BlogDialog isArabic={isArabic} onClose={() => setShowCreate(false)} onSuccess={() => { setShowCreate(false); refetch(); }} />}
      {editPost && <BlogDialog isArabic={isArabic} post={editPost} onClose={() => setEditPost(null)} onSuccess={() => { setEditPost(null); refetch(); }} />}
    </div>
  );
}

function BlogDialog({ isArabic, post, onClose, onSuccess }: {
  isArabic: boolean; post?: any; onClose: () => void; onSuccess: () => void;
}) {
  const isEdit = !!post;
  const createPost = trpc.admin.blog.create.useMutation({
    onSuccess: () => { toast.success(isArabic ? "تم إنشاء المقال" : "Post created"); onSuccess(); },
    onError: (e) => toast.error(e.message),
  });
  const updatePost = trpc.admin.blog.update.useMutation({
    onSuccess: () => { toast.success(isArabic ? "تم التحديث" : "Post updated"); onSuccess(); },
    onError: (e) => toast.error(e.message),
  });

  const existingTags: string[] = post?.tags
    ? (typeof post.tags === "string" ? JSON.parse(post.tags) : (Array.isArray(post.tags) ? post.tags : []))
    : [];

  const [form, setForm] = useState({
    titleEn: post?.titleEn || "", titleAr: post?.titleAr || "",
    slug: post?.slug || "",
    excerptEn: post?.excerptEn || "", excerptAr: post?.excerptAr || "",
    contentEn: post?.contentEn || "", contentAr: post?.contentAr || "",
    category: post?.category || "industry_news",
    status: post?.status || "draft",
    seoTitle: post?.seoTitle || "", seoDescription: post?.seoDescription || "",
  });
  const [featuredImage, setFeaturedImage] = useState<string[]>(post?.featuredImage ? [post.featuredImage] : []);
  const [tags, setTags] = useState<string[]>(existingTags);
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    const trimmed = newTag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setNewTag("");
    }
  };

  const autoSlug = () => {
    if (!form.slug && form.titleEn) {
      setForm((prev) => ({ ...prev, slug: form.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      titleEn: form.titleEn, titleAr: form.titleAr, slug: form.slug,
      excerptEn: form.excerptEn || undefined, excerptAr: form.excerptAr || undefined,
      contentEn: form.contentEn || undefined, contentAr: form.contentAr || undefined,
      category: form.category as any, status: form.status as any,
      featuredImage: featuredImage[0] || undefined,
      seoTitle: form.seoTitle || undefined, seoDescription: form.seoDescription || undefined,
      tags: JSON.stringify(tags),
    };
    if (isEdit) {
      updatePost.mutate({ id: post.id, ...data });
    } else {
      createPost.mutate(data);
    }
  };

  const isPending = createPost.isPending || updatePost.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? (isArabic ? "تعديل المقال" : "Edit Post") : (isArabic ? "مقال جديد" : "New Post")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="text-sm font-semibold mb-2 block">{isArabic ? "صورة المقال" : "Featured Image"}</Label>
            <ImageUploader images={featuredImage} onChange={setFeaturedImage} folder="blog" single />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Title (EN)</Label><Input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} onBlur={autoSlug} required /></div>
            <div><Label>Title (AR)</Label><Input value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} required dir="rtl" /></div>
          </div>
          <div>
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated-from-title" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Excerpt (EN)</Label><Textarea value={form.excerptEn} onChange={(e) => setForm({ ...form, excerptEn: e.target.value })} rows={2} /></div>
            <div><Label>Excerpt (AR)</Label><Textarea value={form.excerptAr} onChange={(e) => setForm({ ...form, excerptAr: e.target.value })} rows={2} dir="rtl" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Content (EN)</Label><Textarea value={form.contentEn} onChange={(e) => setForm({ ...form, contentEn: e.target.value })} rows={8} placeholder="Supports Markdown..." /></div>
            <div><Label>Content (AR)</Label><Textarea value={form.contentAr} onChange={(e) => setForm({ ...form, contentAr: e.target.value })} rows={8} dir="rtl" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="saudi_tourism">Saudi Tourism</SelectItem>
                  <SelectItem value="property_investment">Property Investment</SelectItem>
                  <SelectItem value="travel_guides">Travel Guides</SelectItem>
                  <SelectItem value="industry_news">Industry News</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags Editor */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">{isArabic ? "الوسوم" : "Tags"}</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((t, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1">
                  #{t}
                  <button type="button" onClick={() => setTags((prev) => prev.filter((_, j) => j !== i))} className="hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder={isArabic ? "إضافة وسم..." : "Add tag..."} className="max-w-xs" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} />
              <Button type="button" variant="outline" size="sm" onClick={addTag}>Add</Button>
            </div>
          </div>

          {/* SEO Fields */}
          <div className="border-t pt-4">
            <Label className="text-sm font-semibold mb-3 block flex items-center gap-2">
              🔍 {isArabic ? "تحسين محركات البحث" : "SEO Settings"}
            </Label>
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-slate-500">SEO Title</Label>
                <Input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} placeholder={form.titleEn || "Page title for search engines"} />
                <p className="text-xs text-slate-400 mt-1">{form.seoTitle.length}/60 characters</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">SEO Description</Label>
                <Textarea value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} placeholder={form.excerptEn || "Meta description for search engines"} rows={2} />
                <p className="text-xs text-slate-400 mt-1">{form.seoDescription.length}/160 characters</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-500 text-white" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin me-2" />}
              {isEdit ? (isArabic ? "تحديث" : "Update") : (isArabic ? "إنشاء" : "Create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
