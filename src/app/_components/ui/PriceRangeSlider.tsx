"use client";

// app/_components/ui/PriceRangeSlider.tsx

import * as Slider from "@radix-ui/react-slider";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFilterSafe } from "./FilterProvider";

interface Props {
  globalMin: number;
  globalMax: number;
  currentMin: number;
  currentMax: number;
  onChange: (min: number, max: number) => void;
}

const faToEn = (s: string) =>
  s.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
const digits = (s: string) => faToEn(s).replace(/[^\d]/g, "");
const fmt = (n: number) => Math.round(n).toLocaleString("fa-IR");
const fmtStr = (s: string) => (s ? Number(s).toLocaleString("fa-IR") : "");
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(v, hi));

function PriceSkeleton() {
  return (
    <div className="space-y-2 animate-pulse" dir="rtl">
      <div className="h-11 bg-[#F5F5F5] rounded-xl" />
      <div className="h-11 bg-[#F5F5F5] rounded-xl" />
      <div className="h-1.5 bg-[#F0F0F0] rounded-full mt-3" />
    </div>
  );
}

export default function PriceRangeSlider({
  globalMin,
  globalMax,
  currentMin,
  currentMax,
  onChange,
}: Props) {
  const isPending = useFilterSafe()?.isPending ?? false;

  const [val, setVal] = useState<[number, number]>([
    clamp(currentMin, globalMin, globalMax),
    clamp(currentMax, globalMin, globalMax),
  ]);
  const [minStr, setMinStr] = useState(
    currentMin > globalMin ? String(currentMin) : "",
  );
  const [maxStr, setMaxStr] = useState(
    currentMax < globalMax ? String(currentMax) : "",
  );

  const dragging = useRef(false);
  const editing = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  // بازه‌ای که آخرین‌بار بر اساسش تصمیم گرفتیم (برای تشخیص «بازه عوض شد»).
  const seenRange = useRef({ min: globalMin, max: globalMax });

  const send = useCallback(
    (mn: number, mx: number) => onChange(mn, mx),
    [onChange],
  );

  // مقداردهی state داخلی به یک بازه‌ی مشخص (اسلایدر + ورودی‌ها).
  const setLocal = useCallback(
    (mn: number, mx: number) => {
      setVal([mn, mx]);
      setMinStr(mn > globalMin ? String(mn) : "");
      setMaxStr(mx < globalMax ? String(mx) : "");
    },
    [globalMin, globalMax],
  );

  // ── تنها منبعِ هماهنگی با بیرون ──
  useEffect(() => {
    // موقع تعامل کاربر یا لود، دست نزن (تا نپرد / پرشِ بازه دیده نشود).
    if (dragging.current || editing.current || isPending) return;

    const prevRange = seenRange.current;
    const rangeChanged =
      globalMin !== prevRange.min || globalMax !== prevRange.max;

    // مقدار هدف: قیمت فعلی، محدودشده به بازه‌ی مجاز.
    let targetMin = clamp(currentMin, globalMin, globalMax);
    let targetMax = clamp(currentMax, globalMin, globalMax);

    if (rangeChanged) {
      seenRange.current = { min: globalMin, max: globalMax };

      const hadFilter =
        currentMin > prevRange.min || currentMax < prevRange.max;
      const overlaps = currentMin <= globalMax && currentMax >= globalMin;

      // بدون هم‌پوشانی و با فیلترِ قبلی → ریست به کل بازه.
      if (hadFilter && !overlaps) {
        targetMin = globalMin;
        targetMax = globalMax;
      }

      // اگر مقدارِ هدف با آنچه در URL است فرق دارد، به بیرون بفرست تا هماهنگ شود.
      if (targetMin !== currentMin || targetMax !== currentMax) {
        setLocal(targetMin, targetMax);
        send(targetMin, targetMax);
        return;
      }
    }

    // در حالت عادی فقط state داخلی را با props هماهنگ کن.
    setLocal(targetMin, targetMax);
  }, [currentMin, currentMax, globalMin, globalMax, isPending, setLocal, send]);

  useEffect(() => () => clearTimeout(timer.current), []);

  // skeleton فقط وقتی بازه در حال تغییر است (تغییر دسته/سورت)، نه تغییر خودِ قیمت.
  const showSkeleton =
    isPending &&
    (globalMin !== seenRange.current.min ||
      globalMax !== seenRange.current.max);

  // ── اسلایدر ──
  const onSlide = (v: number[]) => {
    setVal([v[0], v[1]]);
    setMinStr(v[0] > globalMin ? String(v[0]) : "");
    setMaxStr(v[1] < globalMax ? String(v[1]) : "");
  };
  const onSlideCommit = (v: number[]) => {
    dragging.current = false;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => send(v[0], v[1]), 300);
  };

  // ── ورودی‌ها ──
  const applyInputs = () => {
    editing.current = false;
    let mn = minStr ? +minStr : globalMin;
    let mx = maxStr ? +maxStr : globalMax;
    mn = clamp(mn, globalMin, globalMax);
    mx = clamp(mx, globalMin, globalMax);
    if (mn > mx) [mn, mx] = [mx, mn];
    setLocal(mn, mx);
    if (mn !== currentMin || mx !== currentMax) send(mn, mx);
  };
  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") (e.target as HTMLInputElement).blur();
  };

  const isFiltered = val[0] > globalMin || val[1] < globalMax;

  if (showSkeleton) return <PriceSkeleton />;
  if (globalMax <= globalMin) return null;

  return (
    <div className="space-y-3" dir="rtl">
      {/* ── دو ورودی زیر هم ── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 rounded-xl border border-[#EDEDED] bg-[#F8F8F8] px-3 py-2.5 focus-within:border-[#DCACB1] focus-within:ring-2 focus-within:ring-[#A72F3B]/20 transition-colors">
          <span className="text-xs text-[#898989] w-7 flex-shrink-0">از</span>
          <input
            type="text"
            inputMode="numeric"
            value={fmtStr(minStr)}
            onFocus={() => (editing.current = true)}
            onChange={(e) => setMinStr(digits(e.target.value))}
            onBlur={applyInputs}
            onKeyDown={onKey}
            placeholder={fmt(globalMin)}
            className="flex-1 min-w-0 bg-transparent text-sm font-bold text-[#242424] outline-none placeholder:text-[#CBCBCB] placeholder:font-normal"
          />
          <span className="text-xs text-[#AFAFAF] flex-shrink-0">تومان</span>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#EDEDED] bg-[#F8F8F8] px-3 py-2.5 focus-within:border-[#DCACB1] focus-within:ring-2 focus-within:ring-[#A72F3B]/20 transition-colors">
          <span className="text-xs text-[#898989] w-7 flex-shrink-0">تا</span>
          <input
            type="text"
            inputMode="numeric"
            value={fmtStr(maxStr)}
            onFocus={() => (editing.current = true)}
            onChange={(e) => setMaxStr(digits(e.target.value))}
            onBlur={applyInputs}
            onKeyDown={onKey}
            placeholder={fmt(globalMax)}
            className="flex-1 min-w-0 bg-transparent text-sm font-bold text-[#242424] outline-none placeholder:text-[#CBCBCB] placeholder:font-normal"
          />
          <span className="text-xs text-[#AFAFAF] flex-shrink-0">تومان</span>
        </div>
      </div>

      {/* ── اسلایدر ── */}
      <Slider.Root
        dir="rtl"
        min={globalMin}
        max={globalMax}
        step={1000}
        value={val}
        onPointerDown={() => (dragging.current = true)}
        onValueChange={onSlide}
        onValueCommit={onSlideCommit}
        className="relative flex h-6 w-full touch-none select-none items-center"
      >
        <Slider.Track className="relative h-[6px] grow rounded-full bg-[#F0F0F0]">
          <Slider.Range className="absolute h-full rounded-full bg-gradient-to-r from-[#86262F] to-[#A72F3B]" />
        </Slider.Track>
        <Slider.Thumb className="block h-5 w-5 rounded-full border-[3px] border-[#A72F3B] bg-white shadow-md outline-none transition hover:scale-110 active:scale-125" />
        <Slider.Thumb className="block h-5 w-5 rounded-full border-[3px] border-[#A72F3B] bg-white shadow-md outline-none transition hover:scale-110 active:scale-125" />
      </Slider.Root>

      <div className="flex justify-between text-xs text-[#CBCBCB] px-0.5">
        <span>{fmt(globalMin)}</span>
        <span>{fmt(globalMax)}</span>
      </div>

      {isFiltered && (
        <button
          onClick={() => {
            clearTimeout(timer.current);
            dragging.current = false;
            editing.current = false;
            setLocal(globalMin, globalMax);
            send(globalMin, globalMax);
          }}
          className="w-full rounded-xl border border-[#EDEDED] py-2 text-xs text-[#898989] transition-colors hover:border-[#F3C5C9] hover:bg-[#FBEAEA] hover:text-[#C30000]"
        >
          × حذف فیلتر قیمت
        </button>
      )}
    </div>
  );
}
