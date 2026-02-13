import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClientAuth } from "@/hooks/useClientAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CoBnBLogo from "@/components/CoBnBLogo";
import { Eye, EyeOff, User, Building2, Loader2, ArrowRight, ArrowLeft, Check } from "lucide-react";

export default function ClientSignup() {
  const { t, isArabic } = useLanguage();
  const { register } = useClientAuth();
  const [, navigate] = useLocation();

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"guest" | "owner">("guest");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [company, setCompany] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(isArabic ? "كلمات المرور غير متطابقة" : "Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError(isArabic ? "يجب أن تكون كلمة المرور 6 أحرف على الأقل" : "Password must be at least 6 characters");
      return;
    }
    if (!agreed) {
      setError(isArabic ? "يجب الموافقة على الشروط والأحكام" : "You must agree to the terms and conditions");
      return;
    }

    setLoading(true);
    const result = await register({
      email,
      password,
      firstName,
      lastName,
      phone: phone || undefined,
      role,
      company: company || undefined,
      preferredLanguage: isArabic ? "ar" : "en",
    });

    if (result.success) {
      navigate("/account");
    } else {
      setError(result.error || (isArabic ? "فشل التسجيل" : "Registration failed"));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1E2D] via-[#0F2A3D] to-[#0B1E2D] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <CoBnBLogo size="lg" variant="light" tagline={isArabic ? "خبير الإيجار القصير" : "THE BNB EXPERT"} />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            {isArabic ? "إنشاء حساب جديد" : "Create Your Account"}
          </h1>
          <p className="text-white/60 text-center text-sm mb-6">
            {isArabic ? "انضم إلى CoBnB KSA اليوم" : "Join CoBnB KSA today"}
          </p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${step === 1 ? "bg-[#3ECFC0] text-[#0B1E2D]" : "bg-white/10 text-white/60"}`}>
              <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-[10px]">1</span>
              {isArabic ? "نوع الحساب" : "Account Type"}
            </div>
            <div className="w-8 h-px bg-white/20" />
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${step === 2 ? "bg-[#3ECFC0] text-[#0B1E2D]" : "bg-white/10 text-white/60"}`}>
              <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-[10px]">2</span>
              {isArabic ? "المعلومات" : "Details"}
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-white/80 text-sm text-center mb-4">
                {isArabic ? "كيف تريد استخدام CoBnB؟" : "How would you like to use CoBnB?"}
              </p>

              {/* Guest Card */}
              <button
                onClick={() => setRole("guest")}
                className={`w-full p-5 rounded-xl border-2 transition-all text-start ${
                  role === "guest"
                    ? "border-[#3ECFC0] bg-[#3ECFC0]/10"
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${role === "guest" ? "bg-[#3ECFC0]/20" : "bg-white/10"}`}>
                    <User className={`h-6 w-6 ${role === "guest" ? "text-[#3ECFC0]" : "text-white/60"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">
                      {isArabic ? "مسافر / ضيف" : "Traveler / Guest"}
                    </h3>
                    <p className="text-white/60 text-sm mt-1">
                      {isArabic
                        ? "ابحث عن عقارات واحجز إقامتك في أفضل الأحياء السعودية"
                        : "Browse properties and book stays in Saudi Arabia's best neighborhoods"}
                    </p>
                  </div>
                  {role === "guest" && (
                    <div className="w-6 h-6 rounded-full bg-[#3ECFC0] flex items-center justify-center">
                      <Check className="h-4 w-4 text-[#0B1E2D]" />
                    </div>
                  )}
                </div>
              </button>

              {/* Owner Card */}
              <button
                onClick={() => setRole("owner")}
                className={`w-full p-5 rounded-xl border-2 transition-all text-start ${
                  role === "owner"
                    ? "border-[#C9A96E] bg-[#C9A96E]/10"
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${role === "owner" ? "bg-[#C9A96E]/20" : "bg-white/10"}`}>
                    <Building2 className={`h-6 w-6 ${role === "owner" ? "text-[#C9A96E]" : "text-white/60"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">
                      {isArabic ? "مالك عقار" : "Property Owner"}
                    </h3>
                    <p className="text-white/60 text-sm mt-1">
                      {isArabic
                        ? "أدرج عقارك واستفد من خدمات إدارة الإيجار القصير"
                        : "List your property and benefit from short-term rental management"}
                    </p>
                  </div>
                  {role === "owner" && (
                    <div className="w-6 h-6 rounded-full bg-[#C9A96E] flex items-center justify-center">
                      <Check className="h-4 w-4 text-[#0B1E2D]" />
                    </div>
                  )}
                </div>
              </button>

              <Button
                onClick={() => setStep(2)}
                className="w-full bg-[#3ECFC0] text-[#0B1E2D] hover:bg-[#B8F0E8] font-semibold h-12 rounded-xl mt-4"
              >
                {isArabic ? "التالي" : "Continue"}
                <Arrow className="h-4 w-4 ms-2" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 text-center">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-white/70 text-xs mb-1.5 block">
                    {isArabic ? "الاسم الأول" : "First Name"} *
                  </Label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 rounded-lg"
                    placeholder={isArabic ? "أحمد" : "Ahmed"}
                  />
                </div>
                <div>
                  <Label className="text-white/70 text-xs mb-1.5 block">
                    {isArabic ? "اسم العائلة" : "Last Name"} *
                  </Label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 rounded-lg"
                    placeholder={isArabic ? "العبدالله" : "Al-Abdullah"}
                  />
                </div>
              </div>

              <div>
                <Label className="text-white/70 text-xs mb-1.5 block">
                  {isArabic ? "البريد الإلكتروني" : "Email Address"} *
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 rounded-lg"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <Label className="text-white/70 text-xs mb-1.5 block">
                  {isArabic ? "رقم الهاتف" : "Phone Number"}
                </Label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 rounded-lg"
                  placeholder="+966 5XX XXX XXXX"
                  dir="ltr"
                />
              </div>

              {role === "owner" && (
                <div>
                  <Label className="text-white/70 text-xs mb-1.5 block">
                    {isArabic ? "اسم الشركة (اختياري)" : "Company Name (Optional)"}
                  </Label>
                  <Input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 rounded-lg"
                    placeholder={isArabic ? "شركة العقارات" : "Real Estate Co."}
                  />
                </div>
              )}

              <div>
                <Label className="text-white/70 text-xs mb-1.5 block">
                  {isArabic ? "كلمة المرور" : "Password"} *
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 rounded-lg pe-10"
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

              <div>
                <Label className="text-white/70 text-xs mb-1.5 block">
                  {isArabic ? "تأكيد كلمة المرور" : "Confirm Password"} *
                </Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 rounded-lg"
                  placeholder="••••••••"
                />
              </div>

              {/* Terms Agreement */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-[#3ECFC0] focus:ring-[#3ECFC0]"
                />
                <span className="text-white/60 text-xs leading-relaxed">
                  {isArabic ? (
                    <>أوافق على <Link href="/terms" className="text-[#3ECFC0] hover:underline">الشروط والأحكام</Link> و<Link href="/privacy" className="text-[#3ECFC0] hover:underline">سياسة الخصوصية</Link></>
                  ) : (
                    <>I agree to the <Link href="/terms" className="text-[#3ECFC0] hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#3ECFC0] hover:underline">Privacy Policy</Link></>
                  )}
                </span>
              </label>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 border-white/20 text-white hover:bg-white/10 h-12 rounded-xl"
                >
                  {isArabic ? "رجوع" : "Back"}
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] bg-[#3ECFC0] text-[#0B1E2D] hover:bg-[#B8F0E8] font-semibold h-12 rounded-xl"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    isArabic ? "إنشاء الحساب" : "Create Account"
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Login link */}
          <p className="text-center text-white/50 text-sm mt-6">
            {isArabic ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
            <Link href="/login" className="text-[#3ECFC0] hover:underline font-medium">
              {isArabic ? "تسجيل الدخول" : "Sign In"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
