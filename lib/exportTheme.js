// lib/exportTheme.js
// Warna ARGB buat file Excel yang di-export, disamakan sama palet batik yang
// dipakai di tampilan website (biar laporan yang diunduh nggak keliatan beda
// "brand" sama dashboard-nya).
export const THEME = {
  navy: "FF1B1033",
  gold: "FFCBA135",
  goldText: "FFB5860F",
  teal: "FF0D9488",
  tealText: "FF047857",
  rose: "FFC1485B",
  roseText: "FF9C3849",
  cream: "FFFAF7F1",
  white: "FFFFFFFF",
  textDark: "FF241832",
  textMuted: "FF8B7F9C",
  border: "FFECE4F2",
};

export const thinBorder = {
  top: { style: "thin", color: { argb: THEME.border } },
  bottom: { style: "thin", color: { argb: THEME.border } },
  left: { style: "thin", color: { argb: THEME.border } },
  right: { style: "thin", color: { argb: THEME.border } },
};