"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { bsLineItems, pnlLineItems, yearlyData } from "@/lib/data";
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
} from "recharts";

// Helper to look up a BS line item value by account name
function bsVal(account: string, yearIdx: number): number {
  return bsLineItems.find((i) => i.account === account)!.values[yearIdx];
}

// Depreciation from P&L
const depreciation = pnlLineItems.find(
  (i) => i.account === "Depreciation Expense"
)!.values;

// Compute cash flow bridge for a given year (yearIdx: 1=2024, 2=2025)
function computeCashFlow(yearIdx: number) {
  const prevIdx = yearIdx - 1;

  const startingCash = bsVal("Total Current Assets", prevIdx);
  const endingCash = bsVal("Total Current Assets", yearIdx);
  const netIncome = yearlyData[yearIdx].netIncome;
  const dep = depreciation[yearIdx];

  // Working capital changes (change in current liabilities)
  const wcItems = [
    {
      label: "Accounts Payable",
      value: bsVal("Accounts Payable", yearIdx) - bsVal("Accounts Payable", prevIdx),
    },
    {
      label: "GST/HST Payable",
      value: bsVal("GST/HST Payable", yearIdx) - bsVal("GST/HST Payable", prevIdx),
    },
    {
      label: "Income Tax",
      value: bsVal("Income Tax Payable", yearIdx) - bsVal("Income Tax Payable", prevIdx),
    },
    {
      label: "Payroll Liabilities",
      value: bsVal("Payroll Liabilities", yearIdx) - bsVal("Payroll Liabilities", prevIdx),
    },
    {
      label: "Shareholder Distributions",
      value:
        bsVal("Shareholder Distributions", yearIdx) -
        bsVal("Shareholder Distributions", prevIdx),
    },
  ];
  const wcTotal = wcItems.reduce((sum, item) => sum + item.value, 0);
  const operatingCash = netIncome + dep + wcTotal;

  // Financing activities
  const loanChange =
    bsVal("Long Term Loan", yearIdx) - bsVal("Long Term Loan", prevIdx);
  const dividends =
    bsVal("Dividends Paid", yearIdx) - bsVal("Dividends Paid", prevIdx);
  const financingCash = loanChange + dividends;

  return {
    startingCash,
    endingCash,
    netIncome,
    depreciation: dep,
    wcItems,
    wcTotal,
    operatingCash,
    loanChange,
    dividends,
    financingCash,
    netCashChange: operatingCash + financingCash,
  };
}

const cf2024 = computeCashFlow(1);
const cf2025 = computeCashFlow(2);

// Build waterfall chart data
function buildWaterfall(cf: ReturnType<typeof computeCashFlow>) {
  const items: {
    name: string;
    base: number;
    value: number;
    displayValue: number;
    isTotal?: boolean;
  }[] = [];

  let running = Math.round(cf.startingCash);
  items.push({
    name: "Starting Cash",
    base: 0,
    value: running,
    displayValue: running,
    isTotal: true,
  });

  // Net Income
  const ni = Math.round(cf.netIncome);
  if (ni >= 0) {
    items.push({ name: "Net Income", base: running, value: ni, displayValue: ni });
  } else {
    items.push({ name: "Net Income", base: running + ni, value: -ni, displayValue: ni });
  }
  running += ni;

  // Depreciation
  const dep = Math.round(cf.depreciation);
  items.push({ name: "Depreciation", base: running, value: dep, displayValue: dep });
  running += dep;

  // Working Capital (net)
  const wc = Math.round(cf.wcTotal);
  if (wc >= 0) {
    items.push({ name: "Working Capital", base: running, value: wc, displayValue: wc });
  } else {
    items.push({ name: "Working Capital", base: running + wc, value: -wc, displayValue: wc });
  }
  running += wc;

  // Loan (if non-zero)
  const loan = Math.round(cf.loanChange);
  if (loan !== 0) {
    if (loan >= 0) {
      items.push({ name: "Loan Proceeds", base: running, value: loan, displayValue: loan });
    } else {
      items.push({ name: "Loan Repayment", base: running + loan, value: -loan, displayValue: loan });
    }
    running += loan;
  }

  // Dividends (if non-zero)
  const div = Math.round(cf.dividends);
  if (div !== 0) {
    if (div >= 0) {
      items.push({ name: "Dividends", base: running, value: div, displayValue: div });
    } else {
      items.push({ name: "Dividends Paid", base: running + div, value: -div, displayValue: div });
    }
    running += div;
  }

  // Ending cash
  items.push({
    name: "Ending Cash",
    base: 0,
    value: running,
    displayValue: running,
    isTotal: true,
  });

  return items;
}

// Custom tooltip for waterfall
function WaterfallTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; displayValue: number; isTotal?: boolean } }> }) {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;
  return (
    <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-slate-200 text-sm">
      <p className="font-medium text-slate-700">{item.name}</p>
      <p
        className={cn(
          "font-bold tabular-nums",
          item.isTotal
            ? "text-slate-900"
            : item.displayValue >= 0
            ? "text-green-600"
            : "text-red-600"
        )}
      >
        {item.isTotal ? "" : item.displayValue >= 0 ? "+" : ""}
        {formatCurrency(item.displayValue)}
      </p>
    </div>
  );
}

export default function CashFlowPage() {
  const [selectedYear, setSelectedYear] = useState<2024 | 2025>(2025);
  const cf = selectedYear === 2024 ? cf2024 : cf2025;
  const waterfallData = buildWaterfall(cf);

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Section 1: Header */}
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Where the Money Actually Went
        </h1>
        <div className="h-1 w-16 bg-gradient-to-r from-teal to-teal-dark rounded-full mt-2 mb-3" />
        <p className="text-sm font-medium bg-gradient-to-r from-teal to-teal-dark bg-clip-text text-transparent">
          Connecting your P&amp;L profit to the actual change in your bank account.
        </p>
      </div>

      {/* Section 2: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={cn("p-5 rounded-xl border", cf.operatingCash >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200")}>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Cash from Operations
          </p>
          <p className={cn("text-2xl font-black mt-1 tabular-nums", cf.operatingCash >= 0 ? "text-green-700" : "text-red-700")}>
            {cf.operatingCash >= 0 ? "+" : ""}
            {formatCurrency(Math.round(cf.operatingCash))}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Net income + depreciation + working capital changes
          </p>
        </div>
        <div className={cn("p-5 rounded-xl border", cf.financingCash >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200")}>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Cash from Financing
          </p>
          <p className={cn("text-2xl font-black mt-1 tabular-nums", cf.financingCash >= 0 ? "text-green-700" : "text-red-700")}>
            {cf.financingCash >= 0 ? "+" : ""}
            {formatCurrency(Math.round(cf.financingCash))}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {selectedYear === 2024 ? "Loan repayment" : "Dividends paid to owner"}
          </p>
        </div>
        <div className="p-5 rounded-xl border bg-red-50 border-red-200">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Net Cash Change
          </p>
          <p className="text-2xl font-black text-red-700 mt-1 tabular-nums">
            {formatCurrency(Math.round(cf.netCashChange))}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {formatCurrency(Math.round(cf.startingCash))} &rarr;{" "}
            {formatCurrency(Math.round(cf.endingCash))}
          </p>
        </div>
      </div>

      {/* Section 3: Waterfall Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Cash Flow Waterfall
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              How {selectedYear} net income became a {formatCurrency(Math.round(cf.netCashChange))} cash change.
            </p>
          </div>
          {/* Year toggle */}
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            {([2024, 2025] as const).map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                  selectedYear === yr
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={340}>
          <BarChart
            data={waterfallData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={11}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<WaterfallTooltip />} />
            <Bar dataKey="base" stackId="a" fill="transparent" radius={0} />
            <Bar dataKey="value" stackId="a" radius={[4, 4, 0, 0]}>
              {waterfallData.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={
                    entry.isTotal
                      ? "#2EC4B6"
                      : entry.displayValue >= 0
                      ? "#22C55E"
                      : "#FF6B6B"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* The gap explanation */}
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            {selectedYear === 2025 ? (
              <>
                <strong>P&amp;L said you lost $7.4K. But cash dropped $19.4K.</strong> The
                extra $12K gap: depreciation added back $1.3K (non-cash expense), working
                capital changes saved $1.7K (more owed to CRA/payroll), but the $15K
                dividend drained cash the business needed to survive.
              </>
            ) : (
              <>
                <strong>P&amp;L said you earned $7.6K. But cash dropped $32.9K.</strong> Operations
                actually generated $13.1K in cash (profit + depreciation + deferred
                liabilities). But the $46K loan repayment consumed it all — a one-time
                hit that eliminated the long-term debt.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Section 4: Detailed Cash Flow Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          The Full Cash Flow Breakdown
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Every line item, derived from your real P&amp;L and Balance Sheet data.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-600">
                  Item
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">
                  2024
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">
                  2025
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Operating Activities */}
              <tr className="bg-slate-50/70 border-b border-slate-200">
                <td colSpan={3} className="py-2.5 px-4 font-bold text-slate-900 border-l-4 border-l-teal">
                  Cash from Operating Activities
                </td>
              </tr>
              {[
                { label: "Net Income", v24: cf2024.netIncome, v25: cf2025.netIncome },
                { label: "Add: Depreciation", v24: cf2024.depreciation, v25: cf2025.depreciation },
              ].map((row) => (
                <tr key={row.label} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 pl-10 text-slate-600 font-medium">
                    <span className="text-slate-300 mr-1">&mdash;</span>
                    {row.label}
                  </td>
                  <td className={cn("py-2.5 px-4 text-right tabular-nums", row.v24 < 0 && "text-red-600")}>
                    {formatCurrency(Math.round(row.v24))}
                  </td>
                  <td className={cn("py-2.5 px-4 text-right tabular-nums", row.v25 < 0 && "text-red-600")}>
                    {formatCurrency(Math.round(row.v25))}
                  </td>
                </tr>
              ))}

              {/* Working capital sub-header */}
              <tr className="border-b border-slate-100">
                <td className="py-2 px-4 pl-10 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  Working Capital Changes
                </td>
                <td></td>
                <td></td>
              </tr>
              {cf2025.wcItems.map((item, i) => (
                <tr key={item.label} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-2 px-4 pl-14 text-slate-500 text-xs font-medium">
                    {item.label}
                  </td>
                  <td className={cn("py-2 px-4 text-right tabular-nums text-xs", cf2024.wcItems[i].value < 0 && "text-red-600")}>
                    {cf2024.wcItems[i].value >= 0 ? "+" : ""}
                    {formatCurrency(Math.round(cf2024.wcItems[i].value))}
                  </td>
                  <td className={cn("py-2 px-4 text-right tabular-nums text-xs", item.value < 0 && "text-red-600")}>
                    {item.value >= 0 ? "+" : ""}
                    {formatCurrency(Math.round(item.value))}
                  </td>
                </tr>
              ))}

              {/* Operating subtotal */}
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <td className="py-2.5 px-4 font-bold text-slate-900">
                  Total Operating Cash Flow
                </td>
                <td className={cn("py-2.5 px-4 text-right tabular-nums font-bold", cf2024.operatingCash < 0 ? "text-red-600" : "text-green-600")}>
                  {cf2024.operatingCash >= 0 ? "+" : ""}
                  {formatCurrency(Math.round(cf2024.operatingCash))}
                </td>
                <td className={cn("py-2.5 px-4 text-right tabular-nums font-bold", cf2025.operatingCash < 0 ? "text-red-600" : "text-green-600")}>
                  {cf2025.operatingCash >= 0 ? "+" : ""}
                  {formatCurrency(Math.round(cf2025.operatingCash))}
                </td>
              </tr>

              {/* Financing Activities */}
              <tr className="bg-slate-50/70 border-b border-slate-200">
                <td colSpan={3} className="py-2.5 px-4 font-bold text-slate-900 border-l-4 border-l-coral">
                  Cash from Financing Activities
                </td>
              </tr>
              {[
                { label: "Loan Repayment", v24: cf2024.loanChange, v25: cf2025.loanChange },
                { label: "Dividends Paid", v24: cf2024.dividends, v25: cf2025.dividends },
              ].map((row) => (
                <tr key={row.label} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 pl-10 text-slate-600 font-medium">
                    <span className="text-slate-300 mr-1">&mdash;</span>
                    {row.label}
                  </td>
                  <td className={cn("py-2.5 px-4 text-right tabular-nums", row.v24 < 0 && "text-red-600")}>
                    {formatCurrency(Math.round(row.v24))}
                  </td>
                  <td className={cn("py-2.5 px-4 text-right tabular-nums", row.v25 < 0 && "text-red-600")}>
                    {formatCurrency(Math.round(row.v25))}
                  </td>
                </tr>
              ))}

              {/* Financing subtotal */}
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <td className="py-2.5 px-4 font-bold text-slate-900">
                  Total Financing Cash Flow
                </td>
                <td className={cn("py-2.5 px-4 text-right tabular-nums font-bold", cf2024.financingCash < 0 ? "text-red-600" : "text-green-600")}>
                  {formatCurrency(Math.round(cf2024.financingCash))}
                </td>
                <td className={cn("py-2.5 px-4 text-right tabular-nums font-bold", cf2025.financingCash < 0 ? "text-red-600" : "text-green-600")}>
                  {formatCurrency(Math.round(cf2025.financingCash))}
                </td>
              </tr>

              {/* Net change */}
              <tr className="border-t-2 border-t-slate-300 bg-slate-100/80">
                <td className="py-3 px-4 font-black text-slate-900">
                  Net Cash Change
                </td>
                <td className="py-3 px-4 text-right tabular-nums font-black text-red-600">
                  {formatCurrency(Math.round(cf2024.netCashChange))}
                </td>
                <td className="py-3 px-4 text-right tabular-nums font-black text-red-600">
                  {formatCurrency(Math.round(cf2025.netCashChange))}
                </td>
              </tr>

              {/* Starting / ending */}
              <tr className="border-b border-slate-100">
                <td className="py-2.5 px-4 text-slate-500 font-medium">Starting Cash</td>
                <td className="py-2.5 px-4 text-right tabular-nums text-slate-500">
                  {formatCurrency(Math.round(cf2024.startingCash))}
                </td>
                <td className="py-2.5 px-4 text-right tabular-nums text-slate-500">
                  {formatCurrency(Math.round(cf2025.startingCash))}
                </td>
              </tr>
              <tr className="border-b-2 border-slate-300">
                <td className="py-2.5 px-4 font-bold text-slate-900">Ending Cash</td>
                <td className="py-2.5 px-4 text-right tabular-nums font-bold text-slate-900">
                  {formatCurrency(Math.round(cf2024.endingCash))}
                </td>
                <td className="py-2.5 px-4 text-right tabular-nums font-bold text-slate-900">
                  {formatCurrency(Math.round(cf2025.endingCash))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 5: Key Insight */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          The Big Picture
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Two years, two different stories — same outcome.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border bg-amber-50 border-amber-200">
            <p className="text-sm font-bold text-amber-800">2024: You were profitable but cash-drained</p>
            <p className="text-xs text-amber-700 mt-1">
              Operations generated +{formatCurrency(Math.round(cf2024.operatingCash))} in
              cash &mdash; the business was self-sustaining. But the $46K loan repayment consumed
              all of it and then some. That was actually a <em>good</em> use of cash: you eliminated
              the debt permanently.
            </p>
          </div>
          <div className="p-4 rounded-xl border bg-red-50 border-red-200">
            <p className="text-sm font-bold text-red-800">2025: Losing money and paying it out</p>
            <p className="text-xs text-red-700 mt-1">
              Operations <em>consumed</em> {formatCurrency(Math.round(Math.abs(cf2025.operatingCash)))} in
              cash &mdash; the business can no longer fund itself. On top of that, $15K went
              out as dividends. Your bank account dropped to $39K and the clock
              is ticking.
            </p>
          </div>
        </div>
      </div>

      {/* Section 6: Footer */}
      <div className="text-xs text-slate-400 text-center pb-4">
        <p>
          Derived from your QuickBooks P&amp;L and Balance Sheet (Dec 31 each year).
          All values in CAD. This is a simplified cash flow statement &mdash;
          no investing activities are shown since there were no asset purchases in 2024 or 2025.
        </p>
      </div>
    </div>
  );
}
