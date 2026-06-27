"use client";

// app/search/_components/SearchToolbar.tsx
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HiViewGrid, HiViewList, HiAdjustments, HiX } from "react-icons/hi";
import SearchFilter from "./SearchFilter";
import { useSearchFilterPush } from "@/hooks/useSearchFilterPush";

interface MenuChild {
  id: number;
  name: string;
  slug: string;
}

interface MenuParent {
  id: number;
  name: string;
  slug: string;
  children?: MenuChild[];
}

interface Props {
  total: number;
  priceRange: { min: number; max: number };
  menu: MenuParent[];
}

const SORT = [
  { value: "best-selling", label: "پرفروش‌ترین" },
  { value: "newest", label: "جدیدترین" },
  { value: "price-low", label: "ارزان‌ترین" },
  { value: "price-high", label: "گران‌ترین" },
  { value: "top-rated", label: "بهترین امتیاز" },
];

const PER_PAGE = [12, 24, 36, 48];

export default function SearchToolbar({ total, priceRange, menu }: Props) {
  const sp = useSearchParams();
  const { push, clearAll, isPending } = useSearchFilterPush();

  const router = useRouter();
  const pathname = usePathname();

  const openDrawer = () => {
    const p = new URLSearchParams(sp.toString());
    p.set("filter", "1");
    router.push(`${pathname}?${p.toString()}`, {
      scroll: false,
    });
  };

  const view = sp.get("view") || "grid";
  // پیش‌فرض پرفروش‌ترین
  const sort = sp.get("sort") || "best-selling";
  const perPage = sp.get("per_page") || "12";
  const q = sp.get("q") || "";

  const selectedCats = sp.getAll("categories[]");

  const catName = (slug: string) => {
    for (const p of menu) {
      if (p.slug === slug) return p.name;

      const child = p.children?.find((c) => c.slug === slug);
      if (child) return child.name;
    }

    return slug;
  };

  const set = (key: string, val: string) => push({ [key]: val || null });

  // وقتی «پرفروش‌ترین» انتخاب شد، sort را از URL پاک کن (چون پیش‌فرض است)؛
  // بقیه‌ی مقادیر صریح در URL نوشته می‌شوند.
  const setSort = (val: string) =>
    push({ sort: val === "best-selling" ? null : val });

  const chips: {
    key: string;
    value?: string;
    label: string;
  }[] = [
    q ? { key: "q", label: `جستجو: ${q}` } : null,

    ...selectedCats.map((slug) => ({
      key: "categories[]",
      value: slug,
      label: catName(slug),
    })),

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
      ? {
          key: "min_rating",
          label: `${sp.get("min_rating")}★+`,
        }
      : null,
  ].filter(Boolean) as {
    key: string;
    value?: string;
    label: string;
  }[];

  const removeChip = (key: string, value?: string) => {
    if (key === "price") {
      push({
        min_price: null,
        max_price: null,
      });
    } else if (key === "categories[]") {
      push({
        "categories[]": selectedCats.filter((s) => s !== value),
      });
    } else {
      push({
        [key]: null,
      });
    }
  };
  return (
    <>
      <div
        className={`bg-white rounded-2xl border px-4 py-3 space-y-3 transition-colors ${
          isPending ? "border-[#DCACB1] bg-[#F6EAEB]/30" : "border-[#F0F0F0]"
        }`}
      >
        {/* ── ردیف بالا: تعداد/نتایج + کنترل‌های نمایش ── */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-[#656565] flex items-center gap-2 min-w-0">
            {q ? (
              <>
                <span className="flex-shrink-0">نتایج برای</span>
                <span className="font-semibold text-[#242424] truncate max-w-[120px]">
                  {q}
                </span>
                <span className="flex-shrink-0">—</span>
              </>
            ) : null}
            <span className="font-semibold text-[#242424] flex-shrink-0">
              {total.toLocaleString("fa-IR")}
            </span>
            <span className="flex-shrink-0">محصول</span>
            {isPending && (
              <span className="w-4 h-4 border-2 border-[#DCACB1] border-t-[#A72F3B] rounded-full animate-spin inline-block flex-shrink-0" />
            )}
          </p>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* تعداد در صفحه */}
            <select
              value={perPage}
              onChange={(e) => set("per_page", e.target.value)}
              className="hidden sm:block text-sm border border-[#EDEDED] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#A72F3B]/30 bg-white text-[#242424]"
            >
              {PER_PAGE.map((n) => (
                <option key={n} value={n}>
                  {n} عدد
                </option>
              ))}
            </select>

            {/* grid / list */}
            <div className="flex border border-[#EDEDED] rounded-lg overflow-hidden">
              <button
                onClick={() => set("view", "grid")}
                className={`p-2 transition-colors ${
                  view === "grid"
                    ? "bg-[#A72F3B] text-white"
                    : "bg-white text-[#AFAFAF] hover:text-[#242424]"
                }`}
                aria-label="نمایش شبکه‌ای"
              >
                <HiViewGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => set("view", "list")}
                className={`p-2 transition-colors ${
                  view === "list"
                    ? "bg-[#A72F3B] text-white"
                    : "bg-white text-[#AFAFAF] hover:text-[#242424]"
                }`}
                aria-label="نمایش لیستی"
              >
                <HiViewList className="w-4 h-4" />
              </button>
            </div>

            {/* فیلتر موبایل */}
            <button
              onClick={openDrawer}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-[#EDEDED] rounded-lg text-sm text-[#656565] hover:border-[#DCACB1]"
            >
              <HiAdjustments className="w-4 h-4" />
              <span className="hidden xs:inline">فیلتر</span>
              {chips.length > 0 && (
                <span className="w-5 h-5 bg-[#A72F3B] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {chips.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── ردیف سورت افقی (اسکرول‌پذیر در موبایل) ── */}
        <div className="flex items-center gap-2 border-t border-[#F0F0F0] pt-3">
          <span className="text-xs text-[#898989] flex-shrink-0 hidden sm:inline">
            مرتب‌سازی:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1">
            {SORT.map((o) => {
              const active = sort === o.value;
              return (
                <button
                  key={o.value}
                  onClick={() => setSort(o.value)}
                  className={`flex-shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                    active
                      ? "bg-[#A72F3B] text-white"
                      : "bg-[#FAFAFA] text-[#656565] border border-[#EDEDED] hover:border-[#DCACB1] hover:text-[#A72F3B]"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── chips فیلترهای فعال ── */}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#F0F0F0]">
            {chips.map((c, i) => (
              <button
                key={i}
                onClick={() => removeChip(c.key, c.value)}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#F6EAEB] text-[#A72F3B] text-xs font-medium rounded-full border border-[#EDD5D8] hover:bg-[#EDD5D8] transition-colors"
              >
                {c.label} <HiX className="w-3 h-3" />
              </button>
            ))}
            <button
              onClick={() => clearAll()}
              className="px-2.5 py-1 text-xs text-[#C30000]/70 hover:text-[#C30000] font-medium"
            >
              پاک کردن همه
            </button>
          </div>
        )}
      </div>
    </>
  );
}
