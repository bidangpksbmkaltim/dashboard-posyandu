// app/layout.js
import "./globals.css";

export const metadata = {
  title: "Monitoring Posyandu — 6 Bidang SPM Kaltim",
  description: "Dashboard internal monitoring SK Posyandu 6 Bidang SPM se-Kalimantan Timur",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-800">{children}</body>
    </html>
  );
}
