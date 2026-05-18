"use client";

// app/(public)/_components/HeroCarousel.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi";
import { Product } from "@/types";

// رنگ‌های پس‌زمینه — به ترتیب روی اسلایدها اعمال میشن
const BG_COLORS = [
  { bg: "#f0faf5", accent: "#1D9E75" },
  { bg: "#f0f5ff", accent: "#3b5bdb" },
  { bg: "#fff9f0", accent: "#e67700" },
  { bg: "#fff0f6", accent: "#c2255c" },
  { bg: "#f3f0ff", accent: "#7048e8" },
];

const fmt = (n: number) => Number(n).toLocaleString("fa-IR");

interface Props {
  products: Product[];
}

const INTERVAL = 5000;

export default function HeroCarousel({ products }: Props) {
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState<"next" | "prev">("next");
  const [animating, setAnimating] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const total = products.length;

  const go = useCallback(
    (n: number, direction: "next" | "prev" = "next") => {
      if (animating || total === 0) return;
      const next = (n + total) % total;
      setDir(direction);
      setPrev(cur);
      setCur(next);
      setAnimating(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setPrev(null);
        setAnimating(false);
      }, 580);
    },
    [animating, cur, total],
  );

  useEffect(() => {
    if (total <= 1) return;
    const t = setInterval(() => go(cur + 1, "next"), INTERVAL);
    return () => clearInterval(t);
  }, [cur, go, total]);

  if (!total) return null;

  const product = products[cur];
  const prevProduct = prev !== null ? products[prev] : null;
  const colors = BG_COLORS[cur % BG_COLORS.length];
  const prevColors = prev !== null ? BG_COLORS[prev % BG_COLORS.length] : null;

  return (
    <div
      className="relative overflow-hidden rounded-2xl select-none"
      style={{ height: "260px" }}
      dir="rtl"
    >
      <style>{`
        @keyframes slideInNext  { from { transform: translateX(-6%) scale(.98); opacity: 0; } to { transform: translateX(0) scale(1); opacity: 1; } }
        @keyframes slideOutNext { from { transform: translateX(0) scale(1); opacity: 1; } to { transform: translateX(6%) scale(.98); opacity: 0; } }
        @keyframes slideInPrev  { from { transform: translateX(6%) scale(.98); opacity: 0; } to { transform: translateX(0) scale(1); opacity: 1; } }
        @keyframes slideOutPrev { from { transform: translateX(0) scale(1); opacity: 1; } to { transform: translateX(-6%) scale(.98); opacity: 0; } }
        .in-next  { animation: slideInNext  .55s cubic-bezier(.4,0,.2,1) forwards; }
        .out-next { animation: slideOutNext .55s cubic-bezier(.4,0,.2,1) forwards; }
        .in-prev  { animation: slideInPrev  .55s cubic-bezier(.4,0,.2,1) forwards; }
        .out-prev { animation: slideOutPrev .55s cubic-bezier(.4,0,.2,1) forwards; }
      `}</style>

      {/* اسلاید قبلی */}
      {prevProduct && prevColors && (
        <div
          className={`absolute inset-0 ${dir === "next" ? "out-next" : "out-prev"}`}
          style={{ backgroundColor: prevColors.bg }}
        >
          <SlideContent product={prevProduct} accent={prevColors.accent} />
        </div>
      )}

      {/* اسلاید فعلی */}
      <div
        className={`absolute inset-0 ${animating ? (dir === "next" ? "in-next" : "in-prev") : ""}`}
        style={{ backgroundColor: colors.bg }}
      >
        <SlideContent product={product} accent={colors.accent} />
      </div>

      {/* arrows */}
      {total > 1 && (
        <>
          <button
            onClick={() => go(cur - 1, "prev")}
            aria-label="قبلی"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-all hover:scale-105"
          >
            <HiChevronRight className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => go(cur + 1, "next")}
            aria-label="بعدی"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-all hover:scale-105"
          >
            <HiChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        </>
      )}

      {/* dots */}
      {total > 1 && (
        <div className="absolute bottom-4 right-1/2 translate-x-1/2 flex gap-2 z-10">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i, i > cur ? "next" : "prev")}
              aria-label={`اسلاید ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === cur ? "22px" : "7px",
                height: "7px",
                background: i === cur ? colors.accent : "rgba(0,0,0,.18)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── محتوای هر اسلاید ──
function SlideContent({
  product,
  accent,
}: {
  product: Product;
  accent: string;
}) {
  const hasDiscount = !!product.sale_price;

  return (
    <div className="flex items-center h-full px-8 sm:px-12 gap-6">
      {/* متن */}
      <div className="flex-1 min-w-0">
        {/* badge */}
        <span
          className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-3"
          style={{ background: `${accent}18`, color: accent }}
        >
          {product.is_new
            ? "جدید رسید"
            : product.is_on_sale
              ? "تخفیف ویژه"
              : "پیشنهاد ما"}
        </span>

        {/* عنوان */}
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-snug mb-1.5 line-clamp-2">
          {product.title}
        </h2>

        {/* توضیح کوتاه */}
        {product.short_description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-1">
            {product.short_description}
          </p>
        )}

        {/* قیمت */}
        <div className="mb-5">
          {hasDiscount ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 line-through">
                {fmt(product.price)} تومان
              </span>
              <span className="text-base font-bold" style={{ color: accent }}>
                {fmt(product.sale_price!)} تومان
              </span>
            </div>
          ) : (
            <span className="text-base font-bold" style={{ color: accent }}>
              {fmt(product.price)} تومان
            </span>
          )}
        </div>

        {/* دکمه */}
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: accent }}
        >
          مشاهده محصول
          <HiChevronLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* تصویر */}
      <div className="relative w-40 h-40 sm:w-52 sm:h-52 flex-shrink-0">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-contain drop-shadow-sm"
            sizes="(max-width:640px) 160px, 208px"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl">
            📦
          </div>
        )}
      </div>
    </div>
  );
}
