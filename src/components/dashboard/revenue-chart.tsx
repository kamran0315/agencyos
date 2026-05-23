"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", revenue: 6400, projects: 3 },
  { month: "Feb", revenue: 9100, projects: 4 },
  { month: "Mar", revenue: 7800, projects: 4 },
  { month: "Apr", revenue: 12400, projects: 5 },
  { month: "May", revenue: 14800, projects: 6 },
  { month: "Jun", revenue: 18200, projects: 7 },
];

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="month"
          stroke="var(--muted-foreground)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="var(--muted-foreground)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: "var(--muted-foreground)" }}
          formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#rev)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
