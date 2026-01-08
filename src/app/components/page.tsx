"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { HiViewGrid, HiViewList, HiFilter, HiX } from "react-icons/hi";
import ComponentCard from "../_components/ui/ComponentCard";
import FilterSidebar from "../_components/ui/FilterSidebar";
import SearchBar from "../_components/ui/SearchBar";
import Pagination from "../_components/ui/Pagination";
import ActiveFilters from "../_components/ui/ActiveFilters";
import {
  publicComponentsAPI,
  publicCategoriesAPI,
  publicTagsAPI,
} from "../../lib/api";
import {
  Component,
  Category,
  Tag,
  FilterParams,
  PaginationMeta,
} from "@/types";

const SORT_OPTIONS = [
  { value: "best-selling", label: "پرفروش‌ترین" },
  { value: "newest", label: "جدیدترین" },
  { value: "top-rated", label: "بالاترین امتیاز" },
  { value: "price-low", label: "ارزان‌ترین" },
  { value: "price-high", label: "گران‌ترین" },
];

const PER_PAGE_OPTIONS = [12, 24, 36, 48];

export default function ComponentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [components, setComponents] = useState<Component[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<{
    frameworks: Tag[];
    styling: Tag[];
    features: Tag[];
  }>({ frameworks: [], styling: [], features: [] });
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
  });

  // UI State
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Parse filters from URL
  const getFiltersFromUrl = useCallback((): FilterParams => {
    const params: FilterParams = {};

    const categories = searchParams.getAll("categories[]");
    if (categories.length) params.categories = categories;

    const frameworks = searchParams.getAll("frameworks[]");
    if (frameworks.length) params.frameworks = frameworks;

    const stylings = searchParams.getAll("stylings[]");
    if (stylings.length) params.stylings = stylings;

    const features = searchParams.getAll("features[]");
    if (features.length) params.features = features;

    if (searchParams.get("free") === "1") params.free = true;
    if (searchParams.get("featured") === "1") params.featured = true;
    if (searchParams.get("on_sale") === "1") params.on_sale = true;

    const minPrice = searchParams.get("min_price");
    if (minPrice) params.min_price = parseInt(minPrice);

    const maxPrice = searchParams.get("max_price");
    if (maxPrice) params.max_price = parseInt(maxPrice);

    const minRating = searchParams.get("min_rating");
    if (minRating) params.min_rating = parseInt(minRating);

    const q = searchParams.get("q");
    if (q) params.q = q;

    const sort = searchParams.get("sort");
    if (sort) params.sort = sort;

    const page = searchParams.get("page");
    params.page = page ? parseInt(page) : 1;

    const perPage = searchParams.get("per_page");
    params.per_page = perPage ? parseInt(perPage) : 12;

    return params;
  }, [searchParams]);

  const [filters, setFilters] = useState<FilterParams>(getFiltersFromUrl());

  // Update URL when filters change
  const updateUrl = useCallback(
    (newFilters: FilterParams) => {
      const params = new URLSearchParams();

      newFilters.categories?.forEach((c) => params.append("categories[]", c));
      newFilters.frameworks?.forEach((f) => params.append("frameworks[]", f));
      newFilters.stylings?.forEach((s) => params.append("stylings[]", s));
      newFilters.features?.forEach((f) => params.append("features[]", f));

      if (newFilters.free) params.set("free", "1");
      if (newFilters.featured) params.set("featured", "1");
      if (newFilters.on_sale) params.set("on_sale", "1");
      if (newFilters.min_price)
        params.set("min_price", String(newFilters.min_price));
      if (newFilters.max_price)
        params.set("max_price", String(newFilters.max_price));
      if (newFilters.min_rating)
        params.set("min_rating", String(newFilters.min_rating));
      if (newFilters.q) params.set("q", newFilters.q);
      if (newFilters.sort && newFilters.sort !== "best-selling")
        params.set("sort", newFilters.sort);
      if (newFilters.page && newFilters.page > 1)
        params.set("page", String(newFilters.page));
      if (newFilters.per_page && newFilters.per_page !== 12)
        params.set("per_page", String(newFilters.per_page));

      const queryString = params.toString();
      router.push(queryString ? `/components?${queryString}` : "/components", {
        scroll: false,
      });
    },
    [router]
  );

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load components when filters change
  useEffect(() => {
    loadComponents();
  }, [filters]);

  // Update filters when URL changes
  useEffect(() => {
    setFilters(getFiltersFromUrl());
  }, [searchParams, getFiltersFromUrl]);

  const loadInitialData = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        publicCategoriesAPI.getMenu(),
        publicTagsAPI.getGrouped(),
      ]);

      setCategories(categoriesRes.data.data);
      setTags(tagsRes.data.data);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  const loadComponents = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {};

      if (filters.categories?.length)
        params["categories[]"] = filters.categories;
      if (filters.frameworks?.length)
        params["frameworks[]"] = filters.frameworks;
      if (filters.stylings?.length) params["stylings[]"] = filters.stylings;
      if (filters.features?.length) params["features[]"] = filters.features;
      if (filters.free) params.free = 1;
      if (filters.featured) params.featured = 1;
      if (filters.on_sale) params.on_sale = 1;
      if (filters.min_price) params.min_price = filters.min_price;
      if (filters.max_price) params.max_price = filters.max_price;
      if (filters.min_rating) params.min_rating = filters.min_rating;
      if (filters.q) params.q = filters.q;
      if (filters.sort) params.sort = filters.sort;
      params.page = filters.page || 1;
      params.per_page = filters.per_page || 12;

      const response = await publicComponentsAPI.getAll(params);
      setComponents(response.data.data);
      setMeta(response.data.meta);
    } catch (error) {
      console.error("Error loading components:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const handleSearch = (q: string) => {
    const newFilters = { ...filters, q: q || undefined, page: 1 };
    handleFilterChange(newFilters);
  };

  const handleSortChange = (sort: string) => {
    const newFilters = { ...filters, sort, page: 1 };
    handleFilterChange(newFilters);
  };

  const handlePerPageChange = (perPage: number) => {
    const newFilters = { ...filters, per_page: perPage, page: 1 };
    handleFilterChange(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    handleFilterChange(newFilters);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemoveFilter = (key: string, value?: string) => {
    const newFilters = { ...filters };

    if (value && Array.isArray(newFilters[key as keyof FilterParams])) {
      (newFilters[key as keyof FilterParams] as string[]) = (
        newFilters[key as keyof FilterParams] as string[]
      ).filter((v) => v !== value);
      if ((newFilters[key as keyof FilterParams] as string[]).length === 0) {
        delete newFilters[key as keyof FilterParams];
      }
    } else if (key === "price") {
      delete newFilters.min_price;
      delete newFilters.max_price;
    } else {
      delete newFilters[key as keyof FilterParams];
    }

    newFilters.page = 1;
    handleFilterChange(newFilters);
  };

  const handleClearAllFilters = () => {
    handleFilterChange({ page: 1, per_page: filters.per_page });
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-6">
              <FilterSidebar
                categories={categories}
                tags={tags}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Search & Toolbar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
              {/* Search Bar */}
              <SearchBar value={filters.q || ""} onChange={handleSearch} />

              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <HiFilter className="w-5 h-5" />
                  فیلترها
                </button>

                {/* Results Count */}
                <p className="text-sm text-gray-500">
                  {meta.total} نتیجه یافت شد
                </p>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <select
                    value={filters.sort || "best-selling"}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-3 py-2 bg-gray-100 border-0 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {/* Per Page */}
                  <select
                    value={filters.per_page || 12}
                    onChange={(e) =>
                      handlePerPageChange(parseInt(e.target.value))
                    }
                    className="px-3 py-2 bg-gray-100 border-0 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
                  >
                    {PER_PAGE_OPTIONS.map((num) => (
                      <option key={num} value={num}>
                        {num} در صفحه
                      </option>
                    ))}
                  </select>

                  {/* View Toggle */}
                  <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setView("grid")}
                      className={`p-2 rounded-md transition-colors ${
                        view === "grid"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <HiViewGrid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setView("list")}
                      className={`p-2 rounded-md transition-colors ${
                        view === "list"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <HiViewList className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            <div className="mb-6">
              <ActiveFilters
                filters={filters}
                categories={categories}
                tags={tags}
                onRemove={handleRemoveFilter}
                onClearAll={handleClearAllFilters}
              />
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : components.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiViewGrid className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  کامپوننتی یافت نشد
                </h3>
                <p className="text-gray-500 mb-4">
                  با فیلترهای انتخاب شده نتیجه‌ای یافت نشد
                </p>
                <button
                  onClick={handleClearAllFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  پاک کردن فیلترها
                </button>
              </div>
            ) : (
              /* Components Grid/List */
              <>
                <div
                  className={
                    view === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {components.map((component) => (
                    <ComponentCard
                      key={component.id}
                      component={component}
                      view={view}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8">
                  <Pagination
                    currentPage={meta.current_page}
                    lastPage={meta.last_page}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white shadow-xl">
            <FilterSidebar
              categories={categories}
              tags={tags}
              filters={filters}
              onFilterChange={(newFilters) => {
                handleFilterChange(newFilters);
              }}
              onClose={() => setMobileFilterOpen(false)}
              isMobile
            />
          </div>
        </div>
      )}
    </div>
  );
}
