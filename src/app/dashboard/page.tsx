"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { format } from "date-fns";
import { cn } from "@/src/lib/utils";
import Link from "next/link";

interface Subscription {
  id: string;
  customerName: string;
  phoneNumber: string;
  planId: string;
  plan: {
    id: string;
    name: string;
    price: number;
    description: string;
    details?: string;
    image?: string;
  };
  mealTypes: string[];
  deliveryDays: string[];
  allergies: string | null;
  totalPrice: number;
  status: "active" | "paused" | "cancelled";
  pauseStartDate: string | null;
  pauseEndDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function UserDashboardPage() {
  const { isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [isPauseDialogOpen, setIsPauseDialogOpen] = useState(false);
  const [selectedSubscriptionToPause, setSelectedSubscriptionToPause] =
    useState<Subscription | null>(null);
  const [pauseStartDate, setPauseStartDate] = useState("");
  const [pauseEndDate, setPauseEndDate] = useState("");
  const [pauseLoading, setPauseLoading] = useState(false);
  const [pauseMessage, setPauseMessage] = useState("");

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedSubscriptionToCancel, setSelectedSubscriptionToCancel] =
    useState<Subscription | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");
  const [isResumeConfirmationDialogOpen, setIsResumeConfirmationDialogOpen] =
    useState(false);
  const [selectedSubscriptionToResume, setSelectedSubscriptionToResume] =
    useState<Subscription | null>(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeMessage, setResumeMessage] = useState("");

  const fetchUserSubscriptions = useCallback(async () => {
    setLoadingSubscriptions(true);
    setMessage("");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscriptions/me`,
        {
          credentials: "include",
        },
      );

      if (response.ok) {
        const data: Subscription[] = await response.json();
        setSubscriptions(data);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Gagal memuat langganan Anda.");
        if (response.status === 401 || response.status === 403) {
          logout();
        }
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setMessage("Terjadi masalah koneksi saat memuat langganan.");
    } finally {
      setLoadingSubscriptions(false);
    }
  }, [logout]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect_from=/dashboard");
    } else if (isAuthenticated) {
      fetchUserSubscriptions();
    }
  }, [isAuthenticated, isLoading, router, fetchUserSubscriptions]);

  const handlePauseSubscription = async () => {
    if (!selectedSubscriptionToPause || !pauseStartDate || !pauseEndDate) {
      setPauseMessage("Tanggal mulai dan akhir jeda diperlukan.");
      return;
    }

    setPauseLoading(true);
    setPauseMessage("");
    try {
      const csrfResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/csrf-token`,
        {
          credentials: "include",
        },
      );
      if (!csrfResponse.ok) throw new Error("Failed to fetch CSRF token");
      const { csrfToken } = await csrfResponse.json();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscriptions/${selectedSubscriptionToPause.id}/pause`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
          },
          credentials: "include",
          body: JSON.stringify({ pauseStartDate, pauseEndDate }),
        },
      );

      if (response.ok) {
        const result = await response.json();
        setPauseMessage(result.message);
        setIsSuccess(true);
        fetchUserSubscriptions();
        setIsPauseDialogOpen(false);
        setPauseStartDate("");
        setPauseEndDate("");
      } else {
        const errorData = await response.json();
        setPauseMessage(errorData.message || "Gagal menjeda langganan.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error pausing subscription:", error);
      setPauseMessage("Terjadi masalah koneksi.");
      setIsSuccess(false);
    } finally {
      setPauseLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!selectedSubscriptionToCancel) {
      setCancelMessage("Langganan tidak ditemukan.");
      return;
    }

    setCancelLoading(true);
    setCancelMessage("");
    try {
      const csrfResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/csrf-token`,
        {
          credentials: "include",
        },
      );
      if (!csrfResponse.ok) throw new Error("Failed to fetch CSRF token");
      const { csrfToken } = await csrfResponse.json();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscriptions/${selectedSubscriptionToCancel.id}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
          },
          credentials: "include",
        },
      );

      if (response.ok) {
        const result = await response.json();
        setCancelMessage(result.message || "Langganan berhasil dibatalkan!");
        setIsSuccess(true);
        fetchUserSubscriptions();
        setIsCancelDialogOpen(false);
      } else {
        const errorData = await response.json();
        setCancelMessage(errorData.message || "Gagal membatalkan langganan.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      setCancelMessage("Terjadi masalah koneksi.");
      setIsSuccess(false);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleResumeSubscription = async () => {
    if (!selectedSubscriptionToResume) {
      setResumeMessage("Langganan tidak ditemukan.");
      return;
    }

    setResumeLoading(true);
    setResumeMessage("");
    try {
      const csrfResponse = await fetch(`/api/csrf-token`, {
        credentials: "include",
      });
      if (!csrfResponse.ok) throw new Error("Failed to fetch CSRF token");
      const { csrfToken } = await csrfResponse.json();

      const response = await fetch(
        `/api/subscriptions/${selectedSubscriptionToResume.id}/resume`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
          },
          credentials: "include",
        },
      );

      if (response.ok) {
        const result = await response.json();
        setResumeMessage(result.message);
        setIsSuccess(true);
        fetchUserSubscriptions();
        setIsResumeConfirmationDialogOpen(false);
      } else {
        const errorData = await response.json();
        setResumeMessage(errorData.message || "Gagal melanjutkan langganan.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error resuming subscription:", error);
      setResumeMessage("Terjasi masalah koneksi.");
      setIsSuccess(false);
    } finally {
      setResumeLoading(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-center text-lg text-gray-700">
        <p>Memuat atau mengarahkan ke halaman login...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 py-12">
      <h1 className="text-5xl font-extrabold text-center text-emerald-800 mb-12">
        Dashboard Pengguna
      </h1>

      {message && (
        <div
          className={cn(
            "p-4 rounded-md mb-6 text-center",
            isSuccess
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200",
          )}
        >
          {message}
        </div>
      )}

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-emerald-700 mb-6">
          Langganan Aktif Saya
        </h2>
        {loadingSubscriptions ? (
          <p className="text-center text-gray-600">Memuat langganan...</p>
        ) : subscriptions.length === 0 ? (
          <p className="text-center text-gray-600">
            Anda belum memiliki langganan aktif.{" "}
            <Link
              href="/subscription"
              className="text-emerald-600 hover:underline"
            >
              Mulai berlangganan sekarang!
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((sub) => (
              <Card key={sub.id} className="flex flex-col shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-emerald-800">
                    {sub.plan.name}
                  </CardTitle>
                  <CardDescription
                    className={`text-sm font-semibold ${sub.status === "active" ? "text-green-600" : sub.status === "paused" ? "text-yellow-600" : "text-red-600"}`}
                  >
                    Status:{" "}
                    {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-2 text-gray-700">
                  <p>
                    <strong>Harga Total:</strong> Rp
                    {sub.totalPrice.toLocaleString("id-ID")}
                  </p>
                  <p>
                    <strong>Jenis Makanan:</strong> {sub.mealTypes.join(", ")}
                  </p>
                  <p>
                    <strong>Hari Pengiriman:</strong>{" "}
                    {sub.deliveryDays.join(", ")}
                  </p>
                  {sub.allergies && (
                    <p>
                      <strong>Alergi:</strong> {sub.allergies}
                    </p>
                  )}
                  {sub.status === "paused" &&
                    sub.pauseStartDate &&
                    sub.pauseEndDate && (
                      <p className="text-yellow-700">
                        Dijeda dari{" "}
                        {format(new Date(sub.pauseStartDate), "dd/MM/yyyy")}{" "}
                        sampai{" "}
                        {format(new Date(sub.pauseEndDate), "dd/MM/yyyy")}
                      </p>
                    )}
                  <p className="text-sm text-gray-500">
                    Dimulai: {format(new Date(sub.createdAt), "dd/MM/yyyy")}
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4">
                  {sub.status === "active" && (
                    <>
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                        onClick={() => {
                          setSelectedSubscriptionToPause(sub);
                          setIsPauseDialogOpen(true);
                        }}
                      >
                        Jeda Langganan
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full sm:w-auto"
                        onClick={() => {
                          setSelectedSubscriptionToCancel(sub);
                          setIsCancelDialogOpen(true);
                        }}
                      >
                        Batalkan Langganan
                      </Button>
                    </>
                  )}
                  {sub.status === "paused" && (
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => {
                        setSelectedSubscriptionToResume(sub);
                        setIsResumeConfirmationDialogOpen(true);
                      }}
                    >
                      Lanjutkan Langganan
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Dialog open={isPauseDialogOpen} onOpenChange={setIsPauseDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Jeda Langganan</DialogTitle>
            <DialogDescription>
              Pilih tanggal mulai dan akhir untuk menjeda langganan &quot;
              {selectedSubscriptionToPause?.plan.name}&quot;.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pauseStartDate" className="text-right">
                Dari
              </Label>
              <Input
                id="pauseStartDate"
                type="date"
                value={pauseStartDate}
                onChange={(e) => setPauseStartDate(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pauseEndDate" className="text-right">
                Sampai
              </Label>
              <Input
                id="pauseEndDate"
                type="date"
                value={pauseEndDate}
                onChange={(e) => setPauseEndDate(e.target.value)}
                className="col-span-3"
              />
            </div>
            {pauseMessage && (
              <p
                className={cn(
                  "text-center text-sm",
                  isSuccess ? "text-green-600" : "text-red-600",
                )}
              >
                {pauseMessage}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPauseDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              onClick={handlePauseSubscription}
              disabled={pauseLoading || !pauseStartDate || !pauseEndDate}
            >
              {pauseLoading ? "Memproses..." : "Jeda Sekarang"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Batalkan Langganan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin membatalkan langganan &quot;
              {selectedSubscriptionToCancel?.plan.name}&quot;? Tindakan ini
              tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          {cancelMessage && (
            <p
              className={cn(
                "text-center text-sm",
                isSuccess ? "text-green-600" : "text-red-600",
              )}
            >
              {cancelMessage}
            </p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
            >
              Tidak
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={cancelLoading}
            >
              {cancelLoading ? "Membatalkan..." : "Ya, Batalkan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isResumeConfirmationDialogOpen}
        onOpenChange={setIsResumeConfirmationDialogOpen}
      >
        <DialogContent className="sm-max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Lanjutkan Langganan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin melanjutkan langganan &quot;
              {selectedSubscriptionToResume?.plan.name}&quot;? Status akan
              diubah kembali menjadi aktif.
            </DialogDescription>
          </DialogHeader>
          {resumeMessage && (
            <p
              className={cn(
                "text-center text-sm",
                isSuccess ? "text-green-600" : "text-red-600",
              )}
            >
              {resumeMessage}
            </p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResumeConfirmationDialogOpen(false)}
            >
              Tidak
            </Button>
            <Button
              onClick={handleResumeSubscription}
              disabled={resumeLoading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {resumeLoading ? "Melanjutkan..." : "Ya, Lanjutkan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
