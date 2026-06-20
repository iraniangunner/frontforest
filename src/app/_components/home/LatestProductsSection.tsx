import { SwiperCarousel } from "../ui/SwiperCarousel";

const API = process.env.NEXT_PUBLIC_API_URL;

async function getProducts() {
  const res = await fetch(`${API}/products?per_page=12&sort=newest`, {
    next: { revalidate: 60 },
  });

  return res.json();
}
export default async function LatestProductsSection() {
  const data = await getProducts();
  const products = data?.data ?? [];

  if (!products.length) return null;
  return (
    <section dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 bg-teal-600 rounded-full" />
            <h2 className="text-lg font-semibold text-gray-900">
              جدیدترین محصولات
            </h2>
          </div>
        </div>
        <SwiperCarousel products={products} />
      </div>
    </section>
  );
}
