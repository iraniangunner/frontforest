"use client";

// app/(public)/_components/HeroCarousel.tsx
import Link from "next/link";
import Image from "next/image";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Product } from "@/types";



// رنگ‌های پس‌زمینه
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

export default function HeroCarousel({ products }: Props) {
  if (!products.length) return null;

  return (
    <div
      className="relative overflow-hidden rounded-2xl select-none"
      style={{ height: "260px" }}
      dir="rtl"
    >
      {/* استایل‌های لازم برای Swiper Pagination */}
      <style>{`
        .hero-swiper .swiper-pagination {
          bottom: 16px !important;
        }
        .hero-swiper .swiper-pagination-bullet {
          width: 7px;
          height: 7px;
          background: rgba(0,0,0,.18);
          opacity: 1;
          transition: all .3s;
          border-radius: 9999px;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          width: 22px !important;
          border-radius: 9999px;
        }
        /* دکمه‌های ناوبری سفارشی */
        .hero-prev-btn,
        .hero-next-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 36px;
          height: 36px;
          border-radius: 9999px;
          background: rgba(255,255,255,.8);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 4px rgba(0,0,0,.1);
          cursor: pointer;
          border: none;
          transition: background .2s, transform .2s;
        }
        .hero-prev-btn:hover,
        .hero-next-btn:hover {
          background: white;
          transform: translateY(-50%) scale(1.05);
        }
        .hero-prev-btn { right: 16px; }
        .hero-next-btn { left: 16px; }
        .swiper-button-disabled.hero-prev-btn,
        .swiper-button-disabled.hero-next-btn {
          opacity: 0.3;
          pointer-events: none;
        }
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
        navigation={{
          prevEl: ".hero-prev-btn",
          nextEl: ".hero-next-btn",
        }}
        pagination={{
          clickable: true,
          // رنگ پویا برای bullet فعال — از طریق CSS variable
          renderBullet: (index, className) =>
            `<span class="${className}" style="--bullet-index:${index}"></span>`,
        }}
        speed={550}
      >
        {products.map((product, i) => {
          const colors = BG_COLORS[i % BG_COLORS.length];
          return (
            <SwiperSlide
              key={product.id}
              style={{ backgroundColor: colors.bg }}
            >
              <SlideContent product={product} accent={colors.accent} priority={i === 0}/>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* دکمه‌های ناوبری — خارج از Swiper تا استایل مستقل داشته باشن */}
      {products.length > 1 && (
        <>
          <button className="hero-prev-btn" aria-label="قبلی">
            <HiChevronRight className="w-5 h-5 text-gray-600" />
          </button>
          <button className="hero-next-btn" aria-label="بعدی">
            <HiChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        </>
      )}
    </div>
  );
}

// ── محتوای هر اسلاید ──
function SlideContent({
  product,
  accent,
  priority = false, 
}: {
  product: Product;
  accent: string;
  priority?: boolean;
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
            priority={priority}
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
