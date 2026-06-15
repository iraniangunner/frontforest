"use client";
// app/search/_hooks/useSearchFilterPush.ts
import { useTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * useSearchFilterPush
 *
 * صفحه‌ی /search فقط فیلترهای ساده دارد (قیمت، رتبه، تخفیف، موجودی،
 * سورت، صفحه‌بندی) — بدون دسته‌بندی. همه چیز همیشه روی /search می‌ماند.
 */
export function useSearchFilterPush() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigate = (qs: string) => {
    startTransition(() => {
      router.push(qs ? `/search?${qs}` : "/search", { scroll: false });
    });
    scrollToTop();
    if (typeof window !== "undefined" && (window as any).__topLoaderStart) {
      (window as any).__topLoaderStart();
    }
  };

  const push = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const p = new URLSearchParams(searchParams.toString());
      p.delete("page");

      Object.entries(updates).forEach(([k, v]) => {
        if (v) {
          p.set(k, v as string);
        } else {
          p.delete(k);
        }
      });

      navigate(p.toString());
    },
    [router, searchParams]
  );

  const clearAll = useCallback(
    (keepKeys = ["q", "per_page", "view", "sort"]) => {
      const p = new URLSearchParams();
      keepKeys.forEach((k) => {
        const v = searchParams.get(k);
        if (v) p.set(k, v);
      });
      navigate(p.toString());
    },
    [router, searchParams]
  );

  return { push, clearAll, isPending };
}
