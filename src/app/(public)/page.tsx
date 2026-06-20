// app/page.tsx
import { postsAPI, publicCategoriesAPI, publicProductsAPI } from "@/lib/api";
import LatestProductsSection from "../_components/home/LatestProductsSection";
import CategoriesSection from "../_components/home/CategoriesSection";
import HeroCarousel from "../_components/home/HeroCarousel";
import { FeaturesSection } from "../_components/home";
import BlogSection from "../_components/home/BlogSection";

export const revalidate = 60;

export default async function HomePage() {
  const [slidesRes, catsRes, latestRes, postsRes] = await Promise.all([
    publicProductsAPI.getAll({ per_page: 5, sort: "newest" }),
    publicCategoriesAPI.getMenu(),
    publicProductsAPI.getAll({ per_page: 12, sort: "newest" }),
    postsAPI.getAll({ per_page: 5, sort: "newest" }),
  ]);
  const slides = slidesRes.data.data || [];
  const categories = catsRes.data.data || [];
  const products = latestRes.data.data || [];
  const posts = postsRes.data.data || [];

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-12">
      <h1 className="sr-only">
        فروشگاه پترا — خرید محصولات اصل با گارانتی
      </h1>
      <HeroCarousel products={slides} />
      <CategoriesSection categories={categories} />
      <LatestProductsSection products={products} />
      <BlogSection posts={posts} />
      <FeaturesSection />
    </main>
  );
}
