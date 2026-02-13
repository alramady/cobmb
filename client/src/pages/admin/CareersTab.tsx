import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Briefcase, FileText, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { TabProps } from "./shared";

export default function CareersTab({ isArabic }: TabProps) {
  return (
    <Tabs defaultValue="jobs" className="space-y-4">
      <TabsList>
        <TabsTrigger value="jobs">{isArabic ? "الوظائف" : "Job Postings"}</TabsTrigger>
        <TabsTrigger value="applications">{isArabic ? "الطلبات" : "Applications"}</TabsTrigger>
      </TabsList>
      <TabsContent value="jobs"><JobPostingsSection isArabic={isArabic} /></TabsContent>
      <TabsContent value="applications"><ApplicationsSection isArabic={isArabic} /></TabsContent>
    </Tabs>
  );
}

function JobPostingsSection({ isArabic }: { isArabic: boolean }) {
  const { data: jobs, refetch } = trpc.admin.careers.jobs.list.useQuery();
  const deleteJob = trpc.admin.careers.jobs.delete.useMutation({
    onSuccess: () => { refetch(); toast.success(isArabic ? "تم الحذف" : "Job deleted"); },
  });
  const [showCreate, setShowCreate] = useState(false);
  const [editJob, setEditJob] = useState<any>(null);

  const statusColors: Record<string, string> = { open: "bg-green-100 text-green-700", closed: "bg-red-100 text-red-700", draft: "bg-yellow-100 text-yellow-700" };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{jobs?.length || 0} {isArabic ? "وظيفة" : "job postings"}</p>
        <Button className="bg-teal-600 hover:bg-teal-500 text-white" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 me-2" /> {isArabic ? "إضافة وظيفة" : "Add Job"}
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-start p-3 font-medium text-slate-600">ID</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "العنوان" : "Title"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "القسم" : "Department"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الموقع" : "Location"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "النوع" : "Type"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الحالة" : "Status"}</th>
                <th className="text-end p-3 font-medium text-slate-600">{isArabic ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {jobs?.map((j: any) => (
                <tr key={j.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="p-3 text-slate-500">#{j.id}</td>
                  <td className="p-3 font-medium text-[#0B1E2D]">{isArabic ? j.titleAr : j.titleEn}</td>
                  <td className="p-3 text-slate-600">{isArabic ? j.departmentAr : j.departmentEn}</td>
                  <td className="p-3 text-slate-600">{isArabic ? j.locationAr : j.locationEn}</td>
                  <td className="p-3 text-slate-600">{isArabic ? j.typeAr : j.typeEn}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[j.status] || "bg-slate-100 text-slate-600"}`}>{j.status}</span>
                  </td>
                  <td className="p-3 text-end space-x-1">
                    <Button variant="outline" size="sm" className="h-8" onClick={() => setEditJob(j)}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 h-8"
                      onClick={() => { if (confirm("Delete?")) deleteJob.mutate({ id: j.id }); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!jobs || jobs.length === 0) && (
            <div className="p-12 text-center text-slate-400">
              <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>{isArabic ? "لا توجد وظائف" : "No job postings"}</p>
            </div>
          )}
        </div>
      </div>
      {showCreate && <JobDialog isArabic={isArabic} onClose={() => setShowCreate(false)} onSuccess={() => { setShowCreate(false); refetch(); }} />}
      {editJob && <JobDialog isArabic={isArabic} job={editJob} onClose={() => setEditJob(null)} onSuccess={() => { setEditJob(null); refetch(); }} />}
    </div>
  );
}

function JobDialog({ isArabic, job, onClose, onSuccess }: {
  isArabic: boolean; job?: any; onClose: () => void; onSuccess: () => void;
}) {
  const isEdit = !!job;
  const createJob = trpc.admin.careers.jobs.create.useMutation({
    onSuccess: () => { toast.success(isArabic ? "تم إنشاء الوظيفة" : "Job created"); onSuccess(); },
    onError: (e) => toast.error(e.message),
  });
  const updateJob = trpc.admin.careers.jobs.update.useMutation({
    onSuccess: () => { toast.success(isArabic ? "تم تحديث الوظيفة" : "Job updated"); onSuccess(); },
    onError: (e) => toast.error(e.message),
  });

  const [form, setForm] = useState({
    titleEn: job?.titleEn || "", titleAr: job?.titleAr || "",
    departmentEn: job?.departmentEn || "", departmentAr: job?.departmentAr || "",
    locationEn: job?.locationEn || "", locationAr: job?.locationAr || "",
    typeEn: job?.typeEn || "Full-time", typeAr: job?.typeAr || "دوام كامل",
    descriptionEn: job?.descriptionEn || "", descriptionAr: job?.descriptionAr || "",
    requirementsEn: job?.requirementsEn || "", requirementsAr: job?.requirementsAr || "",
    salaryRange: job?.salaryRange || "", contactEmail: job?.contactEmail || "",
    status: job?.status || "draft",
    displayOrder: job?.displayOrder ?? 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      updateJob.mutate({ id: job.id, ...form });
    } else {
      createJob.mutate(form);
    }
  };

  const isPending = createJob.isPending || updateJob.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? (isArabic ? "تعديل الوظيفة" : "Edit Job") : (isArabic ? "إضافة وظيفة" : "Add Job")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Title (EN)</Label><Input value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} required /></div>
            <div><Label>Title (AR)</Label><Input value={form.titleAr} onChange={e => setForm({...form, titleAr: e.target.value})} required dir="rtl" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Department (EN)</Label><Input value={form.departmentEn} onChange={e => setForm({...form, departmentEn: e.target.value})} /></div>
            <div><Label>Department (AR)</Label><Input value={form.departmentAr} onChange={e => setForm({...form, departmentAr: e.target.value})} dir="rtl" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Location (EN)</Label><Input value={form.locationEn} onChange={e => setForm({...form, locationEn: e.target.value})} /></div>
            <div><Label>Location (AR)</Label><Input value={form.locationAr} onChange={e => setForm({...form, locationAr: e.target.value})} dir="rtl" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Type (EN)</Label><Input value={form.typeEn} onChange={e => setForm({...form, typeEn: e.target.value})} placeholder="Full-time" /></div>
            <div><Label>Type (AR)</Label><Input value={form.typeAr} onChange={e => setForm({...form, typeAr: e.target.value})} placeholder="دوام كامل" dir="rtl" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Description (EN)</Label><Textarea value={form.descriptionEn} onChange={e => setForm({...form, descriptionEn: e.target.value})} rows={4} /></div>
            <div><Label>Description (AR)</Label><Textarea value={form.descriptionAr} onChange={e => setForm({...form, descriptionAr: e.target.value})} rows={4} dir="rtl" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Requirements (EN)</Label><Textarea value={form.requirementsEn} onChange={e => setForm({...form, requirementsEn: e.target.value})} rows={4} /></div>
            <div><Label>Requirements (AR)</Label><Textarea value={form.requirementsAr} onChange={e => setForm({...form, requirementsAr: e.target.value})} rows={4} dir="rtl" /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><Label>Salary Range</Label><Input value={form.salaryRange} onChange={e => setForm({...form, salaryRange: e.target.value})} placeholder="8,000 - 15,000 SAR" /></div>
            <div><Label>Contact Email</Label><Input type="email" value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})} /></div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => setForm({...form, status: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
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

function ApplicationsSection({ isArabic }: { isArabic: boolean }) {
  const { data: applications, refetch } = trpc.admin.careers.applications.list.useQuery();
  const updateApp = trpc.admin.careers.applications.update.useMutation({
    onSuccess: () => { refetch(); toast.success(isArabic ? "تم التحديث" : "Updated"); },
  });

  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700", screening: "bg-yellow-100 text-yellow-700",
    interview: "bg-purple-100 text-purple-700", offered: "bg-teal-100 text-teal-700",
    hired: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">{applications?.length || 0} {isArabic ? "طلب" : "applications"}</p>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-start p-3 font-medium text-slate-600">ID</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الوظيفة" : "Job"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الاسم" : "Name"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "البريد" : "Email"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الهاتف" : "Phone"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "لينكدإن" : "LinkedIn"}</th>
                <th className="text-start p-3 font-medium text-slate-600">{isArabic ? "الحالة" : "Status"}</th>
                <th className="text-end p-3 font-medium text-slate-600">{isArabic ? "تغيير" : "Update"}</th>
              </tr>
            </thead>
            <tbody>
              {applications?.map((a: any) => (
                <tr key={a.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="p-3 text-slate-500">#{a.id}</td>
                  <td className="p-3 font-medium text-[#0B1E2D]">Job #{a.jobId}</td>
                  <td className="p-3 text-slate-600">{a.firstName} {a.lastName}</td>
                  <td className="p-3 text-slate-600">{a.email}</td>
                  <td className="p-3 text-slate-600">{a.phone || "—"}</td>
                  <td className="p-3">
                    {a.linkedinUrl ? (
                      <a href={a.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : "—"}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[a.status] || "bg-slate-100 text-slate-600"}`}>{a.status}</span>
                  </td>
                  <td className="p-3 text-end">
                    <Select value={a.status} onValueChange={(v) => updateApp.mutate({ id: a.id, status: v as any })}>
                      <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="screening">Screening</SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="offered">Offered</SelectItem>
                        <SelectItem value="hired">Hired</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!applications || applications.length === 0) && (
            <div className="p-12 text-center text-slate-400">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>{isArabic ? "لا توجد طلبات" : "No applications"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
