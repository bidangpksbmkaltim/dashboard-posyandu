// components/layout/MobileNav.jsx
"use client";
import { Building2, X } from "lucide-react";
import { NAV_ITEMS } from "./Sidebar";
import { KawungPattern } from "@/components/auth/BatikPattern";

export default function MobileNav({ open, activeTab, onChangeTab, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex md:hidden">
      <div className="mobilenav-overlay flex-1 bg-[#1B1033]/40" onClick={onClose} />

      <div className="mobilenav-panel relative w-64 overflow-hidden bg-white p-4 shadow-2xl">
        <KawungPattern className="pointer-events-none absolute inset-x-0 top-0 h-40 w-full" color="#9C4A2B" opacity={0.05} />

        <div className="relative mb-6 flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1B1033]">
              <Building2 className="h-4 w-4 text-[#E8C766]" strokeWidth={1.75} />
            </div>
            <p className="font-display truncate text-sm text-[#241832]">Posyandu Kaltim</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#A99BC2] transition-colors hover:bg-[#FAF7F1] hover:text-[#241832]"
            aria-label="Tutup menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="relative flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  onChangeTab(item.key);
                  onClose();
                }}
                className={
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors " +
                  (active ? "bg-[#1B1033] text-[#E8C766]" : "text-[#6B5B7B] hover:bg-[#FAF7F1] hover:text-[#241832]")
                }
              >
                <item.icon className="h-4 w-4" strokeWidth={1.9} /> {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <style jsx global>{`
        @keyframes mobilenavOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes mobilenavPanelIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .mobilenav-overlay {
          animation: mobilenavOverlayIn 0.25s ease both;
        }
        .mobilenav-panel {
          animation: mobilenavPanelIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .mobilenav-overlay,
          .mobilenav-panel {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}