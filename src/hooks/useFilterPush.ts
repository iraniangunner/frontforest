"use client";
// app/products/_hooks/useFilterPush.ts
import { useTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useFilterPush() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const push = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const p = new URLSearchParams(searchParams.toString());
      p.delete("page");
      Object.entries(updates).forEach(([k, v]) => {
        if (k === "categories[]") {
          p.delete("categories[]");
          if (Array.isArray(v) && v.length)
            v.forEach((x) => p.append("categories[]", x));
          return;
        }
        if (v) {
          p.set(k, v as string);
        } else {
          p.delete(k);
        }
      });
      const qs = p.toString();
      startTransition(() => {
        router.push(qs ? `/products?${qs}` : "/products", { scroll: false });
      });
      scrollToTop(); // 👈
      if (typeof window !== "undefined" && (window as any).__topLoaderStart) {
        (window as any).__topLoaderStart();
      }
    },
    [router, searchParams]
  );

  const clearAll = useCallback(
    (keepKeys = ["per_page", "view", "sort"]) => {
      const p = new URLSearchParams();
      keepKeys.forEach((k) => {
        const v = searchParams.get(k);
        if (v) p.set(k, v);
      });
      const qs = p.toString();
      startTransition(() => {
        router.push(qs ? `/products?${qs}` : "/products", { scroll: false });
      });
      scrollToTop(); // 👈
      if (typeof window !== "undefined" && (window as any).__topLoaderStart) {
        (window as any).__topLoaderStart();
      }
    },
    [router, searchParams]
  );

  return { push, clearAll, isPending };
}
