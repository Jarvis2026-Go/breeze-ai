"use client";

import { useState } from "react";
import { yearlyData, wageData } from "@/lib/data";
import { formatCurrency, formatPercent } from "@/lib/formatting";
import { Users, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

// ── 2025 data ──
const revenue = yearlyData[2].foodSales;
const currentLabor = yearlyData[2].payroll;
const cogs = yearlyData[2].totalCOGS;
const currentLaborPct = (currentLabor / revenue) * 100;

const industryTargetPct = 34;
const industryTarget = Math.round(revenue * (industryTargetPct / 100));
const laborGap = currentLabor - industryTarget;

// ── Hours ──
const totalYearlyHours = wageData.reduce((sum, w) => sum + w.hoursWorked, 0);
const currentHoursPerWeek = totalYearlyHours / 52;

// Revenue needed to make current labor = 34%
const revenueFor34 = Math.round(currentLabor / 0.34);

// ── Sorted staff roster ──
const sortedStaff = [...wageData].sort(
  (a, b) => b.hoursWorked - a.hoursWorked
);

export default function LaborPage() {
  const [mode, setMode] = useState<"hours" | "percent">("hours");
  const [hoursVal, setHoursVal] = useState(
    Math.round(currentHoursPerWeek)
  );
  const [pctVal, setPctVal] = useState(
    Math.round(currentLaborPct * 10) / 10
  );

  function handleHoursChange(v: number) {
    setHoursVal(v);
    const ratio = v / currentHoursPerWeek;
    setPctVal(
      Math.round(currentLaborPct * ratio * 10) / 10
    );
  }

  function handlePctChange(v: number) {
    setPctVal(v);
    const targetLabor = (v / 100) * revenue;
    const ratio = targetLabor / currentLabor;
    setHoursVal(Math.round(currentHoursPerWeek * ratio));
  }

  // ── Derived values ──
  const newLabor =
    mode === "hours"
      ? currentLabor * (hoursVal / currentHoursPerWeek)
      : (pctVal / 100) * revenue;
  const effectivePct = (newLabor / revenue) * 100;
  const effectiveHours =
    mode === "hours"
      ? hoursVal
      : currentHoursPerWeek * (newLabor / currentLabor);
  const savings = currentLabor - newLabor;
  const hoursCut = currentHoursPerWeek - effectiveHours;
  const fteEquiv = Math.abs(hoursCut) / 40;
  const newPrimeCost = ((cogs + newLabor) / revenue) * 100;

  // ── Visual bar scale ──
  const barMax = 55;

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Users className="w-7 h-7 text-teal" />
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Labor Cost Simulator
          </h1>
        </div>
        <div className="h-1 w-16 bg-gradient-to-r from-teal to-teal-dark rounded-full mt-2 mb-3" />
        <p className="text-sm font-medium bg-gradient-to-r from-teal to-teal-dark bg-clip-text text-transparent">
          Your biggest expense is staff &mdash; explore what different staffing
          levels would mean for your bottom line.
        </p>
      </div>

      {/* Current State KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
            Total Labor
          </p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {formatCurrency(currentLabor, true)}
          </p>
          <p className="text-xs text-red-500 font-semibold">
            {formatPercent(currentLaborPct)} of revenue
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-teal/20 text-center">
          <p className="text-[10px] font-medium text-teal uppercase tracking-wider">
            Industry Target (34%)
          </p>
          <p className="text-2xl font-black text-teal mt-1">
            {formatCurrency(industryTarget, true)}
          </p>
          <p className="text-xs text-slate-400">at current revenue</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-red-200 text-center">
          <p className="text-[10px] font-medium text-red-600 uppercase tracking-wider">
            Gap
          </p>
          <p className="text-2xl font-black text-red-600 mt-1">
            {formatCurrency(laborGap, true)}
          </p>
          <p className="text-xs text-slate-400">over industry target</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
            Current Hours/Week
          </p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {Math.round(currentHoursPerWeek)}
          </p>
          <p className="text-xs text-slate-400">across all staff</p>
        </div>
      </div>

      {/* Slider section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">
            Adjust Staffing Level
          </h2>
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => setMode("hours")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                mode === "hours"
                  ? "bg-white text-teal shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              Adjust by Hours
            </button>
            <button
              onClick={() => setMode("percent")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                mode === "percent"
                  ? "bg-white text-teal shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              Adjust by Target %
            </button>
          </div>
        </div>

        {mode === "hours" ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">
                Hours per week (all staff)
              </span>
              <span className="text-lg font-black text-slate-900">
                {hoursVal} hrs/wk
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={200}
              step={1}
              value={hoursVal}
              onChange={(e) => handleHoursChange(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>50 hrs</span>
              <span>Current: {Math.round(currentHoursPerWeek)}</span>
              <span>200 hrs</span>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">
                Labor as % of revenue
              </span>
              <span className="text-lg font-black text-slate-900">
                {pctVal}%
              </span>
            </div>
            <input
              type="range"
              min={25}
              max={50}
              step={0.5}
              value={pctVal}
              onChange={(e) => handlePctChange(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>25%</span>
              <span>Industry: 34% | Current: {currentLaborPct.toFixed(1)}%</span>
              <span>50%</span>
            </div>
          </div>
        )}
      </div>

      {/* Live results (6 cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
            New Labor Cost
          </p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {formatCurrency(Math.round(newLabor), true)}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
            New Labor %
          </p>
          <p
            className={cn(
              "text-2xl font-black mt-1",
              effectivePct <= 35
                ? "text-green-600"
                : effectivePct <= 40
                  ? "text-amber-600"
                  : "text-red-600"
            )}
          >
            {formatPercent(effectivePct)}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
            Hours to {hoursCut >= 0 ? "Cut" : "Add"}/Week
          </p>
          <p
            className={cn(
              "text-2xl font-black mt-1",
              hoursCut > 0 ? "text-green-600" : "text-red-600"
            )}
          >
            {hoursCut >= 0 ? "-" : "+"}
            {Math.abs(Math.round(hoursCut))}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
            Equivalent FTEs
          </p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {fteEquiv.toFixed(1)}
          </p>
          <p className="text-[10px] text-slate-400">at 40 hrs/week each</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
            Annual Savings
          </p>
          <p
            className={cn(
              "text-2xl font-black mt-1",
              savings > 0 ? "text-green-600" : "text-red-600"
            )}
          >
            {savings >= 0 ? "+" : ""}
            {formatCurrency(Math.round(savings), true)}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
            New Prime Cost %
          </p>
          <p
            className={cn(
              "text-2xl font-black mt-1",
              newPrimeCost <= 65
                ? "text-green-600"
                : newPrimeCost <= 70
                  ? "text-amber-600"
                  : "text-red-600"
            )}
          >
            {formatPercent(newPrimeCost)}
          </p>
          <p className="text-[10px] text-slate-400">
            COGS + Labor (target &lt;65%)
          </p>
        </div>
      </div>

      {/* Visual bar: Current vs Scenario vs Industry */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Labor % Comparison
        </h2>
        <div className="relative h-10 bg-slate-100 rounded-lg overflow-hidden">
          {/* Industry healthy range */}
          <div
            className="absolute inset-y-0 bg-green-100 border-l border-r border-green-300"
            style={{
              left: `${(25 / barMax) * 100}%`,
              width: `${((35 - 25) / barMax) * 100}%`,
            }}
          />
          {/* Scenario value */}
          <div
            className="absolute inset-y-0 left-0 rounded-l-lg"
            style={{
              width: `${(Math.min(effectivePct, barMax) / barMax) * 100}%`,
              backgroundColor:
                effectivePct <= 35
                  ? "#2EC4B6"
                  : effectivePct <= 40
                    ? "#F59E0B"
                    : "#EF4444",
              opacity: 0.3,
            }}
          />
          {/* Scenario marker */}
          <div
            className="absolute inset-y-0 w-1 z-10"
            style={{
              left: `${(Math.min(effectivePct, barMax) / barMax) * 100}%`,
              backgroundColor:
                effectivePct <= 35
                  ? "#2EC4B6"
                  : effectivePct <= 40
                    ? "#F59E0B"
                    : "#EF4444",
            }}
          />
          {/* Current marker */}
          <div
            className="absolute inset-y-0 w-0.5 bg-red-500 z-10"
            style={{
              left: `${(currentLaborPct / barMax) * 100}%`,
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded-sm" />
              <span className="text-slate-500">Industry 25&ndash;35%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-red-500" />
              <span className="text-red-600 font-semibold">
                Current {currentLaborPct.toFixed(1)}%
              </span>
            </div>
          </div>
          <span className="font-semibold text-slate-700">
            Scenario: {effectivePct.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Staff roster table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          2025 Staff Roster
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Hrs/Week
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedStaff.map((emp) => (
                <tr
                  key={emp.name}
                  className="border-b border-slate-50 hover:bg-slate-50/50"
                >
                  <td className="py-2.5 px-3 font-medium text-slate-900">
                    {emp.name}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">{emp.role}</td>
                  <td className="py-2.5 px-3 text-right text-slate-700">
                    {emp.isSalaried
                      ? "Salaried"
                      : `$${emp.hourlyRate?.toFixed(2)}/hr`}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                    {(emp.hoursWorked / 52).toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200">
                <td
                  colSpan={3}
                  className="py-2.5 px-3 font-bold text-slate-900"
                >
                  Total
                </td>
                <td className="py-2.5 px-3 text-right font-black text-slate-900">
                  {currentHoursPerWeek.toFixed(1)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Key insight card */}
      <div className="bg-teal/5 border border-teal/20 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-teal shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              The Two Paths to 34%
            </h2>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <p>
                <strong>Path 1 &mdash; Cut hours:</strong> Reduce about{" "}
                {Math.round(
                  currentHoursPerWeek -
                    currentHoursPerWeek * (industryTarget / currentLabor)
                )}{" "}
                hours/week (
                {(
                  (currentHoursPerWeek -
                    currentHoursPerWeek * (industryTarget / currentLabor)) /
                  40
                ).toFixed(1)}{" "}
                FTEs) to save {formatCurrency(laborGap, true)}/year and bring
                labor to {industryTargetPct}%.
              </p>
              <p>
                <strong>Path 2 &mdash; Grow revenue:</strong> Increase sales to{" "}
                {formatCurrency(revenueFor34, true)} without cutting anyone
                &mdash; at that revenue, your current payroll{" "}
                <em>becomes</em> 34%.
              </p>
              <p>
                <strong>Most realistic:</strong> A combination &mdash; modest
                hour reductions plus revenue growth to close the gap from both
                sides.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-slate-400 text-center pb-4">
        Source: 2025 payroll data. Hours assume 52 working weeks. Industry
        benchmark is 25&ndash;35% labor cost for Canadian full-service
        restaurants.
      </p>
    </div>
  );
}
