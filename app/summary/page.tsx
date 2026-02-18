"use client";

import { yearlyData, pnlLineItems, primeCostData, wageData } from "@/lib/data";
import { formatCurrency } from "@/lib/formatting";
import { Printer, FileSpreadsheet, FileText } from "lucide-react";

// ── 2025 data ──
const revenue = yearlyData[2].foodSales;
const netIncome = yearlyData[2].netIncome;
const cogs = yearlyData[2].totalCOGS;
const payroll = yearlyData[2].payroll;
const foodCostPct = ((cogs / revenue) * 100).toFixed(1);
const laborCostPct = ((payroll / revenue) * 100).toFixed(1);
const primeCostPct = primeCostData[2].primeCostPct;

// ── Break-even (same logic as break-even page) ──
const merchantFees =
  pnlLineItems.find((i) => i.account === "Merchant Account Fees")!.values[2];
const bankCharges =
  pnlLineItems.find((i) => i.account === "Bank Service Charges")!.values[2];
const tipsPaid =
  pnlLineItems.find((i) => i.account === "Tips Paid to Employee")!.values[2];
const totalExpenses = yearlyData[2].totalExpenses;
const paymentProcessing = merchantFees + bankCharges;
const variableRate = (cogs + paymentProcessing) / revenue;
const cmRate = 1 - variableRate;
const fixedCosts = totalExpenses - paymentProcessing - tipsPaid;

const ownerGross = wageData[0].grossPay;
const ownerTargetSalary = 70000;
const ownerExtra = ownerTargetSalary - ownerGross;

const accountingBE = Math.round(fixedCosts / cmRate);
const ownerBE = Math.round((fixedCosts + ownerExtra) / cmRate);
const industryBE = Math.round(payroll / 0.34);

const accountingGap = accountingBE - Math.round(revenue);
const ownerGap = ownerBE - Math.round(revenue);
const industryGap = industryBE - Math.round(revenue);

// ── Savings (same logic as next-steps page) ──
function parseRange(s: string): { lo: number; hi: number } | null {
  const cleaned = s.replace(/[~%]/g, "");
  let lo: number, hi: number;
  if (cleaned.includes("-")) {
    [lo, hi] = cleaned.split("-").map(Number);
  } else {
    lo = hi = Number(cleaned);
  }
  if (isNaN(lo) || isNaN(hi)) return null;
  return { lo, hi };
}

const allSavings = pnlLineItems
  .filter(
    (item) =>
      item.indent &&
      item.isCost &&
      item.account !== "Tips Paid to Employee" &&
      item.industryPctMedian &&
      item.industryPctMedian !== "N/A" &&
      item.industryPctMedian !== "100%"
  )
  .map((item) => {
    const pct = Math.abs((item.values[2] / revenue) * 100);
    const range = parseRange(item.industryPctMedian!);
    if (!range) return null;
    if (pct <= range.hi) return null;
    const target = Math.round((range.hi / 100) * revenue);
    const current = Math.round(item.values[2]);
    const savings = current - target;
    if (savings <= 0) return null;
    return { account: item.account, savings };
  })
  .filter((x): x is NonNullable<typeof x> => x !== null)
  .sort((a, b) => b.savings - a.savings);

const totalSavings = allSavings.reduce((s, a) => s + a.savings, 0);

export default function SummaryPage() {
  async function handleExcelExport() {
    const { exportToExcel } = await import("@/lib/export-excel");
    exportToExcel();
  }

  async function handlePDFExport() {
    const { exportToPDF } = await import("@/lib/export-pdf");
    exportToPDF();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 print:space-y-4 print:max-w-none print:mx-0 print:px-0 print:pt-0">
      {/* Export buttons — hidden when printing */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Executive Summary
          </h1>
          <div className="h-1 w-16 bg-gradient-to-r from-teal to-teal-dark rounded-full mt-2 mb-3" />
          <p className="text-sm font-medium bg-gradient-to-r from-teal to-teal-dark bg-clip-text text-transparent">
            A one-page overview you can share with your accountant or advisor.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExcelExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Excel
          </button>
          <button
            onClick={handlePDFExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-700 text-white font-medium text-sm hover:bg-slate-800 transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal text-white font-medium text-sm hover:bg-teal-dark transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* Print-only header */}
      <div className="hidden print:block">
        <h1 className="text-2xl font-black text-black">
          Cool Hand of a Girl — Executive Summary
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Prepared February 2026 | Fiscal Years 2023–2025
        </p>
        <hr className="mt-2 border-gray-300" />
      </div>

      {/* Section 1: Business Snapshot */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 print:shadow-none print:border print:border-gray-200 print:rounded-none print:p-4">
        <h2 className="text-base font-bold text-slate-900 mb-3 print:text-sm">
          Business Snapshot
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm print:text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Business</span>
            <span className="font-medium text-slate-900">
              Cool Hand of a Girl Inc.
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Location</span>
            <span className="font-medium text-slate-900">
              2804 Dundas St W, Toronto
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Period</span>
            <span className="font-medium text-slate-900">
              Jan 2023 – Dec 2025
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Hours</span>
            <span className="font-medium text-slate-900">
              Tue–Sat, 8am–4pm (40 hrs/week)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Concept</span>
            <span className="font-medium text-slate-900">
              Organic Mexican, Breakfast & Lunch
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Est.</span>
            <span className="font-medium text-slate-900">2008 (17 years)</span>
          </div>
        </div>
      </div>

      {/* Section 2: 2025 at a Glance */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 print:shadow-none print:border print:border-gray-200 print:rounded-none print:p-4">
        <h2 className="text-base font-bold text-slate-900 mb-3 print:text-sm">
          2025 at a Glance
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 print:grid-cols-5">
          {[
            { label: "Revenue", value: formatCurrency(revenue, true), sub: "Down 9.5% YoY" },
            {
              label: "Net Income",
              value: formatCurrency(netIncome),
              sub: "Net loss",
              negative: true,
            },
            { label: "Food Cost", value: `${foodCostPct}%`, sub: "Industry: 30–38%" },
            { label: "Labor Cost", value: `${laborCostPct}%`, sub: "Industry: 25–35%" },
            {
              label: "Prime Cost",
              value: `${primeCostPct}%`,
              sub: "Target: <65%",
              negative: true,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="text-center p-3 rounded-lg bg-slate-50 print:bg-white print:border print:border-gray-200 print:p-2"
            >
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                {item.label}
              </p>
              <p
                className={`text-lg font-black mt-0.5 tabular-nums print:text-base ${
                  item.negative ? "text-red-600" : "text-slate-900"
                }`}
              >
                {item.value}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Break-Even Analysis */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 print:shadow-none print:border print:border-gray-200 print:rounded-none print:p-4">
        <h2 className="text-base font-bold text-slate-900 mb-3 print:text-sm">
          Break-Even Analysis
        </h2>
        <div className="space-y-3">
          {[
            {
              level: "Level 1: Accounting Break-Even",
              desc: "Revenue needed to cover all fixed costs at current margins",
              target: formatCurrency(accountingBE, true),
              gap: accountingGap,
            },
            {
              level: "Level 2: Fair Owner Pay ($70K)",
              desc: "Enough to pay Lucia a fair market salary",
              target: formatCurrency(ownerBE, true),
              gap: ownerGap,
            },
            {
              level: "Level 3: Industry-Standard Staffing",
              desc: "Revenue needed if labor were at the 34% industry standard",
              target: formatCurrency(industryBE, true),
              gap: industryGap,
            },
          ].map((item) => (
            <div
              key={item.level}
              className="flex items-start justify-between gap-4 p-3 rounded-lg bg-slate-50 print:bg-white print:border print:border-gray-200 print:p-2"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 print:text-xs">
                  {item.level}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 print:text-[10px]">
                  {item.desc}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-black text-slate-900 tabular-nums print:text-xs">
                  {item.target}
                </p>
                <p
                  className={`text-xs font-semibold tabular-nums print:text-[10px] ${
                    item.gap > 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {item.gap > 0
                    ? `+${formatCurrency(item.gap, true)} needed`
                    : "Achieved"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Top 3 Action Items */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 print:shadow-none print:border print:border-gray-200 print:rounded-none print:p-4">
        <h2 className="text-base font-bold text-slate-900 mb-3 print:text-sm">
          Top 3 Action Items
        </h2>
        <div className="space-y-3">
          {[
            {
              num: 1,
              title: "Restructure Staffing Costs",
              savings: allSavings[0]?.savings ?? 0,
              detail:
                "Staff costs at 48.6% of revenue vs. 35% industry cap. Audit shift schedules, cross-train team, set a weekly labor-cost target.",
            },
            {
              num: 2,
              title: "Audit Merchant Processing Fees",
              savings: allSavings[1]?.savings ?? 0,
              detail:
                "Paying 5.3% on merchant fees vs. 3% industry cap. Get competing quotes from Square, Clover, or Stripe.",
            },
            {
              num: 3,
              title: "Renegotiate Insurance",
              savings: allSavings[2]?.savings ?? 0,
              detail:
                "Insurance doubled to $11.9K (3.7% of revenue vs. 1.5% cap). Request re-quotes from 2–3 brokers.",
            },
          ].map((action) => (
            <div
              key={action.num}
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 print:bg-white print:border print:border-gray-200 print:p-2"
            >
              <div className="w-6 h-6 rounded-full bg-teal/10 flex items-center justify-center shrink-0 print:bg-gray-100">
                <span className="text-xs font-bold text-teal print:text-gray-700">
                  {action.num}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-slate-900 print:text-xs">
                    {action.title}
                  </p>
                  <span className="text-xs font-bold text-green-600 shrink-0 print:text-[10px]">
                    ~{formatCurrency(action.savings)}/yr
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 print:text-[10px]">
                  {action.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Total savings */}
        <div className="mt-3 p-3 rounded-lg bg-teal/5 border border-teal/20 text-center print:bg-white print:border-gray-300">
          <p className="text-xs text-slate-500">
            Total savings potential across all categories
          </p>
          <p className="text-xl font-black text-teal-dark mt-0.5 print:text-black">
            ~{formatCurrency(totalSavings)}/year
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-[10px] text-slate-400 text-center pt-2 print:text-gray-500 print:border-t print:border-gray-200 print:pt-2">
        <p>
          CHOG Financial Dashboard | Powered by Breeze AI | Data from QuickBooks
          P&L, Balance Sheet, and Wage Reports (2023–2025) | All amounts in CAD
        </p>
      </div>
    </div>
  );
}
