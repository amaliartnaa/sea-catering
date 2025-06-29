"use client";

import React from "react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

import { Subscription } from "@/src/types/subscription";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface CancelSubscriptionDialogProps {
  isCancelDialogOpen: boolean;
  setIsCancelDialogOpen: (open: boolean) => void;
  selectedSubscriptionToCancel: Subscription | null;

  cancelLoading: boolean;
  setCancelLoading: (loading: boolean) => void;
  cancelMessage: string;
  setCancelMessage: (msg: string) => void;
  apiSuccessStatus: boolean;
  onConfirmCancel: (sub: Subscription) => void;
}

export default function CancelSubscriptionDialog({
  isCancelDialogOpen,
  setIsCancelDialogOpen,
  selectedSubscriptionToCancel,
  cancelLoading,
  setCancelLoading,
  cancelMessage,
  setCancelMessage,
  apiSuccessStatus,
  onConfirmCancel,
}: CancelSubscriptionDialogProps) {
  const handleConfirmCancelYesClick = () => {
    if (selectedSubscriptionToCancel) {
      onConfirmCancel(selectedSubscriptionToCancel);
    }
  };

  React.useEffect(() => {}, [
    setCancelLoading,
    setCancelMessage,
    setIsCancelDialogOpen,
  ]);

  return (
    <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Batalkan Langganan</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin membatalkan langganan &quot;
            {selectedSubscriptionToCancel?.plan.name}&quot;? Tindakan ini tidak
            dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {cancelMessage && (
          <p
            className={cn(
              "text-center text-sm",
              apiSuccessStatus ? "text-green-600" : "text-red-600",
            )}
          >
            {cancelMessage}
          </p>
        )}
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsCancelDialogOpen(false)}
            disabled={cancelLoading}
          >
            Tidak
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmCancelYesClick}
            disabled={cancelLoading}
            className="cursor-pointer"
          >
            {cancelLoading ? "Membatalkan..." : "Ya, Batalkan"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
