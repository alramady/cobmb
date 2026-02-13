import { useState, useEffect, useCallback } from "react";

export interface ClientUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatar: string | null;
  role: "guest" | "owner";
  company: string | null;
  bio?: string | null;
  preferredLanguage?: string | null;
  emailVerified?: boolean;
  createdAt?: string;
}

interface UseClientAuthReturn {
  client: ClientUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<ClientUser>) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  refetch: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "guest" | "owner";
  company?: string;
  preferredLanguage?: string;
}

export function useClientAuth(): UseClientAuthReturn {
  const [client, setClient] = useState<ClientUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch("/api/client/me", { credentials: "include" });
      const data = await res.json();
      setClient(data.client || null);
    } catch {
      setClient(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/client/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }
      setClient(data.client);
      return { success: true };
    } catch {
      return { success: false, error: "Network error" };
    }
  };

  const register = async (registerData: RegisterData) => {
    try {
      const res = await fetch("/api/client/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(registerData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Registration failed" };
      }
      setClient(data.client);
      return { success: true };
    } catch {
      return { success: false, error: "Network error" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/client/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore
    }
    setClient(null);
  };

  const updateProfile = async (data: Partial<ClientUser>) => {
    try {
      const res = await fetch("/api/client/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, error: result.error || "Update failed" };
      }
      if (result.client) setClient(result.client);
      return { success: true };
    } catch {
      return { success: false, error: "Network error" };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const res = await fetch("/api/client/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, error: result.error || "Password change failed" };
      }
      return { success: true };
    } catch {
      return { success: false, error: "Network error" };
    }
  };

  return {
    client,
    loading,
    isAuthenticated: !!client,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refetch: fetchMe,
  };
}
