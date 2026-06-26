"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Product } from "@/types";
import ProductCard from "./ProductCard";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface Props {
  products: Product[];
}

export function SwiperCarousel({ products }: Props) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [showArrows, setShowArrows] = useState(false);
  const [isBegin, setIsBegin] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [swiperReady, setSwiperReady] = useState(false); // ← اضافه کن

  const checkArrows = (swiper: SwiperType) => {
    const w = window.innerWidth;
    const perView = w >= 1280 ? 4 : w >= 1024 ? 3 : w >= 640 ? 2 : 1;
    setShowArrows(products.length > perView);
    setIsBegin(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <div className="relative">
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        aria-label="قبلی"
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10
        w-10 h-10 rounded-full bg-white border border-[#F0F0F0] shadow-md
        items-center justify-center hover:border-[#DCACB1] hover:text-[#A72F3B] transition-all
        ${showArrows && !isBegin ? "flex" : "hidden"}`}
      >
        <HiChevronRight className="w-5 h-5 text-[#656565]" />
      </button>
      <button
        onClick={() => swiperRef.current?.slideNext()}
        aria-label="بعدی"
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10
        w-10 h-10 rounded-full bg-white border border-[#F0F0F0] shadow-md
        items-center justify-center hover:border-[#DCACB1] hover:text-[#A72F3B] transition-all
        ${showArrows && !isEnd ? "flex" : "hidden"}`}
      >
        <HiChevronLeft className="w-5 h-5 text-[#656565]" />
      </button>

      <div className="overflow-hidden" style={{ minHeight: "380px" }}>
        {/* کارت اول — استاتیک، همیشه قابل دیدنه، برای LCP سریع */}
        <div
          className="absolute top-0 right-0 z-[1] pointer-events-none"
          style={{
            width: "calc(25% - 12px)",
            opacity: swiperReady ? 0 : 1,
            visibility: swiperReady ? "hidden" : "visible",
          }}
          aria-hidden={swiperReady}
        >
          <div className="pointer-events-auto">
            <ProductCard product={products[0]} view="grid" priority />
          </div>
        </div>

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
          style={{ opacity: swiperReady ? 1 : 0, transition: "opacity .15s" }}
          onInit={(swiper) => {
            setSwiperReady(true);
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
  );
}
