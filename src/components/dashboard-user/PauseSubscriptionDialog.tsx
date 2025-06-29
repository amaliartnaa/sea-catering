"use client";

import React from "react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { FaRegCalendarAlt } from "react-icons/fa";
import { cn } from "@/src/lib/utils";
import { format, isBefore, isToday } from "date-fns";

import { Subscription } from "@/src/types/subscription";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface PauseSubscriptionDialogsProps {
  isPauseDialogOpen: boolean;
  setIsPauseDialogOpen: (open: boolean) => void;
  selectedSubscriptionToPause: Subscription | null;

  pauseStartDate: string;
  setPauseStartDate: (date: string) => void;
  pauseEndDate: string;
  setPauseEndDate: (date: string) => void;

  pauseLoading: boolean;
  pauseMessage: string;
  setPauseMessage: (msg: string) => void;
  confirmPauseMessage: string;
  setConfirmPauseMessage: (msg: string) => void;
  apiSuccessStatus: boolean;

  isPauseConfirmationDialogOpen: boolean;
  setIsPauseConfirmationDialogOpen: (open: boolean) => void;

  onConfirmPause: (
    sub: Subscription,
    startDate: string,
    endDate: string,
  ) => void;
}

export default function PauseSubscriptionDialog({
  isPauseDialogOpen,
  setIsPauseDialogOpen,
  selectedSubscriptionToPause,
  pauseStartDate,
  setPauseStartDate,
  pauseEndDate,
  setPauseEndDate,
  pauseLoading,
  pauseMessage,
  setPauseMessage,
  confirmPauseMessage,
  setConfirmPauseMessage,
  apiSuccessStatus,
  isPauseConfirmationDialogOpen,
  setIsPauseConfirmationDialogOpen,
  onConfirmPause,
}: PauseSubscriptionDialogsProps) {
  const handlePrePause = () => {
    if (!selectedSubscriptionToPause || !pauseStartDate || !pauseEndDate) {
      setPauseMessage("Tanggal mulai dan akhir jeda diperlukan.");
      return;
    }
    const start = new Date(pauseStartDate);
    const end = new Date(pauseEndDate);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setPauseMessage("Format tanggal tidak valid.");
      return;
    }
    if (isBefore(end, start)) {
      setPauseMessage("Tanggal akhir tidak boleh sebelum tanggal mulai.");
      return;
    }
    if (isBefore(start, today) && !isToday(start)) {
      setPauseMessage("Tanggal mulai tidak boleh di masa lalu.");
      return;
    }

    setPauseMessage("");
    setConfirmPauseMessage("");
    setIsPauseDialogOpen(false);
    setIsPauseConfirmationDialogOpen(true);
  };

  const handleCancelConfirmation = () => {
    setIsPauseConfirmationDialogOpen(false);
    setIsPauseDialogOpen(true);
  };

  const handleConfirmPauseYesClick = () => {
    if (selectedSubscriptionToPause) {
      onConfirmPause(selectedSubscriptionToPause, pauseStartDate, pauseEndDate);
    }
  };

  return (
    <>
      <AlertDialog open={isPauseDialogOpen} onOpenChange={setIsPauseDialogOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Jeda Langganan</AlertDialogTitle>
            <AlertDialogDescription>
              Pilih tanggal mulai dan akhir untuk menjeda langganan &quot;
              {selectedSubscriptionToPause?.plan.name}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pauseStartDate" className="text-right">
                Dari
              </Label>
              <div className="relative col-span-3">
                <Input
                  id="pauseStartDate"
                  type="date"
                  value={pauseStartDate}
                  onChange={(e) => setPauseStartDate(e.target.value)}
                  className="w-full pr-10 appearance-none calendar-icon-none clickable-calendar"
                />
                <FaRegCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pauseEndDate" className="text-right">
                Sampai
              </Label>
              <div className="relative col-span-3">
                <Input
                  id="pauseEndDate"
                  type="date"
                  value={pauseEndDate}
                  onChange={(e) => setPauseEndDate(e.target.value)}
                  className="w-full pr-10 appearance-none calendar-icon-none clickable-calendar"
                />
                <FaRegCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
            {pauseMessage && (
              <p
                className={cn(
                  "text-center text-sm",
                  apiSuccessStatus ? "text-green-600" : "text-red-600",
                )}
              >
                {pauseMessage}
              </p>
            )}
          </div>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPauseDialogOpen(false)}
              disabled={pauseLoading}
            >
              Batal
            </Button>
            <Button
              onClick={handlePrePause}
              disabled={!pauseStartDate || !pauseEndDate || pauseLoading}
              className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
            >
              {pauseLoading ? "Memproses..." : "Konfirmasi Jeda"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isPauseConfirmationDialogOpen}
        onOpenChange={setIsPauseConfirmationDialogOpen}
      >
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Jeda Langganan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menjeda langganan &quot;
              {selectedSubscriptionToPause?.plan.name}&quot; dari{" "}
              {pauseStartDate
                ? format(new Date(pauseStartDate), "dd/MM/yyyy")
                : "N/A"}{" "}
              sampai{" "}
              {pauseEndDate
                ? format(new Date(pauseEndDate), "dd/MM/yyyy")
                : "N/A"}
              ? Selama periode ini, tidak ada biaya yang akan diterapkan.{" "}
              <strong className="text-red-600">
                Tanggal jeda tidak dapat dirubah!
              </strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          {confirmPauseMessage && (
            <p
              className={cn(
                "text-center text-sm",
                apiSuccessStatus ? "text-green-600" : "text-red-600",
              )}
            >
              {confirmPauseMessage}
            </p>
          )}
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelConfirmation}
              disabled={pauseLoading}
            >
              Tidak
            </Button>
            <Button
              onClick={handleConfirmPauseYesClick}
              disabled={pauseLoading}
              className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
            >
              {pauseLoading ? "Memproses..." : "Ya, Jeda Sekarang"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
