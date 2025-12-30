"use client";

import { HiX } from "react-icons/hi";
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

export default function ActiveFilters({
  filters,
  categories,
  tags,
  onRemove,
  onClearAll,
}: ActiveFiltersProps) {
  const activeFilters: { key: string; label: string; value?: string }[] = [];

  // Categories
  filters.categories?.forEach((slug) => {
    const allCategories = categories.flatMap((c) => c.children || []);
    const cat = allCategories.find((c) => c.slug === slug);
    if (cat) {
      activeFilters.push({ key: "categories", label: cat.name, value: slug });
    }
  });

  // Frameworks
  filters.frameworks?.forEach((slug) => {
    const tag = tags.frameworks.find((t) => t.slug === slug);
    if (tag) {
      activeFilters.push({ key: "frameworks", label: tag.name, value: slug });
    }
  });

  // Styling
  filters.stylings?.forEach((slug) => {
    const tag = tags.styling.find((t) => t.slug === slug);
    if (tag) {
      activeFilters.push({ key: "stylings", label: tag.name, value: slug });
    }
  });

  // Features
  filters.features?.forEach((slug) => {
    const tag = tags.features.find((t) => t.slug === slug);
    if (tag) {
      activeFilters.push({ key: "features", label: tag.name, value: slug });
    }
  });

  // Boolean filters
  if (filters.free) activeFilters.push({ key: "free", label: "رایگان" });
  if (filters.on_sale) activeFilters.push({ key: "on_sale", label: "تخفیف‌دار" });
  if (filters.featured) activeFilters.push({ key: "featured", label: "ویژه" });

  // Price
  if (filters.min_price || filters.max_price) {
    const label = `${filters.min_price?.toLocaleString() || "۰"} - ${
      filters.max_price?.toLocaleString() || "∞"
    } تومان`;
    activeFilters.push({ key: "price", label });
  }

  // Rating
  if (filters.min_rating) {
    activeFilters.push({ key: "min_rating", label: `${filters.min_rating}+ ستاره` });
  }

  // Search
  if (filters.q) {
    activeFilters.push({ key: "q", label: `جستجو: ${filters.q}` });
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-gray-500">فیلترهای فعال:</span>
      {activeFilters.map((filter, index) => (
        <button
          key={`${filter.key}-${filter.value || index}`}
          onClick={() => onRemove(filter.key, filter.value)}
          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
        >
          {filter.label}
          <HiX className="w-4 h-4" />
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm text-red-600 hover:text-red-700"
      >
        پاک کردن همه
      </button>
    </div>
  );
}