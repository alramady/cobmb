import { useState, useEffect } from "react";

export type AdminInfo = {
  id: number; username: string; fullName: string; displayName: string;
  email: string; mobile?: string; role: string;
};

export function useAdminAuth() {
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/me", { credentials: "include" });
      const data = await res.json();
      setAdmin(data.admin || null);
    } catch { setAdmin(null); } finally { setLoading(false); }
  };
  useEffect(() => { checkAuth(); }, []);
  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    setAdmin(null);
  };
  return { admin, loading, logout, refetch: checkAuth };
}

export type TabProps = { isArabic: boolean };
export type TabPropsWithAdmin = TabProps & { admin: AdminInfo };
