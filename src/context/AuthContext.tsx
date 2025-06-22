"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

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
        const errorText = await response.text();
        console.error("Server error:", errorText);
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
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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
