import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2, MapPin, MessageSquare, Users, BarChart3, FileText,
  Star, Briefcase, Handshake, UserCheck, Shield, Globe
} from "lucide-react";
import type { TabPropsWithAdmin } from "./shared";

export default function DashboardTab({ isArabic, admin }: TabPropsWithAdmin) {
  const { data: stats } = trpc.admin.dashboard.useQuery();
  const { data: activity } = trpc.admin.recentActivity.useQuery();

  const statCards = [
    { label: isArabic ? "المدن" : "Cities", value: stats?.cities || 0, icon: Globe, color: "bg-blue-500" },
    { label: isArabic ? "الأحياء" : "Neighborhoods", value: stats?.neighborhoods || 0, icon: MapPin, color: "bg-teal-500" },
    { label: isArabic ? "العقارات" : "Properties", value: stats?.properties || 0, icon: Building2, color: "bg-amber-500" },
    { label: isArabic ? "الحجوزات" : "Bookings", value: stats?.bookings || 0, icon: BarChart3, color: "bg-green-500" },
    { label: isArabic ? "الاستفسارات" : "Inquiries", value: stats?.inquiries || 0, icon: MessageSquare, color: "bg-purple-500" },
    { label: isArabic ? "التقييمات" : "Reviews", value: stats?.reviews || 0, icon: Star, color: "bg-yellow-500" },
    { label: isArabic ? "المقالات" : "Blog Posts", value: stats?.blogPosts || 0, icon: FileText, color: "bg-indigo-500" },
    { label: isArabic ? "العملاء" : "Client Users", value: stats?.clientUsers || 0, icon: Users, color: "bg-rose-500" },
    { label: isArabic ? "المسؤولين" : "Admin Users", value: stats?.adminUsers || 0, icon: Shield, color: "bg-slate-600" },
    { label: isArabic ? "الشركاء" : "Partners", value: stats?.partners || 0, icon: Handshake, color: "bg-cyan-500" },
    { label: isArabic ? "الوظائف" : "Open Jobs", value: stats?.jobPostings || 0, icon: Briefcase, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#0B1E2D] to-[#1a3a52] rounded-xl p-6 text-white">
        <h2 className="text-xl font-bold">{isArabic ? `مرحباً، ${admin.displayName}` : `Welcome back, ${admin.displayName}`}</h2>
        <p className="text-white/60 mt-1 text-sm">{isArabic ? "إليك نظرة عامة على منصتك" : "Here's an overview of your platform"}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-[#0B1E2D]">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Inquiries */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold text-[#0B1E2D] mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-purple-500" />
              {isArabic ? "آخر الاستفسارات" : "Recent Inquiries"}
            </h3>
            <div className="space-y-2">
              {activity?.recentInquiries?.map((inq: any) => (
                <div key={inq.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0B1E2D] truncate">{inq.name}</p>
                    <p className="text-xs text-slate-500">{inq.inquiryType}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${
                    inq.status === "new" ? "bg-blue-100 text-blue-700" : inq.status === "in_progress" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                  }`}>{inq.status}</span>
                </div>
              ))}
              {(!activity?.recentInquiries || activity.recentInquiries.length === 0) && (
                <p className="text-sm text-slate-400 text-center py-4">{isArabic ? "لا توجد استفسارات" : "No inquiries yet"}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold text-[#0B1E2D] mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-green-500" />
              {isArabic ? "آخر الحجوزات" : "Recent Bookings"}
            </h3>
            <div className="space-y-2">
              {activity?.recentBookings?.map((b: any) => (
                <div key={b.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0B1E2D]">#{b.id}</p>
                    <p className="text-xs text-slate-500">{new Date(b.checkIn).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${
                    b.status === "confirmed" ? "bg-green-100 text-green-700" : b.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-600"
                  }`}>{b.status}</span>
                </div>
              ))}
              {(!activity?.recentBookings || activity.recentBookings.length === 0) && (
                <p className="text-sm text-slate-400 text-center py-4">{isArabic ? "لا توجد حجوزات" : "No bookings yet"}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Client Users */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold text-[#0B1E2D] mb-3 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-rose-500" />
              {isArabic ? "آخر المسجلين" : "Recent Signups"}
            </h3>
            <div className="space-y-2">
              {activity?.recentClients?.map((c: any) => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0B1E2D] truncate">{c.firstName} {c.lastName}</p>
                    <p className="text-xs text-slate-500">{c.email}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">{c.role}</span>
                </div>
              ))}
              {(!activity?.recentClients || activity.recentClients.length === 0) && (
                <p className="text-sm text-slate-400 text-center py-4">{isArabic ? "لا يوجد مسجلين" : "No signups yet"}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
