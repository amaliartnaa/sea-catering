"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { format } from "date-fns";
import { SubmissionMessage } from "@/src/components/molecules/common/SubmissionMessage";
import { AdminDashboardFilter } from "@/src/components/organisms/admin-dashboard/AdminDashboardFilter";
import { MetricCard } from "@/src/components/molecules/dashboard/MetricCard";
import { SubscriptionBarChart } from "@/src/components/organisms/admin-dashboard/SubscriptionBarChart";
import { SubscriptionPieChart } from "@/src/components/organisms/admin-dashboard/SubscriptionPieChart";

interface AdminMetrics {
  newSubscriptions: number;
  monthlyRecurringRevenue: number;
  reactivations: number;
  totalActiveSubscriptions: number;
  totalCancelledSubscriptions?: number;
  totalPausedSubscriptions?: number;
}

export default function AdminDashboardPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [message, setMessage] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setEndDate(format(today, "yyyy-MM-dd"));
    setStartDate(format(thirtyDaysAgo, "yyyy-MM-dd"));
  }, []);

  const fetchAdminMetrics = useCallback(async () => {
    if (!isAuthenticated || user?.role !== "admin") {
      setMessage("Anda tidak memiliki izin untuk melihat halaman ini.");
      setLoadingMetrics(false);
      return;
    }

    setLoadingMetrics(true);
    setMessage("");
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);

      const response = await fetch(
        `/api/admin/metrics?${queryParams.toString()}`,
        {
          credentials: "include",
        },
      );

      if (response.ok) {
        const data: AdminMetrics = await response.json();
        setMetrics(data);
        setMessage("");
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Gagal memuat metrik admin.");
        if (response.status === 401 || response.status === 403) {
          logout();
        }
      }
    } catch (error) {
      console.error("Error fetching admin metrics:", error);
      setMessage("Terjadi masalah koneksi saat memuat metrik admin.");
    } finally {
      setLoadingMetrics(false);
    }
  }, [isAuthenticated, user?.role, startDate, endDate, logout]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user?.role === "admin") {
        fetchAdminMetrics();
      } else if (isAuthenticated || user?.role !== "admin") {
        router.push("/login?redirect_from=/admin/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, user, router, fetchAdminMetrics]);

  if (isLoading || !isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-center text-lg text-gray-700">
        <p>Memuat atau mengarahkan...</p>
      </div>
    );
  }

  const barChartData = [
    {
      name: "Langganan Baru",
      value: metrics?.newSubscriptions || 0,
      fill: "rgba(75, 192, 192, 0.8)",
    },
    {
      name: "Reaktivasi",
      value: metrics?.reactivations || 0,
      fill: "rgba(153, 102, 255, 0.8)",
    },
  ];

  const pieChartData = [
    {
      name: "Aktif",
      value: metrics?.totalActiveSubscriptions || 0,
      fill: "rgb(34, 197, 94)",
    },
    {
      name: "Non-Aktif",
      value:
        (metrics?.totalCancelledSubscriptions || 0) +
        (metrics?.totalPausedSubscriptions || 0),
      fill: "rgb(255, 99, 132)",
    },
  ];

  return (
    <div className="container mx-auto p-8 py-12">
      <h1 className="text-5xl font-extrabold text-center text-emerald-800 mb-12">
        Halo, Admin!
      </h1>

      <SubmissionMessage message={message} isSuccess={false} />

      <AdminDashboardFilter
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onApplyFilter={fetchAdminMetrics}
        loading={loadingMetrics}
      />

      {loadingMetrics ? (
        <p className="text-center text-gray-600 mt-8">Memuat metrik...</p>
      ) : metrics ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            <MetricCard
              title="Langganan Baru"
              value={metrics.newSubscriptions}
              description="selama periode yang dipilih"
              valueColorClass="text-green-700"
            />
            <MetricCard
              title="Monthly Recurring Revenue (MRR)"
              value={`Rp${metrics.monthlyRecurringRevenue.toLocaleString("id-ID")}`}
              description="dari langganan aktif di periode ini"
              valueColorClass="text-blue-700"
            />
            <MetricCard
              title="Reaktivasi"
              value={metrics.reactivations}
              description="langganan yang diaktifkan kembali"
              valueColorClass="text-purple-700"
            />
            <MetricCard
              title="Total Langganan Aktif"
              value={metrics.totalActiveSubscriptions}
              description="total langganan aktif saat ini"
              valueColorClass="text-emerald-700"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <SubscriptionBarChart
              data={barChartData}
              title="Langganan & Reaktivasi per Periode"
            />
            <SubscriptionPieChart
              data={pieChartData}
              title="Distribusi Langganan (Total Aktif vs Non-Aktif)"
            />
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-8">
          Tidak ada data metrik yang tersedia.
        </p>
      )}
    </div>
  );
}
