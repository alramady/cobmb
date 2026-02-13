import { useState } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import CoBnBLogo from "@/components/CoBnBLogo";
import { Loader2, Menu, X, LogOut, Home as HomeIcon } from "lucide-react";
import {
  BarChart3, Globe, MapPin, Building2, MessageSquare, Star,
  FileText, Handshake, Briefcase, UsersRound, UserCheck, Shield,
  Image as ImageIcon, Settings,
} from "lucide-react";

// Import all modular tab components
import {
  DashboardTab, CitiesTab, BookingsTab, ReviewsTab,
  ClientUsersTab, AdminUsersTab, TeamTab, PartnersTab, CareersTab,
  InquiriesTab, PropertiesTab, NeighborhoodsTab, BlogTab, MediaTab, SettingsTab,
  useAdminAuth,
} from "./admin";

export default function AdminPanel() {
  const { isArabic } = useLanguage();
  const [, navigate] = useLocation();
  const { admin, loading, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
      </div>
    );
  }
  if (!admin) { navigate("/admin/login"); return null; }

  const handleLogout = async () => { await logout(); navigate("/admin/login"); };

  const menuItems = [
    { key: "dashboard", icon: BarChart3, label: "Dashboard", labelAr: "لوحة القيادة" },
    { key: "cities", icon: Globe, label: "Cities", labelAr: "المدن" },
    { key: "neighborhoods", icon: MapPin, label: "Neighborhoods", labelAr: "الأحياء" },
    { key: "properties", icon: Building2, label: "Properties", labelAr: "العقارات" },
    { key: "bookings", icon: BarChart3, label: "Bookings", labelAr: "الحجوزات" },
    { key: "inquiries", icon: MessageSquare, label: "Inquiries", labelAr: "الاستفسارات" },
    { key: "reviews", icon: Star, label: "Reviews", labelAr: "التقييمات" },
    { key: "blog", icon: FileText, label: "Blog Posts", labelAr: "المدونة" },
    { key: "partners", icon: Handshake, label: "Partners", labelAr: "الشركاء" },
    { key: "careers", icon: Briefcase, label: "Careers", labelAr: "الوظائف" },
    { key: "team", icon: UsersRound, label: "Team Members", labelAr: "فريق العمل" },
    { key: "clientUsers", icon: UserCheck, label: "Client Users", labelAr: "العملاء" },
    { key: "adminUsers", icon: Shield, label: "Admin Users", labelAr: "المسؤولين" },
    { key: "media", icon: ImageIcon, label: "Media", labelAr: "الوسائط" },
    { key: "settings", icon: Settings, label: "Settings", labelAr: "الإعدادات" },
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0B1E2D] text-white transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} flex flex-col`}>
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CoBnBLogo size="sm" variant="light" />
              <div><p className="text-[10px] text-white/50">Admin Panel</p></div>
            </div>
            <button className="lg:hidden text-white/60 hover:text-white" onClick={() => setSidebarOpen(false)}><X className="h-5 w-5" /></button>
          </div>
        </div>
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold text-sm">
              {admin.displayName?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{admin.displayName}</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">{admin.role}</p>
            </div>
          </div>
        </div>
        <nav className="p-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button key={item.key} onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5 ${
                activeTab === item.key ? "bg-teal-500/15 text-teal-400" : "text-white/60 hover:text-white hover:bg-white/5"
              }`}>
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{isArabic ? item.labelAr : item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors mb-1">
            <HomeIcon className="h-4 w-4" /><span>{isArabic ? "الموقع الرئيسي" : "View Website"}</span>
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut className="h-4 w-4" /><span>{isArabic ? "تسجيل الخروج" : "Logout"}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-slate-600 hover:text-slate-900" onClick={() => setSidebarOpen(true)}><Menu className="h-5 w-5" /></button>
            <h2 className="text-lg font-semibold text-[#0B1E2D]">{menuItems.find(m => m.key === activeTab)?.[isArabic ? "labelAr" : "label"]}</h2>
          </div>
          <span className="text-xs text-slate-500 hidden sm:block">{admin.email}</span>
        </header>
        <main className="p-4 md:p-6">
          {activeTab === "dashboard" && <DashboardTab isArabic={isArabic} admin={admin} />}
          {activeTab === "cities" && <CitiesTab isArabic={isArabic} />}
          {activeTab === "properties" && <PropertiesTab isArabic={isArabic} />}
          {activeTab === "neighborhoods" && <NeighborhoodsTab isArabic={isArabic} />}
          {activeTab === "bookings" && <BookingsTab isArabic={isArabic} />}
          {activeTab === "inquiries" && <InquiriesTab isArabic={isArabic} />}
          {activeTab === "reviews" && <ReviewsTab isArabic={isArabic} />}
          {activeTab === "blog" && <BlogTab isArabic={isArabic} />}
          {activeTab === "partners" && <PartnersTab isArabic={isArabic} />}
          {activeTab === "careers" && <CareersTab isArabic={isArabic} />}
          {activeTab === "team" && <TeamTab isArabic={isArabic} />}
          {activeTab === "clientUsers" && <ClientUsersTab isArabic={isArabic} />}
          {activeTab === "adminUsers" && <AdminUsersTab isArabic={isArabic} />}
          {activeTab === "media" && <MediaTab isArabic={isArabic} />}
          {activeTab === "settings" && <SettingsTab isArabic={isArabic} />}
        </main>
      </div>
    </div>
  );
}
