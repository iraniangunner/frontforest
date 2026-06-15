"use client";

// app/search/_components/SearchToolbar.tsx
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { HiViewGrid, HiViewList, HiAdjustments, HiX } from "react-icons/hi";
import SearchFilter from "./SearchFilter";
import { useSearchFilterPush } from "@/hooks/useSearchFilterPush";

interface Props {
  total: number;
  priceRange: { min: number; max: number };
}

const SORT = [
  { value: "", label: "پرفروش‌ترین" },
  { value: "newest", label: "جدیدترین" },
  { value: "price-low", label: "ارزان‌ترین" },
  { value: "price-high", label: "گران‌ترین" },
  { value: "top-rated", label: "بهترین امتیاز" },
];

const PER_PAGE = [12, 24, 36, 48];

export default function SearchToolbar({ total, priceRange }: Props) {
  const sp = useSearchParams();
  const { push, clearAll, isPending } = useSearchFilterPush();
  const [drawer, setDrawer] = useState(false);

  const view = sp.get("view") || "grid";
  const sort = sp.get("sort") || "";
  const perPage = sp.get("per_page") || "12";
  const q = sp.get("q") || "";

  const set = (key: string, val: string) => push({ [key]: val || null });

  const chips: { key: string; label: string }[] = [
    sp.get("on_sale") === "1" ? { key: "on_sale", label: "تخفیف‌دار" } : null,
    sp.get("in_stock") === "1"
      ? { key: "in_stock", label: "موجود در انبار" }
      : null,
    sp.get("min_price") || sp.get("max_price")
      ? {
          key: "price",
          label: `${Number(
            sp.get("min_price") || priceRange.min
          ).toLocaleString("fa-IR")} — ${Number(
            sp.get("max_price") || priceRange.max
          ).toLocaleString("fa-IR")} ت`,
        }
      : null,
    sp.get("min_rating")
      ? { key: "min_rating", label: `${sp.get("min_rating")}★+` }
      : null,
  ].filter(Boolean) as { key: string; label: string }[];

  const removeChip = (key: string) => {
    if (key === "price") {
      push({ min_price: null, max_price: null });
    } else {
      push({ [key]: null });
    }
  };

  return (
    <>
      <div
        className={`bg-white rounded-xl border px-4 py-3 space-y-2.5 transition-colors ${
          isPending ? "border-teal-200 bg-teal-50/30" : "border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            {q ? (
              <>
                نتایج برای{" "}
                <span className="font-semibold text-gray-900">"{q}"</span> —{" "}
              </>
            ) : null}
            <span className="font-semibold text-gray-900">
              {total.toLocaleString("fa-IR")}
            </span>
            محصول
            {isPending && (
              <span className="w-4 h-4 border-2 border-teal-300 border-t-teal-600 rounded-full animate-spin inline-block" />
            )}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={sort}
              onChange={(e) => set("sort", e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              {SORT.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <select
              value={perPage}
              onChange={(e) => set("per_page", e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              {PER_PAGE.map((n) => (
                <option key={n} value={n}>
                  {n} عدد
                </option>
              ))}
            </select>

            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => set("view", "grid")}
                className={`p-2 transition-colors ${
                  view === "grid"
                    ? "bg-teal-600 text-white"
                    : "bg-white text-gray-400 hover:text-gray-700"
                }`}
              >
                <HiViewGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => set("view", "list")}
                className={`p-2 transition-colors ${
                  view === "list"
                    ? "bg-teal-600 text-white"
                    : "bg-white text-gray-400 hover:text-gray-700"
                }`}
              >
                <HiViewList className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setDrawer(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-gray-300"
            >
              <HiAdjustments className="w-4 h-4" />
              فیلتر
              {chips.length > 0 && (
                <span className="w-5 h-5 bg-teal-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {chips.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* chips */}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
            {chips.map((c, i) => (
              <button
                key={i}
                onClick={() => removeChip(c.key)}
                className="flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full border border-teal-100 hover:bg-teal-100 transition-colors"
              >
                {c.label} <HiX className="w-3 h-3" />
              </button>
            ))}
            <button
              onClick={() => clearAll()}
              className="px-2.5 py-1 text-xs text-red-400 hover:text-red-600 font-medium"
            >
              پاک کردن همه
            </button>
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 flex lg:hidden" dir="rtl">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawer(false)}
          />
          <div className="relative mr-auto w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col">
            <SearchFilter
              priceRange={priceRange}
              isMobile
              onClose={() => setDrawer(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
