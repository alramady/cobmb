import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MessageSquare, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type Column } from "./DataTable";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-700" },
  contacted: { label: "Contacted", color: "bg-indigo-100 text-indigo-700" },
  site_visit: { label: "Site Visit", color: "bg-purple-100 text-purple-700" },
  quote: { label: "Quote", color: "bg-amber-100 text-amber-700" },
  signed: { label: "Signed", color: "bg-teal-100 text-teal-700" },
  live: { label: "Live", color: "bg-green-100 text-green-700" },
  closed: { label: "Closed", color: "bg-slate-100 text-slate-600" },
};

const INQUIRY_TYPES = ["owner", "guest", "booking", "general", "rental_forecast"];

export function InquiriesTab({ isArabic }: { isArabic: boolean }) {
  const { data: inquiries, refetch } = trpc.admin.inquiries.list.useQuery();
  const { data: adminUsers } = trpc.admin.adminUsers.list.useQuery();
  const [viewInquiry, setViewInquiry] = useState<any>(null);

  const columns: Column<any>[] = [
    { key: "id", label: "ID", render: (r) => <span className="text-slate-500">#{r.id}</span> },
    { key: "name", label: "Name", labelAr: "الاسم", render: (r) => <span className="font-medium text-[#0B1E2D]">{r.name}</span> },
    { key: "email", label: "Email", labelAr: "البريد", className: "text-slate-600 max-w-[180px] truncate" },
    { key: "phone", label: "Phone", labelAr: "الهاتف", render: (r) => r.phone || "—" },
    {
      key: "inquiryType", label: "Type", labelAr: "النوع",
      render: (r) => (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 capitalize">
          {r.inquiryType?.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "status", label: "Status", labelAr: "الحالة",
      render: (r) => {
        const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.new;
        return <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.color}`}>{cfg.label}</span>;
      },
    },
    {
      key: "assignedTo", label: "Assigned", labelAr: "مسند إلى",
      render: (r) => {
        if (!r.assignedTo) return <span className="text-slate-400">—</span>;
        const admin = adminUsers?.find((a: any) => a.id === r.assignedTo);
        return <span className="text-xs">{admin?.displayName || `#${r.assignedTo}`}</span>;
      },
    },
    {
      key: "createdAt", label: "Date", labelAr: "التاريخ",
      getValue: (r) => new Date(r.createdAt).getTime(),
      render: (r) => <span className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        data={inquiries}
        columns={columns}
        isArabic={isArabic}
        searchPlaceholder="Search inquiries..."
        searchPlaceholderAr="بحث في الاستفسارات..."
        filters={[
          {
            key: "inquiryType", label: "Type", labelAr: "النوع",
            options: INQUIRY_TYPES.map((t) => ({ value: t, label: t.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()) })),
          },
          {
            key: "status", label: "Status", labelAr: "الحالة",
            options: Object.entries(STATUS_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
          },
        ]}
        emptyIcon={<MessageSquare className="h-12 w-12 mx-auto opacity-30" />}
        emptyText="No inquiries"
        emptyTextAr="لا توجد استفسارات"
        actions={(row) => (
          <Button variant="outline" size="sm" className="h-8" onClick={() => setViewInquiry(row)}>
            <Eye className="h-3.5 w-3.5" />
          </Button>
        )}
      />
      {viewInquiry && (
        <InquiryDetailDialog
          isArabic={isArabic}
          inquiry={viewInquiry}
          adminUsers={adminUsers || []}
          onClose={() => setViewInquiry(null)}
          onSuccess={() => { setViewInquiry(null); refetch(); }}
        />
      )}
    </div>
  );
}

function InquiryDetailDialog({ isArabic, inquiry, adminUsers, onClose, onSuccess }: {
  isArabic: boolean; inquiry: any; adminUsers: any[]; onClose: () => void; onSuccess: () => void;
}) {
  const updateInquiry = trpc.admin.inquiries.update.useMutation({
    onSuccess: () => { toast.success(isArabic ? "تم التحديث" : "Inquiry updated"); onSuccess(); },
    onError: (e) => toast.error(e.message),
  });

  const [status, setStatus] = useState(inquiry.status || "new");
  const [assignedTo, setAssignedTo] = useState<string>(inquiry.assignedTo?.toString() || "none");
  const [internalNotes, setInternalNotes] = useState(inquiry.internalNotes || "");

  const handleSave = () => {
    updateInquiry.mutate({
      id: inquiry.id,
      status,
      assignedTo: assignedTo === "none" ? null : parseInt(assignedTo),
      internalNotes: internalNotes || undefined,
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isArabic ? "تفاصيل الاستفسار" : "Inquiry Details"} #{inquiry.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          {/* Contact info */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-slate-500">{isArabic ? "الاسم:" : "Name:"}</span> <span className="font-medium">{inquiry.name}</span></div>
              <div><span className="text-slate-500">{isArabic ? "البريد:" : "Email:"}</span> <span className="font-medium">{inquiry.email || "—"}</span></div>
              <div><span className="text-slate-500">{isArabic ? "الهاتف:" : "Phone:"}</span> <span className="font-medium">{inquiry.phone || "—"}</span></div>
              <div><span className="text-slate-500">{isArabic ? "النوع:" : "Type:"}</span> <span className="font-medium capitalize">{inquiry.inquiryType?.replace("_", " ")}</span></div>
              {inquiry.city && <div><span className="text-slate-500">{isArabic ? "المدينة:" : "City:"}</span> <span className="font-medium">{inquiry.city}</span></div>}
              {inquiry.neighborhood && <div><span className="text-slate-500">{isArabic ? "الحي:" : "Neighborhood:"}</span> <span className="font-medium">{inquiry.neighborhood}</span></div>}
              {inquiry.propertyType && <div><span className="text-slate-500">{isArabic ? "نوع العقار:" : "Property Type:"}</span> <span className="font-medium">{inquiry.propertyType}</span></div>}
            </div>
            {inquiry.message && (
              <div className="pt-2 border-t border-slate-200">
                <p className="text-sm text-slate-500 mb-1">{isArabic ? "الرسالة:" : "Message:"}</p>
                <p className="text-sm text-slate-800">{inquiry.message}</p>
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">{isArabic ? "الحالة" : "Status"}</Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStatus(key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                    status === key
                      ? `${cfg.color} border-current ring-2 ring-offset-1 ring-current/20`
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">{isArabic ? "مسند إلى" : "Assigned To"}</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger className="w-full"><SelectValue placeholder={isArabic ? "اختر المسؤول" : "Select admin"} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{isArabic ? "غير مسند" : "Unassigned"}</SelectItem>
                {adminUsers.map((a: any) => (
                  <SelectItem key={a.id} value={a.id.toString()}>{a.displayName} ({a.email})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Internal Notes */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">{isArabic ? "ملاحظات داخلية" : "Internal Notes"}</Label>
            <Textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={4}
              placeholder={isArabic ? "أضف ملاحظات داخلية..." : "Add internal notes..."}
            />
          </div>

          {/* Save */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>{isArabic ? "إلغاء" : "Cancel"}</Button>
            <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-500 text-white" disabled={updateInquiry.isPending}>
              {updateInquiry.isPending && <Loader2 className="h-4 w-4 animate-spin me-2" />}
              {isArabic ? "حفظ" : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
