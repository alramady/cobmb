import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClientAuth, type ClientUser } from "@/hooks/useClientAuth";
import PageLayout from "@/components/PageLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar, Heart, User, Settings, LogIn, Bed, Bath, Users, MapPin,
  Building2, Star, Shield, Eye, EyeOff, Camera, LogOut, Loader2, Lock, Phone, Mail, Briefcase
} from "lucide-react";
import { toast } from "sonner";

export default function AccountDashboard() {
  const { t, isArabic, lang } = useLanguage();
  const { client, loading, isAuthenticated, logout, updateProfile, changePassword } = useClientAuth();
  const [, navigate] = useLocation();

  // Profile form
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
    bio: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Populate form when client loads
  useEffect(() => {
    if (client) {
      setProfileForm({
        firstName: client.firstName || "",
        lastName: client.lastName || "",
        phone: client.phone || "",
        company: client.company || "",
        bio: client.bio || "",
      });
    }
  }, [client]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    const result = await updateProfile(profileForm as any);
    if (result.success) {
      toast.success(isArabic ? "تم تحديث الملف الشخصي" : "Profile updated successfully");
    } else {
      toast.error(result.error || (isArabic ? "فشل التحديث" : "Update failed"));
    }
    setProfileLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error(isArabic ? "كلمات المرور غير متطابقة" : "Passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error(isArabic ? "يجب أن تكون كلمة المرور 6 أحرف على الأقل" : "Password must be at least 6 characters");
      return;
    }
    setPasswordLoading(true);
    const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
    if (result.success) {
      toast.success(isArabic ? "تم تغيير كلمة المرور" : "Password changed successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      toast.error(result.error || (isArabic ? "فشل تغيير كلمة المرور" : "Password change failed"));
    }
    setPasswordLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#3ECFC0] mx-auto" />
        </div>
      </PageLayout>
    );
  }

  if (!isAuthenticated || !client) {
    return (
      <PageLayout>
        <div className="py-20 text-center">
          <LogIn className="h-16 w-16 text-[#3ECFC0] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#0B1E2D] mb-4">
            {isArabic ? "سجل الدخول للوصول إلى حسابك" : "Sign In to Access Your Account"}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {isArabic
              ? "أنشئ حساباً أو سجل الدخول لإدارة حجوزاتك ومفضلاتك"
              : "Create an account or sign in to manage your bookings and favorites"}
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/login">
              <Button className="bg-[#3ECFC0] text-[#0B1E2D] hover:bg-[#B8F0E8] font-semibold px-8 h-12">
                {isArabic ? "تسجيل الدخول" : "Sign In"}
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" className="border-[#3ECFC0] text-[#3ECFC0] hover:bg-[#3ECFC0]/10 font-semibold px-8 h-12">
                {isArabic ? "إنشاء حساب" : "Create Account"}
              </Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const isOwner = client.role === "owner";

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    checked_in: "bg-blue-100 text-blue-800",
    checked_out: "bg-gray-100 text-gray-800",
  };

  const statusLabels: Record<string, { ar: string; en: string }> = {
    pending: { ar: "قيد الانتظار", en: "Pending" },
    confirmed: { ar: "مؤكد", en: "Confirmed" },
    cancelled: { ar: "ملغي", en: "Cancelled" },
    checked_in: { ar: "تم الوصول", en: "Checked In" },
    checked_out: { ar: "تم المغادرة", en: "Checked Out" },
  };

  return (
    <PageLayout>
      {/* Header */}
      <section className="py-10 bg-gradient-to-br from-[#0B1E2D] to-[#1a3a4f]">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#3ECFC0]/20 flex items-center justify-center relative">
                {client.avatar ? (
                  <img src={client.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-[#3ECFC0]" />
                )}
                <div className={`absolute -bottom-1 -end-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isOwner ? "bg-[#C9A96E] text-white" : "bg-[#3ECFC0] text-[#0B1E2D]"}`}>
                  {isOwner ? <Building2 className="h-3 w-3" /> : <User className="h-3 w-3" />}
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {isArabic ? "مرحباً" : "Welcome"}, {client.firstName}
                </h1>
                <p className="text-white/60 text-sm flex items-center gap-2">
                  <Mail className="h-3 w-3" /> {client.email}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${isOwner ? "bg-[#C9A96E]/20 text-[#C9A96E]" : "bg-[#3ECFC0]/20 text-[#3ECFC0]"}`}>
                    {isOwner ? (isArabic ? "مالك عقار" : "Property Owner") : (isArabic ? "ضيف" : "Guest")}
                  </span>
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 me-2" />
              {isArabic ? "تسجيل الخروج" : "Sign Out"}
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Tabs */}
      <section className="py-8 bg-[#F5F7FA] min-h-[60vh]">
        <div className="container">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6 bg-white shadow-sm flex-wrap h-auto gap-1 p-1">
              <TabsTrigger value="overview" className="gap-2 text-xs sm:text-sm">
                <Star className="h-4 w-4" /> {isArabic ? "نظرة عامة" : "Overview"}
              </TabsTrigger>
              <TabsTrigger value="bookings" className="gap-2 text-xs sm:text-sm">
                <Calendar className="h-4 w-4" /> {isArabic ? "حجوزاتي" : "Bookings"}
              </TabsTrigger>
              <TabsTrigger value="favorites" className="gap-2 text-xs sm:text-sm">
                <Heart className="h-4 w-4" /> {isArabic ? "المفضلة" : "Favorites"}
              </TabsTrigger>
              {isOwner && (
                <TabsTrigger value="properties" className="gap-2 text-xs sm:text-sm">
                  <Building2 className="h-4 w-4" /> {isArabic ? "عقاراتي" : "My Properties"}
                </TabsTrigger>
              )}
              <TabsTrigger value="profile" className="gap-2 text-xs sm:text-sm">
                <Settings className="h-4 w-4" /> {isArabic ? "الملف الشخصي" : "Profile"}
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2 text-xs sm:text-sm">
                <Shield className="h-4 w-4" /> {isArabic ? "الأمان" : "Security"}
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-10 w-10 text-[#3ECFC0] mx-auto mb-3" />
                    <h3 className="text-3xl font-bold text-[#0B1E2D]">0</h3>
                    <p className="text-muted-foreground text-sm">{isArabic ? "حجوزات" : "Bookings"}</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <Heart className="h-10 w-10 text-red-400 mx-auto mb-3" />
                    <h3 className="text-3xl font-bold text-[#0B1E2D]">0</h3>
                    <p className="text-muted-foreground text-sm">{isArabic ? "مفضلة" : "Favorites"}</p>
                  </CardContent>
                </Card>
                {isOwner ? (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-6 text-center">
                      <Building2 className="h-10 w-10 text-[#C9A96E] mx-auto mb-3" />
                      <h3 className="text-3xl font-bold text-[#0B1E2D]">0</h3>
                      <p className="text-muted-foreground text-sm">{isArabic ? "عقاراتي" : "My Properties"}</p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-6 text-center">
                      <Star className="h-10 w-10 text-yellow-400 mx-auto mb-3" />
                      <h3 className="text-3xl font-bold text-[#0B1E2D]">0</h3>
                      <p className="text-muted-foreground text-sm">{isArabic ? "تقييماتي" : "My Reviews"}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Quick Actions */}
              <h3 className="text-lg font-semibold text-[#0B1E2D] mb-4">{isArabic ? "إجراءات سريعة" : "Quick Actions"}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/properties">
                  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#3ECFC0]/10 flex items-center justify-center group-hover:bg-[#3ECFC0]/20 transition-colors">
                        <MapPin className="h-6 w-6 text-[#3ECFC0]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0B1E2D] text-sm">{isArabic ? "تصفح العقارات" : "Browse Properties"}</h4>
                        <p className="text-muted-foreground text-xs">{isArabic ? "اكتشف أفضل العقارات" : "Discover top properties"}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/contact">
                  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#C9A96E]/10 flex items-center justify-center group-hover:bg-[#C9A96E]/20 transition-colors">
                        <Phone className="h-6 w-6 text-[#C9A96E]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0B1E2D] text-sm">{isArabic ? "تواصل معنا" : "Contact Us"}</h4>
                        <p className="text-muted-foreground text-xs">{isArabic ? "نحن هنا للمساعدة" : "We're here to help"}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                {isOwner && (
                  <Link href="/owners">
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                      <CardContent className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#C9A96E]/10 flex items-center justify-center group-hover:bg-[#C9A96E]/20 transition-colors">
                          <Briefcase className="h-6 w-6 text-[#C9A96E]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#0B1E2D] text-sm">{isArabic ? "حاسبة الإيرادات" : "Revenue Calculator"}</h4>
                          <p className="text-muted-foreground text-xs">{isArabic ? "احسب أرباحك المتوقعة" : "Estimate your earnings"}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )}
                <Link href="/blog">
                  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <Star className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0B1E2D] text-sm">{isArabic ? "المدونة" : "Blog & Guides"}</h4>
                        <p className="text-muted-foreground text-xs">{isArabic ? "نصائح ومقالات" : "Tips & articles"}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <div className="text-center py-16">
                <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#0B1E2D] mb-2">{isArabic ? "لا توجد حجوزات بعد" : "No Bookings Yet"}</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  {isArabic ? "ابدأ بتصفح العقارات المتاحة واحجز إقامتك المثالية" : "Start browsing available properties and book your perfect stay"}
                </p>
                <Link href="/properties">
                  <Button className="bg-[#3ECFC0] text-[#0B1E2D] hover:bg-[#B8F0E8] font-semibold">
                    {isArabic ? "تصفح العقارات" : "Browse Properties"}
                  </Button>
                </Link>
              </div>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites">
              <div className="text-center py-16">
                <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#0B1E2D] mb-2">{isArabic ? "لا توجد عقارات مفضلة" : "No Favorites Yet"}</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  {isArabic ? "أضف عقارات إلى المفضلة لتتمكن من العودة إليها لاحقاً" : "Save properties to your favorites to easily find them later"}
                </p>
                <Link href="/properties">
                  <Button className="bg-[#3ECFC0] text-[#0B1E2D] hover:bg-[#B8F0E8] font-semibold">
                    {isArabic ? "تصفح العقارات" : "Browse Properties"}
                  </Button>
                </Link>
              </div>
            </TabsContent>

            {/* Owner Properties Tab */}
            {isOwner && (
              <TabsContent value="properties">
                <div className="text-center py-16">
                  <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#0B1E2D] mb-2">{isArabic ? "لا توجد عقارات مدرجة" : "No Properties Listed"}</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    {isArabic ? "تواصل معنا لإدراج عقارك والبدء في تحقيق الإيرادات" : "Contact us to list your property and start earning revenue"}
                  </p>
                  <Link href="/contact">
                    <Button className="bg-[#C9A96E] text-white hover:bg-[#B8963E] font-semibold">
                      {isArabic ? "تواصل معنا" : "Contact Us"}
                    </Button>
                  </Link>
                </div>
              </TabsContent>
            )}

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="max-w-2xl">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-8">
                    <h2 className="text-xl font-bold text-[#0B1E2D] mb-6 flex items-center gap-2">
                      <User className="h-5 w-5 text-[#3ECFC0]" />
                      {isArabic ? "المعلومات الشخصية" : "Personal Information"}
                    </h2>
                    <form onSubmit={handleProfileUpdate} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-[#0B1E2D] mb-1.5 block">
                            {isArabic ? "الاسم الأول" : "First Name"}
                          </Label>
                          <Input
                            value={profileForm.firstName}
                            onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                            className="h-11"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-[#0B1E2D] mb-1.5 block">
                            {isArabic ? "اسم العائلة" : "Last Name"}
                          </Label>
                          <Input
                            value={profileForm.lastName}
                            onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-[#0B1E2D] mb-1.5 block">
                          {isArabic ? "البريد الإلكتروني" : "Email Address"}
                        </Label>
                        <Input value={client.email} disabled className="h-11 bg-gray-50 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {isArabic ? "لا يمكن تغيير البريد الإلكتروني" : "Email cannot be changed"}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-[#0B1E2D] mb-1.5 block">
                          {isArabic ? "رقم الهاتف" : "Phone Number"}
                        </Label>
                        <Input
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="h-11"
                          dir="ltr"
                          placeholder="+966 5XX XXX XXXX"
                        />
                      </div>

                      {isOwner && (
                        <div>
                          <Label className="text-sm font-medium text-[#0B1E2D] mb-1.5 block">
                            {isArabic ? "اسم الشركة" : "Company Name"}
                          </Label>
                          <Input
                            value={profileForm.company}
                            onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                            className="h-11"
                          />
                        </div>
                      )}

                      <div>
                        <Label className="text-sm font-medium text-[#0B1E2D] mb-1.5 block">
                          {isArabic ? "نبذة عني" : "About Me"}
                        </Label>
                        <Textarea
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                          rows={3}
                          placeholder={isArabic ? "أخبرنا عن نفسك..." : "Tell us about yourself..."}
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={profileLoading}
                        className="bg-[#3ECFC0] text-[#0B1E2D] hover:bg-[#B8F0E8] font-semibold h-11"
                      >
                        {profileLoading ? <Loader2 className="h-4 w-4 animate-spin me-2" /> : null}
                        {isArabic ? "حفظ التغييرات" : "Save Changes"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <div className="max-w-2xl">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-8">
                    <h2 className="text-xl font-bold text-[#0B1E2D] mb-6 flex items-center gap-2">
                      <Lock className="h-5 w-5 text-[#3ECFC0]" />
                      {isArabic ? "تغيير كلمة المرور" : "Change Password"}
                    </h2>
                    <form onSubmit={handlePasswordChange} className="space-y-5">
                      <div>
                        <Label className="text-sm font-medium text-[#0B1E2D] mb-1.5 block">
                          {isArabic ? "كلمة المرور الحالية" : "Current Password"}
                        </Label>
                        <div className="relative">
                          <Input
                            type={showCurrentPw ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            required
                            className="h-11 pe-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPw(!showCurrentPw)}
                            className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground hover:text-foreground"
                          >
                            {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-[#0B1E2D] mb-1.5 block">
                          {isArabic ? "كلمة المرور الجديدة" : "New Password"}
                        </Label>
                        <div className="relative">
                          <Input
                            type={showNewPw ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            required
                            minLength={6}
                            className="h-11 pe-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPw(!showNewPw)}
                            className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground hover:text-foreground"
                          >
                            {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-[#0B1E2D] mb-1.5 block">
                          {isArabic ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password"}
                        </Label>
                        <Input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          required
                          className="h-11"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={passwordLoading}
                        className="bg-[#3ECFC0] text-[#0B1E2D] hover:bg-[#B8F0E8] font-semibold h-11"
                      >
                        {passwordLoading ? <Loader2 className="h-4 w-4 animate-spin me-2" /> : null}
                        {isArabic ? "تغيير كلمة المرور" : "Change Password"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Account Info */}
                <Card className="border-0 shadow-sm mt-6">
                  <CardContent className="p-8">
                    <h2 className="text-xl font-bold text-[#0B1E2D] mb-4 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-[#3ECFC0]" />
                      {isArabic ? "معلومات الحساب" : "Account Information"}
                    </h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-muted-foreground">{isArabic ? "نوع الحساب" : "Account Type"}</span>
                        <span className="font-medium text-[#0B1E2D]">
                          {isOwner ? (isArabic ? "مالك عقار" : "Property Owner") : (isArabic ? "ضيف / مسافر" : "Guest / Traveler")}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-muted-foreground">{isArabic ? "البريد الإلكتروني" : "Email"}</span>
                        <span className="font-medium text-[#0B1E2D]">{client.email}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">{isArabic ? "تاريخ الانضمام" : "Member Since"}</span>
                        <span className="font-medium text-[#0B1E2D]">
                          {client.createdAt ? new Date(client.createdAt).toLocaleDateString(isArabic ? "ar-SA" : "en-US", { year: "numeric", month: "long" }) : "-"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </PageLayout>
  );
}
