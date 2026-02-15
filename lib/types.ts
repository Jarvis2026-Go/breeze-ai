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
