"use client";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useAuth } from "@/src/context/AuthContext";
import { cn } from "@/src/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AdminMetrics {
  newSubscriptions: number;
  monthlyRecurringRevenue: number;
  reactivations: number;
  totalActiveSubscriptions: number;
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
    },
    {
      name: "Reaktivasi",
      value: metrics?.reactivations || 0,
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
        (metrics?.newSubscriptions || 0) -
        (metrics?.totalActiveSubscriptions || 0),
      fill: "rgb(255, 99, 132)",
    },
  ];

  return (
    <div className="container mx-auto p-8 py-12">
      <h1 className="text-5xl font-extrabold text-center text-emerald-800 mb-12">
        Admin Dashboard
      </h1>

      {message && (
        <div
          className={cn(
            "p-4 rounded-md mb-6 text-center",
            "bg-red-100 text-red-700 border border-red-200",
          )}
        >
          {message}
        </div>
      )}

      <section className="mb-12 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-emerald-700 mb-6">
          Filter Data
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <Label
              htmlFor="startDate"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Tanggal Mulai:
            </Label>
            <div className="relative w-full">
              <Input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pr-10 appearance-none calendar-icon-none clickable-calendar"
              />
              <FaRegCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
          <div>
            <Label
              htmlFor="endDate"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Tanggal Akhir:
            </Label>
            <div className="relative w-full">
              <Input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pr-10 appearance-none calendar-icon-none clickable-calendar"
              />
              <FaRegCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
          <Button
            onClick={fetchAdminMetrics}
            disabled={loadingMetrics}
            className="bg-emerald-600 hover:bg-emerald-700 col-span-1 md:col-span-1 cursor-pointer"
          >
            {loadingMetrics ? "Memuat..." : "Terapkan filter"}
          </Button>
        </div>
      </section>

      {loadingMetrics ? (
        <p className="text-center text-gray-600">Memuat metrik...</p>
      ) : metrics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <Card className="shadow-lg justify-between">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-emerald-800">
                Langganan Baru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-extrabold text-green-700">
                {metrics.newSubscriptions}
              </p>
              <p className="text-gray-600">selama periode yang dipilih</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg justify-between">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-emerald-800">
                Monthly Recurring Revenue (MRR)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-extrabold text-blue-700">
                Rp{metrics.monthlyRecurringRevenue.toLocaleString("id-ID")}
              </p>
              <p className="text-gray-600">
                dari langganan aktif di periode ini
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg justify-between">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-emerald-800">
                Reaktivasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-extrabold text-purple-700">
                {metrics.reactivations}
              </p>
              <p className="text-gray-600">langganan yang diaktifkan kembali</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg justify-between">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-emerald-800">
                Total Langganan Aktif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-extrabold text-emerald-700">
                {metrics.totalActiveSubscriptions}
              </p>
              <p className="text-gray-600">total langganan aktif saat ini</p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 shadow-lg p-6">
            <h3 className="text-lg font-semibold text-center mb-4">
              Langganan & Reaktivasi per Periode
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={barChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="value"
                  name="Jumlah"
                  fill="rgba(75, 192, 192, 0.8)"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="lg:col-span-2 shadow-lg p-6">
            <h3 className="text-lg font-semibold text-center mb-4">
              Distribusi Langganan (Total Aktif)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      ) : (
        <p className="text-center text-gray-600">
          Tidak ada data metrik yang tersedia.
        </p>
      )}
    </div>
  );
}
