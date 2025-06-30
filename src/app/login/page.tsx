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
import { useAuth } from "@/src/context/AuthContext";
import { LoginForm } from "@/src/components/organisms/auth/LoginForm";

export default function LoginPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const router = useRouter();
  const { login } = useAuth();

  const handleSubmitLogin = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    setMessage("");
    setIsSuccess(false);

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
        setMessage("Login berhasil!");
        setIsSuccess(true);
        login(result.user);

        const redirectFrom = new URLSearchParams(window.location.search).get(
          "redirect_from",
        );
        router.push(redirectFrom || "/dashboard");
        return { success: true, message: "Login berhasil!" };
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Email atau password salah.";
        setMessage(errorMessage);
        setIsSuccess(false);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error("Error during login:", error);
      const errorMessage = "Terjadi masalah koneksi. Mohon coba lagi nanti.";
      setMessage(errorMessage);
      setIsSuccess(false);
      return { success: false, message: errorMessage };
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
          <LoginForm
            onSubmit={handleSubmitLogin}
            isLoading={loading}
            submissionMessage={message}
            isSubmissionSuccess={isSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
}
