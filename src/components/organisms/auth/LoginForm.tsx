"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/atoms/ui/button";
import { FormField } from "@/src/components/molecules/common/FormField";
import { PasswordInput } from "@/src/components/molecules/common/PasswordInput";
import { SubmissionMessage } from "@/src/components/molecules/common/SubmissionMessage";

interface LoginFormProps {
  onSubmit: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  isLoading: boolean;
  submissionMessage: string;
  isSubmissionSuccess: boolean;
}

export function LoginForm({
  onSubmit,
  isLoading,
  submissionMessage,
  isSubmissionSuccess,
}: LoginFormProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmitInternal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmitInternal} className="space-y-6">
      {submissionMessage && (
        <SubmissionMessage
          message={submissionMessage}
          isSuccess={isSubmissionSuccess}
        />
      )}

      <FormField
        id="email"
        label="Email"
        type="email"
        placeholder="email@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
      />
      <PasswordInput
        id="password"
        label="Password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
      />

      <Button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? "Masuk..." : "Login"}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Belum punya akun?{" "}
        <Link href="/register" className="text-emerald-600 hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </form>
  );
}
