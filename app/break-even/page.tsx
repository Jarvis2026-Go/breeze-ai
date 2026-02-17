"use client";

import { cn } from "@/lib/utils";
import { yearlyData, pnlLineItems, wageData } from "@/lib/data";
import { formatCurrency } from "@/lib/formatting";
import { Target, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

// ── 2025 data extraction ──
const data2025 = yearlyData[2];
const revenue = data2025.foodSales; // $319,177
const cogs = data2025.totalCOGS; // $74,148
const totalExpenses = data2025.totalExpenses; // $296,613
const totalPayroll = data2025.payroll; // $155,137

// Payment processing (variable cost)
const merchantFees =
  pnlLineItems.find((i) => i.account === "Merchant Account Fees")!.values[2];
const bankCharges =
  pnlLineItems.find((i) => i.account === "Bank Service Charges")!.values[2];
const paymentProcessing = merchantFees + bankCharges; // ~$19,775

// Tips (pass-through — excluded from analysis)
const tipsPaid =
  pnlLineItems.find((i) => i.account === "Tips Paid to Employee")!.values[2];

// ── Variable vs Fixed ──
const totalVariableCosts = cogs + paymentProcessing;
const variableRate = totalVariableCosts / revenue; // ~29.4%
const cmRate = 1 - variableRate; // ~70.6%

const fixedCosts = totalExpenses - paymentProcessing - tipsPaid; // ~$233K

// ── Owner data ──
const ownerData = wageData[0]; // Lucia Maceda
const ownerGross = ownerData.grossPay; // ~$40K
const ownerHours = ownerData.hoursWorked; // 2,080
const ownerEffectiveHourly = ownerGross / ownerHours; // ~$19.23

// ── Payroll split ──
const staffPayroll = totalPayroll - ownerGross; // ~$115K

// ── Rent & other fixed ──
const rent =
  pnlLineItems.find((i) => i.account === "Rent Expense")!.values[2];

// ── Stacked bar segments (all costs excl tips) ──
const totalCostsExTips = cogs + totalExpenses - tipsPaid; // ~$327K
const otherCosts =
  totalCostsExTips - cogs - ownerGross - staffPayroll - rent;

const costSegments = [
  { label: "COGS", amount: cogs, color: "bg-teal" },
  { label: "Owner Pay", amount: ownerGross, color: "bg-blue-500" },
  { label: "Staff Payroll", amount: staffPayroll, color: "bg-coral" },
  { label: "Rent", amount: rent, color: "bg-indigo-500" },
  { label: "Other", amount: otherCosts, color: "bg-slate-400" },
];

// ── Three break-even levels ──
const accountingBE = Math.round(fixedCosts / cmRate);
const ownerTargetSalary = 70000;
const ownerExtra = ownerTargetSalary - ownerGross;
const ownerBE = Math.round((fixedCosts + ownerExtra) / cmRate);
const industryBE = Math.round(totalPayroll / 0.34);

const accountingGap = accountingBE - Math.round(revenue);
const ownerGap = ownerBE - Math.round(revenue);
const industryGap = industryBE - Math.round(revenue);

// ── Revenue per hour (for scenarios) ──
const revenuePerHour = revenue / 2080;
const avgTicket = 18;

// ── Scenario definitions ──
interface Scenario {
  title: string;
  description: string;
  newRevenue: number;
  fixedCostDelta: number;
  payrollDelta: number;
}

const scenarios: Scenario[] = [
  {
    title: "Raise prices 12%",
    description: "Across-the-board 12% menu increase",
    newRevenue: Math.round(revenue * 1.12),
    fixedCostDelta: 0,
    payrollDelta: 0,
  },
  {
    title: "Add 1 customer/hour",
    description: `+2,080 hrs \u00D7 $${avgTicket} avg ticket`,
    newRevenue: Math.round(revenue + 2080 * avgTicket),
    fixedCostDelta: 0,
    payrollDelta: 0,
  },
  {
    title: "Open Sundays (6th day)",
    description: `+416 hrs \u00D7 $${Math.round(revenuePerHour)}/hr`,
    newRevenue: Math.round(revenue + 416 * revenuePerHour),
    fixedCostDelta: 0,
    payrollDelta: 0,
  },
  {
    title: "Add catering/delivery $40K",
    description: "New revenue stream at similar margins",
    newRevenue: Math.round(revenue + 40000),
    fixedCostDelta: 0,
    payrollDelta: 0,
  },
  {
    title: "Cut 1 FTE ($30K saved)",
    description: "Absorb with cross-training",
    newRevenue: Math.round(revenue),
    fixedCostDelta: -30000,
    payrollDelta: -30000,
  },
  {
    title: "Combo: +7% price + $20K catering",
    description: "Blended growth path",
    newRevenue: Math.round(revenue * 1.07 + 20000),
    fixedCostDelta: 0,
    payrollDelta: 0,
  },
];

function evaluateScenario(s: Scenario) {
  const newFixed = fixedCosts + s.fixedCostDelta;
  const newPayroll = totalPayroll + s.payrollDelta;
  const newOperating = s.newRevenue * cmRate - newFixed;
  const currentOperating = revenue * cmRate - fixedCosts;
  const netImpact = newOperating - currentOperating;

  const newAccountingBE = Math.round(newFixed / cmRate);
  const newOwnerBE = Math.round(
    (newFixed + (ownerTargetSalary - ownerGross)) / cmRate
  );
  const newIndustryBE = Math.round(newPayroll / 0.34);

  return {
    newRevenue: s.newRevenue,
    netImpact: Math.round(netImpact),
    crossesAccounting: s.newRevenue >= newAccountingBE,
    crossesOwner: s.newRevenue >= newOwnerBE,
    crossesIndustry: s.newRevenue >= newIndustryBE,
  };
}

// ── YoY revenue change ──
const revenue2023 = yearlyData[0].foodSales;
const revenueDecline = ((revenue - revenue2023) / revenue2023) * 100;

export default function BreakEvenPage() {
  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Section 1: Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Target className="w-7 h-7 text-teal" />
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Break-Even Analysis
          </h1>
        </div>
        <div className="h-1 w-16 bg-gradient-to-r from-teal to-teal-dark rounded-full mt-2 mb-3" />
        <p className="text-sm font-medium bg-gradient-to-r from-teal to-teal-dark bg-clip-text text-transparent">
          What it takes to reach profitability &mdash; and what
          &ldquo;profitable&rdquo; really means.
        </p>
      </div>

      {/* Section 2: The Revenue Gap — 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            2025 Revenue
          </p>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {formatCurrency(revenue, true)}
          </p>
          <p className="text-xs text-slate-400 mt-1">What CHOG earned</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal/20 text-center">
          <p className="text-xs font-medium text-teal uppercase tracking-wider">
            Break-Even (Fair Owner Pay)
          </p>
          <p className="text-3xl font-black text-teal mt-2">
            {formatCurrency(ownerBE, true)}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Revenue needed for $70K owner salary
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-200 text-center">
          <p className="text-xs font-medium text-red-600 uppercase tracking-wider">
            Gap to Close
          </p>
          <p className="text-3xl font-black text-red-600 mt-2">
            {formatCurrency(ownerGap, true)}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            +{((ownerGap / revenue) * 100).toFixed(0)}% more revenue needed
          </p>
        </div>
      </div>

      {/* Section 3: Where Every Dollar Goes */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          Where Every Dollar Goes
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-5">
          {formatCurrency(revenue, true)} of revenue, {formatCurrency(totalCostsExTips, true)} in costs (excluding tip pass-through). The bar overflows &mdash; costs exceed revenue.
        </p>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-xs">
          {costSegments.map((seg) => (
            <div key={seg.label} className="flex items-center gap-1.5">
              <div className={cn("w-3 h-3 rounded-sm", seg.color)} />
              <span className="text-slate-600">{seg.label}</span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(seg.amount, true)}
              </span>
            </div>
          ))}
        </div>

        {/* Stacked bar */}
        <div className="relative">
          {/* Container = break-even (accounting) for scale */}
          <div className="relative h-12 bg-slate-100 rounded-lg">
            {/* Cost segments — sized relative to accounting BE for visual context */}
            {(() => {
              const scale = accountingBE * 1.05; // 5% padding
              let running = 0;
              return (
                <>
                  {costSegments.map((seg, i) => {
                    const left = (running / scale) * 100;
                    const width = (seg.amount / scale) * 100;
                    running += seg.amount;
                    return (
                      <div
                        key={seg.label}
                        className={cn(
                          "absolute inset-y-0",
                          seg.color,
                          i === 0 && "rounded-l-lg"
                        )}
                        style={{ left: `${left}%`, width: `${width}%` }}
                      />
                    );
                  })}

                  {/* Revenue marker */}
                  <div
                    className="absolute inset-y-0 z-10 flex flex-col items-center"
                    style={{ left: `${(revenue / scale) * 100}%` }}
                  >
                    <div className="w-0.5 h-full bg-emerald-600" />
                  </div>

                  {/* Break-even marker */}
                  <div
                    className="absolute inset-y-0 z-10 flex flex-col items-center"
                    style={{
                      left: `${(accountingBE / scale) * 100}%`,
                    }}
                  >
                    <div className="w-0.5 h-full border-l-2 border-dashed border-red-400" />
                  </div>
                </>
              );
            })()}
          </div>

          {/* Labels below bar */}
          <div className="flex items-center justify-between mt-2 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-emerald-600" />
              <span className="text-emerald-700 font-semibold">
                Revenue {formatCurrency(revenue, true)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 border-t-2 border-dashed border-red-400" />
              <span className="text-red-600 font-semibold">
                Break-even {formatCurrency(accountingBE, true)}
              </span>
            </div>
          </div>
        </div>

        {/* Deficit callout */}
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <strong>Deficit:</strong> Costs exceed revenue by{" "}
          {formatCurrency(totalCostsExTips - Math.round(revenue), true)}, and
          break-even is another{" "}
          {formatCurrency(
            accountingBE - Math.round(totalCostsExTips),
            true
          )}{" "}
          beyond that.
        </div>
      </div>

      {/* Section 4: Three Levels of "Break-Even" */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          Three Levels of &ldquo;Break-Even&rdquo;
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          Breaking even means different things depending on what you consider
          a fair outcome.
        </p>

        <div className="space-y-6">
          {/* Level 1: Accounting */}
          <BreakEvenBar
            label="Accounting Break-Even"
            subtitle={`You're ${formatCurrency(accountingGap, true)} short of $0 profit`}
            target={accountingBE}
            actual={Math.round(revenue)}
            gap={accountingGap}
            color="bg-teal"
          />

          {/* Level 2: Fair Owner Pay */}
          <BreakEvenBar
            label="Fair Owner Pay"
            subtitle={`Owner earns $70K instead of $${ownerEffectiveHourly.toFixed(0)}/hr`}
            target={ownerBE}
            actual={Math.round(revenue)}
            gap={ownerGap}
            color="bg-blue-500"
          />

          {/* Level 3: Industry Healthy */}
          <BreakEvenBar
            label="Industry Healthy"
            subtitle="34% labor ratio, sustainable operations"
            target={industryBE}
            actual={Math.round(revenue)}
            gap={industryGap}
            color="bg-indigo-500"
          />
        </div>
      </div>

      {/* Section 5: How to Close the Gap */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">
          How to Close the Gap
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Six scenarios computed from real data &mdash; each shows the revenue
          impact and which break-even levels it reaches.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario) => {
            const result = evaluateScenario(scenario);
            return (
              <div
                key={scenario.title}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
              >
                <h3 className="font-bold text-slate-900 text-sm">
                  {scenario.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {scenario.description}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                      New Revenue
                    </p>
                    <p className="text-lg font-black text-slate-900">
                      {formatCurrency(result.newRevenue, true)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                      Net Impact
                    </p>
                    <p className="text-lg font-black text-green-600">
                      +{formatCurrency(result.netImpact, true)}
                    </p>
                  </div>
                </div>

                {/* Break-even checks */}
                <div className="mt-4 space-y-1.5">
                  <BECheck
                    label={`Accounting (${formatCurrency(accountingBE, true)})`}
                    passes={result.crossesAccounting}
                  />
                  <BECheck
                    label={`Fair Owner (${formatCurrency(ownerBE, true)})`}
                    passes={result.crossesOwner}
                  />
                  <BECheck
                    label={`Industry (${formatCurrency(industryBE, true)})`}
                    passes={result.crossesIndustry}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 6: The Hard Truth */}
      <div className="border-2 border-red-200 bg-red-50/50 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-bold text-red-900">The Hard Truth</h2>
            <div className="mt-3 space-y-3 text-sm text-red-800">
              <p>
                <strong>Owner works every open hour</strong> at $
                {ownerEffectiveHourly.toFixed(2)}/hr effective &mdash; below
                every cook on the team.
              </p>
              <p>
                <strong>
                  Revenue down {Math.abs(revenueDecline).toFixed(1)}% since 2023
                </strong>
                , while Ontario minimum wage rose 11% ($15.50 &rarr; $17.20).
                The scissors are widening.
              </p>
              <p>
                <strong>Without revenue growth, losses will keep growing.</strong>{" "}
                Fixed costs don&apos;t shrink on their own &mdash; they
                compound. The window to act is now, not next year.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-slate-400 text-center pb-4">
        Source: QuickBooks P&amp;L + payroll system. All values computed from
        real data. Break-even calculations use contribution margin analysis with
        variable costs (COGS + payment processing) at{" "}
        {(variableRate * 100).toFixed(1)}% and contribution margin at{" "}
        {(cmRate * 100).toFixed(1)}%.
      </p>
    </div>
  );
}

// ── Sub-components ──

function BreakEvenBar({
  label,
  subtitle,
  target,
  actual,
  gap,
  color,
}: {
  label: string;
  subtitle: string;
  target: number;
  actual: number;
  gap: number;
  color: string;
}) {
  const pct = Math.min((actual / target) * 100, 100);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <div>
          <span className="text-sm font-bold text-slate-900">{label}</span>
          <span className="text-xs text-slate-400 ml-2">{subtitle}</span>
        </div>
        <span className="text-sm font-bold text-slate-900">
          {formatCurrency(target, true)}
        </span>
      </div>
      <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden">
        <div
          className={cn("absolute inset-y-0 left-0 rounded-lg", color)}
          style={{ width: `${pct}%` }}
        />
        {/* Actual label */}
        <div
          className="absolute inset-y-0 flex items-center z-10"
          style={{ left: `${Math.min(pct, 90)}%` }}
        >
          <span className="text-[11px] font-bold text-white ml-2 drop-shadow-sm">
            {formatCurrency(actual, true)}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-end mt-1">
        <span className="text-xs font-semibold text-red-600">
          Gap: {formatCurrency(gap, true)} (+
          {((gap / actual) * 100).toFixed(0)}%)
        </span>
      </div>
    </div>
  );
}

function BECheck({ label, passes }: { label: string; passes: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {passes ? (
        <CheckCircle2 className="w-4 h-4 text-green-500" />
      ) : (
        <XCircle className="w-4 h-4 text-red-400" />
      )}
      <span className={passes ? "text-green-700 font-medium" : "text-slate-400"}>
        {label}
      </span>
    </div>
  );
}
