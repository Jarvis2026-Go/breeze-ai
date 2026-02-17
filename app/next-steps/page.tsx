"use client";

import { cn } from "@/lib/utils";
import { yearlyData, pnlLineItems } from "@/lib/data";
import { formatCurrency } from "@/lib/formatting";
import {
  Users,
  CreditCard,
  Shield,
  Package,
  Utensils,
  Calendar,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Rocket,
  ChevronRight,
} from "lucide-react";

// ── Key 2025 financials ──
const revenue = yearlyData[2].foodSales;
const netIncome = yearlyData[2].netIncome;

// ── Savings opportunities (same logic as P&L page) ──
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

// Tips Paid to Employee is excluded — tip income ($43K) offsets tips paid ($43K).
// It's a pass-through required by Ontario law, not a controllable expense.
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
    return { account: item.account, current, target, savings, pct, industryMax: range.hi };
  })
  .filter((x): x is NonNullable<typeof x> => x !== null)
  .sort((a, b) => b.savings - a.savings);

const totalSavings = allSavings.reduce((s, a) => s + a.savings, 0);
const conservativeTarget = Math.round(netIncome + totalSavings * 0.6);

// ── Profit bridge: running total as each saving stacks ──
let running = netIncome;
const profitSteps = allSavings.slice(0, 4).map((item) => {
  running += item.savings;
  return { ...item, cumulative: running };
});
const fullPotential = running;

// ── Priority actions with CHOG-specific tactics ──
const actions: {
  title: string;
  icon: typeof Users;
  why: string;
  color: string;
  badgeColor: string;
  impact: string;
  tactics: string[];
  timeline: string;
}[] = [
  {
    title: "Restructure Staffing Costs",
    icon: Users,
    why: `Staff costs consume ${((yearlyData[2].payroll / revenue) * 100).toFixed(1)}\u00A2 of every dollar \u2014 the industry max is 35\u00A2. This single fix could save more than your entire 2025 net loss.`,
    color: "border-l-red-500 bg-red-50/50",
    badgeColor: "bg-red-100 text-red-700",
    impact: "High",
    tactics: [
      "Audit shift schedules against hourly sales \u2014 find overstaffed time blocks",
      "Cross-train 2\u20133 team members to cover prep, line, and front-of-house",
      "Set a weekly labor-cost target of 35% and review every Monday",
      "With only 40 hrs/week open (Tue\u2013Sat 8am\u20134pm), confirm all 14 staff positions are needed",
      "Don\u2019t replace the next natural departure \u2014 absorb with cross-training",
    ],
    timeline: "Start week 1 \u00B7 Full savings in 6 months",
  },
  {
    title: "Audit Merchant Processing Fees",
    icon: CreditCard,
    why: "You\u2019re paying 5.3% of revenue on merchant fees \u2014 the industry cap is 3%. This jumped from $2.9K to $18.5K between 2023\u20132024, a 6.4x increase that suggests a contract change or GL miscoding.",
    color: "border-l-blue-500 bg-blue-50/50",
    badgeColor: "bg-blue-100 text-blue-700",
    impact: "Medium",
    tactics: [
      "Get 3 competing quotes from Square, Clover, or Stripe",
      "Review current processor contract for hidden fees or tiered markup",
      "Ask bookkeeper to verify only card processing is coded to this GL",
      "A 5.3% effective rate is well above market for a $319K business",
    ],
    timeline: "Start this week \u00B7 Switch in 45 days",
  },
  {
    title: "Renegotiate Insurance",
    icon: Shield,
    why: "Insurance doubled from $5.4K to $11.9K in one year \u2014 that\u2019s 3.7% of revenue vs. the 1.5% industry cap. Either the rate spiked or expenses are miscoded.",
    color: "border-l-purple-500 bg-purple-50/50",
    badgeColor: "bg-purple-100 text-purple-700",
    impact: "Medium",
    tactics: [
      "Request re-quotes from 2\u20133 commercial insurance brokers",
      "Review coverage \u2014 are you over-insured for a breakfast/lunch operation?",
      "Ask bookkeeper to verify no non-insurance items are coded here",
      "Bundle policies (liability + property + business interruption) for volume discount",
    ],
    timeline: "Start week 1 \u00B7 New policy in 30\u201360 days",
  },
  {
    title: "Clean Up Office Supplies GL",
    icon: Package,
    why: "Office Supplies at 1.6% of revenue is 3x the industry average. Items that belong in COGS (Restaurant Supplies) or other accounts are likely miscoded here.",
    color: "border-l-teal bg-teal/5",
    badgeColor: "bg-teal/10 text-teal-dark",
    impact: "Low",
    tactics: [
      "Have bookkeeper review every item coded to Office Supplies in the last 12 months",
      "Reclassify food-related items (containers, paper goods, cleaning) to proper GL accounts",
      "Set a purchase approval process for non-food supplies over $100",
    ],
    timeline: "Start week 2 \u00B7 Complete in 30 days",
  },
];

// ── Revenue growth opportunities specific to CHOG ──
const revenueOpportunities = [
  {
    title: "Launch Sunday Brunch",
    icon: Calendar,
    potential: "$25K\u2013$40K/year",
    effort: "Low effort",
    effortColor: "bg-green-100 text-green-700",
    description:
      "Toronto\u2019s brunch scene is massive. Organic Mexican brunch \u2014 chilaquiles, huevos rancheros, breakfast burritos \u2014 is a natural extension of what CHOG already does best.",
    details: [
      "You already have the breakfast infrastructure and recipes",
      "Sunday brunch on Dundas West draws heavy foot traffic",
      "Organic + Mexican is a differentiated brunch positioning",
      "Minimal additional staffing \u2014 existing team rotates in",
      "Test for 8 Sundays before committing permanently",
    ],
  },
  {
    title: "Friday\u2013Saturday Dinner Pop-Ups",
    icon: Utensils,
    potential: "$30K\u2013$50K/year",
    effort: "Medium effort",
    effortColor: "bg-amber-100 text-amber-700",
    description:
      "Mexican cuisine shines at dinner \u2014 tacos al pastor, mole, fresh margaritas. Start with monthly pop-ups to test demand before committing to full dinner service.",
    details: [
      "Start with 2 pop-up dinners per month (Friday or Saturday, 5\u20139pm)",
      "Leverage existing kitchen and most of the same ingredients",
      "A prix-fixe or limited menu keeps labor lean",
      "Dundas West has strong evening foot traffic and dining culture",
      "Mexican dinner + cocktails or BYOB = high average check",
    ],
  },
  {
    title: "Corporate Catering",
    icon: TrendingUp,
    potential: "$15K\u2013$30K/year",
    effort: "Low effort",
    effortColor: "bg-green-100 text-green-700",
    description:
      "Mexican food is one of the most catered cuisines \u2014 tacos, bowls, and platters transport well and scale easily. CHOG\u2019s organic angle commands premium pricing for corporate events.",
    details: [
      "Create a simple catering menu: taco bar, bowl platters, family-style",
      "Target the Dundas West / Junction office corridor for corporate lunches",
      "Add a catering inquiry page to coolhandofagirl.com",
      "Leverage your Instagram following to announce catering availability",
      "Prep happens during non-peak morning hours \u2014 minimal disruption",
    ],
  },
];

// ── 90-day action timeline ──
const timeline = [
  {
    phase: "Days 1\u201330",
    title: "Quick Wins",
    color: "bg-green-500",
    items: [
      "Get 3 merchant processing quotes and compare to current 5.3% rate",
      "Request insurance re-quotes from 2 competing brokers",
      "Pull 4 weeks of shift schedules \u2014 map labor hours against hourly sales",
      "Have bookkeeper flag all Office Supplies transactions for GL review",
      "Review bank service charges \u2014 $2.7K may include avoidable fees",
    ],
  },
  {
    phase: "Days 31\u201360",
    title: "Test & Switch",
    color: "bg-teal",
    items: [
      "Run first Sunday brunch trial (4 consecutive Sundays)",
      "Build a simple catering menu and share with 10 local businesses",
      "Switch merchant processor if new quote saves >$3K/year",
      "Lock in new insurance policy if better rate found",
      "Post catering availability on Instagram and website",
    ],
  },
  {
    phase: "Days 61\u201390",
    title: "Structural Fixes",
    color: "bg-indigo-500",
    items: [
      "Set weekly labor-cost target (35%) and begin schedule optimization",
      "Lock in Sunday brunch as permanent if trial was profitable",
      "Plan first Friday dinner pop-up event for month 4",
      "Complete GL reclassification of miscoded office supplies",
      "Review all GL categories with bookkeeper for accuracy",
    ],
  },
];

export default function NextStepsPage() {
  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Section 1: Hero */}
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Unlock Profit in 2026
        </h1>
        <div className="h-1 w-16 bg-gradient-to-r from-teal to-teal-dark rounded-full mt-2 mb-3" />
        <p className="text-sm font-medium bg-gradient-to-r from-teal to-teal-dark bg-clip-text text-transparent">
          A data-driven action plan to turn CHOG&apos;s $7K loss into a $30K+
          profit &mdash; built from your actual books.
        </p>
      </div>

      {/* Section 2: The Profit Bridge */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">The Profit Bridge</h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          We found {formatCurrency(totalSavings)} in annual savings potential
          across 4 expense categories. Even hitting 60% of these targets would
          flip your loss into a healthy profit.
        </p>

        {/* From → To */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-5 rounded-xl bg-red-50 border border-red-200 text-center">
            <p className="text-xs font-medium text-red-600 uppercase tracking-wider">
              2025 Actual
            </p>
            <p className="text-3xl font-black text-red-600 mt-1">
              {formatCurrency(netIncome)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Net Loss</p>
          </div>
          <div className="flex items-center justify-center">
            <ArrowRight className="w-8 h-8 text-slate-300" />
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-teal/10 to-green-50 border border-teal/20 text-center">
            <p className="text-xs font-medium text-teal-dark uppercase tracking-wider">
              2026 Target (60%)
            </p>
            <p className="text-3xl font-black text-teal-dark mt-1">
              +{formatCurrency(conservativeTarget)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Net Profit</p>
          </div>
        </div>

        {/* Step-by-step bridge */}
        <div className="space-y-3">
          {/* Starting point */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-red-600">!</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  Starting point (2025 net income)
                </span>
                <span className="font-bold text-red-600">
                  {formatCurrency(netIncome)}
                </span>
              </div>
            </div>
          </div>

          {profitSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-green-700">
                  {i + 1}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-700 font-medium">
                    {step.account}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-green-600 font-medium">
                      +{formatCurrency(step.savings)}
                    </span>
                    <span
                      className={cn(
                        "font-bold tabular-nums min-w-[80px] text-right",
                        step.cumulative >= 0 ? "text-green-700" : "text-red-600"
                      )}
                    >
                      {step.cumulative >= 0 ? "+" : ""}
                      {formatCurrency(step.cumulative)}
                    </span>
                  </div>
                </div>
                <div className="relative h-2 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full transition-all",
                      step.cumulative >= 0 ? "bg-green-400" : "bg-red-300"
                    )}
                    style={{
                      width: `${Math.max(
                        2,
                        ((step.cumulative - netIncome) /
                          (fullPotential - netIncome)) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Full vs conservative targets */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <p className="text-xs text-slate-500">If you hit 100% of targets</p>
            <p className="text-xl font-black text-green-600">
              +{formatCurrency(fullPotential)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-teal/5 border border-teal/20 text-center">
            <p className="text-xs text-slate-500">Conservative (60%)</p>
            <p className="text-xl font-black text-teal-dark">
              +{formatCurrency(conservativeTarget)}
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Priority Actions */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">
          4 Priority Actions
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Ranked by dollar impact &mdash; tackle #1 first, it&apos;s worth more
          than all others combined.
        </p>
        <div className="space-y-4">
          {actions.map((action, i) => {
            const savings = allSavings[i];
            return (
              <div
                key={i}
                className={cn(
                  "bg-white rounded-2xl p-6 shadow-sm border border-slate-100 border-l-4",
                  action.color
                )}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <action.icon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        <span className="text-slate-400 mr-1">#{i + 1}</span>{" "}
                        {action.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {action.timeline}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={cn(
                        "text-xs font-semibold px-2.5 py-0.5 rounded-full",
                        action.badgeColor
                      )}
                    >
                      {action.impact} impact
                    </span>
                    <p className="text-lg font-black text-green-600 mt-1">
                      ~{formatCurrency(savings.savings)}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-3">{action.why}</p>

                {/* Current vs target bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>
                      Current:{" "}
                      <span className="font-semibold text-slate-700">
                        {formatCurrency(savings.current)}
                      </span>{" "}
                      ({savings.pct.toFixed(1)}%)
                    </span>
                    <span>
                      Target:{" "}
                      <span className="font-semibold text-green-700">
                        {formatCurrency(savings.target)}
                      </span>{" "}
                      ({savings.industryMax}%)
                    </span>
                  </div>
                  <div className="relative h-3 bg-red-100 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-green-300 rounded-full"
                      style={{
                        width: `${(savings.target / savings.current) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Tactics */}
                <div className="space-y-1.5">
                  {action.tactics.map((tactic, ti) => (
                    <div key={ti} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                      <span className="text-slate-600">{tactic}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 4: Revenue Growth Opportunities */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">
          Grow Revenue &mdash; Don&apos;t Just Cut Costs
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          CHOG is currently open just 40 hours/week (Tue&ndash;Sat,
          8am&ndash;4pm). A typical restaurant operates 70&ndash;80+. These
          revenue plays leverage your existing kitchen and brand without major
          investment.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {revenueOpportunities.map((opp, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center shrink-0">
                  <opp.icon className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {opp.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-bold text-teal">
                      {opp.potential}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                        opp.effortColor
                      )}
                    >
                      {opp.effort}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-3">{opp.description}</p>
              <div className="space-y-1.5 mt-auto">
                {opp.details.map((d, di) => (
                  <div key={di} className="flex items-start gap-2 text-xs">
                    <ChevronRight className="w-3 h-3 text-teal mt-0.5 shrink-0" />
                    <span className="text-slate-500">{d}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Revenue potential callout */}
        <div className="mt-4 p-4 bg-teal/5 border border-teal/20 rounded-lg">
          <p className="text-sm text-teal-dark">
            <strong>Combined revenue potential: $70K&ndash;$120K/year</strong>{" "}
            &mdash; even capturing the low end would increase revenue by 22%,
            dramatically improving all your cost ratios without cutting anything.
          </p>
        </div>
      </div>

      {/* Section 5: 90-Day Action Plan */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          Your 90-Day Action Plan
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          Start with the easy wins that take phone calls, not restructuring.
          Build momentum before tackling the hard stuff.
        </p>
        <div className="space-y-6">
          {timeline.map((phase, pi) => (
            <div key={pi}>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={cn("w-3 h-3 rounded-full shrink-0", phase.color)}
                />
                <div>
                  <span className="font-bold text-slate-900">
                    {phase.phase}
                  </span>
                  <span className="text-slate-400 mx-2">&middot;</span>
                  <span className="text-sm text-slate-500">{phase.title}</span>
                </div>
              </div>
              <div className="ml-6 space-y-2">
                {phase.items.map((item, ii) => (
                  <div key={ii} className="flex items-start gap-2.5 text-sm">
                    <div className="w-5 h-5 rounded border-2 shrink-0 mt-0.5 border-slate-200" />
                    <span className="text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: Beyond 90 Days — Question Every Dollar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          Beyond 90 Days: Question Every Dollar
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          After locking in the big 4 wins, adopt a quarterly habit of reviewing
          every expense line. These items are individually smaller &mdash; but
          collectively they represent another ~$20K in potential savings and
          revenue.
        </p>

        <div className="space-y-4">
          {/* Bank Service Charges */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900 text-sm">
                  Bank Service Charges
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  Above range
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>$2,739 (0.9%)</span>
                <span className="font-semibold text-green-600">~$1,100</span>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              Are you paying for a premium business account tier you don&apos;t
              need? Many banks offer free or low-fee business checking for small
              businesses. Compare options &mdash; this should be under 0.5% of
              revenue.
            </p>
          </div>

          {/* Utilities */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900 text-sm">
                  Utilities
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  Near ceiling
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>$11,110 (3.5%)</span>
                <span className="font-semibold text-green-600">
                  ~$1,100&ndash;$1,700
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              At 3.5% you&apos;re near the 4% industry cap. Audit energy usage:
              LED lighting, smart thermostats, and shifting prep to off-peak
              hours can cut utility bills 10&ndash;15%.
            </p>
          </div>

          {/* Equipment Rental */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900 text-sm">
                  Equipment Rental
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                  On track
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>$2,730 (0.9%)</span>
                <span className="font-semibold text-green-600">~$2,730</span>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              Would buying this equipment outright be cheaper? At $2.7K/year, a
              one-time $4K purchase pays for itself in 18 months and eliminates
              the recurring cost entirely.
            </p>
          </div>

          {/* Professional Fees */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900 text-sm">
                  Professional Fees
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                  On track
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>$4,260 (1.3%)</span>
                <span className="font-semibold text-green-600">
                  ~$500&ndash;$1,500
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              When did you last get competing quotes for bookkeeping, accounting,
              or legal? Even &ldquo;on track&rdquo; items deserve a market check
              every 2 years. Get 2 quotes and negotiate.
            </p>
          </div>

          {/* Automobile */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900 text-sm">
                  Automobile Expenses
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                  On track
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>$925 (0.3%)</span>
                <span className="font-semibold text-green-600">
                  ~$500&ndash;$925
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              Is a vehicle expense necessary for a restaurant? If it&apos;s for
              ingredient pickup, batch your orders to reduce trips or negotiate
              supplier delivery.
            </p>
          </div>

          {/* Menu Pricing */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900 text-sm">
                  Menu Pricing Review
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-teal/10 text-teal-dark">
                  Revenue play
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="font-semibold text-green-600">~$9,600</span>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              Have you raised prices in the last 12 months? A 3%
              across-the-board increase on $319K = ~$9,600/year. With organic
              positioning, customers already expect a premium &mdash; you have
              pricing power most restaurants don&apos;t.
            </p>
          </div>

          {/* Food Waste */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900 text-sm">
                  Food Waste Reduction
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-teal/10 text-teal-dark">
                  Revenue play
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="font-semibold text-green-600">~$3,600</span>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              Are you tracking daily food waste? The industry average is
              4&ndash;10% of food purchases. Even a 5% reduction on $72K COGS =
              ~$3,600/year. Start a daily waste log and review weekly.
            </p>
          </div>
        </div>

        {/* Mindset callout */}
        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-sm text-slate-700">
            <strong>The profit mindset:</strong> Restaurants that reach 5&ndash;7%
            net margins don&apos;t get there from one big cut &mdash; they get
            there by questioning every line item, every quarter. Make it a habit
            to ask: <em>&ldquo;Do we still need this? Can we get it cheaper? Is
            it coded correctly?&rdquo;</em>
          </p>
        </div>
      </div>

      {/* Section 7: Bottom Line */}
      <div className="bg-gradient-to-r from-teal to-teal-dark rounded-2xl p-8 text-white text-center">
        <Rocket className="w-10 h-10 mx-auto mb-3 opacity-90" />
        <h2 className="text-2xl font-black">The path to profit is real.</h2>
        <p className="text-base mt-2 opacity-90 max-w-2xl mx-auto">
          CHOG isn&apos;t far from profitability &mdash; the business lost just
          $7K on $319K in revenue. That&apos;s a 2.3% gap. The four actions
          above can close it and then some. Start with the easy wins (insurance,
          merchant fees), build momentum, and tackle staffing as you go.
        </p>
        <div className="flex items-center justify-center gap-8 mt-6">
          <div>
            <p className="text-sm opacity-75">Cost savings potential</p>
            <p className="text-2xl font-black">
              ~{formatCurrency(totalSavings)}
            </p>
          </div>
          <div className="w-px h-12 bg-white/30" />
          <div>
            <p className="text-sm opacity-75">Revenue growth potential</p>
            <p className="text-2xl font-black">$70K&ndash;$120K</p>
          </div>
        </div>
      </div>
    </div>
  );
}
