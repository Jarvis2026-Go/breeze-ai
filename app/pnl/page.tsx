"use client";

import { cn } from "@/lib/utils";
import { yearlyData } from "@/lib/data";
import { formatCurrency } from "@/lib/formatting";
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
  ReferenceLine,
} from "recharts";
import { ArrowDown, ArrowUp, HelpCircle } from "lucide-react";

const d25 = yearlyData[2];
const d24 = yearlyData[1];

// Waterfall: show the journey from sales to what's left
const waterfallData = [
  { name: "Sales", value: d25.foodSales, fill: "#2EC4B6", label: "What came in" },
  { name: "Food & Supplies", value: d25.totalCOGS, fill: "#FF6B6B", label: "Cost of ingredients" },
  { name: "Staff Wages", value: d25.payroll, fill: "#FF6B6B", label: "Paying the team" },
  { name: "Rent", value: 36000, fill: "#6366F1", label: "Monthly rent" },
  { name: "Other Bills", value: d25.totalExpenses - d25.totalCOGS - d25.payroll - 36000, fill: "#F59E0B", label: "Insurance, utilities, etc." },
  { name: "Tips & Subsidies", value: d25.otherIncome, fill: "#22C55E", label: "Extra income received" },
  { name: "What's Left", value: d25.netIncome, fill: d25.netIncome >= 0 ? "#22C55E" : "#EF4444", label: "Bottom line" },
];

// Simplified P&L table with plain names
const tableRows = [
  { label: "Total Sales", key: "foodSales" as const, help: "All the money customers paid", isCost: false },
  { label: "Food & Supply Costs", key: "totalCOGS" as const, help: "Ingredients, alcohol, supplies", isCost: true },
  { label: "Money Left After Food Costs", key: "grossProfit" as const, help: "Sales minus food costs", isCost: false },
  { label: "All Operating Costs", key: "totalExpenses" as const, help: "Everything it costs to run the restaurant", isCost: true },
  { label: "Staff Wages", key: "payroll" as const, help: "Salaries for all employees", isCost: true },
  { label: "Operating Result", key: "netOrdinaryIncome" as const, help: "Profit or loss from running the restaurant", isCost: false },
  { label: "Tips & Subsidies", key: "otherIncome" as const, help: "Tip income and government help", isCost: false },
  { label: "Final Bottom Line", key: "netIncome" as const, help: "What's truly left after everything", isCost: false },
];

// How much of each dollar is kept at different stages
const marginData = yearlyData.map((d) => ({
  year: d.year.toString(),
  "After Food Costs": +((d.grossProfit / d.foodSales) * 100).toFixed(1),
  "After All Costs": +((d.netOrdinaryIncome / d.foodSales) * 100).toFixed(1),
  "After Everything": +((d.netIncome / d.foodSales) * 100).toFixed(1),
}));

export default function PnLPage() {
  return (
    <div className="space-y-8 max-w-[1400px]">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Profit & Loss</h1>
        <div className="h-1 w-16 bg-gradient-to-r from-teal to-teal-dark rounded-full mt-2 mb-3" />
        <p className="text-sm font-medium bg-gradient-to-r from-teal to-teal-dark bg-clip-text text-transparent">
          Where the money comes from, where it goes, and what&apos;s left — for 2023, 2024, and 2025.
        </p>
      </div>

      {/* The Journey of a Dollar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">The Journey of CHOG&apos;s Money (2025)</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Starting with total sales on the left, each bar shows a major cost that takes a bite.
          The final bar shows what&apos;s left — unfortunately, a loss.
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={waterfallData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              formatter={(_value: unknown, _name: unknown, props: unknown) => {
                const p = props as { payload?: { value?: number; label?: string } };
                return [formatCurrency(Math.abs(p.payload?.value ?? 0)), p.payload?.label ?? ""];
              }}
              contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {waterfallData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600">
            <strong>Reading this chart:</strong> The teal bar is money coming in. Red bars are costs going out.
            Green is the tip/subsidy income that helps. The final bar is what&apos;s left — in 2025,
            CHOG lost <strong>{formatCurrency(Math.abs(d25.netIncome))}</strong>.
          </p>
        </div>
      </div>

      {/* Year by Year Comparison */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Year-by-Year Numbers</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Every major financial line for all 3 years. The last column shows whether things got better or worse in 2025 vs. 2024.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-600">What It Is</th>
                {yearlyData.map((d) => (
                  <th key={d.year} className="text-right py-3 px-4 font-semibold text-slate-600">
                    {d.year}
                  </th>
                ))}
                <th className="text-right py-3 px-4 font-semibold text-slate-600">vs. Last Year</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((item) => {
                const val24 = yearlyData[1][item.key];
                const val25 = yearlyData[2][item.key];
                const change = val24 !== 0
                  ? ((val25 - val24) / Math.abs(val24)) * 100
                  : 0;
                // For costs, going down is good. For income, going up is good.
                const isGoodChange = item.isCost ? change < 0 : change > 0;
                const isHighlight = item.key === "netIncome" || item.key === "netOrdinaryIncome";

                return (
                  <tr
                    key={item.key}
                    className={cn(
                      "border-b border-slate-100 hover:bg-slate-50",
                      isHighlight && "bg-slate-50 font-semibold"
                    )}
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{item.label}</div>
                      <div className="text-xs text-slate-400">{item.help}</div>
                    </td>
                    {yearlyData.map((d) => (
                      <td
                        key={d.year}
                        className={cn(
                          "py-3 px-4 text-right tabular-nums",
                          d[item.key] < 0 && "text-red-600"
                        )}
                      >
                        {formatCurrency(d[item.key])}
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right">
                      <span className={cn(
                        "inline-flex items-center gap-1 text-sm font-semibold",
                        isGoodChange ? "text-green-600" : "text-red-600"
                      )}>
                        {isGoodChange
                          ? <ArrowUp className="w-3.5 h-3.5" />
                          : <ArrowDown className="w-3.5 h-3.5" />
                        }
                        {Math.abs(change).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* How Much You Keep */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">How Much of Each Dollar Do You Keep?</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Three ways to look at it: after paying for food, after paying all bills, and after truly everything
          (including tips received). When the line is below zero, the restaurant is losing money at that stage.
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={marginData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" stroke="#94a3b8" fontSize={13} />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={(v) => `${v}¢`}
            />
            <Tooltip
              formatter={(value: unknown) => typeof value === "number" ? `${value.toFixed(1)} cents` : "N/A"}
              contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
            />
            <Legend wrapperStyle={{ fontSize: "13px" }} />
            <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: "Break even", fontSize: 11, fill: "#94a3b8" }} />
            <Line type="monotone" dataKey="After Food Costs" stroke="#22C55E" strokeWidth={3} dot={{ r: 5, fill: "#22C55E" }} />
            <Line type="monotone" dataKey="After All Costs" stroke="#FF6B6B" strokeWidth={3} dot={{ r: 5, fill: "#FF6B6B" }} />
            <Line type="monotone" dataKey="After Everything" stroke="#6366F1" strokeWidth={3} dot={{ r: 5, fill: "#6366F1" }} />
          </LineChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-xs text-slate-500">After food costs</p>
            <p className="text-lg font-bold text-green-600">77¢</p>
            <p className="text-xs text-slate-400">of every dollar</p>
          </div>
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-xs text-slate-500">After all bills</p>
            <p className="text-lg font-bold text-red-600">-16¢</p>
            <p className="text-xs text-slate-400">losing money here</p>
          </div>
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-center">
            <p className="text-xs text-slate-500">Final (with tips)</p>
            <p className="text-lg font-bold text-red-600">-2¢</p>
            <p className="text-xs text-slate-400">still a loss</p>
          </div>
        </div>
      </div>
    </div>
  );
}
