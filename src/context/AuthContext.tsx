"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/api/axios";

/* Types -------------------------------------------------------------- */

interface Organization {
  organization_name: string;
  organization_slug: string;
  role?: string;
  is_active: boolean;
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
  register: (username: string, email: string, password: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (token: string, password: string) => Promise<any>;
  verifyEmail: (token: string) => Promise<any>;
  resendVerification: (email: string) => Promise<any>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<any>;
  fetchCurrentUser: (skip?: boolean) => Promise<User | null>;
}

/* Context ------------------------------------------------------------ */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = useMemo(() => !!user, [user]);
  const isStudent = useMemo(() => !!user?.is_student, [user]);

  /* ------------------------------------------------------------------
     AXIOS TOKEN REFRESH INTERCEPTOR (FIXED)
  ------------------------------------------------------------------ */

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Do not refresh tokens during login/register/verification
        const skipFor = ["/login", "/register", "/verify-email"];
        if (skipFor.some((path) => originalRequest?.url?.includes(path))) {
          return Promise.reject(error);
        }

        // prevent infinite loops
        if (originalRequest._retry) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401) {
          originalRequest._retry = true;
          try {
            await api.post("/users/refresh/", null, {
              _skipAuthRefresh: true,
            });

            return api(originalRequest); // retry original
          } catch {
            // refresh failed → clear user (session ended)
            setUser(null);
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, []);

  /* ------------------------------------------------------------------
     FETCH CURRENT USER (FIXED)
  ------------------------------------------------------------------ */

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get<User>("/users/me/");
      setUser(res.data);
      return res.data;
    } catch {
      // DO NOT force logout here.
      // User may still be logging in or registering.
      return null;
    }
  };

  /* ------------------------------------------------------------------
     INITIAL LOAD (FIXED)
  ------------------------------------------------------------------ */

  useEffect(() => {
    const init = async () => {
      await fetchCurrentUser();
      setLoading(false);
    };

    init();
  }, []);

  /* ------------------------------------------------------------------
     AUTH REDIRECT LOGIC (FIXED, NO INFINITE LOOPS)
  ------------------------------------------------------------------ */

  useEffect(() => {
    if (loading) return;

    // Unauthenticated users can access all public pages
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
      router.replace("/dashboard");
    }
  }, [user, loading, pathname, router]);

  /* ------------------------------------------------------------------
     AUTH FUNCTIONS
  ------------------------------------------------------------------ */

  const login = async (username: string, password: string) => {
    await api.post("/users/login/", { username, password });
    await fetchCurrentUser(); // get user data after successful login
    router.push("/dashboard");
  };

  const logout = async () => {
    try {
      await api.post("/users/logout/");
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
      setUser(null);
      router.push("/");
    }
  };

  const register = (username: string, email: string, password: string) => {
    return api.post("/users/register/", { username, email, password });
  };

  const forgotPassword = (email: string) => {
    return api.post("/users/forgot-password/", { email });
  };

  const resetPassword = (token: string, password: string) => {
    return api.post(`/users/reset-password/${token}/`, { password });
  };

  const verifyEmail = (token: string) => {
    return api.post("/users/verify-email/", { token });
  };

  const resendVerification = (email: string) => {
    return api.post("/users/resend-verification/", { email });
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

/* Export Hook -------------------------------------------------------- */

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
