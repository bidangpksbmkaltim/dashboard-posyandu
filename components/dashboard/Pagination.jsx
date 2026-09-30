// components/dashboard/Pagination.jsx
import { ChevronLeft, ChevronRight } from "lucide-react";

function getPageNumbers(current, total) {
  const pages = [1];
  if (current - 1 > 2) pages.push("…");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
  if (current + 1 < total - 1) pages.push("…");
  if (total > 1) pages.push(total);
  return pages;
}

export default function Pagination({ page, totalItems, pageSize, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalPages <= 1) return null;

  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(totalItems, page * pageSize);
  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-[#ECE4F2] px-5 py-3.5 text-xs text-[#8B7F9C] sm:flex-row sm:items-center sm:justify-between">
      <span>
        Menampilkan <span className="font-semibold text-[#241832]">{start}–{end}</span> dari{" "}
        <span className="font-semibold text-[#241832]">{totalItems}</span> data
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Halaman sebelumnya"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-[#ECE4F2] text-[#8B7F9C] transition hover:border-[#CBA135] hover:text-[#B5860F] disabled:opacity-30 disabled:hover:border-[#ECE4F2] disabled:hover:text-[#8B7F9C]"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-1 text-[#C7BBD8]">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition " +
                (p === page ? "bg-[#1B1033] text-[#E8C766]" : "text-[#8B7F9C] hover:bg-[#F3EEF9]")
              }
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Halaman berikutnya"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-[#ECE4F2] text-[#8B7F9C] transition hover:border-[#CBA135] hover:text-[#B5860F] disabled:opacity-30 disabled:hover:border-[#ECE4F2] disabled:hover:text-[#8B7F9C]"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}