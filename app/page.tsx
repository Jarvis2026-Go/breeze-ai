"use client";

import { cn } from "@/lib/utils";
import { ChartCard } from "@/components/chart-card";
import {
  yearlyData,
  insights,
  industryBenchmarks,
  financialHealthScores,
  primeCostData,
  expenseCategories2025,
} from "@/lib/data";
import { formatCurrency, formatPercent } from "@/lib/formatting";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
  ComposedChart,
  Line,
  Area,
  ReferenceLine,
} from "recharts";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingDown,
  TrendingUp,
  MapPin,
  Leaf,
  ArrowDown,
  ArrowUp,
  Minus,
  Info,
  Target,
  ShieldAlert,
  Flame,
} from "lucide-react";

// ── Derived Data ──────────────────────────────────────────────

const d25 = yearlyData[2];
const d24 = yearlyData[1];
const d23 = yearlyData[0];

const revenueYoY = ((d25.foodSales - d24.foodSales) / d24.foodSales) * 100;
const grossMargin = (d25.grossProfit / d25.foodSales) * 100;
const laborPct = (d25.payroll / d25.foodSales) * 100;
const cogsPct = (d25.totalCOGS / d25.foodSales) * 100;
const primeCostPct = cogsPct + laborPct;
const netMargin = (d25.netIncome / d25.foodSales) * 100;
const opMargin = (d25.netOrdinaryIncome / d25.foodSales) * 100;
const occupancyPct = (36000 / d25.foodSales) * 100;
const revPerEmployee = d25.foodSales / 14;
const overallHealthScore = financialHealthScores.reduce((s, h) => s + h.score, 0);
const overallMaxScore = financialHealthScores.reduce((s, h) => s + h.maxScore, 0);
const overallHealthPct = Math.round((overallHealthScore / overallMaxScore) * 100);

// Financial health radar data
const radarData = financialHealthScores.map((h) => ({
  category: h.category,
  score: h.score,
  fullMark: h.maxScore,
}));

// Margin bridge: what eats the gross margin
const marginBridgeData = [
  { name: "Gross Margin", value: grossMargin, fill: "#22C55E", display: grossMargin },
  { name: "Labour", value: laborPct, fill: "#FF6B6B", display: -laborPct },
  { name: "Rent", value: occupancyPct, fill: "#6366F1", display: -occupancyPct },
  { name: "Other OpEx", value: +((d25.totalExpenses - d25.payroll - d25.totalCOGS - 36000) / d25.foodSales * 100).toFixed(1), fill: "#F59E0B", display: -((d25.totalExpenses - d25.payroll - d25.totalCOGS - 36000) / d25.foodSales * 100) },
  { name: "Operating Margin", value: Math.abs(opMargin), fill: opMargin >= 0 ? "#22C55E" : "#FF6B6B", display: opMargin },
];

// Benchmark comparison data
const benchmarkBarData = industryBenchmarks.map((b) => ({
  label: b.label,
  CHOG: b.chogValue,
  "Industry Median": b.industryMedian,
  "Industry Range Low": b.industryLow,
  "Industry Range High": b.industryHigh,
}));

// Prime cost trend
const primeCostChartData = primeCostData.map((p) => ({
  year: p.year.toString(),
  "Food Cost %": +((p.cogs / p.revenue) * 100).toFixed(1),
  "Labour Cost %": +((p.labor / p.revenue) * 100).toFixed(1),
  "Prime Cost %": p.primeCostPct,
  "Target (65%)": 65,
}));

// Revenue + net income combo
const trendData = yearlyData.map((d, i) => ({
  year: d.year.toString(),
  Revenue: d.foodSales,
  "Net Income": d.netIncome,
  "Operating Income": d.netOrdinaryIncome,
  "Gross Profit": d.grossProfit,
}));

// ── Status helpers ──────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    critical: { bg: "bg-red-100", text: "text-red-700", label: "Critical" },
    warning: { bg: "bg-amber-100", text: "text-amber-700", label: "At Risk" },
    fair: { bg: "bg-blue-100", text: "text-blue-700", label: "Fair" },
    good: { bg: "bg-green-100", text: "text-green-700", label: "Strong" },
  };
  const c = config[status] || config.fair;
  return (
    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", c.bg, c.text)}>
      {c.label}
    </span>
  );
}

function ChangeIndicator({ value, suffix = "%", inverse = false }: { value: number; suffix?: string; inverse?: boolean }) {
  const isGood = inverse ? value < 0 : value > 0;
  const isNeutral = value === 0;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-xs font-semibold",
      isNeutral ? "text-slate-400" : isGood ? "text-positive" : "text-negative"
    )}>
      {isNeutral ? <Minus className="w-3 h-3" /> : isGood ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      {Math.abs(value).toFixed(1)}{suffix}
    </span>
  );
}

// ── Page Component ──────────────────────────────────────────

export default function OverviewPage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-slate-900">CHOG</h1>
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full flex items-center gap-1">
              <Leaf className="w-3 h-3" /> Local, Organic, Seasonal
            </span>
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Toronto, ON
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            Mexican-inspired restaurant &middot; FP&A Executive Summary &middot; FY2023–2025
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 uppercase tracking-wide font-medium">Financial Health</div>
          <div className={cn(
            "text-3xl font-bold",
            overallHealthPct < 30 ? "text-red-500" : overallHealthPct < 50 ? "text-amber-500" : "text-green-500"
          )}>
            {overallHealthPct}/100
          </div>
          <div className="text-xs text-slate-400 mt-0.5">{overallHealthScore} of {overallMaxScore} points</div>
        </div>
      </div>

      {/* Executive Situation Banner */}
      <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-red-800 text-sm">Executive Summary: Structural Operating Loss</h3>
            <p className="text-sm text-slate-700 mt-1 leading-relaxed">
              CHOG has generated <strong>negative operating income in all 3 years</strong> (-$61K, -$35K, -$52K).
              The business survives on <strong>$43–82K in annual other income</strong> (tips/subsidies), which
              masked the deterioration until 2025 when net income turned negative (-$7.4K).
              <strong> Prime cost of 71.8%</strong> — driven almost entirely by labour at 48.6% of revenue —
              leaves only 28.2% to cover rent, utilities, insurance, and profit. The industry target is 65%.
              Revenue declined 9.5% in 2025, compressing margins further. Without restructuring labour costs or
              growing revenue, the business will exhaust its remaining $44K asset base within 18–24 months.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Row — FP&A focused */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: "Revenue", value: formatCurrency(d25.foodSales, true), yoy: revenueYoY, icon: "dollar" },
          { label: "Gross Margin", value: formatPercent(grossMargin), yoy: grossMargin - (d24.grossProfit / d24.foodSales * 100), icon: "up" },
          { label: "Prime Cost", value: formatPercent(primeCostPct), yoy: primeCostPct - primeCostData[1].primeCostPct, icon: "fire", inverse: true },
          { label: "Labour %", value: formatPercent(laborPct), yoy: laborPct - (d24.payroll / d24.foodSales * 100), icon: "labor", inverse: true },
          { label: "COGS %", value: formatPercent(cogsPct), yoy: cogsPct - (d24.totalCOGS / d24.foodSales * 100), icon: "cogs", inverse: true },
          { label: "Op. Income", value: formatCurrency(d25.netOrdinaryIncome, true), yoy: ((d25.netOrdinaryIncome - d24.netOrdinaryIncome) / Math.abs(d24.netOrdinaryIncome)) * 100, icon: "op" },
          { label: "Net Income", value: formatCurrency(d25.netIncome, true), yoy: 0, icon: "net" },
          { label: "Total Assets", value: formatCurrency(d25.totalAssets, true), yoy: ((d25.totalAssets - d24.totalAssets) / d24.totalAssets) * 100, icon: "assets" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-lg p-3 shadow-sm border border-slate-100">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide truncate">{kpi.label}</p>
            <p className={cn("text-lg font-bold mt-0.5",
              kpi.label === "Net Income" || kpi.label === "Op. Income"
                ? (parseFloat(kpi.value.replace(/[^-\d.]/g, '')) < 0 ? "text-red-600" : "text-green-600")
                : "text-slate-900"
            )}>
              {kpi.value}
            </p>
            <ChangeIndicator value={kpi.yoy} inverse={kpi.inverse} />
          </div>
        ))}
      </div>

      {/* Row 2: Financial Health Scorecard + Industry Benchmark */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Health Scorecard */}
        <ChartCard title="Financial Health Scorecard" subtitle="7 key dimensions rated against industry standards">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <div className="space-y-3">
              {financialHealthScores.map((h, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-28 shrink-0">
                    <p className="text-xs font-medium text-slate-700 truncate">{h.category}</p>
                  </div>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all",
                        h.status === "critical" ? "bg-red-400" :
                        h.status === "warning" ? "bg-amber-400" :
                        h.status === "fair" ? "bg-blue-400" : "bg-green-400"
                      )}
                      style={{ width: `${(h.score / h.maxScore) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-500 w-8 text-right">{h.score}/{h.maxScore}</span>
                  <StatusBadge status={h.status} />
                </div>
              ))}
            </div>
            <div className="mt-4 md:mt-0">
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 9, fill: "#64748b" }} />
                  <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar name="CHOG" dataKey="score" stroke="#2EC4B6" fill="#2EC4B6" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartCard>

        {/* Industry Benchmark Comparison */}
        <ChartCard title="CHOG vs. Canadian Full-Service Restaurants" subtitle="Key operating ratios vs. industry median (2024-2025)">
          <div className="space-y-4">
            {industryBenchmarks.map((b, i) => {
              const isOutperforming = b.lowerIsBetter
                ? b.chogValue < b.industryMedian
                : b.chogValue > b.industryMedian;
              const diff = b.chogValue - b.industryMedian;
              const rangeWidth = b.industryHigh - b.industryLow;
              const chogPos = Math.max(0, Math.min(100, ((b.chogValue - b.industryLow + rangeWidth * 0.15) / (rangeWidth * 1.3)) * 100));
              const medianPos = ((b.industryMedian - b.industryLow + rangeWidth * 0.15) / (rangeWidth * 1.3)) * 100;

              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700">{b.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-xs font-bold", isOutperforming ? "text-green-600" : "text-red-600")}>
                        {b.chogValue > 0 ? "+" : ""}{diff.toFixed(1)}pp vs median
                      </span>
                    </div>
                  </div>
                  <div className="relative h-3 bg-slate-100 rounded-full">
                    {/* Industry range */}
                    <div
                      className="absolute h-full bg-slate-200 rounded-full"
                      style={{ left: "15%", width: "70%" }}
                    />
                    {/* Median marker */}
                    <div
                      className="absolute top-0 w-0.5 h-full bg-slate-400"
                      style={{ left: `${medianPos}%` }}
                    />
                    {/* CHOG marker */}
                    <div
                      className={cn("absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow",
                        isOutperforming ? "bg-green-500" : "bg-red-500"
                      )}
                      style={{ left: `${chogPos}%`, marginLeft: "-6px" }}
                    />
                  </div>
                  <div className="flex justify-between mt-0.5">
                    <span className="text-[9px] text-slate-400">{b.industryLow}{b.unit === "percent" ? "%" : ""}</span>
                    <span className="text-[9px] text-slate-400">Median: {b.industryMedian}{b.unit === "percent" ? "%" : ""}</span>
                    <span className="text-[9px] text-slate-400">{b.industryHigh}{b.unit === "percent" ? "%" : ""}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-4 text-[10px] text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Outperforming</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Underperforming</span>
            <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-slate-400" /> Industry Median</span>
          </div>
        </ChartCard>
      </div>

      {/* Row 3: Prime Cost Trend + Margin Bridge */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prime Cost Trend */}
        <ChartCard
          title="Prime Cost Analysis"
          subtitle="COGS + Labour as % of Revenue — the #1 restaurant profitability driver"
        >
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={primeCostChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v}%`} domain={[0, 90]} />
              <Tooltip
                formatter={(value: unknown) => `${typeof value === "number" ? value.toFixed(1) : value}%`}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="Food Cost %" stackId="prime" fill="#2EC4B6" />
              <Bar dataKey="Labour Cost %" stackId="prime" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="Target (65%)" stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 4" dot={false} />
              <ReferenceLine y={65} stroke="#94a3b8" strokeDasharray="6 4" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-800">
              <strong>FP&A Note:</strong> Prime cost improved from 79.3% (2023) to 71.8% (2025) — but remains
              6.8pp above the 65% industry target. The improvement came entirely from COGS reduction;
              labour actually increased from 44.9% to 48.6%. COGS savings are nearing a floor —
              further improvement must come from labour optimization or revenue growth.
            </p>
          </div>
        </ChartCard>

        {/* Margin Bridge / Waterfall */}
        <ChartCard
          title="Where Does the Gross Margin Go?"
          subtitle="Margin bridge: Gross Margin → Operating Margin (2025)"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={marginBridgeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={100} />
              <Tooltip
                formatter={(value: unknown, name: unknown, props: unknown) => {
                  const p = props as { payload?: { display?: number } };
                  return [`${(p.payload?.display ?? 0).toFixed(1)}%`, "% of Revenue"];
                }}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {marginBridgeData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800">
              <strong>FP&A Note:</strong> Despite a strong 76.8% gross margin (8.8pp above industry median),
              labour alone consumes 48.6pp, leaving only 28.2% for all other costs. The business generates
              excellent food margins but cannot convert them to operating profit due to overstaffing
              relative to revenue volume.
            </p>
          </div>
        </ChartCard>
      </div>

      {/* Row 4: Revenue + Profit Trend + Key Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Revenue & Profitability Trend"
          subtitle="3-year P&L trajectory"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={trendData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2EC4B6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2EC4B6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
              <YAxis
                yAxisId="left"
                stroke="#94a3b8"
                fontSize={11}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#94a3b8"
                fontSize={11}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                formatter={(value: unknown) => typeof value === "number" ? formatCurrency(value) : "N/A"}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <ReferenceLine yAxisId="right" y={0} stroke="#94a3b8" strokeDasharray="3 3" />
              <Area yAxisId="left" type="monotone" dataKey="Revenue" fill="url(#revGrad)" stroke="#2EC4B6" strokeWidth={2} />
              <Area yAxisId="left" type="monotone" dataKey="Gross Profit" fill="none" stroke="#22C55E" strokeWidth={1.5} strokeDasharray="4 2" />
              <Line yAxisId="right" type="monotone" dataKey="Operating Income" stroke="#FF6B6B" strokeWidth={2} dot={{ r: 4, fill: "#FF6B6B" }} />
              <Line yAxisId="right" type="monotone" dataKey="Net Income" stroke="#6366F1" strokeWidth={2} dot={{ r: 4, fill: "#6366F1" }} />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: "3-Year Revenue CAGR", value: `${(((d25.foodSales / d23.foodSales) ** (1/2) - 1) * 100).toFixed(1)}%`, color: "text-red-600" },
              { label: "Avg. Operating Loss", value: formatCurrency(Math.round((d23.netOrdinaryIncome + d24.netOrdinaryIncome + d25.netOrdinaryIncome) / 3), true), color: "text-red-600" },
              { label: "Cumulative Net Income", value: formatCurrency(d23.netIncome + d24.netIncome + d25.netIncome, true), color: d23.netIncome + d24.netIncome + d25.netIncome >= 0 ? "text-green-600" : "text-red-600" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-2 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">{stat.label}</p>
                <p className={cn("text-sm font-bold mt-0.5", stat.color)}>{stat.value}</p>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* AI Insights — rewritten for FP&A */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
            <h3 className="font-semibold text-slate-900 text-sm">FP&A Key Findings</h3>
          </div>
          <div className="space-y-3">
            {[
              {
                icon: XCircle,
                iconColor: "text-red-500",
                bg: "bg-red-50",
                border: "border-red-200",
                title: "Labour is the #1 Problem",
                desc: "At 48.6% of revenue, CHOG's labour cost is 14.4pp above the Canadian full-service median (34.2%). This single line item erases the entire gross margin advantage.",
              },
              {
                icon: CheckCircle2,
                iconColor: "text-green-500",
                bg: "bg-green-50",
                border: "border-green-200",
                title: "Best-in-Class Food Costs",
                desc: "23.2% COGS ratio is 8.8pp below industry median. Organic/local sourcing hasn't hurt procurement — likely strong supplier relationships and minimal waste.",
              },
              {
                icon: AlertTriangle,
                iconColor: "text-amber-500",
                bg: "bg-amber-50",
                border: "border-amber-200",
                title: "Revenue Risk: Toronto Market",
                desc: "9.5% revenue decline in a market where Ontario restaurant sales grew ~14%. CHOG is losing market share — menu pricing, foot traffic, or competitive positioning needs review.",
              },
              {
                icon: Flame,
                iconColor: "text-red-500",
                bg: "bg-red-50",
                border: "border-red-200",
                title: "Cash Runway: ~18 Months",
                desc: "With $44K in assets and a $7.4K annual net loss (worsening), plus declining other income ($82K→$43K), the business has limited runway without intervention.",
              },
              {
                icon: Target,
                iconColor: "text-blue-500",
                bg: "bg-blue-50",
                border: "border-blue-200",
                title: "Path to Breakeven",
                desc: "Either grow revenue to ~$360K (at current cost structure) or reduce labour to 40% of current revenue ($128K, saving $27K) to reach operating breakeven.",
              },
            ].map((item, i) => (
              <div key={i} className={cn("p-3 rounded-lg border", item.bg, item.border)}>
                <div className="flex gap-2">
                  <item.icon className={cn("w-4 h-4 mt-0.5 shrink-0", item.iconColor)} />
                  <div>
                    <p className="font-semibold text-xs text-slate-800">{item.title}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer: Data sources */}
      <div className="text-[10px] text-slate-400 pt-4 border-t border-slate-100">
        <p>
          Industry benchmarks sourced from Restaurants Canada (2024), Statistics Canada ISED, National Restaurant Association,
          Toast POS Restaurant Benchmarks (2025), NetSuite Industry Benchmarks. CHOG data from P&L, Balance Sheet, and Wage
          reports (2023–2025). All figures in CAD.
        </p>
      </div>
    </div>
  );
}
