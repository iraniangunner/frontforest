"use client";

// app/products/_components/ProductsFilter.tsx
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  HiChevronDown,
  HiCheck,
  HiX,
  HiSearch,
  HiTag,
  HiShoppingBag,
  HiStar,
  HiAdjustments,
} from "react-icons/hi";
import PriceRangeSlider from "./PriceRangeSlider";
import { useFilterPush } from "../../../hooks/useFilterPush";

interface CategoryChild {
  id: number;
  name: string;
  slug: string;
  products_count?: number;
}
interface Category {
  id: number;
  name: string;
  slug: string;
  products_count?: number;
  children?: CategoryChild[];
}

interface Props {
  categories: Category[];
  priceRange: { min: number; max: number };
  onClose?: () => void;
  isMobile?: boolean;
}

export default function ProductsFilter({
  categories,
  priceRange,
  onClose,
  isMobile = false,
}: Props) {
  const sp = useSearchParams();
  const { push, clearAll } = useFilterPush();

  const [openSecs, setOpenSecs] = useState<string[]>([
    "status",
    "categories",
    "price",
    "rating",
  ]);
  const [catSearch, setCatSearch] = useState("");

  // ── URL state ──
  const selectedCats = sp.getAll("categories[]");
  const on_sale = sp.get("on_sale") === "1";
  const in_stock = sp.get("in_stock") === "1";
  const min_price = +(sp.get("min_price") || priceRange.min);
  const max_price = +(sp.get("max_price") || priceRange.max);
  const min_rating = sp.get("min_rating") || "";

  const toggleCat = (slug: string) =>
    push({
      "categories[]": selectedCats.includes(slug)
        ? selectedCats.filter((s) => s !== slug)
        : [...selectedCats, slug],
    });

  const toggleParent = (childSlugs: string[]) => {
    const allSel = childSlugs.every((s) => selectedCats.includes(s));
    push({
      "categories[]": allSel
        ? selectedCats.filter((s) => !childSlugs.includes(s))
        : Array.from(new Set([...selectedCats, ...childSlugs])), // ← fix
    });
  };

  const toggleBool = (k: "on_sale" | "in_stock", cur: boolean) =>
    push({ [k]: cur ? null : "1" });

  const toggleRating = (r: number) =>
    push({ min_rating: min_rating === String(r) ? null : String(r) });

  const handlePrice = (min: number, max: number) =>
    push({
      min_price: min > priceRange.min ? String(min) : null,
      max_price: max < priceRange.max ? String(max) : null,
    });

  const removeChip = (key: string, value?: string) => {
    if (key === "categories[]") {
      push({ "categories[]": selectedCats.filter((s) => s !== value) });
    } else if (key === "price") {
      push({ min_price: null, max_price: null });
    } else {
      push({ [key]: null });
    }
  };

  // ── active chips ──
  const chips: { key: string; value?: string; label: string }[] = [
    ...selectedCats.map((slug) => {
      let label = slug;
      for (const cat of categories) {
        if (cat.slug === slug) {
          label = cat.name;
          break;
        }
        const child = cat.children?.find((c) => c.slug === slug);
        if (child) {
          label = child.name;
          break;
        }
      }
      return { key: "categories[]", value: slug, label };
    }),
    on_sale ? { key: "on_sale", label: "تخفیف‌دار" } : null,
    in_stock ? { key: "in_stock", label: "موجود در انبار" } : null,
    min_price > priceRange.min || max_price < priceRange.max
      ? {
          key: "price",
          label: `${min_price.toLocaleString("fa-IR")} — ${max_price.toLocaleString("fa-IR")} ت`,
        }
      : null,
    min_rating ? { key: "min_rating", label: `${min_rating}★+` } : null,
  ].filter(Boolean) as { key: string; value?: string; label: string }[];

  const activeCount = chips.length;
  const togSec = (id: string) =>
    setOpenSecs((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );
  const isOpen = (id: string) => openSecs.includes(id);

  // ── grouped ──
  const grouped = categories.map((cat) => ({
    cat,
    children: cat.children?.length ? cat.children : ([] as CategoryChild[]),
  }));

  const allItems = grouped.flatMap((g) => [
    {
      id: g.cat.id,
      name: g.cat.name,
      slug: g.cat.slug,
      parentName: null as string | null,
    },
    ...g.children.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      parentName: g.cat.name,
    })),
  ]);
  const searchResults = catSearch
    ? allItems.filter((i) => i.name.includes(catSearch))
    : [];

  // ── sub-components ──
  const SecHead = ({
    id,
    label,
    extra,
  }: {
    id: string;
    label: string;
    extra?: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={() => togSec(id)}
      className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-800">{label}</span>
        {extra}
      </div>
      <HiChevronDown
        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen(id) ? "rotate-180" : ""}`}
      />
    </button>
  );

  const ChildRow = ({
    slug,
    name,
    count,
    indent = false,
  }: {
    slug: string;
    name: string;
    count?: number;
    indent?: boolean;
  }) => {
    const checked = selectedCats.includes(slug);
    return (
      <button
        type="button"
        onClick={() => toggleCat(slug)}
        className={`flex items-center justify-between w-full py-2 rounded-lg hover:bg-gray-50 transition-colors group ${indent ? "px-2" : "px-1"}`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
              checked
                ? "bg-teal-600 border-teal-600"
                : "border-gray-300 group-hover:border-gray-400"
            }`}
          >
            {checked && <HiCheck className="w-2.5 h-2.5 text-white" />}
          </span>
          <span
            className={`text-sm transition-colors ${checked ? "text-gray-900 font-medium" : "text-gray-600"}`}
          >
            {name}
          </span>
        </div>
        {count !== undefined && (
          <span className="text-xs text-gray-400">
            {count.toLocaleString("fa-IR")}
          </span>
        )}
      </button>
    );
  };

  return (
    <div
      className={`bg-white ${
        isMobile
          ? "flex flex-col h-full"
          : "rounded-xl border border-gray-200 overflow-hidden"
      }`}
      dir="rtl"
    >
      {/* هدر */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <HiAdjustments className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-900">فیلترها</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 bg-teal-600 text-white text-xs font-bold rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => clearAll()}
              className="text-xs text-teal-600 hover:text-teal-800 font-medium transition-colors"
            >
              حذف همه
            </button>
          )}
          {isMobile && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
            >
              <HiX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* chips */}
      {chips.length > 0 && (
        <div className="px-3 py-2 border-b border-gray-100 flex flex-wrap gap-1.5">
          {chips.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => removeChip(c.key, c.value)}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 border border-gray-200 transition-colors"
            >
              {c.label}
              <HiX className="w-3 h-3 opacity-60" />
            </button>
          ))}
        </div>
      )}

      <div className={isMobile ? "flex-1 overflow-y-auto" : ""}>
        {/* وضعیت */}
        <div className="border-b border-gray-100">
          <SecHead id="status" label="وضعیت" />
          {isOpen("status") && (
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => toggleBool("on_sale", on_sale)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    on_sale
                      ? "border-red-300 bg-red-50 text-red-700"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <HiTag
                    className={`w-4 h-4 ${on_sale ? "text-red-500" : "text-gray-400"}`}
                  />
                  تخفیف‌دار
                </button>
                <button
                  type="button"
                  onClick={() => toggleBool("in_stock", in_stock)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    in_stock
                      ? "border-teal-300 bg-teal-50 text-teal-700"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <HiShoppingBag
                    className={`w-4 h-4 ${in_stock ? "text-teal-500" : "text-gray-400"}`}
                  />
                  موجود
                </button>
              </div>
            </div>
          )}
        </div>

        {/* دسته‌بندی */}
        <div className="border-b border-gray-100">
          <SecHead
            id="categories"
            label="دسته‌بندی"
            extra={
              selectedCats.length > 0 ? (
                <span className="text-xs text-teal-600 font-medium">
                  {selectedCats.length} انتخاب
                </span>
              ) : undefined
            }
          />
          {isOpen("categories") && (
            <div className="px-4 pb-4">
              <div className="relative mb-3">
                <HiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={catSearch}
                  onChange={(e) => setCatSearch(e.target.value)}
                  placeholder="جستجو..."
                  className="w-full pr-8 pl-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white"
                />
              </div>

              {catSearch ? (
                <div className="space-y-0.5">
                  {searchResults.length === 0 && (
                    <p className="text-xs text-gray-400 py-3 text-center">
                      موردی یافت نشد
                    </p>
                  )}
                  {searchResults.map((item) => (
                    <div key={item.id}>
                      {item.parentName && (
                        <p className="text-[10px] text-gray-400 pr-1 mb-0.5">
                          {item.parentName} ←
                        </p>
                      )}
                      <ChildRow slug={item.slug} name={item.name} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {grouped.map(({ cat, children }) => {
                    const childSlugs = children.map((c) => c.slug);
                    const allSelected =
                      childSlugs.length > 0 &&
                      childSlugs.every((s) => selectedCats.includes(s));
                    const someSelected = childSlugs.some((s) =>
                      selectedCats.includes(s),
                    );
                    const catSelected = selectedCats.includes(cat.slug);
                    const totalCount =
                      children.reduce(
                        (s, c) => s + (c.products_count || 0),
                        0,
                      ) || cat.products_count;

                    return (
                      <div key={cat.id}>
                        <button
                          type="button"
                          onClick={() =>
                            children.length > 0
                              ? toggleParent(childSlugs)
                              : toggleCat(cat.slug)
                          }
                          className="flex items-center justify-between w-full px-1 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                                allSelected || catSelected
                                  ? "bg-teal-600 border-teal-600"
                                  : someSelected
                                    ? "border-teal-400 bg-teal-50"
                                    : "border-gray-300 group-hover:border-gray-400"
                              }`}
                            >
                              {(allSelected || catSelected) && (
                                <HiCheck className="w-2.5 h-2.5 text-white" />
                              )}
                              {!allSelected && !catSelected && someSelected && (
                                <span className="w-2 h-0.5 bg-teal-500 rounded-full" />
                              )}
                            </span>
                            <span
                              className={`text-sm font-medium transition-colors ${
                                allSelected || someSelected || catSelected
                                  ? "text-teal-700"
                                  : "text-gray-700 group-hover:text-gray-900"
                              }`}
                            >
                              {cat.name}
                            </span>
                          </div>
                          {totalCount !== undefined && (
                            <span className="text-xs text-gray-400">
                              {totalCount.toLocaleString("fa-IR")}
                            </span>
                          )}
                        </button>

                        {children.length > 0 && (
                          <div className="mr-4 border-r-2 border-gray-100 pr-2 mt-0.5 space-y-0.5">
                            {children.map((c) => (
                              <ChildRow
                                key={c.id}
                                slug={c.slug}
                                name={c.name}
                                count={c.products_count}
                                indent
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* قیمت */}
        <div className="border-b border-gray-100">
          <SecHead
            id="price"
            label="محدوده قیمت"
            extra={
              min_price > priceRange.min || max_price < priceRange.max ? (
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
              ) : undefined
            }
          />
          {isOpen("price") && (
            <div className="px-4 pb-4">
              <PriceRangeSlider
                globalMin={priceRange.min}
                globalMax={priceRange.max}
                currentMin={min_price}
                currentMax={max_price}
                onChange={handlePrice}
              />
            </div>
          )}
        </div>

        {/* امتیاز */}
        <div>
          <SecHead
            id="rating"
            label="امتیاز کاربران"
            extra={
              min_rating ? (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              ) : undefined
            }
          />
          {isOpen("rating") && (
            <div className="px-4 pb-4 space-y-1">
              {[
                { value: 5, label: "۵ ستاره" },
                { value: 4, label: "۴ ستاره و بالاتر" },
                { value: 3, label: "۳ ستاره و بالاتر" },
                { value: 2, label: "۲ ستاره و بالاتر" },
              ].map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => toggleRating(r.value)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border transition-all ${
                    min_rating === String(r.value)
                      ? "border-amber-200 bg-amber-50"
                      : "border-transparent hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                      min_rating === String(r.value)
                        ? "border-amber-500 bg-amber-500"
                        : "border-gray-300"
                    }`}
                  >
                    {min_rating === String(r.value) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <HiStar
                        key={i}
                        className={`w-3.5 h-3.5 ${i < r.value ? "text-amber-400" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-xs mr-auto ${min_rating === String(r.value) ? "text-amber-700 font-medium" : "text-gray-500"}`}
                  >
                    {r.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* فوتر موبایل */}
      {isMobile && (
        <div className="px-4 py-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors"
          >
            نمایش نتایج
            {activeCount > 0 && (
              <span className="mr-1.5 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
