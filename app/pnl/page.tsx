"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { yearlyData, pnlLineItems, benchmarkSources, primeCostData } from "@/lib/data";
import { formatCurrency } from "@/lib/formatting";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { ChevronRight, ChevronDown, AlertTriangle } from "lucide-react";

const revenue2025 = pnlLineItems[0].values[2]; // Food Sales 2025 — exact from books

// Parse industry range from string like "30-35%" → { lo, hi }
function parseRange(s: string): { lo: number; hi: number } | null {
  const cleaned = s.replace(/[~%]/g, "");
  let lo: number, hi: number;
  if (cleaned.includes("-")) {
    [lo, hi] = cleaned.split("-").map(Number);
  } else {
    lo = hi = Number(cleaned);
  }
  if (isNaN(lo) || isNaN(hi)) return null;
  return { lo, hi };
}

function getStatus(item: typeof pnlLineItems[number]): { label: string; color: string } | null {
  if (!item.industryPctMedian || item.industryPctMedian === "N/A" || item.industryPctMedian === "100%") return null;

  const pctOfSales = (item.values[2] / revenue2025) * 100;
  const range = parseRange(item.industryPctMedian);
  if (!range) return null;

  const actual = Math.abs(pctOfSales);

  if (item.isCost) {
    if (actual <= range.hi) return { label: "On track", color: "bg-green-100 text-green-700" };
    if (actual <= range.hi + 2) return { label: "Watch", color: "bg-amber-100 text-amber-700" };
    return { label: "Above avg", color: "bg-red-100 text-red-700" };
  } else {
    if (pctOfSales >= range.lo) return { label: "On track", color: "bg-green-100 text-green-700" };
    if (range.lo - pctOfSales <= 3) return { label: "Watch", color: "bg-amber-100 text-amber-700" };
    return { label: "Below avg", color: "bg-red-100 text-red-700" };
  }
}

// 2025 Target: for cost items not on track, what's the max $ they should aim for
function getTarget(item: typeof pnlLineItems[number]): number | null {
  if (!item.industryPctMedian || item.industryPctMedian === "N/A" || item.industryPctMedian === "100%") return null;
  if (!item.isCost) return null;

  const status = getStatus(item);
  if (!status || status.label === "On track") return null;

  const range = parseRange(item.industryPctMedian);
  if (!range) return null;

  // Target = industry high × revenue (the max they should be spending)
  return Math.round((range.hi / 100) * revenue2025);
}

// Bookkeeping quality flags — detect suspicious YoY swings that suggest misallocation
function getBookkeepingNote(item: typeof pnlLineItems[number]): string | null {
  if (!item.indent || item.bold) return null; // only flag sub-accounts

  const [v23, v24, v25] = item.values;

  // Items that appear/disappear — one year is $0 but adjacent years have >$1K
  if (v24 === 0 && (v23 > 1000 || v25 > 1000)) {
    return "Dropped to $0 in 2024 — possible reallocation to another GL";
  }
  if (v23 === 0 && v24 > 1000 && v25 === 0) {
    return "Only appears in 2024 — may be a one-time reclassification";
  }

  // Massive YoY swing (>3x increase)
  if (v23 > 500 && v24 > 500) {
    const ratio24 = v24 / v23;
    if (ratio24 > 3) return `Jumped ${ratio24.toFixed(1)}x from 2023 to 2024 — verify GL coding`;
  }
  if (v24 > 500 && v25 > 500) {
    const ratio25 = v25 / v24;
    if (ratio25 > 3) return `Jumped ${ratio25.toFixed(1)}x from 2024 to 2025 — verify GL coding`;
  }

  // Items well above industry high (>2x the high end of range)
  if (item.industryPctMedian && item.industryPctMedian !== "N/A") {
    const range = parseRange(item.industryPctMedian);
    if (range && range.hi > 0) {
      const pctOfSales = (v25 / revenue2025) * 100;
      if (pctOfSales > range.hi * 2.5 && v25 > 1000) {
        return `At ${pctOfSales.toFixed(1)}% — well above the ${item.industryPctMedian} range. Verify nothing is miscoded here`;
      }
    }
  }

  return null;
}

// Scissors chart — revenue vs total costs over 3 years
const scissorsData = yearlyData.map((d) => ({
  year: d.year.toString(),
  revenue: d.foodSales,
  costs: d.totalCOGS + d.totalExpenses,
  gap: d.netOrdinaryIncome,
}));

// Savings roadmap — expenses above industry targets, ranked by dollar opportunity
// Tips excluded: tip income ($43K) offsets tips paid ($43K) — it's a pass-through, not a controllable cost.
const savingsOpportunities = pnlLineItems
  .filter((item) => item.indent && item.isCost && item.account !== "Tips Paid to Employee")
  .map((item) => {
    const target = getTarget(item);
    if (target === null) return null;
    const current = Math.round(item.values[2]);
    const savings = current - target;
    if (savings <= 0) return null;
    return { account: item.account, current, target, savings };
  })
  .filter((x): x is { account: string; current: number; target: number; savings: number } => x !== null)
  .sort((a, b) => b.savings - a.savings)
  .slice(0, 5);

const totalPotentialSavings = savingsOpportunities.reduce((sum, item) => sum + item.savings, 0);

// SVG arc path helper for the prime cost gauge
function gaugeArc(cx: number, cy: number, r: number, startPct: number, endPct: number): string {
  const startAngle = Math.PI * (1 - startPct / 100);
  const endAngle = Math.PI * (1 - endPct / 100);
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy - r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy - r * Math.sin(endAngle);
  const largeArc = (startAngle - endAngle) > Math.PI ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

export default function PnLPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    cogs: true,
    opex: true,
    otherinc: true,
    otherexp: true,
  });

  const toggle = (group: string) =>
    setExpanded((prev) => ({ ...prev, [group]: !prev[group] }));

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Section 1: Header */}
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Profit & Loss</h1>
        <div className="h-1 w-16 bg-gradient-to-r from-teal to-teal-dark rounded-full mt-2 mb-3" />
        <p className="text-sm font-medium bg-gradient-to-r from-teal to-teal-dark bg-clip-text text-transparent">
          Every GL account from your books for 2023–2025, with industry benchmarks and dollar targets. Click any subtotal to expand or collapse.
        </p>
      </div>

      {/* Section 2: Full P&L Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Complete Profit & Loss Statement</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Pulled directly from QuickBooks. The &quot;2025 Target&quot; column shows the max dollar amount for
          any expense that&apos;s above the industry range — your concrete goal to aim for.
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
                <th className="text-right py-3 px-4 font-semibold text-slate-600">2025 Target</th>
              </tr>
            </thead>
            <tbody>
              {pnlLineItems.map((item, i) => {
                if (item.group && !expanded[item.group]) return null;

                const pctOfSales = ((item.values[2] / revenue2025) * 100).toFixed(1);
                const status = getStatus(item);
                const target = getTarget(item);
                const bkNote = getBookkeepingNote(item);
                const isToggle = !!item.groupHeader;
                const isOpen = item.groupHeader ? expanded[item.groupHeader] : false;
                const overspend = target !== null ? Math.round(item.values[2]) - target : null;

                return (
                  <tr
                    key={i}
                    className={cn(
                      "border-b border-slate-100",
                      item.separator && "border-t-2 border-t-slate-200",
                      item.bold && "bg-slate-50/70",
                      isToggle ? "cursor-pointer hover:bg-slate-100/80" : "hover:bg-slate-50/50"
                    )}
                    onClick={isToggle ? () => toggle(item.groupHeader!) : undefined}
                  >
                    <td className={cn("py-2.5 px-4", item.indent && "pl-10")}>
                      <div className="flex flex-col">
                        <span className={cn(
                          "text-slate-900 inline-flex items-center gap-1.5",
                          item.bold ? "font-bold" : "font-medium",
                          item.indent && "text-slate-600"
                        )}>
                          {isToggle && (
                            isOpen
                              ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                              : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          {item.indent && <span className="text-slate-300 mr-0.5">—</span>}
                          {item.account}
                          {bkNote && (
                            <span className="inline-flex items-center" title={bkNote}>
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            </span>
                          )}
                          {isToggle && (
                            <span className="text-xs font-normal text-slate-400 ml-1">
                              {isOpen ? "click to collapse" : "click to expand"}
                            </span>
                          )}
                        </span>
                        {bkNote && (
                          <span className="text-[11px] text-amber-600 mt-0.5 leading-tight">{bkNote}</span>
                        )}
                      </div>
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
                        {formatCurrency(Math.round(val))}
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
                    <td className="py-2.5 px-4 text-right tabular-nums">
                      {target !== null ? (
                        <div>
                          <span className="font-semibold text-slate-900">{formatCurrency(target)}</span>
                          {overspend !== null && overspend > 0 && (
                            <div className="text-[11px] text-red-500 font-medium">
                              {formatCurrency(overspend)} over
                            </div>
                          )}
                        </div>
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
        <div className="flex items-start gap-4 mt-4 text-xs text-slate-400">
          <p className="flex-1">
            Source: QuickBooks P&L export (Jan–Dec for each year). All GL accounts shown — sub-accounts sum exactly to their subtotal. Display rounds to whole dollars.
          </p>
          <div className="flex items-center gap-1.5 shrink-0 text-amber-600">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>= possible bookkeeping misallocation — verify GL coding with bookkeeper</span>
          </div>
        </div>
      </div>

      {/* Section 3: Prime Cost Health Check */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Prime Cost Health Check</h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          Prime cost (COGS + Labor) as a percentage of revenue — the #1 metric in restaurant finance.
        </p>

        <div className="flex justify-center">
          <svg viewBox="0 0 300 180" className="w-full max-w-sm">
            {/* Green base (full arc) */}
            <path d={gaugeArc(150, 155, 120, 0, 100)} fill="none" stroke="#22C55E" strokeWidth={22} strokeLinecap="round" />
            {/* Amber overlay (65–100%) */}
            <path d={gaugeArc(150, 155, 120, 65, 100)} fill="none" stroke="#F59E0B" strokeWidth={22} strokeLinecap="round" />
            {/* Red overlay (70–100%) */}
            <path d={gaugeArc(150, 155, 120, 70, 100)} fill="none" stroke="#FF6B6B" strokeWidth={22} strokeLinecap="round" />

            {/* Needle */}
            {(() => {
              const pct = primeCostData[2].primeCostPct;
              const angle = Math.PI * (1 - pct / 100);
              const tipX = 150 + 90 * Math.cos(angle);
              const tipY = 155 - 90 * Math.sin(angle);
              return (
                <>
                  <line x1={150} y1={155} x2={tipX} y2={tipY} stroke="#1e293b" strokeWidth={2.5} strokeLinecap="round" />
                  <circle cx={tipX} cy={tipY} r={3.5} fill="#1e293b" />
                  <circle cx={150} cy={155} r={6} fill="#1e293b" />
                  <circle cx={150} cy={155} r={3} fill="white" />
                </>
              );
            })()}

            {/* Value */}
            <text x={150} y={138} textAnchor="middle" fill="#1e293b" fontSize={34} fontWeight={900}>
              {primeCostData[2].primeCostPct}%
            </text>
            <text x={150} y={155} textAnchor="middle" fill="#94a3b8" fontSize={11}>
              prime cost
            </text>

            {/* Zone labels */}
            <text x={20} y={170} textAnchor="start" fill="#22C55E" fontSize={10} fontWeight={600}>Healthy</text>
            <text x={280} y={170} textAnchor="end" fill="#FF6B6B" fontSize={10} fontWeight={600}>Danger</text>
          </svg>
        </div>

        {/* Year-over-year cards */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {primeCostData.map((d) => {
            const color = d.primeCostPct > 70 ? "text-red-600" : d.primeCostPct > 65 ? "text-amber-600" : "text-green-600";
            const bg = d.primeCostPct > 70 ? "bg-red-50 border-red-200" : d.primeCostPct > 65 ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200";
            return (
              <div key={d.year} className={cn("p-3 rounded-lg border text-center", bg)}>
                <p className="text-xs text-slate-500">{d.year}</p>
                <p className={cn("text-xl font-bold tabular-nums", color)}>{d.primeCostPct}%</p>
                <p className="text-xs text-slate-400">${(d.primeCost / 1000).toFixed(0)}K total</p>
              </div>
            );
          })}
        </div>

        {/* Callout */}
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>Your prime cost is {primeCostData[2].primeCostPct}&cent; of every dollar</strong> — the industry
            target is under 65&cent;. The gap costs you ~${Math.round((primeCostData[2].primeCostPct - 65) / 100 * revenue2025 / 1000)}K/year.
          </p>
        </div>
      </div>

      {/* Section 4: Revenue vs. Costs — The Scissors Effect */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Revenue vs. Costs — The Scissors Effect</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          When costs rise while revenue falls, the gap widens — squeezing profitability from both sides.
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={scissorsData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2EC4B6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2EC4B6" stopOpacity={0.05} />
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
              formatter={(value: number, name: string) => [formatCurrency(Math.round(value)), name]}
              contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#2EC4B6"
              strokeWidth={3}
              fill="url(#revenueGrad)"
              dot={{ r: 5, fill: "#2EC4B6" }}
            />
            <Area
              type="monotone"
              dataKey="costs"
              name="Total Costs"
              stroke="#FF6B6B"
              strokeWidth={3}
              fillOpacity={0}
              dot={{ r: 5, fill: "#FF6B6B" }}
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-3 gap-4 mt-4">
          {scissorsData.map((d, i) => {
            const prevGap = i > 0 ? scissorsData[i - 1].gap : d.gap;
            const improving = i > 0 && Math.abs(d.gap) < Math.abs(prevGap);
            const bg = improving ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";
            const color = improving ? "text-amber-600" : "text-red-600";
            const label = i === 0 ? "operating gap" : improving ? "improving" : "worse again";
            return (
              <div key={d.year} className={cn("p-3 rounded-lg border text-center", bg)}>
                <p className="text-xs text-slate-500">{d.year}</p>
                <p className={cn("text-lg font-bold tabular-nums", color)}>
                  -${Math.abs(Math.round(d.gap / 1000))}K gap
                </p>
                <p className="text-xs text-slate-400">{label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 5: Your Savings Roadmap */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Your Savings Roadmap</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          The top 5 expenses above industry targets — ranked by the dollars you could save.
        </p>

        <div className="space-y-4">
          {savingsOpportunities.map((item) => (
            <div key={item.account}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-medium text-slate-700">{item.account}</span>
                <span className="font-bold text-green-600">save ~{formatCurrency(item.savings)}</span>
              </div>
              <div className="relative h-7 bg-red-100 rounded-lg overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-green-200 border-r-2 border-green-500"
                  style={{ width: `${(item.target / item.current) * 100}%` }}
                />
                <div className="absolute inset-0 flex items-center px-3 text-xs font-medium text-slate-600">
                  {formatCurrency(item.current)} &rarr; {formatCurrency(item.target)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total savings card */}
        <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-teal to-teal-dark text-white text-center">
          <p className="text-sm font-medium opacity-90">Potential annual savings</p>
          <p className="text-3xl font-black mt-1">~{formatCurrency(totalPotentialSavings)}</p>
          <p className="text-sm opacity-75 mt-1">if all 5 expenses hit industry targets</p>
        </div>
      </div>

      {/* Section 6: Bookkeeping Quality Note */}
      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <h2 className="text-base font-bold text-amber-800">A Note on Bookkeeping Quality</h2>
            <p className="text-sm text-amber-700 mt-1">
              We don&apos;t have access to the bookkeeper&apos;s process, and some GL allocations look
              questionable — items flagged with a warning icon above. Common patterns we see:
            </p>
            <ul className="text-sm text-amber-700 mt-2 space-y-1 list-disc pl-5">
              <li><strong>Cleaning Expenses</strong>: $18.5K in 2023, then $0 in 2024 — was this recoded to another GL?</li>
              <li><strong>Merchant Account Fees</strong>: Jumped from $2.9K to $18.5K (6.4x) — may include items that aren&apos;t card processing</li>
              <li><strong>Business Licenses</strong>: $4.6K only in 2024 — possibly a multi-year payment coded to one year</li>
              <li><strong>Insurance</strong>: Doubled from $5.4K to $11.9K — legitimate increase, or miscoded expense?</li>
              <li><strong>Office Supplies at 1.6%</strong>: High for a restaurant — may include items that belong in COGS (Restaurant Supplies)</li>
            </ul>
            <p className="text-sm text-amber-700 mt-2">
              We&apos;d recommend a quick GL review with the bookkeeper to confirm these allocations before
              using the targets above to set budget goals. The totals are accurate — it&apos;s the categorization
              that may need cleanup.
            </p>
          </div>
        </div>
      </div>

      {/* Section 7: Benchmark Sources */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Industry Benchmark Sources</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          All &quot;Industry Avg&quot; figures are based on Canadian full-service restaurant data, adjusted for the Toronto market
          and organic/Mexican food niche. Organic ingredients typically carry a 10-30% premium over conventional, which is
          reflected in the COGS benchmarks.
        </p>
        <div className="space-y-2">
          {benchmarkSources.map((src) => (
            <div key={src.id} className="flex items-start gap-3 text-sm">
              <span className="text-slate-400 font-mono text-xs mt-0.5 shrink-0">[{src.id}]</span>
              <div>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-teal hover:underline"
                >
                  {src.name}
                </a>
                <span className="text-slate-500"> — {src.detail}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4">
          Benchmarks represent typical ranges for full-service restaurants with $300K–$500K annual revenue in the
          Greater Toronto Area. Individual results vary by location, menu mix, and operational model. Data as of 2024–2025.
        </p>
      </div>
    </div>
  );
}
