"use client";

// app/(public)/_components/home/HeroCarousel.tsx
import Link from "next/link";
import Image from "next/image";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Product } from "@/types";

const THEMES = [
  {
    bg: "from-emerald-50 to-green-100",
    accent: "#16a34a",
    badgeBg: "bg-green-200",
    badgeText: "text-green-800",
    btnBg: "bg-green-600",
    glow: "bg-green-400",
  },
  {
    bg: "from-blue-50 to-blue-100",
    accent: "#2563eb",
    badgeBg: "bg-blue-200",
    badgeText: "text-blue-800",
    btnBg: "bg-blue-600",
    glow: "bg-blue-400",
  },
  {
    bg: "from-amber-50 to-yellow-100",
    accent: "#d97706",
    badgeBg: "bg-amber-200",
    badgeText: "text-amber-800",
    btnBg: "bg-amber-600",
    glow: "bg-amber-400",
  },
  {
    bg: "from-pink-50 to-rose-100",
    accent: "#db2777",
    badgeBg: "bg-pink-200",
    badgeText: "text-pink-800",
    btnBg: "bg-pink-600",
    glow: "bg-pink-400",
  },
  {
    bg: "from-violet-50 to-purple-100",
    accent: "#7c3aed",
    badgeBg: "bg-violet-200",
    badgeText: "text-violet-800",
    btnBg: "bg-violet-600",
    glow: "bg-violet-400",
  },
] as const;

const fmt = (n: number) => Number(n).toLocaleString("fa-IR");

interface Props {
  products: Product[];
}

export default function HeroCarousel({ products }: Props) {

  return (
    <div
      className="relative overflow-hidden rounded-2xl select-none shadow-sm"
      style={{ height: 280 }}
      dir="rtl"
    >
      {/* Swiper pagination & nav minimal overrides — only layout, no design */}
      <style>{`
        .hero-swiper .swiper-pagination { bottom: 14px !important; display:flex; align-items:center; justify-content:center; gap:5px; pointer-events:none; }
        .hero-swiper .swiper-pagination-bullet { width:6px; height:6px; background:rgba(0,0,0,.18); opacity:1; border-radius:9999px; transition:width .3s; margin:0 !important; pointer-events:auto; flex-shrink:0; }
        .hero-swiper .swiper-pagination-bullet-active { width:20px !important; background:rgba(0,0,0,.45) !important; }
        @media(max-width:640px){ .hero-carousel-root { height:220px !important; } }
      `}</style>

      <Swiper
        dir="rtl"
        key="rtl"
        className="hero-swiper h-full"
        modules={[Autoplay, Navigation, Pagination]}
        slidesPerView={1}
        spaceBetween={0}
        loop={products.length > 1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={{ prevEl: ".hero-prev", nextEl: ".hero-next" }}
        pagination={{ clickable: true }}
        speed={500}
      >
        {products.map((product, i) => {
          const t = THEMES[i % THEMES.length];
          return (
            <SwiperSlide key={product.id}>
              <div
                className={`flex items-center h-full bg-gradient-to-br ${t.bg} px-6 sm:px-14 gap-6`}
              >
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <span
                    className={`inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-3 ${t.badgeBg} ${t.badgeText}`}
                  >
                    {product.is_new
                      ? "تازه رسیده"
                      : product.is_on_sale
                      ? "تخفیف ویژه"
                      : "پیشنهاد ما"}
                  </span>

                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900 leading-snug mb-1.5 line-clamp-2">
                    {product.title}
                  </h2>

                  {product.short_description && (
                    <p className="hidden sm:block text-sm text-gray-500 mb-3 line-clamp-1">
                      {product.short_description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mb-5">
                    {product.sale_price ? (
                      <>
                        <span className="text-xs text-gray-400 line-through">
                          {fmt(product.price)} تومان
                        </span>
                        <span
                          className="text-sm sm:text-base font-bold"
                          style={{ color: t.accent }}
                        >
                          {fmt(product.sale_price)} تومان
                        </span>
                      </>
                    ) : (
                      <span
                        className="text-sm sm:text-base font-bold"
                        style={{ color: t.accent }}
                      >
                        {fmt(product.price)} تومان
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/products/${product.slug}`}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white ${t.btnBg} hover:opacity-90 hover:-translate-y-0.5 transition-all`}
                  >
                    مشاهده محصول <HiChevronLeft className="w-4 h-4" />
                  </Link>
                </div>

                {/* Image */}
                <div className="relative w-28 h-28 sm:w-44 sm:h-44 flex-shrink-0">
                  <div
                    className={`absolute inset-[15%] rounded-full ${t.glow} blur-2xl opacity-30`}
                  />
                  {product.thumbnail ? (
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      className="object-contain relative z-10 drop-shadow-md"
                      sizes="(max-width:640px) 112px, 176px"
                      priority={i === 0}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      📦
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Nav buttons */}
      {products.length > 1 && (
        <>
          <button className="hero-prev absolute top-1/2 -translate-y-1/2 right-3 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white hover:scale-105 transition-all border-none hidden sm:flex">
            <HiChevronRight className="w-4 h-4 text-gray-600" />
          </button>
          <button className="hero-next absolute top-1/2 -translate-y-1/2 left-3 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white hover:scale-105 transition-all border-none hidden sm:flex">
            <HiChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
        </>
      )}
    </div>
  );
}
