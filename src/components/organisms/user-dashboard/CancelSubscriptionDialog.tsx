"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/src/components/atoms/ui/button";
import { Subscription } from "@/src/types/subscription";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/atoms/ui/alert-dialog";
import { SubmissionMessage } from "../../molecules/common/SubmissionMessage";

interface CancelSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  onConfirm: (subId: string) => Promise<boolean>;
}

export default function CancelSubscriptionDialog({
  isOpen,
  onClose,
  subscription,
  onConfirm,
}: CancelSubscriptionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConfirmClick = async () => {
    if (!subscription) return;
    setLoading(true);
    setMessage("");

    const success = await onConfirm(subscription.id);
    if (success) {
      setMessage("Langganan berhasil dibatalkan!");
      setIsSuccess(true);
      setTimeout(() => onClose(), 1500);
    } else {
      setMessage("Gagal membatalkan langganan.");
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
          <AlertDialogTitle>Batalkan Langganan</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin membatalkan langganan &quot;
            {subscription?.plan.name}&quot;?{" "}
            <strong className="text-red-600">
              Tindakan ini tidak dapat dibatalkan.
            </strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <SubmissionMessage message={message} isSuccess={isSuccess} />
        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Tidak
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmClick}
            disabled={loading}
            className="cursor-pointer"
          >
            {loading ? "Membatalkan..." : "Ya, Batalkan"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
