"use client";

import { ChartCard } from "@/components/chart-card";
import { yearlyData } from "@/lib/data";
import { formatCurrency, formatPercent } from "@/lib/formatting";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const latest = yearlyData[2];

const waterfallData = [
  { name: "Revenue", value: latest.foodSales, total: latest.foodSales, fill: "#2EC4B6" },
  { name: "COGS", value: -latest.totalCOGS, total: latest.foodSales - latest.totalCOGS, fill: "#FF6B6B" },
  { name: "Gross Profit", value: latest.grossProfit, total: latest.grossProfit, fill: "#22C55E" },
  { name: "Expenses", value: -(latest.totalExpenses - latest.totalCOGS), total: latest.grossProfit - (latest.totalExpenses - latest.totalCOGS), fill: "#FF6B6B" },
  { name: "Operating", value: latest.netOrdinaryIncome, total: latest.netOrdinaryIncome, fill: "#FF6B6B" },
  { name: "Other Income", value: latest.otherIncome, total: latest.netOrdinaryIncome + latest.otherIncome, fill: "#6366F1" },
  { name: "Net Income", value: latest.netIncome, total: latest.netIncome, fill: latest.netIncome >= 0 ? "#22C55E" : "#FF6B6B" },
];

const waterfallChartData = waterfallData.map((item) => ({
  name: item.name,
  value: Math.abs(item.value),
  fill: item.fill,
  displayValue: item.value,
}));

const lineItems = [
  { label: "Food Sales", key: "foodSales" as const },
  { label: "Total COGS", key: "totalCOGS" as const },
  { label: "Gross Profit", key: "grossProfit" as const },
  { label: "Total Expenses", key: "totalExpenses" as const },
  { label: "Payroll", key: "payroll" as const },
  { label: "Net Ordinary Income", key: "netOrdinaryIncome" as const },
  { label: "Other Income", key: "otherIncome" as const },
  { label: "Net Income", key: "netIncome" as const },
];

const marginData = yearlyData.map((d) => ({
  year: d.year.toString(),
  "Gross Margin": +((d.grossProfit / d.foodSales) * 100).toFixed(1),
  "Operating Margin": +((d.netOrdinaryIncome / d.foodSales) * 100).toFixed(1),
  "Net Margin": +((d.netIncome / d.foodSales) * 100).toFixed(1),
}));

export default function PnLPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">P&L Analysis</h1>
        <p className="text-slate-500 mt-1">Profit & Loss deep dive (2023–2025)</p>
      </div>

      <ChartCard title="2025 P&L Waterfall" subtitle="Revenue to Net Income breakdown">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={waterfallChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              formatter={(_value: unknown, _name: unknown, props: unknown) => {
                const p = props as { payload?: { displayValue?: number } };
                return [formatCurrency(p.payload?.displayValue ?? 0), "Amount"];
              }}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {waterfallChartData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="3-Year P&L Comparison" subtitle="All line items across 2023–2025">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Line Item</th>
                {yearlyData.map((d) => (
                  <th key={d.year} className="text-right py-3 px-4 font-semibold text-slate-600">
                    {d.year}
                  </th>
                ))}
                <th className="text-right py-3 px-4 font-semibold text-slate-600">YoY Change</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item) => {
                const val2024 = yearlyData[1][item.key];
                const val2025 = yearlyData[2][item.key];
                const change = val2024 !== 0
                  ? ((val2025 - val2024) / Math.abs(val2024)) * 100
                  : 0;
                const isNegativeRow = item.key === "totalCOGS" || item.key === "totalExpenses";
                return (
                  <tr
                    key={item.key}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3 px-4 font-medium text-slate-900">{item.label}</td>
                    {yearlyData.map((d) => (
                      <td
                        key={d.year}
                        className={`py-3 px-4 text-right tabular-nums ${
                          d[item.key] < 0 ? "text-negative" : ""
                        }`}
                      >
                        {formatCurrency(d[item.key])}
                      </td>
                    ))}
                    <td
                      className={`py-3 px-4 text-right font-medium ${
                        (isNegativeRow ? change <= 0 : change >= 0)
                          ? "text-positive"
                          : "text-negative"
                      }`}
                    >
                      {formatPercent(change)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ChartCard>

      <ChartCard title="Margin Trends" subtitle="Gross, Operating, and Net margins over 3 years">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={marginData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              formatter={(value: number) => `${value.toFixed(1)}%`}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="Gross Margin" stroke="#22C55E" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Operating Margin" stroke="#FF6B6B" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Net Margin" stroke="#6366F1" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
