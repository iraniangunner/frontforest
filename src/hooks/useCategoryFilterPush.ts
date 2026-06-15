"use client";
// app/products/_hooks/useCategoryFilterPush.ts
import { useTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * useCategoryFilterPush
 *
 * در صفحات دسته‌بندی (/products/[parent] یا /products/[parent]/[child])،
 * sidebar فیلتر همیشه فقط children یک parent ثابت را نشان می‌دهد
 * (flat، بدون hierarchy). یعنی انتخاب‌های دسته‌بندی همیشه زیرمجموعه‌ای
 * از children همین parent هستند.
 *
 * @param parentSlug - slug دسته‌ی والد ثابت همین صفحه (مثلاً "home").
 *                      همه‌ی مسیرهای تولیدشده زیر همین parent خواهند بود.
 */
export function useCategoryFilterPush(parentSlug: string) {
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
   * push بروزرسانی فیلترها رو اعمال می‌کند.
   * منطق دسته‌بندی (categories[]) — همه چیز زیر همین parentSlug است:
   *  - 0 زیردسته انتخاب شده   -> /products/[parentSlug]
   *  - 1 زیردسته انتخاب شده   -> /products/[parentSlug]/[child]
   *  - 2+ زیردسته انتخاب شده  -> /products/[parentSlug]?categories[]=a&categories[]=b (query, noindex)
   *
   * سایر فیلترها (قیمت، رتبه، تخفیف، موجودی، سورت، صفحه‌بندی) همیشه query هستند.
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
        navigate(`/products/${parentSlug}`, qs);
        return;
      }

      if (cats.length === 1) {
        navigate(`/products/${parentSlug}/${cats[0]}`, qs);
        return;
      }

      // چند زیردسته همزمان -> بمان روی /products/[parentSlug] با categories[] در query
      const withCats = new URLSearchParams(qs);
      cats.forEach((c) => withCats.append("categories[]", c));
      navigate(`/products/${parentSlug}`, withCats.toString());
    },
    [router, searchParams, parentSlug]
  );

  const clearAll = useCallback(
    (keepKeys = ["per_page", "view", "sort"]) => {
      const p = new URLSearchParams();
      keepKeys.forEach((k) => {
        const v = searchParams.get(k);
        if (v) p.set(k, v);
      });
      navigate(`/products/${parentSlug}`, p.toString());
    },
    [router, searchParams, parentSlug]
  );

  return { push, clearAll, isPending };
}
