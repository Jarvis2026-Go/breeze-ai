"use client";

import { cn } from "@/lib/utils";
import { yearlyData, pnlLineItems } from "@/lib/data";
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

const d25 = yearlyData[2];
const revenue2025 = d25.foodSales;

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

// How much of each dollar is kept at different stages
const marginData = yearlyData.map((d) => ({
  year: d.year.toString(),
  "After Food Costs": +((d.grossProfit / d.foodSales) * 100).toFixed(1),
  "After All Costs": +((d.netOrdinaryIncome / d.foodSales) * 100).toFixed(1),
  "After Everything": +((d.netIncome / d.foodSales) * 100).toFixed(1),
}));

function getStatus(item: typeof pnlLineItems[number]): { label: string; color: string } | null {
  if (!item.industryPctMedian || item.industryPctMedian === "N/A" || item.industryPctMedian === "100%") return null;

  const pctOfSales = (item.values[2] / revenue2025) * 100;

  // Parse industry median — take the midpoint of ranges like "30-35%"
  const cleaned = item.industryPctMedian.replace(/[~%]/g, "");
  let median: number;
  if (cleaned.includes("-")) {
    const [lo, hi] = cleaned.split("-").map(Number);
    median = (lo + hi) / 2;
  } else {
    median = Number(cleaned);
  }

  if (isNaN(median)) return null;

  const actual = Math.abs(pctOfSales);
  const diff = actual - median;

  if (item.isCost) {
    // For costs: being below median is good
    if (diff <= 0) return { label: "On track", color: "bg-green-100 text-green-700" };
    if (diff <= 3) return { label: "Watch", color: "bg-amber-100 text-amber-700" };
    return { label: "Above avg", color: "bg-red-100 text-red-700" };
  } else {
    // For profits: being above median is good
    if (item.bold && (item.account.includes("Income") || item.account === "Net Income" || item.account === "Gross Profit")) {
      if (pctOfSales >= median) return { label: "On track", color: "bg-green-100 text-green-700" };
      if (median - pctOfSales <= 5) return { label: "Watch", color: "bg-amber-100 text-amber-700" };
      return { label: "Below avg", color: "bg-red-100 text-red-700" };
    }
    return null;
  }
}

// Benchmark gap cards
const benchmarkGaps = [
  {
    title: "Payroll",
    actual: ((155137 / revenue2025) * 100).toFixed(1),
    industry: "30-35%",
    gap: "~14% over",
    description: "Staff costs eat 48.6¢ of every dollar — industry norm is about 33¢. This is the single biggest drag on profitability.",
    color: "border-red-200 bg-red-50",
    textColor: "text-red-700",
  },
  {
    title: "Rent",
    actual: ((36000 / revenue2025) * 100).toFixed(1),
    industry: "6-10%",
    gap: "~3% over",
    description: "Rent is 11.3% of revenue vs. the 8% median. Revenue needs to grow or a lease renegotiation is needed.",
    color: "border-amber-200 bg-amber-50",
    textColor: "text-amber-700",
  },
  {
    title: "Net Margin",
    actual: ((-7369 / revenue2025) * 100).toFixed(1),
    industry: "3-5%",
    gap: "~6% below",
    description: "Typical restaurants keep 3-5% profit. CHOG is at -2.3% — a swing of about $17K/year needed to reach industry average.",
    color: "border-red-200 bg-red-50",
    textColor: "text-red-700",
  },
  {
    title: "Food Costs (COGS)",
    actual: ((74148 / revenue2025) * 100).toFixed(1),
    industry: "30-33%",
    gap: "~8% under",
    description: "At 23.2%, food costs are well below the 32% median — excellent purchasing and waste management.",
    color: "border-green-200 bg-green-50",
    textColor: "text-green-700",
  },
];

export default function PnLPage() {
  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Section 1: Header */}
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Profit & Loss</h1>
        <div className="h-1 w-16 bg-gradient-to-r from-teal to-teal-dark rounded-full mt-2 mb-3" />
        <p className="text-sm font-medium bg-gradient-to-r from-teal to-teal-dark bg-clip-text text-transparent">
          Full account detail for 2023–2025, with Canadian restaurant industry benchmarks.
        </p>
      </div>

      {/* Section 2: Full P&L Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Complete Profit & Loss Statement</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Every account line, with industry benchmarks for a Canadian full-service restaurant. The &quot;Status&quot; column shows how CHOG compares.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Account</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">2023</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">2024</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">2025</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">% of Sales</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">Industry Avg</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {pnlLineItems.map((item, i) => {
                const pctOfSales = ((item.values[2] / revenue2025) * 100).toFixed(1);
                const status = getStatus(item);

                return (
                  <tr
                    key={i}
                    className={cn(
                      "border-b border-slate-100 hover:bg-slate-50/50",
                      item.separator && "border-t-2 border-t-slate-200",
                      item.bold && "bg-slate-50/70"
                    )}
                  >
                    <td className={cn("py-2.5 px-4", item.indent && "pl-10")}>
                      <span className={cn(
                        "text-slate-900",
                        item.bold ? "font-bold" : "font-medium",
                        item.indent && "text-slate-600"
                      )}>
                        {item.indent && <span className="text-slate-300 mr-1">—</span>}
                        {item.account}
                      </span>
                    </td>
                    {item.values.map((val, vi) => (
                      <td
                        key={vi}
                        className={cn(
                          "py-2.5 px-4 text-right tabular-nums",
                          item.bold && "font-bold",
                          val < 0 && "text-red-600"
                        )}
                      >
                        {formatCurrency(val)}
                      </td>
                    ))}
                    <td className={cn(
                      "py-2.5 px-4 text-right tabular-nums",
                      item.bold && "font-bold",
                      item.values[2] < 0 && "text-red-600"
                    )}>
                      {pctOfSales}%
                    </td>
                    <td className="py-2.5 px-4 text-right text-slate-500">
                      {item.industryPctMedian ?? "—"}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {status ? (
                        <span className={cn("inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold", status.color)}>
                          {status.label}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Existing Charts */}
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

      {/* Section 4: Key Benchmark Callout Cards */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Biggest Gaps vs. Industry</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benchmarkGaps.map((gap) => (
            <div key={gap.title} className={cn("rounded-2xl border p-5", gap.color)}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={cn("font-bold text-base", gap.textColor)}>{gap.title}</h3>
                <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full", gap.color, gap.textColor)}>
                  {gap.gap}
                </span>
              </div>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-2xl font-black tabular-nums">{gap.actual}%</span>
                <span className="text-sm text-slate-500">vs. {gap.industry} industry</span>
              </div>
              <p className="text-sm text-slate-600">{gap.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
