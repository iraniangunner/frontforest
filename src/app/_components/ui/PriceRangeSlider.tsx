"use client";

// app/products/_components/PriceRangeSlider.tsx
import { useState, useEffect, useRef, useCallback } from "react";

interface Props {
  globalMin: number;
  globalMax: number;
  currentMin: number;
  currentMax: number;
  onChange: (min: number, max: number) => void;
}

const fmt = (n: number) => Number(Math.round(n)).toLocaleString("fa-IR");

export default function PriceRangeSlider({
  globalMin,
  globalMax,
  currentMin,
  currentMax,
  onChange,
}: Props) {
  const range = Math.max(globalMax - globalMin, 1);

  const toPercent = (val: number) =>
    Math.min(100, Math.max(0, Math.round(((val - globalMin) / range) * 100)));

  const toValue = (pct: number) => Math.round(globalMin + (pct / 100) * range);

  const [lo, setLo] = useState(() => toPercent(currentMin));
  const [hi, setHi] = useState(() => toPercent(currentMax));

  const timer = useRef<ReturnType<typeof setTimeout>>();

  // sync با URL params از بیرون
  useEffect(() => {
    setLo(toPercent(currentMin));
    setHi(toPercent(currentMax));
  }, [currentMin, currentMax, globalMin, globalMax]);

  // debounce 600ms — وقتی کاربر رها میکنه URL آپدیت میشه
  const commit = useCallback(
    (l: number, h: number) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        onChange(toValue(l), toValue(h));
      }, 600);
    },
    [globalMin, globalMax, onChange]
  );

  const handleLo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.min(+e.target.value, hi - 2);
    setLo(v);
    commit(v, hi);
  };

  const handleHi = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.max(+e.target.value, lo + 2);
    setHi(v);
    commit(lo, v);
  };

  const isFiltered = toValue(lo) > globalMin || toValue(hi) < globalMax;

  // inline styles برای track — چون position نسبی داره
  const trackBase: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    transform: "translateY(-50%)",
    borderRadius: "9999px",
    pointerEvents: "none",
  };

  // inline styles برای input range — appearance باید از CSS بیاد
  const inputBase: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    height: "3px",
    background: "transparent",
    WebkitAppearance: "none",
    appearance: "none",
    pointerEvents: "none",
    outline: "none",
    cursor: "pointer",
  };

  return (
    <>
      {/* ── CSS thumb — باید global باشه یا توی یه style tag ── */}
      <style>{`
        .prs-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          pointer-events: all;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #0d9488;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          transition: transform 0.1s, border-color 0.1s;
        }
        .prs-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          border-color: #0f766e;
        }
        .prs-thumb::-webkit-slider-thumb:active {
          transform: scale(1.25);
        }
        .prs-thumb::-moz-range-thumb {
          pointer-events: all;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #0d9488;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
      `}</style>

      <div className="space-y-3">
        {/* ── نمایش مقادیر از / تا ── */}
        <div className="flex items-center gap-2">
          <div
            className={`flex-1 rounded-lg border px-3 py-2 text-center transition-colors ${
              isFiltered && lo > 0
                ? "border-teal-300 bg-teal-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <p className="text-[10px] text-gray-400 mb-0.5">از</p>
            <p
              className={`text-xs font-semibold ${
                isFiltered && lo > 0 ? "text-teal-700" : "text-gray-700"
              }`}
            >
              {fmt(toValue(lo))} ت
            </p>
          </div>

          <span className="text-gray-300 text-sm">—</span>

          <div
            className={`flex-1 rounded-lg border px-3 py-2 text-center transition-colors ${
              isFiltered && hi < 100
                ? "border-teal-300 bg-teal-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <p className="text-[10px] text-gray-400 mb-0.5">تا</p>
            <p
              className={`text-xs font-semibold ${
                isFiltered && hi < 100 ? "text-teal-700" : "text-gray-700"
              }`}
            >
              {fmt(toValue(hi))} ت
            </p>
          </div>
        </div>

        {/* ── Slider track ── */}
        <div
          style={{
            position: "relative",
            height: "32px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* track background */}
          <div style={{ ...trackBase, height: "3px", background: "#E5E7EB" }} />

          {/* track fill (teal) */}
          <div
            style={{
              ...trackBase,
              height: "3px",
              background: "#0d9488",
              left: `${lo}%`,
              right: `${100 - hi}%`,
            }}
          />

          {/* min thumb */}
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={lo}
            onChange={handleLo}
            className="prs-thumb"
            style={{ ...inputBase, zIndex: lo > 88 ? 5 : 3 }}
            aria-label="حداقل قیمت"
          />

          {/* max thumb */}
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={hi}
            onChange={handleHi}
            className="prs-thumb"
            style={{ ...inputBase, zIndex: 4 }}
            aria-label="حداکثر قیمت"
          />
        </div>

        {/* ── scale min / max ── */}
        <div className="flex justify-between text-xs text-gray-300 px-0.5">
          <span>{fmt(globalMin)}</span>
          <span>{fmt(globalMax)}</span>
        </div>

        {/* ── دکمه reset ── */}
        {isFiltered && (
          <button
            type="button"
            onClick={() => {
              setLo(0);
              setHi(100);
              onChange(globalMin, globalMax);
            }}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors"
          >
            × حذف فیلتر قیمت
          </button>
        )}
      </div>
    </>
  );
}
