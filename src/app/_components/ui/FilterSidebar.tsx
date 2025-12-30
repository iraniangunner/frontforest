"use client";

import { useState } from "react";
import {
  HiChevronDown,
  HiChevronUp,
  HiX,
  HiCheck,
} from "react-icons/hi";
import { Category, Tag, FilterParams } from "@/types";

interface FilterSidebarProps {
  categories: Category[];
  tags: {
    frameworks: Tag[];
    styling: Tag[];
    features: Tag[];
  };
  filters: FilterParams;
  onFilterChange: (filters: FilterParams) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export default function FilterSidebar({
  categories,
  tags,
  filters,
  onFilterChange,
  onClose,
  isMobile = false,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "categories",
    "frameworks",
    "styling",
    "features",
    "price",
    "rating",
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleCategoryToggle = (slug: string) => {
    const current = filters.categories || [];
    const updated = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    onFilterChange({ ...filters, categories: updated, page: 1 });
  };

  const handleTagToggle = (
    type: "frameworks" | "stylings" | "features",
    slug: string
  ) => {
    const current = filters[type] || [];
    const updated = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    onFilterChange({ ...filters, [type]: updated, page: 1 });
  };

  const handlePriceChange = (
    field: "min_price" | "max_price",
    value: string
  ) => {
    const numValue = value ? parseInt(value) : undefined;
    onFilterChange({ ...filters, [field]: numValue, page: 1 });
  };

  const handleBooleanToggle = (field: "free" | "featured" | "on_sale") => {
    onFilterChange({
      ...filters,
      [field]: filters[field] ? undefined : true,
      page: 1,
    });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({
      ...filters,
      min_rating: filters.min_rating === rating ? undefined : rating,
      page: 1,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({ page: 1, per_page: filters.per_page });
  };

  const hasActiveFilters = () => {
    return (
      (filters.categories && filters.categories.length > 0) ||
      (filters.frameworks && filters.frameworks.length > 0) ||
      (filters.stylings && filters.stylings.length > 0) ||
      (filters.features && filters.features.length > 0) ||
      filters.free ||
      filters.featured ||
      filters.on_sale ||
      filters.min_price ||
      filters.max_price ||
      filters.min_rating
    );
  };

  const SectionHeader = ({
    title,
    section,
  }: {
    title: string;
    section: string;
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full py-3 text-gray-900 font-medium"
    >
      {title}
      {expandedSections.includes(section) ? (
        <HiChevronUp className="w-5 h-5 text-gray-500" />
      ) : (
        <HiChevronDown className="w-5 h-5 text-gray-500" />
      )}
    </button>
  );

  // ✅ FIXED: Changed from label to button with onClick
  const CheckboxItem = ({
    label,
    checked,
    onClick,
    count,
    color,
  }: {
    label: string;
    checked: boolean;
    onClick: () => void;
    count?: number;
    color?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 py-1.5 cursor-pointer group w-full text-right"
    >
      <div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
          checked
            ? "bg-blue-600 border-blue-600"
            : "border-gray-300 group-hover:border-blue-400"
        }`}
      >
        {checked && <HiCheck className="w-3 h-3 text-white" />}
      </div>
      <span className="flex-1 text-gray-700 group-hover:text-gray-900 flex items-center">
        {color && (
          <span
            className="inline-block w-2.5 h-2.5 rounded-full ml-2 flex-shrink-0"
            style={{ backgroundColor: color }}
          />
        )}
        {label}
      </span>
      {count !== undefined && (
        <span className="text-sm text-gray-400 flex-shrink-0">{count}</span>
      )}
    </button>
  );

  return (
    <div
      className={`bg-white ${
        isMobile
          ? "h-full overflow-y-auto"
          : "rounded-xl shadow-sm border border-gray-100"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">فیلترها</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters() && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:text-red-700"
            >
              پاک کردن همه
            </button>
          )}
          {isMobile && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <HiX className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-1">
        {/* Quick Filters */}
        <div className="pb-4 border-b border-gray-100">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleBooleanToggle("free")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filters.free
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              رایگان
            </button>
            <button
              type="button"
              onClick={() => handleBooleanToggle("on_sale")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filters.on_sale
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              تخفیف‌دار
            </button>
            <button
              type="button"
              onClick={() => handleBooleanToggle("featured")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filters.featured
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              ویژه
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="border-b border-gray-100">
          <SectionHeader title="دسته‌بندی" section="categories" />
          {expandedSections.includes("categories") && (
            <div className="pb-4 space-y-1 max-h-64 overflow-y-auto">
              {categories.map((category) => (
                <div key={category.id}>
                  {/* Parent Category */}
                  <p className="text-sm font-medium text-gray-500 mt-2 mb-1">
                    {category.name}
                  </p>
                  {/* Children */}
                  {category.children?.map((child) => (
                    <CheckboxItem
                      key={child.id}
                      label={child.name}
                      checked={
                        filters.categories?.includes(child.slug) || false
                      }
                      onClick={() => handleCategoryToggle(child.slug)}
                      count={child.components_count}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Frameworks */}
        <div className="border-b border-gray-100">
          <SectionHeader title="فریم‌ورک" section="frameworks" />
          {expandedSections.includes("frameworks") && (
            <div className="pb-4 space-y-1">
              {tags.frameworks.map((tag) => (
                <CheckboxItem
                  key={tag.id}
                  label={tag.name}
                  checked={filters.frameworks?.includes(tag.slug) || false}
                  onClick={() => handleTagToggle("frameworks", tag.slug)}
                  color={tag.color}
                />
              ))}
            </div>
          )}
        </div>

        {/* Styling */}
        <div className="border-b border-gray-100">
          <SectionHeader title="استایل" section="styling" />
          {expandedSections.includes("styling") && (
            <div className="pb-4 space-y-1">
              {tags.styling.map((tag) => (
                <CheckboxItem
                  key={tag.id}
                  label={tag.name}
                  checked={filters.stylings?.includes(tag.slug) || false}
                  onClick={() => handleTagToggle("stylings", tag.slug)}
                  color={tag.color}
                />
              ))}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="border-b border-gray-100">
          <SectionHeader title="ویژگی‌ها" section="features" />
          {expandedSections.includes("features") && (
            <div className="pb-4 space-y-1">
              {tags.features.map((tag) => (
                <CheckboxItem
                  key={tag.id}
                  label={tag.name}
                  checked={filters.features?.includes(tag.slug) || false}
                  onClick={() => handleTagToggle("features", tag.slug)}
                  color={tag.color}
                />
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="border-b border-gray-100">
          <SectionHeader title="محدوده قیمت" section="price" />
          {expandedSections.includes("price") && (
            <div className="pb-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="از"
                  value={filters.min_price || ""}
                  onChange={(e) =>
                    handlePriceChange("min_price", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="تا"
                  value={filters.max_price || ""}
                  onChange={(e) =>
                    handlePriceChange("max_price", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">قیمت به تومان</p>
            </div>
          )}
        </div>

        {/* Rating */}
        <div>
          <SectionHeader title="حداقل امتیاز" section="rating" />
          {expandedSections.includes("rating") && (
            <div className="pb-4 flex items-center gap-2">
              {[4, 3, 2, 1].map((rating) => (
                <button
                  type="button"
                  key={rating}
                  onClick={() => handleRatingChange(rating)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    filters.min_rating === rating
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {rating}+
                  <span className="text-yellow-400">★</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}