"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/src/components/atoms/ui/button";
import { FormField } from "@/src/components/molecules/common/FormField";
import { PasswordInput } from "@/src/components/molecules/common/PasswordInput";
import { PasswordCriteria } from "@/src/components/molecules/common/PasswordCriteria";
import { SubmissionMessage } from "@/src/components/molecules/common/SubmissionMessage";

interface RegisterFormProps {
  onSubmit: (
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<{ success: boolean; message: string }>;
  isLoading: boolean;
  submissionMessage: string;
  isSubmissionSuccess: boolean;
}

export function RegisterForm({
  onSubmit,
  isLoading,
  submissionMessage,
  isSubmissionSuccess,
}: RegisterFormProps) {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  useEffect(() => {
    setHasMinLength(password.length >= 8);
    setHasUpperCase(/[A-Z]/.test(password));
    setHasLowerCase(/[a-z]/.test(password));
    setHasNumber(/[0-9]/.test(password));
    setHasSpecialChar(/[^A-Za-z0-9]/.test(password));
    setPasswordsMatch(password === confirmPassword && password.length > 0);
  }, [password, confirmPassword]);

  const handleSubmitInternal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !hasMinLength ||
      !hasUpperCase ||
      !hasLowerCase ||
      !hasNumber ||
      !hasSpecialChar ||
      !passwordsMatch
    ) {
      return;
    }

    await onSubmit(fullName, email, password, confirmPassword);
  };

  return (
    <form onSubmit={handleSubmitInternal} className="space-y-6">
      <FormField
        id="fullName"
        label="Nama Lengkap"
        type="text"
        placeholder="Nama lengkap Anda"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        disabled={isLoading}
      />
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
        placeholder="Password Anda"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
      />
      <div className="mt-2 text-gray-600 space-y-1">
        <PasswordCriteria label="Minimal 8 karakter" isValid={hasMinLength} />
        <PasswordCriteria
          label="Satu huruf kapital (A-Z)"
          isValid={hasUpperCase}
        />
        <PasswordCriteria
          label="Satu huruf kecil (a-z)"
          isValid={hasLowerCase}
        />
        <PasswordCriteria label="Satu angka (0-9)" isValid={hasNumber} />
        <PasswordCriteria
          label="Satu karakter khusus (!@#$%^&*)"
          isValid={hasSpecialChar}
        />
      </div>

      <PasswordInput
        id="confirmPassword"
        label="Konfirmasi Password"
        placeholder="Ketik ulang password Anda"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        disabled={isLoading}
      />
      {password.length > 0 && (
        <PasswordCriteria label="Password cocok" isValid={passwordsMatch} />
      )}

      {submissionMessage && (
        <SubmissionMessage
          message={submissionMessage}
          isSuccess={isSubmissionSuccess}
        />
      )}

      <Button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
        disabled={
          isLoading ||
          !hasMinLength ||
          !hasUpperCase ||
          !hasLowerCase ||
          !hasNumber ||
          !hasSpecialChar ||
          !passwordsMatch
        }
      >
        {isLoading ? "Mendaftar..." : "Daftar Sekarang"}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-emerald-600 hover:underline">
          Login di sini
        </Link>
      </p>
    </form>
  );
}
