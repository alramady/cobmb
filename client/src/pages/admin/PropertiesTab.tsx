import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Building2, Plus, Trash2, Edit, Loader2, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "@/components/ImageUploader";
import { DataTable, type Column } from "./DataTable";

const COMMON_AMENITIES = [
  "WiFi", "Parking", "Pool", "Gym", "Kitchen", "Washer", "Dryer", "AC",
  "TV", "Workspace", "Balcony", "Elevator", "Security", "Garden",
  "BBQ Area", "Kids Play Area", "Maid Room", "Storage", "Smart Home",
  "Concierge", "Room Service", "Spa", "Sauna", "Jacuzzi",
];

export function PropertiesTab({ isArabic }: { isArabic: boolean }) {
  const { data: properties, refetch } = trpc.admin.properties.list.useQuery();
  const deleteProp = trpc.admin.properties.delete.useMutation({
    onSuccess: () => { refetch(); toast.success(isArabic ? "تم الحذف" : "Property deleted"); },
  });
  const [showCreate, setShowCreate] = useState(false);
  const [editProperty, setEditProperty] = useState<any>(null);

  const columns: Column<any>[] = [
    { key: "id", label: "ID", render: (r) => <span className="text-slate-500">#{r.id}</span> },
    {
      key: "images", label: "Image", labelAr: "الصورة", sortable: false,
      render: (r) => {
        const imgs = typeof r.images === "string" ? JSON.parse(r.images || "[]") : (r.images || []);
        return imgs[0] ? (
          <img src={imgs[0]} alt="" className="w-12 h-9 object-cover rounded" />
        ) : (
          <div className="w-12 h-9 bg-slate-100 rounded flex items-center justify-center">
            <Building2 className="h-4 w-4 text-slate-300" />
          </div>
        );
      },
    },
    { key: "titleEn", label: "Title", labelAr: "العنوان", getValue: (r) => isArabic ? r.titleAr : r.titleEn, render: (r) => <span className="font-medium text-[#0B1E2D]">{isArabic ? r.titleAr : r.titleEn}</span> },
    { key: "propertyType", label: "Type", labelAr: "النوع" },
    {
      key: "status", label: "Status", labelAr: "الحالة",
      render: (r) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          r.status === "active" ? "bg-green-100 text-green-700" : r.status === "draft" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
        }`}>{r.status}</span>
      ),
    },
    { key: "isFeatured", label: "Featured", labelAr: "مميز", render: (r) => r.isFeatured ? "⭐" : "—" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{properties?.length || 0} {isArabic ? "عقار" : "properties"}</p>
        <Button className="bg-teal-600 hover:bg-teal-500 text-white" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 me-2" /> {isArabic ? "إضافة عقار" : "Add Property"}
        </Button>
      </div>
      <DataTable
        data={properties}
        columns={columns}
        isArabic={isArabic}
        searchPlaceholder="Search properties..."
        searchPlaceholderAr="بحث في العقارات..."
        filters={[
          {
            key: "status", label: "Status", labelAr: "الحالة",
            options: [
              { value: "draft", label: "Draft" },
              { value: "active", label: "Active" },
              { value: "maintenance", label: "Maintenance" },
              { value: "inactive", label: "Inactive" },
            ],
          },
          {
            key: "propertyType", label: "Type", labelAr: "النوع",
            options: ["studio", "1br", "2br", "3br", "4br", "villa", "penthouse"].map((t) => ({ value: t, label: t })),
          },
        ]}
        emptyIcon={<Building2 className="h-12 w-12 mx-auto opacity-30" />}
        emptyText="No properties"
        emptyTextAr="لا توجد عقارات"
        actions={(row) => (
          <>
            <Button variant="outline" size="sm" className="h-8" onClick={() => window.open(`/properties/${row.id}`, "_blank")}>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="sm" className="h-8" onClick={() => setEditProperty(row)}>
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 h-8"
              onClick={() => { if (confirm("Delete?")) deleteProp.mutate({ id: row.id }); }}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      />
      {showCreate && <PropertyDialog isArabic={isArabic} onClose={() => setShowCreate(false)} onSuccess={() => { setShowCreate(false); refetch(); }} />}
      {editProperty && <PropertyDialog isArabic={isArabic} property={editProperty} onClose={() => setEditProperty(null)} onSuccess={() => { setEditProperty(null); refetch(); }} />}
    </div>
  );
}

function PropertyDialog({ isArabic, property, onClose, onSuccess }: {
  isArabic: boolean; property?: any; onClose: () => void; onSuccess: () => void;
}) {
  const isEdit = !!property;
  const { data: citiesList } = trpc.admin.cities.list.useQuery();
  const { data: nhList } = trpc.admin.neighborhoods.list.useQuery();
  const createProp = trpc.admin.properties.create.useMutation({
    onSuccess: () => { toast.success(isArabic ? "تم إنشاء العقار" : "Property created"); onSuccess(); },
    onError: (e) => toast.error(e.message),
  });
  const updateProp = trpc.admin.properties.update.useMutation({
    onSuccess: () => { toast.success(isArabic ? "تم تحديث العقار" : "Property updated"); onSuccess(); },
    onError: (e) => toast.error(e.message),
  });

  const existingImages = property?.images ? (typeof property.images === "string" ? JSON.parse(property.images) : property.images) : [];
  const existingAmenities: string[] = property?.amenities
    ? (typeof property.amenities === "string" ? JSON.parse(property.amenities) : property.amenities)
    : [];

  const [form, setForm] = useState({
    titleEn: property?.titleEn || "", titleAr: property?.titleAr || "",
    descriptionEn: property?.descriptionEn || "", descriptionAr: property?.descriptionAr || "",
    cityId: property?.cityId?.toString() || "", neighborhoodId: property?.neighborhoodId?.toString() || "",
    propertyType: property?.propertyType || "2br",
    bedrooms: property?.bedrooms?.toString() || "2", bathrooms: property?.bathrooms?.toString() || "1",
    maxGuests: property?.maxGuests?.toString() || "4", sizeSqm: property?.sizeSqm || "",
    priceNightly: property?.priceNightly || "",
    pricePeak: property?.pricePeak || "", priceHigh: property?.priceHigh || "", priceLow: property?.priceLow || "",
    status: property?.status || "draft",
    isFeatured: property?.isFeatured || false,
    latitude: property?.latitude || "", longitude: property?.longitude || "",
  });
  const [images, setImages] = useState<string[]>(existingImages);
  const [amenities, setAmenities] = useState<string[]>(existingAmenities);
  const [customAmenity, setCustomAmenity] = useState("");

  const filteredNh = nhList?.filter((n: any) => n.cityId === parseInt(form.cityId)) || [];

  const toggleAmenity = (a: string) => {
    setAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  };

  const addCustomAmenity = () => {
    const trimmed = customAmenity.trim();
    if (trimmed && !amenities.includes(trimmed)) {
      setAmenities((prev) => [...prev, trimmed]);
      setCustomAmenity("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      titleEn: form.titleEn, titleAr: form.titleAr,
      descriptionEn: form.descriptionEn, descriptionAr: form.descriptionAr,
      cityId: parseInt(form.cityId), neighborhoodId: parseInt(form.neighborhoodId),
      propertyType: form.propertyType as any,
      bedrooms: parseInt(form.bedrooms) || undefined, bathrooms: parseInt(form.bathrooms) || undefined,
      maxGuests: parseInt(form.maxGuests) || undefined, sizeSqm: form.sizeSqm || undefined,
      priceNightly: form.priceNightly || undefined,
      pricePeak: form.pricePeak || undefined, priceHigh: form.priceHigh || undefined, priceLow: form.priceLow || undefined,
      images: JSON.stringify(images),
      amenities: JSON.stringify(amenities),
      isFeatured: form.isFeatured,
      latitude: form.latitude || undefined, longitude: form.longitude || undefined,
    };
    if (isEdit) {
      updateProp.mutate({ id: property.id, ...data, status: form.status as any });
    } else {
      createProp.mutate(data);
    }
  };

  const isPending = createProp.isPending || updateProp.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? (isArabic ? "تعديل العقار" : "Edit Property") : (isArabic ? "إضافة عقار" : "Add Property")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="text-sm font-semibold mb-2 block">{isArabic ? "صور العقار" : "Property Images"}</Label>
            <ImageUploader images={images} onChange={setImages} folder="properties" maxFiles={20} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Title (EN)</Label><Input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} required /></div>
            <div><Label>Title (AR)</Label><Input value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} required dir="rtl" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Description (EN)</Label><Textarea value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} rows={3} /></div>
            <div><Label>Description (AR)</Label><Textarea value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} rows={3} dir="rtl" /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>City</Label>
              <Select value={form.cityId} onValueChange={(v) => setForm({ ...form, cityId: v, neighborhoodId: "" })}>
                <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                <SelectContent>{citiesList?.map((c: any) => <SelectItem key={c.id} value={c.id.toString()}>{c.nameEn}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Neighborhood</Label>
              <Select value={form.neighborhoodId} onValueChange={(v) => setForm({ ...form, neighborhoodId: v })}>
                <SelectTrigger><SelectValue placeholder="Select neighborhood" /></SelectTrigger>
                <SelectContent>{filteredNh.map((n: any) => <SelectItem key={n.id} value={n.id.toString()}>{n.nameEn}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Property Type</Label>
              <Select value={form.propertyType} onValueChange={(v) => setForm({ ...form, propertyType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["studio", "1br", "2br", "3br", "4br", "villa", "penthouse"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div><Label>Bedrooms</Label><Input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} /></div>
            <div><Label>Bathrooms</Label><Input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} /></div>
            <div><Label>Max Guests</Label><Input type="number" value={form.maxGuests} onChange={(e) => setForm({ ...form, maxGuests: e.target.value })} /></div>
            <div><Label>Size (sqm)</Label><Input value={form.sizeSqm} onChange={(e) => setForm({ ...form, sizeSqm: e.target.value })} placeholder="e.g. 120" /></div>
          </div>
          {/* Nightly Rate - shown to guests */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">{isArabic ? "السعر الليلي (يظهر للضيوف)" : "Nightly Rate (Shown to Guests)"}</Label>
            <div className="max-w-xs">
              <Input value={form.priceNightly} onChange={(e) => setForm({ ...form, priceNightly: e.target.value })} placeholder={isArabic ? "مثال: 500" : "e.g. 500"} className="text-lg font-semibold" />
              <p className="text-xs text-muted-foreground mt-1">{isArabic ? "هذا السعر يظهر في صفحة العقار كـ 'ابتداءً من X ر.س / الليلة'" : "This price is displayed on the property page as 'Starting from X SAR / night'"}</p>
            </div>
          </div>
          {/* Internal Seasonal Pricing - not shown to guests */}
          <div>
            <Label className="text-sm font-semibold mb-2 block text-slate-400">{isArabic ? "أسعار الموسم (داخلي فقط - لا يظهر للضيوف)" : "Seasonal Pricing (Internal Only - Not Shown to Guests)"}</Label>
            <div className="grid grid-cols-3 gap-4 opacity-70">
              <div><Label className="text-xs text-slate-400">Peak (SAR)</Label><Input value={form.pricePeak} onChange={(e) => setForm({ ...form, pricePeak: e.target.value })} className="border-dashed" /></div>
              <div><Label className="text-xs text-slate-400">High (SAR)</Label><Input value={form.priceHigh} onChange={(e) => setForm({ ...form, priceHigh: e.target.value })} className="border-dashed" /></div>
              <div><Label className="text-xs text-slate-400">Low (SAR)</Label><Input value={form.priceLow} onChange={(e) => setForm({ ...form, priceLow: e.target.value })} className="border-dashed" /></div>
            </div>
          </div>

          {/* Amenities Editor */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">{isArabic ? "المرافق" : "Amenities"}</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {COMMON_AMENITIES.map((a) => (
                <button key={a} type="button" onClick={() => toggleAmenity(a)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    amenities.includes(a)
                      ? "bg-teal-50 text-teal-700 border-teal-300"
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                  }`}>
                  {amenities.includes(a) ? "✓ " : ""}{a}
                </button>
              ))}
            </div>
            {/* Custom amenities */}
            {amenities.filter((a) => !COMMON_AMENITIES.includes(a)).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {amenities.filter((a) => !COMMON_AMENITIES.includes(a)).map((a) => (
                  <span key={a} className="px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-300 inline-flex items-center gap-1">
                    {a}
                    <button type="button" onClick={() => setAmenities((prev) => prev.filter((x) => x !== a))} className="hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input value={customAmenity} onChange={(e) => setCustomAmenity(e.target.value)} placeholder={isArabic ? "إضافة مرفق مخصص..." : "Add custom amenity..."} className="max-w-xs" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomAmenity(); } }} />
              <Button type="button" variant="outline" size="sm" onClick={addCustomAmenity}>Add</Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div><Label>Latitude</Label><Input value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} /></div>
            <div><Label>Longitude</Label><Input value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} /></div>
            {isEdit && (
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={form.isFeatured} onCheckedChange={(v) => setForm({ ...form, isFeatured: v })} />
            <Label>{isArabic ? "عقار مميز" : "Featured Property"}</Label>
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
