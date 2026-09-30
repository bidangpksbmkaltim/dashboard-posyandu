// lib/sheets.js
import { google } from "googleapis";
import { normalizeBatch } from "./normalizeKecamatan";

// TODO: isi begitu Hera selesai & spreadsheet "Data Posyandu Kaltim - Master" siap.
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

function getClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  return google.sheets({ version: "v4", auth });
}

// Kolom di sheet mengikuti URUTAN pertanyaan di Form 1 / Form 2 (lihat panduan
// Hera) — bukan nama header persis, biar nggak gampang patah kalau ada typo kecil
// di judul pertanyaan. Sesuaikan index ini begitu sheet asli sudah ada.
const FORM1_COLUMNS = [
  "timestamp", "nama", "kabupaten", "kecamatan", "desa", "alamat", "lokasiUrl",
  "kaderLengkap", "statusSK", "nomorSK", "tanggalSK", "tentangSK", "masaBakti",
  "uploadSK", "kendalaSK", "statusRegistrasi", "nomorRegistrasi",
  "statusSPM", "kendalaSPM", "pjNama", "pjWA",
];

const FORM2_COLUMNS = [
  "timestamp", "posyandu", "nama", "jabatan", "usia", "pendidikan", "alamat", "pjWA",
];

function rowsToObjects(rows, columns) {
  return rows.map((r, index) => ({
    id: index + 1,
    ...Object.fromEntries(columns.map((c, i) => [c, r[i] ?? ""])),
  }));
}

function latestPosyanduSubmission(rows) {
  const byName = new Map();
  for (const row of rows) {
    const key = row.nama.trim().toLocaleLowerCase("id-ID").replace(/\s+/g, " ");
    if (key) byName.set(key, row);
  }
  return [...byName.values()];
}

export async function getPosyanduData() {
  const sheets = getClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "'Form Responses 1'!A2:U",
  });
  const raw = rowsToObjects(res.data.values || [], FORM1_COLUMNS);
  const unique = latestPosyanduSubmission(raw);
  const { normalized, flagged } = normalizeBatch(unique);
  if (flagged.length) {
    // TODO: kirim ke tempat yang bisa ditinjau (log, atau tab "Perlu Ditinjau" di Sheets)
    console.warn(`${flagged.length} baris Kecamatan tidak dikenali, perlu ditinjau manual.`);
  }
  return normalized;
}

export async function getKaderData() {
  const sheets = getClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "'Form Responses 2'!A2:H",
  });
  return rowsToObjects(res.data.values || [], FORM2_COLUMNS);
}
