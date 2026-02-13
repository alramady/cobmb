import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ImageUploader from "@/components/ImageUploader";
import { Plus, Edit, Trash2, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { TabProps } from "./shared";

export default function TeamTab({ isArabic }: TabProps) {
  const { data: members, refetch } = trpc.admin.team.list.useQuery();
  const deleteMember = trpc.admin.team.delete.useMutation({
    onSuccess: () => { refetch(); toast.success(isArabic ? "تم الحذف" : "Member deleted"); },
  });
  const [showCreate, setShowCreate] = useState(false);
  const [editMember, setEditMember] = useState<any>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{members?.length || 0} {isArabic ? "عضو" : "team members"}</p>
        <Button className="bg-teal-600 hover:bg-teal-500 text-white" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 me-2" /> {isArabic ? "إضافة عضو" : "Add Member"}
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-start p-3 font-medium text-slate-600">ID</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الصورة" : "Photo"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الاسم" : "Name"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "المنصب" : "Role"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "نشط" : "Active"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الترتيب" : "Order"}</th>
                <th className="text-end p-3 font-medium text-slate-600">{isArabic ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {members?.map((m: any) => (
                <tr key={m.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="p-3 text-slate-500">#{m.id}</td>
                  <td className="p-3">
                    {m.image ? (
                      <img src={m.image} alt="" className="w-10 h-10 object-cover rounded-full" />
                    ) : (
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-slate-300" />
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-medium text-[#0B1E2D]">{isArabic ? m.nameAr : m.nameEn}</td>
                  <td className="p-3 text-slate-600">{isArabic ? m.roleAr : m.roleEn}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {m.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{m.displayOrder}</td>
                  <td className="p-3 text-end space-x-1">
                    <Button variant="outline" size="sm" className="h-8" onClick={() => setEditMember(m)}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 h-8"
                      onClick={() => { if (confirm("Delete?")) deleteMember.mutate({ id: m.id }); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!members || members.length === 0) && (
            <div className="p-12 text-center text-slate-400">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>{isArabic ? "لا يوجد أعضاء" : "No team members"}</p>
            </div>
          )}
        </div>
      </div>
      {showCreate && <TeamDialog isArabic={isArabic} onClose={() => setShowCreate(false)} onSuccess={() => { setShowCreate(false); refetch(); }} />}
      {editMember && <TeamDialog isArabic={isArabic} member={editMember} onClose={() => setEditMember(null)} onSuccess={() => { setEditMember(null); refetch(); }} />}
    </div>
  );
}

function TeamDialog({ isArabic, member, onClose, onSuccess }: {
  isArabic: boolean; member?: any; onClose: () => void; onSuccess: () => void;
}) {
  const isEdit = !!member;
  const createMember = trpc.admin.team.create.useMutation({
    onSuccess: () => { toast.success(isArabic ? "تم إنشاء العضو" : "Member created"); onSuccess(); },
    onError: (e) => toast.error(e.message),
  });
  const updateMember = trpc.admin.team.update.useMutation({
    onSuccess: () => { toast.success(isArabic ? "تم تحديث العضو" : "Member updated"); onSuccess(); },
    onError: (e) => toast.error(e.message),
  });

  const [form, setForm] = useState({
    nameEn: member?.nameEn || "", nameAr: member?.nameAr || "",
    roleEn: member?.roleEn || "", roleAr: member?.roleAr || "",
    bioEn: member?.bioEn || "", bioAr: member?.bioAr || "",
    displayOrder: member?.displayOrder ?? 0,
    isActive: member?.isActive ?? true,
  });
  const [image, setImage] = useState<string[]>(member?.image ? [member.image] : []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      updateMember.mutate({ id: member.id, ...form, image: image[0] || undefined });
    } else {
      createMember.mutate({ ...form, image: image[0] || undefined });
    }
  };

  const isPending = createMember.isPending || updateMember.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? (isArabic ? "تعديل العضو" : "Edit Member") : (isArabic ? "إضافة عضو" : "Add Member")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="text-sm font-semibold mb-2 block">{isArabic ? "الصورة" : "Photo"}</Label>
            <ImageUploader images={image} onChange={setImage} folder="team" single />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Name (EN)</Label><Input value={form.nameEn} onChange={e => setForm({...form, nameEn: e.target.value})} required /></div>
            <div><Label>Name (AR)</Label><Input value={form.nameAr} onChange={e => setForm({...form, nameAr: e.target.value})} required dir="rtl" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Role (EN)</Label><Input value={form.roleEn} onChange={e => setForm({...form, roleEn: e.target.value})} /></div>
            <div><Label>Role (AR)</Label><Input value={form.roleAr} onChange={e => setForm({...form, roleAr: e.target.value})} dir="rtl" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Bio (EN)</Label><Textarea value={form.bioEn} onChange={e => setForm({...form, bioEn: e.target.value})} rows={3} /></div>
            <div><Label>Bio (AR)</Label><Textarea value={form.bioAr} onChange={e => setForm({...form, bioAr: e.target.value})} rows={3} dir="rtl" /></div>
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
