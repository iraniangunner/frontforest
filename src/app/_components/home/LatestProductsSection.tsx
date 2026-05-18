"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi";
import ProductCard from "@/app/_components/ui/ProductCard";
import { Product } from "@/types";

interface Props {
  products: Product[];
  arrowThreshold?: number;
}

export default function LatestProductsSection({
  products,
  arrowThreshold = 5,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isBegin, setIsBegin] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [dragging, setDragging] = useState(false);
  const isDrag = useRef(false);
  const startX = useRef(0);
  const startSL = useRef(0);
  const moved = useRef(false);

  // در RTL:
  // scrollLeft = 0 در راست‌ترین نقطه (ابتدای لیست)
  // scrollLeft منفی میشه وقتی به چپ scroll میکنی
  const check = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setIsBegin(el.scrollLeft >= -2); // در ابتدا (راست)
    setIsEnd(el.scrollLeft <= -(el.scrollWidth - el.clientWidth) + 2); // در انتها (چپ)
  }, []);

  useEffect(() => {
    setTimeout(check, 100);
    const el = ref.current;
    el?.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      el?.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [products, check]);

  if (!products.length) return null;

  const showArrows = products.length > arrowThreshold;

  // arrow راست = prev = برگشت به ابتدا → scroll به راست = left مثبت
  const scrollPrev = () =>
    ref.current?.scrollBy({
      left: ref.current.clientWidth * 0.8,
      behavior: "smooth",
    });

  // arrow چپ = next = نمایش بیشتر → scroll به چپ = left منفی
  const scrollNext = () =>
    ref.current?.scrollBy({
      left: -ref.current.clientWidth * 0.8,
      behavior: "smooth",
    });

  // mouse drag
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDrag.current = true;
    moved.current = false;
    startX.current = e.pageX;
    startSL.current = ref.current?.scrollLeft ?? 0;
    setDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDrag.current || !ref.current) return;
    const diff = e.pageX - startX.current;
    if (Math.abs(diff) > 3) moved.current = true;
    // در RTL: کشیدن به چپ (diff منفی) → scrollLeft کمتر (منفی‌تر) → محتوا به چپ میره
    ref.current.scrollLeft = startSL.current + diff;
  };

  const onMouseUp = () => {
    isDrag.current = false;
    setDragging(false);
  };

  // touch
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].pageX;
    startSL.current = ref.current?.scrollLeft ?? 0;
    moved.current = false;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!ref.current) return;
    const diff = e.touches[0].pageX - startX.current;
    if (Math.abs(diff) > 3) moved.current = true;
    ref.current.scrollLeft = startSL.current + diff;
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (moved.current) e.stopPropagation();
  };

  return (
    <section dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 bg-teal-600 rounded-full" />
            <h2 className="text-lg font-semibold text-gray-900">
              جدیدترین محصولات
            </h2>
          </div>
          <Link
            href="/products?sort=newest"
            className="text-sm text-teal-600 hover:text-teal-800 font-medium"
          >
            مشاهده همه ←
          </Link>
        </div>

        <div className="relative">
          {/* arrow راست */}
          {showArrows && (
            <button
              onClick={scrollPrev}
              aria-label="قبلی"
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10
                w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md
                flex items-center justify-center hover:border-teal-400 transition-all
                ${isBegin ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            >
              <HiChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          )}

          {/* arrow چپ */}
          {showArrows && (
            <button
              onClick={scrollNext}
              aria-label="بعدی"
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10
                w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md
                flex items-center justify-center hover:border-teal-400 transition-all
                ${isEnd ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            >
              <HiChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}

          {/* container — dir="rtl" → محصولات از راست به چپ */}
          <div
            ref={ref}
            dir="rtl"
            className="flex gap-4 overflow-x-auto pb-2 select-none"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              cursor: dragging ? "grabbing" : "grab",
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={() => {}}
            onClickCapture={onClickCapture}
          >
            {products.map((p) => (
              <div
                key={p.id}
                className="flex-shrink-0 w-[47vw] sm:w-[30vw] md:w-[23vw] lg:w-[20vw] xl:w-[17vw]"
              >
                <ProductCard product={p} view="grid" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
