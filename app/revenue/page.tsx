"use client";

import { ChartCard } from "@/components/chart-card";
import { yearlyData, cogsBreakdown } from "@/lib/data";
import { formatCurrency, formatPercent } from "@/lib/formatting";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  ComposedChart,
  Area,
} from "recharts";

const revenueData = yearlyData.map((d, i) => ({
  year: d.year.toString(),
  Revenue: d.foodSales,
  "YoY Growth": i === 0
    ? 0
    : +((d.foodSales - yearlyData[i - 1].foodSales) / yearlyData[i - 1].foodSales * 100).toFixed(1),
}));

const cogsData = cogsBreakdown.map((d) => ({
  year: d.year.toString(),
  Alcohol: d.alcohol,
  "Food Purchases": d.foodPurchases,
  "Restaurant Supplies": d.restaurantSupplies,
}));

const cogsPercentData = yearlyData.map((d) => ({
  year: d.year.toString(),
  "COGS % of Revenue": +((d.totalCOGS / d.foodSales) * 100).toFixed(1),
}));

const grossProfitData = yearlyData.map((d) => ({
  year: d.year.toString(),
  "Gross Profit": d.grossProfit,
  "Gross Margin %": +((d.grossProfit / d.foodSales) * 100).toFixed(1),
}));

export default function RevenuePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Revenue & COGS</h1>
        <p className="text-slate-500 mt-1">Revenue trends and cost of goods sold analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Trend" subtitle="With year-over-year growth rate">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
              <YAxis
                yAxisId="left"
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                formatter={(value: number, name: string) =>
                  name === "YoY Growth" ? `${value}%` : formatCurrency(value)
                }
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="Revenue" fill="#2EC4B6" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="YoY Growth" stroke="#6366F1" strokeWidth={2} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="COGS Breakdown" subtitle="By category across 3 years">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cogsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <Legend />
              <Bar dataKey="Alcohol" stackId="a" fill="#8B5CF6" />
              <Bar dataKey="Food Purchases" stackId="a" fill="#F59E0B" />
              <Bar dataKey="Restaurant Supplies" stackId="a" fill="#2EC4B6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="COGS as % of Revenue" subtitle="Improving cost efficiency trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cogsPercentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 40]}
              />
              <Tooltip
                formatter={(value: number) => `${value}%`}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <Line
                type="monotone"
                dataKey="COGS % of Revenue"
                stroke="#22C55E"
                strokeWidth={3}
                dot={{ r: 6, fill: "#22C55E" }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <span className="text-slate-500">2023: 34.4%</span>
            <span className="text-slate-400">→</span>
            <span className="text-slate-500">2024: 27.2%</span>
            <span className="text-slate-400">→</span>
            <span className="text-positive font-semibold">2025: 23.2%</span>
          </div>
        </ChartCard>

        <ChartCard title="Gross Profit Trend" subtitle="Gross profit with margin percentage">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={grossProfitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
              <YAxis
                yAxisId="left"
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(v) => `${v}%`}
                domain={[60, 80]}
              />
              <Tooltip
                formatter={(value: number, name: string) =>
                  name.includes("%") ? `${value}%` : formatCurrency(value)
                }
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="Gross Profit"
                fill="#2EC4B6"
                fillOpacity={0.2}
                stroke="#2EC4B6"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="Gross Margin %"
                stroke="#6366F1"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
