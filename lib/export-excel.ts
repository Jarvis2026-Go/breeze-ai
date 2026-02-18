import {
  yearlyData,
  pnlLineItems,
  bsLineItems,
  wageData,
  wageData2023,
  wageData2024,
  industryBenchmarks,
  financialHealthScores,
  primeCostData,
  revenueForecast,
  netIncomeForecast,
  cashRunwayData,
} from "./data";
import type { WageEmployee } from "./types";

export async function exportToExcel() {
  const XLSX = await import("xlsx");

  const wb = XLSX.utils.book_new();

  // ── Sheet 1: P&L ──
  buildPnLSheet(XLSX, wb);

  // ── Sheet 2: Balance Sheet ──
  buildBalanceSheet(XLSX, wb);

  // ── Sheet 3: Wages ──
  buildWagesSheet(XLSX, wb);

  // ── Sheet 4: Summary ──
  buildSummarySheet(XLSX, wb);

  // ── Sheet 5: Forecast ──
  buildForecastSheet(XLSX, wb);

  // ── Sheet 6: Definitions ──
  buildDefinitionsSheet(XLSX, wb);

  XLSX.writeFile(wb, "CHOG_Financial_Report_2023-2025.xlsx");
}

function buildPnLSheet(XLSX: typeof import("xlsx"), wb: import("xlsx").WorkBook) {
  const years = [2023, 2024, 2025];
  const revenue = yearlyData.map((y) => y.foodSales);

  const rows: (string | number | null)[][] = [
    ["Account", "2023", "% Rev", "2024", "% Rev", "2025", "% Rev", "Industry Range"],
  ];

  for (const item of pnlLineItems) {
    const label = item.indent ? `  ${item.account}` : item.account;
    const row: (string | number | null)[] = [label];

    for (let i = 0; i < 3; i++) {
      row.push(Math.round(item.values[i]));
      const pct = revenue[i] ? item.values[i] / revenue[i] : 0;
      row.push(Math.round(pct * 1000) / 10); // one decimal %
    }
    row.push(item.industryPctMedian ?? "");
    rows.push(row);

    if (item.separator) {
      rows.push([]); // blank separator row
    }
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [
    { wch: 32 }, // Account
    { wch: 12 }, { wch: 8 }, // 2023, %
    { wch: 12 }, { wch: 8 }, // 2024, %
    { wch: 12 }, { wch: 8 }, // 2025, %
    { wch: 14 }, // Industry
  ];
  XLSX.utils.book_append_sheet(wb, ws, "P&L");
}

function buildBalanceSheet(XLSX: typeof import("xlsx"), wb: import("xlsx").WorkBook) {
  const rows: (string | number | null)[][] = [
    ["Account", "2023", "2024", "2025"],
  ];

  let currentSection = "";
  for (const item of bsLineItems) {
    // Section header
    if (item.section !== currentSection) {
      currentSection = item.section;
      rows.push([]);
      rows.push([currentSection.toUpperCase()]);
    }

    const label = item.indent ? `  ${item.account}` : item.account;
    rows.push([
      label,
      Math.round(item.values[0]),
      Math.round(item.values[1]),
      Math.round(item.values[2]),
    ]);

    if (item.separator) {
      rows.push([]);
    }
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 28 }, { wch: 14 }, { wch: 14 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, ws, "Balance Sheet");
}

function buildWagesSheet(XLSX: typeof import("xlsx"), wb: import("xlsx").WorkBook) {
  const rows: (string | number | null)[][] = [];

  const addWageTable = (title: string, data: WageEmployee[]) => {
    if (rows.length > 0) rows.push([], []);
    rows.push([title]);
    rows.push(["Name", "Role", "Hourly Rate", "Hours", "Gross Pay", "Employer Taxes"]);

    let totalGross = 0;
    let totalTaxes = 0;
    for (const emp of data) {
      rows.push([
        emp.name,
        emp.role,
        emp.hourlyRate ?? "Salaried",
        Math.round(emp.hoursWorked * 100) / 100,
        Math.round(emp.grossPay * 100) / 100,
        Math.round(emp.employerTaxes * 100) / 100,
      ]);
      totalGross += emp.grossPay;
      totalTaxes += emp.employerTaxes;
    }
    rows.push([
      "TOTAL",
      "",
      "",
      "",
      Math.round(totalGross * 100) / 100,
      Math.round(totalTaxes * 100) / 100,
    ]);
  };

  addWageTable("2023 Payroll", wageData2023);
  addWageTable("2024 Payroll", wageData2024);
  addWageTable("2025 Payroll", wageData);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [
    { wch: 28 }, { wch: 14 }, { wch: 12 }, { wch: 10 }, { wch: 14 }, { wch: 14 },
  ];
  XLSX.utils.book_append_sheet(wb, ws, "Wages");
}

function buildSummarySheet(XLSX: typeof import("xlsx"), wb: import("xlsx").WorkBook) {
  const rows: (string | number | null)[][] = [];

  // 3-Year Financial Summary
  rows.push(["3-Year Financial Summary"]);
  rows.push(["Metric", "2023", "2024", "2025"]);
  rows.push(["Food Sales", yearlyData[0].foodSales, yearlyData[1].foodSales, yearlyData[2].foodSales]);
  rows.push(["Total COGS", yearlyData[0].totalCOGS, yearlyData[1].totalCOGS, yearlyData[2].totalCOGS]);
  rows.push(["Gross Profit", yearlyData[0].grossProfit, yearlyData[1].grossProfit, yearlyData[2].grossProfit]);
  rows.push(["Total Expenses", yearlyData[0].totalExpenses, yearlyData[1].totalExpenses, yearlyData[2].totalExpenses]);
  rows.push(["Payroll", yearlyData[0].payroll, yearlyData[1].payroll, yearlyData[2].payroll]);
  rows.push(["Net Ordinary Income", yearlyData[0].netOrdinaryIncome, yearlyData[1].netOrdinaryIncome, yearlyData[2].netOrdinaryIncome]);
  rows.push(["Other Income", yearlyData[0].otherIncome, yearlyData[1].otherIncome, yearlyData[2].otherIncome]);
  rows.push(["Net Income", yearlyData[0].netIncome, yearlyData[1].netIncome, yearlyData[2].netIncome]);
  rows.push(["Total Assets", yearlyData[0].totalAssets, yearlyData[1].totalAssets, yearlyData[2].totalAssets]);

  // Industry Benchmarks
  rows.push([], [], ["Industry Benchmarks"]);
  rows.push(["Metric", "CHOG Value", "Industry Low", "Industry Median", "Industry High"]);
  for (const b of industryBenchmarks) {
    const suffix = b.unit === "percent" ? "%" : "";
    rows.push([
      b.label,
      b.chogValue,
      b.industryLow,
      b.industryMedian,
      b.industryHigh,
    ]);
  }

  // Health Scores
  rows.push([], [], ["Financial Health Scores"]);
  rows.push(["Category", "Score", "Max Score", "Status", "Detail"]);
  for (const h of financialHealthScores) {
    rows.push([h.category, h.score, h.maxScore, h.status, h.detail]);
  }

  // Prime Cost
  rows.push([], [], ["Prime Cost Breakdown"]);
  rows.push(["Year", "COGS", "Labor", "Prime Cost", "Prime Cost %", "Revenue"]);
  for (const p of primeCostData) {
    rows.push([p.year, p.cogs, p.labor, p.primeCost, p.primeCostPct, p.revenue]);
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 28 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, ws, "Summary");
}

function buildForecastSheet(XLSX: typeof import("xlsx"), wb: import("xlsx").WorkBook) {
  const rows: (string | number | null)[][] = [];

  // Revenue Forecast
  rows.push(["Revenue Forecast"]);
  rows.push(["Year", "Actual", "Projected", "Lower Bound", "Upper Bound"]);
  for (const f of revenueForecast) {
    rows.push([f.year, f.actual ?? null, f.projected ?? null, f.lower ?? null, f.upper ?? null]);
  }

  // Net Income Forecast
  rows.push([], [], ["Net Income Forecast"]);
  rows.push(["Year", "Actual", "Projected", "Lower Bound", "Upper Bound"]);
  for (const f of netIncomeForecast) {
    rows.push([f.year, f.actual ?? null, f.projected ?? null, f.lower ?? null, f.upper ?? null]);
  }

  // Cash Runway
  rows.push([], [], ["Cash Runway Projection"]);
  rows.push(["Year", "Actual", "Projected"]);
  for (const c of cashRunwayData) {
    rows.push([c.year, c.actual ?? null, c.projected ?? null]);
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 10 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, ws, "Forecast");
}

function buildDefinitionsSheet(XLSX: typeof import("xlsx"), wb: import("xlsx").WorkBook) {
  const rows: (string | null)[][] = [
    ["Term", "What It Means"],
    [],
    ["FINANCIAL STATEMENTS", null],
    ["P&L (Profit & Loss)", "A summary of all your income and expenses over a period. Shows whether the business made or lost money."],
    ["Balance Sheet", "A snapshot of what the business owns (assets), owes (liabilities), and the owner's share (equity) at a point in time."],
    ["Net Income", "The bottom line \u2014 total revenue minus all expenses, taxes, and other costs. Positive = profit, negative = loss."],
    ["Net Ordinary Income", "Profit or loss from day-to-day restaurant operations only (before tips, subsidies, or taxes)."],
    ["Gross Profit", "Revenue minus the cost of food and supplies (COGS). What's left to cover rent, wages, and everything else."],
    [],
    ["COST TERMS", null],
    ["COGS (Cost of Goods Sold)", "The direct cost of ingredients, alcohol, and supplies used to make the food you sell."],
    ["Food Cost %", "COGS divided by revenue. Shows how many cents of each dollar go to ingredients. Lower is better \u2014 CHOG is at 23.2%, industry is 30\u201338%."],
    ["Labor Cost %", "Total payroll divided by revenue. Shows how many cents of each dollar go to staff. CHOG is at 48.6%, industry target is 25\u201335%."],
    ["Prime Cost", "COGS + Labor combined. The two biggest costs in any restaurant. Industry target is under 65% of revenue."],
    ["Employer Taxes", "The taxes the business pays on top of each employee's wages (CPP, EI, WSIB, EHT). Not deducted from the employee \u2014 an extra cost to the business."],
    [],
    ["ANALYSIS TERMS", null],
    ["Break-Even", "The revenue level where income exactly covers all costs \u2014 no profit, no loss. Below this, the business loses money."],
    ["Contribution Margin", "The percentage of each sales dollar left after covering variable costs (food + payment processing). Used to calculate break-even."],
    ["Cash Runway", "How many months or years the business can keep operating on its current cash reserves before running out of money."],
    [],
    ["BENCHMARKS & RATIOS", null],
    ["Industry Benchmark", "The typical range for Canadian full-service restaurants. Used to compare CHOG's performance against peers."],
    ["Industry Median", "The middle value \u2014 half of restaurants are above, half below. A useful \"normal\" to compare against."],
    ["Financial Health Score", "A 1\u201310 rating for each area of the business, based on how CHOG compares to industry standards."],
    [],
    ["OTHER TERMS", null],
    ["Other Income \u2014 Tips", "Tips collected from customers and passed through to employees. This is a pass-through \u2014 it comes in as income and goes out as \"Tips Paid to Employee.\""],
    ["Other Income \u2014 Subsidies", "Government grants or subsidies (e.g., pandemic relief). CHOG received $20K in 2023, none since."],
    ["Depreciation", "The gradual write-off of equipment and vehicles over time. It's a non-cash expense \u2014 no money leaves the bank, but it reduces the asset's book value."],
    ["Retained Earnings", "Profits that have been kept in the business over the years rather than paid out to the owner."],
  ];

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 30 }, { wch: 90 }];
  XLSX.utils.book_append_sheet(wb, ws, "Definitions");
}
