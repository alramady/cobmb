import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ImageUploader from "@/components/ImageUploader";
import { Plus, Edit, MapPin, Loader2, Globe } from "lucide-react";
import { toast } from "sonner";
import type { TabProps } from "./shared";

export default function CitiesTab({ isArabic }: TabProps) {
  const { data: cities, refetch } = trpc.admin.cities.list.useQuery();
  const [showCreate, setShowCreate] = useState(false);
  const [editCity, setEditCity] = useState<any>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{cities?.length || 0} {isArabic ? "مدينة" : "cities"}</p>
        <Button className="bg-teal-600 hover:bg-teal-500 text-white" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 me-2" /> {isArabic ? "إضافة مدينة" : "Add City"}
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-start p-3 font-medium text-slate-600">ID</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الصورة" : "Image"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الاسم (EN)" : "Name (EN)"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الاسم (AR)" : "Name (AR)"}</th>
                <th className="text-start p-3 font-medium text-slate-600">Slug</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الحالة" : "Active"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الترتيب" : "Order"}</th>
                <th className="text-end p-3 font-medium text-slate-600">{isArabic ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {cities?.map((c: any) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="p-3 text-slate-500">#{c.id}</td>
                  <td className="p-3">
                    {c.heroImage ? (
                      <img src={c.heroImage} alt="" className="w-12 h-9 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-9 bg-slate-100 rounded flex items-center justify-center">
                        <Globe className="h-4 w-4 text-slate-300" />
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-medium text-[#0B1E2D]">{c.nameEn}</td>
                  <td className="p-3 text-slate-600" dir="rtl">{c.nameAr}</td>
                  <td className="p-3 text-slate-500 text-xs font-mono">{c.slug}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{c.displayOrder}</td>
                  <td className="p-3 text-end">
                    <Button variant="outline" size="sm" className="h-8" onClick={() => setEditCity(c)}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!cities || cities.length === 0) && (
            <div className="p-12 text-center text-slate-400">
              <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>{isArabic ? "لا توجد مدن" : "No cities"}</p>
            </div>
          )}
        </div>
      </div>
      {showCreate && <CityDialog isArabic={isArabic} onClose={() => setShowCreate(false)} onSuccess={() => { setShowCreate(false); refetch(); }} />}
      {editCity && <CityDialog isArabic={isArabic} city={editCity} onClose={() => setEditCity(null)} onSuccess={() => { setEditCity(null); refetch(); }} />}
    </div>
  );
}

function CityDialog({ isArabic, city, onClose, onSuccess }: {
  isArabic: boolean; city?: any; onClose: () => void; onSuccess: () => void;
}) {
  const isEdit = !!city;
  const createCity = trpc.admin.cities.create.useMutation({
    onSuccess: () => { toast.success(isArabic ? "تم إنشاء المدينة" : "City created"); onSuccess(); },
    onError: (e) => toast.error(e.message),
  });
  const updateCity = trpc.admin.cities.update.useMutation({
    onSuccess: () => { toast.success(isArabic ? "تم تحديث المدينة" : "City updated"); onSuccess(); },
    onError: (e) => toast.error(e.message),
  });

  const [form, setForm] = useState({
    nameEn: city?.nameEn || "", nameAr: city?.nameAr || "", slug: city?.slug || "",
    descriptionEn: city?.descriptionEn || "", descriptionAr: city?.descriptionAr || "",
    latitude: city?.latitude || "", longitude: city?.longitude || "",
    isActive: city?.isActive ?? true, displayOrder: city?.displayOrder ?? 0,
  });
  const [heroImage, setHeroImage] = useState<string[]>(city?.heroImage ? [city.heroImage] : []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      updateCity.mutate({ id: city.id, ...form, heroImage: heroImage[0] || undefined });
    } else {
      const slug = form.slug || form.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      createCity.mutate({ ...form, slug, heroImage: heroImage[0] || undefined });
    }
  };

  const isPending = createCity.isPending || updateCity.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? (isArabic ? "تعديل المدينة" : "Edit City") : (isArabic ? "إضافة مدينة" : "Add City")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="text-sm font-semibold mb-2 block">{isArabic ? "صورة الغلاف" : "Hero Image"}</Label>
            <ImageUploader images={heroImage} onChange={setHeroImage} folder="cities" single />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Name (EN)</Label><Input value={form.nameEn} onChange={e => setForm({...form, nameEn: e.target.value})} required /></div>
            <div><Label>Name (AR)</Label><Input value={form.nameAr} onChange={e => setForm({...form, nameAr: e.target.value})} required dir="rtl" /></div>
          </div>
          {!isEdit && <div><Label>Slug</Label><Input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="auto-generated" /></div>}
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Description (EN)</Label><Textarea value={form.descriptionEn} onChange={e => setForm({...form, descriptionEn: e.target.value})} rows={3} /></div>
            <div><Label>Description (AR)</Label><Textarea value={form.descriptionAr} onChange={e => setForm({...form, descriptionAr: e.target.value})} rows={3} dir="rtl" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Latitude</Label><Input value={form.latitude} onChange={e => setForm({...form, latitude: e.target.value})} /></div>
            <div><Label>Longitude</Label><Input value={form.longitude} onChange={e => setForm({...form, longitude: e.target.value})} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Display Order</Label><Input type="number" value={form.displayOrder} onChange={e => setForm({...form, displayOrder: parseInt(e.target.value) || 0})} /></div>
            <div className="flex items-center gap-3 pt-6">
              <Switch checked={form.isActive} onCheckedChange={v => setForm({...form, isActive: v})} />
              <Label>{isArabic ? "نشط" : "Active"}</Label>
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
