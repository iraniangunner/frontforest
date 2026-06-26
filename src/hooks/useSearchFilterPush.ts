"use client";
// app/search/_hooks/useSearchFilterPush.ts
import { useTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * useSearchFilterPush
 *
 * فیلترهای صفحه‌ی /search را روی URL می‌نویسد و همیشه روی /search می‌ماند.
 * از مقادیر آرایه‌ای (مثل categories[]) پشتیبانی می‌کند: هر عضو آرایه
 * به‌صورت یک پارامتر جداگانه نوشته می‌شود (categories[]=a&categories[]=b).
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
        // همیشه اول کلید قبلی را پاک کن (برای آرایه‌ها مهم است)
        p.delete(k);

        if (Array.isArray(v)) {
          // مقدار آرایه‌ای → چند پارامتر جداگانه
          v.forEach((item) => {
            if (item) p.append(k, item);
          });
        } else if (v) {
          p.set(k, v);
        }
        // اگر null/خالی بود، فقط حذف شد (بالا)
      });

      navigate(p.toString());
    },
    [router, searchParams],
  );

  // «حذف همه» — q (عبارت جستجو) را هم پاک می‌کند تا همه‌چیز کامل ریست شود.
  // فقط تنظیمات نمایشی (تعداد در صفحه، نوع نمایش، مرتب‌سازی) نگه داشته می‌شوند.
  const clearAll = useCallback(
    (keepKeys = ["per_page", "view", "sort"]) => {
      const p = new URLSearchParams();
      keepKeys.forEach((k) => {
        const v = searchParams.get(k);
        if (v) p.set(k, v);
      });
      navigate(p.toString());
    },
    [router, searchParams],
  );

  // پاک‌کردن فقط عبارت جستجو (q) — برای chip بالای نتایج
  const clearQuery = useCallback(() => {
    const p = new URLSearchParams(searchParams.toString());
    p.delete("q");
    p.delete("page");
    navigate(p.toString());
  }, [router, searchParams]);

  return { push, clearAll, clearQuery, isPending };
}
