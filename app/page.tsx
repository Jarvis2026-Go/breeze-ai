"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  yearlyData,
  industryBenchmarks,
} from "@/lib/data";
import { formatCurrency } from "@/lib/formatting";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  ComposedChart,
  Line,
  Area,
  ReferenceLine,
  PieChart,
  Pie,
} from "recharts";
import {
  Star,
  Clock,
  Sprout,
  Heart,
  MapPin,
  Leaf,
  ArrowDown,
  DollarSign,
  TrendingDown,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

// ── Data ─────────────────────────────────────────────────────

// For the "Where every dollar goes" chart
const dollarBreakdown = [
  { name: "Food & Supplies", value: 23.2, fill: "#2EC4B6", dollars: "$0.23" },
  { name: "Staff Wages", value: 48.6, fill: "#FF6B6B", dollars: "$0.49" },
  { name: "Rent", value: 11.3, fill: "#6366F1", dollars: "$0.11" },
  { name: "Other Costs", value: 19.2, fill: "#F59E0B", dollars: "$0.19" },
  { name: "Loss", value: -2.3, fill: "#EF4444", dollars: "-$0.02" },
];
// For pie chart, make loss positive for display
const dollarPieData = dollarBreakdown.map((d) => ({
  ...d,
  value: Math.abs(d.value),
}));

// Simple sales trend
const salesTrend = yearlyData.map((d) => ({
  year: d.year.toString(),
  Sales: d.foodSales,
  "What You Kept": d.netIncome,
}));

// ── Page ────────────────────────────────────────────────────

export default function OverviewPage() {
  return (
    <div className="space-y-8 max-w-[1400px]">

      {/* ── Section 1: Header ── */}
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Cool Hand of a Girl
        </h1>
        <div className="h-1 w-16 bg-gradient-to-r from-teal to-teal-dark rounded-full mt-2 mb-3" />
        <p className="text-sm font-medium bg-gradient-to-r from-teal to-teal-dark bg-clip-text text-transparent mb-3">
          A financial snapshot of what you&apos;ve built — and a clear path to make it stronger.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" /> Est. 2008
          </span>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
            <MapPin className="w-3 h-3" /> The Junction, Toronto
          </span>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Leaf className="w-3 h-3" /> Local · Organic · Seasonal
          </span>
        </div>
      </div>

      {/* ── Section 2: What You've Built ── */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">What You&apos;ve Built</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
            <div className="mx-auto w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-slate-900">4.6★</p>
            <p className="text-xs font-medium text-slate-500 mt-1">Customer Love</p>
            <p className="text-xs text-slate-400 mt-0.5">130+ reviews — your food speaks for itself</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
            <div className="mx-auto w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-teal" />
            </div>
            <p className="text-2xl font-black text-slate-900">17 Years</p>
            <p className="text-xs font-medium text-slate-500 mt-1">Est. 2008</p>
            <p className="text-xs text-slate-400 mt-0.5">Still going when most restaurants close in 3</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
            <div className="mx-auto w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-2">
              <Sprout className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">23¢</p>
            <p className="text-xs font-medium text-slate-500 mt-1">Food Costs per $1</p>
            <p className="text-xs text-slate-400 mt-0.5">Below the 32¢ average — remarkable for organic/local</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
            <div className="mx-auto w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mb-2">
              <Heart className="w-5 h-5 text-rose-500" />
            </div>
            <p className="text-2xl font-black text-slate-900">Junction</p>
            <p className="text-xs font-medium text-slate-500 mt-1">Community Staple</p>
            <p className="text-xs text-slate-400 mt-0.5">From your abuela&apos;s kitchen to Dundas West</p>
          </div>
        </div>
      </div>

      {/* ── Section 3: 2025 at a Glance ── */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">2025 at a Glance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Card 1: Revenue */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-lg bg-teal/10">
                <DollarSign className="w-5 h-5 text-teal" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Revenue</p>
                <p className="text-2xl font-bold text-slate-900">$319,177</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <ArrowDown className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold text-red-600">Down 9.5% from 2024</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your team served thousands of meals this year. Revenue pulled back <strong>$33K</strong> from
              2024&apos;s peak — an honest look at what needs to change.
            </p>
          </div>

          {/* Card 2: Bottom Line */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-lg bg-red-50">
                <TrendingDown className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Bottom Line</p>
                <p className="text-2xl font-bold text-red-600">-$7,369</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold text-red-600">The year ended in the red</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              After everything, 2025 finished with a small loss. The trend matters: 2023 was +$18.5K,
              2024 was +$7.5K, 2025 is -$7.4K. We need to bend this curve back.
            </p>
          </div>

          {/* Card 3: Operating Reality */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-lg bg-amber-50">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Operating Reality</p>
                <p className="text-2xl font-bold text-red-600">-$51,583</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-amber-600">Before tips & subsidies</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Day-to-day operations ran at a <strong>$52K deficit</strong>, offset by $43K in tip
              income. The gap between those two numbers is what we need to close.
            </p>
          </div>
        </div>
      </div>

      {/* ── Section 4: Where Every Dollar Goes ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="mb-2">
          <h2 className="text-lg font-bold text-slate-900">Where Every Dollar Goes</h2>
          <p className="text-sm text-slate-500 mt-1">
            For every $1 in sales, here&apos;s how it gets divided. You know your team by name —
            this isn&apos;t about cutting people, it&apos;s about finding the right balance.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dollarPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={120}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {dollarPieData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: unknown) => `${value}%`}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 flex flex-col justify-center">
            {dollarBreakdown.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{item.name}</span>
                    <span className="text-sm font-bold text-slate-900">{item.dollars}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.abs(item.value)}%`, backgroundColor: item.fill }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-2 p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600">
                <strong>The big picture:</strong> Staff wages take 49 cents of every dollar —
                the typical restaurant spends about 34 cents. That 15-cent gap is the main lever
                for getting back to profitability.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 5: How CHOG Compares ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900">How CHOG Compares</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Your food purchasing is best-in-class — especially for a restaurant committed to
            local and organic sourcing. Here&apos;s how the rest stacks up against the typical
            full-service restaurant in Canada.
          </p>
        </div>
        <div className="space-y-5">
          {industryBenchmarks.map((b, i) => {
            const isGood = b.lowerIsBetter
              ? b.chogValue < b.industryMedian
              : b.chogValue > b.industryMedian;

            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">{b.label}</span>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded-full",
                      isGood ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {isGood ? "Better than avg." : "Needs work"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-teal">CHOG: {b.chogValue}%</span>
                      <span className="text-slate-400">Average restaurant: {b.industryMedian}%</span>
                    </div>
                    <div className="relative h-3 bg-slate-100 rounded-full">
                      {/* Average marker */}
                      <div
                        className="absolute top-0 w-0.5 h-full bg-slate-400 z-10"
                        style={{ left: `${Math.min(95, Math.max(5, (b.industryMedian / (b.industryHigh * 1.15)) * 100))}%` }}
                      />
                      {/* CHOG bar */}
                      <div
                        className={cn("h-full rounded-full", isGood ? "bg-green-400" : "bg-red-400")}
                        style={{ width: `${Math.min(100, Math.max(3, (b.chogValue / (b.industryHigh * 1.15)) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1"><span className="w-0.5 h-3 bg-slate-400 inline-block" /> Average restaurant</span>
        </div>
      </div>

      {/* ── Section 6: Sales Over Time ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Sales Over Time</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Revenue peaked at $353K in 2024 and pulled back to $319K. The trend matters more than
          any single year — and the purple line shows what was left after all expenses.
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={salesTrend}>
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2EC4B6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2EC4B6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" stroke="#94a3b8" fontSize={13} />
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
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              formatter={(value: unknown) => typeof value === "number" ? formatCurrency(value) : "N/A"}
              contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
            />
            <Legend wrapperStyle={{ fontSize: "13px" }} />
            <ReferenceLine yAxisId="right" y={0} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: "Break even", fontSize: 11, fill: "#94a3b8" }} />
            <Area yAxisId="left" type="monotone" dataKey="Sales" fill="url(#salesGrad)" stroke="#2EC4B6" strokeWidth={3} />
            <Line yAxisId="right" type="monotone" dataKey="What You Kept" stroke="#6366F1" strokeWidth={3} dot={{ r: 6, fill: "#6366F1", strokeWidth: 2, stroke: "#fff" }} />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {yearlyData.map((d) => (
            <div key={d.year} className="text-center p-3 bg-slate-50 rounded-lg">
              <p className="text-sm font-bold text-slate-400">{d.year}</p>
              <p className="text-lg font-bold text-slate-900">{formatCurrency(d.foodSales, true)}</p>
              <p className={cn("text-sm font-semibold",
                d.netIncome >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {d.netIncome >= 0 ? "Kept" : "Lost"} {formatCurrency(Math.abs(d.netIncome), true)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 7: What the Numbers Are Telling Us ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-5">What the Numbers Are Telling Us</h2>

        <div className="space-y-6">
          {/* Strengths */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <h3 className="text-sm font-bold text-green-800">Your strengths</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="font-semibold text-sm text-slate-800">Food cost discipline</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  23¢ per dollar vs. the 32¢ average — exceptional for a restaurant sourcing
                  organic and local ingredients. This is a real competitive advantage.
                </p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="font-semibold text-sm text-slate-800">Your customers love what you do</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  4.6 stars, 130+ reviews, strong word of mouth. People don&apos;t leave
                  those reviews for generic food — they come because what you make is special.
                </p>
              </div>
            </div>
          </div>

          {/* Challenges */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-amber-800">What needs attention</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="font-semibold text-sm text-slate-800">Revenue declining while costs hold steady</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Sales dropped 9.5% but expenses barely moved. When those lines diverge,
                  the gap eats into everything. The scissors are widening.
                </p>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="font-semibold text-sm text-slate-800">Labor at 49¢ per dollar vs. 34¢ industry</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  It sounds like a big gap, but the distance to break-even is only $12K.
                  That&apos;s close — a combination of small changes can get there.
                </p>
              </div>
            </div>
          </div>

          {/* Path Forward */}
          <div className="p-5 bg-gradient-to-br from-teal/5 to-teal/10 border border-teal/20 rounded-xl">
            <h3 className="text-sm font-bold text-teal-dark mb-3">Where to go from here</h3>
            <div className="space-y-3">
              <Link href="/break-even" className="flex items-center gap-3 group">
                <ArrowRight className="w-4 h-4 text-teal group-hover:translate-x-0.5 transition-transform" />
                <div>
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-teal transition-colors">
                    Break-Even Analysis
                  </p>
                  <p className="text-xs text-slate-500">
                    6 scenarios to close the $54K gap to fair owner pay
                  </p>
                </div>
              </Link>
              <Link href="/next-steps" className="flex items-center gap-3 group">
                <ArrowRight className="w-4 h-4 text-teal group-hover:translate-x-0.5 transition-transform" />
                <div>
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-teal transition-colors">
                    Unlock Profit
                  </p>
                  <p className="text-xs text-slate-500">
                    90-day action plan with specific tactics
                  </p>
                </div>
              </Link>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                The brand you&apos;ve built gives you pricing power most restaurants don&apos;t have.
                17 years, 4.6 stars, and a loyal community — that&apos;s real equity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 8: Footer ── */}
      <div className="text-xs text-slate-400 pt-4 border-t border-slate-100 space-y-1">
        <p>
          <strong>Where do the comparison numbers come from?</strong> The &quot;average restaurant&quot; figures are based on
          2024-2025 data from Restaurants Canada, Statistics Canada, the National Restaurant Association, and
          Toast POS industry reports. They represent typical full-service restaurants in Canada.
        </p>
        <p>
          CHOG data is from its own Profit & Loss statements, Balance Sheets, and Wage reports (2023–2025). All amounts in CAD.
        </p>
      </div>
    </div>
  );
}
