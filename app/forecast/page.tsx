"use client";

import { cn } from "@/lib/utils";
import { revenueForecast, netIncomeForecast, yearlyData } from "@/lib/data";
import { formatCurrency } from "@/lib/formatting";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import {
  AlertTriangle,
  TrendingDown,
  ShieldAlert,
  Lightbulb,
  Target,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";

// ── Data ─────────────────────────────────────────────────────

const revChartData = revenueForecast.map((d) => ({
  year: d.year.toString(),
  Actual: d.actual || null,
  "Where It's Heading": d.projected || null,
  "Best Case": d.upper || null,
  "Worst Case": d.lower || null,
}));

const niChartData = netIncomeForecast.map((d) => ({
  year: d.year.toString(),
  Actual: d.actual || null,
  "Where It's Heading": d.projected || null,
  "Best Case": d.upper || null,
  "Worst Case": d.lower || null,
}));

// ── Page ─────────────────────────────────────────────────────

export default function ForecastPage() {
  return (
    <div className="space-y-8 max-w-[1400px]">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          What Happens Next?
        </h1>
        <p className="text-slate-500 mt-1">
          Based on the last 3 years of data, here&apos;s where the restaurant
          is heading if nothing changes — and what it would take to turn things
          around.
        </p>
      </div>

      {/* ── The Quick Outlook — 3 cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-red-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-lg bg-red-50">
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Sales Projection (2027)</p>
              <p className="text-2xl font-bold text-red-600">~$295K</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mb-2">
            <ArrowDown className="w-4 h-4 text-red-500" />
            <span className="text-sm font-semibold text-red-600">
              Could drop another $24K
            </span>
          </div>
          <p className="text-sm text-slate-500">
            If the current downward trend continues, sales could fall below
            $300K by 2027. That would be a 14% drop from the 2024 peak.
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-red-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-lg bg-red-50">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500">
                Projected Loss (2027)
              </p>
              <p className="text-2xl font-bold text-red-600">~-$22K</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mb-2">
            <ArrowDown className="w-4 h-4 text-red-500" />
            <span className="text-sm font-semibold text-red-600">
              Losses getting deeper
            </span>
          </div>
          <p className="text-sm text-slate-500">
            The trajectory is clear: $18K profit in 2023, $7.5K in 2024, -$7.4K
            in 2025, and heading toward -$22K by 2027. Each year gets harder.
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-amber-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-lg bg-amber-50">
              <Target className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500">To Break Even</p>
              <p className="text-2xl font-bold text-slate-900">~$360K</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            CHOG would need about <strong>$360K in annual sales</strong> at
            current cost levels to stop losing money — that&apos;s $41K more
            than 2025. Alternatively, cut costs by ~$27K at current sales.
          </p>
        </div>
      </div>

      {/* ── Sales Forecast Chart ── */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          Where Are Sales Heading?
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-1">
          The solid line shows actual sales. The dashed line shows where
          they&apos;re projected to go. The shaded area shows the range of
          possibilities — best case to worst case.
        </p>
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <p className="text-xs text-slate-400">
            Projections based on the 3-year trend. Real results will depend on
            what actions the business takes.
          </p>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={revChartData}>
            <defs>
              <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2EC4B6" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#2EC4B6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" stroke="#94a3b8" fontSize={13} />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              formatter={(value: unknown) =>
                typeof value === "number" ? formatCurrency(value) : "N/A"
              }
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "13px" }} />
            <Area
              type="monotone"
              dataKey="Best Case"
              stroke="none"
              fill="url(#bandGrad)"
            />
            <Area
              type="monotone"
              dataKey="Worst Case"
              stroke="none"
              fill="transparent"
              name=" "
            />
            <Area
              type="monotone"
              dataKey="Actual"
              stroke="#2EC4B6"
              fill="none"
              strokeWidth={3}
              dot={{ r: 5, fill: "#2EC4B6" }}
              connectNulls={false}
            />
            <Area
              type="monotone"
              dataKey="Where It's Heading"
              stroke="#2EC4B6"
              fill="none"
              strokeWidth={3}
              strokeDasharray="8 4"
              dot={{
                r: 5,
                fill: "#2EC4B6",
                strokeDasharray: "0",
              }}
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">2026 Estimate</p>
            <p className="text-lg font-bold text-slate-900">~$305K</p>
            <p className="text-xs text-slate-400">
              Range: $280K to $330K
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">2027 Estimate</p>
            <p className="text-lg font-bold text-slate-900">~$295K</p>
            <p className="text-xs text-slate-400">
              Range: $260K to $330K
            </p>
          </div>
        </div>
      </div>

      {/* ── Net Income Forecast Chart ── */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          Will the Restaurant Make or Lose Money?
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          This chart shows the bottom line — what&apos;s actually left after
          paying every bill. Below the dotted line means the restaurant is losing
          money.
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={niChartData}>
            <defs>
              <linearGradient id="niBandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF6B6B" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#FF6B6B" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" stroke="#94a3b8" fontSize={13} />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              formatter={(value: unknown) =>
                typeof value === "number" ? formatCurrency(value) : "N/A"
              }
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "13px" }} />
            <ReferenceLine
              y={0}
              stroke="#94a3b8"
              strokeDasharray="3 3"
              label={{
                value: "Break even",
                fontSize: 11,
                fill: "#94a3b8",
              }}
            />
            <Area
              type="monotone"
              dataKey="Best Case"
              stroke="none"
              fill="url(#niBandGrad)"
            />
            <Area
              type="monotone"
              dataKey="Worst Case"
              stroke="none"
              fill="transparent"
              name=" "
            />
            <Area
              type="monotone"
              dataKey="Actual"
              stroke="#FF6B6B"
              fill="none"
              strokeWidth={3}
              dot={{ r: 5, fill: "#FF6B6B" }}
              connectNulls={false}
            />
            <Area
              type="monotone"
              dataKey="Where It's Heading"
              stroke="#FF6B6B"
              fill="none"
              strokeWidth={3}
              strokeDasharray="8 4"
              dot={{
                r: 5,
                fill: "#FF6B6B",
                strokeDasharray: "0",
              }}
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex gap-2">
            <TrendingDown className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-slate-600">
              <strong>The trend is clear:</strong> The restaurant went from
              making $18.5K (2023) to losing $7.4K (2025). Without changes, the
              worst-case scenario by 2027 is a loss of up to $45K in a single
              year.
            </p>
          </div>
        </div>
      </div>

      {/* ── What Could Go Wrong + What Could Go Right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risks */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            What Could Go Wrong
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            These are the biggest threats to the business if nothing changes.
          </p>
          <div className="space-y-4">
            {[
              {
                icon: TrendingDown,
                severity: "high" as const,
                title: "Sales keep falling",
                desc: "Without action, food sales could drop below $300K by 2027. That means even less money to cover staff and bills — and the losses get deeper every year.",
              },
              {
                icon: AlertTriangle,
                severity: "high" as const,
                title: "Staff costs become impossible to sustain",
                desc: "Staff wages are already 49 cents of every dollar. If sales drop further, that ratio gets even worse. At some point, there isn't enough money coming in to pay the team.",
              },
              {
                icon: ShieldAlert,
                severity: "medium" as const,
                title: "Tips and subsidies could dry up",
                desc: "The restaurant depends on $43K+ in tip income and government subsidies just to stay close to break even. This money isn't guaranteed — it dropped from $82K in 2023 to $43K already.",
              },
              {
                icon: AlertTriangle,
                severity: "high" as const,
                title: "Nothing left for emergencies",
                desc: "The business's assets dropped 56% in 3 years (from $99K to $44K). If something breaks, there's less and less cushion to fall back on.",
              },
            ].map((risk, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-4 p-4 rounded-lg border",
                  risk.severity === "high"
                    ? "bg-red-50 border-red-200"
                    : "bg-amber-50 border-amber-200"
                )}
              >
                <risk.icon
                  className={cn(
                    "w-5 h-5 mt-0.5 shrink-0",
                    risk.severity === "high"
                      ? "text-red-500"
                      : "text-amber-500"
                  )}
                />
                <div>
                  <p
                    className={cn(
                      "font-semibold text-sm",
                      risk.severity === "high"
                        ? "text-red-800"
                        : "text-amber-800"
                    )}
                  >
                    {risk.title}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">{risk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What to do about it */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="w-5 h-5 text-teal" />
            <h2 className="text-lg font-bold text-slate-900">
              What Can Be Done
            </h2>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Practical steps that could change the trajectory. The more of these
            that happen, the better the outlook.
          </p>
          <div className="space-y-4">
            {[
              {
                number: 1,
                title: "Figure out why sales are dropping",
                desc: "Is it fewer customers, lower prices, or stronger competitors? The answer determines the fix. Look at foot traffic, average check size, and what nearby restaurants are doing.",
                impact: "Could recover $20-30K in annual sales",
              },
              {
                number: 2,
                title: "Get staffing costs closer to normal",
                desc: "The target is about 34-40 cents per dollar on staff. Look at scheduling efficiency, shift optimization, and whether the team size matches the current sales level.",
                impact: "Could save $22-46K per year",
              },
              {
                number: 3,
                title: "Find new ways to bring in money",
                desc: "Catering, delivery partnerships, private events, meal kits — these can add sales without much extra cost. Even $30-40K from new channels would change the picture.",
                impact: "Could add $30-50K in revenue",
              },
              {
                number: 4,
                title: "Stop depending on tips and subsidies",
                desc: "Right now, the restaurant needs $43K from tips and government help just to survive. Build a plan to make the core business profitable on its own.",
                impact: "Reduces vulnerability to income shocks",
              },
              {
                number: 5,
                title: "Rethink the menu to drive sales",
                desc: "Keep the local/organic identity but engineer the menu to encourage higher-margin items. Small changes to pricing and presentation can boost revenue without new customers.",
                impact: "Could improve margins by 3-5%",
              },
            ].map((item) => (
              <div key={item.number} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-teal/10 text-teal text-sm font-bold flex items-center justify-center mt-0.5">
                  {item.number}
                </span>
                <div>
                  <p className="font-semibold text-sm text-slate-800">
                    {item.title}
                  </p>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                  <p className="text-xs font-medium text-teal mt-1.5">
                    Potential impact: {item.impact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── The Bottom Line ── */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-white mb-3">The Bottom Line</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-slate-300 text-sm leading-relaxed">
              CHOG is at a crossroads. The restaurant has real strengths — amazing
              food cost control (23 cents per dollar vs. the 32-cent average) and a
              clear identity as a local, organic, seasonal restaurant.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed mt-3">
              But the math doesn&apos;t lie: sales are dropping, staffing costs are
              too high, and the business depends on outside income to survive. Without
              changes, the losses will keep getting bigger.
            </p>
          </div>
          <div>
            <p className="text-slate-300 text-sm leading-relaxed">
              The good news is that the path to profitability is clear. The
              restaurant doesn&apos;t need a miracle — it needs to either{" "}
              <strong className="text-white">grow sales to ~$360K</strong> or{" "}
              <strong className="text-white">cut ~$27K in costs</strong> (mostly
              staffing). Ideally, a bit of both.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed mt-3">
              Every month that passes without action makes the turnaround harder.
              The best time to start is now.
            </p>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="text-xs text-slate-400 pt-4 border-t border-slate-100">
        <p>
          Projections are based on CHOG&apos;s 3-year financial trend (2023-2025)
          and assume no major changes to operations. Actual results will depend on
          management actions, market conditions, and economic factors. The range
          (best/worst case) reflects the uncertainty inherent in any forecast.
        </p>
      </div>
    </div>
  );
}
