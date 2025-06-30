import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/atoms/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  valueColorClass?: string;
}

export function MetricCard({
  title,
  value,
  description,
  valueColorClass = "text-gray-800",
}: MetricCardProps) {
  return (
    <Card className="shadow-lg justify-between">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-emerald-800">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-4xl font-extrabold ${valueColorClass}`}>{value}</p>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}
