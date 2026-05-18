// app/page.tsx

import { publicCategoriesAPI, publicProductsAPI } from "@/lib/api";
import LatestProductsSection from "../_components/home/LatestProductsSection";
import CategoriesSection from "../_components/home/CategoriesSection";
import HeroCarousel from "../_components/home/HeroCarousel";

export default async function HomePage() {
  const [slidesRes, catsRes, latestRes] = await Promise.all([
    publicProductsAPI.getAll({ per_page: 5, sort: "newest" }),
    publicCategoriesAPI.getMenu(),
    publicProductsAPI.getAll({ per_page: 12, sort: "newest" }),
  ]);

  const slides = slidesRes.data.data || [];

  const categories = catsRes.data.data || [];

  const products = latestRes.data.data || [];
  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <HeroCarousel products={slides} />
      <CategoriesSection categories={categories} />
      <LatestProductsSection products={products} />
    </main>
  );
}
