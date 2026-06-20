// // app/page.tsx
// import LatestProductsSection from "../_components/home/LatestProductsSection";
// import CategoriesSection from "../_components/home/CategoriesSection";
// import HeroCarousel from "../_components/home/HeroCarousel";
// import { FeaturesSection } from "../_components/home";
// import BlogSection from "../_components/home/BlogSection";

// export const revalidate = 60;

// export default async function HomePage() {
//   const [slidesRes, catsRes, productsRes, postsRes] = await Promise.all([
//     fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/products?per_page=5&sort=newest`,
//       {
//         next: { revalidate: 60 },
//       }
//     ),

//     fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/menu`, {
//       next: { revalidate: 60 },
//     }),

//     fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/products?per_page=12&sort=newest`,
//       {
//         next: { revalidate: 60 },
//       }
//     ),

//     fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?per_page=5&sort=newest`, {
//       next: { revalidate: 60 },
//     }),
//   ]);

//   const [slides, categories, products, posts] = await Promise.all([
//     slidesRes.json(),
//     catsRes.json(),
//     productsRes.json(),
//     postsRes.json(),
//   ]);

//   return (
//     <main className="max-w-7xl mx-auto px-4 py-6 space-y-12">
//       <h1 className="sr-only">فروشگاه پترا — خرید محصولات اصل با گارانتی</h1>

//       <HeroCarousel products={slides?.data ?? []} />
//       <CategoriesSection categories={categories?.data ?? []} />
//       <LatestProductsSection products={products?.data ?? []} />
//       <BlogSection posts={posts?.data ?? []} />
//       <FeaturesSection />
//     </main>
//   );
// }

import { Suspense } from "react";
import { CategoriesSection, FeaturesSection } from "../_components/home";
import HeroCarouselServer from "../_components/home/HeroCarouselServer";
import LatestProductsServer from "../_components/home/LatestProductsServer";
import BlogSectionServer from "../_components/home/BlogSectionServer";

export const revalidate = 60;

export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-12">
      <h1 className="sr-only">فروشگاه پترا — خرید محصولات اصل با گارانتی</h1>

      {/* HERO (critical path) */}
      <HeroCarouselServer />

      {/* STREAMED SECTIONS */}
      <Suspense
        fallback={<div className="h-24 bg-gray-100 animate-pulse rounded" />}
      >
        <CategoriesSection />
      </Suspense>

      <Suspense
        fallback={<div className="h-64 bg-gray-100 animate-pulse rounded" />}
      >
        <LatestProductsServer />
      </Suspense>

      <Suspense
        fallback={<div className="h-40 bg-gray-100 animate-pulse rounded" />}
      >
        <BlogSectionServer />
      </Suspense>

      <FeaturesSection />
    </main>
  );
}
