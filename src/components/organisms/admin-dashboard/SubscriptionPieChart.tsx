import React from "react";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { Card } from "@/src/components/atoms/ui/card";

interface ChartData {
  name: string;
  value: number;
  fill: string;
}

interface SubscriptionPieChartProps {
  data: ChartData[];
  title: string;
}

export function SubscriptionPieChart({
  data,
  title,
}: SubscriptionPieChartProps) {
  return (
    <Card className="shadow-lg p-6">
      <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`pie-cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
