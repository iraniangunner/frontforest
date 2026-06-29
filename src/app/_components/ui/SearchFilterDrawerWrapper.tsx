// "use client";

// import { useSearchParams, useRouter, usePathname } from "next/navigation";
// import SearchFilter from "./SearchFilter";
// interface MenuChild {
//   id: number;
//   name: string;
//   slug: string;
//   products_count?: number;
// }

// interface MenuParent {
//   id: number;
//   name: string;
//   slug: string;
//   icon_image?: string | null;
//   products_count?: number;
//   children?: MenuChild[];
// }

// interface Props {
//   menu: MenuParent[];
//   priceRange: { min: number; max: number };
//   children: React.ReactNode;
// }

// export default function SearchFilterDrawerWrapper({
//   menu,
//   priceRange,
//   children,
// }: Props) {
//   const sp = useSearchParams();
//   const router = useRouter();
//   const pathname = usePathname();

//   const isOpen = sp.get("filter") === "1";

//   const closeDrawer = () => {
//     const p = new URLSearchParams(sp.toString());
//     p.delete("filter");
//     router.push(`${pathname}?${p.toString()}`, {
//       scroll: false,
//     });
//   };

//   return (
//     <>
//       {children}

//       {isOpen && (
//         <div className="fixed inset-0 z-[80] flex lg:hidden" dir="rtl">
//           <div
//             className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//             onClick={closeDrawer}
//           />

//           <div className="relative mr-auto w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col">
//             <SearchFilter
//               menu={menu}
//               priceRange={priceRange}
//               isMobile
//               onClose={closeDrawer}
//             />
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

"use client";

// app/_components/ui/SearchFilterDrawerWrapper.tsx
// مثل FilterDrawerWrapper سیستم products: یک instance واحد از useSearchFilterPush
// و پخش push/clearAll/isPending با FilterContext به فرزندان (Toolbar, Filter, Grid,
// Pagination) تا skeleton هنگام تغییر فیلتر/سورت/صفحه ظاهر شود.

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
}

export default function SearchFilterDrawerWrapper({
  menu,
  priceRange,
  children,
}: Props) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // یک instance واحد — همه‌ی فرزندان از همین push/clearAll/isPending استفاده می‌کنند.
  const { push, clearAll, isPending } = useSearchFilterPush();

  const isOpen = sp.get("filter") === "1";

  const closeDrawer = () => {
    const p = new URLSearchParams(sp.toString());
    p.delete("filter");
    router.push(`${pathname}?${p.toString()}`, {
      scroll: false,
    });
  };

  return (
    <FilterContext.Provider value={{ push, clearAll, isPending }}>
      {children}

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
