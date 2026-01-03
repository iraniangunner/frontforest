"use client";

import {
  HiX,
  HiTag,
  HiCurrencyDollar,
  HiStar,
  HiSearch,
  HiSparkles,
  HiTrash,
} from "react-icons/hi";
import { FilterParams, Category, Tag } from "@/types";

interface ActiveFiltersProps {
  filters: FilterParams;
  categories: Category[];
  tags: {
    frameworks: Tag[];
    styling: Tag[];
    features: Tag[];
  };
  onRemove: (key: string, value?: string) => void;
  onClearAll: () => void;
}

type FilterType =
  | "category"
  | "framework"
  | "styling"
  | "feature"
  | "free"
  | "sale"
  | "featured"
  | "price"
  | "rating"
  | "search";

interface ActiveFilter {
  key: string;
  label: string;
  value?: string;
  type: FilterType;
  color?: string;
}

const filterStyles: Record<FilterType, { bg: string; text: string; icon?: React.ElementType }> = {
  category: { bg: "bg-indigo-50", text: "text-indigo-700" },
  framework: { bg: "bg-cyan-50", text: "text-cyan-700" },
  styling: { bg: "bg-pink-50", text: "text-pink-700" },
  feature: { bg: "bg-violet-50", text: "text-violet-700" },
  free: { bg: "bg-emerald-50", text: "text-emerald-700", icon: HiTag },
  sale: { bg: "bg-rose-50", text: "text-rose-700", icon: HiCurrencyDollar },
  featured: { bg: "bg-amber-50", text: "text-amber-700", icon: HiSparkles },
  price: { bg: "bg-teal-50", text: "text-teal-700", icon: HiCurrencyDollar },
  rating: { bg: "bg-yellow-50", text: "text-yellow-700", icon: HiStar },
  search: { bg: "bg-gray-100", text: "text-gray-700", icon: HiSearch },
};

export default function ActiveFilters({
  filters,
  categories,
  tags,
  onRemove,
  onClearAll,
}: ActiveFiltersProps) {
  const activeFilters: ActiveFilter[] = [];

  // Categories
  filters.categories?.forEach((slug) => {
    const allCategories = categories.flatMap((c) => c.children || []);
    const cat = allCategories.find((c) => c.slug === slug);
    if (cat) {
      activeFilters.push({
        key: "categories",
        label: cat.name,
        value: slug,
        type: "category",
        color: cat.color,
      });
    }
  });

  // Frameworks
  filters.frameworks?.forEach((slug) => {
    const tag = tags.frameworks.find((t) => t.slug === slug);
    if (tag) {
      activeFilters.push({
        key: "frameworks",
        label: tag.name,
        value: slug,
        type: "framework",
        color: tag.color,
      });
    }
  });

  // Styling
  filters.stylings?.forEach((slug) => {
    const tag = tags.styling.find((t) => t.slug === slug);
    if (tag) {
      activeFilters.push({
        key: "stylings",
        label: tag.name,
        value: slug,
        type: "styling",
        color: tag.color,
      });
    }
  });

  // Features
  filters.features?.forEach((slug) => {
    const tag = tags.features.find((t) => t.slug === slug);
    if (tag) {
      activeFilters.push({
        key: "features",
        label: tag.name,
        value: slug,
        type: "feature",
        color: tag.color,
      });
    }
  });

  // Boolean filters
  if (filters.free) {
    activeFilters.push({ key: "free", label: "رایگان", type: "free" });
  }
  if (filters.on_sale) {
    activeFilters.push({ key: "on_sale", label: "تخفیف‌دار", type: "sale" });
  }
  if (filters.featured) {
    activeFilters.push({ key: "featured", label: "ویژه", type: "featured" });
  }

  // Price
  if (filters.min_price || filters.max_price) {
    const min = filters.min_price?.toLocaleString("fa-IR") || "۰";
    const max = filters.max_price?.toLocaleString("fa-IR") || "∞";
    activeFilters.push({
      key: "price",
      label: `${min} - ${max} تومان`,
      type: "price",
    });
  }

  // Rating
  if (filters.min_rating) {
    activeFilters.push({
      key: "min_rating",
      label: `${filters.min_rating}+ ستاره`,
      type: "rating",
    });
  }

  // Search
  if (filters.q) {
    activeFilters.push({
      key: "q",
      label: filters.q,
      type: "search",
    });
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* Label */}
        <div className="flex items-center gap-2 ml-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
            <HiTag className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-700">
            فیلترهای فعال
          </span>
          <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-bold rounded-full">
            {activeFilters.length}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block" />

        {/* Filter Tags */}
        {activeFilters.map((filter, index) => {
          const style = filterStyles[filter.type];
          const Icon = style.icon;

          return (
            <button
              key={`${filter.key}-${filter.value || index}`}
              onClick={() => onRemove(filter.key, filter.value)}
              className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                filter.color
                  ? ""
                  : `${style.bg} ${style.text}`
              }`}
              style={
                filter.color
                  ? {
                      backgroundColor: `${filter.color}15`,
                      color: filter.color,
                    }
                  : undefined
              }
            >
              {Icon && <Icon className="w-3.5 h-3.5 opacity-70" />}
              {filter.color && (
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: filter.color }}
                />
              )}
              <span className="max-w-[150px] truncate">{filter.label}</span>
              <HiX className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </button>
          );
        })}

        {/* Clear All Button */}
        <button
          onClick={onClearAll}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25"
        >
          <HiTrash className="w-4 h-4" />
          <span className="hidden sm:inline">پاک کردن همه</span>
        </button>
      </div>
    </div>
  );
}