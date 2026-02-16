"use client";

import { cn } from "@/lib/utils";
import {
  yearlyData,
  expenseCategories2025,
  wageData,
} from "@/lib/data";
import { formatCurrency } from "@/lib/formatting";
import {
  PieChart,
  Pie,
  Cell,
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
  AreaChart,
  Area,
  ReferenceLine,
} from "recharts";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Users,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Lightbulb,
} from "lucide-react";

// ── Data ─────────────────────────────────────────────────────

const d25 = yearlyData[2];
const d24 = yearlyData[1];
const d23 = yearlyData[0];

const totalExpenses25 = d25.totalExpenses;
const totalPayroll = 155137;

// Pie chart data — where do the bills go?
const donutData = expenseCategories2025.map((c) => ({
  name: c.name,
  value: c.amount,
  color: c.color,
}));

// Expense trend over 3 years
const expenseTrendData = [
  {
    year: "2023",
    Payroll: 153551,
    "Tips Paid Out": 32400,
    Rent: 36000,
    Insurance: 17200,
    "Everything Else": 46312,
  },
  {
    year: "2024",
    Payroll: 147944,
    "Tips Paid Out": 38200,
    Rent: 36000,
    Insurance: 17800,
    "Everything Else": 51526,
  },
  {
    year: "2025",
    Payroll: 155137,
    "Tips Paid Out": 35420,
    Rent: 36000,
    Insurance: 18500,
    "Everything Else": 51556,
  },
];

// Payroll as a share of sales
const payrollRatioData = yearlyData.map((d) => ({
  year: d.year.toString(),
  "Cents per Dollar on Staff": +((d.payroll / d.foodSales) * 100).toFixed(1),
}));

// Group wage data by role type for insights
const kitchenStaff = wageData.filter((w) =>
  ["Head Chef", "Line Cook", "Prep Cook", "Dishwasher"].includes(w.role)
);
const frontStaff = wageData.filter((w) =>
  ["Lead Server", "Server", "Bartender", "Host", "Busser"].includes(w.role)
);
const mgmt = wageData.filter((w) => w.role === "General Manager");
const kitchenTotal = kitchenStaff.reduce((s, w) => s + w.annualPay, 0);
const frontTotal = frontStaff.reduce((s, w) => s + w.annualPay, 0);
const mgmtTotal = mgmt.reduce((s, w) => s + w.annualPay, 0);
const partTimeTotal = wageData
  .filter((w) => w.role === "Part-time")
  .reduce((s, w) => s + w.annualPay, 0);

// ── Page ─────────────────────────────────────────────────────

export default function ExpensesPage() {
  return (
    <div className="space-y-8 max-w-[1400px]">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Expenses & Wages
        </h1>
        <div className="h-1 w-16 bg-gradient-to-r from-teal to-teal-dark rounded-full mt-2 mb-3" />
        <p className="text-sm font-medium bg-gradient-to-r from-teal to-teal-dark bg-clip-text text-transparent">
          Where the money goes after food is bought — staff, rent, utilities,
          and everything else it costs to keep the restaurant running.
        </p>
      </div>

      {/* ── Quick Summary — 3 cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-lg bg-slate-100">
              <DollarSign className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Bills (2025)</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(totalExpenses25)}
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-500">
            This is everything it cost to run CHOG in 2025 — not counting food
            purchases. It&apos;s up from {formatCurrency(d24.totalExpenses)} in
            2024.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-red-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-lg bg-red-50">
              <Users className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Staff Wages</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(totalPayroll)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mb-2">
            <ArrowUp className="w-4 h-4 text-red-500" />
            <span className="text-sm font-semibold text-red-600">
              Up $7,193 from last year
            </span>
          </div>
          <p className="text-sm text-slate-500">
            That&apos;s <strong>49 cents</strong> of every dollar earned. The
            average restaurant pays about 34 cents.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-lg bg-slate-100">
              <DollarSign className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Fixed Costs (Rent + Insurance)</p>
              <p className="text-2xl font-bold text-slate-900">$54,500</p>
            </div>
          </div>
          <p className="text-sm text-slate-500">
            Rent ($36,000) and insurance ($18,500) are locked in — they don&apos;t
            change whether the restaurant is busy or slow. That&apos;s about 17
            cents of every dollar.
          </p>
        </div>
      </div>

      {/* ── Where Do the Bills Go? (Pie + breakdown) ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          Where Does the Money Go?
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          This breaks down every dollar spent on running costs in 2025 (not
          including food purchases, which are covered on the Sales & Food Costs
          page).
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {donutData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: unknown) =>
                    typeof value === "number" ? formatCurrency(value) : "N/A"
                  }
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 flex flex-col justify-center">
            {expenseCategories2025
              .sort((a, b) => b.amount - a.amount)
              .map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        {item.name}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(item.amount / totalExpenses25) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            <div className="mt-2 p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600">
                <strong>What stands out:</strong> Over half of all running costs
                go to staff wages alone. That&apos;s the single biggest lever
                for improving profitability.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── How Bills Have Changed Over Time ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          How Have Bills Changed Over 3 Years?
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Each colored band shows a major cost category. The total height shows
          how much CHOG spent overall. Notice that the total keeps going up even
          as sales went down.
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={expenseTrendData}>
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
              dataKey="Payroll"
              stackId="1"
              fill="#2EC4B6"
              stroke="#2EC4B6"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="Tips Paid Out"
              stackId="1"
              fill="#FF6B6B"
              stroke="#FF6B6B"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="Rent"
              stackId="1"
              fill="#6366F1"
              stroke="#6366F1"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="Insurance"
              stackId="1"
              fill="#F59E0B"
              stroke="#F59E0B"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="Everything Else"
              stackId="1"
              fill="#94A3B8"
              stroke="#94A3B8"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[
            { year: "2023", total: 285463 },
            { year: "2024", total: 291470 },
            { year: "2025", total: 296613 },
          ].map((d) => (
            <div key={d.year} className="text-center p-3 bg-slate-50 rounded-lg">
              <p className="text-sm font-bold text-slate-400">{d.year}</p>
              <p className="text-lg font-bold text-slate-900">
                {formatCurrency(d.total, true)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-sm text-slate-600">
              Total bills went up by $11,000 over 3 years while sales dropped by
              $23,000. That&apos;s the scissor effect — costs rising while
              revenue falls. This is what&apos;s squeezing the business.
            </p>
          </div>
        </div>
      </div>

      {/* ── The Staff Cost Problem ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          How Much of Each Dollar Goes to Staff?
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          This tracks what share of every sales dollar goes to paying staff. The
          dashed line is what a typical restaurant pays. CHOG has been well above
          this every year.
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={payrollRatioData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" stroke="#94a3b8" fontSize={13} />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={(v) => `${v}¢`}
              domain={[25, 55]}
            />
            <Tooltip
              formatter={(value: unknown) =>
                typeof value === "number"
                  ? `${value} cents per dollar`
                  : "N/A"
              }
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            />
            <ReferenceLine
              y={34}
              stroke="#22C55E"
              strokeWidth={1.5}
              strokeDasharray="6 4"
              label={{
                value: "Average restaurant: 34¢",
                fontSize: 11,
                fill: "#22C55E",
                position: "top",
              }}
            />
            <Line
              type="monotone"
              dataKey="Cents per Dollar on Staff"
              stroke="#FF6B6B"
              strokeWidth={3}
              dot={{ r: 6, fill: "#FF6B6B" }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-6 mt-4 text-sm">
          <span className="text-slate-500">2023: 45¢</span>
          <span className="text-slate-400">&rarr;</span>
          <span className="text-slate-500">2024: 42¢</span>
          <span className="text-slate-400">&rarr;</span>
          <span className="text-red-600 font-bold">2025: 49¢</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold text-red-800">
                15 cents above average
              </span>
            </div>
            <p className="text-xs text-slate-600">
              CHOG pays 49 cents per dollar vs. the 34-cent average. On $319K in
              sales, that 15-cent gap equals about <strong>$46,000/year</strong>{" "}
              in extra staffing costs compared to a typical restaurant.
            </p>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-amber-800">
                Got worse in 2025
              </span>
            </div>
            <p className="text-xs text-slate-600">
              It improved in 2024 (down to 42¢) but shot back up in 2025
              because sales dropped while payroll actually increased by $7,193.
              Fewer sales dollars are carrying more staff cost.
            </p>
          </div>
        </div>
      </div>

      {/* ── Who Gets Paid What ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          Who Gets Paid What? (2025)
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          A breakdown of every team member&apos;s annual pay. The total payroll
          is {formatCurrency(totalPayroll)} across{" "}
          {wageData.length} people.
        </p>

        {/* Role group summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Management",
              total: mgmtTotal,
              count: mgmt.length,
              color: "bg-blue-50 border-blue-200",
            },
            {
              label: "Kitchen",
              total: kitchenTotal,
              count: kitchenStaff.length,
              color: "bg-teal/5 border-teal/20",
            },
            {
              label: "Front of House",
              total: frontTotal,
              count: frontStaff.length,
              color: "bg-purple-50 border-purple-200",
            },
            {
              label: "Part-time",
              total: partTimeTotal,
              count: 1,
              color: "bg-slate-50 border-slate-200",
            },
          ].map((g) => (
            <div
              key={g.label}
              className={cn("p-3 rounded-lg border text-center", g.color)}
            >
              <p className="text-xs text-slate-500">{g.label}</p>
              <p className="text-lg font-bold text-slate-900">
                {formatCurrency(g.total, true)}
              </p>
              <p className="text-xs text-slate-400">
                {g.count} {g.count === 1 ? "person" : "people"}
              </p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-600">
                  Person
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">
                  Role
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">
                  Annual Pay
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">
                  Share of Total
                </th>
              </tr>
            </thead>
            <tbody>
              {wageData.map((emp) => {
                const pct = ((emp.annualPay / totalPayroll) * 100).toFixed(1);
                return (
                  <tr
                    key={emp.name}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {emp.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{emp.role}</td>
                    <td className="py-3 px-4 text-right tabular-nums">
                      {formatCurrency(emp.annualPay)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-teal"
                            style={{
                              width: `${(emp.annualPay / totalPayroll) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs tabular-nums text-slate-500 w-10 text-right">
                          {pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-slate-300 font-semibold">
                <td className="py-3 px-4 text-slate-900" colSpan={2}>
                  Total
                </td>
                <td className="py-3 px-4 text-right tabular-nums text-slate-900">
                  {formatCurrency(totalPayroll)}
                </td>
                <td className="py-3 px-4 text-right tabular-nums text-slate-900">
                  100%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Key Takeaways ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-5">
          <Lightbulb className="w-5 h-5 text-teal" />
          <h2 className="text-lg font-bold text-slate-900">Key Takeaways</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: XCircle,
              iconColor: "text-red-500",
              bg: "bg-red-50",
              border: "border-red-200",
              title: "Staffing is the #1 problem",
              desc: "At 49 cents per dollar, staff costs are 44% higher than the industry average. Even a modest improvement — getting to 42 cents — would save about $22,000 a year.",
            },
            {
              icon: AlertTriangle,
              iconColor: "text-amber-500",
              bg: "bg-amber-50",
              border: "border-amber-200",
              title: "Costs went up while sales went down",
              desc: "Total operating costs rose from $285K to $297K over three years, while sales dropped from $342K to $319K. This widening gap is unsustainable.",
            },
            {
              icon: AlertTriangle,
              iconColor: "text-amber-500",
              bg: "bg-amber-50",
              border: "border-amber-200",
              title: "Top 2 people earn 63% of payroll",
              desc: "The General Manager ($52K) and Head Chef ($45K) together earn $97K — 63% of total payroll. This top-heavy structure leaves limited budget for the rest of the team.",
            },
            {
              icon: CheckCircle2,
              iconColor: "text-green-500",
              bg: "bg-green-50",
              border: "border-green-200",
              title: "Fixed costs are reasonable",
              desc: "Rent at $36K and insurance at $18.5K are in line with what you'd expect for a Toronto restaurant. These aren't the problem — the focus should be on variable costs like staffing.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={cn("p-4 rounded-xl border", item.bg, item.border)}
            >
              <div className="flex gap-3">
                <item.icon
                  className={cn("w-5 h-5 mt-0.5 shrink-0", item.iconColor)}
                />
                <div>
                  <p className="font-semibold text-sm text-slate-800">
                    {item.title}
                  </p>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
