"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    ym: (counterId: number, action: string, ...args: any[]) => void;
  }
}

export default function YandexMetrica() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams}` : "");

    if (typeof window !== "undefined" && window.ym) {
      window.ym(109829000, "hit", url);
    }
  }, [pathname, searchParams]);

  return null;
}


