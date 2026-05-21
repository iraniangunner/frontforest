"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TopLoader() {
  const barRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const search = useSearchParams();

  const start = () => {
    const bar = barRef.current;
    if (!bar) return;
    bar.style.transition = "none";
    bar.style.width = "0%";
    bar.style.opacity = "1";
    setTimeout(() => {
      bar.style.transition = "width 8s cubic-bezier(0.1,0.05,0,1)";
      bar.style.width = "85%";
    }, 10);
  };

  const finish = () => {
    const bar = barRef.current;
    if (!bar) return;
    bar.style.transition = "width 0.2s ease";
    bar.style.width = "100%";
    setTimeout(() => {
      bar.style.opacity = "0";
      bar.style.width = "0%";
    }, 200);
  };

  // وقتی route عوض شد → finish
  useEffect(() => {
    finish();
  }, [pathname, search]);

  // کلیک روی لینک‌ها → start
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest("a");
      if (a?.href && !a.href.startsWith("#") && !a.target) start();
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
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
        background: "#0d9488",
        zIndex: 9999,
        borderRadius: "0 2px 2px 0",
        boxShadow: "0 0 8px rgba(13,148,136,0.4)",
      }}
    />
  );
}
