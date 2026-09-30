// components/dashboard/StatusChip.jsx
import { CheckCircle2, XCircle } from "lucide-react";

export function StatusChip({ value, positive = "Sudah" }) {
  if (value === "-")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#F3EEF9] px-2.5 py-1 text-xs font-medium text-[#B3A6C4]">
        —
      </span>
    );
  const ok = value === positive;
  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 " +
        (ok
          ? "bg-[#0D9488]/10 text-[#0D9488] ring-[#0D9488]/20"
          : "bg-[#C1485B]/10 text-[#C1485B] ring-[#C1485B]/20")
      }
    >
      {ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
      {value}
    </span>
  );
}

const TONES = {
  night: { badge: "bg-[#1B1033] text-[#E8C766]", bar: "bg-[#1B1033]" },
  teal: { badge: "bg-[#0D9488]/10 text-[#0D9488]", bar: "bg-[#0D9488]" },
  gold: { badge: "bg-[#CBA135]/15 text-[#B5860F]", bar: "bg-[#CBA135]" },
  sogan: { badge: "bg-[#C1485B]/10 text-[#C1485B]", bar: "bg-[#C1485B]" },
};

export function KpiCard({ icon: Icon, label, value, sub, percent, tone = "night" }) {
  const t = TONES[tone] || TONES.night;
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[#ECE4F2] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#8B7F9C]">{label}</p>
          <p className="mt-2 truncate text-2xl font-extrabold tracking-tight text-[#241832]">{value}</p>
          {sub && <p className="mt-1 text-xs text-[#A99BC2]">{sub}</p>}
        </div>
        <div className={"shrink-0 rounded-2xl p-2.5 " + t.badge}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {typeof percent === "number" && (
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#F3EEF9]">
          <div
            className={"h-full rounded-full transition-all duration-700 " + t.bar}
            style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
          />
        </div>
      )}
    </div>
  );
}