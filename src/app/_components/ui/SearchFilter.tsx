"use client";

// app/_components/ui/SearchFilter.tsx
// ساختار یکسان با CategoryFilter (هدر، chips، وضعیت، قیمت، امتیاز، فوتر).
// تنها تفاوت: بخش دسته‌بندی درختی است (منوی والد/فرزند) به‌جای لیست تخت.

import { useState, useEffect } from "react";
import {
  HiChevronDown,
  HiX,
  HiTag,
  HiShoppingBag,
  HiStar,
  HiAdjustments,
  HiViewGrid,
} from "react-icons/hi";
import Image from "next/image";
import PriceRangeSlider from "./PriceRangeSlider";
import { useFilter } from "./FilterProvider";

interface MenuChild {
  id: number;
  name: string;
  slug: string;
  products_count?: number;
}

interface MenuParent {
  id: number;
  name: string;
  slug: string;
  icon_image?: string | null;
  products_count?: number;
  children?: MenuChild[];
}

interface Props {
  menu: MenuParent[];
  priceRange: { min: number; max: number };
  onClose?: () => void;
  isMobile?: boolean;
}

export default function SearchFilter({
  menu,
  priceRange,
  onClose,
  isMobile = false,
}: Props) {
  const { get, getAll, push, clearAll, closeDrawer } = useFilter();
  const handleClose = onClose ?? closeDrawer;

  const [openSecs, setOpenSecs] = useState<string[]>([
    "categories",
    "status",
    "price",
    "rating",
  ]);
  const [openParent, setOpenParent] = useState<number | null>(null);

  const on_sale = get("on_sale") === "1";
  const in_stock = get("in_stock") === "1";
  const min_price = +(get("min_price") || priceRange.min);
  const max_price = +(get("max_price") || priceRange.max);
  const min_rating = get("min_rating") || "";
  const selectedCats = getAll("categories[]");

  useEffect(() => {
    if (!menu.length || selectedCats.length === 0) return;
    const owner = menu.find((p) =>
      p.children?.some((c) => selectedCats.includes(c.slug)),
    );
    if (owner) setOpenParent((cur) => (cur === null ? owner.id : cur));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu]);

  const toggleBool = (k: "on_sale" | "in_stock", cur: boolean) =>
    push({ [k]: cur ? null : "1" });

  const toggleRating = (r: number) =>
    push({ min_rating: min_rating === String(r) ? null : String(r) });

  const handlePrice = (min: number, max: number) =>
    push({
      min_price: min > priceRange.min ? String(min) : null,
      max_price: max < priceRange.max ? String(max) : null,
    });

  // ── دسته‌بندی درختی (قیمت هنگام تغییر دسته پاک می‌شود) ──
  const toggleChild = (childSlug: string) => {
    const parent = menu.find((p) =>
      p.children?.some((c) => c.slug === childSlug),
    );
    const parentSlug = parent?.slug;
    let next: string[];
    if (selectedCats.includes(childSlug)) {
      next = selectedCats.filter((s) => s !== childSlug);
    } else {
      next = [...selectedCats.filter((s) => s !== parentSlug), childSlug];
    }
    push({
      "categories[]": Array.from(new Set(next)),
    });
  };

  const isParentWholeSelected = (parent: MenuParent) =>
    selectedCats.includes(parent.slug);

  const toggleWholeParent = (parent: MenuParent) => {
    const childSlugs = parent.children?.map((c) => c.slug) || [];
    if (isParentWholeSelected(parent)) {
      push({
        "categories[]": selectedCats.filter((s) => s !== parent.slug),
      });
    } else {
      const withoutChildren = selectedCats.filter(
        (s) => !childSlugs.includes(s),
      );
      push({
        "categories[]": Array.from(new Set([...withoutChildren, parent.slug])),
      });
    }
  };

  const catName = (slug: string) => {
    for (const p of menu) {
      if (p.slug === slug) return p.name;
      const c = p.children?.find((ch) => ch.slug === slug);
      if (c) return c.name;
    }
    return slug;
  };

  const removeChip = (key: string, value?: string) => {
    if (key === "price") push({ min_price: null, max_price: null });
    else if (key === "categories[]")
      push({
        "categories[]": selectedCats.filter((s) => s !== value),
      });
    else push({ [key]: null });
  };

  const chips: { key: string; value?: string; label: string }[] = [
    ...selectedCats.map((slug) => ({
      key: "categories[]",
      value: slug,
      label: catName(slug),
    })),
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
  const isSecOpen = (id: string) => openSecs.includes(id);

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
          isSecOpen(id) ? "rotate-180" : ""
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
          {isMobile && (
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 text-[#AFAFAF] hover:text-[#242424] rounded-lg"
            >
              <HiX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* chips */}
      {/* {chips.length > 0 && (
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
      )} */}

      <div className={isMobile ? "flex-1 overflow-y-auto" : ""}>
        {/* دسته‌بندی درختی */}
        {menu.length > 0 && (
          <div className="border-b border-[#F0F0F0]">
            <SecHead
              id="categories"
              label="دسته‌بندی"
              extra={
                selectedCats.length > 0 ? (
                  <span className="text-xs text-[#A72F3B] font-medium">
                    {selectedCats.length} انتخاب
                  </span>
                ) : undefined
              }
            />
            {isSecOpen("categories") && (
              <div className="pb-2">
                <div className="max-h-[360px] overflow-y-auto">
                  {menu.map((parent) => {
                    const pOpen = openParent === parent.id;
                    const childSlugs =
                      parent.children?.map((c) => c.slug) || [];
                    const wholeChecked = isParentWholeSelected(parent);
                    const selInParent = childSlugs.filter((s) =>
                      selectedCats.includes(s),
                    ).length;
                    const badge = wholeChecked ? 1 : selInParent;

                    return (
                      <div key={parent.id}>
                        <button
                          type="button"
                          onClick={() =>
                            setOpenParent((cur) =>
                              cur === parent.id ? null : parent.id,
                            )
                          }
                          className="flex items-center justify-between w-full px-4 py-2.5 hover:bg-[#F8F8F8] transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            {parent.icon_image ? (
                              <Image
                                src={parent.icon_image}
                                alt=""
                                width={40}
                                height={40}
                                className="w-5 h-5 object-contain flex-shrink-0"
                              />
                            ) : (
                              <span className="w-5 h-5 rounded-md bg-[#F6EAEB] flex items-center justify-center flex-shrink-0">
                                <HiViewGrid className="w-3 h-3 text-[#A72F3B]" />
                              </span>
                            )}
                            <span
                              className={`text-sm ${
                                pOpen || badge > 0
                                  ? "text-[#A72F3B] font-semibold"
                                  : "text-[#242424] font-medium"
                              }`}
                            >
                              {parent.name}
                            </span>
                            {badge > 0 && (
                              <span className="text-[11px] text-[#A72F3B] bg-[#F6EAEB] px-1.5 py-0.5 rounded-full">
                                {wholeChecked ? "همه" : badge}
                              </span>
                            )}
                          </div>
                          <HiChevronDown
                            className={`w-4 h-4 text-[#AFAFAF] transition-transform duration-200 ${
                              pOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {pOpen && (
                          <div className="px-3 pb-2 pt-0.5 bg-[#FCFCFC]">
                            {childSlugs.length > 0 && (
                              <label className="flex items-center gap-2.5 w-full py-2 px-2 rounded-lg hover:bg-[#F6EAEB] transition-colors mb-0.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={wholeChecked}
                                  onChange={() => toggleWholeParent(parent)}
                                  className="w-[18px] h-[18px] rounded accent-[#A72F3B] cursor-pointer"
                                />
                                <span className="text-[13px] font-medium text-[#A72F3B]">
                                  همه‌ی {parent.name}
                                </span>
                              </label>
                            )}

                            {parent.children?.map((child) => {
                              const checked =
                                !wholeChecked &&
                                selectedCats.includes(child.slug);
                              return (
                                <label
                                  key={child.id}
                                  className="flex items-center justify-between w-full py-2 px-2 rounded-lg hover:bg-[#F8F8F8] transition-colors cursor-pointer"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => toggleChild(child.slug)}
                                      className="w-[18px] h-[18px] rounded accent-[#A72F3B] cursor-pointer"
                                    />
                                    <span
                                      className={`text-[13px] transition-colors ${
                                        checked
                                          ? "text-[#242424] font-medium"
                                          : "text-[#656565]"
                                      }`}
                                    >
                                      {child.name}
                                    </span>
                                  </div>
                                  {child.products_count !== undefined && (
                                    <span className="text-[11px] text-[#AFAFAF]">
                                      {child.products_count.toLocaleString(
                                        "fa-IR",
                                      )}
                                    </span>
                                  )}
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* وضعیت */}
        <div className="border-b border-[#F0F0F0]">
          <SecHead id="status" label="وضعیت" />
          {isSecOpen("status") && (
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => toggleBool("on_sale", on_sale)}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    on_sale
                      ? "border-[#F3C5C9] bg-[#FBEAEA] text-[#C30000]"
                      : "border-[#EDEDED] bg-white text-[#898989] hover:border-[#DCACB1]"
                  }`}
                >
                  {/* <HiTag
                    className={`w-4 h-4 ${on_sale ? "text-[#C30000]" : "text-[#AFAFAF]"}`}
                  /> */}
                  تخفیف‌دار
                </button>
                <button
                  type="button"
                  onClick={() => toggleBool("in_stock", in_stock)}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    in_stock
                      ? "border-[#DCACB1] bg-[#F6EAEB] text-[#A72F3B]"
                      : "border-[#EDEDED] bg-white text-[#898989] hover:border-[#DCACB1]"
                  }`}
                >
                  {/* <HiShoppingBag
                    className={`w-4 h-4 ${in_stock ? "text-[#A72F3B]" : "text-[#AFAFAF]"}`}
                  /> */}
                  موجود
                </button>
              </div>
            </div>
          )}
        </div>

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
          {isSecOpen("price") && (
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
          {isSecOpen("rating") && (
            <div className="px-4 pb-4 space-y-1">
              {[
                { value: 5, label: "۵ ستاره" },
                { value: 4, label: "۴ ستاره و بالاتر" },
                { value: 3, label: "۳ ستاره و بالاتر" },
                { value: 2, label: "۲ ستاره و بالاتر" },
              ].map((r) => {
                const active = min_rating === String(r.value);
                return (
                  <label
                    key={r.value}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                      active
                        ? "border-[#F6E2BE] bg-[#FBEFD7]"
                        : "border-transparent hover:border-[#EDEDED] hover:bg-[#F8F8F8]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="search_min_rating"
                      checked={active}
                      onChange={() => toggleRating(r.value)}
                      onClick={() => active && toggleRating(r.value)}
                      className="w-4 h-4 accent-[#A9791C] cursor-pointer"
                    />
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
                        active ? "text-[#A9791C] font-medium" : "text-[#898989]"
                      }`}
                    >
                      {r.label}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* فوتر موبایل */}
      {isMobile && (
        <div className="px-4 py-3 border-t border-[#F0F0F0]">
          <button
            type="button"
            onClick={handleClose}
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
