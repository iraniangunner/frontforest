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

  useEffect(() => {
    setLo(toPercent(currentMin));
    setHi(toPercent(currentMax));
  }, [currentMin, currentMax, globalMin, globalMax]);

  const commit = useCallback(
    (l: number, h: number) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        onChange(toValue(l), toValue(h));
      }, 600);
    },
    [globalMin, globalMax, onChange],
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

  // در RTL: نوار پرشده باید از سمت راست (lo) تا چپ (hi) باشد.
  // با direction:rtl روی کانتینر، right=0 سمت راست است؛ پس:
  // fill: از right=lo% تا left=(100-hi)%
  return (
    <>
      <style>{`
        .prs-range {
          position: absolute;
          inset-inline: 0;
          width: 100%;
          height: 6px;
          margin: 0;
          background: transparent;
          -webkit-appearance: none;
          appearance: none;
          pointer-events: none;
          outline: none;
          direction: rtl;
        }
        .prs-range::-webkit-slider-thumb {
          -webkit-appearance: none; pointer-events: all;
          width: 20px; height: 20px; border-radius: 50%;
          background: #ffffff; border: 3px solid #A72F3B; cursor: pointer;
          box-shadow: 0 2px 6px rgba(167,47,59,0.25);
          transition: transform 0.12s, border-color 0.12s, box-shadow 0.12s;
          margin-top: -7px;
        }
        .prs-range::-webkit-slider-thumb:hover {
          transform: scale(1.15); border-color: #86262F;
          box-shadow: 0 3px 10px rgba(167,47,59,0.35);
        }
        .prs-range::-webkit-slider-thumb:active {
          transform: scale(1.25); box-shadow: 0 0 0 6px rgba(167,47,59,0.12);
        }
        .prs-range::-webkit-slider-runnable-track {
          height: 6px; background: transparent; border-radius: 9999px;
        }
        .prs-range::-moz-range-thumb {
          pointer-events: all; width: 20px; height: 20px; border-radius: 50%;
          background: #ffffff; border: 3px solid #A72F3B; cursor: pointer;
          box-shadow: 0 2px 6px rgba(167,47,59,0.25);
        }
        .prs-range::-moz-range-track {
          height: 6px; background: transparent; border-radius: 9999px;
        }
      `}</style>

      <div className="space-y-4">
        {/* ── باکس‌های از / تا — برچسب بیرون، عدد داخل ── */}
        <div className="flex items-stretch gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-[#898989] mb-1 px-1">از</p>
            <div
              className={`rounded-xl border px-2 py-2.5 text-center transition-colors ${isFiltered && lo > 0 ? "border-[#DCACB1] bg-[#F6EAEB]" : "border-[#EDEDED] bg-[#F8F8F8]"}`}
            >
              <p
                className={`text-sm font-bold leading-tight whitespace-nowrap ${isFiltered && lo > 0 ? "text-[#A72F3B]" : "text-[#242424]"}`}
              >
                {fmt(toValue(lo))}
              </p>
            </div>
          </div>
          <span className="text-[#CBCBCB] text-sm self-end pb-3">—</span>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-[#898989] mb-1 px-1">تا</p>
            <div
              className={`rounded-xl border px-2 py-2.5 text-center transition-colors ${isFiltered && hi < 100 ? "border-[#DCACB1] bg-[#F6EAEB]" : "border-[#EDEDED] bg-[#F8F8F8]"}`}
            >
              <p
                className={`text-sm font-bold leading-tight whitespace-nowrap ${isFiltered && hi < 100 ? "text-[#A72F3B]" : "text-[#242424]"}`}
              >
                {fmt(toValue(hi))}
              </p>
            </div>
          </div>
        </div>

        {/* ── تراک اسلایدر (direction:rtl) ── */}
        <div style={{ position: "relative", height: "24px", direction: "rtl" }}>
          {/* track background */}
          <div
            style={{
              position: "absolute",
              insetInline: 0,
              top: "50%",
              transform: "translateY(-50%)",
              height: "6px",
              background: "#F0F0F0",
              borderRadius: "9999px",
              pointerEvents: "none",
            }}
          />
          {/* track fill (maroon) — از راست(lo) تا چپ(hi) */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              height: "6px",
              background: "linear-gradient(90deg,#86262F,#A72F3B)",
              borderRadius: "9999px",
              right: `${lo}%`,
              left: `${100 - hi}%`,
              pointerEvents: "none",
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
            className="prs-range"
            style={{
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: lo > 88 ? 5 : 3,
            }}
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
            className="prs-range"
            style={{ top: "50%", transform: "translateY(-50%)", zIndex: 4 }}
            aria-label="حداکثر قیمت"
          />
        </div>

        {/* ── اعداد min/max ── */}
        <div
          className="flex justify-between text-xs text-[#CBCBCB] px-0.5"
          dir="rtl"
        >
          <span>{fmt(globalMin)}</span>
          <span>{fmt(globalMax)}</span>
        </div>

        {/* ── دکمه حذف فیلتر — داخل، تمام‌عرض، مرتب ── */}
        {isFiltered && (
          <button
            type="button"
            onClick={() => {
              setLo(0);
              setHi(100);
              onChange(globalMin, globalMax);
            }}
            className="w-full flex items-center justify-center gap-1 py-2 rounded-xl border border-[#EDEDED] text-xs text-[#898989] hover:text-[#C30000] hover:border-[#F3C5C9] hover:bg-[#FBEAEA] transition-colors"
          >
            × حذف فیلتر قیمت
          </button>
        )}
      </div>
    </>
  );
}
