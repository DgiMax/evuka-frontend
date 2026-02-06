"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/api/axios";
import { RESERVED_SLUGS } from "@/lib/constants";

declare module "axios" {
  export interface AxiosRequestConfig {
    _skipAuthRefresh?: boolean;
    _retry?: boolean;
  }
}

interface Organization {
  organization_name: string;
  organization_slug: string;
  organization_status: string;
  is_published: boolean;
  role?: string;
  is_active?: boolean;
}

interface User {
  id: number;
  username: string;
  email: string;
  is_verified: boolean;
  is_superadmin: boolean;
  is_moderator: boolean;
  is_tutor?: boolean;
  is_student?: boolean;
  organizations?: Organization[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isStudent: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string, origin?: string) => Promise<any>;
  forgotPassword: (email: string, origin?: string) => Promise<any>;
  resetPassword: (token: string, password: string) => Promise<any>;
  verifyEmail: (token: string) => Promise<any>;
  resendVerification: (email: string, origin?: string) => Promise<any>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<any>;
  fetchCurrentUser: (skip?: boolean) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = useMemo(() => !!user, [user]);
  const isStudent = useMemo(() => !!user?.is_student, [user]);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const skipFor = ["/login", "/register", "/verify-email"];
        if (skipFor.some((path) => originalRequest?.url?.includes(path))) {
          return Promise.reject(error);
        }
        if (originalRequest._retry) {
          return Promise.reject(error);
        }
        if (error.response?.status === 401) {
          originalRequest._retry = true;
          try {
            await api.post("/users/refresh/", null, { _skipAuthRefresh: true });
            return api(originalRequest);
          } catch {
            setUser(null);
            localStorage.removeItem("activeOrgSlug");
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await api.get<User>("/users/me/");
      setUser(res.data);
      return res.data;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchCurrentUser();
      setLoading(false);
    };
    init();
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    const authPages = [
      "/login",
      "/register",
      "/forgot-password",
      "/verify-email",
      "/reset-password",
    ];

    const isAuthPage = authPages.some((r) => pathname.startsWith(r));

    if (isAuthPage) {
      const pathParts = pathname.split("/").filter(Boolean);
      const firstSegment = pathParts[0];
      const isContextual =
        firstSegment && !RESERVED_SLUGS.includes(firstSegment);

      router.replace(isContextual ? `/${firstSegment}/dashboard` : "/dashboard");
    }
  }, [user, loading, pathname, router]);

  const login = async (username: string, password: string) => {
    await api.post("/users/login/", { username, password });
    await fetchCurrentUser();
    localStorage.removeItem("activeOrgSlug");
    router.push("/dashboard");
  };

  const logout = async () => {
    try {
      await api.post("/users/logout/");
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
      localStorage.removeItem("activeOrgSlug");
      router.push("/");
    }
  };

  const register = (username: string, email: string, password: string, origin?: string) => {
    const data = { username, email, password, origin: origin || window.location.origin };
    return api.post("/users/register/", data);
  };

  const forgotPassword = (email: string, origin?: string) => {
    const data = { email, origin: origin || window.location.origin };
    return api.post("/users/forgot-password/", data);
  };

  const resetPassword = (token: string, password: string) => {
    return api.post(`/users/reset-password/${token}/`, { password });
  };

  const verifyEmail = (token: string) => {
    return api.post("/users/verify-email/", { token });
  };

  const resendVerification = (email: string, origin?: string) => {
    const data = { email, origin: origin || window.location.origin };
    return api.post("/users/resend-verification/", data);
  };

  const changePassword = (oldPassword: string, newPassword: string) => {
    return api.post("/users/change-password/", {
      old_password: oldPassword,
      new_password: newPassword,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isStudent,
        login,
        logout,
        register,
        forgotPassword,
        resetPassword,
        verifyEmail,
        resendVerification,
        changePassword,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};