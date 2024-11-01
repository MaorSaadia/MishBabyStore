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

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => createPageUrl(i)}
          className={`hidden md:flex h-10 w-10 items-center justify-center rounded-md transition-colors
            ${
              currentPage === i
                ? "bg-cyan-600 text-white font-medium hover:bg-cyan-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="mt-12 flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <button
          className={`flex h-10 items-center gap-1 px-4 rounded-md transition-colors
            ${
              hasPrev
                ? "bg-cyan-600 text-white hover:bg-cyan-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          disabled={!hasPrev}
          onClick={() => createPageUrl(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {renderPageNumbers()}

        <button
          className={`flex h-10 items-center gap-1 px-4 rounded-md transition-colors
            ${
              hasNext
                ? "bg-cyan-600 text-white hover:bg-cyan-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          disabled={!hasNext}
          onClick={() => createPageUrl(currentPage + 1)}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {totalPages && (
        <div className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </div>
      )}
    </div>
  );
};

export default Pagination;
