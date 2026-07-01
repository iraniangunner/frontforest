// app/_components/ui/CategoryProductsPage.tsx  (SERVER COMPONENT)
import Pagination from "@/app/_components/ui/Pagination";
import ProductsGridWrapper from "@/app/_components/ui/ProductsGridWrapper";
import { FilterParams } from "@/types";
import { Suspense } from "react";
import CategoryFilter from "./CategoryFilter";
import CategoryToolbar from "./CategoryToolbar";
import { FilterProvider } from "./FilterProvider";
import FilterDrawer from "./FilterDrawer";

export interface CategoryData {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  products_count?: number;
  children?: {
    id: number;
    name: string;
    slug: string;
    products_count?: number;
  }[];
}

interface Props {
  category: CategoryData;
  parentCategory: CategoryData;
  searchParams: Record<string, string | string[] | undefined>;
  basePath: string;
}

function parseParams(
  sp: Record<string, string | string[] | undefined>,
  forcedCategorySlugs: string[],
): FilterParams {
  const p: FilterParams = {};
  const cats = sp["categories[]"];
  const extraCats = cats ? (Array.isArray(cats) ? cats : [cats]) : [];
  p.categories =
    extraCats.length > 0
      ? Array.from(new Set(extraCats))
      : Array.from(new Set(forcedCategorySlugs));
  if (sp.brand && typeof sp.brand === "string") p.brand = sp.brand;
  if (sp.on_sale === "1") p.on_sale = true;
  if (sp.in_stock === "1") p.in_stock = true;
  if (sp.featured === "1") p.featured = true;
  if (sp.min_price && typeof sp.min_price === "string")
    p.min_price = +sp.min_price;
  if (sp.max_price && typeof sp.max_price === "string")
    p.max_price = +sp.max_price;
  if (sp.min_rating && typeof sp.min_rating === "string")
    p.min_rating = +sp.min_rating;
  p.sort = sp.sort && typeof sp.sort === "string" ? sp.sort : "best-selling";
  p.page = sp.page && typeof sp.page === "string" ? +sp.page : 1;
  p.per_page =
    sp.per_page && typeof sp.per_page === "string"
      ? Math.min(+sp.per_page, 48)
      : 12;
  return p;
}

function buildApiParams(f: FilterParams): Record<string, unknown> {
  const p: Record<string, unknown> = {};
  if (f.categories?.length) p["categories[]"] = f.categories;
  if (f.brand) p.brand = f.brand;
  if (f.on_sale) p.on_sale = 1;
  if (f.in_stock) p.in_stock = 1;
  if (f.featured) p.featured = 1;
  if (f.min_price) p.min_price = f.min_price;
  if (f.max_price) p.max_price = f.max_price;
  if (f.min_rating) p.min_rating = f.min_rating;
  if (f.sort) p.sort = f.sort;
  p.page = f.page || 1;
  p.per_page = f.per_page || 12;
  return p;
}

function ProductsSkeleton({ view }: { view: "grid" | "list" }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl overflow-hidden border border-[#F0F0F0] animate-pulse"
        >
          <div className="aspect-square bg-[#F5F5F5]" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-[#F5F5F5] rounded w-1/3" />
            <div className="h-4 bg-[#F5F5F5] rounded" />
            <div className="h-4 bg-[#F5F5F5] rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CategoryBreadcrumbJsonLd({
  category,
  parent,
}: {
  category: CategoryData;
  parent?: CategoryData;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const items = [
    ...(parent
      ? [{ name: parent.name, url: `${siteUrl}/products/${parent.slug}` }]
      : []),
    {
      name: category.name,
      url: parent
        ? `${siteUrl}/products/${parent.slug}/${category.slug}`
        : `${siteUrl}/products/${category.slug}`,
    },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function CategoryProductsPage({
  category,
  parentCategory,
  searchParams,
  basePath,
}: Props) {
  const forcedCategorySlugs = Array.from(
    new Set([category.slug, ...(category.children?.map((c) => c.slug) || [])]),
  );
  const filters = parseParams(searchParams, forcedCategorySlugs);
  const view = (searchParams.view as "grid" | "list") || "grid";

  const params = buildApiParams(filters);

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/products`);

  Object.entries(params).forEach(([key, value]) => {
    if (value == null) return;

    if (Array.isArray(value)) {
      value.forEach((v) => url.searchParams.append(key, String(v)));
    } else {
      url.searchParams.append(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  const productsRes = await res.json();

  const products = productsRes.data || [];
  const meta = productsRes.meta || {
    current_page: 1,
    last_page: 1,
    total: 0,
    price_range: null,
  };

  const priceRange =
    meta.price_range?.max > 0 ? meta.price_range : { min: 0, max: 10_000_000 };

  const siblings = parentCategory.children || [];

  return (
    <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-[#242424]">{category.name}</h1>
          <p className="text-sm text-[#898989] mt-0.5">
            {(meta.total || 0).toLocaleString("fa-IR")} محصول در دسترس
          </p>
        </div>

        {/* همه‌چیز داخل FilterProvider — یک منبع واحد state */}
        <FilterProvider>
          <div className="flex gap-5 items-start">
            {/* sidebar دسکتاپ */}
            <aside className="hidden lg:block w-60 flex-shrink-0 sticky top-6">
              <CategoryFilter
                siblings={siblings}
                parentSlug={parentCategory.slug}
                priceRange={priceRange}
              />
            </aside>

            {/* محتوای اصلی */}
            <main className="flex-1 min-w-0 space-y-4">
              <CategoryToolbar
                total={meta.total || 0}
                siblings={siblings}
                parentSlug={parentCategory.slug}
                priceRange={priceRange}
              />

              {/* فقط گرید با تغییر فیلتر/صفحه به‌روز می‌شود */}
              <Suspense
                key={JSON.stringify(filters)}
                fallback={<ProductsSkeleton view={view} />}
              >
                <ProductsGridWrapper products={products} view={view} />
              </Suspense>

              {(meta.last_page || 1) > 1 && (
                <Pagination
                  currentPage={meta.current_page || 1}
                  lastPage={meta.last_page || 1}
                  basePath={basePath}
                />
              )}
            </main>
          </div>

          {/* drawer موبایل — state از context، framer-motion */}
          <FilterDrawer>
            <CategoryFilter
              siblings={siblings}
              parentSlug={parentCategory.slug}
              priceRange={priceRange}
              isMobile
            />
          </FilterDrawer>
        </FilterProvider>
      </div>
    </div>
  );
}
