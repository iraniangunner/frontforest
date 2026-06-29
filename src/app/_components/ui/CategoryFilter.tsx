"use client";

// app/products/_components/CategoryFilter.tsx
import { useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import {
  HiChevronDown,
  HiCheck,
  HiX,
  HiTag,
  HiShoppingBag,
  HiStar,
  HiAdjustments,
} from "react-icons/hi";
import PriceRangeSlider from "./PriceRangeSlider";
import { useCategoryFilterPush } from "@/hooks/useCategoryFilterPush";
import { useContext } from "react";
import { FilterContext } from "./ProductsGridWrapper";

interface SiblingCategory {
  id: number;
  name: string;
  slug: string;
  products_count?: number;
}

interface Props {
  siblings: SiblingCategory[];
  parentSlug: string;
  priceRange: { min: number; max: number };
  onClose?: () => void;
  isMobile?: boolean;
}

export default function CategoryFilter({
  siblings,
  parentSlug,
  priceRange,
  onClose,
  isMobile = false,
}: Props) {
  const sp = useSearchParams();
  const params = useParams();
  // const { push, clearAll } = useCategoryFilterPush(parentSlug);

  const ctx = useContext(FilterContext);
const fallback = useCategoryFilterPush(parentSlug);
const { push, clearAll, isPending } = ctx ?? fallback;

  const [openSecs, setOpenSecs] = useState<string[]>([
    "status",
    "categories",
    "price",
    "rating",
  ]);

  const routeChild =
    typeof params?.child === "string" ? params.child : undefined;
  const querySlugs = sp.getAll("categories[]");
  const selected = Array.from(
    new Set(routeChild ? [routeChild, ...querySlugs] : querySlugs),
  );

  const on_sale = sp.get("on_sale") === "1";
  const in_stock = sp.get("in_stock") === "1";
  const min_price = +(sp.get("min_price") || priceRange.min);
  const max_price = +(sp.get("max_price") || priceRange.max);
  const min_rating = sp.get("min_rating") || "";

  const toggleSibling = (slug: string) =>
    push({
      "categories[]": selected.includes(slug)
        ? selected.filter((s) => s !== slug)
        : [...selected, slug],
    });

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
      push({ "categories[]": selected.filter((s) => s !== value) });
    } else if (key === "price") {
      push({ min_price: null, max_price: null });
    } else {
      push({ [key]: null });
    }
  };

  const chips: { key: string; value?: string; label: string }[] = [
    ...selected.map((slug) => {
      const sib = siblings.find((s) => s.slug === slug);
      return { key: "categories[]", value: slug, label: sib?.name || slug };
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
      className="flex items-center justify-between w-full px-4 py-3 hover:bg-[#F8F8F8] transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[#242424]">{label}</span>
        {extra}
      </div>
      <HiChevronDown
        className={`w-4 h-4 text-[#AFAFAF] transition-transform duration-200 ${
          isOpen(id) ? "rotate-180" : ""
        }`}
      />
    </button>
  );

  return (
    <div
      className={`bg-white ${
        isMobile
          ? "flex flex-col h-full"
          : "rounded-2xl border border-[#F0F0F0] overflow-hidden"
      }`}
      dir="rtl"
    >
      {/* هدر */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0F0F0]">
        <div className="flex items-center gap-2">
          <HiAdjustments className="w-4 h-4 text-[#898989]" />
          <span className="text-sm font-semibold text-[#242424]">فیلترها</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 bg-[#A72F3B] text-white text-xs font-bold rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => clearAll()}
              className="text-xs text-[#A72F3B] hover:text-[#86262F] font-medium transition-colors"
            >
              حذف همه
            </button>
          )}
          {isMobile && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#AFAFAF] hover:text-[#242424] rounded-lg"
            >
              <HiX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* chips */}
      {chips.length > 0 && (
        <div className="px-3 py-2 border-b border-[#F0F0F0] flex flex-wrap gap-1.5">
          {chips.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => removeChip(c.key, c.value)}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F5F5F5] text-[#656565] text-xs rounded-full hover:bg-[#EDEDED] border border-[#EDEDED] transition-colors"
            >
              {c.label}
              <HiX className="w-3 h-3 opacity-60" />
            </button>
          ))}
        </div>
      )}

      <div className={isMobile ? "flex-1 overflow-y-auto" : ""}>
        {/* وضعیت */}
        <div className="border-b border-[#F0F0F0]">
          <SecHead id="status" label="وضعیت" />
          {isOpen("status") && (
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => toggleBool("on_sale", on_sale)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    on_sale
                      ? "border-[#F3C5C9] bg-[#FBEAEA] text-[#C30000]"
                      : "border-[#EDEDED] bg-white text-[#898989] hover:border-[#DCACB1]"
                  }`}
                >
                  <HiTag
                    className={`w-4 h-4 ${on_sale ? "text-[#C30000]" : "text-[#AFAFAF]"}`}
                  />
                  تخفیف‌دار
                </button>
                <button
                  type="button"
                  onClick={() => toggleBool("in_stock", in_stock)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    in_stock
                      ? "border-[#DCACB1] bg-[#F6EAEB] text-[#A72F3B]"
                      : "border-[#EDEDED] bg-white text-[#898989] hover:border-[#DCACB1]"
                  }`}
                >
                  <HiShoppingBag
                    className={`w-4 h-4 ${in_stock ? "text-[#A72F3B]" : "text-[#AFAFAF]"}`}
                  />
                  موجود
                </button>
              </div>
            </div>
          )}
        </div>

        {/* دسته‌بندی */}
        {siblings.length > 0 && (
          <div className="border-b border-[#F0F0F0]">
            <SecHead
              id="categories"
              label="دسته‌بندی"
              extra={
                selected.length > 0 ? (
                  <span className="text-xs text-[#A72F3B] font-medium">
                    {selected.length} انتخاب
                  </span>
                ) : undefined
              }
            />
            {isOpen("categories") && (
              <div className="px-4 pb-4 space-y-0.5">
                {siblings.map((sib) => {
                  const checked = selected.includes(sib.slug);
                  return (
                    <button
                      key={sib.id}
                      type="button"
                      onClick={() => toggleSibling(sib.slug)}
                      className="flex items-center justify-between w-full py-2 px-1 rounded-lg hover:bg-[#F8F8F8] transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                            checked
                              ? "bg-[#A72F3B] border-[#A72F3B]"
                              : "border-[#CBCBCB] group-hover:border-[#AFAFAF]"
                          }`}
                        >
                          {checked && (
                            <HiCheck className="w-2.5 h-2.5 text-white" />
                          )}
                        </span>
                        <span
                          className={`text-sm transition-colors ${
                            checked
                              ? "text-[#242424] font-medium"
                              : "text-[#656565]"
                          }`}
                        >
                          {sib.name}
                        </span>
                      </div>
                      {sib.products_count !== undefined && (
                        <span className="text-xs text-[#AFAFAF]">
                          {sib.products_count.toLocaleString("fa-IR")}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* قیمت */}
        <div className="border-b border-[#F0F0F0]">
          <SecHead
            id="price"
            label="محدوده قیمت"
            extra={
              min_price > priceRange.min || max_price < priceRange.max ? (
                <span className="w-1.5 h-1.5 rounded-full bg-[#A72F3B] inline-block" />
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
                <span className="w-1.5 h-1.5 rounded-full bg-[#F4B740] inline-block" />
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
                      ? "border-[#F6E2BE] bg-[#FBEFD7]"
                      : "border-transparent hover:border-[#EDEDED] hover:bg-[#F8F8F8]"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                      min_rating === String(r.value)
                        ? "border-[#A9791C] bg-[#A9791C]"
                        : "border-[#CBCBCB]"
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
                        className={`w-3.5 h-3.5 ${i < r.value ? "text-[#F4B740]" : "text-[#EDEDED]"}`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-xs mr-auto ${
                      min_rating === String(r.value)
                        ? "text-[#A9791C] font-medium"
                        : "text-[#898989]"
                    }`}
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
        <div className="px-4 py-3 border-t border-[#F0F0F0]">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-[#A72F3B] text-white text-sm font-semibold rounded-xl hover:bg-[#86262F] transition-colors"
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
