"use client";

import { HiChevronRight, HiChevronLeft, HiDotsHorizontal } from "react-icons/hi";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  lastPage,
  onPageChange,
}: PaginationProps) {
  if (lastPage <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    const halfShow = Math.floor(showPages / 2);

    let start = Math.max(1, currentPage - halfShow);
    let end = Math.min(lastPage, currentPage + halfShow);

    if (currentPage <= halfShow) {
      end = Math.min(lastPage, showPages);
    }
    if (currentPage > lastPage - halfShow) {
      start = Math.max(1, lastPage - showPages + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < lastPage) {
      if (end < lastPage - 1) pages.push("...");
      pages.push(lastPage);
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Page Info */}
      <p className="text-sm text-gray-500">
        صفحه{" "}
        <span className="font-bold text-gray-700">{currentPage.toLocaleString("fa-IR")}</span>
        {" "}از{" "}
        <span className="font-bold text-gray-700">{lastPage.toLocaleString("fa-IR")}</span>
      </p>

      {/* Pagination Controls */}
      <div className="inline-flex items-center gap-1 p-1.5 bg-white rounded-2xl border border-gray-200 shadow-sm">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200"
        >
          <HiChevronRight className="w-5 h-5" />
          <span className="hidden sm:inline">قبلی</span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span
                key={`dots-${index}`}
                className="w-10 h-10 flex items-center justify-center text-gray-400"
              >
                <HiDotsHorizontal className="w-5 h-5" />
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`relative min-w-[40px] h-10 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  currentPage === page
                    ? "text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {/* Active Background */}
                {currentPage === page && (
                  <span className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl shadow-lg shadow-emerald-500/30" />
                )}
                <span className="relative z-10">{page.toLocaleString("fa-IR")}</span>
              </button>
            )
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200"
        >
          <span className="hidden sm:inline">بعدی</span>
          <HiChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Jump (for many pages) */}
      {lastPage > 10 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">رفتن به صفحه:</span>
          <input
            type="number"
            min={1}
            max={lastPage}
            placeholder="..."
            className="w-16 px-3 py-1.5 text-sm text-center border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = parseInt((e.target as HTMLInputElement).value);
                if (value >= 1 && value <= lastPage) {
                  onPageChange(value);
                  (e.target as HTMLInputElement).value = "";
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
}