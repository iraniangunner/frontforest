"use client";

// app/_components/ui/ProductsGridWrapper.tsx
// گرید محصولات. هنگام لودِ فیلتر/سورت/صفحه (isPending از FilterProvider) skeleton نشان می‌دهد.

import ProductCard from "./ProductCard";
import { Product } from "@/types";
import { useFilter } from "./FilterProvider";

function GridSkeleton({ view }: { view: "grid" | "list" }) {
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

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-[#EDEDED] py-20 text-center">
      <p className="text-5xl mb-4">📦</p>
      <h3 className="font-semibold text-[#242424] text-lg mb-1">
        محصولی یافت نشد
      </h3>
      <p className="text-sm text-[#AFAFAF]">فیلترها را تغییر دهید</p>
    </div>
  );
}

interface Props {
  products: Product[];
  view: "grid" | "list";
}

export default function ProductsGridWrapper({ products, view }: Props) {
  const { isPending } = useFilter();

  return (
    <div className="relative">
      {isPending ? (
        <GridSkeleton view={view} />
      ) : products.length === 0 ? (
        <EmptyState />
      ) : (
        <div
          className={
            view === "list"
              ? "space-y-3"
              : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4"
          }
        >
          {products.map((p) => (
            <ProductCard key={p.id} product={p} view={view} />
          ))}
        </div>
      )}
    </div>
  );
}
