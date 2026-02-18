"use client";

import { yearlyData, pnlLineItems, wageData } from "@/lib/data";
import { formatCurrency } from "@/lib/formatting";
import { CalendarDays, TrendingUp, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

// ── 2025 data ──
const revenue = yearlyData[2].foodSales;
const cogs = yearlyData[2].totalCOGS;
const totalExpenses = yearlyData[2].totalExpenses;
const totalPayroll = yearlyData[2].payroll;

const merchantFees = pnlLineItems.find(
  (i) => i.account === "Merchant Account Fees"
)!.values[2];
const bankCharges = pnlLineItems.find(
  (i) => i.account === "Bank Service Charges"
)!.values[2];
const paymentProcessing = merchantFees + bankCharges;

const tipsPaid = pnlLineItems.find(
  (i) => i.account === "Tips Paid to Employee"
)!.values[2];

// ── Variable vs Fixed (same method as break-even page) ──
const variableRate = (cogs + paymentProcessing) / revenue;
const cmRate = 1 - variableRate;
const fixedCosts = totalExpenses - paymentProcessing - tipsPaid;

const ownerGross = wageData[0].grossPay;

// ── Three break-even levels ──
const accountingBE = Math.round(fixedCosts / cmRate);
const ownerBE = Math.round((fixedCosts + (70000 - ownerGross)) / cmRate);
const industryBE = Math.round(totalPayroll / 0.34);

// ── Constants ──
const DAYS_PER_YEAR = 260;
const DAYS_PER_WEEK = 5;
const AVG_CHECK = 25;
const currentDaily = revenue / DAYS_PER_YEAR;

const levels = [
  {
    label: "Accounting Break-Even",
    description: "Covers all costs at current staffing",
    annual: accountingBE,
    borderColor: "border-teal/20",
    textColor: "text-teal",
    barColor: "#2EC4B6",
  },
  {
    label: "Fair Owner Pay ($70K)",
    description: "You earn a living wage, not $19/hr",
    annual: ownerBE,
    borderColor: "border-blue-200",
    textColor: "text-blue-600",
    barColor: "#3B82F6",
  },
  {
    label: "Industry Standard (34% Labor)",
    description: "Staffing at healthy benchmark levels",
    annual: industryBE,
    borderColor: "border-indigo-200",
    textColor: "text-indigo-600",
    barColor: "#6366F1",
  },
];

const increments = [100, 200, 300, 500];

export default function DailyTargetsPage() {
  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <CalendarDays className="w-7 h-7 text-teal" />
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Daily Revenue Targets
          </h1>
        </div>
        <div className="h-1 w-16 bg-gradient-to-r from-teal to-teal-dark rounded-full mt-2 mb-3" />
        <p className="text-sm font-medium bg-gradient-to-r from-teal to-teal-dark bg-clip-text text-transparent">
          Your annual goals, translated into a number you can check against the
          register every night.
        </p>
      </div>

      {/* Current daily KPI */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Current Average Daily Revenue
        </p>
        <p className="text-4xl font-black text-slate-900 mt-2">
          {formatCurrency(Math.round(currentDaily))}
        </p>
        <p className="text-sm text-slate-400 mt-1">
          {formatCurrency(revenue, true)} &divide; {DAYS_PER_YEAR} operating
          days (Tue&ndash;Sat)
        </p>
      </div>

      {/* 3 break-even level cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {levels.map((level) => {
          const daily = level.annual / DAYS_PER_YEAR;
          const weekly = daily * DAYS_PER_WEEK;
          const monthly = level.annual / 12;
          const gap = daily - currentDaily;
          const coversNeeded = Math.ceil(gap / AVG_CHECK);
          const progress = Math.min((currentDaily / daily) * 100, 100);

          return (
            <div
              key={level.label}
              className={cn(
                "bg-white rounded-2xl p-6 shadow-sm border",
                level.borderColor
              )}
            >
              <p
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider",
                  level.textColor
                )}
              >
                {level.label}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {level.description}
              </p>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Daily</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(Math.round(daily))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Weekly</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(Math.round(weekly))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Monthly</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(Math.round(monthly))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Annual</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(level.annual, true)}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: level.barColor,
                    }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1 text-right">
                  {progress.toFixed(0)}% there
                </p>
              </div>

              {/* Gap */}
              <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-red-600">
                  Gap: +{formatCurrency(Math.round(gap))}/day
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  That&apos;s {coversNeeded} more customers at ${AVG_CHECK} avg
                  check
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* What Does $X More Per Day Look Like? */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-teal" />
          <h2 className="text-lg font-bold text-slate-900">
            What Does Extra Revenue Per Day Look Like?
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {increments.map((inc) => {
            const annualGain = inc * DAYS_PER_YEAR;
            const newRevenue = revenue + annualGain;

            return (
              <div
                key={inc}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200"
              >
                <p className="text-lg font-black text-slate-900">
                  +${inc}/day
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  = +{formatCurrency(annualGain, true)}/year
                </p>
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  &rarr; {formatCurrency(Math.round(newRevenue), true)} total
                </p>
                <div className="mt-2 space-y-1">
                  {levels.map((level) => {
                    const unlocked = newRevenue >= level.annual;
                    return (
                      <p
                        key={level.label}
                        className={cn(
                          "text-xs",
                          unlocked
                            ? "text-green-600 font-medium"
                            : "text-slate-400"
                        )}
                      >
                        {unlocked ? "\u2713" : "\u2717"}{" "}
                        {level.label.split("(")[0].trim()}
                      </p>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Practical tips */}
      <div className="bg-teal/5 border border-teal/20 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-teal shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              How to Hit These Numbers
            </h2>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <p>
                <strong>4 more customers/day</strong> at ${AVG_CHECK} avg check
                = +$100/day (+{formatCurrency(100 * DAYS_PER_YEAR, true)}/yr)
              </p>
              <p>
                <strong>Raise average check by $2</strong> across ~50 daily
                customers = +$100/day
              </p>
              <p>
                <strong>Add a weekend special</strong> that brings in 8 extra
                covers on Saturdays = +$200/week
              </p>
              <p>
                <strong>Catering one event/week</strong> at $400 avg = +$77/day
                equivalent
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-slate-400 text-center pb-4">
        Based on {DAYS_PER_YEAR} operating days/year (Tue&ndash;Sat, 52 weeks)
        and {formatCurrency(revenue, true)} in 2025 food sales. Break-even uses
        the same contribution-margin method as the Break-Even Analysis page.
      </p>
    </div>
  );
}
