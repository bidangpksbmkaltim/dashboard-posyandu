// components/dashboard/FilterBar.jsx
import { Search, Download, Loader2, X } from "lucide-react";
import { KABUPATEN_KOTA, KECAMATAN_BY_KABUPATEN } from "@/lib/kabupatenKecamatan";

const STATUS_OPTIONS = ["Semua", "SK Ada", "SK Kosong", "Registrasi Sudah", "Registrasi Belum", "SPM Belum"];

const DEFAULT_FILTERS = { kabFilter: "Semua", kecFilter: "Semua", statusFilter: "Semua", search: "" };

export default function FilterBar({
  kabFilter,
  kecFilter,
  statusFilter,
  search,
  resultCount,
  onChange,
  onExport,
  exporting = false,
}) {
  const kecOptions = kabFilter === "Semua" ? [] : KECAMATAN_BY_KABUPATEN[kabFilter] || [];

  const activeCount =
    (kabFilter !== DEFAULT_FILTERS.kabFilter ? 1 : 0) +
    (kecFilter !== DEFAULT_FILTERS.kecFilter ? 1 : 0) +
    (statusFilter !== DEFAULT_FILTERS.statusFilter ? 1 : 0) +
    (search.trim() !== "" ? 1 : 0);

  function resetFilters() {
    onChange({ ...DEFAULT_FILTERS });
  }

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-[#ECE4F2] bg-white p-4 shadow-sm md:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <div>
            <p className="text-sm font-bold text-[#241832]">Filter Dashboard</p>
            <p className="mt-0.5 text-[11px] text-[#A99BC2]">Atur cakupan data untuk ringkasan, grafik, dan tabel</p>
          </div>
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#CBA135]/15 px-1.5 text-[10px] font-bold text-[#B5860F]">
              {activeCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:flex-none">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#B3A6C4]" />
            <input
              value={search}
              onChange={(e) => onChange({ search: e.target.value })}
              placeholder="Cari nama posyandu / desa"
              className="w-full rounded-xl border border-[#ECE4F2] py-2 pl-8 pr-3 text-xs text-[#241832] outline-none focus:border-[#CBA135] sm:w-56"
            />
          </div>
          <button
            onClick={onExport}
            disabled={exporting}
            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-[#CBA135] bg-white px-3 py-2 text-xs font-semibold text-[#B5860F] transition-colors hover:bg-[#CBA135] hover:text-white disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-white disabled:hover:text-[#B5860F]"
          >
            {exporting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Menyiapkan...
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" /> Unduh Laporan
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <select
          value={kabFilter}
          onChange={(e) => onChange({ kabFilter: e.target.value, kecFilter: "Semua" })}
          className="rounded-xl border border-[#ECE4F2] px-3 py-2 text-xs text-[#241832] outline-none focus:border-[#CBA135]"
        >
          <option>Semua</option>
          {KABUPATEN_KOTA.map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>

        <select
          value={kecFilter}
          onChange={(e) => onChange({ kecFilter: e.target.value })}
          disabled={kabFilter === "Semua"}
          className="rounded-xl border border-[#ECE4F2] px-3 py-2 text-xs text-[#241832] outline-none focus:border-[#CBA135] disabled:cursor-not-allowed disabled:bg-[#FAF7F1] disabled:text-[#C7BBD8]"
        >
          <option>Semua</option>
          {kecOptions.map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>

        <div className="flex gap-1.5 overflow-x-auto">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onChange({ statusFilter: s })}
              className={
                "whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors " +
                (statusFilter === s ? "bg-[#1B1033] text-[#E8C766]" : "bg-[#F3EEF9] text-[#8B7F9C] hover:bg-[#ECE4F2]")
              }
            >
              {s}
            </button>
          ))}
        </div>

        {activeCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#C1485B] transition-colors hover:text-[#9C3849]"
          >
            <X className="h-3 w-3" /> Hapus filter
          </button>
        )}

        <span className="ml-auto text-[11px] text-[#A99BC2]">{resultCount} hasil</span>
      </div>
    </div>
  );
}