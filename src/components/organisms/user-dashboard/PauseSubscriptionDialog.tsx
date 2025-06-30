"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/src/components/atoms/ui/input";
import { Label } from "@/src/components/atoms/ui/label";
import { Button } from "@/src/components/atoms/ui/button";
import { FaRegCalendarAlt } from "react-icons/fa";
import { format, isBefore, isToday } from "date-fns";
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

interface PauseSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  onConfirm: (
    subId: string,
    startDate: string,
    endDate: string,
  ) => Promise<boolean>;
}

export default function PauseSubscriptionDialog({
  isOpen,
  onClose,
  subscription,
  onConfirm,
}: PauseSubscriptionDialogProps) {
  const [pauseStartDate, setPauseStartDate] = useState("");
  const [pauseEndDate, setPauseEndDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [isConfirmSuccess, setIsConfirmSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPauseStartDate("");
      setPauseEndDate("");
      setMessage("");
      setIsSuccess(false);
      setLoading(false);
      setIsConfirmationOpen(false);
      setConfirmMessage("");
      setIsConfirmSuccess(false);
    }
  }, [isOpen]);

  const handlePrePause = () => {
    setMessage("");
    if (!subscription || !pauseStartDate || !pauseEndDate) {
      setMessage("Tanggal mulai dan akhir jeda diperlukan.");
      setIsSuccess(false);
      return;
    }
    const start = new Date(pauseStartDate);
    const end = new Date(pauseEndDate);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setMessage("Format tanggal tidak valid.");
      setIsSuccess(false);
      return;
    }
    if (isBefore(end, start)) {
      setMessage("Tanggal akhir tidak boleh sebelum tanggal mulai.");
      setIsSuccess(false);
      return;
    }
    if (isBefore(start, today) && !isToday(start)) {
      setMessage("Tanggal mulai tidak boleh di masa lalu.");
      setIsSuccess(false);
      return;
    }

    onClose();
    setIsConfirmationOpen(true);
  };

  const handleConfirmPauseYesClick = async () => {
    if (!subscription) return;
    setLoading(true);
    setConfirmMessage("");

    const success = await onConfirm(
      subscription.id,
      pauseStartDate,
      pauseEndDate,
    );
    if (success) {
      setConfirmMessage("Langganan berhasil dijeda!");
      setIsConfirmSuccess(true);
      setTimeout(() => {
        setIsConfirmationOpen(false);
        onClose();
      }, 1500);
    } else {
      setConfirmMessage("Gagal menjeda langganan.");
      setIsConfirmSuccess(false);
    }
    setLoading(false);
  };

  const handleCancelConfirmation = () => {
    setIsConfirmationOpen(false);
    onClose();
  };

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Jeda Langganan</AlertDialogTitle>
            <AlertDialogDescription>
              Pilih tanggal mulai dan akhir untuk menjeda langganan &quot;
              {subscription?.plan.name}&quot;.
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
                  disabled={loading}
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
                  disabled={loading}
                />
                <FaRegCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <SubmissionMessage message={message} isSuccess={isSuccess} />
          </div>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="cursor-pointer"
            >
              Batal
            </Button>
            <Button
              onClick={handlePrePause}
              disabled={!pauseStartDate || !pauseEndDate || loading}
              className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
            >
              {loading ? "Memproses..." : "Konfirmasi Jeda"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isConfirmationOpen}
        onOpenChange={setIsConfirmationOpen}
      >
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Jeda Langganan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menjeda langganan &quot;
              {subscription?.plan.name}&quot; dari{" "}
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
          <SubmissionMessage
            message={confirmMessage}
            isSuccess={isConfirmSuccess}
          />
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelConfirmation}
              disabled={loading}
              className="cursor-pointer"
            >
              Tidak
            </Button>
            <Button
              onClick={handleConfirmPauseYesClick}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
            >
              {loading ? "Memproses..." : "Ya, Jeda Sekarang"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
