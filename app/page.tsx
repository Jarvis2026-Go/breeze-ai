"use client";

import { cn } from "@/lib/utils";
import { ChartCard } from "@/components/chart-card";
import {
  yearlyData,
  industryBenchmarks,
  financialHealthScores,
  primeCostData,
} from "@/lib/data";
import { formatCurrency } from "@/lib/formatting";
import {
  BarChart,
  Bar,
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
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MapPin,
  Leaf,
  ArrowDown,
  ArrowUp,
  Target,
  ShieldAlert,
  Flame,
  DollarSign,
  Users,
  UtensilsCrossed,
  TrendingDown,
  Lightbulb,
  HelpCircle,
} from "lucide-react";

// ── Numbers we need ─────────────────────────────────────────

const d25 = yearlyData[2];
const d24 = yearlyData[1];
const d23 = yearlyData[0];

const overallScore = financialHealthScores.reduce((s, h) => s + h.score, 0);
const overallMax = financialHealthScores.reduce((s, h) => s + h.maxScore, 0);
const overallPct = Math.round((overallScore / overallMax) * 100);

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

// Staff + food cost trend (simple)
const costTrend = primeCostData.map((p) => ({
  year: p.year.toString(),
  "Food & Supplies": +((p.cogs / p.revenue) * 100).toFixed(1),
  "Staff Wages": +((p.labor / p.revenue) * 100).toFixed(1),
}));

// ── Helpers ────────────────────────────────────────────────

function GradeCircle({ score, max }: { score: number; max: number }) {
  const pct = (score / max) * 100;
  let grade = "F";
  let color = "text-red-500";
  let bg = "bg-red-50";
  let ring = "ring-red-200";
  if (pct >= 80) { grade = "A"; color = "text-green-600"; bg = "bg-green-50"; ring = "ring-green-200"; }
  else if (pct >= 60) { grade = "B"; color = "text-blue-500"; bg = "bg-blue-50"; ring = "ring-blue-200"; }
  else if (pct >= 40) { grade = "C"; color = "text-amber-500"; bg = "bg-amber-50"; ring = "ring-amber-200"; }
  else if (pct >= 20) { grade = "D"; color = "text-orange-500"; bg = "bg-orange-50"; ring = "ring-orange-200"; }

  return (
    <div className={cn("w-14 h-14 rounded-full flex items-center justify-center ring-4", bg, ring)}>
      <span className={cn("text-2xl font-black", color)}>{grade}</span>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────

export default function OverviewPage() {
  return (
    <div className="space-y-8 max-w-[1400px]">

      {/* ── Header ── */}
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">CHOG</h1>
        <div className="h-1 w-16 bg-gradient-to-r from-teal to-teal-dark rounded-full mt-2 mb-3" />
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-medium bg-gradient-to-r from-teal to-teal-dark bg-clip-text text-transparent">
            A clear look at how CHOG is doing financially — covering 2023, 2024, and 2025.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Leaf className="w-3 h-3" /> Local, Organic, Seasonal
          </span>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Toronto, ON
          </span>
        </div>
      </div>

      {/* ── The Big Picture — 3 cards that tell the story ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Card 1: Sales */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-lg bg-teal/10">
              <DollarSign className="w-5 h-5 text-teal" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Sales (2025)</p>
              <p className="text-2xl font-bold text-slate-900">$319,177</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <ArrowDown className="w-4 h-4 text-red-500" />
            <span className="text-sm font-semibold text-red-600">Down 9.5% from last year</span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Sales fell by about <strong>$33,000</strong> compared to 2024. Meanwhile, most restaurants in
            Toronto and Ontario saw their sales <em>grow</em>. This means fewer customers are coming in,
            or they&apos;re spending less per visit.
          </p>
        </div>

        {/* Card 2: Profit / Loss */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-lg bg-red-50">
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Bottom Line (2025)</p>
              <p className="text-2xl font-bold text-red-600">-$7,369</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-semibold text-red-600">Lost money this year</span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            After paying for everything — food, staff, rent, and all other bills — the restaurant
            lost <strong>$7,369</strong>. In 2024 it made $7,569, and in 2023 it made $18,512.
            The trend is going the wrong way.
          </p>
        </div>

        {/* Card 3: The hidden story */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-lg bg-amber-50">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Without Tips & Subsidies</p>
              <p className="text-2xl font-bold text-red-600">-$51,583</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-600">The real operating loss</span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            The day-to-day restaurant operations actually <strong>lost $51,583</strong> in 2025.
            Tips and government subsidies ($43,191) covered most of it, but that outside help
            has been shrinking every year — from $82K in 2023 to $43K now.
          </p>
        </div>
      </div>

      {/* ── Where Every Dollar Goes (the most important visual) ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="mb-2">
          <h2 className="text-lg font-bold text-slate-900">For Every $1 in Sales, Here&apos;s Where It Goes</h2>
          <p className="text-sm text-slate-500 mt-1">
            This shows how each dollar of sales gets split up. In a healthy restaurant, you&apos;d want about
            5-10 cents left over as profit. Right now, CHOG is losing about 2 cents on every dollar.
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
                <strong>What this means:</strong> Staff wages take the biggest bite — almost 49 cents of every
                dollar. The typical Canadian restaurant spends about 34 cents. That extra 15 cents is the main
                reason the restaurant isn&apos;t profitable.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Report Card + How You Compare ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Report Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Business Report Card</h2>
              <p className="text-sm text-slate-500 mt-0.5">How CHOG scores across 7 areas</p>
            </div>
            <div className="text-center">
              <div className={cn(
                "text-3xl font-black",
                overallPct < 30 ? "text-red-500" : overallPct < 50 ? "text-amber-500" : "text-green-500"
              )}>
                {overallPct}
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-medium">out of 100</div>
            </div>
          </div>
          <div className="space-y-4">
            {financialHealthScores.map((h, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <GradeCircle score={h.score} max={h.maxScore} />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{h.category}</p>
                      <p className="text-xs text-slate-500">{h.detail}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How You Compare */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">How Does CHOG Compare?</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              CHOG vs. the typical full-service restaurant in Canada.
              Green = doing better than average. Red = needs attention.
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
      </div>

      {/* ── Sales Over Time — simple chart ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">How Are Sales Doing?</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Total food sales each year, and what was left over after all expenses (the green/red line).
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
        <div className="grid grid-cols-3 gap-4 mt-4">
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

      {/* ── The Biggest Cost Problem ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">The Biggest Cost Problem: Staffing</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Here&apos;s how much of each sales dollar goes to food costs vs. staff wages each year.
          The dashed line shows where most successful restaurants keep this combined number.
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={costTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" stroke="#94a3b8" fontSize={13} />
            <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${v}%`} domain={[0, 85]} />
            <Tooltip
              formatter={(value: unknown) => `${typeof value === "number" ? value.toFixed(1) : value}%`}
              contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
            />
            <Legend wrapperStyle={{ fontSize: "13px" }} />
            <Bar dataKey="Food & Supplies" stackId="a" fill="#2EC4B6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Staff Wages" stackId="a" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
            <ReferenceLine y={65} stroke="#22C55E" strokeWidth={2} strokeDasharray="8 4" label={{ value: "Healthy target: 65%", fontSize: 11, fill: "#22C55E", position: "top" }} />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-semibold text-green-800">Good: Food costs</span>
            </div>
            <p className="text-xs text-slate-600">
              You spend 23 cents per dollar on ingredients — much less than the 32-cent average.
              Great purchasing and low waste.
            </p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold text-red-800">Problem: Staff costs</span>
            </div>
            <p className="text-xs text-slate-600">
              You spend 49 cents per dollar on staff — the average is 34 cents. That&apos;s an
              extra $46,000/year more than a typical restaurant your size.
            </p>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-amber-800">Combined: 72%</span>
            </div>
            <p className="text-xs text-slate-600">
              Together, food and staff take 72 cents of every dollar. The healthy target is
              65 cents. That 7-cent gap = ~$22,000/year in lost profit.
            </p>
          </div>
        </div>
      </div>

      {/* ── What You Should Know (insights) ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-5">
          <Lightbulb className="w-5 h-5 text-teal" />
          <h2 className="text-lg font-bold text-slate-900">What You Should Know</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: XCircle,
              iconColor: "text-red-500",
              bg: "bg-red-50",
              border: "border-red-200",
              title: "Staffing costs are too high",
              desc: "For every dollar in sales, 49 cents goes to staff. The average restaurant pays about 34 cents. If CHOG could get closer to average, it would save roughly $46,000 a year — enough to turn the losses into a profit.",
            },
            {
              icon: CheckCircle2,
              iconColor: "text-green-500",
              bg: "bg-green-50",
              border: "border-green-200",
              title: "Food costs are excellent",
              desc: "Only 23 cents of every dollar goes to food and supplies — well below the 32-cent average. For a restaurant focused on local and organic ingredients, this is impressive. Whoever manages purchasing is doing a great job.",
            },
            {
              icon: AlertTriangle,
              iconColor: "text-amber-500",
              bg: "bg-amber-50",
              border: "border-amber-200",
              title: "Sales are falling while others are growing",
              desc: "CHOG's sales dropped 9.5% in 2025, but restaurant sales across Ontario actually grew about 14% during this period. The restaurant is losing ground to competitors — this could be a location, marketing, or pricing issue.",
            },
            {
              icon: Flame,
              iconColor: "text-red-500",
              bg: "bg-red-50",
              border: "border-red-200",
              title: "The business depends on tips and subsidies to survive",
              desc: "Without $43,000 in tip income and subsidies, CHOG would have lost $51,583 in 2025. That outside help has been shrinking ($82K in 2023, down to $43K now). The restaurant needs to be able to stand on its own.",
            },
            {
              icon: TrendingDown,
              iconColor: "text-red-500",
              bg: "bg-red-50",
              border: "border-red-200",
              title: "The business is getting smaller",
              desc: "What the business owns (assets) dropped from $99,600 to $44,200 in three years — a 56% decline. This means less cushion for unexpected expenses and less ability to invest in improvements or growth.",
            },
            {
              icon: Target,
              iconColor: "text-blue-500",
              bg: "bg-blue-50",
              border: "border-blue-200",
              title: "Here's what it would take to break even",
              desc: "Just to hit $0 profit, CHOG needs $331K in revenue — only $12K more. But for the owner to earn a fair $70K salary (instead of $19/hr), revenue needs to reach $373K — a $54K gap. See the Break-Even Analysis page for scenarios that close it.",
            },
          ].map((item, i) => (
            <div key={i} className={cn("p-4 rounded-xl border", item.bg, item.border)}>
              <div className="flex gap-3">
                <item.icon className={cn("w-5 h-5 mt-0.5 shrink-0", item.iconColor)} />
                <div>
                  <p className="font-semibold text-sm text-slate-800">{item.title}</p>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
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
