import Link from "next/link";
import { SwiperCarousel } from "../ui/SwiperCarousel";

const API = process.env.NEXT_PUBLIC_API_URL;

async function getProducts() {
  const res = await fetch(`${API}/products?per_page=6&sort=newest`, {
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
            <span className="w-1 h-5 bg-[#A72F3B] rounded-full" />
            <h2 className="text-lg font-semibold text-[#242424]">
              جدیدترین محصولات
            </h2>
          </div>
          <Link
            href="/search?sort=newest"
            className="group inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium text-[#A72F3B] bg-[#F6EAEB] hover:bg-[#EDD5D8] rounded-full transition-colors"
          >
            مشاهده همه
            <svg
              className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
        </div>
        <SwiperCarousel products={products} />
      </div>
    </section>
  );
}
