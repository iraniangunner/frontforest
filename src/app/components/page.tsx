import {
  publicComponentsAPI,
  publicCategoriesAPI,
  publicTagsAPI,
} from "../../lib/api";
import { FilterParams } from "@/types";
import SearchBar from "../_components/ui/SearchBar";
import FilterSidebar from "../_components/ui/FilterSidebar";
import ActiveFilters from "../_components/ui/ActiveFilters";
import {
  SortSelect,
  PerPageSelect,
  ViewToggle,
  MobileFilterButton,
} from "../_components/ui/Toolbar";
import { Suspense } from "react";
import ComponentsGridServer from "../_components/ui/Componentsgridserver";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Helper to parse search params into FilterParams
function parseSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): FilterParams {
  const params: FilterParams = {};

  const categories = searchParams["categories[]"];
  if (categories) {
    params.categories = Array.isArray(categories) ? categories : [categories];
  }

  const frameworks = searchParams["frameworks[]"];
  if (frameworks) {
    params.frameworks = Array.isArray(frameworks) ? frameworks : [frameworks];
  }

  const stylings = searchParams["stylings[]"];
  if (stylings) {
    params.stylings = Array.isArray(stylings) ? stylings : [stylings];
  }

  const features = searchParams["features[]"];
  if (features) {
    params.features = Array.isArray(features) ? features : [features];
  }

  if (searchParams.free === "1") params.free = true;
  if (searchParams.featured === "1") params.featured = true;
  if (searchParams.on_sale === "1") params.on_sale = true;

  const minPrice = searchParams.min_price;
  if (minPrice && typeof minPrice === "string") {
    params.min_price = parseInt(minPrice);
  }

  const maxPrice = searchParams.max_price;
  if (maxPrice && typeof maxPrice === "string") {
    params.max_price = parseInt(maxPrice);
  }

  const minRating = searchParams.min_rating;
  if (minRating && typeof minRating === "string") {
    params.min_rating = parseInt(minRating);
  }

  const q = searchParams.q;
  if (q && typeof q === "string") params.q = q;

  const sort = searchParams.sort;
  if (sort && typeof sort === "string") params.sort = sort;

  const page = searchParams.page;
  params.page = page && typeof page === "string" ? parseInt(page) : 1;

  const perPage = searchParams.per_page;
  params.per_page =
    perPage && typeof perPage === "string" ? parseInt(perPage) : 12;

  return params;
}

// Build API params from FilterParams
function buildApiParams(filters: FilterParams): Record<string, unknown> {
  const params: Record<string, unknown> = {};

  if (filters.categories?.length) params["categories[]"] = filters.categories;
  if (filters.frameworks?.length) params["frameworks[]"] = filters.frameworks;
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

  return params;
}

export default async function ComponentsPage({ searchParams }: PageProps) {
  // Await searchParams in Next.js 15+
  const resolvedSearchParams = await searchParams;

  // Parse filters from URL
  const filters = parseSearchParams(resolvedSearchParams);

  // Fetch all data in parallel on the server
  const [categoriesRes, tagsRes, componentsRes] = await Promise.all([
    publicCategoriesAPI.getMenu(),
    publicTagsAPI.getGrouped(),
    publicComponentsAPI.getAll(buildApiParams(filters)),
  ]);

  const categories = categoriesRes.data.data;
  const tags = tagsRes.data.data;
  const components = componentsRes.data.data;
  const meta = componentsRes.data.meta;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-6">
              <FilterSidebar categories={categories} tags={tags} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Search & Toolbar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
              {/* Search Bar */}
              <SearchBar />

              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                {/* Mobile Filter Button */}
                <MobileFilterButton categories={categories} tags={tags} />

                {/* Results Count */}
                <p className="text-sm text-gray-500">
                  {meta.total} نتیجه یافت شد
                </p>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <SortSelect />

                  {/* Per Page */}
                  <PerPageSelect />

                  {/* View Toggle */}
                  <ViewToggle />
                </div>
              </div>
            </div>

            {/* Active Filters */}
            <div className="mb-6">
              <ActiveFilters categories={categories} tags={tags} />
            </div>

            {/* Components Grid/List */}

            <Suspense
              key={JSON.stringify(filters)}
              fallback={
                <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                </div>
              }
            >
              <ComponentsGridServer filters={filters} />
            </Suspense>

            {/* Pagination */}
            {/* <div className="mt-8">
              <Pagination
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                basePath="/components"
              />
            </div> */}
          </main>
        </div>
      </div>
    </div>
  );
}
