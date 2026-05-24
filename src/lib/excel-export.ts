import ExcelJS from "exceljs";
import { Perfume } from "@/data/perfumes";

// Color palette matching the app's dark luxury theme
const COLORS = {
  gold: "D4A853",
  darkGold: "B8860B",
  black: "0A0A0A",
  darkGray: "161616",
  mediumGray: "1E1E1E",
  lightGray: "2A2A2A",
  white: "FFFFFF",
  offWhite: "E5E5E5",
  mutedText: "888888",
  pink: "F472B6",
  blue: "60A5FA",
  purple: "C084FC",
  red: "EF4444",
  greenBg: "F0FDF4",
  greenText: "166534",
  redBg: "FEF2F2",
  redText: "991B1B",
  goldBg: "FFFBEB",
  goldText: "92400E",
};

interface ExportOptions {
  perfumes: Perfume[];
  marginPercent: number;
  getSuggestedPrice: (wholesale: number | null) => number | null;
  getMetrics: () => {
    total: number;
    priced: number;
    unpriced: number;
    avgCost: number;
  };
}

export async function exportToExcel({
  perfumes,
  marginPercent,
  getSuggestedPrice,
  getMetrics,
}: ExportOptions): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Jolie Fragrances";
  workbook.title = "Inventario de Perfumes";
  workbook.subject = `Lista de Precios - Margen ${marginPercent}%`;

  const metrics = getMetrics();

  // ==========================================
  // SHEET 1: LISTA COMPLETA DE PRECIOS
  // ==========================================
  const sheet = workbook.addWorksheet("Lista de Precios", {
    properties: {
      defaultColWidth: 18,
      tabColor: { argb: COLORS.gold },
    },
  });

  // Column widths
  sheet.columns = [
    { width: 6 },   // A: N°
    { width: 40 },  // B: Nombre
    { width: 12 },  // C: Volumen
    { width: 14 },  // D: Género
    { width: 18 },  // E: Precio Mayor
    { width: 22 },  // F: Precio Sugerido
    { width: 18 },  // G: Ganancia
  ];

  // --- ROW 1: Company title ---
  sheet.mergeCells("A1:G1");
  const titleRow = sheet.getRow(1);
  titleRow.height = 42;
  const titleCell = sheet.getCell("A1");
  titleCell.value = "JOLIE FRAGRANCES";
  titleCell.font = {
    name: "Calibri",
    size: 22,
    bold: true,
    color: { argb: COLORS.gold },
  };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: COLORS.black },
  };

  // --- ROW 2: Subtitle ---
  sheet.mergeCells("A2:G2");
  const subtitleRow = sheet.getRow(2);
  subtitleRow.height = 26;
  const subtitleCell = sheet.getCell("A2");
  subtitleCell.value = `LISTA DE PRECIOS — Margen Sugerido: +${marginPercent}%`;
  subtitleCell.font = {
    name: "Calibri",
    size: 12,
    bold: true,
    color: { argb: COLORS.offWhite },
  };
  subtitleCell.alignment = { horizontal: "center", vertical: "middle" };
  subtitleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: COLORS.darkGray },
  };

  // --- ROW 3: Date ---
  sheet.mergeCells("A3:G3");
  const dateRow = sheet.getRow(3);
  dateRow.height = 20;
  const dateCell = sheet.getCell("A3");
  const now = new Date();
  dateCell.value = `Generado: ${now.toLocaleDateString("es-VE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}`;
  dateCell.font = {
    name: "Calibri",
    size: 10,
    italic: true,
    color: { argb: COLORS.mutedText },
  };
  dateCell.alignment = { horizontal: "center", vertical: "middle" };
  dateCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: COLORS.darkGray },
  };

  // --- ROW 4: Summary metrics ---
  sheet.mergeCells("A4:G4");
  const metricsRow = sheet.getRow(4);
  metricsRow.height = 22;
  const metricsCell = sheet.getCell("A4");
  metricsCell.value = `Total: ${metrics.total} perfumes  |  Con precio: ${metrics.priced}  |  Sin precio: ${metrics.unpriced}  |  Costo promedio mayorista: $${metrics.avgCost.toFixed(2)}`;
  metricsCell.font = {
    name: "Calibri",
    size: 10,
    bold: true,
    color: { argb: COLORS.gold },
  };
  metricsCell.alignment = { horizontal: "center", vertical: "middle" };
  metricsCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: COLORS.black },
  };

  // --- ROW 5: Empty spacer ---
  sheet.getRow(5).height = 8;

  // --- ROW 6: Column headers ---
  const headerRowNum = 6;
  const headers = [
    "N°",
    "Nombre del Perfume",
    "Volumen",
    "Género",
    "Precio Mayor ($)",
    `Precio Sugerido (+${marginPercent}%)`,
    "Ganancia ($)",
  ];
  const headerRow = sheet.getRow(headerRowNum);
  headerRow.height = 28;

  headers.forEach((header, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = header;
    cell.font = {
      name: "Calibri",
      size: 11,
      bold: true,
      color: { argb: COLORS.black },
    };
    cell.alignment = { horizontal: i === 1 ? "left" : "center", vertical: "middle", wrapText: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLORS.gold },
    };
    cell.border = {
      bottom: { style: "medium", color: { argb: COLORS.darkGold } },
    };
  });

  // --- DATA ROWS ---
  const pricedPerfumes = perfumes.filter((p) => p.wholesale !== null);
  const unpricedPerfumes = perfumes.filter((p) => p.wholesale === null);

  // First: perfumes WITH prices
  let currentRow = headerRowNum + 1;

  pricedPerfumes.forEach((perfume, index) => {
    const row = sheet.getRow(currentRow);
    row.height = 22;

    const suggested = getSuggestedPrice(perfume.wholesale);
    const profit =
      perfume.wholesale !== null && suggested !== null
        ? suggested - perfume.wholesale
        : null;

    // Alternate row colors
    const bgColor = index % 2 === 0 ? COLORS.white : "F9F9F9";

    // N°
    const cellA = row.getCell(1);
    cellA.value = perfume.id;
    cellA.font = { name: "Calibri", size: 10, bold: true, color: { argb: "555555" } };
    cellA.alignment = { horizontal: "center", vertical: "middle" };
    cellA.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };

    // Name
    const cellB = row.getCell(2);
    cellB.value = perfume.name;
    cellB.font = { name: "Calibri", size: 11, bold: true, color: { argb: "1A1A1A" } };
    cellB.alignment = { horizontal: "left", vertical: "middle" };
    cellB.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };

    // Volume
    const cellC = row.getCell(3);
    cellC.value = perfume.volume || "-";
    cellC.font = { name: "Calibri", size: 10, color: { argb: "444444" } };
    cellC.alignment = { horizontal: "center", vertical: "middle" };
    cellC.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };

    // Gender with color
    const cellD = row.getCell(4);
    cellD.value = perfume.gender;
    const genderColor =
      perfume.gender === "DAMA"
        ? COLORS.pink
        : perfume.gender === "CABALLERO"
        ? COLORS.blue
        : COLORS.purple;
    cellD.font = { name: "Calibri", size: 10, bold: true, color: { argb: genderColor } };
    cellD.alignment = { horizontal: "center", vertical: "middle" };
    cellD.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };

    // Wholesale price
    const cellE = row.getCell(5);
    cellE.value = perfume.wholesale;
    cellE.numFmt = '$#,##0.00';
    cellE.font = { name: "Calibri", size: 11, bold: true, color: { argb: "1A1A1A" } };
    cellE.alignment = { horizontal: "right", vertical: "middle" };
    cellE.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };

    // Suggested price
    const cellF = row.getCell(6);
    cellF.value = suggested;
    cellF.numFmt = '$#,##0.00';
    cellF.font = { name: "Calibri", size: 11, bold: true, color: { argb: COLORS.darkGold } };
    cellF.alignment = { horizontal: "right", vertical: "middle" };
    cellF.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLORS.goldBg },
    };

    // Profit
    const cellG = row.getCell(7);
    cellG.value = profit;
    cellG.numFmt = '$#,##0.00';
    cellG.font = {
      name: "Calibri",
      size: 11,
      bold: true,
      color: { argb: profit !== null && profit >= 0 ? COLORS.greenText : COLORS.redText },
    };
    cellG.alignment = { horizontal: "right", vertical: "middle" };
    cellG.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: profit !== null && profit >= 0 ? COLORS.greenBg : COLORS.redBg },
    };

    // Row borders
    for (let c = 1; c <= 7; c++) {
      row.getCell(c).border = {
        bottom: { style: "thin", color: { argb: "E5E5E5" } },
      };
    }

    currentRow++;
  });

  // --- Separator for unpriced perfumes ---
  if (unpricedPerfumes.length > 0) {
    const sepRow = sheet.getRow(currentRow);
    sepRow.height = 24;
    sheet.mergeCells(`A${currentRow}:G${currentRow}`);
    const sepCell = sheet.getCell(`A${currentRow}`);
    sepCell.value = `SIN PRECIO (${unpricedPerfumes.length} perfumes)`;
    sepCell.font = {
      name: "Calibri",
      size: 11,
      bold: true,
      color: { argb: COLORS.red },
    };
    sepCell.alignment = { horizontal: "center", vertical: "middle" };
    sepCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLORS.redBg },
    };
    currentRow++;

    unpricedPerfumes.forEach((perfume, index) => {
      const row = sheet.getRow(currentRow);
      row.height = 22;

      const bgColor = index % 2 === 0 ? COLORS.white : "F9F9F9";

      // N°
      const cellA = row.getCell(1);
      cellA.value = perfume.id;
      cellA.font = { name: "Calibri", size: 10, color: { argb: "999999" } };
      cellA.alignment = { horizontal: "center", vertical: "middle" };
      cellA.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };

      // Name
      const cellB = row.getCell(2);
      cellB.value = perfume.name;
      cellB.font = { name: "Calibri", size: 11, color: { argb: "666666" } };
      cellB.alignment = { horizontal: "left", vertical: "middle" };
      cellB.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };

      // Volume
      const cellC = row.getCell(3);
      cellC.value = perfume.volume || "-";
      cellC.font = { name: "Calibri", size: 10, color: { argb: "999999" } };
      cellC.alignment = { horizontal: "center", vertical: "middle" };
      cellC.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };

      // Gender
      const cellD = row.getCell(4);
      cellD.value = perfume.gender;
      cellD.font = { name: "Calibri", size: 10, color: { argb: "999999" } };
      cellD.alignment = { horizontal: "center", vertical: "middle" };
      cellD.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };

      // Wholesale (empty)
      const cellE = row.getCell(5);
      cellE.value = "Sin precio";
      cellE.font = { name: "Calibri", size: 10, italic: true, color: { argb: COLORS.red } };
      cellE.alignment = { horizontal: "right", vertical: "middle" };
      cellE.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };

      // Suggested (empty)
      const cellF = row.getCell(6);
      cellF.value = "-";
      cellF.font = { name: "Calibri", size: 10, color: { argb: "CCCCCC" } };
      cellF.alignment = { horizontal: "right", vertical: "middle" };
      cellF.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };

      // Profit (empty)
      const cellG = row.getCell(7);
      cellG.value = "-";
      cellG.font = { name: "Calibri", size: 10, color: { argb: "CCCCCC" } };
      cellG.alignment = { horizontal: "right", vertical: "middle" };
      cellG.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };

      // Row borders
      for (let c = 1; c <= 7; c++) {
        row.getCell(c).border = {
          bottom: { style: "thin", color: { argb: "EEEEEE" } },
        };
      }

      currentRow++;
    });
  }

  // --- SUMMARY ROW ---
  currentRow++;
  const summaryRowNum = currentRow;
  const summaryRow = sheet.getRow(summaryRowNum);
  summaryRow.height = 26;

  sheet.mergeCells(`A${summaryRowNum}:D${summaryRowNum}`);
  const summaryLabel = sheet.getCell(`A${summaryRowNum}`);
  summaryLabel.value = `RESUMEN: ${metrics.priced} perfumes con precio`;
  summaryLabel.font = {
    name: "Calibri",
    size: 11,
    bold: true,
    color: { argb: COLORS.white },
  };
  summaryLabel.alignment = { horizontal: "right", vertical: "middle" };
  summaryLabel.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: COLORS.darkGray },
  };
  for (let c = 2; c <= 4; c++) {
    summaryRow.getCell(c).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLORS.darkGray },
    };
  }

  // Total wholesale
  const totalWholesale = pricedPerfumes.reduce(
    (sum, p) => sum + (p.wholesale ?? 0),
    0
  );
  const cellTotalWholesale = summaryRow.getCell(5);
  cellTotalWholesale.value = totalWholesale;
  cellTotalWholesale.numFmt = '$#,##0.00';
  cellTotalWholesale.font = {
    name: "Calibri",
    size: 12,
    bold: true,
    color: { argb: COLORS.white },
  };
  cellTotalWholesale.alignment = { horizontal: "right", vertical: "middle" };
  cellTotalWholesale.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: COLORS.darkGray },
  };

  // Total suggested
  const totalSuggested = pricedPerfumes.reduce(
    (sum, p) => sum + (getSuggestedPrice(p.wholesale) ?? 0),
    0
  );
  const cellTotalSuggested = summaryRow.getCell(6);
  cellTotalSuggested.value = totalSuggested;
  cellTotalSuggested.numFmt = '$#,##0.00';
  cellTotalSuggested.font = {
    name: "Calibri",
    size: 12,
    bold: true,
    color: { argb: COLORS.gold },
  };
  cellTotalSuggested.alignment = { horizontal: "right", vertical: "middle" };
  cellTotalSuggested.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: COLORS.darkGray },
  };

  // Total profit
  const totalProfit = totalSuggested - totalWholesale;
  const cellTotalProfit = summaryRow.getCell(7);
  cellTotalProfit.value = totalProfit;
  cellTotalProfit.numFmt = '$#,##0.00';
  cellTotalProfit.font = {
    name: "Calibri",
    size: 12,
    bold: true,
    color: { argb: COLORS.gold },
  };
  cellTotalProfit.alignment = { horizontal: "right", vertical: "middle" };
  cellTotalProfit.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: COLORS.darkGray },
  };

  // ==========================================
  // SHEET 2: RESUMEN POR GÉNERO
  // ==========================================
  const summarySheet = workbook.addWorksheet("Resumen por Género", {
    properties: {
      defaultColWidth: 20,
      tabColor: { argb: COLORS.purple },
    },
  });

  summarySheet.columns = [
    { width: 18 },  // A: Género
    { width: 14 },  // B: Cantidad
    { width: 20 },  // C: Precio Promedio
    { width: 20 },  // D: Total Mayorista
    { width: 22 },  // E: Total Sugerido
    { width: 18 },  // F: Ganancia Total
  ];

  // Title
  summarySheet.mergeCells("A1:F1");
  const s2Title = summarySheet.getRow(1);
  s2Title.height = 36;
  const s2TitleCell = summarySheet.getCell("A1");
  s2TitleCell.value = "RESUMEN POR GÉNERO";
  s2TitleCell.font = {
    name: "Calibri",
    size: 16,
    bold: true,
    color: { argb: COLORS.gold },
  };
  s2TitleCell.alignment = { horizontal: "center", vertical: "middle" };
  s2TitleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: COLORS.black },
  };

  // Headers
  const s2Headers = ["Género", "Cantidad", "Precio Promedio", "Total Mayorista", "Total Sugerido", "Ganancia Total"];
  const s2HeaderRow = summarySheet.getRow(2);
  s2HeaderRow.height = 26;

  s2Headers.forEach((header, i) => {
    const cell = s2HeaderRow.getCell(i + 1);
    cell.value = header;
    cell.font = {
      name: "Calibri",
      size: 11,
      bold: true,
      color: { argb: COLORS.black },
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLORS.gold },
    };
  });

  // Data by gender
  const genders: { label: string; value: string; color: string }[] = [
    { label: "DAMA", value: "DAMA", color: COLORS.pink },
    { label: "CABALLERO", value: "CABALLERO", color: COLORS.blue },
    { label: "UNISEX", value: "UNISEX", color: COLORS.purple },
  ];

  genders.forEach((g, index) => {
    const row = summarySheet.getRow(3 + index);
    row.height = 24;
    const genderPerfumes = perfumes.filter((p) => p.gender === g.value);
    const pricedGender = genderPerfumes.filter((p) => p.wholesale !== null);
    const totalW = pricedGender.reduce((s, p) => s + (p.wholesale ?? 0), 0);
    const totalS = pricedGender.reduce(
      (s, p) => s + (getSuggestedPrice(p.wholesale) ?? 0),
      0
    );
    const avgW = pricedGender.length > 0 ? totalW / pricedGender.length : 0;

    const bgColor = index % 2 === 0 ? COLORS.white : "F9F9F9";

    const cellA = row.getCell(1);
    cellA.value = g.label;
    cellA.font = { name: "Calibri", size: 12, bold: true, color: { argb: g.color } };
    cellA.alignment = { horizontal: "center", vertical: "middle" };
    cellA.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };

    const cellB = row.getCell(2);
    cellB.value = genderPerfumes.length;
    cellB.font = { name: "Calibri", size: 11, bold: true, color: { argb: "333333" } };
    cellB.alignment = { horizontal: "center", vertical: "middle" };
    cellB.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };

    const cellC = row.getCell(3);
    cellC.value = avgW;
    cellC.numFmt = '$#,##0.00';
    cellC.font = { name: "Calibri", size: 11, color: { argb: "333333" } };
    cellC.alignment = { horizontal: "right", vertical: "middle" };
    cellC.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };

    const cellD = row.getCell(4);
    cellD.value = totalW;
    cellD.numFmt = '$#,##0.00';
    cellD.font = { name: "Calibri", size: 11, color: { argb: "333333" } };
    cellD.alignment = { horizontal: "right", vertical: "middle" };
    cellD.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };

    const cellE = row.getCell(5);
    cellE.value = totalS;
    cellE.numFmt = '$#,##0.00';
    cellE.font = { name: "Calibri", size: 11, bold: true, color: { argb: COLORS.darkGold } };
    cellE.alignment = { horizontal: "right", vertical: "middle" };
    cellE.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLORS.goldBg },
    };

    const cellF = row.getCell(6);
    cellF.value = totalS - totalW;
    cellF.numFmt = '$#,##0.00';
    cellF.font = { name: "Calibri", size: 11, bold: true, color: { argb: COLORS.greenText } };
    cellF.alignment = { horizontal: "right", vertical: "middle" };
    cellF.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLORS.greenBg },
    };
  });

  // ==========================================
  // FREEZE PANES & PRINT SETTINGS
  // ==========================================
  // Freeze header rows so they stay visible when scrolling
  sheet.views = [
    {
      state: "frozen",
      xSplit: 0,
      ySplit: headerRowNum,
      topLeftCell: "A7",
      activeCell: "A7",
    },
  ];

  summarySheet.views = [
    {
      state: "frozen",
      xSplit: 0,
      ySplit: 2,
      topLeftCell: "A3",
      activeCell: "A3",
    },
  ];

  // Print settings
  sheet.pageSetup = {
    paperSize: 9, // A4
    orientation: "portrait",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    margins: {
      left: 0.4,
      right: 0.4,
      top: 0.5,
      bottom: 0.5,
      header: 0.3,
      footer: 0.3,
    },
  };

  // Footer with page numbers
  sheet.headerFooter = {
    oddFooter: `&LJolie Fragrances&C&P of &N&RGenerado: ${now.toLocaleDateString("es-VE")}`,
  };

  // ==========================================
  // GENERATE FILE & DOWNLOAD
  // ==========================================
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Inventario_Perfumes_Jolie_Fragrances.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
