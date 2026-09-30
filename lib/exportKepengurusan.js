import ExcelJS from "exceljs";
import { THEME, thinBorder } from "./exportTheme";
import { KECAMATAN_BY_KABUPATEN } from "./kabupatenKecamatan";

const HEADERS = [
  "No", "Kabupaten", "Kecamatan", "Desa/Kel/Kampung", "Jumlah Posyandu",
  "No.", "Nama Posyandu", "Jumlah Kader", "Status SK", "Status Registrasi", "Alamat Posyandu",
  "Jabatan", "Nama Pengurus", "Usia", "Pendidikan", "Alamat Pengurus",
];
const COL_WIDTHS = [6, 20, 18, 20, 10, 6, 22, 10, 12, 16, 22, 26, 22, 8, 12, 22];

function styleHeader(ws) {
  const row = ws.getRow(1);
  row.values = HEADERS;
  row.height = 24;
  row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: THEME.white } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: THEME.navy } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = thinBorder;
  });
}

function writeMergedCell(ws, rowStart, rowEnd, col, value, opts = {}) {
  if (rowEnd > rowStart) ws.mergeCells(rowStart, col, rowEnd, col);
  const cell = ws.getCell(rowStart, col);
  cell.value = value;
  cell.border = thinBorder;
  cell.alignment = { vertical: "middle", horizontal: opts.center ? "center" : "left", wrapText: true };
  if (opts.bold) cell.font = { bold: true };
  if (opts.shade) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: opts.shade } };
}

export async function downloadKepengurusanReport({ kabupaten, posyanduAll, kaderOfPosyandu }) {
  const scoped = posyanduAll.filter((p) => p.kabupaten === kabupaten);
  const kecOrder = (KECAMATAN_BY_KABUPATEN[kabupaten] || []).filter((kec) => scoped.some((p) => p.kecamatan === kec));

  const wb = new ExcelJS.Workbook();
  wb.creator = "Dashboard Monitoring Posyandu Kaltim";
  wb.created = new Date();

  kecOrder.forEach((kec) => {
    const posyanduInKec = scoped.filter((p) => p.kecamatan === kec);
    const desaList = [...new Set(posyanduInKec.map((p) => p.desa))];
    const ws = wb.addWorksheet(kec.slice(0, 31), { views: [{ state: "frozen", ySplit: 1 }] });
    ws.columns = COL_WIDTHS.map((width) => ({ width }));
    styleHeader(ws);

    let cursor = 2;
    desaList.forEach((desa, desaIndex) => {
      const posyanduInDesa = posyanduInKec.filter((p) => p.desa === desa);
      const desaShade = desaIndex % 2 === 0 ? "FFFAF7F1" : undefined;
      const desaRowStart = cursor;

      posyanduInDesa.forEach((p, posyanduIndex) => {
        const roster = kaderOfPosyandu(p.nama);
        const posyanduRowStart = cursor;
        const rowsForPosyandu = Math.max(1, roster.length);

        if (roster.length === 0) {
          ["Jabatan", "Nama Pengurus", "Usia", "Pendidikan", "Alamat Pengurus"].forEach((_, index) => {
            const cell = ws.getCell(cursor, index + 12);
            cell.value = "-";
            cell.border = thinBorder;
            if (desaShade) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: desaShade } };
          });
        } else {
          roster.forEach((kader) => {
            const row = ws.getRow(cursor);
            row.getCell(12).value = kader.jabatan;
            row.getCell(13).value = kader.nama;
            row.getCell(14).value = kader.usia;
            row.getCell(15).value = kader.pendidikan;
            row.getCell(16).value = p.alamat;
            [12, 13, 14, 15, 16].forEach((column) => {
              const cell = row.getCell(column);
              cell.border = thinBorder;
              cell.alignment = { vertical: "middle", wrapText: true };
              if (desaShade) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: desaShade } };
            });
            cursor += 1;
          });
        }

        const posyanduRowEnd = posyanduRowStart + rowsForPosyandu - 1;
        if (roster.length === 0) cursor += 1;
        writeMergedCell(ws, posyanduRowStart, posyanduRowEnd, 6, posyanduIndex + 1, { center: true, shade: desaShade });
        writeMergedCell(ws, posyanduRowStart, posyanduRowEnd, 7, p.nama, { bold: true, shade: desaShade });
        writeMergedCell(ws, posyanduRowStart, posyanduRowEnd, 8, roster.length, { center: true, shade: desaShade });
        writeMergedCell(ws, posyanduRowStart, posyanduRowEnd, 9, p.statusSK, { center: true, shade: desaShade });
        writeMergedCell(ws, posyanduRowStart, posyanduRowEnd, 10, p.statusRegistrasi, { center: true, shade: desaShade });
        writeMergedCell(ws, posyanduRowStart, posyanduRowEnd, 11, p.alamat, { shade: desaShade });
      });

      writeMergedCell(ws, desaRowStart, cursor - 1, 1, desaIndex + 1, { center: true, bold: true, shade: desaShade });
      writeMergedCell(ws, desaRowStart, cursor - 1, 2, kabupaten, { shade: desaShade });
      writeMergedCell(ws, desaRowStart, cursor - 1, 3, kec, { shade: desaShade });
      writeMergedCell(ws, desaRowStart, cursor - 1, 4, desa, { bold: true, shade: desaShade });
      writeMergedCell(ws, desaRowStart, cursor - 1, 5, posyanduInDesa.length, { center: true, shade: desaShade });
    });

    ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 16 } };
  });

  if (wb.worksheets.length === 0) {
    const ws = wb.addWorksheet("Tidak ada data");
    ws.getCell(1, 1).value = `Belum ada data Posyandu terdata untuk ${kabupaten}.`;
  }

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const safeScope = kabupaten.replace(/[^a-zA-Z0-9]+/g, "-");
  const dateStr = new Date().toISOString().slice(0, 10);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Laporan-Kepengurusan-${safeScope}-${dateStr}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}