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

export interface PrimeCostData {
  year: number;
  cogs: number;
  labor: number;
  primeCost: number;
  primeCostPct: number;
  revenue: number;
}
