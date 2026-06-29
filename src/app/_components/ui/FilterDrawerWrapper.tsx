// "use client";


// import { useSearchParams, useRouter, usePathname } from "next/navigation";
// import CategoryFilter from "./CategoryFilter";

// interface SiblingCategory {
//   id: number;
//   name: string;
//   slug: string;
//   products_count?: number;
// }

// interface Props {
//   siblings: SiblingCategory[];
//   parentSlug: string;
//   priceRange: { min: number; max: number };
//   children: React.ReactNode;
// }

// export default function FilterDrawerWrapper({
//   siblings,
//   parentSlug,
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
//     router.push(`${pathname}?${p.toString()}`, { scroll: false });
//   };

//   return (
//     <>
//       {/* محتوای اصلی */}
//       {children}

//       {/* Mobile drawer */}
//       {isOpen && (
//         <div className="fixed inset-0 z-[80] flex lg:hidden" dir="rtl">
//           <div
//             className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//             onClick={closeDrawer}
//           />
//           <div className="relative mr-auto w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col">
//             <CategoryFilter
//               siblings={siblings}
//               parentSlug={parentSlug}
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

// app/products/_components/FilterDrawerWrapper.tsx
// drawer state رو در URL نگه می‌داریم (?filter=1) تا با تغییر route از دست نره.
// همچنین: push/clearAll/isPending را از یک instance واحدِ useCategoryFilterPush
// با Context به همه‌ی فرزندان (Toolbar, Filter, Grid) می‌رساند. این تضمین می‌کند
// همه isPending مشترک دارند و skeleton هنگام تغییر فیلتر/سورت/صفحه ظاهر می‌شود.

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
  children: React.ReactNode;
}

export default function FilterDrawerWrapper({
  siblings,
  parentSlug,
  priceRange,
  children,
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
      {/* محتوای اصلی */}
      {children}

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

