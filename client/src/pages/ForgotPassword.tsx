import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CoBnBLogo from "@/components/CoBnBLogo";
import { Mail, Loader2, ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

export default function ForgotPassword() {
  const { isArabic } = useLanguage();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/client/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || (isArabic ? "فشل في إرسال الطلب" : "Failed to process request"));
      } else {
        setSubmitted(true);
      }
    } catch {
      setError(isArabic ? "خطأ في الشبكة" : "Network error");
    } finally {
      setLoading(false);
    }
  };

  const BackArrow = isArabic ? ArrowRight : ArrowLeft;

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
          {submitted ? (
            /* Success State */
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#3ECFC0]/20 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="h-8 w-8 text-[#3ECFC0]" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-3">
                {isArabic ? "تحقق من بريدك الإلكتروني" : "Check Your Email"}
              </h1>
              <p className="text-white/60 text-sm mb-2 leading-relaxed">
                {isArabic
                  ? "إذا كان هناك حساب مرتبط بهذا البريد الإلكتروني، فسيتم إرسال رابط إعادة تعيين كلمة المرور."
                  : "If an account exists with that email, a password reset link has been sent."}
              </p>
              <p className="text-white/40 text-xs mb-6">
                {isArabic
                  ? "ينتهي صلاحية الرابط خلال ساعة واحدة."
                  : "The link will expire in 1 hour."}
              </p>

              <div className="bg-[#3ECFC0]/10 border border-[#3ECFC0]/20 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 justify-center mb-2">
                  <AlertCircle className="h-4 w-4 text-[#3ECFC0]" />
                  <span className="text-[#3ECFC0] text-sm font-medium">
                    {isArabic ? "ملاحظة مهمة" : "Important Note"}
                  </span>
                </div>
                <p className="text-white/50 text-xs leading-relaxed">
                  {isArabic
                    ? "سيتم إرسال رابط إعادة التعيين إلى مالك المنصة. يرجى التواصل مع الدعم إذا لم تتلقَ الرابط."
                    : "The reset link will be sent to the platform owner. Please contact support if you don't receive it."}
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => { setSubmitted(false); setEmail(""); }}
                  variant="outline"
                  className="w-full border-white/10 text-white hover:bg-white/5 h-11 rounded-xl"
                >
                  {isArabic ? "إرسال مرة أخرى" : "Send Again"}
                </Button>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="w-full text-[#3ECFC0] hover:text-[#3ECFC0] hover:bg-[#3ECFC0]/10 h-11 rounded-xl"
                  >
                    <BackArrow className="h-4 w-4 me-2" />
                    {isArabic ? "العودة لتسجيل الدخول" : "Back to Sign In"}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            /* Form State */
            <>
              <h1 className="text-2xl font-bold text-white text-center mb-2">
                {isArabic ? "نسيت كلمة المرور؟" : "Forgot Password?"}
              </h1>
              <p className="text-white/60 text-center text-sm mb-8 leading-relaxed">
                {isArabic
                  ? "أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور"
                  : "Enter your email address and we'll send you a link to reset your password"}
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
                      autoFocus
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3ECFC0] text-[#0B1E2D] hover:bg-[#B8F0E8] font-semibold h-12 rounded-xl"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    isArabic ? "إرسال رابط إعادة التعيين" : "Send Reset Link"
                  )}
                </Button>
              </form>

              {/* Back to login */}
              <div className="mt-6 text-center">
                <Link href="/login" className="inline-flex items-center gap-2 text-white/50 hover:text-white/70 text-sm transition-colors">
                  <BackArrow className="h-4 w-4" />
                  {isArabic ? "العودة لتسجيل الدخول" : "Back to Sign In"}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
