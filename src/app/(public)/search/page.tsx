// app/search/page.tsx  ←  SERVER COMPONENT
import Pagination from "@/app/_components/ui/Pagination";
import SearchFilter from "@/app/_components/ui/SearchFilter";
import SearchToolbar from "@/app/_components/ui/SearchToolbar";
import ProductsGridWrapper from "@/app/_components/ui/ProductsGridWrapper";
import { publicProductsAPI } from "@/lib/api";
import { FilterParams } from "@/types";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "نتایج جستجو | فروشگاه پترا",
  description: "جستجو در محصولات فروشگاه پترا",
  robots: { index: false, follow: true },
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// ── URL searchParams → FilterParams ─────────────────────────────────────────
function parseParams(
  sp: Record<string, string | string[] | undefined>,
): FilterParams {
  const p: FilterParams = {};

  if (sp.q && typeof sp.q === "string") p.q = sp.q;
  if (sp.brand && typeof sp.brand === "string") p.brand = sp.brand;
  if (sp.on_sale === "1") p.on_sale = true;
  if (sp.in_stock === "1") p.in_stock = true;
  if (sp.featured === "1") p.featured = true;

  // ── دسته‌بندی‌های انتخاب‌شده (categories[]) ──
  const cats = sp["categories[]"];
  const catList = cats ? (Array.isArray(cats) ? cats : [cats]) : [];
  if (catList.length > 0) {
    p.categories = Array.from(new Set(catList));
  }

  if (sp.min_price && typeof sp.min_price === "string")
    p.min_price = +sp.min_price;
  if (sp.max_price && typeof sp.max_price === "string")
    p.max_price = +sp.max_price;
  if (sp.min_rating && typeof sp.min_rating === "string")
    p.min_rating = +sp.min_rating;
  if (sp.sort && typeof sp.sort === "string") p.sort = sp.sort;

  p.page = sp.page && typeof sp.page === "string" ? +sp.page : 1;
  p.per_page =
    sp.per_page && typeof sp.per_page === "string"
      ? Math.min(+sp.per_page, 48)
      : 12;

  return p;
}

// ── FilterParams → API query params ─────────────────────────────────────────
function buildApiParams(f: FilterParams): Record<string, unknown> {
  const p: Record<string, unknown> = {};

  if (f.q) p.q = f.q;
  if (f.brand) p.brand = f.brand;
  if (f.on_sale) p.on_sale = 1;
  if (f.in_stock) p.in_stock = 1;
  if (f.featured) p.featured = 1;
  if (f.categories?.length) p["categories[]"] = f.categories;
  if (f.min_price) p.min_price = f.min_price;
  if (f.max_price) p.max_price = f.max_price;
  if (f.min_rating) p.min_rating = f.min_rating;
  if (f.sort) p.sort = f.sort;

  p.page = f.page || 1;
  p.per_page = f.per_page || 12;

  return p;
}

// ── Loading Skeleton ─────────────────────────────────────────────────────────
function ProductsSkeleton({ view }: { view: "grid" | "list" }) {
  if (view === "list")
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 flex gap-4 border border-[#F0F0F0] animate-pulse"
          >
            <div className="w-20 h-20 rounded-xl bg-[#F5F5F5] flex-shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-3 bg-[#F5F5F5] rounded w-1/4" />
              <div className="h-4 bg-[#F5F5F5] rounded w-3/4" />
              <div className="h-3 bg-[#F5F5F5] rounded w-1/2" />
            </div>
            <div className="w-28 space-y-2 py-1">
              <div className="h-3 bg-[#F5F5F5] rounded" />
              <div className="h-5 bg-[#F5F5F5] rounded" />
              <div className="h-8 bg-[#F5F5F5] rounded mt-2" />
            </div>
          </div>
        ))}
      </div>
    );

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
            <div className="flex justify-between items-center pt-1">
              <div className="h-4 bg-[#F5F5F5] rounded w-1/3" />
              <div className="w-9 h-9 bg-[#F5F5F5] rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-[#EDEDED] py-20 text-center">
      <p className="text-5xl mb-4">📦</p>
      <h3 className="font-semibold text-[#242424] text-lg mb-1">
        محصولی یافت نشد
      </h3>
      <p className="text-sm text-[#AFAFAF]">
        فیلترها را تغییر دهید یا جستجوی دیگری امتحان کنید
      </p>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filters = parseParams(sp);
  const view = (sp.view as "grid" | "list") || "grid";

  const productsRes = await publicProductsAPI.getAll(buildApiParams(filters));
  const products = productsRes.data.data || [];
  const meta = productsRes.data.meta || {
    current_page: 1,
    last_page: 1,
    total: 0,
    price_range: null,
  };

  const priceRange: { min: number; max: number } =
    meta.price_range?.max > 0 ? meta.price_range : { min: 0, max: 10_000_000 };

  return (
    <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        {/* ── عنوان صفحه ── */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-[#242424]">
            {filters.q ? `نتایج جستجو برای «${filters.q}»` : "جستجوی محصولات"}
          </h1>
          <p className="text-sm text-[#898989] mt-0.5">
            {(meta.total || 0).toLocaleString("fa-IR")} محصول یافت شد
          </p>
        </div>

        <div className="flex gap-5 items-start">
          {/* ── Sidebar — desktop ── */}
          <aside className="hidden lg:block w-60 flex-shrink-0 sticky top-6">
            <Suspense
              fallback={
                <div className="bg-white rounded-2xl border border-[#F0F0F0] p-4 space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 bg-[#F5F5F5] rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              }
            >
              <SearchFilter priceRange={priceRange} />
            </Suspense>
          </aside>

          {/* ── محتوا ── */}
          <main className="flex-1 min-w-0 space-y-4">
            <Suspense
              fallback={
                <div className="h-14 bg-white rounded-2xl border border-[#F0F0F0] animate-pulse" />
              }
            >
              <SearchToolbar total={meta.total || 0} priceRange={priceRange} />
            </Suspense>

            <Suspense
              key={JSON.stringify(filters)}
              fallback={<ProductsSkeleton view={view} />}
            >
              {products.length === 0 ? (
                <EmptyState />
              ) : (
                <ProductsGridWrapper
                  products={products}
                  view={view}
                  isPending={false}
                />
              )}
            </Suspense>

            {(meta.last_page || 1) > 1 && (
              <Suspense>
                <Pagination
                  currentPage={meta.current_page || 1}
                  lastPage={meta.last_page || 1}
                  basePath="/search"
                />
              </Suspense>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
