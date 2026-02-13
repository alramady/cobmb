import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClientAuth } from "@/hooks/useClientAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Globe, User, ChevronDown, Building2, Heart, CalendarDays, LogOut, UserPlus, Shield, Settings } from "lucide-react";
import CoBnBLogo from "@/components/CoBnBLogo";

export default function Navbar() {
  const { lang, setLang, t, isArabic } = useLanguage();
  const { client, isAuthenticated, logout } = useClientAuth();
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/services", label: t("nav.services") },
    { href: "/properties", label: t("nav.properties") },
    { href: "/owners", label: t("nav.owners") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const isActive = (href: string) => location === href;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B1E2D]/95 backdrop-blur-md border-b border-white/10">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <CoBnBLogo
            size="md"
            variant="light"
            tagline={isArabic ? "خبير الإيجار القصير" : "THE BNB EXPERT"}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive(link.href)
                  ? "text-[#3ECFC0] bg-white/10"
                  : "text-white/80 hover:text-[#3ECFC0] hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side: Lang toggle + Auth + CTA */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span>{lang === "ar" ? "EN" : "عربي"}</span>
          </button>

          {/* Auth */}
          {isAuthenticated && client ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">
                  {client.avatar ? (
                    <img src={client.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="max-w-[100px] truncate">{client.firstName}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isArabic ? "start" : "end"} className="w-52">
                <div className="px-3 py-2 border-b">
                  <p className="text-sm font-medium">{client.firstName} {client.lastName}</p>
                  <p className="text-xs text-muted-foreground">{client.email}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    client.role === "owner" ? "bg-[#C9A96E]/10 text-[#C9A96E]" : "bg-[#3ECFC0]/10 text-[#3ECFC0]"
                  }`}>
                    {client.role === "owner"
                      ? (isArabic ? "مالك عقار" : "Property Owner")
                      : (isArabic ? "ضيف" : "Guest")}
                  </span>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/account" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" /> {isArabic ? "لوحة التحكم" : "Dashboard"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account" className="flex items-center gap-2 cursor-pointer">
                    <CalendarDays className="h-4 w-4" /> {isArabic ? "حجوزاتي" : "My Bookings"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account" className="flex items-center gap-2 cursor-pointer">
                    <Heart className="h-4 w-4" /> {isArabic ? "المفضلة" : "Favorites"}
                  </Link>
                </DropdownMenuItem>
                {client.role === "owner" && (
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="flex items-center gap-2 cursor-pointer">
                      <Building2 className="h-4 w-4" /> {isArabic ? "عقاراتي" : "My Properties"}
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/account" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" /> {isArabic ? "الإعدادات" : "Settings"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-500 cursor-pointer">
                  <LogOut className="h-4 w-4" /> {isArabic ? "تسجيل الخروج" : "Sign Out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <button className="px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  {isArabic ? "تسجيل الدخول" : "Sign In"}
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-4 py-2 text-sm font-medium text-[#0B1E2D] bg-[#3ECFC0] rounded-full hover:bg-[#B8F0E8] transition-colors flex items-center gap-1.5">
                  <UserPlus className="h-3.5 w-3.5" />
                  {isArabic ? "حساب جديد" : "Sign Up"}
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="p-2 text-white/80 hover:text-[#3ECFC0]"
          >
            <Globe className="h-5 w-5" />
          </button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="p-2 text-white">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side={isArabic ? "right" : "left"} className="bg-[#0B1E2D] border-white/10 w-[280px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-white/10">
                  <CoBnBLogo
                    size="sm"
                    variant="light"
                    tagline={isArabic ? "خبير الإيجار القصير" : "THE BNB EXPERT"}
                  />
                </div>

                {/* User info in mobile */}
                {isAuthenticated && client && (
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#3ECFC0]/20 flex items-center justify-center">
                        {client.avatar ? (
                          <img src={client.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <User className="h-5 w-5 text-[#3ECFC0]" />
                        )}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{client.firstName} {client.lastName}</p>
                        <p className="text-white/50 text-xs">{client.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                <nav className="flex-1 p-4 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? "text-[#3ECFC0] bg-white/10"
                          : "text-white/80 hover:text-[#3ECFC0] hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}

                  {isAuthenticated && (
                    <>
                      <div className="h-px bg-white/10 my-2" />
                      <Link href="/account" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-medium text-white/80 hover:text-[#3ECFC0] hover:bg-white/5">
                        {isArabic ? "لوحة التحكم" : "Dashboard"}
                      </Link>
                    </>
                  )}
                </nav>

                <div className="p-4 border-t border-white/10 space-y-3">
                  {isAuthenticated ? (
                    <>
                      <Link href="/account" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10">
                          <User className="h-4 w-4 me-2" />
                          {isArabic ? "حسابي" : "My Account"}
                        </Button>
                      </Link>
                      <Button onClick={() => { handleLogout(); setMobileOpen(false); }} variant="ghost" className="w-full text-red-400 hover:text-red-300">
                        <LogOut className="h-4 w-4 me-2" />
                        {isArabic ? "تسجيل الخروج" : "Sign Out"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10">
                          {isArabic ? "تسجيل الدخول" : "Sign In"}
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setMobileOpen(false)}>
                        <Button className="w-full bg-[#3ECFC0] text-[#0B1E2D] hover:bg-[#B8F0E8] font-semibold">
                          <UserPlus className="h-4 w-4 me-2" />
                          {isArabic ? "إنشاء حساب" : "Create Account"}
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
