"use client";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TopLoader() {
  const barRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const search = useSearchParams();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = () => {
    const bar = barRef.current;
    if (!bar) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    bar.style.transition = "none";
    bar.style.width = "0%";
    bar.style.opacity = "1";
    // یک فریم صبر کن تا transition دوباره فعال شود
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.transition = "width 8s cubic-bezier(0.1,0.05,0,1)";
        bar.style.width = "85%";
      });
    });
    timerRef.current = setTimeout(() => finish(), 10000);
  };

  const finish = () => {
    const bar = barRef.current;
    if (!bar) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    bar.style.transition = "width 0.2s ease";
    bar.style.width = "100%";
    setTimeout(() => {
      bar.style.opacity = "0";
      bar.style.width = "0%";
    }, 250);
  };

  // وقتی مسیر یا کوئری عوض شد (ناوبری کامل شد) → نوار را تمام کن
  useEffect(() => {
    finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search]);

  // تشخیص کلیک روی لینک‌ها
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // کلیک با کلید کمکی یا غیرچپ → ناوبری معمولی نیست
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const target = e.target as Element | null;
      if (!target || typeof target.closest !== "function") return;

      // کلیک روی دکمه (لایک/سبد/...) → ناوبری نیست، نادیده بگیر
      if (target.closest("button")) return;

      // نزدیک‌ترین لینک را پیدا کن
      const a = target.closest("a") as HTMLAnchorElement | null;
      if (!a) return;

      const href = a.getAttribute("href");
      if (!href) return;
      // لنگر داخل صفحه یا تب جدید → نادیده
      if (href.startsWith("#") || a.target === "_blank") return;
      // لینک‌های دانلود/تماس/ایمیل → نادیده
      if (
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        a.hasAttribute("download")
      ) {
        return;
      }

      let url: URL;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }

      // دامنه‌ی خارجی → نادیده
      if (url.origin !== window.location.origin) return;

      // دقیقاً همین صفحه (هم مسیر هم کوئری) → ناوبری‌ای رخ نمی‌دهد
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return;
      }

      // ناوبری واقعی → نوار را روشن کن
      start();
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // دسترسی دستی از جاهای دیگر (مثل فیلترهای جستجو)
  useEffect(() => {
    (window as any).__topLoaderStart = start;
    (window as any).__topLoaderFinish = finish;
    return () => {
      delete (window as any).__topLoaderStart;
      delete (window as any).__topLoaderFinish;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={barRef}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "3px",
        width: "0%",
        opacity: 0,
        background: "#A72F3B",
        zIndex: 9999,
        borderRadius: "2px 0 0 2px",
        boxShadow: "0 0 8px rgba(167,47,59,0.4)",
        pointerEvents: "none",
      }}
    />
  );
}
