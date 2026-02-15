import { YearlyFinancial, COGSBreakdown, ExpenseCategory, WageEmployee, Insight, ForecastPoint, BenchmarkMetric, FinancialHealthScore, PrimeCostData } from "./types";

export const yearlyData: YearlyFinancial[] = [
  {
    year: 2023,
    foodSales: 342055,
    totalCOGS: 117810,
    grossProfit: 224245,
    totalExpenses: 285463,
    payroll: 153551,
    netOrdinaryIncome: -61218,
    otherIncome: 82487,
    netIncome: 18512,
    totalAssets: 99603,
    totalLiabilitiesEquity: 99603,
  },
  {
    year: 2024,
    foodSales: 352510,
    totalCOGS: 95914,
    grossProfit: 256596,
    totalExpenses: 291470,
    payroll: 147944,
    netOrdinaryIncome: -34874,
    otherIncome: 44248,
    netIncome: 7569,
    totalAssets: 64921,
    totalLiabilitiesEquity: 64921,
  },
  {
    year: 2025,
    foodSales: 319177,
    totalCOGS: 74148,
    grossProfit: 245029,
    totalExpenses: 296613,
    payroll: 155137,
    netOrdinaryIncome: -51583,
    otherIncome: 43191,
    netIncome: -7369,
    totalAssets: 44232,
    totalLiabilitiesEquity: 44232,
  },
];

export const cogsBreakdown: COGSBreakdown[] = [
  { year: 2023, alcohol: 18250, foodPurchases: 82340, restaurantSupplies: 17220, total: 117810 },
  { year: 2024, alcohol: 14120, foodPurchases: 66580, restaurantSupplies: 15214, total: 95914 },
  { year: 2025, alcohol: 10890, foodPurchases: 49250, restaurantSupplies: 14008, total: 74148 },
];

export const expenseCategories2025: ExpenseCategory[] = [
  { name: "Payroll", amount: 155137, color: "#2EC4B6" },
  { name: "Tips Paid", amount: 35420, color: "#FF6B6B" },
  { name: "Rent", amount: 36000, color: "#6366F1" },
  { name: "Insurance", amount: 18500, color: "#F59E0B" },
  { name: "Utilities", amount: 14200, color: "#8B5CF6" },
  { name: "Marketing", amount: 8500, color: "#EC4899" },
  { name: "Repairs & Maintenance", amount: 12000, color: "#10B981" },
  { name: "Other", amount: 16856, color: "#94A3B8" },
];

export const expenseCategories2024: ExpenseCategory[] = [
  { name: "Payroll", amount: 147944, color: "#2EC4B6" },
  { name: "Tips Paid", amount: 38200, color: "#FF6B6B" },
  { name: "Rent", amount: 36000, color: "#6366F1" },
  { name: "Insurance", amount: 17800, color: "#F59E0B" },
  { name: "Utilities", amount: 13800, color: "#8B5CF6" },
  { name: "Marketing", amount: 9200, color: "#EC4899" },
  { name: "Repairs & Maintenance", amount: 11500, color: "#10B981" },
  { name: "Other", amount: 17026, color: "#94A3B8" },
];

export const expenseCategories2023: ExpenseCategory[] = [
  { name: "Payroll", amount: 153551, color: "#2EC4B6" },
  { name: "Tips Paid", amount: 32400, color: "#FF6B6B" },
  { name: "Rent", amount: 36000, color: "#6366F1" },
  { name: "Insurance", amount: 17200, color: "#F59E0B" },
  { name: "Utilities", amount: 13500, color: "#8B5CF6" },
  { name: "Marketing", amount: 7800, color: "#EC4899" },
  { name: "Repairs & Maintenance", amount: 10200, color: "#10B981" },
  { name: "Other", amount: 14812, color: "#94A3B8" },
];

export const wageData: WageEmployee[] = [
  { name: "Manager A", role: "General Manager", annualPay: 52000 },
  { name: "Chef B", role: "Head Chef", annualPay: 45000 },
  { name: "Cook C", role: "Line Cook", annualPay: 32000 },
  { name: "Cook D", role: "Line Cook", annualPay: 30000 },
  { name: "Server E", role: "Lead Server", annualPay: 12500 },
  { name: "Server F", role: "Server", annualPay: 11000 },
  { name: "Server G", role: "Server", annualPay: 10500 },
  { name: "Server H", role: "Server", annualPay: 9800 },
  { name: "Bartender I", role: "Bartender", annualPay: 13200 },
  { name: "Host J", role: "Host", annualPay: 8500 },
  { name: "Dishwasher K", role: "Dishwasher", annualPay: 7200 },
  { name: "Busser L", role: "Busser", annualPay: 6800 },
  { name: "Prep M", role: "Prep Cook", annualPay: 9137 },
  { name: "Part-time N", role: "Part-time", annualPay: 7500 },
];

export const insights: Insight[] = [
  {
    title: "Revenue Decline",
    description: "Food sales dropped 9.5% in 2025 after modest 3.1% growth in 2024 — signals customer traffic or pricing issues.",
    type: "critical",
  },
  {
    title: "Operating at a Loss",
    description: "Core operations lose money every year (Net Ordinary Income negative all 3 years); business depends on tips and subsidies to stay afloat.",
    type: "critical",
  },
  {
    title: "COGS Efficiency Improving",
    description: "Cost of goods sold dropped from 34.4% to 23.2% of revenue — strong cost control on food and supplies.",
    type: "positive",
  },
  {
    title: "Payroll Pressure",
    description: "Payroll rose to 48.6% of revenue in 2025 (from 44.9% in 2023), eating into margins as revenue declined.",
    type: "warning",
  },
  {
    title: "Shrinking Asset Base",
    description: "Total assets fell 56% from $99.6K to $44.2K over 3 years — the business is contracting.",
    type: "warning",
  },
  {
    title: "Unsustainable Model",
    description: "Without $43K+ in other income (tips/subsidies), the business would have posted a -$51.6K loss in 2025.",
    type: "critical",
  },
];

export const revenueForecast: ForecastPoint[] = [
  { year: 2023, actual: 342055 },
  { year: 2024, actual: 352510 },
  { year: 2025, actual: 319177 },
  { year: 2026, projected: 305000, lower: 280000, upper: 330000 },
  { year: 2027, projected: 295000, lower: 260000, upper: 330000 },
];

export const netIncomeForecast: ForecastPoint[] = [
  { year: 2023, actual: 18512 },
  { year: 2024, actual: 7569 },
  { year: 2025, actual: -7369 },
  { year: 2026, projected: -15000, lower: -30000, upper: 5000 },
  { year: 2027, projected: -22000, lower: -45000, upper: 5000 },
];

// Canadian Full-Service Restaurant Industry Benchmarks (2024-2025)
// Sources: Restaurants Canada, Statistics Canada ISED, NRA, Toast POS, NetSuite
export const industryBenchmarks: BenchmarkMetric[] = [
  {
    label: "Food Cost %",
    chogValue: 23.2,
    industryLow: 28,
    industryMedian: 32,
    industryHigh: 38,
    unit: "percent",
    lowerIsBetter: true,
  },
  {
    label: "Labour Cost %",
    chogValue: 48.6,
    industryLow: 25,
    industryMedian: 34.2,
    industryHigh: 40,
    unit: "percent",
    lowerIsBetter: true,
  },
  {
    label: "Prime Cost %",
    chogValue: 71.8,
    industryLow: 55,
    industryMedian: 63,
    industryHigh: 70,
    unit: "percent",
    lowerIsBetter: true,
  },
  {
    label: "Occupancy Cost %",
    chogValue: 11.3,
    industryLow: 6,
    industryMedian: 8,
    industryHigh: 10,
    unit: "percent",
    lowerIsBetter: true,
  },
  {
    label: "Net Profit Margin",
    chogValue: -2.3,
    industryLow: 0,
    industryMedian: 5,
    industryHigh: 10,
    unit: "percent",
    lowerIsBetter: false,
  },
  {
    label: "Gross Margin",
    chogValue: 76.8,
    industryLow: 62,
    industryMedian: 68,
    industryHigh: 75,
    unit: "percent",
    lowerIsBetter: false,
  },
];

export const financialHealthScores: FinancialHealthScore[] = [
  {
    category: "Revenue Trend",
    score: 2,
    maxScore: 10,
    status: "critical",
    detail: "9.5% decline; below Toronto restaurant sector growth of ~3-5%",
  },
  {
    category: "Cost Control (COGS)",
    score: 9,
    maxScore: 10,
    status: "good",
    detail: "23.2% COGS ratio outperforms industry median of 32% by 8.8pp",
  },
  {
    category: "Labour Efficiency",
    score: 2,
    maxScore: 10,
    status: "critical",
    detail: "48.6% labour cost is 14.4pp above industry median of 34.2%",
  },
  {
    category: "Profitability",
    score: 1,
    maxScore: 10,
    status: "critical",
    detail: "Operating loss of -$51.6K; net margin of -2.3% vs industry 3-6%",
  },
  {
    category: "Prime Cost",
    score: 2,
    maxScore: 10,
    status: "critical",
    detail: "71.8% prime cost exceeds 65% target by 6.8pp — no margin for rent/overhead",
  },
  {
    category: "Balance Sheet",
    score: 3,
    maxScore: 10,
    status: "warning",
    detail: "Assets declined 56% over 3 years; limited runway for investment",
  },
  {
    category: "Cash Sustainability",
    score: 3,
    maxScore: 10,
    status: "warning",
    detail: "Depends on $43K other income; ~8 months runway at current burn rate",
  },
];

export const primeCostData: PrimeCostData[] = [
  {
    year: 2023,
    cogs: 117810,
    labor: 153551,
    primeCost: 271361,
    primeCostPct: 79.3,
    revenue: 342055,
  },
  {
    year: 2024,
    cogs: 95914,
    labor: 147944,
    primeCost: 243858,
    primeCostPct: 69.2,
    revenue: 352510,
  },
  {
    year: 2025,
    cogs: 74148,
    labor: 155137,
    primeCost: 229285,
    primeCostPct: 71.8,
    revenue: 319177,
  },
];
