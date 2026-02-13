import { trpc } from "@/lib/trpc";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star } from "lucide-react";
import { toast } from "sonner";
import type { TabProps } from "./shared";

export default function ReviewsTab({ isArabic }: TabProps) {
  const { data: reviews, refetch } = trpc.admin.reviews.list.useQuery();
  const updateStatus = trpc.admin.reviews.updateStatus.useMutation({
    onSuccess: () => { refetch(); toast.success(isArabic ? "تم التحديث" : "Status updated"); },
  });

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">{reviews?.length || 0} {isArabic ? "تقييم" : "reviews"}</p>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-start p-3 font-medium text-slate-600">ID</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "العقار" : "Property"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الضيف" : "Guest"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "التقييم" : "Rating"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "التعليق" : "Comment"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الحالة" : "Status"}</th>
                <th className="text-end p-3 font-medium text-slate-600">{isArabic ? "تغيير" : "Update"}</th>
              </tr>
            </thead>
            <tbody>
              {reviews?.map((r: any) => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="p-3 text-slate-500">#{r.id}</td>
                  <td className="p-3 font-medium text-[#0B1E2D]">Property #{r.propertyId}</td>
                  <td className="p-3 text-slate-600">Guest #{r.guestId}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"}`} />
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-slate-600 max-w-xs truncate">{r.comment || "—"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] || "bg-slate-100 text-slate-600"}`}>{r.status}</span>
                  </td>
                  <td className="p-3 text-end">
                    <Select value={r.status} onValueChange={(v) => updateStatus.mutate({ id: r.id, status: v as any })}>
                      <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!reviews || reviews.length === 0) && (
            <div className="p-12 text-center text-slate-400">
              <Star className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>{isArabic ? "لا توجد تقييمات" : "No reviews"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
