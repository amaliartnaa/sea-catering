"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

import { Subscription } from "@/src/types/subscription";

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
    <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Batalkan Langganan</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin membatalkan langganan &quot;
            {selectedSubscriptionToCancel?.plan.name}&quot;? Tindakan ini tidak
            dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
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
        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
