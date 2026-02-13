import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3 } from "lucide-react";
import { toast } from "sonner";
import type { TabProps } from "./shared";

export default function BookingsTab({ isArabic }: TabProps) {
  const { data: bookings, refetch } = trpc.admin.bookings.list.useQuery();
  const updateStatus = trpc.admin.bookings.updateStatus.useMutation({
    onSuccess: () => { refetch(); toast.success(isArabic ? "تم التحديث" : "Status updated"); },
  });

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    checked_in: "bg-blue-100 text-blue-700",
    checked_out: "bg-slate-100 text-slate-600",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">{bookings?.length || 0} {isArabic ? "حجز" : "bookings"}</p>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-start p-3 font-medium text-slate-600">ID</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "العقار" : "Property"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الضيف" : "Guest"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الوصول" : "Check-in"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "المغادرة" : "Check-out"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الضيوف" : "Guests"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الحالة" : "Status"}</th>
                <th className="text-end p-3 font-medium text-slate-600">{isArabic ? "تغيير الحالة" : "Update"}</th>
              </tr>
            </thead>
            <tbody>
              {bookings?.map((b: any) => (
                <tr key={b.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="p-3 text-slate-500">#{b.id}</td>
                  <td className="p-3 font-medium text-[#0B1E2D]">Property #{b.propertyId}</td>
                  <td className="p-3 text-slate-600">Guest #{b.guestId}</td>
                  <td className="p-3 text-slate-600 text-xs">{b.checkIn ? new Date(b.checkIn).toLocaleDateString() : "—"}</td>
                  <td className="p-3 text-slate-600 text-xs">{b.checkOut ? new Date(b.checkOut).toLocaleDateString() : "—"}</td>
                  <td className="p-3 text-slate-600">{b.guests || 1}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[b.status] || "bg-slate-100 text-slate-600"}`}>{b.status}</span>
                  </td>
                  <td className="p-3 text-end">
                    <Select value={b.status} onValueChange={(v) => updateStatus.mutate({ id: b.id, status: v as any })}>
                      <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="checked_in">Checked In</SelectItem>
                        <SelectItem value="checked_out">Checked Out</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!bookings || bookings.length === 0) && (
            <div className="p-12 text-center text-slate-400">
              <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>{isArabic ? "لا توجد حجوزات" : "No bookings"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
