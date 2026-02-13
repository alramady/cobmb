import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { TabProps } from "./shared";

export default function AdminUsersTab({ isArabic }: TabProps) {
  const { data: admins, refetch } = trpc.admin.adminUsers.list.useQuery();
  const deleteAdmin = trpc.admin.adminUsers.delete.useMutation({
    onSuccess: () => { refetch(); toast.success(isArabic ? "تم التعطيل" : "Admin deactivated"); },
  });
  const [showCreate, setShowCreate] = useState(false);
  const [editAdmin, setEditAdmin] = useState<any>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{admins?.length || 0} {isArabic ? "مسؤول" : "admin users"}</p>
        <Button className="bg-teal-600 hover:bg-teal-500 text-white" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 me-2" /> {isArabic ? "إضافة مسؤول" : "Add Admin"}
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-start p-3 font-medium text-slate-600">ID</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "اسم المستخدم" : "Username"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الاسم" : "Full Name"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "البريد" : "Email"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الدور" : "Role"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "نشط" : "Active"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "آخر دخول" : "Last Login"}</th>
                <th className="text-end p-3 font-medium text-slate-600">{isArabic ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {admins?.map((a: any) => (
                <tr key={a.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="p-3 text-slate-500">#{a.id}</td>
                  <td className="p-3 font-medium text-[#0B1E2D]">{a.username}</td>
                  <td className="p-3 text-slate-600">{a.fullName}</td>
                  <td className="p-3 text-slate-600">{a.email || "—"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      a.role === "root" ? "bg-red-100 text-red-700" : a.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                    }`}>{a.role}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {a.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 text-xs">{a.lastLogin ? new Date(a.lastLogin).toLocaleDateString() : "—"}</td>
                  <td className="p-3 text-end space-x-1">
                    <Button variant="outline" size="sm" className="h-8" onClick={() => setEditAdmin(a)}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 h-8"
                      onClick={() => { if (confirm(isArabic ? "تعطيل هذا المسؤول؟" : "Deactivate this admin?")) deleteAdmin.mutate({ id: a.id }); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!admins || admins.length === 0) && (
            <div className="p-12 text-center text-slate-400">
              <Shield className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>{isArabic ? "لا يوجد مسؤولين" : "No admin users"}</p>
            </div>
          )}
        </div>
      </div>
      {showCreate && <AdminDialog isArabic={isArabic} onClose={() => setShowCreate(false)} onSuccess={() => { setShowCreate(false); refetch(); }} />}
      {editAdmin && <AdminDialog isArabic={isArabic} admin={editAdmin} onClose={() => setEditAdmin(null)} onSuccess={() => { setEditAdmin(null); refetch(); }} />}
    </div>
  );
}

function AdminDialog({ isArabic, admin, onClose, onSuccess }: {
  isArabic: boolean; admin?: any; onClose: () => void; onSuccess: () => void;
}) {
  const isEdit = !!admin;
  const createAdmin = trpc.admin.adminUsers.create.useMutation({
    onSuccess: () => { toast.success(isArabic ? "تم إنشاء المسؤول" : "Admin created"); onSuccess(); },
    onError: (e) => toast.error(e.message),
  });
  const updateAdmin = trpc.admin.adminUsers.update.useMutation({
    onSuccess: () => { toast.success(isArabic ? "تم تحديث المسؤول" : "Admin updated"); onSuccess(); },
    onError: (e) => toast.error(e.message),
  });

  const [form, setForm] = useState({
    username: admin?.username || "", password: "",
    fullName: admin?.fullName || "", displayName: admin?.displayName || "",
    email: admin?.email || "", mobile: admin?.mobile || "",
    role: admin?.role || "admin",
    isActive: admin?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      const data: any = { id: admin.id, fullName: form.fullName, displayName: form.displayName, email: form.email, mobile: form.mobile, role: form.role, isActive: form.isActive };
      if (form.password) data.password = form.password;
      updateAdmin.mutate(data);
    } else {
      if (!form.password || form.password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
      createAdmin.mutate(form);
    }
  };

  const isPending = createAdmin.isPending || updateAdmin.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? (isArabic ? "تعديل المسؤول" : "Edit Admin") : (isArabic ? "إضافة مسؤول" : "Add Admin")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isEdit && <div><Label>Username</Label><Input value={form.username} onChange={e => setForm({...form, username: e.target.value})} required /></div>}
          <div>
            <Label>{isEdit ? "New Password (leave blank to keep)" : "Password"}</Label>
            <Input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={!isEdit} minLength={8} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Full Name</Label><Input value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required /></div>
            <div><Label>Display Name</Label><Input value={form.displayName} onChange={e => setForm({...form, displayName: e.target.value})} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
            <div><Label>Mobile</Label><Input value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Role</Label>
              <Select value={form.role} onValueChange={v => setForm({...form, role: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">Root</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isEdit && (
              <div className="flex items-center gap-3 pt-6">
                <Switch checked={form.isActive} onCheckedChange={v => setForm({...form, isActive: v})} />
                <Label>{isArabic ? "نشط" : "Active"}</Label>
              </div>
            )}
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
