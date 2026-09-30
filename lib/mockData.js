import { KABUPATEN_KOTA, KECAMATAN_BY_KABUPATEN } from "./kabupatenKecamatan";

const JABATAN_LIST = [
  "Ketua", "Sekretaris", "Bendahara",
  "Ketua Bidang Pendidikan", "Ketua Bidang Kesehatan", "Ketua Bidang Pekerjaan Umum",
  "Ketua Bidang Perumahan Rakyat", "Ketua Bidang Ketentraman, Ketertiban Umum & Perlindungan Masyarakat",
  "Ketua Bidang Sosial", "Kader Bidang Pendidikan", "Kader Bidang Kesehatan",
  "Kader Bidang Pekerjaan Umum", "Kader Bidang Perumahan Rakyat",
  "Kader Bidang Ketentraman & Ketertiban", "Kader Bidang Sosial",
];

function seededRand(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Dipanggil dari app/api/posyandu/route.js selama Sheets asli belum tersambung.
// Bentuk objek yang di-return SAMA PERSIS dengan yang bakal dikembalikan
// lib/sheets.js:getPosyanduData() nanti — jadi komponen UI nggak perlu berubah
// sama sekali begitu sumber datanya diganti.
export function generateMockPosyandu() {
  const rows = [];
  let idx = 0;
  const namaDepan = ["Melati", "Mawar", "Anggrek", "Kenanga", "Cempaka", "Dahlia", "Seroja", "Teratai"];
  KABUPATEN_KOTA.forEach((kab) => {
    (KECAMATAN_BY_KABUPATEN[kab] || []).forEach((kec) => {
      const perKec = 1 + Math.floor(seededRand(idx * 1.7) * 2);
      for (let j = 0; j < perKec; j++) {
        const i = idx;
        const skAda = seededRand(i * 7.13) > 0.22;
        const regSudah = skAda && seededRand(i * 3.91 + 1) > 0.35;
        const spmSudah = seededRand(i * 5.27 + 2) > 0.4;
        idx++;
        rows.push({
          id: idx,
          nama: `Posyandu ${namaDepan[i % namaDepan.length]} ${idx}`,
          kabupaten: kab,
          kecamatan: kec,
          desa: `Desa ${kec} ${j + 1}`,
          alamat: `Jl. Merdeka RT ${String((i % 9) + 1).padStart(2, "0")}`,
          lokasiUrl: "https://maps.google.com/?q=" + encodeURIComponent(`Posyandu ${kec} ${kab}`),
          kaderLengkap: seededRand(i * 9.1) > 0.3,
          statusSK: skAda ? "Ada" : "Tidak Ada",
          nomorSK: skAda ? `140/${100 + idx}/SK-POS/2024` : null,
          nomorRegistrasi: regSudah ? `64${String(100000 + idx).slice(1)}` : null,
          statusRegistrasi: skAda ? (regSudah ? "Sudah" : "Belum") : "-",
          statusSPM: spmSudah ? "Sudah" : "Belum",
          pjNama: "Contoh PJ",
          pjWA: "0812xxxxxxx",
        });
      }
    });
  });
  return rows;
}

export function generateMockKader(posyanduList) {
  const rows = [];
  let idx = 0;
  posyanduList.forEach((p, pi) => {
    const count = p.kaderLengkap ? 6 : 3;
    for (let k = 0; k < count; k++) {
      idx++;
      rows.push({
        id: idx,
        posyandu: p.nama,
        nama: `Kader ${idx}`,
        jabatan: JABATAN_LIST[(k + pi) % JABATAN_LIST.length],
        usia: 28 + ((pi * 3 + k * 5) % 35),
        pendidikan: ["SMA", "D3", "S1"][(pi + k) % 3],
      });
    }
  });
  return rows;
}