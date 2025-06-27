"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";
import { useAuth } from "@/src/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/src/components/ui/alert";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message || "Login berhasil!");
        setIsSuccess(true);

        login(result.user);

        setEmail("");
        setPassword("");

        const redirectFrom = new URLSearchParams(window.location.search).get(
          "redirect_from",
        );
        router.push(redirectFrom || "/dashboard");
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Email atau password salah.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("Terjadi masalah koneksi. Mohon coba lagi nanti.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-emerald-800">
            Masuk Akun
          </CardTitle>
          <CardDescription className="text-gray-600">
            Login untuk melanjutkan ke layanan SEA Catering.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert
              className={cn(
                "mb-4",
                isSuccess
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700",
              )}
            >
              <AlertDescription
                className={cn(
                  "text-sm",
                  isSuccess ? "text-green-700" : "text-red-700",
                )}
              >
                {message}
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                className="placeholder:text-sm text-sm"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="placeholder:text-sm pr-10 text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Masuk..." : "Login"}
            </Button>
            <p className="text-center text-sm text-gray-600">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="text-emerald-600 hover:underline"
              >
                Daftar sekarang
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
