"use client";
import Link from "next/link";
import Image from "next/image";
import { HiChevronLeft } from "react-icons/hi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Product } from "@/types";

const fmt = (n: number) => Number(n).toLocaleString("fa-IR");

interface Props {
  products: Product[];
}

export function SwiperHeroCarousel({ products }: Props) {
  return (
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
      speed={600}
    >
      {products.map((product, i) => (
        <SwiperSlide key={product.id}>
          {/* ───────── موبایل: عکس تمام‌پس‌زمینه + متن روی آن ───────── */}
          <div className="relative h-full overflow-hidden bg-[#F6EAEB] sm:hidden">
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-6xl bg-[#F8F8F8]">
                📦
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-center px-6 max-w-[80%]">
              <h2 className="text-xl font-bold text-white leading-snug mb-1.5 line-clamp-2 drop-shadow">
                {product.title}
              </h2>
              <div className="flex items-center gap-2 mb-5">
                {product.sale_price ? (
                  <>
                    <span className="text-xs text-white/60 line-through">
                      {fmt(product.price)} تومان
                    </span>
                    <span className="text-base font-bold text-white drop-shadow">
                      {fmt(product.sale_price)} تومان
                    </span>
                  </>
                ) : (
                  <span className="text-base font-bold text-white drop-shadow">
                    {fmt(product.price)} تومان
                  </span>
                )}
              </div>
              <Link
                href={`/products/${product.slug}`}
                className="inline-flex items-center gap-2 w-fit px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#A72F3B] hover:bg-[#86262F] shadow-lg shadow-black/20 transition-all"
              >
                مشاهده محصول <HiChevronLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* ───────── دسکتاپ: عکس تمام‌قد نیمه‌ی چپ + متن سمت راست ───────── */}
          <div className="relative hidden sm:block h-full overflow-hidden bg-gradient-to-br from-[#F6EAEB] via-[#FBF3F4] to-[#EDD5D8]">
            {/* اشکال تزئینی */}
            <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-[#DCACB1]/30 blur-3xl" />
            <div className="absolute -bottom-16 right-1/4 w-56 h-56 rounded-full bg-[#A72F3B]/10 blur-3xl" />

            {/* تصویر — نیمه‌ی چپ، تمام‌قد */}
            <div className="absolute inset-y-0 left-0 w-[46%]">
              {product.thumbnail ? (
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="46vw"
                  priority={i === 0}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl bg-[#F8F8F8]">
                  📦
                </div>
              )}
              {/* محو‌شدگی لبه به پس‌زمینه */}
              <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#FBF3F4] to-transparent" />
            </div>

            {/* متن — سمت راست */}
            <div className="relative z-10 h-full flex flex-col justify-center pr-14 pl-[calc(46%+2.5rem)]">
              <h2 className="text-2xl font-bold text-[#242424] leading-snug mb-1.5 line-clamp-2">
                {product.title}
              </h2>

              {product.short_description && (
                <p className="text-sm text-[#656565] mb-3 line-clamp-2">
                  {product.short_description}
                </p>
              )}

              <div className="flex items-center gap-2 mb-5">
                {product.sale_price ? (
                  <>
                    <span className="text-xs text-[#AFAFAF] line-through">
                      {fmt(product.price)} تومان
                    </span>
                    <span className="text-base font-bold text-[#A72F3B]">
                      {fmt(product.sale_price)} تومان
                    </span>
                  </>
                ) : (
                  <span className="text-base font-bold text-[#A72F3B]">
                    {fmt(product.price)} تومان
                  </span>
                )}
              </div>

              <Link
                href={`/products/${product.slug}`}
                className="inline-flex items-center gap-2 w-fit px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#A72F3B] hover:bg-[#86262F] hover:-translate-y-0.5 shadow-lg shadow-[#A72F3B]/20 transition-all"
              >
                مشاهده محصول <HiChevronLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
