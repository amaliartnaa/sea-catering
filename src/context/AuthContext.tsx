"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

interface User {
  userId: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (newUser: User) => void;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`,
        {
          credentials: "include",
        },
      );

      const contentType = response.headers.get("content-type") || "";
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          Cookies.remove("token", { path: "/" });
        }
        const errorText = await response.text();
        console.error("Server error during fetchUser:", errorText);
        throw new Error("Session invalid");
      }

      if (contentType.includes("application/json")) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        const raw = await response.text();
        console.error("Expected JSON but got:", raw);
        throw new Error("Invalid server response");
      }
    } catch (error) {
      console.error("Failed to fetch user data or session invalid:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const protectedPaths = ["/dashboard", "/admin"];
    const authOnlyPaths = ["/login", "/register"];

    const currentPath = pathname;

    const isProtectedPath = protectedPaths.some((path) =>
      currentPath.startsWith(path),
    );
    const isAuthOnlyPath = authOnlyPaths.some((path) =>
      currentPath.startsWith(path),
    );

    if (!isLoading) {
      if (isProtectedPath && !isAuthenticated) {
        if (currentPath !== "/login") {
          console.log(
            `[AuthContext] Redirecting from protected path ${currentPath} to /login (not authenticated)`,
          );
          router.push(`/login?redirect_from=${currentPath}`);
        }
      } else if (isAuthOnlyPath && isAuthenticated) {
        console.log(
          `[AuthContext] Authenticated on auth-only path ${currentPath}. User role: ${user?.role}`,
        );
        if (user?.role === "admin") {
          if (currentPath !== "/admin/dashboard") {
            console.log("[AuthContext] Redirecting admin to /admin/dashboard");
            router.push("/admin/dashboard");
          } else {
            console.log(
              "[AuthContext] Admin already on /admin/dashboard. No redirect.",
            );
          }
        } else {
          // Pengguna biasa
          if (currentPath !== "/dashboard") {
            console.log("[AuthContext] Redirecting regular user to /dashboard");
            router.push("/dashboard");
          } else {
            console.log(
              "[AuthContext] Regular user already on /dashboard. No redirect.",
            );
          }
        }
      }
    } else {
      console.log(
        "[AuthContext] Still loading user data. No redirect decision yet.",
      );
    }
  }, [isAuthenticated, isLoading, pathname, router, user]);

  const login = (newUser: User) => {
    setUser(newUser);
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error logging out on backend:", error);
    } finally {
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
