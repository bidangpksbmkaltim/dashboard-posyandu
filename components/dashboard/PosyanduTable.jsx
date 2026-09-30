// components/dashboard/PosyanduTable.jsx
import { ChevronRight } from "lucide-react";
import { StatusChip } from "./StatusChip";
import Pagination from "./Pagination";

const PAGE_SIZE = 25;

export default function PosyanduTable({ rows, kaderCountOf, page, onPageChange, onSelect }) {
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[#A99BC2]">
              <th className="px-5 py-3 font-semibold">Nama Posyandu</th>
              <th className="px-3 py-3 font-semibold">Kab/Kota</th>
              <th className="px-3 py-3 font-semibold">Kecamatan</th>
              <th className="px-3 py-3 font-semibold">Desa</th>
              <th className="px-3 py-3 font-semibold">SK</th>
              <th className="px-3 py-3 font-semibold">Registrasi</th>
              <th className="px-3 py-3 font-semibold">SPM</th>
              <th className="px-3 py-3 font-semibold">Kader</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {pageRows.map((p) => (
              <tr
                key={p.id}
                onClick={() => onSelect(p)}
                className="cursor-pointer border-t border-[#F3EEF9] transition-colors hover:bg-[#FAF7F1]"
              >
                <td className="px-5 py-3 font-semibold text-[#241832]">{p.nama}</td>
                <td className="px-3 py-3 text-[#6B5B7B]">{p.kabupaten.replace("Kabupaten ", "").replace("Kota ", "")}</td>
                <td className="px-3 py-3 text-[#6B5B7B]">{p.kecamatan}</td>
                <td className="px-3 py-3 text-[#6B5B7B]">{p.desa}</td>
                <td className="px-3 py-3">
                  <StatusChip value={p.statusSK} positive="Ada" />
                </td>
                <td className="px-3 py-3">
                  <StatusChip value={p.statusRegistrasi} />
                </td>
                <td className="px-3 py-3">
                  <StatusChip value={p.statusSPM} />
                </td>
                <td className="px-3 py-3 text-[#6B5B7B]">{kaderCountOf(p.nama)} orang</td>
                <td className="px-5 py-3 text-right">
                  <ChevronRight className="ml-auto h-4 w-4 text-[#C7BBD8]" />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-5 py-10 text-center text-[#A99BC2]">
                  Tidak ada posyandu yang cocok dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalItems={rows.length} pageSize={PAGE_SIZE} onPageChange={onPageChange} />
    </div>
  );
}