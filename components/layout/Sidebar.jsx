// components/layout/Sidebar.jsx
import { Building2, LayoutDashboard, Users, LogOut } from "lucide-react";
import { KawungPattern } from "@/components/auth/BatikPattern";

export const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "posyandu", label: "Data Posyandu", icon: Building2 },
  { key: "kader", label: "Data Kader", icon: Users },
];

export default function Sidebar({ activeTab, onChangeTab, onLogout }) {
  return (
    <aside className="relative hidden w-60 shrink-0 flex-col overflow-hidden border-r border-[#ECE4F2] bg-white p-4 md:flex">
      <KawungPattern className="pointer-events-none absolute inset-x-0 top-0 h-40 w-full" color="#9C4A2B" opacity={0.05} />

      <div className="relative mb-6 flex items-center gap-2.5 px-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1B1033]">
          <Building2 className="h-4 w-4 text-[#E8C766]" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <p className="font-display truncate text-sm leading-tight text-[#241832]">Posyandu Kaltim</p>
          <p className="text-[11px] text-[#A99BC2]">6 Bidang SPM</p>
        </div>
      </div>

      <nav className="relative flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onChangeTab(item.key)}
              className={
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors " +
                (active ? "bg-[#1B1033] text-[#E8C766]" : "text-[#6B5B7B] hover:bg-[#FAF7F1] hover:text-[#241832]")
              }
            >
              <item.icon className="h-4 w-4" strokeWidth={1.9} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="relative mt-2 border-t border-[#ECE4F2] pt-2">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[#A99BC2] transition-colors hover:bg-[#C1485B]/10 hover:text-[#C1485B]"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.9} /> Keluar
        </button>
      </div>
    </aside>
  );
}