import React from "react";
import { MetricCard } from "@/src/components/molecules/dashboard/MetricCard";

interface AdminMetrics {
  newSubscriptions: number;
  monthlyRecurringRevenue: number;
  reactivations: number;
  totalActiveSubscriptions: number;
}

interface AdminMetricsOverviewProps {
  metrics: AdminMetrics | null;
}

export function AdminMetricsOverview({ metrics }: AdminMetricsOverviewProps) {
  if (!metrics) return null;

  return (
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
  );
}
