"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import Link from "next/link";
import { Subscription } from "@/src/types/subscription";

import { SubmissionMessage } from "@/src/components/molecules/common/SubmissionMessage";
import SubscriptionCard from "@/src/components/molecules/content/SubscriptionCard";
import PauseSubscriptionDialog from "@/src/components/organisms/user-dashboard/PauseSubscriptionDialog";
import CancelSubscriptionDialog from "@/src/components/organisms/user-dashboard/CancelSubscriptionDialog";
import ResumeSubscriptionDialog from "@/src/components/organisms/user-dashboard/ResumeSubscriptionDialog";
import SubscriptionControls from "@/src/components/organisms/user-dashboard/SubscriptionControls";

export default function UserDashboardPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
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

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedSubscriptionToCancel, setSelectedSubscriptionToCancel] =
    useState<Subscription | null>(null);

  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false);
  const [selectedSubscriptionToResume, setSelectedSubscriptionToResume] =
    useState<Subscription | null>(null);

  const fetchCsrfToken = useCallback(async () => {
    try {
      const csrfResponse = await fetch(`/api/csrf-token`, {
        credentials: "include",
      });
      if (!csrfResponse.ok) {
        throw new Error("Failed to fetch CSRF token: " + csrfResponse.status);
      }
      const { csrfToken } = await csrfResponse.json();
      if (!csrfToken) {
        throw new Error("CSRF token not found in response.");
      }
      return csrfToken;
    } catch (error) {
      console.error("[Frontend] Error fetching CSRF token:", error);
      setDashboardMessage("Gagal mendapatkan token keamanan. Mohon coba lagi.");
      setIsDashboardSuccess(false);
      return null;
    }
  }, []);

  const fetchUserSubscriptions = useCallback(async () => {
    setLoadingSubscriptions(true);
    setDashboardMessage("");
    try {
      const queryParams = new URLSearchParams();
      if (filterStatus !== "all") {
        queryParams.append("status", filterStatus);
      }
      if (filterPlanName !== "all") {
        queryParams.append("planName", filterPlanName);
      }
      const [sortByField, sortByOrder] = sortOrder.split("_");
      queryParams.append("sortBy", sortByField);
      queryParams.append("sortOrder", sortByOrder);

      const response = await fetch(
        `/api/subscriptions/me?${queryParams.toString()}`,
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
      console.error("[Frontend] Network or unexpected error:", error);
      setDashboardMessage("Terjadi masalah koneksi saat memuat langganan.");
      setIsDashboardSuccess(false);
    } finally {
      setLoadingSubscriptions(false);
    }
  }, [logout, filterStatus, sortOrder, filterPlanName]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect_from=/dashboard");
    } else if (isAuthenticated) {
      fetchUserSubscriptions();
    }
  }, [isAuthenticated, isLoading, router, fetchUserSubscriptions]);

  const filteredAndSortedSubscriptions = useMemo(() => {
    return subscriptions;
  }, [subscriptions]);

  const handlePauseSubscription = useCallback(
    async (
      subId: string,
      startDate: string,
      endDate: string,
    ): Promise<boolean> => {
      try {
        const csrfToken = await fetchCsrfToken();
        if (!csrfToken) return false;

        const response = await fetch(`/api/subscriptions/${subId}/pause`, {
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
        });

        if (response.ok) {
          setDashboardMessage("Langganan berhasil dijeda!");
          setIsDashboardSuccess(true);
          await fetchUserSubscriptions();
          return true;
        } else {
          const errorData = await response.json();
          setDashboardMessage(errorData.message || "Gagal menjeda langganan.");
          setIsDashboardSuccess(false);
          if (response.status === 401 || response.status === 403) logout();
          return false;
        }
      } catch (error) {
        console.error("Error pausing subscription:", error);
        setDashboardMessage("Terjadi masalah koneksi saat menjeda langganan.");
        setIsDashboardSuccess(false);
        return false;
      }
    },
    [fetchCsrfToken, fetchUserSubscriptions, logout],
  );

  const handleCancelSubscription = useCallback(
    async (subId: string): Promise<boolean> => {
      try {
        const csrfToken = await fetchCsrfToken();
        if (!csrfToken) return false;

        const response = await fetch(`/api/subscriptions/${subId}/cancel`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
          },
          credentials: "include",
        });

        if (response.ok) {
          setDashboardMessage("Langganan berhasil dibatalkan!");
          setIsDashboardSuccess(true);
          await fetchUserSubscriptions();
          return true;
        } else {
          const errorData = await response.json();
          setDashboardMessage(
            errorData.message || "Gagal membatalkan langganan.",
          );
          setIsDashboardSuccess(false);
          if (response.status === 401 || response.status === 403) logout();
          return false;
        }
      } catch (error) {
        console.error("Error cancelling subscription:", error);
        setDashboardMessage(
          "Terjadi masalah koneksi saat membatalkan langganan.",
        );
        setIsDashboardSuccess(false);
        return false;
      }
    },
    [fetchCsrfToken, fetchUserSubscriptions, logout],
  );

  const handleResumeSubscription = useCallback(
    async (subId: string): Promise<boolean> => {
      try {
        const csrfToken = await fetchCsrfToken();
        if (!csrfToken) return false;

        const response = await fetch(`/api/subscriptions/${subId}/resume`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
          },
          credentials: "include",
        });

        if (response.ok) {
          setDashboardMessage("Langganan berhasil dilanjutkan!");
          setIsDashboardSuccess(true);
          await fetchUserSubscriptions();
          return true;
        } else {
          const errorData = await response.json();
          setDashboardMessage(
            errorData.message || "Gagal melanjutkan langganan.",
          );
          setIsDashboardSuccess(false);
          if (response.status === 401 || response.status === 403) logout();
          return false;
        }
      } catch (error) {
        console.error("Error resuming subscription:", error);
        setDashboardMessage(
          "Terjadi masalah koneksi saat melanjutkan langganan.",
        );
        setIsDashboardSuccess(false);
        return false;
      }
    },
    [fetchCsrfToken, fetchUserSubscriptions, logout],
  );

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-center text-lg text-gray-700">
        <p>Memuat atau mengarahkan ke halaman login...</p>
      </div>
    );
  }

  const dashboardTitle = user?.fullName
    ? `Halo, ${user.fullName}!`
    : "Dashboard Pengguna";
  let welcomeMessage = "Selamat datang di dashboard Anda.";
  if (!loadingSubscriptions) {
    if (subscriptions.length > 0) {
      const activeSubs = subscriptions.filter(
        (s) => s.status === "active",
      ).length;
      const pausedSubs = subscriptions.filter(
        (s) => s.status === "paused",
      ).length;
      const cancelledSubs = subscriptions.filter(
        (s) => s.status === "cancelled",
      ).length;

      if (activeSubs > 0) {
        welcomeMessage = `Anda memiliki ${activeSubs} langganan aktif.`;
        if (pausedSubs > 0) {
          welcomeMessage += ` (${pausedSubs} dijeda).`;
        }
        if (cancelledSubs > 0) {
          welcomeMessage += ` (${cancelledSubs} dibatalkan).`;
        }
      } else if (pausedSubs > 0) {
        welcomeMessage = `Anda memiliki ${pausedSubs} langganan dijeda.`;
        if (cancelledSubs > 0) {
          welcomeMessage += ` (${cancelledSubs} dibatalkan).`;
        }
      } else {
        welcomeMessage = `Anda memiliki ${cancelledSubs} langganan dibatalkan.`;
      }
    } else {
      welcomeMessage =
        "Anda belum memiliki langganan. Mulai hidup sehat bersama kami!";
    }
  }

  return (
    <div className="container mx-auto p-8 py-12">
      <h1 className="text-5xl font-extrabold text-center text-emerald-800 mb-12">
        {dashboardTitle}
      </h1>
      <p className="text-xl text-center text-gray-600 mb-8">{welcomeMessage}</p>

      <SubmissionMessage
        message={dashboardMessage}
        isSuccess={isDashboardSuccess}
      />

      <section className="mb-12">
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
              ? `Tidak ada langganan dengan kriteria tersebut.`
              : "Anda belum memiliki langganan."}{" "}
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
                }}
                onCancelClick={(s) => {
                  setSelectedSubscriptionToCancel(s);
                  setIsCancelDialogOpen(true);
                }}
                onResumeClick={(s) => {
                  setSelectedSubscriptionToResume(s);
                  setIsResumeDialogOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </section>

      <PauseSubscriptionDialog
        isOpen={isPauseDialogOpen}
        onClose={() => setIsPauseDialogOpen(false)}
        subscription={selectedSubscriptionToPause}
        onConfirm={handlePauseSubscription}
      />

      <CancelSubscriptionDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        subscription={selectedSubscriptionToCancel}
        onConfirm={handleCancelSubscription}
      />

      <ResumeSubscriptionDialog
        isOpen={isResumeDialogOpen}
        onClose={() => setIsResumeDialogOpen(false)}
        subscription={selectedSubscriptionToResume}
        onConfirm={handleResumeSubscription}
      />
    </div>
  );
}
