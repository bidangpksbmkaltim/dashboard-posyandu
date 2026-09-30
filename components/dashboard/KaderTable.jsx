// components/dashboard/KaderTable.jsx
import Pagination from "./Pagination";

const PAGE_SIZE = 25;

export default function KaderTable({ rows, page, onPageChange }) {
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[#A99BC2]">
              <th className="px-5 py-3 font-semibold">Nama</th>
              <th className="px-3 py-3 font-semibold">Posyandu</th>
              <th className="px-3 py-3 font-semibold">Jabatan</th>
              <th className="px-3 py-3 font-semibold">Usia</th>
              <th className="px-5 py-3 font-semibold">Pendidikan</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((k) => (
              <tr key={k.id} className="border-t border-[#F3EEF9] transition-colors hover:bg-[#FAF7F1]">
                <td className="px-5 py-2.5 font-semibold text-[#241832]">{k.nama}</td>
                <td className="px-3 py-2.5 text-[#6B5B7B]">{k.posyandu}</td>
                <td className="px-3 py-2.5 text-[#6B5B7B]">{k.jabatan}</td>
                <td className="px-3 py-2.5 text-[#6B5B7B]">{k.usia}</td>
                <td className="px-5 py-2.5 text-[#6B5B7B]">{k.pendidikan}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-[#A99BC2]">
                  Belum ada data kader.
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