import { publicComponentsAPI } from "@/lib/api";
import { FilterParams } from "@/types";
import ComponentsGrid from "./Componentsgrid";
import Pagination from "./Pagination";

interface ComponentsGridServerProps {
  filters: FilterParams;
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

export default async function ComponentsGridServer({
  filters,
}: ComponentsGridServerProps) {
  const response = await publicComponentsAPI.getAll(buildApiParams(filters));
  const components = response.data.data;
  const meta = response.data.meta;

  return (
    <>
      {/* Results Count */}
      <p className="text-sm text-gray-500 mb-4">{meta.total} نتیجه یافت شد</p>

      {/* Components Grid */}
      <ComponentsGrid components={components} />

      {/* Pagination */}
      <div className="mt-8">
        <Pagination
          currentPage={meta.current_page}
          lastPage={meta.last_page}
          basePath="/components"
        />
      </div>
    </>
  );
}
