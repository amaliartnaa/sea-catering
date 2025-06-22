"use client";

import React, { useState } from "react";
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
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { cn } from "@/src/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message || "Login berhasil!");
        setIsSuccess(true);
        login(result.token, result.user);

        setEmail("");
        setPassword("");

        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Email atau password salah");
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
            <div
              className={cn(
                "p-3 rounded-md text-sm mb-4 text-center",
                isSuccess
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700",
              )}
            >
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
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
