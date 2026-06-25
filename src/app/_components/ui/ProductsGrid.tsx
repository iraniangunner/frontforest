"use client";

// app/products/_components/CategoryToolbar.tsx
import { useState } from "react";
import {
  useSearchParams,
  useParams,
  useRouter,
  usePathname,
} from "next/navigation";
import { HiViewGrid, HiViewList, HiAdjustments, HiX } from "react-icons/hi";
import { useCategoryFilterPush } from "@/hooks/useCategoryFilterPush";

interface SiblingCategory {
  id: number;
  name: string;
  slug: string;
  products_count?: number;
}

interface Props {
  total: number;
  siblings: SiblingCategory[];
  parentSlug: string;
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

export default function CategoryToolbar({
  total,
  siblings,
  parentSlug,
  priceRange,
}: Props) {
  const sp = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { push, clearAll, isPending } = useCategoryFilterPush(parentSlug);

  const openDrawer = () => {
    const p = new URLSearchParams(sp.toString());
    p.set("filter", "1");
    router.push(`${pathname}?${p.toString()}`, { scroll: false });
  };

  const view = sp.get("view") || "grid";
  const sort = sp.get("sort") || "";
  const perPage = sp.get("per_page") || "12";

  const set = (key: string, val: string) => push({ [key]: val || null });

  const routeChild =
    typeof params?.child === "string" ? params.child : undefined;
  const querySlugs = sp.getAll("categories[]");
  const selected = Array.from(
    new Set(routeChild ? [routeChild, ...querySlugs] : querySlugs),
  );

  const getSiblingName = (slug: string) =>
    siblings.find((s) => s.slug === slug)?.name || slug;

  const chips: { key: string; value?: string; label: string }[] = [
    ...selected.map((v) => ({
      key: "categories[]",
      value: v,
      label: getSiblingName(v),
    })),
    sp.get("on_sale") === "1" ? { key: "on_sale", label: "تخفیف‌دار" } : null,
    sp.get("in_stock") === "1"
      ? { key: "in_stock", label: "موجود در انبار" }
      : null,
    sp.get("min_price") || sp.get("max_price")
      ? {
          key: "price",
          label: `${Number(sp.get("min_price") || priceRange.min).toLocaleString("fa-IR")} — ${Number(
            sp.get("max_price") || priceRange.max,
          ).toLocaleString("fa-IR")} ت`,
        }
      : null,
    sp.get("min_rating")
      ? { key: "min_rating", label: `${sp.get("min_rating")}★+` }
      : null,
  ].filter(Boolean) as { key: string; value?: string; label: string }[];

  const removeChip = (key: string, value?: string) => {
    if (key === "categories[]") {
      push({ "categories[]": selected.filter((v) => v !== value) });
    } else if (key === "price") {
      push({ min_price: null, max_price: null });
    } else {
      push({ [key]: null });
    }
  };

  return (
    <>
      <div
        className={`bg-white rounded-2xl border px-4 py-3 space-y-2.5 transition-colors ${
          isPending ? "border-[#DCACB1] bg-[#F6EAEB]/30" : "border-[#F0F0F0]"
        }`}
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-sm text-[#656565] flex items-center gap-2">
            <span className="font-semibold text-[#242424]">
              {total.toLocaleString("fa-IR")}
            </span>
            محصول
            {isPending && (
              <span className="w-4 h-4 border-2 border-[#DCACB1] border-t-[#A72F3B] rounded-full animate-spin inline-block" />
            )}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={sort}
              onChange={(e) => set("sort", e.target.value)}
              className="text-sm border border-[#EDEDED] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#A72F3B]/30 bg-white text-[#242424]"
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
              className="text-sm border border-[#EDEDED] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#A72F3B]/30 bg-white text-[#242424]"
            >
              {PER_PAGE.map((n) => (
                <option key={n} value={n}>
                  {n} عدد
                </option>
              ))}
            </select>

            <div className="flex border border-[#EDEDED] rounded-lg overflow-hidden">
              <button
                onClick={() => set("view", "grid")}
                className={`p-2 transition-colors ${view === "grid" ? "bg-[#A72F3B] text-white" : "bg-white text-[#AFAFAF] hover:text-[#242424]"}`}
              >
                <HiViewGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => set("view", "list")}
                className={`p-2 transition-colors ${view === "list" ? "bg-[#A72F3B] text-white" : "bg-white text-[#AFAFAF] hover:text-[#242424]"}`}
              >
                <HiViewList className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={openDrawer}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-[#EDEDED] rounded-lg text-sm text-[#656565] hover:border-[#DCACB1]"
            >
              <HiAdjustments className="w-4 h-4" />
              فیلتر
              {chips.length > 0 && (
                <span className="w-5 h-5 bg-[#A72F3B] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {chips.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#F0F0F0]">
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
