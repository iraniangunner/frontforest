"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useRef, useState } from "react";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi";
import ProductCard from "@/app/_components/ui/ProductCard";
import { Product } from "@/types";

interface Props {
  products: Product[];
}

export default function LatestProductsSection({ products }: Props) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [showArrows, setShowArrows] = useState(false);
  const [isBegin, setIsBegin] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  if (!products.length) return null;

  const checkArrows = (swiper: SwiperType) => {
    const w = window.innerWidth;
    const perView = w >= 1280 ? 4 : w >= 1024 ? 3 : w >= 640 ? 2 : 1;
    setShowArrows(products.length > perView);
    setIsBegin(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
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
          {/* <Link
            href="/products?sort=newest"
            className="text-sm text-teal-600 hover:text-teal-800 font-medium"
          >
            مشاهده همه ←
          </Link> */}
        </div>
        <div className="relative">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="قبلی"
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md
              items-center justify-center hover:border-teal-400 transition-all
              ${showArrows && !isBegin ? "flex" : "hidden"}`}
          >
            <HiChevronRight className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="بعدی"
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md
              items-center justify-center hover:border-teal-400 transition-all
              ${showArrows && !isEnd ? "flex" : "hidden"}`}
          >
            <HiChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="overflow-hidden" style={{ minHeight: "380px" }}>
            <Swiper
              dir="rtl"
              key="rtl"
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setTimeout(() => checkArrows(swiper), 0);
              }}
              onSlideChange={(swiper) => {
                setIsBegin(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onBreakpoint={(swiper) => checkArrows(swiper)}
              modules={[Navigation]}
              spaceBetween={16}
              grabCursor
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="pb-2"
              style={{ visibility: "hidden" }} // ← اضافه کن
              onInit={(swiper) => {
                swiper.el.style.visibility = "visible"; // ← اضافه کن
              }}
            >
              {products.map((p, i) => (
                <SwiperSlide key={p.id} style={{ height: "auto" }}>
                  <ProductCard product={p} view="grid" priority={i === 0} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
