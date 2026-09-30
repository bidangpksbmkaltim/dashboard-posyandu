// components/layout/Topbar.jsx
import { Menu, RefreshCw, UserCircle2 } from "lucide-react";

const TITLES = { dashboard: "Ringkasan Monitoring", posyandu: "Data Posyandu", kader: "Data Kader" };

export default function Topbar({ activeTab, syncedAt, pulse, onOpenMobileNav, onSyncNow }) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[#ECE4F2] bg-white px-4 py-3 md:px-6">
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-1 text-[#6B5B7B] transition-colors hover:bg-[#FAF7F1] md:hidden"
          onClick={onOpenMobileNav}
          aria-label="Buka menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h2 className="font-display text-base text-[#241832] md:text-lg">{TITLES[activeTab]}</h2>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0D9488]/10 px-2 py-0.5 text-[11px] font-medium text-[#0D9488]">
              <span className="relative flex h-1.5 w-1.5">
                {pulse && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0D9488] opacity-75" />}
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#0D9488]" />
              </span>
              Live
            </span>
            <span className="text-[11px] text-[#A99BC2]">
              diperbarui {syncedAt ? new Date(syncedAt).toLocaleTimeString("id-ID") : "..."}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onSyncNow}
          className="hidden items-center gap-1.5 rounded-xl border border-[#ECE4F2] px-3 py-2 text-xs font-medium text-[#6B5B7B] transition-colors hover:border-[#CBA135] hover:text-[#B5860F] sm:flex"
        >
          <RefreshCw className={"h-3.5 w-3.5 " + (pulse ? "animate-spin" : "")} /> Sync sekarang
        </button>
        <div className="flex items-center gap-2 rounded-xl bg-[#FAF7F1] px-2.5 py-1.5">
          <UserCircle2 className="h-5 w-5 text-[#A99BC2]" />
          <span className="hidden text-xs font-semibold text-[#241832] sm:inline">Bu Vio</span>
        </div>
      </div>
    </header>
  );
}