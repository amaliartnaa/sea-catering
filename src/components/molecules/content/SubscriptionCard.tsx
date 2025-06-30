"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/atoms/ui/card";
import { Button } from "@/src/components/atoms/ui/button";
import { format } from "date-fns";
import { Subscription } from "@/src/types/subscription";

interface SubscriptionCardProps {
  subscription: Subscription;
  onPauseClick: (sub: Subscription) => void;
  onCancelClick: (sub: Subscription) => void;
  onResumeClick: (sub: Subscription) => void;
}

export default function SubscriptionCard({
  subscription: sub,
  onPauseClick,
  onCancelClick,
  onResumeClick,
}: SubscriptionCardProps) {
  return (
    <Card key={sub.id} className="flex flex-col shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-emerald-800">
          {sub.plan.name}
        </CardTitle>
        <CardDescription
          className={`text-sm font-semibold ${sub.status === "active" ? "text-green-600" : sub.status === "paused" ? "text-yellow-600" : "text-red-600"}`}
        >
          Status: {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
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
          <strong>Hari Pengiriman:</strong> {sub.deliveryDays.join(", ")}
        </p>
        {sub.allergies && (
          <p>
            <strong>Alergi:</strong> {sub.allergies}
          </p>
        )}
        {sub.status === "paused" && sub.pauseStartDate && sub.pauseEndDate && (
          <p className="text-yellow-700">
            Dijeda dari {format(new Date(sub.pauseStartDate), "dd/MM/yyyy")}{" "}
            sampai {format(new Date(sub.pauseEndDate), "dd/MM/yyyy")}
          </p>
        )}
        <p className="text-sm text-gray-500">
          Dimulai: {format(new Date(sub.createdAt), "dd/MM/yyyy")}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-4 pt-4">
        {sub.status === "active" && (
          <>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-yellow-500 text-yellow-700 hover:bg-yellow-50 cursor-pointer"
              onClick={() => onPauseClick(sub)}
            >
              Jeda Langganan
            </Button>
            <Button
              variant="destructive"
              className="w-full sm:w-auto cursor-pointer"
              onClick={() => onCancelClick(sub)}
            >
              Batalkan Langganan
            </Button>
          </>
        )}
        {sub.status === "paused" && (
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
            onClick={() => onResumeClick(sub)}
          >
            Lanjutkan Langganan
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
