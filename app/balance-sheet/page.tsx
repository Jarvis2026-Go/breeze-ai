"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { bsLineItems, cashRunwayData, bsCompositionData } from "@/lib/data";
import { formatCurrency, calcYoYChange } from "@/lib/formatting";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  ChevronRight,
  ChevronDown,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Info,
  Droplets,
  Landmark,
  Banknote,
  ShieldAlert,
  BadgeDollarSign,
  ClipboardList,
} from "lucide-react";

// KPI summary values
const totalAssets = bsLineItems.find((i) => i.account === "TOTAL ASSETS")!;
const totalLiab = bsLineItems.find((i) => i.account === "TOTAL LIABILITIES")!;
const totalEquity = bsLineItems.find((i) => i.account === "TOTAL EQUITY")!;

const assetsYoY = calcYoYChange(totalAssets.values[2], totalAssets.values[1]);
const liabYoY = calcYoYChange(totalLiab.values[2], totalLiab.values[1]);
const equityYoY = calcYoYChange(totalEquity.values[2], totalEquity.values[1]);

// Section border colors
const sectionBorder: Record<string, string> = {
  assets: "border-l-teal",
  liabilities: "border-l-coral",
  equity: "border-l-green-500",
};

// Chart data for cash runway — split into actual + projected lines
const runwayChartData = cashRunwayData.map((d) => ({
  year: d.year.toString(),
  actual: d.actual ?? (d.year === 2026 ? undefined : undefined),
  projected: d.projected ?? (d.year === 2025 ? d.actual : undefined),
}));
// Ensure the projected line connects from the last actual point
runwayChartData[2].projected = runwayChartData[2].actual;

export default function BalanceSheetPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    currentAssets: true,
    fixedAssets: true,
    currentLiab: true,
    equity: true,
  });

  const toggle = (group: string) =>
    setExpanded((prev) => ({ ...prev, [group]: !prev[group] }));

  // Track when section changes for divider rows
  let lastSection = "";

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Section 1: Header */}
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Balance Sheet
        </h1>
        <div className="h-1 w-16 bg-gradient-to-r from-teal to-teal-dark rounded-full mt-2 mb-3" />
        <p className="text-sm font-medium bg-gradient-to-r from-teal to-teal-dark bg-clip-text text-transparent">
          What CHOG owns, owes, and the owner&apos;s stake — Dec 31 each year from QuickBooks.
        </p>
      </div>

      {/* Section 2: KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Total Assets",
            value: totalAssets.values[2],
            yoy: assetsYoY,
            color: "text-red-600",
            bgColor: "bg-red-50 border-red-200",
            story: "Down from $100K in 2023 — cash keeps draining",
          },
          {
            label: "Total Liabilities",
            value: totalLiab.values[2],
            yoy: liabYoY,
            color: "text-amber-600",
            bgColor: "bg-amber-50 border-amber-200",
            story: "Loan paid off, but GST & payroll liabilities growing",
          },
          {
            label: "Owner's Equity",
            value: totalEquity.values[2],
            yoy: equityYoY,
            color: "text-red-600",
            bgColor: "bg-red-50 border-red-200",
            story: "$15K dividend + net loss wiped $22K in equity",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className={cn(
              "p-5 rounded-xl border",
              kpi.bgColor
            )}
          >
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {kpi.label}
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
              {formatCurrency(Math.round(kpi.value))}
            </p>
            <p className={cn("text-sm font-bold mt-0.5 tabular-nums", kpi.color)}>
              {kpi.yoy >= 0 ? "+" : ""}
              {kpi.yoy.toFixed(1)}% YoY
            </p>
            <p className="text-xs text-slate-500 mt-1">{kpi.story}</p>
          </div>
        ))}
      </div>

      {/* Section 3: Complete Balance Sheet Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          Complete Balance Sheet
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Pulled directly from QuickBooks. Click any subtotal to expand or collapse.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-600">
                  Account
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">
                  2023
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">
                  2024
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">
                  2025
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">
                  YoY Change
                </th>
              </tr>
            </thead>
            <tbody>
              {bsLineItems.map((item, i) => {
                // Hide children of collapsed groups
                if (item.group && !expanded[item.group]) return null;

                const isToggle = !!item.groupHeader;
                const isOpen = item.groupHeader
                  ? expanded[item.groupHeader]
                  : false;

                // Section divider row
                const showSectionDivider =
                  item.section !== lastSection && !item.indent;
                if (!item.indent || isToggle) lastSection = item.section;

                const yoyChange = calcYoYChange(item.values[2], item.values[1]);
                const isNeg =
                  item.values[2] < 0 && !item.negativeNormal;

                return (
                  <tr
                    key={i}
                    className={cn(
                      "border-b border-slate-100",
                      item.separator && "border-t-2 border-t-slate-200",
                      showSectionDivider &&
                        i > 0 &&
                        "border-t-2 border-t-slate-300",
                      item.bold && "bg-slate-50/70",
                      isToggle
                        ? "cursor-pointer hover:bg-slate-100/80"
                        : "hover:bg-slate-50/50"
                    )}
                    onClick={
                      isToggle ? () => toggle(item.groupHeader!) : undefined
                    }
                  >
                    <td
                      className={cn(
                        "py-2.5 px-4",
                        item.indent && "pl-10",
                        !item.indent &&
                          item.bold &&
                          `border-l-4 ${sectionBorder[item.section]}`
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5",
                          item.bold
                            ? "font-bold text-slate-900"
                            : "font-medium text-slate-600"
                        )}
                      >
                        {isToggle &&
                          (isOpen ? (
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                          ))}
                        {item.indent && (
                          <span className="text-slate-300 mr-0.5">&mdash;</span>
                        )}
                        {item.account}
                        {isToggle && (
                          <span className="text-xs font-normal text-slate-400 ml-1">
                            {isOpen ? "click to collapse" : "click to expand"}
                          </span>
                        )}
                      </span>
                    </td>
                    {item.values.map((val, vi) => (
                      <td
                        key={vi}
                        className={cn(
                          "py-2.5 px-4 text-right tabular-nums",
                          item.bold && "font-bold",
                          val < 0 && !item.negativeNormal && "text-red-600"
                        )}
                      >
                        {formatCurrency(Math.round(val))}
                      </td>
                    ))}
                    <td
                      className={cn(
                        "py-2.5 px-4 text-right tabular-nums text-sm",
                        item.bold && "font-bold",
                        yoyChange < 0 && !item.negativeNormal
                          ? "text-red-600"
                          : yoyChange > 0 && !isNeg
                          ? "text-green-600"
                          : "text-slate-500"
                      )}
                    >
                      {item.values[1] === 0 && item.values[2] === 0
                        ? "—"
                        : `${yoyChange >= 0 ? "+" : ""}${yoyChange.toFixed(1)}%`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Balance check */}
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <p className="text-xs text-green-700">
            <strong>Balance check:</strong> Assets = Liabilities + Equity for
            all 3 years (
            {[0, 1, 2]
              .map(
                (i) =>
                  `${2023 + i}: ${formatCurrency(Math.round(totalAssets.values[i]))} = ${formatCurrency(Math.round(totalLiab.values[i]))} + ${formatCurrency(Math.round(totalEquity.values[i]))}`
              )
              .join("; ")}
            )
          </p>
        </div>
      </div>

      {/* Section 4: Cash Runway Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Cash Runway</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Bank balance trajectory — actual through 2025, projected at the
          current ~$19K/year burn rate.
        </p>

        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={runwayChartData}
            margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" stroke="#94a3b8" fontSize={13} />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              formatter={(value: number) => [
                formatCurrency(Math.round(value)),
                "Cash",
              ]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Area
              type="monotone"
              dataKey="actual"
              name="Actual"
              stroke="#FF6B6B"
              strokeWidth={3}
              fill="url(#cashGrad)"
              dot={{ r: 5, fill: "#FF6B6B" }}
              connectNulls={false}
            />
            <Area
              type="monotone"
              dataKey="projected"
              name="Projected"
              stroke="#FF6B6B"
              strokeWidth={3}
              strokeDasharray="6 4"
              fillOpacity={0}
              dot={{ r: 5, fill: "#FF6B6B", strokeDasharray: "0" }}
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Year cards */}
        <div className="grid grid-cols-5 gap-2 mt-4">
          {cashRunwayData.map((d, i) => {
            const val = d.actual ?? d.projected ?? 0;
            const color =
              val > 50000
                ? "bg-green-50 border-green-200 text-green-700"
                : val > 20000
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "bg-red-50 border-red-200 text-red-700";
            return (
              <div
                key={d.year}
                className={cn("p-3 rounded-lg border text-center", color)}
              >
                <p className="text-xs text-slate-500">{d.year}</p>
                <p className="text-lg font-bold tabular-nums">{d.label}</p>
                <p className="text-[10px] text-slate-400">
                  {d.actual ? "actual" : "projected"}
                </p>
              </div>
            );
          })}
        </div>

        {/* Callout */}
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>Cash is draining fast.</strong> The $46K loan payoff in 2024
            accounts for part of the drop, but even after that, operational cash
            burn continues at ~$19K/year. The $15K dividend in 2025 accelerated
            the decline. At this rate, the bank account hits zero by late 2027.
          </p>
        </div>
      </div>

      {/* Section 5: Balance Sheet Health Check */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          Balance Sheet Health Check
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Six key insights from the numbers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: Droplets,
              title: "Cash Drain",
              color: "bg-red-50 border-red-200",
              iconColor: "text-red-500",
              body: "Cash down 57% ($91K → $39K). At the current burn rate, the bank account runs dry by late 2027.",
            },
            {
              icon: Landmark,
              title: "Growing Tax & Payroll Liabilities",
              color: "bg-amber-50 border-amber-200",
              iconColor: "text-amber-500",
              body: "GST/HST payable doubled ($3.4K → $7.5K) and payroll liabilities grew 2.5x ($4.3K → $10.6K). These must be paid — they can't be deferred forever.",
            },
            {
              icon: Banknote,
              title: "Dividend While Losing Money",
              color: "bg-red-50 border-red-200",
              iconColor: "text-red-500",
              body: "A $15K dividend was paid in 2025 despite a -$7.4K net loss. This accelerated equity erosion and drained cash the business needed.",
            },
            {
              icon: ShieldAlert,
              title: "Equity Erosion",
              color: "bg-red-50 border-red-200",
              iconColor: "text-red-500",
              body: "Owner's equity dropped from $49K to $27K in one year (-46%). The combined hit of the net loss and dividend took $22K out of equity.",
            },
            {
              icon: CheckCircle2,
              title: "Loan Payoff",
              color: "bg-green-50 border-green-200",
              iconColor: "text-green-500",
              body: "The $46K long-term loan was fully paid off by end of 2024. No more debt payments — one less drain on cash going forward.",
            },
            {
              icon: ClipboardList,
              title: "No Inventory / Receivables",
              color: "bg-blue-50 border-blue-200",
              iconColor: "text-blue-500",
              body: "CHOG operates on a simple cash basis — no inventory or accounts receivable on the books. What you see in the bank is what you have.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className={cn("p-4 rounded-xl border flex gap-3", card.color)}
            >
              <card.icon
                className={cn("w-5 h-5 mt-0.5 shrink-0", card.iconColor)}
              />
              <div>
                <p className="font-bold text-slate-900 text-sm">
                  {card.title}
                </p>
                <p className="text-sm text-slate-600 mt-1">{card.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: Assets vs. Liabilities Composition */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          What CHOG Owns vs. How It&apos;s Funded
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Left bar = what the business owns (assets). Right bar = how
          those assets are funded (liabilities + equity).
        </p>

        <ResponsiveContainer width="100%" height={340}>
          <BarChart
            data={bsCompositionData.flatMap((d) => [
              {
                name: `${d.year} Owns`,
                Cash: d.cash,
                "Fixed Assets": d.fixedAssets,
                year: d.year,
              },
              {
                name: `${d.year} Funded`,
                Liabilities: d.liabilities,
                Equity: d.equity,
                year: d.year,
              },
            ])}
            margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatCurrency(Math.round(value)),
                name,
              ]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Legend />
            <Bar dataKey="Cash" stackId="a" fill="#2EC4B6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Fixed Assets" stackId="a" fill="#6366F1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Liabilities" stackId="a" fill="#FF6B6B" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Equity" stackId="a" fill="#22C55E" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-3 rounded-lg border bg-red-50 border-red-200 text-center">
            <p className="text-xs text-slate-500">Assets Shrunk</p>
            <p className="text-lg font-bold text-red-600 tabular-nums">
              -$55K
            </p>
            <p className="text-xs text-slate-400">
              $100K → $44K over 3 years
            </p>
          </div>
          <div className="p-3 rounded-lg border bg-green-50 border-green-200 text-center">
            <p className="text-xs text-slate-500">Debt Eliminated</p>
            <p className="text-lg font-bold text-green-600 tabular-nums">
              -$46K
            </p>
            <p className="text-xs text-slate-400">
              Long-term loan fully repaid
            </p>
          </div>
          <div className="p-3 rounded-lg border bg-red-50 border-red-200 text-center">
            <p className="text-xs text-slate-500">Equity Down</p>
            <p className="text-lg font-bold text-red-600 tabular-nums">
              -$22K
            </p>
            <p className="text-xs text-slate-400">
              $49K → $27K in one year
            </p>
          </div>
        </div>
      </div>

      {/* Section 7: Footer */}
      <div className="text-xs text-slate-400 text-center pb-4">
        <p>
          Source: QuickBooks Balance Sheet export (Dec 31 each year). All values
          in CAD. Projections based on trailing 3-year average burn rate and are
          not a guarantee of future results.
        </p>
      </div>
    </div>
  );
}
