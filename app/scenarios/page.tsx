"use client";

import { useState } from "react";
import { yearlyData, pnlLineItems } from "@/lib/data";
import { formatCurrency, formatPercent } from "@/lib/formatting";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

// ── 2025 base data ──
const revenue = yearlyData[2].foodSales;
const cogs = yearlyData[2].totalCOGS;
const payroll = yearlyData[2].payroll;
const totalExpenses = yearlyData[2].totalExpenses;
const netIncome = yearlyData[2].netIncome;
const otherIncome = yearlyData[2].otherIncome;

const merchantFees = pnlLineItems.find(
  (i) => i.account === "Merchant Account Fees"
)!.values[2];
const tipsPaid = pnlLineItems.find(
  (i) => i.account === "Tips Paid to Employee"
)!.values[2];
const rent = pnlLineItems.find(
  (i) => i.account === "Rent Expense"
)!.values[2];

const processing = merchantFees;
const otherFixed = totalExpenses - payroll - rent - processing - tipsPaid;
const netOtherIncome =
  netIncome - (revenue - cogs - totalExpenses);

// ── Defaults (derived from data) ──
const foodCostPctDefault =
  Math.round((cogs / revenue) * 1000) / 10;
const processingPctDefault =
  Math.round((processing / revenue) * 1000) / 10;

// ── Presets ──
interface Preset {
  label: string;
  revenuePct: number;
  foodCostPct: number;
  laborPct: number;
  rentDelta: number;
  processingPct: number;
}

const industryLaborPct =
  Math.round(((0.34 * revenue) / payroll - 1) * 100 * 10) / 10;

const presets: Preset[] = [
  {
    label: "Cut Labor 15%",
    revenuePct: 0,
    foodCostPct: foodCostPctDefault,
    laborPct: -15,
    rentDelta: 0,
    processingPct: processingPctDefault,
  },
  {
    label: "Raise Prices 10%",
    revenuePct: 10,
    foodCostPct: foodCostPctDefault,
    laborPct: 0,
    rentDelta: 0,
    processingPct: processingPctDefault,
  },
  {
    label: "Industry Target",
    revenuePct: 0,
    foodCostPct: 32,
    laborPct: industryLaborPct,
    rentDelta: 0,
    processingPct: 3,
  },
  {
    label: "Best Case",
    revenuePct: 20,
    foodCostPct: 25,
    laborPct: -15,
    rentDelta: -200,
    processingPct: 3,
  },
];

export default function ScenariosPage() {
  const [revenuePct, setRevenuePct] = useState(0);
  const [foodCostPct, setFoodCostPct] = useState(foodCostPctDefault);
  const [laborPct, setLaborPct] = useState(0);
  const [rentDelta, setRentDelta] = useState(0);
  const [processingPct, setProcessingPct] = useState(processingPctDefault);

  function applyPreset(p: Preset) {
    setRevenuePct(p.revenuePct);
    setFoodCostPct(p.foodCostPct);
    setLaborPct(p.laborPct);
    setRentDelta(p.rentDelta);
    setProcessingPct(p.processingPct);
  }

  function reset() {
    setRevenuePct(0);
    setFoodCostPct(foodCostPctDefault);
    setLaborPct(0);
    setRentDelta(0);
    setProcessingPct(processingPctDefault);
  }

  // ── Scenario math ──
  const newRevenue = revenue * (1 + revenuePct / 100);
  const newCOGS = newRevenue * (foodCostPct / 100);
  const newLabor = payroll * (1 + laborPct / 100);
  const newRent = rent + rentDelta * 12;
  const newProcessing = newRevenue * (processingPct / 100);
  const newTotalExpenses =
    newLabor + newRent + newProcessing + otherFixed + tipsPaid;
  const newNetOrdIncome = newRevenue - newCOGS - newTotalExpenses;
  const newNetIncome = newNetOrdIncome + netOtherIncome;
  const newGrossProfit = newRevenue - newCOGS;

  // Break-even
  const newCMRate = 1 - foodCostPct / 100 - processingPct / 100;
  const newFixedCosts = newLabor + newRent + otherFixed;
  const newBreakEven =
    newCMRate > 0 ? Math.round(newFixedCosts / newCMRate) : Infinity;

  // Prime cost
  const newPrimeCostPct = ((newCOGS + newLabor) / newRevenue) * 100;

  const netIncomeDelta = newNetIncome - netIncome;
  const isImproved = newNetIncome > netIncome;

  // ── Current values for comparison ──
  const currentNetOrdIncome = revenue - cogs - totalExpenses;
  const currentBreakEven = Math.round(
    (totalExpenses - processing - tipsPaid) /
      (1 - cogs / revenue - processing / revenue)
  );

  // ── Breakdown table rows ──
  const breakdownRows = [
    {
      label: "Revenue",
      current: revenue,
      scenario: newRevenue,
      bold: true,
    },
    { label: "COGS", current: cogs, scenario: newCOGS, indent: true },
    {
      label: "Gross Profit",
      current: revenue - cogs,
      scenario: newGrossProfit,
      bold: true,
    },
    {
      label: "Payroll",
      current: payroll,
      scenario: newLabor,
      indent: true,
      isCost: true,
    },
    {
      label: "Rent",
      current: rent,
      scenario: newRent,
      indent: true,
      isCost: true,
    },
    {
      label: "Processing",
      current: processing,
      scenario: newProcessing,
      indent: true,
      isCost: true,
    },
    {
      label: "Other Fixed",
      current: otherFixed,
      scenario: otherFixed,
      indent: true,
      isCost: true,
    },
    {
      label: "Tips (pass-through)",
      current: tipsPaid,
      scenario: tipsPaid,
      indent: true,
      isCost: true,
    },
    {
      label: "Total Expenses",
      current: totalExpenses,
      scenario: newTotalExpenses,
      bold: true,
      isCost: true,
    },
    {
      label: "Net Ordinary Income",
      current: currentNetOrdIncome,
      scenario: newNetOrdIncome,
      bold: true,
    },
    {
      label: "Other Income (net)",
      current: netOtherIncome,
      scenario: netOtherIncome,
      indent: true,
    },
    {
      label: "Net Income",
      current: netIncome,
      scenario: newNetIncome,
      bold: true,
      highlight: true,
    },
  ];

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <SlidersHorizontal className="w-7 h-7 text-teal" />
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            What-If Scenario Planner
          </h1>
        </div>
        <div className="h-1 w-16 bg-gradient-to-r from-teal to-teal-dark rounded-full mt-2 mb-3" />
        <p className="text-sm font-medium bg-gradient-to-r from-teal to-teal-dark bg-clip-text text-transparent">
          Adjust the levers below and see the impact in real time &mdash;
          perfect for your planning meeting.
        </p>
      </div>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => applyPreset(p)}
            className="px-4 py-2 text-sm font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-700"
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={reset}
          className="px-4 py-2 text-sm font-medium bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-all text-slate-500 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Main grid: Sliders + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Sliders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
          <h2 className="text-lg font-bold text-slate-900">
            Scenario Inputs
          </h2>

          {/* Revenue change */}
          <SliderRow
            label="Revenue Change"
            value={revenuePct}
            min={-20}
            max={30}
            step={1}
            format={(v) => `${v >= 0 ? "+" : ""}${v}%`}
            onChange={setRevenuePct}
          />

          {/* Food cost % */}
          <SliderRow
            label="Food Cost %"
            value={foodCostPct}
            min={15}
            max={40}
            step={0.5}
            format={(v) => `${v.toFixed(1)}%`}
            onChange={setFoodCostPct}
          />

          {/* Labor change */}
          <SliderRow
            label="Labor Cost Change"
            value={laborPct}
            min={-30}
            max={10}
            step={1}
            format={(v) => `${v >= 0 ? "+" : ""}${v}%`}
            onChange={setLaborPct}
          />

          {/* Rent change */}
          <SliderRow
            label="Rent Change (monthly)"
            value={rentDelta}
            min={-500}
            max={500}
            step={50}
            format={(v) =>
              `${v >= 0 ? "+" : "-"}$${Math.abs(v)}/mo`
            }
            onChange={setRentDelta}
          />

          {/* Processing % */}
          <SliderRow
            label="Processing %"
            value={processingPct}
            min={1}
            max={6}
            step={0.1}
            format={(v) => `${v.toFixed(1)}%`}
            onChange={setProcessingPct}
          />
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          {/* 4 KPI cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                New Revenue
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {formatCurrency(Math.round(newRevenue), true)}
              </p>
              {revenuePct !== 0 && (
                <p
                  className={cn(
                    "text-xs font-semibold mt-0.5",
                    revenuePct > 0 ? "text-green-600" : "text-red-600"
                  )}
                >
                  {revenuePct > 0 ? "+" : ""}
                  {formatCurrency(
                    Math.round(newRevenue - revenue),
                    true
                  )}
                </p>
              )}
            </div>

            <div
              className={cn(
                "rounded-2xl p-5 shadow-sm border",
                isImproved
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              )}
            >
              <p
                className={cn(
                  "text-[10px] font-medium uppercase tracking-wider",
                  isImproved ? "text-green-600" : "text-red-600"
                )}
              >
                New Net Income
              </p>
              <p
                className={cn(
                  "text-2xl font-black mt-1",
                  newNetIncome >= 0 ? "text-green-700" : "text-red-700"
                )}
              >
                {formatCurrency(Math.round(newNetIncome), true)}
              </p>
              <p
                className={cn(
                  "text-xs font-semibold mt-0.5",
                  netIncomeDelta >= 0
                    ? "text-green-600"
                    : "text-red-600"
                )}
              >
                {netIncomeDelta >= 0 ? "+" : ""}
                {formatCurrency(Math.round(netIncomeDelta), true)} vs
                current
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                New Break-Even
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {newBreakEven === Infinity
                  ? "N/A"
                  : formatCurrency(newBreakEven, true)}
              </p>
              {newBreakEven !== Infinity && (
                <p
                  className={cn(
                    "text-xs font-semibold mt-0.5",
                    newRevenue >= newBreakEven
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                >
                  {newRevenue >= newBreakEven
                    ? "Above break-even"
                    : `${formatCurrency(newBreakEven - Math.round(newRevenue), true)} short`}
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                New Prime Cost %
              </p>
              <p
                className={cn(
                  "text-2xl font-black mt-1",
                  newPrimeCostPct <= 65
                    ? "text-green-600"
                    : newPrimeCostPct <= 70
                      ? "text-amber-600"
                      : "text-red-600"
                )}
              >
                {formatPercent(newPrimeCostPct)}
              </p>
              <p className="text-[10px] text-slate-400">
                target &lt;65%
              </p>
            </div>
          </div>

          {/* Verdict card */}
          <div
            className={cn(
              "rounded-2xl p-5 border-2",
              isImproved
                ? "bg-green-50/50 border-green-200"
                : "bg-red-50/50 border-red-200"
            )}
          >
            <p
              className={cn(
                "text-sm font-bold",
                isImproved ? "text-green-800" : "text-red-800"
              )}
            >
              {isImproved ? "This scenario improves your position" : "This scenario makes things worse"}
            </p>
            <p
              className={cn(
                "text-xs mt-1",
                isImproved ? "text-green-700" : "text-red-700"
              )}
            >
              {isImproved
                ? `Net income improves by ${formatCurrency(Math.round(netIncomeDelta), true)}/year. ${newNetIncome >= 0 ? "You'd be profitable!" : "Still a loss, but moving in the right direction."}`
                : `Net income worsens by ${formatCurrency(Math.abs(Math.round(netIncomeDelta)), true)}/year. Consider adjusting the inputs.`}
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Detailed Breakdown
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Line Item
                </th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Current
                </th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Scenario
                </th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Change
                </th>
              </tr>
            </thead>
            <tbody>
              {breakdownRows.map((row) => {
                const delta = row.scenario - row.current;
                const isCostRow = row.isCost;
                // For cost rows, negative delta (reduction) is good
                // For income rows, positive delta (increase) is good
                const isGood = isCostRow ? delta < 0 : delta > 0;
                const isBad = isCostRow ? delta > 0 : delta < 0;

                return (
                  <tr
                    key={row.label}
                    className={cn(
                      "border-b border-slate-50",
                      row.highlight && "bg-slate-50"
                    )}
                  >
                    <td
                      className={cn(
                        "py-2.5 px-3",
                        row.bold
                          ? "font-bold text-slate-900"
                          : "text-slate-600",
                        row.indent && "pl-8"
                      )}
                    >
                      {row.label}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700">
                      {formatCurrency(Math.round(row.current), true)}
                    </td>
                    <td
                      className={cn(
                        "py-2.5 px-3 text-right font-semibold",
                        row.bold ? "text-slate-900" : "text-slate-700"
                      )}
                    >
                      {formatCurrency(Math.round(row.scenario), true)}
                    </td>
                    <td
                      className={cn(
                        "py-2.5 px-3 text-right font-semibold",
                        Math.abs(delta) < 1
                          ? "text-slate-400"
                          : isGood
                            ? "text-green-600"
                            : isBad
                              ? "text-red-600"
                              : "text-slate-500"
                      )}
                    >
                      {Math.abs(delta) < 1
                        ? "\u2014"
                        : `${delta >= 0 ? "+" : ""}${formatCurrency(Math.round(delta), true)}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-slate-400 text-center pb-4">
        Based on 2025 actuals. Tips are a pass-through (offset by tip income)
        and held constant. &ldquo;Other Fixed&rdquo; includes insurance,
        utilities, supplies, and all other operating costs.
      </p>
    </div>
  );
}

// ── Slider sub-component ──
function SliderRow({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-bold text-slate-900">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}
