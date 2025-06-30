"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/src/components//atoms/ui/button";
import { Subscription } from "@/src/types/subscription";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/atoms/ui/alert-dialog";
import { SubmissionMessage } from "@/src/components/molecules/common/SubmissionMessage";

interface ResumeSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  onConfirm: (subId: string) => Promise<boolean>;
}

export default function ResumeSubscriptionDialog({
  isOpen,
  onClose,
  subscription,
  onConfirm,
}: ResumeSubscriptionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConfirmClick = async () => {
    if (!subscription) return;
    setLoading(true);
    setMessage("");

    const success = await onConfirm(subscription.id);
    if (success) {
      setMessage("Langganan berhasil dilanjutkan!");
      setIsSuccess(true);
      setTimeout(() => onClose(), 1500);
    } else {
      setMessage("Gagal melanjutkan langganan.");
      setIsSuccess(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      setMessage("");
      setLoading(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Lanjutkan Langganan</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin melanjutkan langganan &quot;
            {subscription?.plan.name}&quot;? Status akan diubah kembali menjadi
            aktif.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <SubmissionMessage message={message} isSuccess={isSuccess} />
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer"
          >
            Tidak
          </Button>
          <Button
            onClick={handleConfirmClick}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
          >
            {loading ? "Melanjutkan..." : "Ya, Lanjutkan"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
