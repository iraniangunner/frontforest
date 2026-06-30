"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import CategoryFilter from "./CategoryFilter";
import { useCategoryFilterPush } from "@/hooks/useCategoryFilterPush";
import { FilterContext } from "./ProductsGridWrapper";

interface SiblingCategory {
  id: number;
  name: string;
  slug: string;
  products_count?: number;
}

interface Props {
  siblings: SiblingCategory[];
  parentSlug: string;
  priceRange: { min: number; max: number };
  /** محتوای اصلی (toolbar + grid + pagination) */
  children: React.ReactNode;
  /** sidebar دسکتاپ — اینجا داده می‌شود تا داخل Provider رندر شود */
  desktopSidebar?: React.ReactNode;
}

export default function FilterDrawerWrapper({
  siblings,
  parentSlug,
  priceRange,
  children,
  desktopSidebar,
}: Props) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // یک instance واحد — همه‌ی فرزندان از همین push/clearAll/isPending استفاده می‌کنند.
  const { push, clearAll, isPending } = useCategoryFilterPush(parentSlug);

  const isOpen = sp.get("filter") === "1";

  const closeDrawer = () => {
    const p = new URLSearchParams(sp.toString());
    p.delete("filter");
    router.push(`${pathname}?${p.toString()}`, { scroll: false });
  };

  return (
    <FilterContext.Provider value={{ push, clearAll, isPending }}>
      <div className="flex gap-5 items-start">
        {/* sidebar دسکتاپ — حالا داخل Provider است */}
        {desktopSidebar}

        {/* محتوای اصلی */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex lg:hidden" dir="rtl">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          <div className="relative mr-auto w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col">
            <CategoryFilter
              siblings={siblings}
              parentSlug={parentSlug}
              priceRange={priceRange}
              isMobile
              onClose={closeDrawer}
            />
          </div>
        </div>
      )}
    </FilterContext.Provider>
  );
}
