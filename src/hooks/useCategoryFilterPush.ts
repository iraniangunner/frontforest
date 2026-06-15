"use client";
// app/products/_hooks/useCategoryFilterPush.ts
import { useTransition, useCallback } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";

/**
  useCategoryFilterPush
 
  در صفحات دسته‌بندی (/products/[parent] یا /products/[parent]/[child])،
  sidebar فیلتر همیشه فقط children یک parent ثابت را نشان می‌دهد
  (flat، بدون hierarchy). یعنی انتخاب‌های دسته‌بندی همیشه زیرمجموعه‌ای
  از children همین parent هستند.
 
  نکته‌ی مهم: وقتی کاربر در /products/[parent]/[child] است، "child" فعلی
  از route می‌آید نه از query — پس باید همیشه در نظر گرفته شود، حتی وقتی
  فقط فیلترهای دیگر (قیمت/رتبه/...) تغییر می‌کنند. در غیر این صورت با
  تغییر یک فیلتر دیگر، انتخاب دسته‌بندی فعلی (که از route می‌آید) از دست
  می‌رود.
 
  @param parentSlug - slug دسته‌ی والد ثابت همین صفحه (مثلاً "home").
                       همه‌ی مسیرهای تولیدشده زیر همین parent خواهند بود.
 **/
export function useCategoryFilterPush(parentSlug: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  // child فعلی از route (اگه در /products/[parent]/[child] باشیم)
  const routeChild =
    typeof params?.child === "string" ? params.child : undefined;

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
    push بروزرسانی فیلترها رو اعمال می‌کند.
    منطق دسته‌بندی (categories[]) — همه چیز زیر همین parentSlug است:
     - 0 زیردسته انتخاب شده   -> /products/[parentSlug]
     - 1 زیردسته انتخاب شده   -> /products/[parentSlug]/[child]
     - 2+ زیردسته انتخاب شده  -> /products/[parentSlug]?categories[]=a&categories[]=b (query, noindex)
   
    سایر فیلترها (قیمت، رتبه، تخفیف، موجودی، سورت، صفحه‌بندی) همیشه query هستند.
   
    اگه updates شامل "categories[]" نباشه (یعنی فقط فیلترهای دیگری
    تغییر کرده‌اند)، child فعلی از route به‌عنوان انتخاب دسته‌بندی
    در نظر گرفته می‌شود تا از دست نرود.
   **/
  const push = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const p = new URLSearchParams(searchParams.toString());
      p.delete("page");

      const categoriesProvided = Object.prototype.hasOwnProperty.call(
        updates,
        "categories[]",
      );

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

      let cats = p.getAll("categories[]");
      p.delete("categories[]");
      const qs = p.toString();

      // اگه categories[] در این آپدیت دست نخورده و الان روی یک child
      // هستیم (از route)، اون child رو حفظ کن.
      if (!categoriesProvided && routeChild && cats.length === 0) {
        cats = [routeChild];
      }

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
    [router, searchParams, parentSlug, routeChild],
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
    [router, searchParams, parentSlug],
  );

  return { push, clearAll, isPending };
}
