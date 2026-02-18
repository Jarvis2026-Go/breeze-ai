import {
  yearlyData,
  pnlLineItems,
  bsLineItems,
  industryBenchmarks,
  primeCostData,
  revenueForecast,
  netIncomeForecast,
  cashRunwayData,
  wageData,
  wageData2023,
  wageData2024,
} from "./data";
import type { WageEmployee } from "./types";

// Colors
const TEAL = [46, 196, 182] as const;    // #2EC4B6
const DARK = [30, 41, 59] as const;      // slate-800
const WHITE = [255, 255, 255] as const;
const LIGHT_BG = [248, 250, 252] as const; // slate-50

function fmt(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtCompact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1000000) return `${n < 0 ? "-" : ""}$${(abs / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `${n < 0 ? "-" : ""}$${(abs / 1000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

export async function exportToPDF() {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentW = pageW - margin * 2;

  // Track cursor position after each table
  let lastY = 0;
  const getY = () => lastY;
  const runTable = (opts: any) => {
    autoTable(doc, opts);
    lastY = (doc as any).lastAutoTable.finalY;
  };

  // ── Helper: add footer to every page ──
  const addFooters = () => {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${totalPages}`, margin, pageH - 8);
      doc.text("CHOG Financial Dashboard | Breeze AI", pageW - margin, pageH - 8, { align: "right" });
    }
  };

  // ── Helper: section header ──
  const sectionHeader = (text: string, y: number): number => {
    doc.setFillColor(...TEAL);
    doc.rect(margin, y, contentW, 7, "F");
    doc.setFontSize(11);
    doc.setTextColor(...WHITE);
    doc.setFont("helvetica", "bold");
    doc.text(text, margin + 3, y + 5);
    return y + 10;
  };

  // ── Helper: check if we need a new page ──
  const ensureSpace = (needed: number) => {
    if (lastY > pageH - needed) {
      doc.addPage();
      lastY = 15;
    }
  };

  // Pre-compute values used throughout
  const revenue = yearlyData[2].foodSales;
  const netIncome = yearlyData[2].netIncome;
  const cogs = yearlyData[2].totalCOGS;
  const payroll = yearlyData[2].payroll;
  const foodCostPct = ((cogs / revenue) * 100).toFixed(1);
  const laborCostPct = ((payroll / revenue) * 100).toFixed(1);
  const primeCostPctVal = primeCostData[2].primeCostPct;

  // Savings calculation (used on cover + exec summary)
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
      const p = Math.abs((item.values[2] / revenue) * 100);
      const range = parseRange(item.industryPctMedian!);
      if (!range) return null;
      if (p <= range.hi) return null;
      const target = Math.round((range.hi / 100) * revenue);
      const current = Math.round(item.values[2]);
      const savings = current - target;
      if (savings <= 0) return null;
      return { account: item.account, savings };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.savings - a.savings);

  const totalSavings = allSavings.reduce((s, a) => s + a.savings, 0);

  // ════════════════════════════════════════════
  // PAGE 1: COVER PAGE
  // ════════════════════════════════════════════

  // Teal accent bar at top
  doc.setFillColor(...TEAL);
  doc.rect(0, 0, pageW, 4, "F");

  // Business name
  doc.setFontSize(28);
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.text("Cool Hand of a Girl Inc.", pageW / 2, 55, { align: "center" });

  // Subtitle
  doc.setFontSize(14);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont("helvetica", "normal");
  doc.text("Financial Review", pageW / 2, 66, { align: "center" });

  // Period
  doc.setFontSize(11);
  doc.text("Fiscal Years 2023 \u2013 2025", pageW / 2, 75, { align: "center" });

  // Divider
  doc.setDrawColor(...TEAL);
  doc.setLineWidth(0.8);
  doc.line(pageW / 2 - 40, 82, pageW / 2 + 40, 82);

  // Prepared date
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text("Prepared February 2026", pageW / 2, 90, { align: "center" });

  // "What We'll Review" section
  let y = 110;
  doc.setFillColor(...TEAL);
  doc.rect(margin + 20, y, contentW - 40, 7, "F");
  doc.setFontSize(11);
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.text("What We\u2019ll Review Together", pageW / 2, y + 5, { align: "center" });
  y += 14;

  const agendaItems = [
    ["What\u2019s going well", "Food cost control is excellent at " + foodCostPct + "% \u2014 well below the 30\u201338% industry range."],
    ["Where to focus", "Staffing costs at " + laborCostPct + "% of revenue are the biggest lever. Payment processing and insurance also above industry norms."],
    ["3 action items", "Restructure staffing, audit merchant fees, and renegotiate insurance \u2014 ~" + fmtCompact(totalSavings) + "/yr in potential savings."],
    ["Cash runway", "At the current burn rate, cash reserves reach $0 by 2027. We\u2019ll discuss options to change that trajectory."],
    ["Full financials", "P&L, Balance Sheet, Wages, Industry Benchmarks, and Forecast \u2014 all included in this report."],
  ];

  for (const [title, detail] of agendaItems) {
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin + 28, y);

    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(detail, contentW - 60);
    doc.text(lines, margin + 28, y + 5);
    y += 6 + lines.length * 4 + 4;
  }

  // Bottom info
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.setFont("helvetica", "normal");
  doc.text("2804 Dundas St W, Toronto  |  Tue\u2013Sat, 8am\u20134pm  |  Organic Mexican, Breakfast & Lunch", pageW / 2, pageH - 25, { align: "center" });
  doc.text("Data sourced from QuickBooks P&L, Balance Sheet, and Wage Reports  |  All amounts in CAD", pageW / 2, pageH - 20, { align: "center" });

  // ════════════════════════════════════════════
  // PAGE 2: EXECUTIVE SUMMARY
  // ════════════════════════════════════════════
  doc.addPage();

  doc.setFontSize(18);
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary", margin, 22);

  doc.setDrawColor(...TEAL);
  doc.setLineWidth(0.8);
  doc.line(margin, 26, pageW - margin, 26);

  y = 32;

  // Business Snapshot
  y = sectionHeader("Business Snapshot", y);

  runTable({
    startY: y,
    margin: { left: margin, right: margin },
    theme: "plain",
    styles: { fontSize: 8, cellPadding: 1.5 },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [100, 100, 100], cellWidth: 30 },
      1: { cellWidth: 55 },
      2: { fontStyle: "bold", textColor: [100, 100, 100], cellWidth: 30 },
      3: { cellWidth: 55 },
    },
    body: [
      ["Business", "Cool Hand of a Girl Inc.", "Location", "2804 Dundas St W, Toronto"],
      ["Period", "Jan 2023 - Dec 2025", "Hours", "Tue-Sat, 8am-4pm"],
      ["Concept", "Organic Mexican, Breakfast & Lunch", "Est.", "2008 (17 years)"],
    ],
  });
  y = getY() + 5;

  // 2025 KPIs
  y = sectionHeader("2025 Key Performance Indicators", y);

  runTable({
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Revenue", "Net Income", "Food Cost %", "Labor Cost %", "Prime Cost %"]],
    body: [[fmtCompact(revenue), fmt(netIncome), `${foodCostPct}%`, `${laborCostPct}%`, `${primeCostPctVal}%`]],
    headStyles: { fillColor: [...DARK], textColor: [...WHITE], fontSize: 8, halign: "center" as const },
    bodyStyles: { fontSize: 9, halign: "center" as const, fontStyle: "bold" },
    theme: "grid",
  });
  y = getY() + 5;

  // Break-Even Analysis
  y = sectionHeader("Break-Even Analysis", y);

  const merchantFees = pnlLineItems.find((i) => i.account === "Merchant Account Fees")!.values[2];
  const bankCharges = pnlLineItems.find((i) => i.account === "Bank Service Charges")!.values[2];
  const tipsPaid = pnlLineItems.find((i) => i.account === "Tips Paid to Employee")!.values[2];
  const totalExpenses = yearlyData[2].totalExpenses;
  const paymentProcessing = merchantFees + bankCharges;
  const variableRate = (cogs + paymentProcessing) / revenue;
  const cmRate = 1 - variableRate;
  const fixedCosts = totalExpenses - paymentProcessing - tipsPaid;
  const ownerGross = wageData[0].grossPay;
  const ownerExtra = 70000 - ownerGross;

  const accountingBE = Math.round(fixedCosts / cmRate);
  const ownerBE = Math.round((fixedCosts + ownerExtra) / cmRate);
  const industryBE = Math.round(payroll / 0.34);

  runTable({
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Level", "Description", "Target", "Gap"]],
    body: [
      ["Accounting BE", "Cover all fixed costs", fmtCompact(accountingBE), fmtCompact(accountingBE - Math.round(revenue)) + " needed"],
      ["Fair Owner Pay", "Lucia earns $70K", fmtCompact(ownerBE), fmtCompact(ownerBE - Math.round(revenue)) + " needed"],
      ["Industry Standard", "Labor at 34%", fmtCompact(industryBE), fmtCompact(industryBE - Math.round(revenue)) + " needed"],
    ],
    headStyles: { fillColor: [...DARK], textColor: [...WHITE], fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [...LIGHT_BG] },
    theme: "grid",
  });
  y = getY() + 5;

  // Top 3 Action Items
  y = sectionHeader("Top 3 Action Items", y);

  runTable({
    startY: y,
    margin: { left: margin, right: margin },
    head: [["#", "Action", "Potential Savings"]],
    body: [
      ["1", "Restructure Staffing Costs \u2014 48.6% vs 35% industry cap", `~${fmtCompact(allSavings[0]?.savings ?? 0)}/yr`],
      ["2", "Audit Merchant Processing Fees \u2014 5.3% vs 3% cap", `~${fmtCompact(allSavings[1]?.savings ?? 0)}/yr`],
      ["3", "Renegotiate Insurance \u2014 3.7% vs 1.5% cap", `~${fmtCompact(allSavings[2]?.savings ?? 0)}/yr`],
    ],
    headStyles: { fillColor: [...DARK], textColor: [...WHITE], fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    columnStyles: { 0: { cellWidth: 8, halign: "center" as const }, 2: { halign: "right" as const, fontStyle: "bold" } },
    alternateRowStyles: { fillColor: [...LIGHT_BG] },
    theme: "grid",
  });
  y = getY() + 3;

  doc.setFontSize(9);
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.text(`Total savings potential: ~${fmtCompact(totalSavings)}/year`, pageW - margin, y, { align: "right" });

  // ════════════════════════════════════════════
  // PROFIT & LOSS
  // ════════════════════════════════════════════
  doc.addPage();

  y = sectionHeader("Profit & Loss Statement (2023-2025)", 15);

  const pnlBody: any[][] = [];
  for (const item of pnlLineItems) {
    const label = item.indent ? `  ${item.account}` : item.account;
    pnlBody.push([
      label,
      fmt(Math.round(item.values[0])),
      fmt(Math.round(item.values[1])),
      fmt(Math.round(item.values[2])),
      item.industryPctMedian ?? "",
    ]);
  }

  runTable({
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Account", "2023", "2024", "2025", "Industry Range"]],
    body: pnlBody,
    headStyles: { fillColor: [...DARK], textColor: [...WHITE], fontSize: 7.5 },
    bodyStyles: { fontSize: 7, cellPadding: 1.2 },
    columnStyles: {
      0: { cellWidth: 52 },
      1: { halign: "right" as const, cellWidth: 24 },
      2: { halign: "right" as const, cellWidth: 24 },
      3: { halign: "right" as const, cellWidth: 24 },
      4: { halign: "center" as const, cellWidth: 22 },
    },
    alternateRowStyles: { fillColor: [...LIGHT_BG] },
    theme: "grid",
    didParseCell: (data: any) => {
      if (data.section === "body") {
        const item = pnlLineItems[data.row.index];
        if (!item) return;
        if (item.bold) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [230, 240, 238];
        }
        if (data.column.index >= 1 && data.column.index <= 3) {
          const val = item.values[data.column.index - 1];
          if (val < 0) {
            data.cell.styles.textColor = [220, 38, 38];
          }
        }
      }
    },
  });

  // ════════════════════════════════════════════
  // BALANCE SHEET
  // ════════════════════════════════════════════
  doc.addPage();

  y = sectionHeader("Balance Sheet (2023-2025)", 15);

  const bsBody: any[][] = [];
  let prevSection = "";
  for (const item of bsLineItems) {
    if (item.section !== prevSection) {
      prevSection = item.section;
      bsBody.push([{ content: item.section.toUpperCase(), colSpan: 4, styles: { fontStyle: "bold", fillColor: [...TEAL], textColor: [...WHITE], fontSize: 8 } }]);
    }
    const label = item.indent ? `  ${item.account}` : item.account;
    bsBody.push([
      label,
      fmt(Math.round(item.values[0])),
      fmt(Math.round(item.values[1])),
      fmt(Math.round(item.values[2])),
    ]);
  }

  runTable({
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Account", "2023", "2024", "2025"]],
    body: bsBody,
    headStyles: { fillColor: [...DARK], textColor: [...WHITE], fontSize: 8 },
    bodyStyles: { fontSize: 8, cellPadding: 1.5 },
    columnStyles: {
      0: { cellWidth: 55 },
      1: { halign: "right" as const, cellWidth: 30 },
      2: { halign: "right" as const, cellWidth: 30 },
      3: { halign: "right" as const, cellWidth: 30 },
    },
    alternateRowStyles: { fillColor: [...LIGHT_BG] },
    theme: "grid",
    didParseCell: (data: any) => {
      if (data.section === "body") {
        const flatItems = bsLineItems;
        let itemIdx = -1;
        for (let r = 0; r <= data.row.index; r++) {
          const rowData = bsBody[r];
          if (rowData && rowData.length === 1 && rowData[0]?.colSpan) {
            // section header row, skip
          } else {
            itemIdx++;
          }
        }
        if (itemIdx < 0 || itemIdx >= flatItems.length) return;
        const item = flatItems[itemIdx];
        if (item.bold) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [230, 240, 238];
        }
        if (data.column.index >= 1 && data.column.index <= 3) {
          const val = item.values[data.column.index - 1];
          if (val < 0) {
            data.cell.styles.textColor = [220, 38, 38];
          }
        }
      }
    },
  });

  // ════════════════════════════════════════════
  // WAGES & PAYROLL (all 3 years)
  // ════════════════════════════════════════════
  doc.addPage();

  y = sectionHeader("Wages & Payroll Detail (2023-2025)", 15);

  const addWageTable = (title: string, data: WageEmployee[], startY: number): number => {
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin, startY);
    startY += 4;

    const wageBody: any[][] = [];
    let totalGross = 0;
    let totalTaxes = 0;
    for (const emp of data) {
      wageBody.push([
        emp.name,
        emp.role,
        emp.hourlyRate ? `$${emp.hourlyRate.toFixed(2)}` : "Salaried",
        emp.hoursWorked.toLocaleString(),
        fmt(Math.round(emp.grossPay)),
        fmt(Math.round(emp.employerTaxes)),
      ]);
      totalGross += emp.grossPay;
      totalTaxes += emp.employerTaxes;
    }

    runTable({
      startY,
      margin: { left: margin, right: margin },
      head: [["Name", "Role", "Rate", "Hours", "Gross Pay", "Employer Taxes"]],
      body: wageBody,
      foot: [["TOTAL", "", "", "", fmt(Math.round(totalGross)), fmt(Math.round(totalTaxes))]],
      headStyles: { fillColor: [...DARK], textColor: [...WHITE], fontSize: 7.5 },
      bodyStyles: { fontSize: 7, cellPadding: 1.2 },
      footStyles: { fillColor: [230, 240, 238], fontStyle: "bold", fontSize: 7.5 },
      columnStyles: {
        0: { cellWidth: 42 },
        1: { cellWidth: 22 },
        2: { halign: "right" as const, cellWidth: 18 },
        3: { halign: "right" as const, cellWidth: 16 },
        4: { halign: "right" as const, cellWidth: 24 },
        5: { halign: "right" as const, cellWidth: 24 },
      },
      alternateRowStyles: { fillColor: [...LIGHT_BG] },
      theme: "grid",
    });

    return getY();
  };

  y = addWageTable("2025 Payroll", wageData, y);
  y += 8;

  // Check space before 2024 table
  if (y > pageH - 60) {
    doc.addPage();
    y = 15;
  }
  y = addWageTable("2024 Payroll", wageData2024, y);
  y += 8;

  if (y > pageH - 60) {
    doc.addPage();
    y = 15;
  }
  y = addWageTable("2023 Payroll", wageData2023, y);

  // ════════════════════════════════════════════
  // BENCHMARKS & FORECAST
  // ════════════════════════════════════════════
  doc.addPage();

  y = sectionHeader("Industry Benchmarks", 15);

  runTable({
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Metric", "CHOG", "Low", "Median", "High"]],
    body: industryBenchmarks.map((b) => [
      b.label,
      `${b.chogValue}%`,
      `${b.industryLow}%`,
      `${b.industryMedian}%`,
      `${b.industryHigh}%`,
    ]),
    headStyles: { fillColor: [...DARK], textColor: [...WHITE], fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    columnStyles: { 1: { halign: "right" as const }, 2: { halign: "right" as const }, 3: { halign: "right" as const }, 4: { halign: "right" as const } },
    alternateRowStyles: { fillColor: [...LIGHT_BG] },
    theme: "grid",
  });
  y = getY() + 8;

  // Revenue & Net Income Forecast
  y = sectionHeader("Revenue & Net Income Forecast", y);

  runTable({
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Year", "Revenue (Actual)", "Revenue (Projected)", "Net Income (Actual)", "Net Income (Projected)"]],
    body: revenueForecast.map((rf, i) => {
      const nf = netIncomeForecast[i];
      return [
        rf.year,
        rf.actual ? fmtCompact(rf.actual) : "-",
        rf.projected ? `${fmtCompact(rf.projected)} (${fmtCompact(rf.lower!)}\u2013${fmtCompact(rf.upper!)})` : "-",
        nf?.actual != null ? fmtCompact(nf.actual) : "-",
        nf?.projected != null ? `${fmtCompact(nf.projected)} (${fmtCompact(nf.lower!)}\u2013${fmtCompact(nf.upper!)})` : "-",
      ];
    }),
    headStyles: { fillColor: [...DARK], textColor: [...WHITE], fontSize: 7.5 },
    bodyStyles: { fontSize: 8 },
    columnStyles: { 0: { cellWidth: 12 }, 1: { halign: "right" as const }, 2: { halign: "right" as const }, 3: { halign: "right" as const }, 4: { halign: "right" as const } },
    alternateRowStyles: { fillColor: [...LIGHT_BG] },
    theme: "grid",
  });
  y = getY() + 8;

  // Cash Runway
  y = sectionHeader("Cash Runway Projection", y);

  runTable({
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Year", "Cash Balance", "Status"]],
    body: cashRunwayData.map((c) => [
      c.year,
      c.actual ? fmtCompact(c.actual) : fmtCompact(c.projected!),
      c.actual ? "Actual" : "Projected",
    ]),
    headStyles: { fillColor: [...DARK], textColor: [...WHITE], fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    columnStyles: { 1: { halign: "right" as const } },
    alternateRowStyles: { fillColor: [...LIGHT_BG] },
    theme: "grid",
  });

  addFooters();

  doc.save("CHOG_Financial_Report_2023-2025.pdf");
}
