import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Users } from "lucide-react";
import { toast } from "sonner";
import type { TabProps } from "./shared";

export default function ClientUsersTab({ isArabic }: TabProps) {
  const { data: clients, refetch } = trpc.admin.clientUsers.list.useQuery();
  const updateClient = trpc.admin.clientUsers.update.useMutation({
    onSuccess: () => { refetch(); toast.success(isArabic ? "تم التحديث" : "Updated"); },
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">{clients?.length || 0} {isArabic ? "عميل مسجل" : "registered clients"}</p>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-start p-3 font-medium text-slate-600">ID</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الاسم" : "Name"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "البريد" : "Email"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الهاتف" : "Phone"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الدور" : "Role"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "نشط" : "Active"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "آخر دخول" : "Last Login"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "التسجيل" : "Joined"}</th>
              </tr>
            </thead>
            <tbody>
              {clients?.map((c: any) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="p-3 text-slate-500">#{c.id}</td>
                  <td className="p-3 font-medium text-[#0B1E2D]">{c.firstName} {c.lastName}</td>
                  <td className="p-3 text-slate-600">{c.email}</td>
                  <td className="p-3 text-slate-600">{c.phone || "—"}</td>
                  <td className="p-3">
                    <Select value={c.role} onValueChange={(v) => updateClient.mutate({ id: c.id, role: v as any })}>
                      <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guest">Guest</SelectItem>
                        <SelectItem value="owner">Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    <Switch checked={c.isActive} onCheckedChange={(v) => updateClient.mutate({ id: c.id, isActive: v })} />
                  </td>
                  <td className="p-3 text-slate-500 text-xs">{c.lastLogin ? new Date(c.lastLogin).toLocaleDateString() : "—"}</td>
                  <td className="p-3 text-slate-500 text-xs">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!clients || clients.length === 0) && (
            <div className="p-12 text-center text-slate-400">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>{isArabic ? "لا يوجد عملاء مسجلين" : "No registered clients"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
