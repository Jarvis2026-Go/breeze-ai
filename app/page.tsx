"use client";

import { KPICard } from "@/components/kpi-card";
import { InsightPanel } from "@/components/insight-panel";
import { ChartCard } from "@/components/chart-card";
import { yearlyData, insights } from "@/lib/data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/formatting";

const kpis = [
  {
    label: "Revenue (2025)",
    value: "$319.2K",
    change: "-9.5% YoY",
    changeType: "negative" as const,
    icon: "dollar",
  },
  {
    label: "Net Income (2025)",
    value: "-$7.4K",
    change: "From +$7.6K in 2024",
    changeType: "negative" as const,
    icon: "trending-down",
  },
  {
    label: "Gross Margin",
    value: "76.8%",
    change: "+4.0pp vs 2024",
    changeType: "positive" as const,
    icon: "percent",
  },
  {
    label: "Revenue Growth",
    value: "-9.5%",
    change: "Was +3.1% in 2024",
    changeType: "negative" as const,
    icon: "bar",
  },
  {
    label: "Payroll Ratio",
    value: "48.6%",
    change: "+6.6pp vs 2024",
    changeType: "negative" as const,
    icon: "users",
  },
  {
    label: "Total Assets",
    value: "$44.2K",
    change: "-31.9% YoY",
    changeType: "negative" as const,
    icon: "building",
  },
];

const chartData = yearlyData.map((d) => ({
  year: d.year.toString(),
  Revenue: d.foodSales,
  Expenses: d.totalExpenses,
  "Net Income": d.netIncome,
}));

export default function OverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          CHOG Financial Analysis
        </h1>
        <p className="text-slate-500 mt-1">
          3-year financial overview (2023–2025)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Revenue vs Expenses"
          subtitle="3-year trend comparison"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2EC4B6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2EC4B6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,.1)",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="Revenue"
                stroke="#2EC4B6"
                fill="url(#colorRevenue)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="Expenses"
                stroke="#FF6B6B"
                fill="url(#colorExpenses)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <InsightPanel insights={insights} />
      </div>
    </div>
  );
}
