// app/(public)/_components/home/HeroCarousel.tsx
import { HiChevronRight, HiChevronLeft } from "react-icons/hi";
import { SwiperHeroCarousel } from "../ui/SwiperHeroCarousel";

const API = process.env.NEXT_PUBLIC_API_URL;

async function getSlides() {
  const res = await fetch(`${API}/products?per_page=5&sort=newest`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed hero fetch");

  return res.json();
}

export default async function HeroCarousel() {
  const data = await getSlides();
  const products = data?.data ?? [];

  if (!products.length) return null;
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
      <SwiperHeroCarousel products={products} />

      {/* Nav buttons */}
      {products.length > 1 && (
        <>
          <button className="hero-prev absolute top-1/2 -translate-y-1/2 right-3 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm  items-center justify-center shadow-sm hover:bg-white hover:scale-105 transition-all border-none hidden sm:flex">
            <HiChevronRight className="w-4 h-4 text-gray-600" />
          </button>
          <button className="hero-next absolute top-1/2 -translate-y-1/2 left-3 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm  items-center justify-center shadow-sm hover:bg-white hover:scale-105 transition-all border-none hidden sm:flex">
            <HiChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
        </>
      )}
    </div>
  );
}
