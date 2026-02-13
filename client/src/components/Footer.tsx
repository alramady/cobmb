import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Phone, Mail, MapPin } from "lucide-react";
import CoBnBLogo from "@/components/CoBnBLogo";

export default function Footer() {
  const { t, isArabic } = useLanguage();

  return (
    <footer className="bg-[#0B1E2D] text-white">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663296955420/UgKLnLwgwckVFtlg.png"
                alt="CoBnB Logo"
                className="h-12 w-auto object-contain"
              />
              <span className="block text-[#3ECFC0] text-xs font-medium tracking-wider uppercase mt-1">
                {isArabic ? "خبير الإيجار القصير" : "THE BNB EXPERT"}
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {isArabic
                ? "إدارة إيجارات قصيرة المدى متميزة في المملكة العربية السعودية. الرياض • جدة • المدينة المنورة"
                : "Premium short-term rental management in Saudi Arabia. Riyadh • Jeddah • Madinah"}
            </p>
            {/* OTA Logos */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-white/40">{isArabic ? "شركاء التوزيع" : "OTA Partners"}</span>
              <div className="flex gap-3 text-white/50 text-xs font-medium">
                <span className="px-2 py-1 border border-white/20 rounded">Airbnb</span>
                <span className="px-2 py-1 border border-white/20 rounded">Booking.com</span>
                <span className="px-2 py-1 border border-white/20 rounded">Agoda</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-[#C9A96E] mb-4">{t("footer.quick_links")}</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/about", label: t("nav.about") },
                { href: "/properties", label: t("nav.properties") },
                { href: "/owners", label: t("nav.owners") },
                { href: "/booking", label: t("nav.booking") },
                { href: "/blog", label: t("nav.blog") },
                { href: "/careers", label: t("nav.careers") },
                { href: "/cobnb-plus", label: isArabic ? "كوبي إن بي+" : "CoBnB+" },
                { href: "/app-download", label: isArabic ? "تحميل التطبيق" : "Download App" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 hover:text-[#3ECFC0] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-[#C9A96E] mb-4">{t("footer.services")}</h3>
            <ul className="space-y-2.5">
              {[
                t("services.str"),
                t("services.revenue"),
                t("services.care"),
                t("services.guest"),
                t("services.coliving"),
              ].map((service) => (
                <li key={service}>
                  <Link href="/services" className="text-white/60 hover:text-[#3ECFC0] text-sm transition-colors">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-[#C9A96E] mb-4">{t("footer.contact_info")}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-[#3ECFC0] mt-0.5 shrink-0" />
                <a href="tel:+966504466528" className="text-white/60 hover:text-[#3ECFC0] text-sm transition-colors" dir="ltr">+966 50 446 6528</a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-[#3ECFC0] mt-0.5 shrink-0" />
                <span className="text-white/60 text-sm">info@cobnb.sa</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#3ECFC0] mt-0.5 shrink-0" />
                <span className="text-white/60 text-sm">
                  {isArabic ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"}
                </span>
              </li>
            </ul>
            {/* Cities */}
            <div className="mt-6">
              <h4 className="text-xs text-white/40 mb-2">{t("cities.title")}</h4>
              <div className="flex gap-2">
                {[
                  { slug: "riyadh", name: t("cities.riyadh") },
                  { slug: "jeddah", name: t("cities.jeddah") },
                  { slug: "madinah", name: t("cities.madinah") },
                ].map((city) => (
                  <Link
                    key={city.slug}
                    href={`/cities/${city.slug}`}
                    className="px-3 py-1 text-xs bg-white/10 rounded-full text-white/70 hover:text-[#3ECFC0] hover:bg-white/15 transition-colors"
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} CoBnB KSA. {t("footer.rights")}
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-white/40 hover:text-white/60 text-xs transition-colors">
              {t("footer.privacy")}
            </Link>
            <Link href="/terms" className="text-white/40 hover:text-white/60 text-xs transition-colors">
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
