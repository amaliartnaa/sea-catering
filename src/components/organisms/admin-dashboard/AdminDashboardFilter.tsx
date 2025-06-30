import React from "react";
import { Button } from "@/src/components/atoms/ui/button";
import { DateInputWithIcon } from "../../molecules/dashboard/DateInputWithIcon";

interface AdminDashboardFilterProps {
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  onApplyFilter: () => void;
  loading: boolean;
}

export function AdminDashboardFilter({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onApplyFilter,
  loading,
}: AdminDashboardFilterProps) {
  return (
    <section className="mb-12 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-emerald-700 mb-6">Filter Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <DateInputWithIcon
          id="startDate"
          label="Tanggal Mulai"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          disabled={loading}
        />
        <DateInputWithIcon
          id="endDate"
          label="Tanggal Akhir"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          disabled={loading}
        />
        <Button
          onClick={onApplyFilter}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 col-span-1 md:col-span-1 cursor-pointer"
        >
          {loading ? "Memuat..." : "Terapkan filter"}
        </Button>
      </div>
    </section>
  );
}
