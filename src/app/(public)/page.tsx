import { Suspense } from "react";
import { CategoriesSection } from "../_components/home";
import HeroCarousel from "../_components/home/HeroCarousel";
import CarouselSection from "../_components/home/CarouselSection";

export const revalidate = 60;

const pulse = (h: number) => (
  <div
    style={{ height: h }}
    className="bg-[#F5F5F5] animate-pulse rounded-2xl max-w-7xl mx-auto"
  />
);

export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-14">
      <h1 className="sr-only">فروشگاه پترا — خرید محصولات اصل با گارانتی</h1>

      {/* HERO */}
      <Suspense fallback={pulse(280)}>
        <HeroCarousel />
      </Suspense>

      {/* دسته‌بندی‌ها */}
      <Suspense fallback={pulse(120)}>
        <CategoriesSection />
      </Suspense>

      {/* جدیدترین محصولات */}
      <Suspense fallback={pulse(320)}>
        <CarouselSection
          title="جدیدترین محصولات"
          endpoint="products?per_page=6&sort=newest"
          href="/search?sort=newest"
        />
      </Suspense>

      {/* پرفروش‌ترین‌ها */}
      <Suspense fallback={pulse(320)}>
        <CarouselSection
          title="پرفروش ترین محصولات"
          endpoint="products?per_page=6&sort=best_selling"
          href="/search?sort=best-selling"
        />
      </Suspense>

      {/* تخفیف‌دارها */}
      <Suspense fallback={pulse(320)}>
        <CarouselSection
          title="پیشنهاد ویژه و تخفیف‌دار"
          endpoint="products?per_page=6&on_sale=1"
          href="/search?on_sale=1"
        />
      </Suspense>

      {/* محصولات منتخب */}
      <Suspense fallback={pulse(320)}>
        <CarouselSection
          title="محصولات منتخب"
          endpoint="products?per_page=6&featured=1"
          href="/search?featured=1"
        />
      </Suspense>

      {/* مقالات بلاگ */}
      <Suspense fallback={pulse(200)}>
        <CarouselSection
          title="آخرین مقالات"
          endpoint="posts?per_page=6&sort=newest"
          href="/posts"
          linkText="همه مقالات"
        />
      </Suspense>
    </main>
  );
}
