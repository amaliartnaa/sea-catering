import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { Card } from "@/src/components/atoms/ui/card";

interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

interface SubscriptionBarChartProps {
  data: ChartData[];
  title: string;
}

export function SubscriptionBarChart({
  data,
  title,
}: SubscriptionBarChartProps) {
  return (
    <Card className="shadow-lg p-6">
      <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" name="Jumlah" fill="rgba(75, 192, 192, 0.8)">
            {data.map((entry, index) => (
              <Cell
                key={`bar-cell-${index}`}
                fill={entry.fill || "rgba(75, 192, 192, 0.8)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
