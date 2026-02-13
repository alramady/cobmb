import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import ImageUploader from "@/components/ImageUploader";
import { Plus, Edit, Trash2, Handshake, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { TabProps } from "./shared";

export default function PartnersTab({ isArabic }: TabProps) {
  const { data: partners, refetch } = trpc.admin.partners.list.useQuery();
  const deletePartner = trpc.admin.partners.delete.useMutation({
    onSuccess: () => { refetch(); toast.success(isArabic ? "تم الحذف" : "Partner deleted"); },
  });
  const [showCreate, setShowCreate] = useState(false);
  const [editPartner, setEditPartner] = useState<any>(null);

  const categoryLabels: Record<string, string> = { press: "Press", client: "Client", ota: "OTA", award: "Award" };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{partners?.length || 0} {isArabic ? "شريك" : "partners"}</p>
        <Button className="bg-teal-600 hover:bg-teal-500 text-white" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 me-2" /> {isArabic ? "إضافة شريك" : "Add Partner"}
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-start p-3 font-medium text-slate-600">ID</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الشعار" : "Logo"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الاسم" : "Name"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الفئة" : "Category"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الرابط" : "URL"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "نشط" : "Active"}</th>
                <th className="text-end p-3 font-medium text-slate-600">{isArabic ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {partners?.map((p: any) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="p-3 text-slate-500">#{p.id}</td>
                  <td className="p-3">
                    {p.logo ? (
                      <img src={p.logo} alt="" className="w-12 h-9 object-contain rounded bg-white border" />
                    ) : (
                      <div className="w-12 h-9 bg-slate-100 rounded flex items-center justify-center">
                        <Handshake className="h-4 w-4 text-slate-300" />
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-medium text-[#0B1E2D]">{isArabic ? p.nameAr : p.nameEn}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      {categoryLabels[p.category] || p.category}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 text-xs max-w-[200px] truncate">{p.url || "—"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 text-end space-x-1">
                    <Button variant="outline" size="sm" className="h-8" onClick={() => setEditPartner(p)}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 h-8"
                      onClick={() => { if (confirm("Delete?")) deletePartner.mutate({ id: p.id }); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!partners || partners.length === 0) && (
            <div className="p-12 text-center text-slate-400">
              <Handshake className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>{isArabic ? "لا يوجد شركاء" : "No partners"}</p>
            </div>
          )}
        </div>
      </div>
      {showCreate && <PartnerDialog isArabic={isArabic} onClose={() => setShowCreate(false)} onSuccess={() => { setShowCreate(false); refetch(); }} />}
      {editPartner && <PartnerDialog isArabic={isArabic} partner={editPartner} onClose={() => setEditPartner(null)} onSuccess={() => { setEditPartner(null); refetch(); }} />}
    </div>
  );
}

function PartnerDialog({ isArabic, partner, onClose, onSuccess }: {
  isArabic: boolean; partner?: any; onClose: () => void; onSuccess: () => void;
}) {
  const isEdit = !!partner;
  const createPartner = trpc.admin.partners.create.useMutation({
    onSuccess: () => { toast.success(isArabic ? "تم إنشاء الشريك" : "Partner created"); onSuccess(); },
    onError: (e) => toast.error(e.message),
  });
  const updatePartner = trpc.admin.partners.update.useMutation({
    onSuccess: () => { toast.success(isArabic ? "تم تحديث الشريك" : "Partner updated"); onSuccess(); },
    onError: (e) => toast.error(e.message),
  });

  const [form, setForm] = useState({
    nameEn: partner?.nameEn || "", nameAr: partner?.nameAr || "",
    category: partner?.category || "client",
    url: partner?.url || "",
    displayOrder: partner?.displayOrder ?? 0,
    isActive: partner?.isActive ?? true,
  });
  const [logo, setLogo] = useState<string[]>(partner?.logo ? [partner.logo] : []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      updatePartner.mutate({ id: partner.id, ...form, logo: logo[0] || undefined });
    } else {
      createPartner.mutate({ ...form, logo: logo[0] || undefined });
    }
  };

  const isPending = createPartner.isPending || updatePartner.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? (isArabic ? "تعديل الشريك" : "Edit Partner") : (isArabic ? "إضافة شريك" : "Add Partner")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm font-semibold mb-2 block">{isArabic ? "الشعار" : "Logo"}</Label>
            <ImageUploader images={logo} onChange={setLogo} folder="partners" single />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Name (EN)</Label><Input value={form.nameEn} onChange={e => setForm({...form, nameEn: e.target.value})} required /></div>
            <div><Label>Name (AR)</Label><Input value={form.nameAr} onChange={e => setForm({...form, nameAr: e.target.value})} required dir="rtl" /></div>
          </div>
          <div>
            <Label>Category</Label>
            <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="press">Press / Media</SelectItem>
                <SelectItem value="client">Client / Corporate</SelectItem>
                <SelectItem value="ota">OTA / Travel Platform</SelectItem>
                <SelectItem value="award">Award / Certification</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Website URL</Label><Input value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="https://..." /></div>
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
