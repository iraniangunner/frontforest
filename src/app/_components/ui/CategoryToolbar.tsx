"use client";

// app/_components/ui/CategoryToolbar.tsx
import { useParams } from "next/navigation";
import { HiViewGrid, HiViewList, HiAdjustments, HiX } from "react-icons/hi";
import { useFilter } from "./FilterProvider";

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
  { value: "best-selling", label: "پرفروش‌ترین" },
  { value: "newest", label: "جدیدترین" },
  { value: "price-low", label: "ارزان‌ترین" },
  { value: "price-high", label: "گران‌ترین" },
  { value: "top-rated", label: "بهترین امتیاز" },
];

const PER_PAGE = [12, 24, 36, 48];

export default function CategoryToolbar({
  total,
  siblings,
  priceRange,
}: Props) {
  const params = useParams();
  const { get, getAll, push, clearAll, isPending, openDrawer } = useFilter();

  const view = get("view") || "grid";
  const sort = get("sort") || "best-selling";
  const perPage = get("per_page") || "12";

  const setSort = (val: string) =>
    push({ sort: val === "best-selling" ? null : val });

  const set = (key: string, val: string) => push({ [key]: val || null });

  const routeChild =
    typeof params?.child === "string" ? params.child : undefined;
  const querySlugs = getAll("categories[]");
  const selected = Array.from(
    new Set(routeChild ? [routeChild, ...querySlugs] : querySlugs)
  );

  const getSiblingName = (slug: string) =>
    siblings.find((s) => s.slug === slug)?.name || slug;

  const chips: { key: string; value?: string; label: string }[] = [
    ...selected.map((v) => ({
      key: "categories[]",
      value: v,
      label: getSiblingName(v),
    })),
    get("on_sale") === "1" ? { key: "on_sale", label: "تخفیف‌دار" } : null,
    get("in_stock") === "1"
      ? { key: "in_stock", label: "موجود در انبار" }
      : null,
    get("min_price") || get("max_price")
      ? {
          key: "price",
          label: `${Number(get("min_price") || priceRange.min).toLocaleString(
            "fa-IR"
          )} — ${Number(get("max_price") || priceRange.max).toLocaleString(
            "fa-IR"
          )} ت`,
        }
      : null,
    get("min_rating")
      ? { key: "min_rating", label: `${get("min_rating")}★+` }
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
    <div
      className={`bg-white rounded-2xl border px-4 py-3 space-y-3 transition-colors ${
        isPending ? "border-[#DCACB1] bg-[#F6EAEB]/30" : "border-[#F0F0F0]"
      }`}
    >
      {/* ── ردیف بالا ── */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[#656565] flex items-center gap-2 flex-shrink-0">
          <span className="font-semibold text-[#242424]">
            {total.toLocaleString("fa-IR")}
          </span>
          محصول
          {isPending && (
            <span className="w-4 h-4 border-2 border-[#DCACB1] border-t-[#A72F3B] rounded-full animate-spin inline-block" />
          )}
        </p>

        <div className="flex items-center gap-2 flex-shrink-0">
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

          {/* فیلتر موبایل — از طریق context باز می‌شود (نه URL) */}
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

      {/* ── سورت افقی ── */}
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

      {/* ── chips ── */}
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
  );
}
