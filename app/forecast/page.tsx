"use client";

import { ChartCard } from "@/components/chart-card";
import { revenueForecast, netIncomeForecast } from "@/lib/data";
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
import { AlertTriangle, TrendingDown, ShieldAlert, Lightbulb } from "lucide-react";

const revChartData = revenueForecast.map((d) => ({
  year: d.year.toString(),
  Actual: d.actual || null,
  Projected: d.projected || null,
  Lower: d.lower || null,
  Upper: d.upper || null,
}));

const niChartData = netIncomeForecast.map((d) => ({
  year: d.year.toString(),
  Actual: d.actual || null,
  Projected: d.projected || null,
  Lower: d.lower || null,
  Upper: d.upper || null,
}));

const risks = [
  {
    icon: TrendingDown,
    title: "Continued Revenue Decline",
    description: "Without intervention, food sales could fall below $300K by 2027 based on current trajectory.",
    severity: "high",
  },
  {
    icon: AlertTriangle,
    title: "Payroll Squeeze",
    description: "Payroll is already 48.6% of revenue. Further revenue decline will push this ratio to unsustainable levels.",
    severity: "high",
  },
  {
    icon: ShieldAlert,
    title: "Dependency on Other Income",
    description: "The business relies on $43K+ in tips and subsidies to avoid deep losses. This income stream is not guaranteed.",
    severity: "medium",
  },
  {
    icon: AlertTriangle,
    title: "Asset Erosion",
    description: "Total assets have shrunk 56% in 3 years. Continued contraction limits the ability to invest or weather downturns.",
    severity: "high",
  },
];

export default function ForecastPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Forecast & Outlook</h1>
        <p className="text-slate-500 mt-1">Projections and strategic recommendations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Projection" subtitle="2-year forecast with confidence bands">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={revChartData}>
              <defs>
                <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2EC4B6" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#2EC4B6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                formatter={(value: unknown) => typeof value === "number" ? formatCurrency(value) : "N/A"}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <Legend />
              <Area type="monotone" dataKey="Upper" stroke="none" fill="url(#bandGrad)" name="Confidence Band" />
              <Area type="monotone" dataKey="Lower" stroke="none" fill="transparent" name=" " />
              <Area type="monotone" dataKey="Actual" stroke="#2EC4B6" fill="none" strokeWidth={2} dot={{ r: 4, fill: "#2EC4B6" }} connectNulls={false} />
              <Area type="monotone" dataKey="Projected" stroke="#2EC4B6" fill="none" strokeWidth={2} strokeDasharray="8 4" dot={{ r: 4, fill: "#2EC4B6", strokeDasharray: "0" }} connectNulls={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Net Income Projection" subtitle="Trending toward deeper losses">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={niChartData}>
              <defs>
                <linearGradient id="niBandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6B6B" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#FF6B6B" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                formatter={(value: unknown) => typeof value === "number" ? formatCurrency(value) : "N/A"}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <Legend />
              <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
              <Area type="monotone" dataKey="Upper" stroke="none" fill="url(#niBandGrad)" name="Confidence Band" />
              <Area type="monotone" dataKey="Lower" stroke="none" fill="transparent" name=" " />
              <Area type="monotone" dataKey="Actual" stroke="#FF6B6B" fill="none" strokeWidth={2} dot={{ r: 4, fill: "#FF6B6B" }} connectNulls={false} />
              <Area type="monotone" dataKey="Projected" stroke="#FF6B6B" fill="none" strokeWidth={2} strokeDasharray="8 4" dot={{ r: 4, fill: "#FF6B6B", strokeDasharray: "0" }} connectNulls={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Key Risks" subtitle="Factors that could worsen outlook">
          <div className="space-y-4">
            {risks.map((risk, i) => (
              <div
                key={i}
                className={`flex gap-4 p-4 rounded-lg border ${
                  risk.severity === "high"
                    ? "bg-red-50 border-red-200"
                    : "bg-amber-50 border-amber-200"
                }`}
              >
                <risk.icon
                  className={`w-5 h-5 mt-0.5 shrink-0 ${
                    risk.severity === "high" ? "text-red-500" : "text-amber-500"
                  }`}
                />
                <div>
                  <p className={`font-medium text-sm ${
                    risk.severity === "high" ? "text-red-800" : "text-amber-800"
                  }`}>
                    {risk.title}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">{risk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Strategic Recommendations" subtitle="AI-generated outlook and action items">
          <div className="space-y-6">
            <div className="prose prose-sm max-w-none">
              <p className="text-slate-700 leading-relaxed">
                CHOG faces a critical inflection point. While cost-of-goods efficiency has improved dramatically
                (COGS ratio down from 34.4% to 23.2%), the business cannot cost-cut its way to profitability.
                The core issue is <strong>revenue decline combined with rising payroll costs</strong>.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Operating losses have been masked by other income (tips and subsidies), but this is
                not a sustainable strategy. Without structural changes, the business will likely post
                increasing losses through 2027.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-teal" />
                Recommended Actions
              </h4>
              <div className="space-y-2">
                {[
                  "Investigate root cause of 9.5% revenue decline — customer traffic, menu pricing, or competitive pressure",
                  "Optimize labor scheduling to bring payroll ratio back under 45% of revenue",
                  "Explore new revenue streams (catering, delivery partnerships, private events)",
                  "Develop a plan to reduce dependency on tip/subsidy income",
                  "Consider menu engineering to maintain or improve gross margins while driving volume",
                ].map((rec, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal/10 text-teal text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
