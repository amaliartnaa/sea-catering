"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/atoms/ui/card";
import { RegisterForm } from "@/src/components/organisms/auth/RegisterForm";

export default function RegisterPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmitRegister = async (
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<{ success: boolean; message: string }> => {
    setMessage("");
    setIsSuccess(false);

    if (password !== confirmPassword) {
      const errorMessage = "Konfirmasi Password tidak sama dengan Password.";
      setMessage(errorMessage);
      setIsSuccess(false);
      return { success: false, message: errorMessage };
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
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return { success: true, message: "Pendaftaran berhasil!" };
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.message || "Pendaftaran gagal. Mohon coba lagi.";
        setMessage(errorMessage);
        setIsSuccess(false);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error("Error during registration:", error);
      const errorMessage = "Terjadi kesalahan koneksi. Mohon coba lagi nanti.";
      setMessage(errorMessage);
      setIsSuccess(false);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
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
          <RegisterForm
            onSubmit={handleSubmitRegister}
            isLoading={loading}
            submissionMessage={message}
            isSubmissionSuccess={isSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
}
