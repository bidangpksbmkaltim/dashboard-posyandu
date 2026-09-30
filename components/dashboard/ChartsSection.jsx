// components/dashboard/ChartsSection.jsx
"use client";
import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, LabelList } from "recharts";
import { Building2, FileCheck2, ClipboardCheck, ListChecks, ChevronRight, MousePointerClick } from "lucide-react";
import { KpiCard } from "./StatusChip";
import { KABUPATEN_KOTA, KECAMATAN_BY_KABUPATEN } from "@/lib/kabupatenKecamatan";

function BarTooltip({ active, payload, showHint }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-[#ECE4F2] bg-white px-3 py-2 text-xs shadow-lg shadow-[#1B1033]/10">
      <p className="font-semibold text-[#241832]">{d.full}</p>
      <p className="mt-0.5 text-[#8B7F9C]">
        Jumlah: <span className="font-semibold text-[#241832]">{d.jumlah}</span>
      </p>
      {showHint && <p className="mt-1 text-[10px] font-medium text-[#B5860F]">Klik untuk lihat kecamatan</p>}
    </div>
  );
}

function DonutStat({ title, segments }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const pct = total ? Math.round((segments[0].value / total) * 100) : 0;
  return (
    <div className="rounded-3xl border border-[#ECE4F2] bg-white p-5 shadow-sm">
      <p className="mb-4 text-sm font-bold text-[#241832]">{title}</p>
      <div className="flex items-center gap-5">
        <div className="relative h-28 w-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={segments} dataKey="value" innerRadius={38} outerRadius={54} paddingAngle={3} strokeWidth={0}>
                {segments.map((s, i) => (
                  <Cell key={i} fill={s.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-extrabold text-[#241832]">{pct}%</span>
          </div>
        </div>
        <div className="flex-1 space-y-2.5">
          {segments.map((s, i) => (
            <div key={i} className="flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-2 text-[#6B5B7B]">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
                {s.name}
              </span>
              <span className="font-semibold text-[#241832]">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChartsSection({ posyandu, kabFilter, scopeLabel, onDrillDown, onResetDrillDown }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  const total = posyandu.length;
  const skAda = posyandu.filter((p) => p.statusSK === "Ada").length;
  const regSudah = posyandu.filter((p) => p.statusRegistrasi === "Sudah").length;
  const spmSudah = posyandu.filter((p) => p.statusSPM === "Sudah").length;

  const barData =
    kabFilter === "Semua"
      ? KABUPATEN_KOTA.map((k) => ({
          label: k.replace("Kabupaten ", "").replace("Kota ", ""),
          full: k,
          jumlah: posyandu.filter((p) => p.kabupaten === k).length,
        }))
      : (KECAMATAN_BY_KABUPATEN[kabFilter] || []).map((k) => ({
          label: k.length > 12 ? k.slice(0, 11) + "…" : k,
          full: k,
          jumlah: posyandu.filter((p) => p.kabupaten === kabFilter && p.kecamatan === k).length,
        }));
  const barTitle = kabFilter === "Semua" ? "Jumlah Posyandu per Kabupaten/Kota" : `Jumlah Posyandu per Kecamatan — ${kabFilter}`;
  const drilled = kabFilter !== "Semua";

  // beri ruang ~20% di atas nilai tertinggi agar label angka & tick tidak mepet/terpotong
  const maxJumlah = useMemo(() => Math.max(0, ...barData.map((d) => d.jumlah)), [barData]);
  const yDomainMax = Math.max(5, Math.ceil((maxJumlah * 1.2) / 5) * 5);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <KpiCard icon={Building2} label="Posyandu Terdata" value={total} sub={scopeLabel} tone="night" />
        <KpiCard
          icon={FileCheck2}
          label="SK Sudah Ada"
          value={`${skAda}/${total}`}
          sub={total ? `${Math.round((skAda / total) * 100)}% terpenuhi` : ""}
          percent={total ? Math.round((skAda / total) * 100) : 0}
          tone="teal"
        />
        <KpiCard
          icon={ClipboardCheck}
          label="Registrasi SK Selesai"
          value={`${regSudah}/${skAda}`}
          sub="dari yang sudah punya SK"
          percent={skAda ? Math.round((regSudah / skAda) * 100) : 0}
          tone="gold"
        />
        <KpiCard
          icon={ListChecks}
          label="6 Bidang SPM Terlaksana"
          value={`${spmSudah}/${total}`}
          sub={total ? `${Math.round((spmSudah / total) * 100)}% terlaksana` : ""}
          percent={total ? Math.round((spmSudah / total) * 100) : 0}
          tone="sogan"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="rounded-3xl border border-[#ECE4F2] bg-white p-5 shadow-sm lg:col-span-3">
          <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-bold text-[#241832]">{barTitle}</p>
            <div className="flex items-center gap-1.5 rounded-full bg-[#F7F3EC] px-3 py-1.5 text-xs">
              <button
                onClick={onResetDrillDown}
                className={drilled ? "text-[#9C8FB0] transition hover:text-[#1B1033]" : "font-semibold text-[#1B1033]"}
              >
                Semua Kab/Kota
              </button>
              {drilled && (
                <>
                  <ChevronRight className="h-3 w-3 text-[#C7BBD8]" />
                  <span className="font-semibold text-[#B5860F]">{kabFilter}</span>
                  <span className="rounded-full bg-[#1B1033]/5 px-2 py-0.5 font-bold text-[#1B1033]">
                    {posyandu.filter((p) => p.kabupaten === kabFilter).length} Posyandu
                  </span>
                </>
              )}
            </div>
          </div>

          {!drilled && (
            <p className="mb-3 flex items-center gap-1.5 text-[11px] text-[#A99BC2]">
              <MousePointerClick className="h-3 w-3" /> Klik salah satu batang untuk melihat rincian kecamatan
            </p>
          )}

          <div className={drilled ? "h-72" : "mt-3 h-72"}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 24, right: 8, left: 0, bottom: 10 }} barCategoryGap="24%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3EEF9" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "#A99BC2" }}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  height={62}
                  tickMargin={8}
                />
                <YAxis
                  width={28}
                  domain={[0, yDomainMax]}
                  tick={{ fontSize: 11, fill: "#A99BC2" }}
                  allowDecimals={false}
                />
                <Tooltip cursor={{ fill: "#F7F3EC" }} content={<BarTooltip showHint={!drilled} />} />
                <Bar dataKey="jumlah" radius={[8, 8, 0, 0]} isAnimationActive animationDuration={450} maxBarSize={44}>
                  <LabelList
                    dataKey="jumlah"
                    position="top"
                    offset={8}
                    style={{ fontSize: 11, fontWeight: 700, fill: "#241832" }}
                  />
                  {barData.map((entry, i) => (
                    <Cell
                      key={entry.full}
                      cursor={drilled ? "default" : "pointer"}
                      fill={!drilled && hoverIndex === i ? "#CBA135" : "#3D2B63"}
                      onMouseEnter={() => !drilled && setHoverIndex(i)}
                      onMouseLeave={() => setHoverIndex(null)}
                      onClick={() => !drilled && onDrillDown(entry.full)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          <DonutStat
            title="Status SK"
            segments={[
              { name: "SK Ada", value: skAda, color: "#0D9488" },
              { name: "SK Belum Ada", value: total - skAda, color: "#E4DCF0" },
            ]}
          />
          <DonutStat
            title="Pelaksanaan 6 Bidang SPM"
            segments={[
              { name: "SPM Sudah", value: spmSudah, color: "#0D9488" },
              { name: "SPM Belum", value: total - spmSudah, color: "#CBA135" },
            ]}
          />
        </div>
      </div>
    </>
  );
}