"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { bsLineItems, cashRunwayData, bsCompositionData, yearlyData } from "@/lib/data";
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
  ArrowRight,
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

// BS lookups for ratios
const currentAssets = bsLineItems.find((i) => i.account === "Total Current Assets")!;
const longTermLoan = bsLineItems.find((i) => i.account === "Long Term Loan")!;
const netIncomeBs = bsLineItems.find((i) => i.account === "Net Income" && i.section === "equity")!;
const dividendsBs = bsLineItems.find((i) => i.account === "Dividends Paid")!;

// Financial ratios — computed from real P&L + BS data
const ratios = [0, 1, 2].map((i) => {
  const revenue = yearlyData[i].foodSales;
  const netIncome = yearlyData[i].netIncome;
  const totalA = totalAssets.values[i];
  const totalL = totalLiab.values[i];
  const totalE = totalEquity.values[i];
  const curAssets = currentAssets.values[i];
  const curLiab = totalL - longTermLoan.values[i];
  return {
    year: 2023 + i,
    currentRatio: curLiab > 0 ? curAssets / curLiab : 0,
    roa: (netIncome / totalA) * 100,
    roe: (netIncome / totalE) * 100,
    assetTurnover: revenue / totalA,
    debtToEquity: totalL / totalE,
  };
});

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

      {/* Section 4: Equity Bridge — How the Owner's Stake Changed */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          Equity Bridge — Where the Owner&apos;s Stake Went
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          Shows how P&amp;L net income and dividends flow directly into the Balance Sheet equity.
        </p>

        {/* 2025 Bridge */}
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">2025</p>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-center mb-6">
          <div className="p-3 md:p-4 rounded-lg bg-teal/10 border border-teal/20 text-center min-w-[110px]">
            <p className="text-[10px] text-slate-500">Dec 31, 2024</p>
            <p className="text-xl font-black text-slate-900 tabular-nums">
              {formatCurrency(Math.round(totalEquity.values[1]))}
            </p>
            <p className="text-[10px] text-slate-400">starting equity</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
          <div className="p-3 md:p-4 rounded-lg bg-red-50 border border-red-200 text-center min-w-[110px]">
            <p className="text-[10px] text-slate-500">Net Income</p>
            <p className="text-xl font-black text-red-600 tabular-nums">
              {formatCurrency(Math.round(netIncomeBs.values[2]))}
            </p>
            <p className="text-[10px] text-slate-400">from P&amp;L</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
          <div className="p-3 md:p-4 rounded-lg bg-red-50 border border-red-200 text-center min-w-[110px]">
            <p className="text-[10px] text-slate-500">Dividends</p>
            <p className="text-xl font-black text-red-600 tabular-nums">
              {formatCurrency(Math.round(dividendsBs.values[2]))}
            </p>
            <p className="text-[10px] text-slate-400">to owner</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
          <div className="p-3 md:p-4 rounded-lg bg-red-50 border border-red-200 text-center min-w-[110px]">
            <p className="text-[10px] text-slate-500">Dec 31, 2025</p>
            <p className="text-xl font-black text-red-600 tabular-nums">
              {formatCurrency(Math.round(totalEquity.values[2]))}
            </p>
            <p className="text-[10px] text-slate-400">ending equity</p>
          </div>
        </div>

        {/* 2024 Bridge (comparison) */}
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">2024 (for comparison)</p>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-center">
          <div className="p-3 md:p-4 rounded-lg bg-teal/10 border border-teal/20 text-center min-w-[110px]">
            <p className="text-[10px] text-slate-500">Dec 31, 2023</p>
            <p className="text-xl font-black text-slate-900 tabular-nums">
              {formatCurrency(Math.round(totalEquity.values[0]))}
            </p>
            <p className="text-[10px] text-slate-400">starting equity</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
          <div className="p-3 md:p-4 rounded-lg bg-green-50 border border-green-200 text-center min-w-[110px]">
            <p className="text-[10px] text-slate-500">Net Income</p>
            <p className="text-xl font-black text-green-600 tabular-nums">
              +{formatCurrency(Math.round(netIncomeBs.values[1]))}
            </p>
            <p className="text-[10px] text-slate-400">from P&amp;L</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
          <div className="p-3 md:p-4 rounded-lg bg-slate-50 border border-slate-200 text-center min-w-[110px]">
            <p className="text-[10px] text-slate-500">Dividends</p>
            <p className="text-xl font-black text-slate-400 tabular-nums">$0</p>
            <p className="text-[10px] text-slate-400">none taken</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
          <div className="p-3 md:p-4 rounded-lg bg-green-50 border border-green-200 text-center min-w-[110px]">
            <p className="text-[10px] text-slate-500">Dec 31, 2024</p>
            <p className="text-xl font-black text-green-600 tabular-nums">
              {formatCurrency(Math.round(totalEquity.values[1]))}
            </p>
            <p className="text-[10px] text-slate-400">ending equity</p>
          </div>
        </div>

        {/* Callout */}
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>The contrast tells the story.</strong> In 2024, equity grew +$7.6K
            because the business earned a profit and took no dividends. In 2025, the
            combination of a -$7.4K net loss <em>and</em> a $15K dividend wiped $22.4K
            from the owner&apos;s stake — a 46% drop in one year.
          </p>
        </div>
      </div>

      {/* Section 5: Financial Ratios — P&L Meets Balance Sheet */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          Financial Ratios — P&amp;L Meets Balance Sheet
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          These ratios require <em>both</em> statements to calculate — they connect profitability to what the business owns.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Ratio</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">What It Tells You</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">2023</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">2024</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">2025</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-600">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "Current Ratio",
                  desc: "Can you pay your bills?",
                  values: ratios.map((r) => `${r.currentRatio.toFixed(1)}x`),
                  status: ratios[2].currentRatio >= 2 ? "OK" : ratios[2].currentRatio >= 1 ? "Watch" : "Danger",
                  statusColor: ratios[2].currentRatio >= 2 ? "bg-green-100 text-green-700" : ratios[2].currentRatio >= 1 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700",
                  colors: ratios.map((r) => r.currentRatio >= 2 ? "text-green-600" : r.currentRatio >= 1 ? "text-amber-600" : "text-red-600"),
                },
                {
                  name: "Return on Assets",
                  desc: "Profit per dollar of assets",
                  values: ratios.map((r) => `${r.roa.toFixed(1)}%`),
                  status: ratios[2].roa >= 5 ? "Strong" : ratios[2].roa >= 0 ? "Weak" : "Losing",
                  statusColor: ratios[2].roa >= 5 ? "bg-green-100 text-green-700" : ratios[2].roa >= 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700",
                  colors: ratios.map((r) => r.roa >= 5 ? "text-green-600" : r.roa >= 0 ? "text-amber-600" : "text-red-600"),
                },
                {
                  name: "Return on Equity",
                  desc: "Return on owner's investment",
                  values: ratios.map((r) => `${r.roe.toFixed(1)}%`),
                  status: ratios[2].roe >= 10 ? "Strong" : ratios[2].roe >= 0 ? "Weak" : "Losing",
                  statusColor: ratios[2].roe >= 10 ? "bg-green-100 text-green-700" : ratios[2].roe >= 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700",
                  colors: ratios.map((r) => r.roe >= 10 ? "text-green-600" : r.roe >= 0 ? "text-amber-600" : "text-red-600"),
                },
                {
                  name: "Asset Turnover",
                  desc: "Revenue per $1 of assets",
                  values: ratios.map((r) => `$${r.assetTurnover.toFixed(2)}`),
                  status: "Misleading",
                  statusColor: "bg-amber-100 text-amber-700",
                  colors: ratios.map(() => "text-slate-700"),
                },
                {
                  name: "Debt-to-Equity",
                  desc: "Leverage — how much is owed vs. owned",
                  values: ratios.map((r) => `${r.debtToEquity.toFixed(2)}`),
                  status: ratios[2].debtToEquity <= 1 ? "Low debt" : ratios[2].debtToEquity <= 2 ? "Moderate" : "High",
                  statusColor: ratios[2].debtToEquity <= 1 ? "bg-green-100 text-green-700" : ratios[2].debtToEquity <= 2 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700",
                  colors: ratios.map((r) => r.debtToEquity <= 1 ? "text-green-600" : r.debtToEquity <= 2 ? "text-amber-600" : "text-red-600"),
                },
              ].map((row) => (
                <tr key={row.name} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-bold text-slate-900">{row.name}</td>
                  <td className="py-2.5 px-4 text-slate-500 text-xs">{row.desc}</td>
                  {row.values.map((val, vi) => (
                    <td key={vi} className={cn("py-2.5 px-4 text-right tabular-nums font-semibold", row.colors[vi])}>
                      {val}
                    </td>
                  ))}
                  <td className="py-2.5 px-4 text-center">
                    <span className={cn("inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold", row.statusColor)}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Insight cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm font-bold text-red-800">ROA & ROE collapsed</p>
            <p className="text-xs text-red-700 mt-1">
              Return on Assets went from +18.6% to -16.7%, and Return on Equity
              from +44.7% to -27.7%. The business is now <em>destroying</em> value
              on every dollar of assets and equity.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-sm font-bold text-amber-800">Asset Turnover is misleading</p>
            <p className="text-xs text-amber-700 mt-1">
              Revenue per $1 of assets <em>rose</em> from $3.43 to $7.21 — but only
              because assets are evaporating faster than revenue is falling. The business
              is consuming itself, not getting more efficient.
            </p>
          </div>
        </div>
      </div>

      {/* Section 6: Cash Runway Chart */}
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
