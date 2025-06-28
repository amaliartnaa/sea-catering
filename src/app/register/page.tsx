"use client";

import React, { useEffect, useState } from "react";
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
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Check, Eye, EyeOff, X } from "lucide-react";

export default function RegisterPage() {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setHasMinLength(password.length >= 8);
    setHasUpperCase(/[A-Z]/.test(password));
    setHasLowerCase(/[a-z]/.test(password));
    setHasNumber(/[0-9]/.test(password));
    setHasSpecialChar(/[^A-Za-z0-9]/.test(password));
    setPasswordsMatch(password === confirmPassword && password.length > 0);
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    if (
      !hasMinLength ||
      !hasUpperCase ||
      !hasLowerCase ||
      !hasNumber ||
      !hasSpecialChar
    ) {
      setMessage("Password tidak memenuhi semua kriteria kekuatan.");
      return;
    }
    if (!passwordsMatch) {
      setMessage("Konfirmasi Password tidak sama dengan Password.");
      return;
    }

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
      setMessage("Konfirmasi Password tidak sama dengan Password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, password }),
      });

      if (response.ok) {
        setMessage("Pendaftaran berhasil! Silakan login.");
        setIsSuccess(true);
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setMessage("Pendaftaran gagal. Mohon coba lagi.");
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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const PasswordCriteria = ({
    label,
    isValid,
  }: {
    label: string;
    isValid: boolean;
  }) => (
    <div className="flex items-center gap-2 text-sm">
      {isValid ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-red-500" />
      )}
      <span className={isValid ? "text-gray-700" : "text-gray-500"}>
        {label}
      </span>
    </div>
  );

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 py-16 lg:py-auto">
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                type="text"
                className="placeholder:text-sm text-sm"
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
                  placeholder="Password Anda"
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
              <div className="mt-2 text-gray-600 space-y-1">
                <PasswordCriteria
                  label="Minimal 8 karakter"
                  isValid={hasMinLength}
                />
                <PasswordCriteria
                  label="Satu huruf kapital (A-Z)"
                  isValid={hasUpperCase}
                />
                <PasswordCriteria
                  label="Satu huruf kecil (a-z)"
                  isValid={hasLowerCase}
                />
                <PasswordCriteria
                  label="Satu angka (0-9)"
                  isValid={hasNumber}
                />
                <PasswordCriteria
                  label="Satu karakter khusus (!@#$%^&*)"
                  isValid={hasSpecialChar}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="placeholder:text-sm pr-10 text-sm"
                  placeholder="Ketik ulang password Anda"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
              {password.length > 0 && (
                <PasswordCriteria
                  label="Password cocok"
                  isValid={passwordsMatch}
                />
              )}
            </div>

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
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
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
