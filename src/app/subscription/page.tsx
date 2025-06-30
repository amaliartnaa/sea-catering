"use client";

import React, { useState, useCallback } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { toast } from "sonner";
import { SubscriptionForm } from "@/src/components/organisms/subscription-page/SubscriptionForm";
import { SubscriptionConfirmationDialog } from "@/src/components/organisms/subscription-page/SubscriptionConfirmationDialog";
import { AuthRequiredMessage } from "@/src/components/organisms/common/AuthRequiredMessage";
import { Subscription } from "@/src/types/subscription";

type SubscriptionFormData = Pick<
  Subscription,
  | "customerName"
  | "phoneNumber"
  | "planId"
  | "mealTypes"
  | "deliveryDays"
  | "allergies"
>;

export default function SubscriptionPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] =
    useState<boolean>(false);
  const [formDataToConfirm, setFormDataToConfirm] =
    useState<SubscriptionFormData | null>(null);
  const [totalPriceForConfirmation, setTotalPriceForConfirmation] =
    useState<number>(0);

  const { isLoading, isAuthenticated } = useAuth();

  const handleOpenConfirmDialog = useCallback(
    (formData: SubscriptionFormData, calculatedPrice: number) => {
      setFormDataToConfirm(formData);
      setTotalPriceForConfirmation(calculatedPrice);
      setIsConfirmDialogOpen(true);
    },
    [],
  );

  const handleSubmitSubscription = useCallback(
    async (formData: SubscriptionFormData) => {
      setLoading(true);
      setIsConfirmDialogOpen(false);

      let csrfToken;
      try {
        const csrfResponse = await fetch("/api/csrf-token");
        if (!csrfResponse.ok) {
          throw new Error(
            "Failed to fetch CSRF token: HTTP error " + csrfResponse.status,
          );
        }
        const data = await csrfResponse.json();
        if (!data.csrfToken) {
          throw new Error("CSRF token not found in response");
        }
        csrfToken = data.csrfToken;
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
        toast.error("Gagal mendapatkan token keamanan. Mohon coba lagi.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/subscriptions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
          },
          credentials: "include",
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast.success(
            "Langganan berhasil dibuat! Silakan lihat di dashboard Anda untuk detail lebih lanjut.",
            { duration: 5000 },
          );
        } else {
          const errorData = await response.json();
          let errorMessage = "Gagal berlangganan. Mohon coba lagi.";
          if (response.status === 401 || response.status === 403) {
            errorMessage =
              "Sesi Anda telah berakhir atau tidak memiliki izin. Silakan login kembali.";
          } else if (response.status === 400 && errorData.errors) {
            errorMessage =
              "Terdapat kesalahan pada input Anda. Silakan periksa kembali.";
          } else {
            errorMessage =
              errorData.message || "Gagal berlangganan. Mohon coba lagi.";
          }
          toast.error("Gagal Berlangganan!", {
            description: errorMessage,
            duration: 5000,
          });
        }
      } catch (error) {
        console.error("Network or server error:", error);
        toast.error("Terjadi masalah koneksi. Mohon coba lagi.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-center text-lg text-gray-700">
        <p>Memuat status autentikasi...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthRequiredMessage />;
  }

  return (
    <div className="container mx-auto p-8 py-12">
      <h1 className="text-3xl lg:text-5xl font-extrabold text-center text-emerald-800 mb-12">
        Berlangganan Paket Makanan Sehat
      </h1>

      <SubscriptionForm
        loading={loading}
        onOpenConfirmDialog={handleOpenConfirmDialog}
      />

      <SubscriptionConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={() => handleSubmitSubscription(formDataToConfirm!)}
        formData={formDataToConfirm}
        totalPrice={totalPriceForConfirmation}
        loading={loading}
      />
    </div>
  );
}
