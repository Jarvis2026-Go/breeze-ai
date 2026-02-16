"use client";

import { cn } from "@/lib/utils";
import { yearlyData, cogsBreakdown } from "@/lib/data";
import { formatCurrency } from "@/lib/formatting";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  ComposedChart,
  Area,
  ReferenceLine,
} from "recharts";
import { ArrowDown, ArrowUp, CheckCircle2, AlertTriangle } from "lucide-react";

// Sales each year with change
const salesData = yearlyData.map((d, i) => ({
  year: d.year.toString(),
  Sales: d.foodSales,
  "Change vs. Prior Year": i === 0
    ? 0
    : +((d.foodSales - yearlyData[i - 1].foodSales) / yearlyData[i - 1].foodSales * 100).toFixed(1),
}));

// What goes into food costs
const ingredientData = cogsBreakdown.map((d) => ({
  year: d.year.toString(),
  Alcohol: d.alcohol,
  "Food Purchases": d.foodPurchases,
  "Restaurant Supplies": d.restaurantSupplies,
}));

// Food cost as a share of sales
const foodCostPctData = yearlyData.map((d) => ({
  year: d.year.toString(),
  "Cents per Dollar on Food": +((d.totalCOGS / d.foodSales) * 100).toFixed(1),
}));

// What's left after food costs
const afterFoodData = yearlyData.map((d) => ({
  year: d.year.toString(),
  "Left After Food Costs": d.grossProfit,
  "% Kept": +((d.grossProfit / d.foodSales) * 100).toFixed(1),
}));

export default function RevenuePage() {
  return (
    <div className="space-y-8 max-w-[1400px]">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Sales & Food Costs</h1>
        <p className="text-slate-500 mt-1">
          How much is coming in the door, what it costs to buy ingredients, and how much is left after food costs.
        </p>
      </div>

      {/* Quick Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">2025 Sales</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">$319,177</p>
          <div className="flex items-center gap-1.5 mt-2">
            <ArrowDown className="w-4 h-4 text-red-500" />
            <span className="text-sm font-semibold text-red-600">Down $33,333 from 2024</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">Spent on Food & Supplies</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">$74,148</p>
          <div className="flex items-center gap-1.5 mt-2">
            <ArrowDown className="w-4 h-4 text-green-500" />
            <span className="text-sm font-semibold text-green-600">Down $21,766 — great cost control</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">Left After Food Costs</p>
          <p className="text-2xl font-bold text-green-600 mt-1">$245,029</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-sm text-slate-500">77 cents of every dollar — strong</span>
          </div>
        </div>
      </div>

      {/* Sales Trend */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Are Sales Growing or Shrinking?</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          The bars show total sales. The purple line shows whether sales went up or down compared to the year before.
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={salesData}>
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
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              formatter={(value: unknown, name: unknown) =>
                typeof value === "number"
                  ? (String(name).includes("Change") ? `${value}%` : formatCurrency(value))
                  : "N/A"
              }
              contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
            />
            <Legend wrapperStyle={{ fontSize: "13px" }} />
            <ReferenceLine yAxisId="right" y={0} stroke="#94a3b8" strokeDasharray="3 3" />
            <Bar yAxisId="left" dataKey="Sales" fill="#2EC4B6" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="Change vs. Prior Year" stroke="#6366F1" strokeWidth={2} dot={{ r: 5, fill: "#6366F1" }} />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-sm text-slate-600">
              Sales grew a little in 2024 (+3.1%) but dropped sharply in 2025 (-9.5%). That&apos;s a $33K drop.
              Meanwhile, most Toronto restaurants saw their sales grow during this period.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* What's in the food costs */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">What Are You Buying?</h2>
          <p className="text-sm text-slate-500 mt-1 mb-4">
            Your food cost breaks down into three categories. All three have been going down — this is a strong area.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ingredientData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={13} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                formatter={(value: unknown) => typeof value === "number" ? formatCurrency(value) : "N/A"}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <Legend wrapperStyle={{ fontSize: "13px" }} />
              <Bar dataKey="Alcohol" stackId="a" fill="#8B5CF6" />
              <Bar dataKey="Food Purchases" stackId="a" fill="#F59E0B" />
              <Bar dataKey="Restaurant Supplies" stackId="a" fill="#2EC4B6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* How much per dollar goes to food */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Food Cost Per Dollar of Sales</h2>
          <p className="text-sm text-slate-500 mt-1 mb-4">
            This shows how many cents of each sales dollar goes to buying food and supplies.
            Lower is better — and CHOG is doing great here, well below the 32-cent average.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={foodCostPctData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={13} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(v) => `${v}¢`}
                domain={[0, 40]}
              />
              <Tooltip
                formatter={(value: unknown) => typeof value === "number" ? `${value} cents per dollar` : "N/A"}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <ReferenceLine y={32} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="6 4" label={{ value: "Industry avg: 32¢", fontSize: 11, fill: "#94a3b8", position: "top" }} />
              <Line
                type="monotone"
                dataKey="Cents per Dollar on Food"
                stroke="#22C55E"
                strokeWidth={3}
                dot={{ r: 6, fill: "#22C55E" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-3 flex items-center gap-6 text-sm">
            <span className="text-slate-500">2023: 34¢</span>
            <span className="text-slate-400">&rarr;</span>
            <span className="text-slate-500">2024: 27¢</span>
            <span className="text-slate-400">&rarr;</span>
            <span className="text-green-600 font-bold">2025: 23¢</span>
          </div>
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <p className="text-sm text-slate-600">
                Huge improvement — from 34 cents down to 23 cents per dollar. That means the restaurant
                is saving about $11 on every $100 in sales compared to 2023. For an organic/local restaurant, this is excellent.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What's Left After Food */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">What&apos;s Left After Paying for Food?</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          This is the money available to pay for everything else — staff, rent, utilities, and (hopefully) profit.
          The percentage shows how many cents of each dollar are left.
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={afterFoodData}>
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
              tickFormatter={(v) => `${v}¢`}
              domain={[60, 80]}
            />
            <Tooltip
              formatter={(value: unknown, name: unknown) =>
                typeof value === "number"
                  ? (String(name).includes("%") ? `${value} cents per dollar` : formatCurrency(value))
                  : "N/A"
              }
              contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
            />
            <Legend wrapperStyle={{ fontSize: "13px" }} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="Left After Food Costs"
              fill="#2EC4B6"
              fillOpacity={0.2}
              stroke="#2EC4B6"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="% Kept"
              stroke="#6366F1"
              strokeWidth={2}
              dot={{ r: 5, fill: "#6366F1" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-3 p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600">
            <strong>The good news:</strong> CHOG keeps about 77 cents of every dollar after food costs — up from 66 cents in 2023.
            The average restaurant only keeps about 68 cents. The challenge is that staff costs and other bills eat up
            more than what&apos;s left, which is why the restaurant still loses money overall.
          </p>
        </div>
      </div>
    </div>
  );
}
