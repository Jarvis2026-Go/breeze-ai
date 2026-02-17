import { YearlyFinancial, COGSBreakdown, ExpenseCategory, WageEmployee, Insight, ForecastPoint, BenchmarkMetric, FinancialHealthScore, PrimeCostData, PnLLineItem, BSLineItem } from "./types";

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

// Real payroll data from payroll system — all 3 years
// 2023: Gross $143,095 + ET $10,456 = $153,551 (matches P&L)
// 2024: Gross $136,489 + ET $9,943 = $146,432 (P&L $147,944 — ~$1.5K gap likely EHT/WSIB)
// 2025: Gross $145,121 + ET $9,744 + VacPay $272 = $155,137 (matches P&L)

export const wageData2023: WageEmployee[] = [
  { name: "Lucia Maceda",             role: "GM / Owner",  hourlyRate: null,  hoursWorked: 2080,    grossPay: 40524.88, employerTaxes: 3127.89, isSalaried: true },
  { name: "Benjamin Seoane Fernandez",role: "Cook",        hourlyRate: 16.00, hoursWorked: 1477.50, grossPay: 24585.60, employerTaxes: 1863.73 },
  { name: "Amaranta Valer Setti C.",  role: "Cook",        hourlyRate: 16.55, hoursWorked: 1397.20, grossPay: 22475.08, employerTaxes: 1697.97 },
  { name: "Jair Marin",              role: "Cook",        hourlyRate: 16.55, hoursWorked: 903.20,  grossPay: 14239.36, employerTaxes: 1028.06 },
  { name: "Momoko Tagami",           role: "Cook",        hourlyRate: 16.55, hoursWorked: 857.87,  grossPay: 13887.61, employerTaxes: 1015.07 },
  { name: "Haruki Arakawa",          role: "Cook",        hourlyRate: 15.50, hoursWorked: 510.62,  grossPay: 8231.15,  employerTaxes: 589.48 },
  { name: "Pamela J Saldivar",       role: "Cook",        hourlyRate: 16.55, hoursWorked: 379.47,  grossPay: 6157.40,  employerTaxes: 410.78 },
  { name: "Shota Harada",            role: "Cook",        hourlyRate: 15.50, hoursWorked: 184.83,  grossPay: 2979.52,  employerTaxes: 173.20 },
  { name: "Nahum Mann",              role: "Cook",        hourlyRate: 16.00, hoursWorked: 178.83,  grossPay: 2861.34,  employerTaxes: 203.49 },
  { name: "Aura Bellien Hurta V.",   role: "Cook",        hourlyRate: 16.55, hoursWorked: 151.40,  grossPay: 2505.68,  employerTaxes: 158.21 },
  { name: "Isadora A Martiri",       role: "Cook",        hourlyRate: 15.50, hoursWorked: 121.83,  grossPay: 1888.42,  employerTaxes: 43.11 },
  { name: "Liza Kim Jackson",        role: "Cook",        hourlyRate: 20.00, hoursWorked: 109.25,  grossPay: 2185.00,  employerTaxes: 117.50 },
  { name: "Pablo Villa Pino",        role: "Cook",        hourlyRate: 16.55, hoursWorked: 19.40,   grossPay: 333.93,   employerTaxes: 15.88 },
  { name: "Yeonher Song",            role: "Cook",        hourlyRate: 15.50, hoursWorked: 15.50,   grossPay: 240.25,   employerTaxes: 11.78 },
];

export const wageData2024: WageEmployee[] = [
  { name: "Lucia Maceda",             role: "GM / Owner",  hourlyRate: null,  hoursWorked: 2000,    grossPay: 40324.00, employerTaxes: 3067.17, isSalaried: true },
  { name: "Mutsuki Fujimoto",        role: "Cook",        hourlyRate: 16.55, hoursWorked: 1093.10, grossPay: 18760.23, employerTaxes: 1416.05 },
  { name: "Aura Bellien Hurta V.",   role: "Cook",        hourlyRate: 16.55, hoursWorked: 1098,    grossPay: 18440.06, employerTaxes: 1317.53 },
  { name: "Pamela J Saldivar",       role: "Cook",        hourlyRate: 16.55, hoursWorked: 1050.40, grossPay: 17564.08, employerTaxes: 1261.08 },
  { name: "Juan Ramses Maceda S.",   role: "Cook",        hourlyRate: 16.55, hoursWorked: 906.60,  grossPay: 15037.39, employerTaxes: 1140.09 },
  { name: "Jair Marin",              role: "Cook",        hourlyRate: 16.55, hoursWorked: 828.30,  grossPay: 13838.05, employerTaxes: 938.81 },
  { name: "Momoko Tagami",           role: "Cook",        hourlyRate: 16.55, hoursWorked: 404.35,  grossPay: 6708.56,  employerTaxes: 507.03 },
  { name: "Haruto Okuya",            role: "Cook",        hourlyRate: 16.55, hoursWorked: 147.10,  grossPay: 2434.53,  employerTaxes: 161.40 },
  { name: "Liza Kim Jackson",        role: "Cook",        hourlyRate: 20.00, hoursWorked: 106,     grossPay: 2120.00,  employerTaxes: 68.48 },
  { name: "Quinn Patton",            role: "Cook",        hourlyRate: 16.55, hoursWorked: 76.25,   grossPay: 1261.94,  employerTaxes: 65.62 },
];

export const wageData: WageEmployee[] = [
  { name: "Lucia Maceda",             role: "GM / Owner",  hourlyRate: null,  hoursWorked: 2080,    grossPay: 40002.40, employerTaxes: 2171.90, isSalaried: true },
  { name: "Aura Bellien Hurta V.",    role: "Cook",        hourlyRate: 17.60, hoursWorked: 1454.80, grossPay: 25098.08, employerTaxes: 1869.38 },
  { name: "Pamela J Saldivar",        role: "Cook",        hourlyRate: 17.60, hoursWorked: 1081.60, grossPay: 19036.21, employerTaxes: 1361.40 },
  { name: "Miguel Angel Macias A.",   role: "Cook",        hourlyRate: 20.00, hoursWorked: 800,     grossPay: 16000.00, employerTaxes: 1239.30 },
  { name: "Juan Ramses Maceda S.",    role: "Cook",        hourlyRate: 17.20, hoursWorked: 851,     grossPay: 14637.20, employerTaxes: 1102.93 },
  { name: "Jair Marin",              role: "Cook",        hourlyRate: 17.60, hoursWorked: 792.37,  grossPay: 13692.83, employerTaxes: 920.85 },
  { name: "Mutsuki Fujimoto",        role: "Cook",        hourlyRate: 17.20, hoursWorked: 339.50,  grossPay: 5882.40,  employerTaxes: 437.03 },
  { name: "Harriet Elizabeth Joan S.",role: "Cook",        hourlyRate: 17.60, hoursWorked: 231.75,  grossPay: 4012.60,  employerTaxes: 228.13 },
  { name: "Willem Denni Hermans",    role: "Cook",        hourlyRate: 17.60, hoursWorked: 121.70,  grossPay: 2135.22,  employerTaxes: 128.00 },
  { name: "Ryuji Haneda",            role: "Cook",        hourlyRate: 17.20, hoursWorked: 113.50,  grossPay: 1952.20,  employerTaxes: 144.95 },
  { name: "Lizzett Blanca R.",       role: "Cook",        hourlyRate: 17.20, hoursWorked: 48,      grossPay: 825.60,   employerTaxes: 36.04 },
  { name: "Ceh Santoyo Antuan",      role: "Cook",        hourlyRate: 17.20, hoursWorked: 33,      grossPay: 567.60,   employerTaxes: 30.79 },
  { name: "Kotone Yokota",           role: "Cook",        hourlyRate: 17.60, hoursWorked: 31.50,   grossPay: 554.40,   employerTaxes: 29.70 },
  { name: "Amelia Munroe",           role: "Cook",        hourlyRate: 17.60, hoursWorked: 27,      grossPay: 475.20,   employerTaxes: 31.18 },
  { name: "Lexie Van Wyk",           role: "Cook",        hourlyRate: 17.20, hoursWorked: 14.50,   grossPay: 249.40,   employerTaxes: 12.56 },
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
// Industry benchmarks: Canadian full-service restaurant (Toronto / organic-Mexican niche).
// Sources: ISED Canada NAICS 7225, Statistics Canada, Restaurants Canada, Toast POS,
//          CFIB, Lightspeed, 7shifts, BDC. See benchmarkSources export below.
export const pnlLineItems: PnLLineItem[] = [
  // ── Revenue ──
  { account: "Food Sales", values: [342055.29, 352510.25, 319177.32], industryPctMedian: "100%", isCost: false, bold: true },

  // ── Cost of Goods Sold ──
  { account: "Alcohol Purchase", values: [0, 2021.83, 734.41], industryPctMedian: "18-24%", isCost: true, indent: true, group: "cogs" },
  { account: "Food Purchases", values: [114288.10, 90888.47, 72491.60], industryPctMedian: "28-35%", isCost: true, indent: true, group: "cogs" },
  { account: "Restaurant Supplies", values: [3522.38, 3003.67, 922.13], industryPctMedian: "1.5-3%", isCost: true, indent: true, group: "cogs" },
  { account: "Total COGS", values: [117810.48, 95913.97, 74148.14], industryPctMedian: "30-38%", isCost: true, bold: true, separator: true, groupHeader: "cogs" },

  { account: "Gross Profit", values: [224244.81, 256596.28, 245029.18], industryPctMedian: "62-70%", isCost: false, bold: true, separator: true },

  // ── Expense (all 24 GL accounts) ──
  { account: "Advertising and Promotion", values: [952.13, 9.60, 0], industryPctMedian: "1.5-6%", isCost: true, indent: true, group: "opex" },
  { account: "Automobile Expenses", values: [3215.81, 2331.47, 924.59], industryPctMedian: "0.1-0.5%", isCost: true, indent: true, group: "opex" },
  { account: "Bank Service Charges", values: [801.95, 2056.01, 2739.32], industryPctMedian: "0.1-0.5%", isCost: true, indent: true, group: "opex" },
  { account: "Business Licenses and Permits", values: [0, 4627.38, 0], industryPctMedian: "0.1-0.5%", isCost: true, indent: true, group: "opex" },
  { account: "Cleaning Expenses", values: [18484.50, 0, 1239.50], industryPctMedian: "0.5-1.5%", isCost: true, indent: true, group: "opex" },
  { account: "Computer and Internet Expenses", values: [0, 0, 1500], industryPctMedian: "0.2-0.8%", isCost: true, indent: true, group: "opex" },
  { account: "Depreciation Expense", values: [2578, 1805, 1263], industryPctMedian: "1.5-3.5%", isCost: true, indent: true, group: "opex" },
  { account: "Employee Benefits", values: [0, 322.48, 0], industryPctMedian: "3-5%", isCost: true, indent: true, group: "opex" },
  { account: "Equipment Rental", values: [5057.98, 4241.02, 2730.15], industryPctMedian: "0.5-2%", isCost: true, indent: true, group: "opex" },
  { account: "Fines and Penalties", values: [1277.43, 0, 0], industryPctMedian: "0%", isCost: true, indent: true, group: "opex" },
  { account: "Insurance Expense", values: [4598.55, 5385.36, 11945.56], industryPctMedian: "0.5-1.5%", isCost: true, indent: true, group: "opex" },
  { account: "Meals & Entertainment", values: [92.46, 251.49, 0], industryPctMedian: "0.1-0.5%", isCost: true, indent: true, group: "opex" },
  { account: "Membership Fees", values: [0, 730.21, 275], industryPctMedian: "0-0.3%", isCost: true, indent: true, group: "opex" },
  { account: "Merchant Account Fees", values: [2896.47, 18515.50, 17036.15], industryPctMedian: "1.5-3%", isCost: true, indent: true, group: "opex" },
  { account: "Office Supplies", values: [5187.34, 5874.17, 5255.92], industryPctMedian: "0.1-0.5%", isCost: true, indent: true, group: "opex" },
  { account: "Parking", values: [0, 307.35, 0], industryPctMedian: "0-0.3%", isCost: true, indent: true, group: "opex" },
  { account: "Payroll Expenses", values: [153551.37, 147944.26, 155137.09], industryPctMedian: "25-35%", isCost: true, indent: true, group: "opex" },
  { account: "Professional Fees", values: [8051.25, 2400, 4260], industryPctMedian: "0.5-2%", isCost: true, indent: true, group: "opex" },
  { account: "Rent Expense", values: [39279.27, 34344.24, 35953.44], industryPctMedian: "6-12%", isCost: true, indent: true, group: "opex" },
  { account: "Repairs and Maintenance", values: [2300.85, 1339.34, 2049.21], industryPctMedian: "1-3%", isCost: true, indent: true, group: "opex" },
  { account: "Telephone Expense", values: [850, 755.22, 0], industryPctMedian: "0.2-0.5%", isCost: true, indent: true, group: "opex" },
  { account: "Tips Paid to Employee", values: [24458.10, 47623.98, 43193.75], industryPctMedian: "3-6%", isCost: true, indent: true, group: "opex" },
  { account: "Utilities", values: [11739.42, 10436.74, 11109.96], industryPctMedian: "2-4%", isCost: true, indent: true, group: "opex" },
  { account: "Waste Management", values: [90, 169.14, 0], industryPctMedian: "0.3-1%", isCost: true, indent: true, group: "opex" },
  { account: "Total Expense", values: [285462.88, 291469.96, 296612.64], industryPctMedian: "60-70%", isCost: true, bold: true, separator: true, groupHeader: "opex" },

  { account: "Net Ordinary Income", values: [-61218.07, -34873.68, -51583.46], industryPctMedian: "2-7%", isCost: false, bold: true, separator: true },

  // ── Other Income ──
  { account: "Other Income-Subsidies & Grants", values: [20000, 0, 0], industryPctMedian: "N/A", isCost: false, indent: true, group: "otherinc" },
  { account: "Other Income-Tips", values: [62487.01, 44247.70, 43190.76], industryPctMedian: "1-5%", isCost: false, indent: true, group: "otherinc" },
  { account: "Total Other Income", values: [82487.01, 44247.70, 43190.76], industryPctMedian: "N/A", isCost: false, bold: true, separator: true, groupHeader: "otherinc" },

  // ── Other Expense ──
  { account: "Income Tax", values: [2757, 1805, -1023.83], industryPctMedian: "2-5%", isCost: true, indent: true, group: "otherexp" },
  { account: "Total Other Expense", values: [2757, 1805, -1023.83], industryPctMedian: "N/A", isCost: true, bold: true, separator: true, groupHeader: "otherexp" },

  { account: "Net Other Income", values: [79730.01, 42442.70, 44214.59], industryPctMedian: "N/A", isCost: false, bold: true, separator: true },
  { account: "Net Income", values: [18511.94, 7569.02, -7368.87], industryPctMedian: "2-7%", isCost: false, bold: true, separator: true },
];

// Industry benchmark sources — displayed on the P&L page
export const benchmarkSources = [
  { id: 1, name: "ISED Canada", detail: "Financial Performance Data, NAICS 7225 — Full-Service Restaurants", url: "https://ised-isde.canada.ca/app/ixb/cis/performance/rev/7225" },
  { id: 2, name: "Statistics Canada", detail: "Food Services and Drinking Places survey, 2023–2024", url: "https://www150.statcan.gc.ca/n1/daily-quotidien/en.htm" },
  { id: 3, name: "Restaurants Canada", detail: "2024 Annual Industry Report", url: "https://www.restaurantscanada.org" },
  { id: 4, name: "Toast POS (Canada)", detail: "Restaurant Monthly Expenses in Canada", url: "https://pos.toasttab.com/ca/blog/on-the-line/restaurant-monthly-expenses" },
  { id: 5, name: "CFIB", detail: "Canadian Federation of Independent Business — payment processing benchmarks", url: "https://www.cfib-fcei.ca" },
  { id: 6, name: "Lightspeed HQ", detail: "Restaurant Labor Cost & COGS benchmarks (Canada)", url: "https://www.lightspeedhq.com/blog" },
  { id: 7, name: "7shifts", detail: "The Ultimate Guide to Restaurant Costs", url: "https://www.7shifts.com/blog/restaurant-costs" },
];

// Every GL account from the QuickBooks Balance Sheet — exact values from the books.
export const bsLineItems: BSLineItem[] = [
  // ── Assets ──
  { account: "Cash in Drawer", values: [0, 0, 591.21], indent: true, group: "currentAssets", section: "assets" },
  { account: "TD BANK-6168", values: [91244.64, 58367.41, 38350.40], indent: true, group: "currentAssets", section: "assets" },
  { account: "Total Current Assets", values: [91244.64, 58367.41, 38941.61], bold: true, groupHeader: "currentAssets", section: "assets" },
  { account: "Accum Amortization", values: [-7265.20, -9070.20, -10333.20], indent: true, group: "fixedAssets", section: "assets", negativeNormal: true },
  { account: "Vehicles-Other", values: [15624, 15624, 15624], indent: true, group: "fixedAssets", section: "assets" },
  { account: "Total Fixed Assets", values: [8358.80, 6553.80, 5290.80], bold: true, groupHeader: "fixedAssets", section: "assets" },
  { account: "TOTAL ASSETS", values: [99603.44, 64921.21, 44232.41], bold: true, separator: true, section: "assets" },

  // ── Liabilities ──
  { account: "Accounts Payable", values: [1836.25, 0, 0], indent: true, group: "currentLiab", section: "liabilities" },
  { account: "GST/HST Payable", values: [3352.85, 5548.71, 7462.19], indent: true, group: "currentLiab", section: "liabilities" },
  { account: "Income Tax Payable", values: [2757, 1805, -377.83], indent: true, group: "currentLiab", section: "liabilities" },
  { account: "Long Term Loan", values: [45998, 0, 0], indent: true, group: "currentLiab", section: "liabilities" },
  { account: "Payroll Liabilities", values: [4288.55, 8658.57, 10633.91], indent: true, group: "currentLiab", section: "liabilities" },
  { account: "Shareholder Distributions", values: [0, -30.88, -56.80], indent: true, group: "currentLiab", section: "liabilities", negativeNormal: true },
  { account: "TOTAL LIABILITIES", values: [58232.65, 15981.40, 17661.47], bold: true, separator: true, groupHeader: "currentLiab", section: "liabilities" },

  // ── Equity ──
  { account: "Capital Stock", values: [100, 100, 100], indent: true, group: "equity", section: "equity" },
  { account: "Dividends Paid", values: [0, 0, -15000], indent: true, group: "equity", section: "equity", negativeNormal: true },
  { account: "Retained Earnings", values: [22758.85, 41270.79, 48839.81], indent: true, group: "equity", section: "equity" },
  { account: "Net Income", values: [18511.94, 7569.02, -7368.87], indent: true, group: "equity", section: "equity" },
  { account: "TOTAL EQUITY", values: [41370.79, 48939.81, 26570.94], bold: true, separator: true, groupHeader: "equity", section: "equity" },
];

// Cash runway projection — actual + projected at ~$19.4K/yr burn rate
export const cashRunwayData = [
  { year: 2023, actual: 91245, label: "$91K" },
  { year: 2024, actual: 58367, label: "$58K" },
  { year: 2025, actual: 38941, label: "$39K" },
  { year: 2026, projected: 19500, label: "~$19K" },
  { year: 2027, projected: 0, label: "$0" },
];

// Balance sheet composition — stacked bar data
export const bsCompositionData = [
  { year: "2023", cash: 91245, fixedAssets: 8359, liabilities: 58233, equity: 41371 },
  { year: "2024", cash: 58367, fixedAssets: 6554, liabilities: 15981, equity: 48940 },
  { year: "2025", cash: 38942, fixedAssets: 5291, liabilities: 17661, equity: 26571 },
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
