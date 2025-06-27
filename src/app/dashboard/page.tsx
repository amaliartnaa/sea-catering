"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import Link from "next/link";
import { cn } from "@/src/lib/utils";

import { Subscription } from "@/src/types/subscription";

import SubscriptionCard from "@/src/components/dashboard-user/SubscriptionCard";
import PauseSubscriptionDialog from "@/src/components/dashboard-user/PauseSubscriptionDialog";
import CancelSubscriptionDialog from "@/src/components/dashboard-user/CancelSubscriptionDialog";
import ResumeSubscriptionDialog from "@/src/components/dashboard-user/ResumeSubscriptionDialog";
import SubscriptionControls from "@/src/components/dashboard-user/SubscriptionControls";

export default function UserDashboardPage() {
  const { isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true);
  const [dashboardMessage, setDashboardMessage] = useState("");
  const [isDashboardSuccess, setIsDashboardSuccess] = useState(false);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPlanName, setFilterPlanName] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("createdAt_desc");

  const [isPauseDialogOpen, setIsPauseDialogOpen] = useState(false);
  const [selectedSubscriptionToPause, setSelectedSubscriptionToPause] =
    useState<Subscription | null>(null);
  const [pauseStartDate, setPauseStartDate] = useState("");
  const [pauseEndDate, setPauseEndDate] = useState("");
  const [pauseLoading, setPauseLoading] = useState(false);
  const [pauseMessage, setPauseMessage] = useState("");
  const [isPauseConfirmationDialogOpen, setIsPauseConfirmationDialogOpen] =
    useState(false);
  const [confirmPauseMessage, setConfirmPauseMessage] = useState("");

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
    setDashboardMessage("");
    try {
      const queryParams = new URLSearchParams();
      if (filterStatus !== "all") {
        queryParams.append("status", filterStatus);
      }

      const [sortByField, sortByOrder] = sortOrder.split("_");
      queryParams.append("sortBy", sortByField);
      queryParams.append("sortOrder", sortByOrder);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscriptions/me?${queryParams.toString()}`,
        {
          credentials: "include",
        },
      );

      if (response.ok) {
        const data: Subscription[] = await response.json();
        setSubscriptions(data);
        setDashboardMessage("");
      } else {
        const errorData = await response.json();
        setDashboardMessage(
          errorData.message || "Gagal memuat langganan Anda.",
        );
        setIsDashboardSuccess(false);
        if (response.status === 401 || response.status === 403) {
          logout();
        }
      }
    } catch (error) {
      console.error("[Frontend] Network or unexpected error:", error); // Catat error jaringan
      setDashboardMessage("Terjadi masalah koneksi saat memuat langganan.");
      setIsDashboardSuccess(false);
    } finally {
      setLoadingSubscriptions(false);
    }
  }, [logout, filterStatus, sortOrder]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect_from=/dashboard");
    } else if (isAuthenticated) {
      fetchUserSubscriptions();
    }
  }, [isAuthenticated, sortOrder, isLoading, router, fetchUserSubscriptions]);

  const filteredAndSortedSubscriptions = useMemo(() => {
    return subscriptions;
  }, [subscriptions]);

  const handleConfirmPause = useCallback(
    async (sub: Subscription, startDate: string, endDate: string) => {
      setPauseLoading(true);
      setConfirmPauseMessage("");
      try {
        const csrfResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/csrf-token`,
          { credentials: "include" },
        );
        if (!csrfResponse.ok) throw new Error("Failed to fetch CSRF token");
        const { csrfToken } = await csrfResponse.json();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscriptions/${sub.id}/pause`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "CSRF-Token": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({
              pauseStartDate: startDate,
              pauseEndDate: endDate,
            }),
          },
        );

        if (response.ok) {
          const result = await response.json();
          setConfirmPauseMessage(
            result.message || "Langganan berhasil dijeda!",
          );
          setIsDashboardSuccess(true);
          await fetchUserSubscriptions();
          setIsPauseConfirmationDialogOpen(false);
          setIsPauseDialogOpen(false);
          setPauseStartDate("");
          setPauseEndDate("");
        } else {
          const errorData = await response.json();
          setConfirmPauseMessage(
            errorData.message || "Gagal menjeda langganan.",
          );
          setIsDashboardSuccess(false);
        }
      } catch (error) {
        console.error("Error pausing subscription:", error);
        setConfirmPauseMessage("Terjadi masalah koneksi.");
        setIsDashboardSuccess(false);
      } finally {
        setPauseLoading(false);
      }
    },
    [
      fetchUserSubscriptions,
      setPauseLoading,
      setConfirmPauseMessage,
      setIsDashboardSuccess,
      setIsPauseConfirmationDialogOpen,
      setIsPauseDialogOpen,
      setPauseStartDate,
      setPauseEndDate,
    ],
  );

  const handleConfirmCancel = useCallback(
    async (sub: Subscription) => {
      setCancelLoading(true);
      setCancelMessage("");
      try {
        const csrfResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/csrf-token`,
          { credentials: "include" },
        );
        if (!csrfResponse.ok) throw new Error("Failed to fetch CSRF token");
        const { csrfToken } = await csrfResponse.json();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscriptions/${sub.id}/cancel`,
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
          setIsDashboardSuccess(true);
          await fetchUserSubscriptions();
          setIsCancelDialogOpen(false);
        } else {
          const errorData = await response.json();
          setCancelMessage(errorData.message || "Gagal membatalkan langganan.");
          setIsDashboardSuccess(false);
        }
      } catch (error) {
        console.error("Error cancelling subscription:", error);
        setCancelMessage("Terjadi masalah koneksi.");
        setIsDashboardSuccess(false);
      } finally {
        setCancelLoading(false);
      }
    },
    [
      fetchUserSubscriptions,
      setCancelLoading,
      setCancelMessage,
      setIsDashboardSuccess,
      setIsCancelDialogOpen,
    ],
  );

  const handleConfirmResume = useCallback(
    async (sub: Subscription) => {
      setResumeLoading(true);
      setResumeMessage("");
      try {
        const csrfResponse = await fetch(`/api/csrf-token`, {
          credentials: "include",
        });
        if (!csrfResponse.ok) throw new Error("Failed to fetch CSRF token");
        const { csrfToken } = await csrfResponse.json();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscriptions/${sub.id}/resume`,
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
          setResumeMessage(result.message || "Langganan berhasil dilanjutkan!");
          setIsDashboardSuccess(true);
          await fetchUserSubscriptions();
          setIsResumeConfirmationDialogOpen(false);
        } else {
          const errorData = await response.json();
          setResumeMessage(errorData.message || "Gagal melanjutkan langganan.");
          setIsDashboardSuccess(false);
        }
      } catch (error) {
        console.error("Error resuming subscription:", error);
        setResumeMessage("Terjadi masalah koneksi.");
        setIsDashboardSuccess(false);
      } finally {
        setResumeLoading(false);
      }
    },
    [
      fetchUserSubscriptions,
      setResumeLoading,
      setResumeMessage,
      setIsDashboardSuccess,
      setIsResumeConfirmationDialogOpen,
    ],
  );

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

      {dashboardMessage && (
        <div
          className={cn(
            "p-4 rounded-md mb-6 text-center",
            isDashboardSuccess
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200",
          )}
        >
          {dashboardMessage}
        </div>
      )}

      <section className="mb-12">
        <h2 className="sm:text-left text-center text-3xl font-bold text-emerald-700 mb-6">
          Langganan Aktif Saya
        </h2>

        <SubscriptionControls
          currentFilter={filterStatus}
          onFilterChange={setFilterStatus}
          currentSort={sortOrder}
          onSortChange={setSortOrder}
          currentPlanNameFilter={filterPlanName}
          onPlanNameFilterChange={setFilterPlanName}
        />

        {loadingSubscriptions ? (
          <p className="text-center text-gray-600">Memuat langganan...</p>
        ) : filteredAndSortedSubscriptions.length === 0 ? (
          <p className="text-center text-gray-600">
            {filterStatus !== "all" || filterPlanName !== "all"
              ? `Tidak ada langganan dengan status "${filterStatus}".`
              : "Anda belum memiliki langganan aktif."}{" "}
            <Link
              href="/subscription"
              className="text-emerald-600 hover:underline"
            >
              Mulai berlangganan sekarang!
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedSubscriptions.map((sub) => (
              <SubscriptionCard
                key={sub.id}
                subscription={sub}
                onPauseClick={(s) => {
                  setSelectedSubscriptionToPause(s);
                  setIsPauseDialogOpen(true);
                  setPauseMessage("");
                }}
                onCancelClick={(s) => {
                  setSelectedSubscriptionToCancel(s);
                  setIsCancelDialogOpen(true);
                  setCancelMessage("");
                }}
                onResumeClick={(s) => {
                  setSelectedSubscriptionToResume(s);
                  setIsResumeConfirmationDialogOpen(true);
                  setResumeMessage("");
                }}
              />
            ))}
          </div>
        )}
      </section>

      <PauseSubscriptionDialog
        isPauseDialogOpen={isPauseDialogOpen}
        setIsPauseDialogOpen={setIsPauseDialogOpen}
        selectedSubscriptionToPause={selectedSubscriptionToPause}
        pauseStartDate={pauseStartDate}
        setPauseStartDate={setPauseStartDate}
        pauseEndDate={pauseEndDate}
        setPauseEndDate={setPauseEndDate}
        pauseLoading={pauseLoading}
        pauseMessage={pauseMessage}
        setPauseMessage={setPauseMessage}
        isPauseConfirmationDialogOpen={isPauseConfirmationDialogOpen}
        setIsPauseConfirmationDialogOpen={setIsPauseConfirmationDialogOpen}
        confirmPauseMessage={confirmPauseMessage}
        setConfirmPauseMessage={setConfirmPauseMessage}
        onConfirmPause={handleConfirmPause}
        apiSuccessStatus={isDashboardSuccess}
      />

      <CancelSubscriptionDialog
        isCancelDialogOpen={isCancelDialogOpen}
        setIsCancelDialogOpen={setIsCancelDialogOpen}
        selectedSubscriptionToCancel={selectedSubscriptionToCancel}
        cancelLoading={cancelLoading}
        setCancelLoading={setCancelLoading}
        cancelMessage={cancelMessage}
        setCancelMessage={setCancelMessage}
        onConfirmCancel={handleConfirmCancel}
        apiSuccessStatus={isDashboardSuccess}
      />

      <ResumeSubscriptionDialog
        isResumeConfirmationDialogOpen={isResumeConfirmationDialogOpen}
        setIsResumeConfirmationDialogOpen={setIsResumeConfirmationDialogOpen}
        selectedSubscriptionToResume={selectedSubscriptionToResume}
        resumeLoading={resumeLoading}
        setResumeLoading={setResumeLoading}
        resumeMessage={resumeMessage}
        setResumeMessage={setResumeMessage}
        onConfirmResume={handleConfirmResume}
        apiSuccessStatus={isDashboardSuccess}
      />
    </div>
  );
}
