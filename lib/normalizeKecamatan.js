// lib/normalizeKecamatan.js
import { KECAMATAN_BY_KABUPATEN } from "./kabupatenKecamatan";

/**
 * Jarak Levenshtein sederhana — dipakai buat ngukur "mirip-mirip"nya 2 string.
 * Nggak perlu library luar, cukup buat teks pendek kayak nama kecamatan.
 */
function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

function cleanup(s) {
  return (s || "").trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Cocokin teks Kecamatan yang diketik orang ke nama resmi, TAPI cuma dibandingkan
 * ke kecamatan-kecamatan di dalam Kabupaten/Kota yang sama (bukan ke 105 kecamatan
 * sekaligus) — ini yang bikin akurasinya tinggi meski kecamatan-nya isian bebas.
 *
 * @param {string} kabupaten  nilai dari dropdown Kabupaten/Kota (sudah pasti valid)
 * @param {string} kecamatanInput  teks Kecamatan apa adanya dari Sheet
 * @returns {{ matched: string, confidence: "exact"|"fuzzy"|"unmatched", original: string }}
 */
export function normalizeKecamatan(kabupaten, kecamatanInput) {
  const candidates = KECAMATAN_BY_KABUPATEN[kabupaten] || [];
  const cleanedInput = cleanup(kecamatanInput);

  const exact = candidates.find((c) => cleanup(c) === cleanedInput);
  if (exact) return { matched: exact, confidence: "exact", original: kecamatanInput };

  let best = null;
  let bestDist = Infinity;
  for (const c of candidates) {
    const dist = levenshtein(cleanedInput, cleanup(c));
    if (dist < bestDist) { bestDist = dist; best = c; }
  }

  // Toleransi typo: distance kecil relatif ke panjang kata dianggap masih "sama".
  const threshold = Math.max(2, Math.floor(cleanedInput.length * 0.25));
  if (best && bestDist <= threshold) {
    return { matched: best, confidence: "fuzzy", original: kecamatanInput };
  }

  return { matched: kecamatanInput, confidence: "unmatched", original: kecamatanInput };
}

/**
 * Proses satu batch baris data Posyandu, kembalikan versi yang sudah dinormalisasi
 * plus daftar baris yang perlu ditinjau manual (confidence "unmatched").
 */
export function normalizeBatch(rows) {
  const flagged = [];
  const normalized = rows.map((row) => {
    const result = normalizeKecamatan(row.kabupaten, row.kecamatan);
    if (result.confidence === "unmatched") flagged.push({ ...row, alasan: "Kecamatan tidak dikenali di Kabupaten/Kota ini" });
    return { ...row, kecamatan: result.matched, _kecamatanConfidence: result.confidence };
  });
  return { normalized, flagged };
}
