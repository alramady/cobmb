import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CoBnBLogo from "@/components/CoBnBLogo";
import { Lock, Loader2, Eye, EyeOff, CheckCircle, XCircle, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const { isArabic } = useLanguage();
  const [, navigate] = useLocation();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  // Verify token on mount
  useEffect(() => {
    async function verifyToken() {
      try {
        const res = await fetch(`/api/client/verify-reset-token/${token}`);
        const data = await res.json();
        if (data.valid) {
          setTokenValid(true);
          setEmail(data.email || "");
        } else {
          setTokenValid(false);
          setTokenError(data.error || (isArabic ? "رابط غير صالح" : "Invalid link"));
        }
      } catch {
        setTokenValid(false);
        setTokenError(isArabic ? "خطأ في الشبكة" : "Network error");
      } finally {
        setVerifying(false);
      }
    }
    if (token) {
      verifyToken();
    } else {
      setVerifying(false);
      setTokenError(isArabic ? "رابط غير صالح" : "Invalid link");
    }
  }, [token, isArabic]);

  // Password strength checks
  const hasMinLength = newPassword.length >= 6;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!hasMinLength) {
      setError(isArabic ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(isArabic ? "كلمات المرور غير متطابقة" : "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/client/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || (isArabic ? "فشل في إعادة تعيين كلمة المرور" : "Password reset failed"));
      } else {
        setSuccess(true);
      }
    } catch {
      setError(isArabic ? "خطأ في الشبكة" : "Network error");
    } finally {
      setLoading(false);
    }
  };

  const BackArrow = isArabic ? ArrowRight : ArrowLeft;

  // Loading state
  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1E2D] via-[#0F2A3D] to-[#0B1E2D] flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-[#3ECFC0] animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">
            {isArabic ? "جاري التحقق من الرابط..." : "Verifying your reset link..."}
          </p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!tokenValid && !success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1E2D] via-[#0F2A3D] to-[#0B1E2D] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <CoBnBLogo size="lg" variant="light" tagline={isArabic ? "خبير الإيجار القصير" : "THE BNB EXPERT"} />
            </Link>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-5">
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">
              {isArabic ? "رابط غير صالح" : "Invalid Reset Link"}
            </h1>
            <p className="text-white/60 text-sm mb-6 leading-relaxed">
              {tokenError || (isArabic
                ? "هذا الرابط غير صالح أو منتهي الصلاحية أو تم استخدامه بالفعل."
                : "This link is invalid, expired, or has already been used.")}
            </p>
            <div className="space-y-3">
              <Link href="/forgot-password">
                <Button className="w-full bg-[#3ECFC0] text-[#0B1E2D] hover:bg-[#B8F0E8] font-semibold h-11 rounded-xl">
                  {isArabic ? "طلب رابط جديد" : "Request New Link"}
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="w-full text-white/50 hover:text-white/70 hover:bg-white/5 h-11 rounded-xl"
                >
                  <BackArrow className="h-4 w-4 me-2" />
                  {isArabic ? "العودة لتسجيل الدخول" : "Back to Sign In"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1E2D] via-[#0F2A3D] to-[#0B1E2D] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <CoBnBLogo size="lg" variant="light" tagline={isArabic ? "خبير الإيجار القصير" : "THE BNB EXPERT"} />
            </Link>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#3ECFC0]/20 flex items-center justify-center mx-auto mb-5">
              <ShieldCheck className="h-8 w-8 text-[#3ECFC0]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">
              {isArabic ? "تم إعادة تعيين كلمة المرور" : "Password Reset Complete"}
            </h1>
            <p className="text-white/60 text-sm mb-6 leading-relaxed">
              {isArabic
                ? "تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة."
                : "Your password has been changed successfully. You can now sign in with your new password."}
            </p>
            <Link href="/login">
              <Button className="w-full bg-[#3ECFC0] text-[#0B1E2D] hover:bg-[#B8F0E8] font-semibold h-12 rounded-xl">
                {isArabic ? "تسجيل الدخول" : "Sign In"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Reset form
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
            {isArabic ? "إعادة تعيين كلمة المرور" : "Reset Your Password"}
          </h1>
          {email && (
            <p className="text-white/40 text-center text-xs mb-1">
              {email}
            </p>
          )}
          <p className="text-white/60 text-center text-sm mb-8">
            {isArabic ? "أدخل كلمة المرور الجديدة" : "Enter your new password below"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 text-center">
                {error}
              </div>
            )}

            {/* New Password */}
            <div>
              <Label className="text-white/70 text-xs mb-1.5 block">
                {isArabic ? "كلمة المرور الجديدة" : "New Password"}
              </Label>
              <div className="relative">
                <Lock className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-white/30" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl ps-10 pe-10"
                  placeholder="••••••••"
                  autoFocus
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

            {/* Confirm Password */}
            <div>
              <Label className="text-white/70 text-xs mb-1.5 block">
                {isArabic ? "تأكيد كلمة المرور" : "Confirm Password"}
              </Label>
              <div className="relative">
                <Lock className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-white/30" />
                <Input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl ps-10 pe-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute top-1/2 -translate-y-1/2 end-3 text-white/40 hover:text-white/70"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Password strength indicators */}
            {newPassword.length > 0 && (
              <div className="space-y-2 bg-white/3 rounded-xl p-3">
                <p className="text-white/50 text-xs font-medium mb-1.5">
                  {isArabic ? "متطلبات كلمة المرور:" : "Password requirements:"}
                </p>
                <PasswordCheck
                  met={hasMinLength}
                  label={isArabic ? "6 أحرف على الأقل" : "At least 6 characters"}
                />
                <PasswordCheck
                  met={hasUppercase}
                  label={isArabic ? "حرف كبير واحد على الأقل" : "At least one uppercase letter"}
                />
                <PasswordCheck
                  met={hasNumber}
                  label={isArabic ? "رقم واحد على الأقل" : "At least one number"}
                />
                {confirmPassword.length > 0 && (
                  <PasswordCheck
                    met={passwordsMatch}
                    label={isArabic ? "كلمات المرور متطابقة" : "Passwords match"}
                  />
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !hasMinLength || !passwordsMatch}
              className="w-full bg-[#3ECFC0] text-[#0B1E2D] hover:bg-[#B8F0E8] font-semibold h-12 rounded-xl disabled:opacity-40"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                isArabic ? "إعادة تعيين كلمة المرور" : "Reset Password"
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
        </div>
      </div>
    </div>
  );
}

function PasswordCheck({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <CheckCircle className="h-3.5 w-3.5 text-[#3ECFC0] shrink-0" />
      ) : (
        <div className="h-3.5 w-3.5 rounded-full border border-white/20 shrink-0" />
      )}
      <span className={`text-xs ${met ? "text-[#3ECFC0]" : "text-white/40"}`}>
        {label}
      </span>
    </div>
  );
}
