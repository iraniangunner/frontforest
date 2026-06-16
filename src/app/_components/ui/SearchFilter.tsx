"use client";

// app/search/_components/SearchFilter.tsx
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  HiChevronDown,
  HiX,
  HiTag,
  HiShoppingBag,
  HiStar,
  HiAdjustments,
} from "react-icons/hi";
import PriceRangeSlider from "./PriceRangeSlider";
import { useSearchFilterPush } from "@/hooks/useSearchFilterPush";

interface Props {
  priceRange: { min: number; max: number };
  onClose?: () => void;
  isMobile?: boolean;
}

export default function SearchFilter({
  priceRange,
  onClose,
  isMobile = false,
}: Props) {
  const sp = useSearchParams();
  const { push, clearAll } = useSearchFilterPush();

  const [openSecs, setOpenSecs] = useState<string[]>([
    "status",
    "price",
    "rating",
  ]);

  const on_sale = sp.get("on_sale") === "1";
  const in_stock = sp.get("in_stock") === "1";
  const min_price = +(sp.get("min_price") || priceRange.min);
  const max_price = +(sp.get("max_price") || priceRange.max);
  const min_rating = sp.get("min_rating") || "";
  const q = sp.get("q") || "";

  const toggleBool = (k: "on_sale" | "in_stock", cur: boolean) =>
    push({ [k]: cur ? null : "1" });

  const toggleRating = (r: number) =>
    push({ min_rating: min_rating === String(r) ? null : String(r) });

  const handlePrice = (min: number, max: number) =>
    push({
      min_price: min > priceRange.min ? String(min) : null,
      max_price: max < priceRange.max ? String(max) : null,
    });

  const removeChip = (key: string) => {
    if (key === "price") {
      push({ min_price: null, max_price: null });
    } else {
      push({ [key]: null });
    }
  };

  const chips: { key: string; label: string }[] = [
    on_sale ? { key: "on_sale", label: "تخفیف‌دار" } : null,
    in_stock ? { key: "in_stock", label: "موجود در انبار" } : null,
    min_price > priceRange.min || max_price < priceRange.max
      ? {
          key: "price",
          label: `${min_price.toLocaleString(
            "fa-IR"
          )} — ${max_price.toLocaleString("fa-IR")} ت`,
        }
      : null,
    min_rating ? { key: "min_rating", label: `${min_rating}★+` } : null,
  ].filter(Boolean) as { key: string; label: string }[];

  const activeCount = chips.length;
  const togSec = (id: string) =>
    setOpenSecs((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
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
      className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-800">{label}</span>
        {extra}
      </div>
      <HiChevronDown
        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
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
              onClick={() => removeChip(c.key)}
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
                    className={`w-4 h-4 ${
                      on_sale ? "text-red-500" : "text-gray-400"
                    }`}
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
                    className={`w-4 h-4 ${
                      in_stock ? "text-teal-500" : "text-gray-400"
                    }`}
                  />
                  موجود
                </button>
              </div>
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
                        className={`w-3.5 h-3.5 ${
                          i < r.value ? "text-amber-400" : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-xs mr-auto ${
                      min_rating === String(r.value)
                        ? "text-amber-700 font-medium"
                        : "text-gray-500"
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
