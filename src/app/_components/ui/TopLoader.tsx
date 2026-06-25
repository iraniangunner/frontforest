"use client";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TopLoader() {
  const barRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const search = useSearchParams();
  const isStarted = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = () => {
    const bar = barRef.current;
    if (!bar) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    isStarted.current = true;
    bar.style.transition = "none";
    bar.style.width = "0%";
    bar.style.opacity = "1";
    setTimeout(() => {
      bar.style.transition = "width 8s cubic-bezier(0.1,0.05,0,1)";
      bar.style.width = "85%";
    }, 10);
    timerRef.current = setTimeout(() => {
      finish();
    }, 10000);
  };

  const finish = () => {
    const bar = barRef.current;
    if (!bar) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    isStarted.current = false;
    bar.style.transition = "width 0.2s ease";
    bar.style.width = "100%";
    setTimeout(() => {
      bar.style.opacity = "0";
      bar.style.width = "0%";
    }, 200);
  };

  useEffect(() => {
    finish();
  }, [pathname, search]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest("a");
      if (!a?.href) return;
      const url = new URL(a.href, window.location.href);
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        start();
        setTimeout(() => finish(), 300);
        return;
      }
      if (!a.href.startsWith("#") && !a.target) start();
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    (window as any).__topLoaderStart = start;
    (window as any).__topLoaderFinish = finish;
    return () => {
      delete (window as any).__topLoaderStart;
      delete (window as any).__topLoaderFinish;
    };
  }, []);

  return (
    <div
      ref={barRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "3px",
        width: "0%",
        opacity: 0,
        background: "#A72F3B",
        zIndex: 9999,
        borderRadius: "0 2px 2px 0",
        boxShadow: "0 0 8px rgba(167,47,59,0.4)",
      }}
    />
  );
}
