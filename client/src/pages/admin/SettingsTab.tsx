import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Settings, Eye, BarChart3, Share2, Smartphone, Percent, Code, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function SettingsTab({ isArabic }: { isArabic: boolean }) {
  const { data: settingsData, refetch } = trpc.admin.settings.getAll.useQuery();
  const saveBatch = trpc.admin.settings.setBatch.useMutation({
    onSuccess: () => { refetch(); toast.success(isArabic ? "تم حفظ الإعدادات" : "Settings saved"); },
  });
  const [form, setForm] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (settingsData) setForm(settingsData);
  }, [settingsData]);

  const handleSave = () => {
    const items = Object.entries(form)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([key, value]) => ({ key, value }));
    if (items.length > 0) saveBatch.mutate(items);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, maxMb = 100) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > maxMb * 1024 * 1024) { toast.error(`Max ${maxMb}MB`); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd, credentials: "include" });
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, [field]: data.url }));
        toast.success(isArabic ? "تم الرفع" : "Uploaded");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const f = (key: string) => form[key] || "";
  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-6">
      {/* Hero Video Settings */}
      <Section icon={<Eye className="h-5 w-5 text-teal-500" />} title={isArabic ? "فيديو الصفحة الرئيسية" : "Homepage Hero Video"}>
        {f("hero_video_url") && (
          <div className="rounded-xl overflow-hidden bg-slate-900 aspect-video max-w-xl">
            <video src={f("hero_video_url")} controls muted className="w-full h-full object-cover" />
          </div>
        )}
        <div>
          <Label className="text-sm font-medium text-slate-600">{isArabic ? "رابط الفيديو" : "Video URL"}</Label>
          <div className="flex gap-2 mt-1">
            <Input value={f("hero_video_url")} onChange={(e) => set("hero_video_url", e.target.value)} placeholder="https://..." className="flex-1" />
            <label className="cursor-pointer">
              <input type="file" accept="video/mp4,video/webm" onChange={(e) => handleFileUpload(e, "hero_video_url")} className="hidden" />
              <Button variant="outline" asChild disabled={uploading}>
                <span>{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isArabic ? "رفع فيديو" : "Upload Video")}</span>
              </Button>
            </label>
          </div>
          <p className="text-xs text-slate-400 mt-1">{isArabic ? "MP4 أو WebM، حتى 100 ميجابايت" : "MP4 or WebM, up to 100MB"}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-600">{isArabic ? "صورة الغلاف (اختياري)" : "Poster Image (optional)"}</Label>
          <div className="flex gap-2 mt-1">
            <Input value={f("hero_poster_url")} onChange={(e) => set("hero_poster_url", e.target.value)} placeholder="https://..." className="flex-1" />
            <label className="cursor-pointer">
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "hero_poster_url", 20)} className="hidden" />
              <Button variant="outline" asChild disabled={uploading}>
                <span>{isArabic ? "رفع صورة" : "Upload Image"}</span>
              </Button>
            </label>
          </div>
        </div>
      </Section>

      {/* Hero Title/Subtitle */}
      <Section icon={<Eye className="h-5 w-5 text-teal-500" />} title={isArabic ? "عنوان الصفحة الرئيسية" : "Homepage Hero Text"}>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Hero Title (EN)</Label><Input value={f("hero_title_en")} onChange={(e) => set("hero_title_en", e.target.value)} placeholder="Your Home Away From Home" className="mt-1" /></div>
          <div><Label>Hero Title (AR)</Label><Input value={f("hero_title_ar")} onChange={(e) => set("hero_title_ar", e.target.value)} placeholder="بيتك الثاني" className="mt-1" dir="rtl" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Hero Subtitle (EN)</Label><Textarea value={f("hero_subtitle_en")} onChange={(e) => set("hero_subtitle_en", e.target.value)} rows={2} className="mt-1" /></div>
          <div><Label>Hero Subtitle (AR)</Label><Textarea value={f("hero_subtitle_ar")} onChange={(e) => set("hero_subtitle_ar", e.target.value)} rows={2} className="mt-1" dir="rtl" /></div>
        </div>
      </Section>

      {/* Homepage Stats */}
      <Section icon={<BarChart3 className="h-5 w-5 text-teal-500" />} title={isArabic ? "إحصائيات الصفحة الرئيسية" : "Homepage Stats"}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><Label>Years of Experience</Label><Input type="number" value={f("stats_years")} onChange={(e) => set("stats_years", e.target.value)} placeholder="10" className="mt-1" /></div>
          <div><Label>Properties Managed</Label><Input type="number" value={f("stats_properties")} onChange={(e) => set("stats_properties", e.target.value)} placeholder="200" className="mt-1" /></div>
          <div><Label>Avg Occupancy %</Label><Input type="number" value={f("stats_occupancy")} onChange={(e) => set("stats_occupancy", e.target.value)} placeholder="85" className="mt-1" /></div>
          <div><Label>Cities</Label><Input type="number" value={f("stats_cities")} onChange={(e) => set("stats_cities", e.target.value)} placeholder="3" className="mt-1" /></div>
        </div>
      </Section>

      {/* Contact Info */}
      <Section icon={<Settings className="h-5 w-5 text-teal-500" />} title={isArabic ? "معلومات التواصل" : "Contact Information"}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><Label>{isArabic ? "البريد الإلكتروني" : "Email"}</Label><Input value={f("site_email")} onChange={(e) => set("site_email", e.target.value)} placeholder="info@cobnb.sa" className="mt-1" /></div>
          <div><Label>{isArabic ? "رقم الهاتف" : "Phone"}</Label><Input value={f("site_phone")} onChange={(e) => set("site_phone", e.target.value)} placeholder="+966..." className="mt-1" /></div>
          <div><Label>{isArabic ? "واتساب" : "WhatsApp"}</Label><Input value={f("site_whatsapp")} onChange={(e) => set("site_whatsapp", e.target.value)} placeholder="+966..." className="mt-1" /></div>
        </div>
      </Section>

      {/* Social Media */}
      <Section icon={<Share2 className="h-5 w-5 text-teal-500" />} title={isArabic ? "وسائل التواصل الاجتماعي" : "Social Media"}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Twitter/X</Label><Input value={f("social_twitter")} onChange={(e) => set("social_twitter", e.target.value)} placeholder="https://twitter.com/..." className="mt-1" /></div>
          <div><Label>Instagram</Label><Input value={f("social_instagram")} onChange={(e) => set("social_instagram", e.target.value)} placeholder="https://instagram.com/..." className="mt-1" /></div>
          <div><Label>LinkedIn</Label><Input value={f("social_linkedin")} onChange={(e) => set("social_linkedin", e.target.value)} placeholder="https://linkedin.com/..." className="mt-1" /></div>
          <div><Label>Facebook</Label><Input value={f("social_facebook")} onChange={(e) => set("social_facebook", e.target.value)} placeholder="https://facebook.com/..." className="mt-1" /></div>
          <div><Label>TikTok</Label><Input value={f("social_tiktok")} onChange={(e) => set("social_tiktok", e.target.value)} placeholder="https://tiktok.com/..." className="mt-1" /></div>
          <div><Label>YouTube</Label><Input value={f("social_youtube")} onChange={(e) => set("social_youtube", e.target.value)} placeholder="https://youtube.com/..." className="mt-1" /></div>
        </div>
      </Section>

      {/* Revenue Model */}
      <Section icon={<Percent className="h-5 w-5 text-teal-500" />} title={isArabic ? "نموذج الإيرادات" : "Revenue Model"}>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Owner Share %</Label><Input type="number" value={f("revenue_owner_pct")} onChange={(e) => set("revenue_owner_pct", e.target.value)} placeholder="80" className="mt-1" /></div>
          <div><Label>Company Share %</Label><Input type="number" value={f("revenue_company_pct")} onChange={(e) => set("revenue_company_pct", e.target.value)} placeholder="20" className="mt-1" /></div>
        </div>
      </Section>

      {/* App Settings */}
      <Section icon={<Smartphone className="h-5 w-5 text-teal-500" />} title={isArabic ? "إعدادات التطبيق" : "App Settings"}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>App Store URL</Label><Input value={f("app_store_url")} onChange={(e) => set("app_store_url", e.target.value)} placeholder="https://apps.apple.com/..." className="mt-1" /></div>
          <div><Label>Google Play URL</Label><Input value={f("google_play_url")} onChange={(e) => set("google_play_url", e.target.value)} placeholder="https://play.google.com/..." className="mt-1" /></div>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={f("app_coming_soon") === "true"} onChange={(e) => set("app_coming_soon", e.target.checked ? "true" : "false")} className="rounded" />
            <span className="text-sm">{isArabic ? "عرض 'قريباً' بدلاً من روابط التحميل" : "Show 'Coming Soon' instead of download links"}</span>
          </label>
        </div>
      </Section>

      {/* Analytics */}
      <Section icon={<Code className="h-5 w-5 text-teal-500" />} title={isArabic ? "كود التتبع" : "Analytics Tracking Code"}>
        <Textarea value={f("analytics_tracking_code")} onChange={(e) => set("analytics_tracking_code", e.target.value)} rows={4} placeholder="<!-- Google Analytics or other tracking code -->" className="font-mono text-xs" />
      </Section>

      {/* Save Button */}
      <div className="flex justify-end sticky bottom-0 bg-white/80 backdrop-blur-sm py-4 -mx-1 px-1 rounded-lg">
        <Button onClick={handleSave} disabled={saveBatch.isPending} className="bg-teal-500 hover:bg-teal-600 text-white px-8">
          {saveBatch.isPending ? <Loader2 className="h-4 w-4 animate-spin me-2" /> : null}
          {isArabic ? "حفظ الإعدادات" : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <h3 className="text-lg font-semibold text-[#0B1E2D] flex items-center gap-2">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}
