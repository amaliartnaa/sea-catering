import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/atoms/ui/card";
import { Button } from "@/src/components/atoms/ui/button";

export function AuthRequiredMessage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-emerald-800">
            Akses Berlangganan
          </CardTitle>
          <CardDescription className="text-gray-600">
            Nikmati kemudahan kustomisasi dan pengiriman makanan sehat. Untuk
            memulai langganan, Anda perlu login atau mendaftar terlebih dahulu.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4">
            <Link href="/login">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-md py-3 cursor-pointer">
                Login Sekarang
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-md py-3 cursor-pointer"
              >
                Daftar Akun Baru
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Sudah memiliki akun? Cukup login untuk melanjutkan!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
