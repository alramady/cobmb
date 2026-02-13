import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MapPin, Plus, Edit, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "@/components/ImageUploader";
import { DataTable, type Column } from "./DataTable";

export function NeighborhoodsTab({ isArabic }: { isArabic: boolean }) {
  const { data: neighborhoods, refetch } = trpc.admin.neighborhoods.list.useQuery();
  const { data: cities } = trpc.admin.cities.list.useQuery();
  const [showCreate, setShowCreate] = useState(false);
  const [editNeighborhood, setEditNeighborhood] = useState<any>(null);

  const columns: Column<any>[] = [
    { key: "id", label: "ID", render: (r) => <span className="text-slate-500">#{r.id}</span> },
    {
      key: "heroImage", label: "Image", labelAr: "الصورة", sortable: false,
      render: (r) => r.heroImage ? (
        <img src={r.heroImage} alt="" className="w-12 h-9 object-cover rounded" />
      ) : (
        <div className="w-12 h-9 bg-slate-100 rounded flex items-center justify-center"><MapPin className="h-4 w-4 text-slate-300" /></div>
      ),
    },
    { key: "nameEn", label: "Name", labelAr: "الاسم", getValue: (r) => isArabic ? r.nameAr : r.nameEn, render: (r) => <span className="font-medium text-[#0B1E2D]">{isArabic ? r.nameAr : r.nameEn}</span> },
    { key: "zone", label: "Zone", labelAr: "المنطقة", render: (r) => r.zone || "—" },
    {
      key: "cityId", label: "City", labelAr: "المدينة",
      render: (r) => {
        const city = cities?.find((c: any) => c.id === r.cityId);
        return <span>{city ? (isArabic ? city.nameAr : city.nameEn) : `#${r.cityId}`}</span>;
      },
    },
    { key: "displayOrder", label: "Order", labelAr: "الترتيب", render: (r) => r.displayOrder ?? "—" },
    {
      key: "isActive", label: "Active", labelAr: "نشط",
      render: (r) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {r.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const cityFilterOptions = cities?.map((c: any) => ({
    value: c.id.toString(),
    label: isArabic ? c.nameAr : c.nameEn,
  })) || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{neighborhoods?.length || 0} {isArabic ? "حي" : "neighborhoods"}</p>
        <Button className="bg-teal-600 hover:bg-teal-500 text-white" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 me-2" /> {isArabic ? "إضافة حي" : "Add Neighborhood"}
        </Button>
      </div>
      <DataTable
        data={neighborhoods}
        columns={columns}
        isArabic={isArabic}
        searchPlaceholder="Search neighborhoods..."
        searchPlaceholderAr="بحث في الأحياء..."
        filters={[
          { key: "cityId", label: "City", labelAr: "المدينة", options: cityFilterOptions },
          {
            key: "isActive", label: "Status", labelAr: "الحالة",
            options: [{ value: "true", label: "Active" }, { value: "false", label: "Inactive" }],
          },
        ]}
        emptyIcon={<MapPin className="h-12 w-12 mx-auto opacity-30" />}
        emptyText="No neighborhoods"
        emptyTextAr="لا توجد أحياء"
        actions={(row) => (
          <Button variant="outline" size="sm" className="h-8" onClick={() => setEditNeighborhood(row)}>
            <Edit className="h-3.5 w-3.5" />
          </Button>
        )}
      />
      {showCreate && <NeighborhoodDialog isArabic={isArabic} cities={cities || []} onClose={() => setShowCreate(false)} onSuccess={() => { setShowCreate(false); refetch(); }} />}
      {editNeighborhood && <NeighborhoodDialog isArabic={isArabic} cities={cities || []} neighborhood={editNeighborhood} onClose={() => setEditNeighborhood(null)} onSuccess={() => { setEditNeighborhood(null); refetch(); }} />}
    </div>
  );
}

function NeighborhoodDialog({ isArabic, cities, neighborhood, onClose, onSuccess }: {
  isArabic: boolean; cities: any[]; neighborhood?: any; onClose: () => void; onSuccess: () => void;
}) {
  const isEdit = !!neighborhood;
  const createNh = trpc.admin.neighborhoods.create.useMutation({
    onSuccess: () => { toast.success(isArabic ? "تم إنشاء الحي" : "Neighborhood created"); onSuccess(); },
    onError: (e) => toast.error(e.message),
  });
  const updateNh = trpc.admin.neighborhoods.update.useMutation({
    onSuccess: () => { toast.success(isArabic ? "تم التحديث" : "Neighborhood updated"); onSuccess(); },
    onError: (e) => toast.error(e.message),
  });

  const existingLandmarks: string[] = neighborhood?.landmarks
    ? (typeof neighborhood.landmarks === "string" ? JSON.parse(neighborhood.landmarks) : (Array.isArray(neighborhood.landmarks) ? neighborhood.landmarks : []))
    : [];

  const [form, setForm] = useState({
    cityId: neighborhood?.cityId?.toString() || "",
    nameEn: neighborhood?.nameEn || "", nameAr: neighborhood?.nameAr || "",
    descriptionEn: neighborhood?.descriptionEn || "", descriptionAr: neighborhood?.descriptionAr || "",
    zone: neighborhood?.zone || "",
    avgAdrPeak: neighborhood?.avgAdrPeak || "", avgAdrHigh: neighborhood?.avgAdrHigh || "", avgAdrLow: neighborhood?.avgAdrLow || "",
    isActive: neighborhood?.isActive ?? true,
    displayOrder: neighborhood?.displayOrder?.toString() || "",
  });
  const [heroImage, setHeroImage] = useState<string[]>(neighborhood?.heroImage ? [neighborhood.heroImage] : []);
  const [landmarks, setLandmarks] = useState<string[]>(existingLandmarks);
  const [newLandmark, setNewLandmark] = useState("");

  const addLandmark = () => {
    const trimmed = newLandmark.trim();
    if (trimmed && !landmarks.includes(trimmed)) {
      setLandmarks((prev) => [...prev, trimmed]);
      setNewLandmark("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      updateNh.mutate({
        id: neighborhood.id,
        nameEn: form.nameEn, nameAr: form.nameAr,
        descriptionEn: form.descriptionEn, descriptionAr: form.descriptionAr,
        heroImage: heroImage[0] || undefined, zone: form.zone,
        avgAdrPeak: form.avgAdrPeak || undefined, avgAdrHigh: form.avgAdrHigh || undefined, avgAdrLow: form.avgAdrLow || undefined,
        isActive: form.isActive,
        displayOrder: form.displayOrder ? parseInt(form.displayOrder) : undefined,
        landmarks: JSON.stringify(landmarks),
      });
    } else {
      const slug = form.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      createNh.mutate({
        cityId: parseInt(form.cityId),
        nameEn: form.nameEn, nameAr: form.nameAr, slug,
        descriptionEn: form.descriptionEn, descriptionAr: form.descriptionAr,
        heroImage: heroImage[0] || undefined, zone: form.zone,
        avgAdrPeak: form.avgAdrPeak || undefined, avgAdrHigh: form.avgAdrHigh || undefined, avgAdrLow: form.avgAdrLow || undefined,
        isActive: form.isActive,
        displayOrder: form.displayOrder ? parseInt(form.displayOrder) : undefined,
      });
    }
  };

  const isPending = createNh.isPending || updateNh.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? (isArabic ? "تعديل الحي" : "Edit Neighborhood") : (isArabic ? "إضافة حي" : "Add Neighborhood")}
            {isEdit && `: ${neighborhood.nameEn}`}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="text-sm font-semibold mb-2 block">{isArabic ? "صورة الغلاف" : "Hero Image"}</Label>
            <ImageUploader images={heroImage} onChange={setHeroImage} folder="neighborhoods" single />
          </div>
          {!isEdit && (
            <div>
              <Label>City</Label>
              <Select value={form.cityId} onValueChange={(v) => setForm({ ...form, cityId: v })}>
                <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                <SelectContent>{cities.map((c: any) => <SelectItem key={c.id} value={c.id.toString()}>{c.nameEn}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Name (EN)</Label><Input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required /></div>
            <div><Label>Name (AR)</Label><Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} required dir="rtl" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Description (EN)</Label><Textarea value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} rows={3} /></div>
            <div><Label>Description (AR)</Label><Textarea value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} rows={3} dir="rtl" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Zone</Label><Input value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} /></div>
            <div><Label>Display Order</Label><Input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })} placeholder="0" /></div>
          </div>

          {/* Pricing */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">{isArabic ? "متوسط الأسعار (ريال)" : "Average Daily Rate (SAR)"}</Label>
            <div className="grid grid-cols-3 gap-4">
              <div><Label className="text-xs text-slate-500">Peak Season</Label><Input value={form.avgAdrPeak} onChange={(e) => setForm({ ...form, avgAdrPeak: e.target.value })} placeholder="e.g. 800" /></div>
              <div><Label className="text-xs text-slate-500">High Season</Label><Input value={form.avgAdrHigh} onChange={(e) => setForm({ ...form, avgAdrHigh: e.target.value })} placeholder="e.g. 600" /></div>
              <div><Label className="text-xs text-slate-500">Low Season</Label><Input value={form.avgAdrLow} onChange={(e) => setForm({ ...form, avgAdrLow: e.target.value })} placeholder="e.g. 400" /></div>
            </div>
          </div>

          {/* Landmarks */}
          {isEdit && (
            <div>
              <Label className="text-sm font-semibold mb-2 block">{isArabic ? "المعالم" : "Landmarks"}</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {landmarks.map((l, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 inline-flex items-center gap-1">
                    {l}
                    <button type="button" onClick={() => setLandmarks((prev) => prev.filter((_, j) => j !== i))} className="hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={newLandmark} onChange={(e) => setNewLandmark(e.target.value)} placeholder={isArabic ? "إضافة معلم..." : "Add landmark..."} className="max-w-xs" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLandmark(); } }} />
                <Button type="button" variant="outline" size="sm" onClick={addLandmark}>Add</Button>
              </div>
            </div>
          )}

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
            <Label>{isArabic ? "نشط" : "Active"}</Label>
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
