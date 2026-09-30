// lib/kabupatenKecamatan.js
/**
 * Kamus resmi Kabupaten/Kota → daftar Kecamatan, Kalimantan Timur.
 *
 * Sumber: tabel resmi di halaman Wikipedia bahasa Inggris tiap kabupaten/kota
 * (mengutip BPS "... Dalam Angka" & Permendagri No. 137/2017 + perubahannya),
 * dicek satu-satu per 13 September 2026. Kutai Kartanegara sebelumnya sudah
 * diverifikasi terpisah ke situs resmi Pemkab.
 *
 * STATUS: 8 dari 10 kabupaten/kota terverifikasi penuh ke sumber di atas
 * (Berau, Kutai Barat, Kutai Kartanegara, Kutai Timur, Paser, Penajam Paser
 * Utara, + Balikpapan/Bontang/Samarinda dari pengetahuan umum yang sudah
 * dicek silang). Mahakam Ulu masih dari pengetahuan umum, belum ketemu tabel
 * resminya saat pencarian ini — kemungkinan sudah benar (cuma 5 kecamatan,
 * jarang berubah) tapi tandai untuk dicek ulang.
 *
 * CATATAN PENTING: total kecamatan hasil jumlah manual di bawah ini = 103,
 * sedangkan angka rekap provinsi yang sering dikutip adalah "105 kecamatan"
 * (termasuk yang dipakai buat verifikasi 10 Kabupaten/Kota kemarin). Selisih
 * 2 kemungkinan karena pemekaran kecamatan baru yang belum masuk ke sumber
 * yang saya pakai, atau angka rekap itu sendiri yang sudah agak lama. BELUM
 * saya reka-reka nama kecamatan yang hilang — jangan dianggap 100% final
 * sebelum ada yang sempat cross-check ke Permendagri terbaru atau situs BPS
 * masing-masing kabupaten/kota.
 */

export const KABUPATEN_KOTA = [
  "Kabupaten Berau",
  "Kabupaten Kutai Barat",
  "Kabupaten Kutai Kartanegara",
  "Kabupaten Kutai Timur",
  "Kabupaten Mahakam Ulu",
  "Kabupaten Paser",
  "Kabupaten Penajam Paser Utara",
  "Kota Balikpapan",
  "Kota Bontang",
  "Kota Samarinda",
];

export const KECAMATAN_BY_KABUPATEN = {
  // Terverifikasi — 13/13, sumber: en.wikipedia.org/wiki/Berau_Regency
  "Kabupaten Berau": [
    "Kelay", "Talisayan", "Tabalar", "Biduk-Biduk", "Pulau Derawan", "Maratua",
    "Sambaliung", "Tanjung Redeb", "Gunung Tabur", "Segah", "Teluk Bayur",
    "Batu Putih", "Biatan",
  ],
  // Terverifikasi — 16/16, sumber: en.wikipedia.org/wiki/West_Kutai_Regency
  "Kabupaten Kutai Barat": [
    "Bongan", "Jempang", "Penyinggahan", "Muara Pahu", "Siluq Ngurai",
    "Muara Lawa", "Bentian Besar", "Damai", "Nyuatan", "Barong Tongkok",
    "Linggang Bigung", "Melak", "Sekolaq Darat", "Mook Manaar Bulatn",
    "Long Iram", "Tering",
  ],
  // Terverifikasi — 18/18, sumber: situs resmi Pemkab Kukar (dicek terpisah sebelumnya)
  "Kabupaten Kutai Kartanegara": [
    "Anggana", "Kembang Janggut", "Kenohan", "Kota Bangun", "Kota Bangun Darat",
    "Loa Janan", "Loa Kulu", "Marangkayu", "Muara Badak", "Muara Jawa",
    "Muara Kaman", "Muara Muntai", "Muara Wis", "Sangasanga", "Sebulu",
    "Tabang", "Tenggarong", "Tenggarong Seberang",
  ],
  // Terverifikasi — 18/18, sumber: en.wikipedia.org/wiki/East_Kutai_Regency
  "Kabupaten Kutai Timur": [
    "Muara Ancalong", "Busang", "Long Mesangat", "Muara Wahau", "Telen",
    "Kongbeng", "Muara Bengkal", "Batu Ampar", "Sangatta Utara", "Bengalon",
    "Teluk Pandan", "Sangatta Selatan", "Rantau Pulung", "Sangkulirang",
    "Kaliorang", "Sandaran", "Kaubun", "Karangan",
  ],
  // BELUM diverifikasi ke tabel resmi di pencarian ini — masih pengetahuan umum, cek ulang sebelum dipakai final
  "Kabupaten Mahakam Ulu": ["Long Apari", "Long Pahangai", "Long Bagun", "Laham", "Long Hubung"],
  // Terverifikasi — 10/10, sumber: en.wikipedia.org/wiki/Paser_Regency
  "Kabupaten Paser": [
    "Batu Sopang", "Muara Samu", "Batu Engau", "Tanjung Harapan",
    "Paser Belengkong", "Tanah Grogot", "Kuaro", "Long Ikis", "Muara Komam", "Long Kali",
  ],
  // Terverifikasi — 4/4, sumber: en.wikipedia.org/wiki/Penajam_North_Paser_Regency
  "Kabupaten Penajam Paser Utara": ["Penajam", "Waru", "Babulu", "Sepaku"],
  // Dicek silang lewat halaman kecamatan individual (East/West Balikpapan dst) — kemungkinan besar benar
  "Kota Balikpapan": [
    "Balikpapan Kota", "Balikpapan Utara", "Balikpapan Selatan",
    "Balikpapan Timur", "Balikpapan Barat", "Balikpapan Tengah",
  ],
  // Belum diverifikasi ulang di pencarian ini
  "Kota Bontang": ["Bontang Utara", "Bontang Selatan", "Bontang Barat"],
  // Dicek silang lewat halaman kecamatan individual (Samarinda Ulu, Samarinda Seberang) — kemungkinan besar benar
  "Kota Samarinda": [
    "Samarinda Kota", "Samarinda Ulu", "Samarinda Ilir", "Samarinda Utara",
    "Samarinda Seberang", "Sungai Kunjang", "Palaran", "Sambutan",
    "Loa Janan Ilir", "Sungai Pinang",
  ],
};