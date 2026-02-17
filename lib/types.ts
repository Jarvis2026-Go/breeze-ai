export interface YearlyFinancial {
  year: number;
  foodSales: number;
  totalCOGS: number;
  grossProfit: number;
  totalExpenses: number;
  payroll: number;
  netOrdinaryIncome: number;
  otherIncome: number;
  netIncome: number;
  totalAssets: number;
  totalLiabilitiesEquity: number;
}

export interface COGSBreakdown {
  year: number;
  alcohol: number;
  foodPurchases: number;
  restaurantSupplies: number;
  total: number;
}

export interface ExpenseCategory {
  name: string;
  amount: number;
  color?: string;
}

export interface WageEmployee {
  name: string;
  role: string;
  annualPay: number;
}

export interface KPIData {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: string;
}

export interface Insight {
  title: string;
  description: string;
  type: "warning" | "positive" | "critical" | "info";
}

export interface ForecastPoint {
  year: number;
  actual?: number;
  projected?: number;
  lower?: number;
  upper?: number;
}

export interface BenchmarkMetric {
  label: string;
  chogValue: number;
  industryLow: number;
  industryMedian: number;
  industryHigh: number;
  unit: "percent" | "currency" | "ratio";
  lowerIsBetter?: boolean;
}

export interface FinancialHealthScore {
  category: string;
  score: number;
  maxScore: number;
  status: "critical" | "warning" | "fair" | "good";
  detail: string;
}

export interface PnLLineItem {
  account: string;
  values: [number, number, number]; // [2023, 2024, 2025]
  industryPctMedian?: string;       // typical % of revenue (e.g. "30-33%")
  isCost: boolean;
  indent?: boolean;   // sub-account
  bold?: boolean;     // subtotal/total rows
  separator?: boolean; // section divider
  group?: string;     // collapsible group ID this child belongs to
  groupHeader?: string; // if set, this row is the toggle header for the named group
}

export interface PrimeCostData {
  year: number;
  cogs: number;
  labor: number;
  primeCost: number;
  primeCostPct: number;
  revenue: number;
}

export interface BSLineItem {
  account: string;
  values: [number, number, number];
  indent?: boolean;
  bold?: boolean;
  separator?: boolean;
  group?: string;
  groupHeader?: string;
  section: "assets" | "liabilities" | "equity";
  negativeNormal?: boolean;
}
