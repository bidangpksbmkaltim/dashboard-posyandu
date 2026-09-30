// components/dashboard/DashboardClient.jsx
"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Download } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import Topbar from "@/components/layout/Topbar";
import ChartsSection from "./ChartsSection";
import FilterBar from "./FilterBar";
import RegionSummaryStrip from "./RegionSummaryStrip";
import PosyanduTable from "./PosyanduTable";
import KaderTable from "./KaderTable";
import DetailDrawer from "./DetailDrawer";
import ExportScopeModal from "./ExportScopeModal";

const SYNC_INTERVAL_MS = 60_000; // selaras sama `revalidate` di app/api/*/route.js

export default function DashboardClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [navOpen, setNavOpen] = useState(false);
  const [posyandu, setPosyandu] = useState([]);
  const [kader, setKader] = useState([]);
  const [syncedAt, setSyncedAt] = useState(null);
  const [pulse, setPulse] = useState(false);
  const [filters, setFilters] = useState({ kabFilter: "Semua", kecFilter: "Semua", statusFilter: "Semua", search: "" });
  const [page, setPage] = useState(1);
  const [kaderPage, setKaderPage] = useState(1);
  const [kaderSearch, setKaderSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [posyanduModalOpen, setPosyanduModalOpen] = useState(false);
  const [exportingPosyandu, setExportingPosyandu] = useState(false);
  const [kepengurusanModalOpen, setKepengurusanModalOpen] = useState(false);
  const [exportingKepengurusan, setExportingKepengurusan] = useState(false);

  const fetchData = useCallback(async () => {
    const [pRes, kRes] = await Promise.all([fetch("/api/posyandu"), fetch("/api/kader")]);
    const pJson = await pRes.json();
    const kJson = await kRes.json();
    setPosyandu(pJson.data);
    setKader(kJson.data);
    setSyncedAt(pJson.syncedAt);
    setPulse(true);
    setTimeout(() => setPulse(false), 900);
  }, []);

  useEffect(() => {
    fetchData();
    const t = setInterval(fetchData, SYNC_INTERVAL_MS);
    return () => clearInterval(t);
  }, [fetchData]);

  useEffect(() => setPage(1), [filters]);

  const filteredPosyandu = useMemo(
    () =>
      posyandu.filter((p) => {
        if (filters.kabFilter !== "Semua" && p.kabupaten !== filters.kabFilter) return false;
        if (filters.kecFilter !== "Semua" && p.kecamatan !== filters.kecFilter) return false;
        if (filters.statusFilter === "SK Ada" && p.statusSK !== "Ada") return false;
        if (filters.statusFilter === "SK Kosong" && p.statusSK !== "Tidak Ada") return false;
        if (filters.statusFilter === "Registrasi Sudah" && p.statusRegistrasi !== "Sudah") return false;
        if (filters.statusFilter === "Registrasi Belum" && p.statusRegistrasi !== "Belum") return false;
        if (filters.statusFilter === "SPM Belum" && p.statusSPM !== "Belum") return false;
        if (filters.search) {
          const q = filters.search.toLowerCase();
          if (!p.nama.toLowerCase().includes(q) && !p.desa.toLowerCase().includes(q)) return false;
        }
        return true;
      }),
    [posyandu, filters]
  );

  const kaderOfPosyandu = useCallback((nama) => {
    const normalize = (value) => value.trim().toLocaleLowerCase("id-ID").replace(/\s+/g, " ");
    const target = normalize(nama);
    return kader.filter((k) => {
      const value = normalize(k.posyandu);
      return value === target || value.split(/[—–-]/).some((part) => normalize(part) === target);
    });
  }, [kader]);

  // Label wilayah buat strip ringkasan di halaman Data Posyandu — dashboard &
  // strip ini sekarang SATU KESATUAN sama tabel: filter apa pun (wilayah,
  // status, pencarian) langsung ikut ngubah semuanya, bukan cuma tabel.
  const regionScopeLabel =
    filters.kabFilter === "Semua"
      ? "Seluruh Kaltim"
      : filters.kecFilter === "Semua"
      ? filters.kabFilter.replace("Kabupaten ", "").replace("Kota ", "")
      : filters.kecFilter;

  const filterScopeLabel = [
    regionScopeLabel,
    filters.statusFilter !== "Semua" ? filters.statusFilter : null,
    filters.search.trim() ? `Cari: ${filters.search.trim()}` : null,
  ]
    .filter(Boolean)
    .join(" • ");

  const filteredKader = useMemo(() => {
    if (!kaderSearch) return kader;
    const q = kaderSearch.toLowerCase();
    return kader.filter(
      (k) => k.nama.toLowerCase().includes(q) || k.posyandu.toLowerCase().includes(q) || k.jabatan.toLowerCase().includes(q)
    );
  }, [kader, kaderSearch]);

  useEffect(() => setKaderPage(1), [kaderSearch]);

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
  }

  async function handleExportPosyandu(kab) {
    if (exportingPosyandu) return;
    setExportingPosyandu(true);
    try {
      // Lazy-load: exceljs lumayan berat, jadi baru diambil pas tombol ini
      // beneran diklik, bukan ikut termuat begitu dashboard dibuka.
      const { downloadPosyanduReport } = await import("@/lib/exportReport");
      // Sengaja pakai `posyandu` (data mentah, belum kena chip status/pencarian)
      // dipersempit CUMA berdasarkan Kabupaten/Kota yang dipilih di pop-up —
      // biar laporan selalu isi semua status, apa pun yang lagi difilter di layar.
      const scoped = kab === "Semua" ? posyandu : posyandu.filter((p) => p.kabupaten === kab);
      await downloadPosyanduReport({
        posyanduFiltered: scoped,
        kabFilter: kab,
        kaderCountOf: (nama) => kaderOfPosyandu(nama).length,
      });
      setPosyanduModalOpen(false);
    } finally {
      setExportingPosyandu(false);
    }
  }

  async function handleExportKepengurusan(kab) {
    if (exportingKepengurusan) return;
    setExportingKepengurusan(true);
    try {
      const { downloadKepengurusanReport } = await import("@/lib/exportKepengurusan");
      await downloadKepengurusanReport({
        kabupaten: kab,
        posyanduAll: posyandu,
        kaderOfPosyandu,
      });
      setKepengurusanModalOpen(false);
    } finally {
      setExportingKepengurusan(false);
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F7F3EC] text-[#241832]">
      <Sidebar activeTab={activeTab} onChangeTab={setActiveTab} onLogout={handleLogout} />
      <MobileNav open={navOpen} activeTab={activeTab} onChangeTab={setActiveTab} onClose={() => setNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar activeTab={activeTab} syncedAt={syncedAt} pulse={pulse} onOpenMobileNav={() => setNavOpen(true)} onSyncNow={fetchData} />

        <main className="flex-1 space-y-6 overflow-y-auto p-4 md:p-6">
          {(activeTab === "dashboard" || activeTab === "posyandu") && (
            <FilterBar
              {...filters}
              resultCount={filteredPosyandu.length}
              onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
              onExport={() => setPosyanduModalOpen(true)}
              exporting={exportingPosyandu}
            />
          )}

          {activeTab === "dashboard" && (
            <ChartsSection
              posyandu={filteredPosyandu}
              kabFilter={filters.kabFilter}
              scopeLabel={filterScopeLabel}
              onDrillDown={(kab) => setFilters((f) => ({ ...f, kabFilter: kab, kecFilter: "Semua" }))}
              onResetDrillDown={() => setFilters((f) => ({ ...f, kabFilter: "Semua", kecFilter: "Semua" }))}
            />
          )}

          {(activeTab === "dashboard" || activeTab === "posyandu") && (
            <div className="rounded-3xl border border-[#ECE4F2] bg-white shadow-sm">
              <RegionSummaryStrip posyanduInRegion={filteredPosyandu} scopeLabel={regionScopeLabel} />
              <PosyanduTable rows={filteredPosyandu} kaderCountOf={(nama) => kaderOfPosyandu(nama).length} page={page} onPageChange={setPage} onSelect={setSelected} />
            </div>
          )}

          {activeTab === "kader" && (
            <div className="rounded-3xl border border-[#ECE4F2] bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-[#ECE4F2] p-4 md:flex-row md:items-center md:justify-between md:p-5">
                <p className="text-sm font-bold text-[#241832]">
                  {kaderSearch
                    ? `${filteredKader.length} dari ${kader.length} kader ditemukan`
                    : `Semua Kader Terdata (${kader.length} orang)`}
                </p>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#B3A6C4]" />
                    <input
                      value={kaderSearch}
                      onChange={(e) => setKaderSearch(e.target.value)}
                      placeholder="Cari nama / posyandu / jabatan"
                      className="w-full rounded-xl border border-[#ECE4F2] py-2 pl-8 pr-3 text-xs outline-none focus:border-[#CBA135] sm:w-64"
                    />
                  </div>
                  <button
                    onClick={() => setKepengurusanModalOpen(true)}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#1B1033] px-3 py-2 text-xs font-semibold text-[#FBF6EC] transition hover:bg-[#2A1A4A]"
                  >
                    <Download className="h-3.5 w-3.5" /> Laporan Kepengurusan
                  </button>
                </div>
              </div>
              <KaderTable rows={filteredKader} page={kaderPage} onPageChange={setKaderPage} />
            </div>
          )}
        </main>
      </div>

      <DetailDrawer posyandu={selected} kader={selected ? kaderOfPosyandu(selected.nama) : []} onClose={() => setSelected(null)} />

      <ExportScopeModal
        open={posyanduModalOpen}
        onClose={() => setPosyanduModalOpen(false)}
        onConfirm={handleExportPosyandu}
        defaultKab={filters.kabFilter}
        allowSemua
        title="Unduh Laporan Posyandu"
        description="Laporan selalu isi semua status (Sudah & Belum), lepas dari filter yang lagi aktif di tabel."
        loading={exportingPosyandu}
      />

      <ExportScopeModal
        open={kepengurusanModalOpen}
        onClose={() => setKepengurusanModalOpen(false)}
        onConfirm={handleExportKepengurusan}
        defaultKab={filters.kabFilter}
        allowSemua={false}
        title="Unduh Laporan Kepengurusan"
        description="1 file per Kabupaten/Kota — isinya 1 sheet per Kecamatan, dikelompokkan Desa → Posyandu → roster pengurus."
        loading={exportingKepengurusan}
      />

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");
        .font-display {
          font-family: "Fraunces", serif;
          font-weight: 560;
          letter-spacing: -0.01em;
        }
        body {
          font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
        }
      `}</style>
    </div>
  );
}