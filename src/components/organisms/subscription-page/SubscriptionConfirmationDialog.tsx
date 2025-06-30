import React from "react";
import { Button } from "@/src/components/atoms/ui/button";
import { MEAL_PLANS } from "@/src/lib/constants";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../atoms/ui/alert-dialog";

interface SubscriptionConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formData: {
    customerName: string;
    phoneNumber: string;
    planId: string;
    mealTypes: string[];
    deliveryDays: string[];
    allergies: string | null;
  } | null;
  totalPrice: number;
  loading: boolean;
}

export function SubscriptionConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  formData,
  totalPrice,
  loading,
}: SubscriptionConfirmationDialogProps) {
  if (!formData) return null;

  const currentPlan = MEAL_PLANS.find((plan) => plan.id === formData.planId);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Berlangganan</AlertDialogTitle>
          <AlertDialogDescription>
            Mohon periksa kembali detail langganan Anda sebelum melanjutkan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4 space-y-3 text-sm">
          <p>
            <span className="font-semibold">Nama Pelanggan:</span>{" "}
            {formData.customerName}
          </p>
          <p>
            <span className="font-semibold">Nomor Telepon:</span>{" "}
            {formData.phoneNumber}
          </p>
          <p>
            <span className="font-semibold">Paket Terpilih:</span>{" "}
            {currentPlan?.name || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Jenis Makanan:</span>{" "}
            {formData.mealTypes.join(", ") || "Belum dipilih"}
          </p>
          <p>
            <span className="font-semibold">Hari Pengiriman:</span>{" "}
            {formData.deliveryDays.join(", ") || "Belum dipilih"}
          </p>
          {formData.allergies && (
            <p>
              <span className="font-semibold">Alergi/Diet:</span>{" "}
              {formData.allergies}
            </p>
          )}
          <p className="text-lg font-bold text-emerald-800 pt-2">
            Total Pembayaran: Rp{totalPrice.toLocaleString("id-ID")}
          </p>
        </div>

        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer"
          >
            Masih Pilih Lagi
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
          >
            {loading ? "Memproses..." : "Ya, Saya Yakin"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
