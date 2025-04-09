"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  hasPrev: boolean;
  hasNext: boolean;
  totalPages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  hasPrev,
  hasNext,
  totalPages,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  const renderPageNumbers = () => {
    if (!totalPages) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(
        <button
          key="1"
          onClick={() => createPageUrl(1)}
          className="hidden md:flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-50 border border-gray-200 transition-all"
        >
          1
        </button>
      );

      if (startPage > 2) {
        pages.push(
          <span
            key="start-ellipsis"
            className="hidden md:flex h-9 w-9 items-center justify-center text-gray-400"
          >
            ...
          </span>
        );
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => createPageUrl(i)}
          className={`hidden md:flex h-9 w-9 items-center justify-center rounded-md border transition-all ${
            currentPage === i
              ? "bg-cyan-600 text-white font-medium border-cyan-600 shadow-sm"
              : "text-gray-700 hover:bg-gray-50 border-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span
            key="end-ellipsis"
            className="hidden md:flex h-9 w-9 items-center justify-center text-gray-400"
          >
            ...
          </span>
        );
      }

      pages.push(
        <button
          key={totalPages}
          onClick={() => createPageUrl(totalPages)}
          className="hidden md:flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-50 border border-gray-200 transition-all"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="mt-2 -mb-2 flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <button
          className={`flex h-9 items-center gap-1 px-3 md:px-4 rounded-md transition-all border ${
            hasPrev
              ? "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              : "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
          }`}
          disabled={!hasPrev}
          onClick={() => createPageUrl(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline text-sm font-medium">Previous</span>
        </button>

        {renderPageNumbers()}

        <button
          className={`flex h-9 items-center gap-1 px-3 md:px-4 rounded-md transition-all border ${
            hasNext
              ? "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              : "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
          }`}
          disabled={!hasNext}
          onClick={() => createPageUrl(currentPage + 1)}
          aria-label="Next page"
        >
          <span className="hidden sm:inline text-sm font-medium">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {totalPages && (
        <div className="text-sm text-gray-500">
          Page <span className="font-medium text-gray-700">{currentPage}</span>{" "}
          of <span className="font-medium text-gray-700">{totalPages}</span>
        </div>
      )}
    </div>
  );
};

export default Pagination;
