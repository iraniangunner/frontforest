"use client";

// app/_components/ui/FilterProvider.tsx

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useTransition,
  ReactNode,
} from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

type Updates = Record<string, string | string[] | null>;

interface FilterContextValue {
  // خواندن مقادیر (از state خوش‌بینانه — فوری)
  get: (key: string) => string | null;
  getAll: (key: string) => string[];
  // نوشتن
  push: (updates: Updates) => void;
  pushTo: (targetPath: string, params: URLSearchParams) => void;
  clearAll: () => void;
  isPending: boolean;
  // drawer موبایل (کاملاً client-side، مستقل از URL)
  drawerOpen: boolean;
  drawerJustOpened: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

export const useFilter = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilter must be used within <FilterProvider>");
  return ctx;
};

// نسخه‌ی امن: اگر خارج از Provider بود null می‌دهد (برای کامپوننت‌هایی که هر دو جا رندر می‌شوند).
export const useFilterSafe = () => useContext(FilterContext);

// وضعیت باز/بسته‌ی drawer در سطح ماژول نگه داشته می‌شود تا اگر Provider به‌خاطر
// تغییر route ری‌مانت شد (مثلاً /products/parent/child → /products/parent)، drawer بسته نشود.
let moduleDrawerOpen = false;
// آیا drawer «همین الان» باز شده (کلیک واقعی)؟ برای اینکه انیمیشن ورود فقط یک‌بار
// اجرا شود و با ری‌مانتِ ناشی از تغییر route دوباره پخش نشود.
let moduleJustOpened = false;

export function FilterProvider({
  children,
  preserveOnClear = [],
}: {
  children: ReactNode;
  /** کلیدهایی که هنگام «پاک‌کردن همه» باید حفظ شوند (مثلاً ["q"] در صفحه‌ی جستجو) */
  preserveOnClear?: string[];
}) {
  const realSp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // state خوش‌بینانه — مقدار اولیه از URL.
  const [params, setParams] = useState(
    () => new URLSearchParams(realSp.toString())
  );
  const paramsRef = useRef(params);
  paramsRef.current = params;

  // وقتی URL واقعی عوض شد (پایان navigation یا back/forward)، state را هماهنگ کن.
  useEffect(() => {
    setParams(new URLSearchParams(realSp.toString()));
  }, [realSp]);

  const navigate = useCallback(
    (next: URLSearchParams) => {
      setParams(next); // ← فوری: UI بلافاصله به‌روز می‌شود (checkbox آنی)
      const qs = next.toString();
      startTransition(() => {
        // ← پس‌زمینه: داده‌ی جدید از سرور. isPending در این مدت true است.
        router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [pathname, router]
  );

  // مثل navigate ولی به یک مسیر دلخواه (برای تغییر route دسته‌بندی:
  // /products/parent ↔ /products/parent/child). همچنان optimistic + transition
  // است؛ پس checkbox آنی اعمال می‌شود و skeleton (isPending) هم نشان داده می‌شود.
  const pushTo = useCallback(
    (targetPath: string, next: URLSearchParams) => {
      setParams(next); // ← فوری (optimistic)
      const qs = next.toString();
      startTransition(() => {
        router.push(qs ? `${targetPath}?${qs}` : targetPath, {
          scroll: false,
        });
      });
    },
    [router]
  );

  const push = useCallback(
    (updates: Updates) => {
      const next = new URLSearchParams(paramsRef.current.toString());
      for (const [key, value] of Object.entries(updates)) {
        next.delete(key);
        if (Array.isArray(value)) {
          value.forEach((v) => next.append(key, v));
        } else if (value !== null && value !== "") {
          next.set(key, value);
        }
      }
      // هر تغییر فیلتری → بازگشت به صفحه‌ی ۱ (مگر خودِ pagination صریحاً page بفرستد)
      if (!("page" in updates)) next.delete("page");
      navigate(next);
    },
    [navigate]
  );

  const clearAll = useCallback(() => {
    const next = new URLSearchParams();
    preserveOnClear.forEach((k) => {
      paramsRef.current.getAll(k).forEach((v) => next.append(k, v));
    });
    navigate(next);
  }, [navigate, preserveOnClear]);

  // ── drawer موبایل ──
  // مقدار را در یک متغیر ماژول نگه می‌داریم تا اگر Provider به‌خاطر تغییر route
  // ری‌مانت شد، وضعیت باز/بسته‌ی drawer از بین نرود.
  const [drawerOpen, setDrawerOpen] = useState(moduleDrawerOpen);
  // انیمیشن ورود فقط هنگام باز شدن واقعی. مقدار اولیه از فلگ ماژول:
  //   • باز شدن واقعی (openDrawer) → justOpened=true → انیمیت کن
  //   • ری‌مانت ناشی از تغییر route (drawer از قبل باز) → moduleJustOpened=false → انیمیت نکن
  const [justOpened, setJustOpened] = useState(moduleJustOpened);
  moduleJustOpened = false; // بعد از خواندن مقدار اولیه، فلگ را خاموش کن

  const openDrawer = useCallback(() => {
    moduleDrawerOpen = true;
    setJustOpened(true); // این یک باز شدن واقعی است → انیمیت کن
    setDrawerOpen(true);
  }, []);
  const closeDrawer = useCallback(() => {
    moduleDrawerOpen = false;
    setJustOpened(false);
    setDrawerOpen(false);
  }, []);

  const get = useCallback((key: string) => params.get(key), [params]);
  const getAll = useCallback((key: string) => params.getAll(key), [params]);

  return (
    <FilterContext.Provider
      value={{
        get,
        getAll,
        push,
        pushTo,
        clearAll,
        isPending,
        drawerOpen,
        drawerJustOpened: justOpened,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}
