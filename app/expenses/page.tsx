"use client";

import { ChartCard } from "@/components/chart-card";
import {
  yearlyData,
  expenseCategories2025,
  expenseCategories2024,
  expenseCategories2023,
  wageData,
} from "@/lib/data";
import { formatCurrency, formatPercent } from "@/lib/formatting";
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
} from "recharts";

const donutData = expenseCategories2025.map((c) => ({
  name: c.name,
  value: c.amount,
  color: c.color,
}));

const topExpenses = [...expenseCategories2025].sort((a, b) => b.amount - a.amount);

const expenseTrendData = [
  {
    year: "2023",
    Payroll: 153551,
    "Tips Paid": 32400,
    Rent: 36000,
    Insurance: 17200,
    Other: 46312,
  },
  {
    year: "2024",
    Payroll: 147944,
    "Tips Paid": 38200,
    Rent: 36000,
    Insurance: 17800,
    Other: 51526,
  },
  {
    year: "2025",
    Payroll: 155137,
    "Tips Paid": 35420,
    Rent: 36000,
    Insurance: 18500,
    Other: 51556,
  },
];

const payrollRatioData = yearlyData.map((d) => ({
  year: d.year.toString(),
  "Payroll % of Revenue": +((d.payroll / d.foodSales) * 100).toFixed(1),
}));

export default function ExpensesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Expenses & Wages</h1>
        <p className="text-slate-500 mt-1">Expense breakdown and payroll analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="2025 Expense Breakdown" subtitle="By category">
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
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={true}
              >
                {donutData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Expenses (2025)" subtitle="Ranked by amount">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={topExpenses} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis
                type="number"
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#94a3b8"
                fontSize={12}
                width={120}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                {topExpenses.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Expense Trend (3 Years)" subtitle="Stacked by major categories">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={expenseTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <Legend />
              <Area type="monotone" dataKey="Payroll" stackId="1" fill="#2EC4B6" stroke="#2EC4B6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="Tips Paid" stackId="1" fill="#FF6B6B" stroke="#FF6B6B" fillOpacity={0.6} />
              <Area type="monotone" dataKey="Rent" stackId="1" fill="#6366F1" stroke="#6366F1" fillOpacity={0.6} />
              <Area type="monotone" dataKey="Insurance" stackId="1" fill="#F59E0B" stroke="#F59E0B" fillOpacity={0.6} />
              <Area type="monotone" dataKey="Other" stackId="1" fill="#94A3B8" stroke="#94A3B8" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Payroll as % of Revenue" subtitle="Rising trend is concerning">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={payrollRatioData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(v) => `${v}%`}
                domain={[40, 55]}
              />
              <Tooltip
                formatter={(value: number) => `${value}%`}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <Line
                type="monotone"
                dataKey="Payroll % of Revenue"
                stroke="#FF6B6B"
                strokeWidth={3}
                dot={{ r: 6, fill: "#FF6B6B" }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <span className="text-slate-500">2023: 44.9%</span>
            <span className="text-slate-400">→</span>
            <span className="text-slate-500">2024: 42.0%</span>
            <span className="text-slate-400">→</span>
            <span className="text-negative font-semibold">2025: 48.6%</span>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Wage Summary" subtitle="Employee payroll breakdown (2025)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Employee</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Role</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">Annual Pay</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">% of Payroll</th>
              </tr>
            </thead>
            <tbody>
              {wageData.map((emp) => (
                <tr key={emp.name} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-900">{emp.name}</td>
                  <td className="py-3 px-4 text-slate-600">{emp.role}</td>
                  <td className="py-3 px-4 text-right tabular-nums">{formatCurrency(emp.annualPay)}</td>
                  <td className="py-3 px-4 text-right tabular-nums text-slate-500">
                    {((emp.annualPay / 155137) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-300 font-semibold">
                <td className="py-3 px-4 text-slate-900" colSpan={2}>Total</td>
                <td className="py-3 px-4 text-right tabular-nums text-slate-900">
                  {formatCurrency(wageData.reduce((sum, e) => sum + e.annualPay, 0))}
                </td>
                <td className="py-3 px-4 text-right tabular-nums text-slate-900">100.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
