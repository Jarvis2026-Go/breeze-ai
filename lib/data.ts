import { YearlyFinancial, COGSBreakdown, ExpenseCategory, WageEmployee, Insight, ForecastPoint, BenchmarkMetric, FinancialHealthScore, PrimeCostData, PnLLineItem } from "./types";

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

// Real GL data from QuickBooks P&L export
export const cogsBreakdown: COGSBreakdown[] = [
  { year: 2023, alcohol: 0, foodPurchases: 114288.10, restaurantSupplies: 3522.38, total: 117810.48 },
  { year: 2024, alcohol: 2021.83, foodPurchases: 90888.47, restaurantSupplies: 3003.67, total: 95913.97 },
  { year: 2025, alcohol: 734.41, foodPurchases: 72491.60, restaurantSupplies: 922.13, total: 74148.14 },
];

// Real GL data grouped into categories — totals tie to QuickBooks P&L
export const expenseCategories2025: ExpenseCategory[] = [
  { name: "Payroll", amount: 155137, color: "#2EC4B6" },
  { name: "Tips Paid", amount: 43194, color: "#FF6B6B" },
  { name: "Rent", amount: 35953, color: "#6366F1" },
  { name: "Payment Processing", amount: 19775, color: "#F59E0B" },
  { name: "Insurance", amount: 11946, color: "#8B5CF6" },
  { name: "Utilities", amount: 11110, color: "#EC4899" },
  { name: "Office Supplies", amount: 5256, color: "#10B981" },
  { name: "Other Operating", amount: 14242, color: "#94A3B8" },
];

export const expenseCategories2024: ExpenseCategory[] = [
  { name: "Payroll", amount: 147944, color: "#2EC4B6" },
  { name: "Tips Paid", amount: 47624, color: "#FF6B6B" },
  { name: "Rent", amount: 34344, color: "#6366F1" },
  { name: "Payment Processing", amount: 20572, color: "#F59E0B" },
  { name: "Insurance", amount: 5385, color: "#8B5CF6" },
  { name: "Utilities", amount: 10437, color: "#EC4899" },
  { name: "Office Supplies", amount: 5874, color: "#10B981" },
  { name: "Other Operating", amount: 19290, color: "#94A3B8" },
];

export const expenseCategories2023: ExpenseCategory[] = [
  { name: "Payroll", amount: 153551, color: "#2EC4B6" },
  { name: "Tips Paid", amount: 24458, color: "#FF6B6B" },
  { name: "Rent", amount: 39279, color: "#6366F1" },
  { name: "Payment Processing", amount: 3698, color: "#F59E0B" },
  { name: "Insurance", amount: 4599, color: "#8B5CF6" },
  { name: "Utilities", amount: 11739, color: "#EC4899" },
  { name: "Office Supplies", amount: 5187, color: "#10B981" },
  { name: "Other Operating", amount: 42952, color: "#94A3B8" },
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
    label: "Spent on Food & Supplies",
    chogValue: 23.2,
    industryLow: 28,
    industryMedian: 32,
    industryHigh: 38,
    unit: "percent",
    lowerIsBetter: true,
  },
  {
    label: "Spent on Staff",
    chogValue: 48.6,
    industryLow: 25,
    industryMedian: 34.2,
    industryHigh: 40,
    unit: "percent",
    lowerIsBetter: true,
  },
  {
    label: "Food + Staff Combined",
    chogValue: 71.8,
    industryLow: 55,
    industryMedian: 63,
    industryHigh: 70,
    unit: "percent",
    lowerIsBetter: true,
  },
  {
    label: "Spent on Rent",
    chogValue: 11.3,
    industryLow: 6,
    industryMedian: 8,
    industryHigh: 10,
    unit: "percent",
    lowerIsBetter: true,
  },
  {
    label: "Profit Kept per Dollar",
    chogValue: -2.3,
    industryLow: 0,
    industryMedian: 5,
    industryHigh: 10,
    unit: "percent",
    lowerIsBetter: false,
  },
  {
    label: "Money Left After Food Costs",
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
    category: "Sales",
    score: 2,
    maxScore: 10,
    status: "critical",
    detail: "Sales dropped 9.5% — most Toronto restaurants grew during this period",
  },
  {
    category: "Food & Supply Costs",
    score: 9,
    maxScore: 10,
    status: "good",
    detail: "You spend less on ingredients than most restaurants — great job here",
  },
  {
    category: "Staffing Costs",
    score: 2,
    maxScore: 10,
    status: "critical",
    detail: "Almost half of every dollar earned goes to staff — way above average",
  },
  {
    category: "Profit",
    score: 1,
    maxScore: 10,
    status: "critical",
    detail: "The restaurant lost money from day-to-day operations every year",
  },
  {
    category: "Food + Staff Combined",
    score: 2,
    maxScore: 10,
    status: "critical",
    detail: "Food and staff costs together eat up 72 cents of every dollar earned",
  },
  {
    category: "What You Own",
    score: 3,
    maxScore: 10,
    status: "warning",
    detail: "The value of things the business owns has dropped by more than half",
  },
  {
    category: "Cash Runway",
    score: 3,
    maxScore: 10,
    status: "warning",
    detail: "Without tips and subsidies, the business would run out of cash quickly",
  },
];

// Every GL account from the QuickBooks P&L — exact cent values from the books.
// Display rounds to whole dollars; sub-accounts sum exactly to their subtotal.
export const pnlLineItems: PnLLineItem[] = [
  // ── Revenue ──
  { account: "Food Sales", values: [342055.29, 352510.25, 319177.32], industryPctMedian: "100%", isCost: false, bold: true },

  // ── Cost of Goods Sold ──
  { account: "Alcohol Purchase", values: [0, 2021.83, 734.41], isCost: true, indent: true, group: "cogs" },
  { account: "Food Purchases", values: [114288.10, 90888.47, 72491.60], isCost: true, indent: true, group: "cogs" },
  { account: "Restaurant Supplies", values: [3522.38, 3003.67, 922.13], isCost: true, indent: true, group: "cogs" },
  { account: "Total COGS", values: [117810.48, 95913.97, 74148.14], industryPctMedian: "30-33%", isCost: true, bold: true, separator: true, groupHeader: "cogs" },

  { account: "Gross Profit", values: [224244.81, 256596.28, 245029.18], industryPctMedian: "67-70%", isCost: false, bold: true, separator: true },

  // ── Expense (all 24 GL accounts) ──
  { account: "Advertising and Promotion", values: [952.13, 9.60, 0], isCost: true, indent: true, group: "opex" },
  { account: "Automobile Expenses", values: [3215.81, 2331.47, 924.59], isCost: true, indent: true, group: "opex" },
  { account: "Bank Service Charges", values: [801.95, 2056.01, 2739.32], isCost: true, indent: true, group: "opex" },
  { account: "Business Licenses and Permits", values: [0, 4627.38, 0], isCost: true, indent: true, group: "opex" },
  { account: "Cleaning Expenses", values: [18484.50, 0, 1239.50], isCost: true, indent: true, group: "opex" },
  { account: "Computer and Internet Expenses", values: [0, 0, 1500], isCost: true, indent: true, group: "opex" },
  { account: "Depreciation Expense", values: [2578, 1805, 1263], isCost: true, indent: true, group: "opex" },
  { account: "Employee Benefits", values: [0, 322.48, 0], isCost: true, indent: true, group: "opex" },
  { account: "Equipment Rental", values: [5057.98, 4241.02, 2730.15], isCost: true, indent: true, group: "opex" },
  { account: "Fines and Penalties", values: [1277.43, 0, 0], isCost: true, indent: true, group: "opex" },
  { account: "Insurance Expense", values: [4598.55, 5385.36, 11945.56], isCost: true, indent: true, group: "opex" },
  { account: "Meals & Entertainment", values: [92.46, 251.49, 0], isCost: true, indent: true, group: "opex" },
  { account: "Membership Fees", values: [0, 730.21, 275], isCost: true, indent: true, group: "opex" },
  { account: "Merchant Account Fees", values: [2896.47, 18515.50, 17036.15], isCost: true, indent: true, group: "opex" },
  { account: "Office Supplies", values: [5187.34, 5874.17, 5255.92], isCost: true, indent: true, group: "opex" },
  { account: "Parking", values: [0, 307.35, 0], isCost: true, indent: true, group: "opex" },
  { account: "Payroll Expenses", values: [153551.37, 147944.26, 155137.09], industryPctMedian: "30-35%", isCost: true, indent: true, group: "opex" },
  { account: "Professional Fees", values: [8051.25, 2400, 4260], isCost: true, indent: true, group: "opex" },
  { account: "Rent Expense", values: [39279.27, 34344.24, 35953.44], industryPctMedian: "6-10%", isCost: true, indent: true, group: "opex" },
  { account: "Repairs and Maintenance", values: [2300.85, 1339.34, 2049.21], isCost: true, indent: true, group: "opex" },
  { account: "Telephone Expense", values: [850, 755.22, 0], isCost: true, indent: true, group: "opex" },
  { account: "Tips Paid to Employee", values: [24458.10, 47623.98, 43193.75], industryPctMedian: "8-12%", isCost: true, indent: true, group: "opex" },
  { account: "Utilities", values: [11739.42, 10436.74, 11109.96], industryPctMedian: "3-5%", isCost: true, indent: true, group: "opex" },
  { account: "Waste Management", values: [90, 169.14, 0], isCost: true, indent: true, group: "opex" },
  { account: "Total Expense", values: [285462.88, 291469.96, 296612.64], industryPctMedian: "85-93%", isCost: true, bold: true, separator: true, groupHeader: "opex" },

  { account: "Net Ordinary Income", values: [-61218.07, -34873.68, -51583.46], industryPctMedian: "3-7%", isCost: false, bold: true, separator: true },

  // ── Other Income ──
  { account: "Other Income-Subsidies & Grants", values: [20000, 0, 0], isCost: false, indent: true, group: "otherinc" },
  { account: "Other Income-Tips", values: [62487.01, 44247.70, 43190.76], isCost: false, indent: true, group: "otherinc" },
  { account: "Total Other Income", values: [82487.01, 44247.70, 43190.76], isCost: false, bold: true, separator: true, groupHeader: "otherinc" },

  // ── Other Expense ──
  { account: "Income Tax", values: [2757, 1805, -1023.83], isCost: true, indent: true, group: "otherexp" },
  { account: "Total Other Expense", values: [2757, 1805, -1023.83], isCost: true, bold: true, separator: true, groupHeader: "otherexp" },

  { account: "Net Other Income", values: [79730.01, 42442.70, 44214.59], isCost: false, bold: true, separator: true },
  { account: "Net Income", values: [18511.94, 7569.02, -7368.87], industryPctMedian: "3-5%", isCost: false, bold: true, separator: true },
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
