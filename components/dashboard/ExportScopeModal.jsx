import { useState } from "react";
import { X } from "lucide-react";
import { KABUPATEN_KOTA } from "@/lib/kabupatenKecamatan";

export default function ExportScopeModal({ open, onClose, onConfirm, defaultKab, allowSemua, title, description, loading }) {
  const [kabupaten, setKabupaten] = useState(defaultKab === "Semua" && !allowSemua ? KABUPATEN_KOTA[0] : defaultKab);
  if (!open) return null;
  const options = allowSemua ? ["Semua", ...KABUPATEN_KOTA] : KABUPATEN_KOTA;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B1033]/40 p-4" role="dialog" aria-modal="true" aria-labelledby="export-title">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="export-title" className="text-lg font-bold text-[#241832]">{title}</h2>
            <p className="mt-1 text-xs leading-relaxed text-[#8B7F9C]">{description}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-[#8B7F9C] hover:bg-[#F7F3EC]" aria-label="Tutup"><X className="h-4 w-4" /></button>
        </div>
        <label className="mt-6 block text-xs font-semibold text-[#241832]">
          Kabupaten/Kota
          <select value={kabupaten} onChange={(event) => setKabupaten(event.target.value)} className="mt-2 w-full rounded-xl border border-[#ECE4F2] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#CBA135]">
            {options.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-xs font-semibold text-[#8B7F9C] hover:bg-[#F7F3EC]">Batal</button>
          <button type="button" disabled={loading} onClick={() => onConfirm(kabupaten)} className="rounded-xl bg-[#1B1033] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60">{loading ? "Menyiapkan..." : "Unduh laporan"}</button>
        </div>
      </div>
    </div>
  );
}