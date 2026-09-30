<!-- README.md -->
# Dashboard Monitoring Posyandu — 6 Bidang SPM Kalimantan Timur

Dashboard internal buat Bu Vio, baca data dari Google Sheets (hasil Form 1 & Form 2
yang diisi Hera), nampilin status SK / Registrasi / Pelaksanaan 6 Bidang SPM per
Posyandu se-Kalimantan Timur.

## Status saat ini

Mock data (`lib/mockData.js`) masih dipakai di semua tempat. Belum disambungkan ke
Google Sheets asli — nunggu Hera selesai bikin Form 1 & 2, dan nunggu kamus
kecamatan (`lib/kabupatenKecamatan.js`) diisi lengkap 105 kecamatan resmi.

## Struktur folder

```
app/                        Routing Next.js (App Router)
├── layout.js                Layout root (font, metadata)
├── page.js                  Redirect ke /login atau /dashboard
├── login/page.js             Halaman login
├── dashboard/page.js         Halaman dashboard utama
└── api/
    ├── posyandu/route.js     Endpoint baca data Posyandu (Form 1)
    ├── kader/route.js        Endpoint baca data Kader (Form 2)
    └── auth/route.js         Endpoint login (cek username/password)

components/
├── layout/                  Sidebar, Topbar, MobileNav — kerangka halaman
├── dashboard/                KPI card, filter, tabel, grafik, detail drawer
└── auth/                     Form login

lib/
├── mockData.js               Data contoh (dipakai sekarang, dicabut nanti)
├── kabupatenKecamatan.js     Kamus 10 Kabupaten/Kota + Kecamatan (BELUM LENGKAP,
│                              lihat catatan TODO di file-nya)
├── normalizeKecamatan.js     Pembersih otomatis nama Kecamatan (fuzzy match)
├── sheets.js                 Koneksi ke Google Sheets API (stub, isi kalau
│                              spreadsheet asli sudah siap)
└── session.js                Helper cek sesi login (cookie sederhana)

middleware.js                 Jaga /dashboard supaya nggak bisa diakses tanpa login
```

## Kenapa strukturnya begini

- **`app/api/*`** dipisah per sumber data (posyandu, kader, auth) supaya kalau nanti
  ada perubahan di satu form, endpoint yang lain nggak ikut kesenggol.
- **`lib/sheets.js`** jadi satu-satunya tempat yang "ngomong" langsung ke Google
  Sheets API. Semua komponen/halaman lain baca data lewat `app/api/*`, bukan
  manggil Sheets API sendiri-sendiri — jadi kalau kredensial atau struktur sheet
  berubah, cukup diubah di satu file ini.
- **`lib/normalizeKecamatan.js`** dipisah dari `sheets.js` supaya logika pembersih
  data bisa dites sendiri tanpa perlu koneksi internet ke Google.
- **Komponen dipecah per tanggung jawab** (satu file = satu bagian UI) supaya gampang
  dicari & diubah tanpa buka file raksasa.

## Menjalankan lokal (setelah `npm install`)

```
cp .env.example .env.local   # isi kredensial (lihat komentar di dalamnya)
npm install
npm run dev
```

## Yang masih perlu diisi sebelum go-live

1. `lib/kabupatenKecamatan.js` — lengkapi 105 kecamatan resmi (baru ada Kutai
   Kartanegara + beberapa contoh kabupaten lain).
2. `lib/sheets.js` — isi `SPREADSHEET_ID` asli begitu Hera selesai, dan pasang
   service account credential di `.env.local`.
3. `lib/session.js` — ganti username/password demo dengan mekanisme yang lebih
   aman (hashed password, bukan disimpan polos di kode).
4. Deploy ke Vercel, set environment variables yang sama seperti `.env.local`.
