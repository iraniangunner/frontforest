import { Suspense } from "react";
import { CategoriesSection, FeaturesSection } from "../_components/home";
import LatestProductsSection from "../_components/home/LatestProductsSection";
import BlogSection from "../_components/home/BlogSection";
import HeroCarousel from "../_components/home/HeroCarousel";

export const revalidate = 60;

export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-12">
      <h1 className="sr-only">فروشگاه پترا — خرید محصولات اصل با گارانتی</h1>

      {/* HERO (critical path) */}
      <Suspense
        fallback={
          <div
            style={{ height: 280 }}
            className="bg-gray-100 animate-pulse rounded-2xl"
          />
        }
      >
        <HeroCarousel />
      </Suspense>

      {/* STREAMED SECTIONS */}
      <Suspense
        fallback={<div className="h-24 bg-gray-100 animate-pulse rounded" />}
      >
        <CategoriesSection />
      </Suspense>

      <Suspense
        fallback={<div className="h-64 bg-gray-100 animate-pulse rounded" />}
      >
        <LatestProductsSection />
      </Suspense>

      <Suspense
        fallback={<div className="h-40 bg-gray-100 animate-pulse rounded" />}
      >
        <BlogSection />
      </Suspense>

      <FeaturesSection />
    </main>
  );
}
