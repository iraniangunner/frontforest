"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HiViewGrid, HiViewList, HiFilter } from "react-icons/hi";
import FilterSidebar from "./FilterSidebar";
import { Category, Tag } from "@/types";

// ============ Sort Select ============
const SORT_OPTIONS = [
  { value: "best-selling", label: "پرفروش‌ترین" },
  { value: "newest", label: "جدیدترین" },
  { value: "top-rated", label: "بالاترین امتیاز" },
  { value: "price-low", label: "ارزان‌ترین" },
  { value: "price-high", label: "گران‌ترین" },
];

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "best-selling";

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (sort && sort !== "best-selling") {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }

    // Reset page
    params.delete("page");

    const queryString = params.toString();
    router.push(queryString ? `/components?${queryString}` : "/components", {
      scroll: false,
    });
  };

  return (
    <select
      value={currentSort}
      onChange={(e) => handleSortChange(e.target.value)}
      className="px-3 py-2 bg-gray-100 border-0 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

// ============ Per Page Select ============
const PER_PAGE_OPTIONS = [12, 24, 36, 48];

export function PerPageSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPerPage = parseInt(searchParams.get("per_page") || "12");

  const handlePerPageChange = (perPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (perPage !== 12) {
      params.set("per_page", String(perPage));
    } else {
      params.delete("per_page");
    }

    // Reset page
    params.delete("page");

    const queryString = params.toString();
    router.push(queryString ? `/components?${queryString}` : "/components", {
      scroll: false,
    });
  };

  return (
    <select
      value={currentPerPage}
      onChange={(e) => handlePerPageChange(parseInt(e.target.value))}
      className="px-3 py-2 bg-gray-100 border-0 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
    >
      {PER_PAGE_OPTIONS.map((num) => (
        <option key={num} value={num}>
          {num} در صفحه
        </option>
      ))}
    </select>
  );
}

// ============ View Toggle ============
export function ViewToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const view = (searchParams.get("view") as "grid" | "list") || "grid";

  const handleViewChange = (newView: "grid" | "list") => {
    const params = new URLSearchParams(searchParams.toString());

    if (newView === "list") {
      params.set("view", "list");
    } else {
      params.delete("view");
    }

    const queryString = params.toString();
    router.push(queryString ? `/components?${queryString}` : "/components", {
      scroll: false,
    });
  };

  return (
    <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => handleViewChange("grid")}
        className={`p-2 rounded-md transition-colors ${
          view === "grid"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <HiViewGrid className="w-5 h-5" />
      </button>
      <button
        onClick={() => handleViewChange("list")}
        className={`p-2 rounded-md transition-colors ${
          view === "list"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <HiViewList className="w-5 h-5" />
      </button>
    </div>
  );
}

// ============ Mobile Filter Button & Drawer ============
interface MobileFilterButtonProps {
  categories: Category[];
  tags: {
    frameworks: Tag[];
    styling: Tag[];
    features: Tag[];
  };
}

export function MobileFilterButton({ categories, tags }: MobileFilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <HiFilter className="w-5 h-5" />
        فیلترها
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white shadow-xl">
            <FilterSidebar
              categories={categories}
              tags={tags}
              onClose={() => setIsOpen(false)}
              isMobile
            />
          </div>
        </div>
      )}
    </>
  );
}