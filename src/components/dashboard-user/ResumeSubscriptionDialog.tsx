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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface ResumeSubscriptionDialogProps {
  isResumeConfirmationDialogOpen: boolean;
  setIsResumeConfirmationDialogOpen: (open: boolean) => void;
  selectedSubscriptionToResume: Subscription | null;

  resumeLoading: boolean;
  setResumeLoading: (loading: boolean) => void;
  resumeMessage: string;
  setResumeMessage: (msg: string) => void;
  apiSuccessStatus: boolean;
  onConfirmResume: (sub: Subscription) => void;
}

export default function ResumeSubscriptionDialog({
  isResumeConfirmationDialogOpen,
  setIsResumeConfirmationDialogOpen,
  selectedSubscriptionToResume,
  resumeLoading,
  setResumeLoading,
  resumeMessage,
  setResumeMessage,
  apiSuccessStatus,
  onConfirmResume,
}: ResumeSubscriptionDialogProps) {
  const handleConfirmResumeYesClick = () => {
    if (selectedSubscriptionToResume) {
      onConfirmResume(selectedSubscriptionToResume);
    }
  };

  React.useEffect(() => {}, [
    setResumeLoading,
    setResumeMessage,
    setIsResumeConfirmationDialogOpen,
  ]);

  return (
    <AlertDialog
      open={isResumeConfirmationDialogOpen}
      onOpenChange={setIsResumeConfirmationDialogOpen}
    >
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Lanjutkan Langganan</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin melanjutkan langganan &quot;
            {selectedSubscriptionToResume?.plan.name}&quot;? Status akan diubah
            kembali menjadi aktif.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {resumeMessage && (
          <p
            className={cn(
              "text-center text-sm",
              apiSuccessStatus ? "text-green-600" : "text-red-600",
            )}
          >
            {resumeMessage}
          </p>
        )}
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsResumeConfirmationDialogOpen(false)}
            disabled={resumeLoading}
          >
            Tidak
          </Button>
          <Button
            onClick={handleConfirmResumeYesClick}
            disabled={resumeLoading}
            className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
          >
            {resumeLoading ? "Melanjutkan..." : "Ya, Lanjutkan"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
