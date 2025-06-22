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
import { cn } from "@/src/lib/utils";

export default function RegisterPage() {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    if (password.length < 8) {
      setMessage("Password harus minimal 8 karakter.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setMessage("Password harus mengandung setidaknya satu huruf kapital.");
      return;
    }
    if (!/[a-z]/.test(password)) {
      setMessage("Password harus mengandung setidaknya satu huruf kecil.");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setMessage("Password harus mengandung setidaknya satu angka.");
      return;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      setMessage("Password harus mengandung setidaknya satu karakter khusus.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Password belum sama.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullName, email, password }),
        },
      );

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message || "Pendaftaran berhasil! Silahkan login.");
        setIsSuccess(true);
        setFullName("");
        setEmail("");
        setPassword("");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Pendaftaran gagal. Mohon coba lagi.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage("Terjadi kesalahan koneksi. Mohon coba lagi nanti.");
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
            Daftar Akun Baru
          </CardTitle>
          <CardDescription className="text-gray-600">
            Bergabunglah dengan SEA Catering dan mulai perjalanan sehat Anda!
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <div
              className={cn(
                "p-3 rounded-md text-sm mb-4 text-center",
                isSuccess
                  ? "bg-green-199 text-green-700"
                  : "bg-red-100 text-red-700",
              )}
            >
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Nama lengkap Anda"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
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
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimal 8 karakter (termasuk huruf besar, kecil, angka, spesial)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Ketik ulang password Anda"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={loading}
            >
              {loading ? "Mendaftar..." : "Daftar Sekarang"}
            </Button>
            <p className="text-center text-sm text-gray-600">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-emerald-600 hover:underline">
                Login di sini
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
