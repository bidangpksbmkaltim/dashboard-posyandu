// components/dashboard/RegionSummaryStrip.jsx
// Strip angka ringkas di atas tabel Data Posyandu — ngikutin SEMUA filter yang
// lagi aktif (wilayah, status, pencarian), atas permintaan Bu Vio biar filter
// apa pun langsung kelihatan dampaknya di angka ini juga, bukan cuma di tabel.
export default function RegionSummaryStrip({ posyanduInRegion, scopeLabel }) {
  const total = posyanduInRegion.length;
  const skAda = posyanduInRegion.filter((p) => p.statusSK === "Ada").length;
  const regSudah = posyanduInRegion.filter((p) => p.statusRegistrasi === "Sudah").length;
  const spmSudah = posyanduInRegion.filter((p) => p.statusSPM === "Sudah").length;
  const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);

  const stats = [
    { label: "Posyandu", value: total, sub: scopeLabel },
    { label: "SK Ada", value: `${skAda}/${total}`, sub: `${pct(skAda, total)}%` },
    { label: "Registrasi Selesai", value: `${regSudah}/${skAda}`, sub: `${pct(regSudah, skAda)}%` },
    { label: "SPM Terlaksana", value: `${spmSudah}/${total}`, sub: `${pct(spmSudah, total)}%` },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-2 border-b border-[#ECE4F2] bg-[#FAF7F1] px-4 py-3 md:px-5">
      {stats.map((s, i) => (
        <div key={i} className="flex items-baseline gap-1.5 text-xs">
          <span className="text-sm font-extrabold text-[#241832]">{s.value}</span>
          <span className="text-[#8B7F9C]">{s.label}</span>
          {s.sub && <span className="font-semibold text-[#B5860F]">({s.sub})</span>}
        </div>
      ))}
    </div>
  );
}