import ExcelJS from "exceljs";
import { THEME, thinBorder } from "./exportTheme";

function styleTitleRow(ws, rowIdx, text, colSpan) {
  ws.mergeCells(rowIdx, 1, rowIdx, colSpan);
  const cell = ws.getCell(rowIdx, 1);
  cell.value = text;
  cell.font = { bold: true, size: 14, color: { argb: THEME.white } };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: THEME.navy } };
  cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  ws.getRow(rowIdx).height = 26;
}

function styleInfoRow(ws, rowIdx, text, colSpan) {
  ws.mergeCells(rowIdx, 1, rowIdx, colSpan);
  const cell = ws.getCell(rowIdx, 1);
  cell.value = text;
  cell.font = { size: 10, color: { argb: THEME.textMuted } };
  cell.alignment = { vertical: "middle", indent: 1 };
}

function styleHeaderRow(ws, rowIdx, headers) {
  const row = ws.getRow(rowIdx);
  row.values = headers;
  row.height = 22;
  row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: THEME.white } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: THEME.navy } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = thinBorder;
  });
}

function pctColor(pctString) {
  const n = parseInt(pctString, 10);
  if (Number.isNaN(n)) return null;
  if (n >= 80) return { fill: "FFD1FAE5", text: THEME.tealText };
  if (n >= 50) return { fill: "FFFEF3C7", text: THEME.goldText };
  return { fill: "FFFEE2E2", text: THEME.roseText };
}

function statusColor(value) {
  if (value === "Ada" || value === "Sudah") return { fill: "FFD1FAE5", text: THEME.tealText };
  if (value === "Tidak Ada" || value === "Belum") return { fill: "FFFEE2E2", text: THEME.roseText };
  return null;
}

/**
 * Bikin & langsung download laporan Excel — selalu isi SEMUA status (Sudah &
 * Belum tercampur apa adanya). Cakupannya cuma ditentukan wilayah (kabFilter),
 * TIDAK ikut chip status/pencarian yang lagi aktif di tabel — biar laporan
 * yang diunduh selalu berarti "data lengkap", bukan sebagian yang kefilter
 * tanpa disadari.
 */
export async function downloadPosyanduReport({ posyanduFiltered, kabFilter, kaderCountOf }) {
  const scopeLabel = kabFilter === "Semua" ? "Seluruh Kalimantan Timur" : kabFilter;
  const generatedAt = new Date().toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });
  const groupKey = kabFilter === "Semua" ? "kabupaten" : "kecamatan";

  const groups = {};
  posyanduFiltered.forEach((p) => {
    const key = p[groupKey];
    if (!groups[key]) groups[key] = { total: 0, skAda: 0, regSudah: 0, spmSudah: 0 };
    groups[key].total += 1;
    if (p.statusSK === "Ada") groups[key].skAda += 1;
    if (p.statusRegistrasi === "Sudah") groups[key].regSudah += 1;
    if (p.statusSPM === "Sudah") groups[key].spmSudah += 1;
  });
  const pct = (n, d) => (d ? Math.round((n / d) * 100) + "%" : "-");
  const totalAll = posyanduFiltered.length;
  const totalSkAda = posyanduFiltered.filter((p) => p.statusSK === "Ada").length;
  const totalRegSudah = posyanduFiltered.filter((p) => p.statusRegistrasi === "Sudah").length;
  const totalSpmSudah = posyanduFiltered.filter((p) => p.statusSPM === "Sudah").length;

  const wb = new ExcelJS.Workbook();
  wb.creator = "Dashboard Monitoring Posyandu Kaltim";
  wb.created = new Date();

  /* ===================== SHEET 1: RINGKASAN ===================== */
  const wsR = wb.addWorksheet("Ringkasan", { views: [{ state: "frozen", ySplit: 6 }] });
  wsR.columns = [
    { width: 28 }, { width: 15 }, { width: 10 }, { width: 8 },
    { width: 17 }, { width: 12 }, { width: 15 }, { width: 8 },
  ];
  styleTitleRow(wsR, 1, "Laporan Monitoring Posyandu 6 Bidang SPM", 8);
  styleInfoRow(wsR, 2, `Cakupan: ${scopeLabel}`, 8);
  styleInfoRow(wsR, 3, `Isi: Semua status (Sudah & Belum)`, 8);
  styleInfoRow(wsR, 4, `Diunduh: ${generatedAt}`, 8);

  const headerLabel = kabFilter === "Semua" ? "Kabupaten/Kota" : "Kecamatan";
  styleHeaderRow(wsR, 6, [headerLabel, "Jumlah Posyandu", "SK Ada", "% SK", "Registrasi Selesai", "% Registrasi", "SPM Terlaksana", "% SPM"]);

  let r = 7;
  Object.entries(groups).forEach(([name, g], i) => {
    const values = [name, g.total, g.skAda, pct(g.skAda, g.total), g.regSudah, pct(g.regSudah, g.skAda), g.spmSudah, pct(g.spmSudah, g.total)];
    const row = wsR.getRow(r);
    row.values = values;
    row.eachCell((cell, col) => {
      cell.border = thinBorder;
      cell.alignment = { vertical: "middle", horizontal: col === 1 ? "left" : "center" };
      if (i % 2 === 1) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: THEME.cream } };
    });
    [4, 6, 8].forEach((col) => {
      const c = pctColor(row.getCell(col).value);
      if (c) {
        row.getCell(col).fill = { type: "pattern", pattern: "solid", fgColor: { argb: c.fill } };
        row.getCell(col).font = { bold: true, color: { argb: c.text } };
      }
    });
    r++;
  });

  const totalRow = wsR.getRow(r);
  totalRow.values = ["TOTAL", totalAll, totalSkAda, pct(totalSkAda, totalAll), totalRegSudah, pct(totalRegSudah, totalSkAda), totalSpmSudah, pct(totalSpmSudah, totalAll)];
  totalRow.eachCell((cell, col) => {
    cell.font = { bold: true };
    cell.alignment = { vertical: "middle", horizontal: col === 1 ? "left" : "center" };
    cell.border = { ...thinBorder, top: { style: "medium", color: { argb: THEME.navy } } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE5E7EB" } };
  });

  /* ===================== SHEET 2: DETAIL POSYANDU ===================== */
  const wsD = wb.addWorksheet("Detail Posyandu", { views: [{ state: "frozen", ySplit: 1 }] });
  wsD.columns = [
    { width: 24 }, { width: 20 }, { width: 18 }, { width: 16 }, { width: 10 },
    { width: 20 }, { width: 16 }, { width: 10 }, { width: 10 }, { width: 18 }, { width: 15 },
  ];
  styleHeaderRow(wsD, 1, ["Nama Posyandu", "Kabupaten/Kota", "Kecamatan", "Desa", "Status SK", "Nomor SK", "Status Registrasi", "Status SPM", "Jumlah Kader", "Nama PJ", "WA PJ"]);

  posyanduFiltered.forEach((p, i) => {
    const rowIdx = i + 2;
    const row = wsD.getRow(rowIdx);
    row.values = [
      p.nama, p.kabupaten, p.kecamatan, p.desa, p.statusSK, p.nomorSK || "-",
      p.statusRegistrasi, p.statusSPM, kaderCountOf ? kaderCountOf(p.nama) : "-", p.pjNama || "-", p.pjWA || "-",
    ];
    row.eachCell((cell) => {
      cell.border = thinBorder;
      cell.alignment = { vertical: "middle", wrapText: true };
      if (i % 2 === 1) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: THEME.cream } };
    });
    [5, 7, 8].forEach((col) => {
      const c = statusColor(row.getCell(col).value);
      if (c) {
        row.getCell(col).fill = { type: "pattern", pattern: "solid", fgColor: { argb: c.fill } };
        row.getCell(col).font = { bold: true, color: { argb: c.text } };
        row.getCell(col).alignment = { vertical: "middle", horizontal: "center" };
      }
    });
  });
  wsD.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 11 } };

  /* ===================== DOWNLOAD ===================== */
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const safeScope = scopeLabel.replace(/[^a-zA-Z0-9]+/g, "-");
  const dateStr = new Date().toISOString().slice(0, 10);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Laporan-Posyandu-${safeScope}-${dateStr}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}