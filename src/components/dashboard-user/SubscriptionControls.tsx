"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Label } from "@/src/components/ui/label";

interface SubscriptionControlsProps {
  currentFilter: string;
  onFilterChange: (value: string) => void;
  currentSort: string;
  onSortChange: (value: string) => void;
  currentPlanNameFilter: string;
  onPlanNameFilterChange: (value: string) => void;
}

export default function SubscriptionControls({
  currentFilter,
  onFilterChange,
  currentSort,
  onSortChange,
}: SubscriptionControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-end">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Label htmlFor="filter-status" className="whitespace-nowrap">
          Filter Status:
        </Label>
        <Select value={currentFilter} onValueChange={onFilterChange}>
          <SelectTrigger id="filter-status" className="w-full sm:w-[180px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="paused">Dijeda</SelectItem>
            <SelectItem value="cancelled">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Label htmlFor="sort-by" className="whitespace-nowrap">
          Urutkan Berdasarkan:
        </Label>
        <Select value={currentSort} onValueChange={onSortChange}>
          <SelectTrigger id="sort-by" className="w-full sm:w-[180px]">
            <SelectValue placeholder="Tanggal Terbaru" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt_desc">Tanggal Terbaru</SelectItem>
            <SelectItem value="createdAt_asc">Tanggal Terlama</SelectItem>
            <SelectItem value="totalPrice_asc">Harga (Termurah)</SelectItem>
            <SelectItem value="totalPrice_desc">Harga (Termahal)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
