import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClientAuth } from "@/hooks/useClientAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CoBnBLogo from "@/components/CoBnBLogo";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";

export default function ClientLogin() {
  const { isArabic } = useLanguage();
  const { login } = useClientAuth();
  const [, navigate] = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate("/account");
    } else {
      setError(result.error || (isArabic ? "فشل تسجيل الدخول" : "Login failed"));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1E2D] via-[#0F2A3D] to-[#0B1E2D] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <CoBnBLogo size="lg" variant="light" tagline={isArabic ? "خبير الإيجار القصير" : "THE BNB EXPERT"} />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            {isArabic ? "تسجيل الدخول" : "Welcome Back"}
          </h1>
          <p className="text-white/60 text-center text-sm mb-8">
            {isArabic ? "أدخل بياناتك للوصول إلى حسابك" : "Enter your credentials to access your account"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 text-center">
                {error}
              </div>
            )}

            <div>
              <Label className="text-white/70 text-xs mb-1.5 block">
                {isArabic ? "البريد الإلكتروني" : "Email Address"}
              </Label>
              <div className="relative">
                <Mail className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-white/30" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl ps-10"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <Label className="text-white/70 text-xs mb-1.5 block">
                {isArabic ? "كلمة المرور" : "Password"}
              </Label>
              <div className="relative">
                <Lock className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-white/30" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl ps-10 pe-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 end-3 text-white/40 hover:text-white/70"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Forgot password link */}
            <div className="text-end">
              <Link href="/forgot-password" className="text-white/40 hover:text-[#3ECFC0] text-xs transition-colors">
                {isArabic ? "نسيت كلمة المرور؟" : "Forgot password?"}
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3ECFC0] text-[#0B1E2D] hover:bg-[#B8F0E8] font-semibold h-12 rounded-xl"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                isArabic ? "تسجيل الدخول" : "Sign In"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">{isArabic ? "أو" : "OR"}</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Register link */}
          <p className="text-center text-white/50 text-sm">
            {isArabic ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
            <Link href="/signup" className="text-[#3ECFC0] hover:underline font-medium">
              {isArabic ? "إنشاء حساب" : "Create Account"}
            </Link>
          </p>
        </div>

        {/* Admin link */}
        <p className="text-center text-white/30 text-xs mt-6">
          <Link href="/admin/login" className="hover:text-white/50">
            {isArabic ? "دخول لوحة الإدارة" : "Admin Panel Access"}
          </Link>
        </p>
      </div>
    </div>
  );
}
