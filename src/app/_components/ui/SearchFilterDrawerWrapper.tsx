"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import SearchFilter from "./SearchFilter";
import { useSearchFilterPush } from "@/hooks/useSearchFilterPush";
import { FilterContext } from "./ProductsGridWrapper";

interface MenuChild {
  id: number;
  name: string;
  slug: string;
  products_count?: number;
}

interface MenuParent {
  id: number;
  name: string;
  slug: string;
  icon_image?: string | null;
  products_count?: number;
  children?: MenuChild[];
}

interface Props {
  menu: MenuParent[];
  priceRange: { min: number; max: number };
  children: React.ReactNode;
  desktopSidebar?: React.ReactNode;
}

export default function SearchFilterDrawerWrapper({
  menu,
  priceRange,
  children,
  desktopSidebar,
}: Props) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { push, clearAll, isPending } = useSearchFilterPush();

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
        <main className="flex-1 min-w-0 space-y-4">{children}</main>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[80] flex lg:hidden" dir="rtl">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          <div className="relative mr-auto w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col">
            <SearchFilter
              menu={menu}
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
