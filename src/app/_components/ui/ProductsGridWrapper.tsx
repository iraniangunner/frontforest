// "use client";

// // app/products/_components/ProductsGridWrapper.tsx
// // این کامپوننت skeleton رو روی گرید نشون میده وقتی فیلتر در حال اعمال هست
// import { useTransition, createContext, useContext } from "react";
// import ProductCard from "./ProductCard";
// import { Product } from "@/types";

// // Context برای share کردن isPending با Filter و Toolbar
// export const FilterPendingContext = createContext(false);
// export const useFilterPending = () => useContext(FilterPendingContext);

// // ── Skeleton ──
// function GridSkeleton({ view }: { view: "grid" | "list" }) {
//   if (view === "list")
//     return (
//       <div className="space-y-3">
//         {Array.from({ length: 6 }).map((_, i) => (
//           <div
//             key={i}
//             className="bg-white rounded-xl p-4 flex gap-4 border border-gray-100 animate-pulse"
//           >
//             <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0" />
//             <div className="flex-1 space-y-2 py-1">
//               <div className="h-3 bg-gray-100 rounded w-1/4" />
//               <div className="h-4 bg-gray-100 rounded w-3/4" />
//               <div className="h-3 bg-gray-100 rounded w-1/2" />
//             </div>
//             <div className="w-28 space-y-2 py-1">
//               <div className="h-3 bg-gray-100 rounded" />
//               <div className="h-5 bg-gray-100 rounded" />
//             </div>
//           </div>
//         ))}
//       </div>
//     );

//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
//       {Array.from({ length: 9 }).map((_, i) => (
//         <div
//           key={i}
//           className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse"
//         >
//           <div className="aspect-square bg-gray-100" />
//           <div className="p-3 space-y-2">
//             <div className="h-3 bg-gray-100 rounded w-1/3" />
//             <div className="h-4 bg-gray-100 rounded" />
//             <div className="h-4 bg-gray-100 rounded w-2/3" />
//             <div className="flex justify-between items-center pt-1">
//               <div className="h-4 bg-gray-100 rounded w-1/3" />
//               <div className="w-9 h-9 bg-gray-100 rounded-xl" />
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ── Empty state ──
// function EmptyState() {
//   return (
//     <div className="bg-white rounded-xl border border-dashed border-gray-200 py-20 text-center">
//       <p className="text-5xl mb-4">📦</p>
//       <h3 className="font-semibold text-gray-800 text-lg mb-1">
//         محصولی یافت نشد
//       </h3>
//       <p className="text-sm text-gray-400">فیلترها را تغییر دهید</p>
//     </div>
//   );
// }

// interface Props {
//   products: Product[];
//   view: "grid" | "list";
//   isPending: boolean;
// }

// export default function ProductsGridWrapper({
//   products,
//   view,
//   isPending,
// }: Props) {
//   return (
//     <div className="relative">
//       {/* overlay skeleton وقتی فیلتر در حال اعمال هست */}
//       {isPending ? (
//         <GridSkeleton view={view} />
//       ) : products.length === 0 ? (
//         <EmptyState />
//       ) : (
//         <div
//           className={
//             view === "list"
//               ? "space-y-3"
//               : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4"
//           }
//         >
//           {products.map((p) => (
//             <ProductCard key={p.id} product={p} view={view} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

// app/products/_components/ProductsGridWrapper.tsx
// این کامپوننت skeleton رو روی گرید نشون میده وقتی فیلتر/صفحه در حال اعمال هست.
import { createContext, useContext } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types";

// ── Context مشترک فیلتر ──
// isPending و توابع push/clearAll را از یک instance واحد (در FilterDrawerWrapper)
// به همه‌ی فرزندان (Toolbar, Filter, Grid) می‌رساند تا همه isPending مشترک
// داشته باشند و skeleton هنگام هر transition (تغییر فیلتر/سورت/صفحه) ظاهر شود.
interface FilterCtx {
  isPending: boolean;
  push: (updates: Record<string, string | string[] | null>) => void;
  clearAll: (keepKeys?: string[]) => void;
}

export const FilterContext = createContext<FilterCtx | null>(null);

export const useFilterCtx = () => {
  const ctx = useContext(FilterContext);
  if (!ctx)
    throw new Error("useFilterCtx must be used within FilterContext.Provider");
  return ctx;
};

// سازگاری با کد قبلی: هوک ساده که فقط isPending را می‌دهد.
export const useFilterPending = () =>
  useContext(FilterContext)?.isPending ?? false;

// ── Skeleton ──
function GridSkeleton({ view }: { view: "grid" | "list" }) {
  if (view === "list")
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 flex gap-4 border border-[#F0F0F0] animate-pulse"
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
          className="bg-white rounded-xl overflow-hidden border border-[#F0F0F0] animate-pulse"
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

// ── Empty state ──
function EmptyState() {
  return (
    <div className="bg-white rounded-xl border border-dashed border-[#EDEDED] py-20 text-center">
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
  // isPending دیگر prop اجباری نیست؛ از context خوانده می‌شود.
  // برای سازگاری عقب‌رو نگه داشته شده (در صورت پاس‌دادن، نادیده گرفته می‌شود).
  isPending?: boolean;
}

export default function ProductsGridWrapper({ products, view }: Props) {
  // isPending را از context مشترک می‌گیریم (نه از prop).
  const isPending = useFilterPending();

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
