"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { yearlyData, pnlLineItems, wageData, wageData2023, wageData2024 } from "@/lib/data";
import { WageEmployee } from "@/lib/types";
import { formatCurrency, calcYoYChange } from "@/lib/formatting";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  ReferenceLine,
  Cell,
} from "recharts";

// ── Real data from pnlLineItems ──────────────────────────────

const expenseAccounts = pnlLineItems.filter(
  (item) => item.indent && item.group === "opex"
);

// Category classification
const controllableSet = new Set([
  "Payroll Expenses",
  "Advertising and Promotion",
  "Automobile Expenses",
  "Cleaning Expenses",
  "Computer and Internet Expenses",
  "Employee Benefits",
  "Equipment Rental",
  "Meals & Entertainment",
  "Office Supplies",
  "Professional Fees",
  "Repairs and Maintenance",
  "Waste Management",
]);

const passThroughSet = new Set(["Tips Paid to Employee"]);

type CostCategory = "Controllable" | "Fixed" | "Pass-through";

function classify(account: string): CostCategory {
  if (passThroughSet.has(account)) return "Pass-through";
  if (controllableSet.has(account)) return "Controllable";
  return "Fixed";
}

// Compute category totals for each year
const categoryTotals = [0, 1, 2].map((i) => {
  let controllable = 0,
    fixed = 0,
    passThrough = 0;
  expenseAccounts.forEach((item) => {
    const cat = classify(item.account);
    if (cat === "Pass-through") passThrough += item.values[i];
    else if (cat === "Controllable") controllable += item.values[i];
    else fixed += item.values[i];
  });
  return {
    year: (2023 + i).toString(),
    Controllable: Math.round(controllable),
    Fixed: Math.round(fixed),
    "Pass-through": Math.round(passThrough),
    total: Math.round(controllable + fixed + passThrough),
    trueOpex: Math.round(controllable + fixed),
  };
});

// KPI values
const trueOpex25 = categoryTotals[2].trueOpex;
const trueOpex24 = categoryTotals[1].trueOpex;
const trueOpexYoY = calcYoYChange(trueOpex25, trueOpex24);
const controllable25 = categoryTotals[2].Controllable;
const controllablePct = ((controllable25 / trueOpex25) * 100).toFixed(0);
const laborRatio25 = (yearlyData[2].payroll / yearlyData[2].foodSales) * 100;

// Helper to look up a GL account value
const get = (name: string, i: number) =>
  pnlLineItems.find((item) => item.account === name)!.values[i];

// Payroll as cents per dollar of sales — real data
const payrollRatioData = yearlyData.map((d) => ({
  year: d.year.toString(),
  "Cents per Dollar": +((d.payroll / d.foodSales) * 100).toFixed(1),
}));

// Wage analysis — real payroll data (all 3 years)
const openHoursPerYear = 5 * 8 * 52; // Tue-Sat, 8am-4pm = 2,080 hrs
const ontarioMinWages = [15.50, 16.55, 17.20]; // 2023, 2024, 2025

const wageDataByYear: WageEmployee[][] = [wageData2023, wageData2024, wageData];

function computePayrollStats(data: WageEmployee[], minWage: number) {
  const headcount = data.length;
  const totalHours = data.reduce((s, w) => s + w.hoursWorked, 0);
  const ftes = totalHours / openHoursPerYear;
  const gross = data.reduce((s, w) => s + w.grossPay, 0);
  const taxes = data.reduce((s, w) => s + w.employerTaxes, 0);
  const mgmt = data.filter((w) => w.isSalaried);
  const core = data.filter((w) => !w.isSalaried && w.hoursWorked >= 500);
  const casual = data.filter((w) => !w.isSalaried && w.hoursWorked >= 100 && w.hoursWorked < 500);
  const trial = data.filter((w) => !w.isSalaried && w.hoursWorked < 100);
  const hourly = data.filter((w) => w.hourlyRate !== null);
  const atMin = hourly.filter((w) => w.hourlyRate === minWage);
  const aboveMin = hourly.filter((w) => w.hourlyRate! > minWage);
  const weightedAvgRate = hourly.length > 0
    ? hourly.reduce((s, w) => s + w.hourlyRate! * w.hoursWorked, 0) / hourly.reduce((s, w) => s + w.hoursWorked, 0)
    : 0;
  return {
    headcount, totalHours, ftes, gross, taxes, minWage,
    mgmt, core, casual, trial, hourly, atMin, aboveMin, weightedAvgRate,
    mgmtTotal: mgmt.reduce((s, w) => s + w.grossPay, 0),
    coreTotal: core.reduce((s, w) => s + w.grossPay, 0),
    casualTotal: casual.reduce((s, w) => s + w.grossPay, 0),
    trialTotal: trial.reduce((s, w) => s + w.grossPay, 0),
  };
}

const payrollStats = [0, 1, 2].map((i) => computePayrollStats(wageDataByYear[i], ontarioMinWages[i]));

// Current year (2025) stats for KPI cards
const totalPayroll = yearlyData[2].payroll;
const stats25 = payrollStats[2];

// Retention analysis — who appears across years
const names2023 = new Set(wageData2023.map((w) => w.name));
const names2024 = new Set(wageData2024.map((w) => w.name));
const names2025 = new Set(wageData.map((w) => w.name));
const allNamesArr = Array.from(names2023).concat(Array.from(names2024)).concat(Array.from(names2025));
const allNames = new Set(allNamesArr);
const threeYearVets = Array.from(allNames).filter((n) => names2023.has(n) && names2024.has(n) && names2025.has(n));
const uniqueTotal = allNames.size;

// Labor efficiency metrics
const revenue25 = yearlyData[2].foodSales;
const revenuePerFte = revenue25 / stats25.ftes;
const revenuePerLaborDollar = revenue25 / totalPayroll;
const salesPerHour = revenue25 / openHoursPerYear;
const payrollPerHour = totalPayroll / openHoursPerYear;

// Scenario modeler
const industryTarget = 0.34;
const scenarios = [
  {
    name: "Current State",
    payroll: totalPayroll,
    revenue: revenue25,
    desc: "Where you stand today",
  },
  {
    name: "Cut 1 FTE (~$30K)",
    payroll: totalPayroll - 30000,
    revenue: revenue25,
    desc: "Reduce by one full-time role through cross-training",
  },
  {
    name: "Grow Revenue 10%",
    payroll: totalPayroll,
    revenue: Math.round(revenue25 * 1.1),
    desc: "Same team, more customers",
  },
  {
    name: "Hybrid: -$15K + 5% Growth",
    payroll: totalPayroll - 15000,
    revenue: Math.round(revenue25 * 1.05),
    desc: "Trim $15K in payroll and grow revenue 5%",
  },
];

// Category badge colors
const catBadge: Record<CostCategory, string> = {
  Controllable: "bg-teal/10 text-teal border-teal/20",
  Fixed: "bg-indigo-50 text-indigo-600 border-indigo-200",
  "Pass-through": "bg-slate-100 text-slate-500 border-slate-200",
};

// ── Page ─────────────────────────────────────────────────────

export default function ExpensesPage() {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [payrollYear, setPayrollYear] = useState(2);

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Expenses & Wages
        </h1>
        <div className="h-1 w-16 bg-gradient-to-r from-teal to-teal-dark rounded-full mt-2 mb-3" />
        <p className="text-sm font-medium bg-gradient-to-r from-teal to-teal-dark bg-clip-text text-transparent">
          Every dollar it costs to run your restaurant &mdash; sorted by what you can control, what&apos;s locked in,
          and what&apos;s a pass-through. All from your QuickBooks.
        </p>
      </div>

      {/* Section 1: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border bg-white shadow-sm border-slate-100">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            True Operating Expenses
          </p>
          <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
            {formatCurrency(trueOpex25)}
          </p>
          <p className={cn("text-sm font-bold mt-0.5 tabular-nums", trueOpexYoY > 0 ? "text-red-600" : "text-green-600")}>
            {trueOpexYoY >= 0 ? "+" : ""}{trueOpexYoY.toFixed(1)}% YoY
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Excludes tip pass-through &mdash; what it actually costs you to operate
          </p>
        </div>
        <div className="p-5 rounded-xl border bg-teal/5 border-teal/20">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Controllable Costs
          </p>
          <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
            {formatCurrency(controllable25)}
          </p>
          <p className="text-sm font-bold text-teal mt-0.5">
            {controllablePct}% of true OpEx
          </p>
          <p className="text-xs text-slate-500 mt-1">
            These are the expenses your decisions can change &mdash; your focus area
          </p>
        </div>
        <div className="p-5 rounded-xl border bg-red-50 border-red-200">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Labor Cost Ratio
          </p>
          <p className="text-2xl font-black text-red-700 mt-1 tabular-nums">
            {laborRatio25.toFixed(1)}&#162; per dollar
          </p>
          <p className="text-sm font-bold text-red-600 mt-0.5">
            Industry avg: 34&#162;
          </p>
          <p className="text-xs text-slate-500 mt-1">
            15&#162; above average = ~${Math.round((laborRatio25 - 34) / 100 * revenue25 / 1000)}K/year overspend
          </p>
        </div>
      </div>

      {/* Section 2: Controllable vs Fixed vs Pass-through */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          What You Can Control vs. What&apos;s Locked In
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Not all expenses are equal &mdash; some you can cut, some you can&apos;t, and tips are a pass-through
          (offset by tip income).
        </p>

        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={categoryTotals}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis
              type="number"
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
            />
            <YAxis type="category" dataKey="year" stroke="#94a3b8" fontSize={13} width={40} />
            <Tooltip
              formatter={(value: number, name: string) => [formatCurrency(value), name]}
              contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
            />
            <Legend />
            <Bar dataKey="Controllable" stackId="a" fill="#2EC4B6" />
            <Bar dataKey="Fixed" stackId="a" fill="#6366F1" />
            <Bar dataKey="Pass-through" stackId="a" fill="#94A3B8" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Breakdown cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {[
            {
              label: "Controllable",
              values: categoryTotals.map((c) => c.Controllable),
              color: "bg-teal/5 border-teal/20",
              accent: "text-teal",
              examples: "Payroll, equipment, supplies, cleaning, professional fees",
            },
            {
              label: "Fixed / Committed",
              values: categoryTotals.map((c) => c.Fixed),
              color: "bg-indigo-50 border-indigo-200",
              accent: "text-indigo-600",
              examples: "Rent, insurance, utilities, merchant fees, depreciation",
            },
            {
              label: "Pass-through (Tips)",
              values: categoryTotals.map((c) => c["Pass-through"]),
              color: "bg-slate-50 border-slate-200",
              accent: "text-slate-500",
              examples: "Tips paid to employees — offset by Other Income-Tips",
            },
          ].map((cat) => (
            <div key={cat.label} className={cn("p-4 rounded-lg border", cat.color)}>
              <p className={cn("text-sm font-bold", cat.accent)}>{cat.label}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-black text-slate-900 tabular-nums">
                  {formatCurrency(cat.values[2])}
                </span>
                <span className="text-xs text-slate-400">2025</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 tabular-nums">
                2023: {formatCurrency(cat.values[0])} &rarr; 2024: {formatCurrency(cat.values[1])}
              </p>
              <p className="text-xs text-slate-500 mt-2">{cat.examples}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Full Expense YoY Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          Full Expense Breakdown &mdash; Year over Year
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Every expense from your QuickBooks, sorted by 2025 spend. Real numbers, real changes.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Expense</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-600">Type</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">2023</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">2024</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">2025</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">$ Change</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">% Change</th>
              </tr>
            </thead>
            <tbody>
              {[...expenseAccounts]
                .sort((a, b) => b.values[2] - a.values[2])
                .map((item) => {
                  const change = item.values[2] - item.values[1];
                  const pctChange = calcYoYChange(item.values[2], item.values[1]);
                  const cat = classify(item.account);
                  return (
                    <tr key={item.account} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-medium text-slate-700">
                        {item.account}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span className={cn("inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border", catBadge[cat])}>
                          {cat}
                        </span>
                      </td>
                      {item.values.map((val, vi) => (
                        <td key={vi} className="py-2.5 px-4 text-right tabular-nums text-slate-700">
                          {val === 0 ? <span className="text-slate-300">—</span> : formatCurrency(Math.round(val))}
                        </td>
                      ))}
                      <td className={cn("py-2.5 px-4 text-right tabular-nums font-semibold",
                        change > 0 ? "text-red-600" : change < 0 ? "text-green-600" : "text-slate-400"
                      )}>
                        {change === 0 ? "—" : `${change > 0 ? "+" : ""}${formatCurrency(Math.round(change))}`}
                      </td>
                      <td className={cn("py-2.5 px-4 text-right tabular-nums",
                        pctChange > 0 ? "text-red-600" : pctChange < 0 ? "text-green-600" : "text-slate-400"
                      )}>
                        {item.values[1] === 0 && item.values[2] === 0
                          ? "—"
                          : `${pctChange >= 0 ? "+" : ""}${pctChange.toFixed(1)}%`}
                      </td>
                    </tr>
                  );
                })}
              {/* Total row */}
              <tr className="border-t-2 border-slate-300 bg-slate-50/70">
                <td className="py-3 px-4 font-black text-slate-900">Total Expenses</td>
                <td></td>
                {[0, 1, 2].map((i) => (
                  <td key={i} className="py-3 px-4 text-right tabular-nums font-black text-slate-900">
                    {formatCurrency(Math.round(get("Total Expense", i)))}
                  </td>
                ))}
                <td className="py-3 px-4 text-right tabular-nums font-black text-red-600">
                  +{formatCurrency(Math.round(get("Total Expense", 2) - get("Total Expense", 1)))}
                </td>
                <td className="py-3 px-4 text-right tabular-nums font-bold text-red-600">
                  +{calcYoYChange(get("Total Expense", 2), get("Total Expense", 1)).toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Source: QuickBooks P&amp;L export (Jan–Dec each year). $ Change and % Change are 2024 → 2025.
          Increases in costs shown in red, decreases in green.
        </p>
      </div>


      {/* Section 5: Labor Cost Deep Dive */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          Your Team, Your Biggest Cost
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Payroll is your single biggest expense. Here&apos;s the real data from your payroll system for all 3 years.
        </p>

        {/* Cents per dollar chart */}
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={payrollRatioData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" stroke="#94a3b8" fontSize={13} />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={(v: number) => `${v}¢`}
              domain={[25, 55]}
            />
            <Tooltip
              formatter={(value: number) => [`${value}¢ per dollar`, "Staff Cost"]}
              contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
            />
            <ReferenceLine
              y={34}
              stroke="#22C55E"
              strokeWidth={1.5}
              strokeDasharray="6 4"
              label={{
                value: "Industry avg: 34¢",
                fontSize: 11,
                fill: "#22C55E",
                position: "top",
              }}
            />
            <Line
              type="monotone"
              dataKey="Cents per Dollar"
              stroke="#FF6B6B"
              strokeWidth={3}
              dot={{ r: 6, fill: "#FF6B6B" }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Payroll YoY Summary Table */}
        <h3 className="text-base font-bold text-slate-900 mt-8 mb-3">
          Payroll Year over Year
        </h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-3 font-semibold text-slate-600">Metric</th>
                {[2023, 2024, 2025].map((y) => (
                  <th key={y} className="text-right py-3 px-3 font-semibold text-slate-600">{y}</th>
                ))}
                <th className="text-right py-3 px-3 font-semibold text-slate-600">Trend</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: "Headcount",
                  values: payrollStats.map((s) => s.headcount.toString()),
                  trend: `${payrollStats[0].headcount} → ${payrollStats[1].headcount} → ${payrollStats[2].headcount}`,
                  trendColor: "text-slate-600",
                },
                {
                  label: "FTEs (hrs / 2,080)",
                  values: payrollStats.map((s) => s.ftes.toFixed(1)),
                  trend: (() => {
                    const d = payrollStats[2].ftes - payrollStats[0].ftes;
                    return `${d >= 0 ? "+" : ""}${d.toFixed(1)} since 2023`;
                  })(),
                  trendColor: "text-slate-600",
                },
                {
                  label: "P&L Payroll Cost",
                  values: [0, 1, 2].map((i) => formatCurrency(yearlyData[i].payroll)),
                  trend: `${calcYoYChange(yearlyData[2].payroll, yearlyData[1].payroll) >= 0 ? "+" : ""}${calcYoYChange(yearlyData[2].payroll, yearlyData[1].payroll).toFixed(1)}% YoY`,
                  trendColor: calcYoYChange(yearlyData[2].payroll, yearlyData[1].payroll) > 0 ? "text-red-600" : "text-green-600",
                },
                {
                  label: "Gross Pay (payroll sys)",
                  values: payrollStats.map((s) => formatCurrency(Math.round(s.gross))),
                  trend: "",
                  trendColor: "text-slate-400",
                },
                {
                  label: "Employer Taxes",
                  values: payrollStats.map((s) => formatCurrency(Math.round(s.taxes))),
                  trend: "",
                  trendColor: "text-slate-400",
                },
                {
                  label: "Avg Hourly Rate (wtd)",
                  values: payrollStats.map((s) => `$${s.weightedAvgRate.toFixed(2)}`),
                  trend: `+$${(payrollStats[2].weightedAvgRate - payrollStats[0].weightedAvgRate).toFixed(2)} since 2023`,
                  trendColor: "text-amber-600",
                },
                {
                  label: "Ontario Min Wage",
                  values: ontarioMinWages.map((w) => `$${w.toFixed(2)}`),
                  trend: `+$${(ontarioMinWages[2] - ontarioMinWages[0]).toFixed(2)} (+${(((ontarioMinWages[2] - ontarioMinWages[0]) / ontarioMinWages[0]) * 100).toFixed(0)}%)`,
                  trendColor: "text-amber-600",
                },
                {
                  label: "Core Staff (500+ hrs)",
                  values: payrollStats.map((s) => s.core.length.toString()),
                  trend: "",
                  trendColor: "text-slate-400",
                },
                {
                  label: "Trial Staff (<100 hrs)",
                  values: payrollStats.map((s) => s.trial.length.toString()),
                  trend: "",
                  trendColor: "text-slate-400",
                },
              ].map((row) => (
                <tr key={row.label} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-2 px-3 font-medium text-slate-700">{row.label}</td>
                  {row.values.map((v, vi) => (
                    <td key={vi} className="py-2 px-3 text-right tabular-nums text-slate-700">{v}</td>
                  ))}
                  <td className={cn("py-2 px-3 text-right text-xs font-semibold", row.trendColor)}>
                    {row.trend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Retention & Turnover */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg border bg-red-50 border-red-200">
            <p className="text-xs text-slate-500 font-medium">Total Unique Employees (3 yr)</p>
            <p className="text-xl font-black text-red-700 mt-1">{uniqueTotal} people</p>
            <p className="text-xs text-slate-500 mt-1">Only {threeYearVets.length} stayed all 3 years</p>
          </div>
          <div className="p-4 rounded-lg border bg-teal/5 border-teal/20">
            <p className="text-xs text-slate-500 font-medium">3-Year Veterans</p>
            <p className="text-xl font-black text-teal mt-1">{threeYearVets.length} of {uniqueTotal}</p>
            <p className="text-xs text-slate-500 mt-1">{threeYearVets.map((n) => n.split(" ")[0]).join(", ")}</p>
          </div>
          <div className="p-4 rounded-lg border bg-amber-50 border-amber-200">
            <p className="text-xs text-slate-500 font-medium">Min Wage Increase (3 yr)</p>
            <p className="text-xl font-black text-amber-700 mt-1">+${(ontarioMinWages[2] - ontarioMinWages[0]).toFixed(2)}/hr</p>
            <p className="text-xs text-slate-500 mt-1">${ontarioMinWages[0].toFixed(2)} → ${ontarioMinWages[2].toFixed(2)} = +{(((ontarioMinWages[2] - ontarioMinWages[0]) / ontarioMinWages[0]) * 100).toFixed(0)}%</p>
          </div>
        </div>

        {/* Efficiency metrics (2025) */}
        <h3 className="text-base font-bold text-slate-900 mt-4 mb-3">
          Efficiency Metrics (2025)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Revenue per FTE",
              value: formatCurrency(Math.round(revenuePerFte)),
              benchmark: `${stats25.ftes.toFixed(1)} FTEs from ${wageData.length} people`,
              status: revenuePerFte >= 70000 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200",
              verdict: revenuePerFte >= 70000 ? "On track" : "Low for restaurant",
              verdictColor: revenuePerFte >= 70000 ? "text-green-600" : "text-red-600",
            },
            {
              label: "Revenue per Labor $",
              value: `$${revenuePerLaborDollar.toFixed(2)}`,
              benchmark: "Industry: $3–$4",
              status: revenuePerLaborDollar >= 3 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200",
              verdict: revenuePerLaborDollar >= 3 ? "On track" : "Below avg",
              verdictColor: revenuePerLaborDollar >= 3 ? "text-green-600" : "text-red-600",
            },
            {
              label: "Sales per Open Hour",
              value: `${formatCurrency(Math.round(salesPerHour))}/hr`,
              benchmark: "Tue-Sat, 8am-4pm = 2,080 hrs/yr",
              status: "bg-slate-50 border-slate-200",
              verdict: `${formatCurrency(Math.round(salesPerHour * 8))}/day`,
              verdictColor: "text-slate-600",
            },
            {
              label: "Payroll per Open Hour",
              value: `${formatCurrency(Math.round(payrollPerHour))}/hr`,
              benchmark: `${((payrollPerHour / salesPerHour) * 100).toFixed(0)}% of hourly revenue`,
              status: payrollPerHour / salesPerHour > 0.4 ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200",
              verdict: payrollPerHour / salesPerHour > 0.4 ? "Too high" : "Watch",
              verdictColor: payrollPerHour / salesPerHour > 0.4 ? "text-red-600" : "text-amber-600",
            },
          ].map((m) => (
            <div key={m.label} className={cn("p-4 rounded-lg border", m.status)}>
              <p className="text-xs text-slate-500 font-medium">{m.label}</p>
              <p className="text-xl font-black text-slate-900 mt-1 tabular-nums">{m.value}</p>
              <p className={cn("text-xs font-bold mt-0.5", m.verdictColor)}>{m.verdict}</p>
              <p className="text-[10px] text-slate-400 mt-1">{m.benchmark}</p>
            </div>
          ))}
        </div>

        {/* Year-selectable payroll detail */}
        <div className="flex items-center justify-between mt-8 mb-3">
          <h3 className="text-base font-bold text-slate-900">
            Full Payroll Detail — {2023 + payrollYear}
          </h3>
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            {[2023, 2024, 2025].map((y, i) => (
              <button
                key={y}
                onClick={() => setPayrollYear(i)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-bold transition-all",
                  payrollYear === i
                    ? "bg-white text-teal shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* Staffing tier cards for selected year */}
        {(() => {
          const s = payrollStats[payrollYear];
          return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[
                { label: "GM / Salaried", total: s.mgmtTotal, count: s.mgmt.length, hours: s.mgmt.reduce((a: number, w: WageEmployee) => a + w.hoursWorked, 0), color: "bg-blue-50 border-blue-200" },
                { label: "Core (500+ hrs)", total: s.coreTotal, count: s.core.length, hours: s.core.reduce((a: number, w: WageEmployee) => a + w.hoursWorked, 0), color: "bg-teal/5 border-teal/20" },
                { label: "Casual (100-499 hrs)", total: s.casualTotal, count: s.casual.length, hours: s.casual.reduce((a: number, w: WageEmployee) => a + w.hoursWorked, 0), color: "bg-amber-50 border-amber-200" },
                { label: "Trial (<100 hrs)", total: s.trialTotal, count: s.trial.length, hours: s.trial.reduce((a: number, w: WageEmployee) => a + w.hoursWorked, 0), color: "bg-slate-50 border-slate-200" },
              ].map((g) => (
                <div key={g.label} className={cn("p-3 rounded-lg border text-center", g.color)}>
                  <p className="text-xs text-slate-500 font-medium">{g.label}</p>
                  <p className="text-lg font-bold text-slate-900 tabular-nums">{formatCurrency(g.total, true)}</p>
                  <p className="text-xs text-slate-400">{g.count} {g.count === 1 ? "person" : "people"} &middot; {Math.round(g.hours).toLocaleString()} hrs</p>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Rate analysis for selected year */}
        {(() => {
          const s = payrollStats[payrollYear];
          const yearLabel = 2023 + payrollYear;
          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg border bg-amber-50 border-amber-200">
                <p className="text-xs text-slate-500 font-medium">At Min Wage (${s.minWage.toFixed(2)})</p>
                <p className="text-xl font-black text-amber-700 mt-1">{s.atMin.length} of {s.hourly.length}</p>
                <p className="text-xs text-slate-500 mt-1">Ontario minimum in {yearLabel}</p>
              </div>
              <div className="p-4 rounded-lg border bg-slate-50 border-slate-200">
                <p className="text-xs text-slate-500 font-medium">Above Minimum</p>
                <p className="text-xl font-black text-slate-900 mt-1">{s.aboveMin.length} of {s.hourly.length}</p>
                <p className="text-xs text-slate-500 mt-1">Avg: ${s.weightedAvgRate.toFixed(2)}/hr (weighted)</p>
              </div>
              <div className="p-4 rounded-lg border bg-red-50 border-red-200">
                <p className="text-xs text-slate-500 font-medium">Turnover Signal</p>
                <p className="text-xl font-black text-red-700 mt-1">{s.trial.length} trials, {s.casual.length} casual</p>
                <p className="text-xs text-slate-500 mt-1">{s.trial.length + s.casual.length} of {s.headcount} didn&apos;t become core</p>
              </div>
            </div>
          );
        })()}

        {/* Payroll detail table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-3 font-semibold text-slate-600">Employee</th>
                <th className="text-left py-3 px-3 font-semibold text-slate-600">Role</th>
                <th className="text-right py-3 px-3 font-semibold text-slate-600">Rate</th>
                <th className="text-right py-3 px-3 font-semibold text-slate-600">Hours</th>
                <th className="text-right py-3 px-3 font-semibold text-slate-600">FTE</th>
                <th className="text-right py-3 px-3 font-semibold text-slate-600">Gross Pay</th>
                <th className="text-right py-3 px-3 font-semibold text-slate-600">+ Taxes</th>
                <th className="text-right py-3 px-3 font-semibold text-slate-600">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {wageDataByYear[payrollYear].map((emp) => {
                const fte = emp.hoursWorked / openHoursPerYear;
                const totalCost = emp.grossPay + emp.employerTaxes;
                const isMinWage = emp.hourlyRate === ontarioMinWages[payrollYear];
                return (
                  <tr key={emp.name} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-medium text-slate-900">{emp.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{emp.role}</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {emp.isSalaried ? (
                        <span className="text-xs text-blue-600 font-medium">Salaried</span>
                      ) : (
                        <span className={isMinWage ? "text-amber-600 font-medium" : ""}>
                          ${emp.hourlyRate!.toFixed(2)}
                          {isMinWage && <span className="text-[10px] ml-1">min</span>}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-slate-700">
                      {emp.hoursWorked.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      <span className={cn(
                        "text-xs font-medium px-1.5 py-0.5 rounded",
                        fte >= 0.7 ? "bg-teal/10 text-teal" :
                        fte >= 0.25 ? "bg-amber-50 text-amber-600" :
                        "bg-slate-100 text-slate-400"
                      )}>
                        {fte.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-slate-700">
                      {formatCurrency(Math.round(emp.grossPay))}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-slate-400">
                      {formatCurrency(Math.round(emp.employerTaxes))}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums font-semibold text-slate-900">
                      {formatCurrency(Math.round(totalCost))}
                    </td>
                  </tr>
                );
              })}
              {(() => {
                const s = payrollStats[payrollYear];
                return (
                  <tr className="border-t-2 border-slate-300 bg-slate-50/70 font-bold">
                    <td className="py-3 px-3 text-slate-900" colSpan={3}>Total</td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-900">
                      {Math.round(s.totalHours).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-900">
                      {s.ftes.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-900">
                      {formatCurrency(Math.round(s.gross))}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-400">
                      {formatCurrency(Math.round(s.taxes))}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-900">
                      {formatCurrency(yearlyData[payrollYear].payroll)}
                    </td>
                  </tr>
                );
              })()}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Source: Payroll system (Jan–Dec {2023 + payrollYear}). FTE = hours / 2,080.
          Ontario min wage: ${ontarioMinWages[payrollYear].toFixed(2)}/hr ({2023 + payrollYear}).
          {payrollYear === 1 && " ~$1.5K gap vs P&L likely from EHT/WSIB not shown in payroll report."}
        </p>
      </div>

      {/* Section 6: Payroll Scenario Modeler */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          What If You Changed the Staffing Math?
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Click a scenario to see how changes to payroll or revenue would move your labor cost
          toward the 34-cent industry target.
        </p>

        {/* Scenario selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {scenarios.map((s, i) => {
            const ratio = (s.payroll / s.revenue) * 100;
            const isActive = selectedScenario === i;
            return (
              <button
                key={i}
                onClick={() => setSelectedScenario(i)}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all",
                  isActive
                    ? "border-teal bg-teal/5 ring-2 ring-teal/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                <p className={cn("text-sm font-bold", isActive ? "text-teal" : "text-slate-700")}>
                  {s.name}
                </p>
                <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
                  {ratio.toFixed(1)}&#162;
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Visual comparison */}
        <div className="space-y-3">
          {scenarios.map((s, i) => {
            const ratio = (s.payroll / s.revenue) * 100;
            const savings = totalPayroll - s.payroll + (s.revenue - revenue25);
            const isActive = selectedScenario === i;
            const barWidth = Math.min((ratio / 55) * 100, 100);
            const targetPos = (34 / 55) * 100;
            return (
              <div
                key={i}
                className={cn(
                  "p-3 rounded-lg border transition-all cursor-pointer",
                  isActive ? "border-teal bg-teal/5" : "border-slate-100 hover:border-slate-200"
                )}
                onClick={() => setSelectedScenario(i)}
              >
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className={cn("font-medium", isActive ? "text-teal" : "text-slate-700")}>
                    {s.name}
                  </span>
                  <div className="flex items-center gap-3">
                    {i > 0 && (
                      <span className="text-xs text-green-600 font-semibold">
                        {ratio < laborRatio25 ? `${(laborRatio25 - ratio).toFixed(1)}¢ saved` : ""}
                      </span>
                    )}
                    <span className={cn(
                      "font-bold tabular-nums",
                      ratio <= 34 ? "text-green-600" : ratio <= 42 ? "text-amber-600" : "text-red-600"
                    )}>
                      {ratio.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="relative h-5 bg-slate-100 rounded-full overflow-visible">
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full transition-all",
                      ratio <= 34 ? "bg-green-400" : ratio <= 42 ? "bg-amber-400" : "bg-red-400"
                    )}
                    style={{ width: `${barWidth}%` }}
                  />
                  {/* Industry target line */}
                  <div
                    className="absolute top-[-4px] bottom-[-4px] w-0.5 bg-green-600 z-10"
                    style={{ left: `${targetPos}%` }}
                  />
                </div>
              </div>
            );
          })}
          <div className="flex items-center gap-2 text-xs text-green-600 mt-1">
            <div className="w-3 h-0.5 bg-green-600" />
            <span>Industry target: 34&#162; per dollar</span>
          </div>
        </div>

        {/* Selected scenario detail */}
        {selectedScenario > 0 && (() => {
          const s = scenarios[selectedScenario];
          const ratio = (s.payroll / s.revenue) * 100;
          const payrollSaved = totalPayroll - s.payroll;
          const revenueGained = s.revenue - revenue25;
          const gapToTarget = ratio - 34;
          return (
            <div className="mt-4 p-4 bg-teal/5 border border-teal/20 rounded-lg">
              <p className="text-sm font-bold text-slate-900">{s.name}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Payroll</p>
                  <p className="font-bold text-slate-900 tabular-nums">{formatCurrency(s.payroll)}</p>
                  {payrollSaved > 0 && <p className="text-xs text-green-600">-{formatCurrency(payrollSaved)}</p>}
                </div>
                <div>
                  <p className="text-xs text-slate-500">Revenue</p>
                  <p className="font-bold text-slate-900 tabular-nums">{formatCurrency(s.revenue)}</p>
                  {revenueGained > 0 && <p className="text-xs text-green-600">+{formatCurrency(revenueGained)}</p>}
                </div>
                <div>
                  <p className="text-xs text-slate-500">New Ratio</p>
                  <p className={cn("font-bold tabular-nums", ratio <= 34 ? "text-green-600" : ratio <= 42 ? "text-amber-600" : "text-red-600")}>
                    {ratio.toFixed(1)}&#162; per dollar
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Gap to Industry</p>
                  <p className={cn("font-bold tabular-nums", gapToTarget <= 0 ? "text-green-600" : "text-amber-600")}>
                    {gapToTarget <= 0 ? "At target!" : `${gapToTarget.toFixed(1)}¢ remaining`}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Footer */}
      <div className="text-xs text-slate-400 text-center pb-4">
        <p>
          Source: Your QuickBooks P&amp;L + payroll system (Jan&ndash;Dec 2025). All expense and wage values are exact.
          Industry benchmarks: Canadian full-service restaurants, Toronto market (2024&ndash;2025).
        </p>
      </div>
    </div>
  );
}
