// "use client";
// // app/products/_hooks/useFilterPush.ts
// import { useTransition, useCallback } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// export function useFilterPush() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [isPending, startTransition] = useTransition();

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const push = useCallback(
//     (updates: Record<string, string | string[] | null>) => {
//       const p = new URLSearchParams(searchParams.toString());
//       p.delete("page");
//       Object.entries(updates).forEach(([k, v]) => {
//         if (k === "categories[]") {
//           p.delete("categories[]");
//           if (Array.isArray(v) && v.length)
//             v.forEach((x) => p.append("categories[]", x));
//           return;
//         }
//         if (v) {
//           p.set(k, v as string);
//         } else {
//           p.delete(k);
//         }
//       });
//       const qs = p.toString();
//       startTransition(() => {
//         router.push(qs ? `/products?${qs}` : "/products", { scroll: false });
//       });
//       scrollToTop(); // 👈
//       if (typeof window !== "undefined" && (window as any).__topLoaderStart) {
//         (window as any).__topLoaderStart();
//       }
//     },
//     [router, searchParams]
//   );

//   const clearAll = useCallback(
//     (keepKeys = ["per_page", "view", "sort"]) => {
//       const p = new URLSearchParams();
//       keepKeys.forEach((k) => {
//         const v = searchParams.get(k);
//         if (v) p.set(k, v);
//       });
//       const qs = p.toString();
//       startTransition(() => {
//         router.push(qs ? `/products?${qs}` : "/products", { scroll: false });
//       });
//       scrollToTop(); // 👈
//       if (typeof window !== "undefined" && (window as any).__topLoaderStart) {
//         (window as any).__topLoaderStart();
//       }
//     },
//     [router, searchParams]
//   );

//   return { push, clearAll, isPending };
// }


"use client";
// app/products/_hooks/useFilterPush.ts
import { useTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface CategoryChild {
  id: number;
  name: string;
  slug: string;
  products_count?: number;
}
interface CategoryWithChildren {
  id: number;
  name: string;
  slug: string;
  products_count?: number;
  children?: CategoryChild[];
}

/**
 * useFilterPush
 *
 * @param categories - لیست کامل دسته‌بندی‌ها (parent + children) برای تشخیص
 *                      اینکه یک slug، parent هست یا child و parent‌اش کیست.
 *                      این پارامتر اختیاریه؛ اگه پاس نشه، فقط به /products/[slug]
 *                      ریدایرکت می‌شه و خود صفحه‌ی [slug] مسئول ریدایرکت نهایی
 *                      به /products/[parent]/[child] است (یک round-trip اضافه).
 */
export function useFilterPush(categories?: CategoryWithChildren[]) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigate = (basePath: string, qs: string) => {
    startTransition(() => {
      router.push(qs ? `${basePath}?${qs}` : basePath, { scroll: false });
    });
    scrollToTop();
    if (typeof window !== "undefined" && (window as any).__topLoaderStart) {
      (window as any).__topLoaderStart();
    }
  };

  /**
   * با گرفتن یک slug، مسیر کامل route برای آن دسته را برمی‌گرداند:
   *  - اگه parent باشه          -> /products/[slug]
   *  - اگه child یک parent باشه -> /products/[parent]/[slug]
   *  - اگه در لیست categories نباشه -> /products/[slug] (fallback)
   */
  const resolveCategoryPath = (slug: string): string => {
    if (!categories) return `/products/${slug}`;

    for (const cat of categories) {
      if (cat.slug === slug) return `/products/${slug}`;
      const child = cat.children?.find((c) => c.slug === slug);
      if (child) return `/products/${cat.slug}/${slug}`;
    }
    return `/products/${slug}`;
  };

  /**
   * push بروزرسانی فیلترها رو اعمال می‌کند.
   * منطق دسته‌بندی (categories[]):
   *  - 0 دسته انتخاب شده   -> /products
   *  - 1 دسته انتخاب شده   -> /products/[slug]  یا  /products/[parent]/[slug]
   *  - 2+ دسته انتخاب شده  -> /products?categories[]=a&categories[]=b (query, noindex)
   */
  const push = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const p = new URLSearchParams(searchParams.toString());
      p.delete("page");

      Object.entries(updates).forEach(([k, v]) => {
        if (k === "categories[]") {
          p.delete("categories[]");
          if (Array.isArray(v) && v.length) {
            v.forEach((x) => p.append("categories[]", x));
          }
          return;
        }
        if (v) {
          p.set(k, v as string);
        } else {
          p.delete(k);
        }
      });

      const cats = p.getAll("categories[]");
      p.delete("categories[]");
      const qs = p.toString();

      if (cats.length === 0) {
        navigate("/products", qs);
        return;
      }

      if (cats.length === 1) {
        navigate(resolveCategoryPath(cats[0]), qs);
        return;
      }

      // چند دسته همزمان -> بمان روی /products با categories[] در query
      const withCats = new URLSearchParams(qs);
      cats.forEach((c) => withCats.append("categories[]", c));
      navigate("/products", withCats.toString());
    },
    [router, searchParams, categories]
  );

  const clearAll = useCallback(
    (keepKeys = ["per_page", "view", "sort"]) => {
      const p = new URLSearchParams();
      keepKeys.forEach((k) => {
        const v = searchParams.get(k);
        if (v) p.set(k, v);
      });
      navigate("/products", p.toString());
    },
    [router, searchParams]
  );

  return { push, clearAll, isPending };
}
