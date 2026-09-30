// components/dashboard/DetailDrawer.jsx
"use client";
import { MapPin, X, ExternalLink } from "lucide-react";
import { StatusChip } from "./StatusChip";
import { KawungPattern } from "@/components/auth/BatikPattern";

export default function DetailDrawer({ posyandu, kader, onClose }) {
  if (!posyandu) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="modal-overlay absolute inset-0 bg-[#1B1033]/40" onClick={onClose} />
      <div className="modal-panel relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="relative overflow-hidden rounded-t-3xl border-b border-[#ECE4F2] bg-[#FFFDF8] px-6 pb-5 pt-6">
          <KawungPattern className="pointer-events-none absolute -right-8 -top-8 h-32 w-32" color="#9C4A2B" opacity={0.06} />
          <div className="relative flex items-start justify-between">
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-[#B5860F]">
                {posyandu.kabupaten} · {posyandu.kecamatan} · {posyandu.desa}
              </p>
              <h3 className="font-display mt-1 text-lg text-[#241832]">{posyandu.nama}</h3>
            </div>
            <button
              onClick={onClose}
              className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#A99BC2] transition hover:bg-[#F3EEF9] hover:text-[#241832]"
              aria-label="Tutup"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4 p-6 text-sm">
          <div className="flex items-center gap-2 rounded-xl bg-[#FAF7F1] px-3 py-2.5 text-xs text-[#6B5B7B]">
            <MapPin className="h-4 w-4 shrink-0 text-[#B5860F]" />
            <span className="truncate">{posyandu.alamat}</span>
            <a
              href={posyandu.lokasiUrl}
              target="_blank"
              rel="noreferrer"
              className="ml-auto flex shrink-0 items-center gap-1 font-semibold text-[#B5860F] hover:text-[#8B6508]"
            >
              Buka peta <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-[#FAF7F1] p-3 text-center">
              <p className="text-[10px] text-[#A99BC2]">Status SK</p>
              <div className="mt-1 flex justify-center">
                <StatusChip value={posyandu.statusSK} positive="Ada" />
              </div>
            </div>
            <div className="rounded-xl bg-[#FAF7F1] p-3 text-center">
              <p className="text-[10px] text-[#A99BC2]">Registrasi</p>
              <div className="mt-1 flex justify-center">
                <StatusChip value={posyandu.statusRegistrasi} />
              </div>
            </div>
            <div className="rounded-xl bg-[#FAF7F1] p-3 text-center">
              <p className="text-[10px] text-[#A99BC2]">SPM</p>
              <div className="mt-1 flex justify-center">
                <StatusChip value={posyandu.statusSPM} />
              </div>
            </div>
          </div>

          {(posyandu.statusSK === "Ada" || posyandu.statusRegistrasi === "Sudah") && (
            <div className="space-y-1.5 rounded-2xl border border-[#ECE4F2] p-4 text-xs text-[#6B5B7B]">
              {posyandu.statusSK === "Ada" && (
                <p>
                  <span className="font-semibold text-[#241832]">Nomor SK:</span> {posyandu.nomorSK}
                </p>
              )}
              {posyandu.statusRegistrasi === "Sudah" && (
                <p>
                  <span className="font-semibold text-[#241832]">Nomor Registrasi:</span> {posyandu.nomorRegistrasi}
                </p>
              )}
            </div>
          )}

          <div>
            <p className="mb-2 text-xs font-bold text-[#241832]">Pengurus & Kader ({kader.length})</p>
            <div className="space-y-1.5">
              {kader.map((k) => (
                <div key={k.id} className="flex items-center justify-between rounded-xl bg-[#FAF7F1] px-3 py-2 text-xs">
                  <span className="font-medium text-[#241832]">{k.nama}</span>
                  <span className="text-[#A99BC2]">{k.jabatan}</span>
                </div>
              ))}
              {kader.length === 0 && <p className="px-1 text-xs text-[#A99BC2]">Belum ada kader terdata.</p>}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalPopIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-overlay {
          animation: overlayFadeIn 0.2s ease both;
        }
        .modal-panel {
          animation: modalPopIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .modal-overlay,
          .modal-panel {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}