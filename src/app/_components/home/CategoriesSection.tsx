// app/(public)/_components/home/CategoriesSection.tsx
import Link from "next/link";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_URL;

async function getCategories() {
  const res = await fetch(`${API}/categories/menu`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Categories failed");

  return res.json();
}

export default async function CategoriesSection() {
  const data = await getCategories();
  const categories = data?.data ?? [];

  if (!categories.length) return null;

  return (
    <section dir="rtl" className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-6 rounded-full bg-[#A72F3B] flex-shrink-0" />
            <h2 className="text-[17px] font-bold text-[#242424]">
              دسته‌بندی محصولات
            </h2>
          </div>
          <Link
            href="/search"
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

        {/*
          موبایل: اسلایدر افقی قابل اسکرول (مثل فیگما)
          دسکتاپ: گرید
        */}
        <div
          className="
            flex gap-2 overflow-x-auto pb-2 -mx-4 px-4
            snap-x snap-mandatory scroll-smooth
            [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
            sm:mx-0 sm:px-0 sm:overflow-visible sm:pb-0
            sm:grid sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10
          "
        >
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/products/${cat.slug}`}
              className="
                group relative flex-shrink-0 w-[128px] sm:w-auto
                snap-start
                rounded-xl overflow-hidden bg-white
                border border-[#F0F0F0]
                hover:border-[#DCACB1] hover:shadow-lg hover:shadow-[#A72F3B]/5
                hover:-translate-y-1 transition-all duration-300
              "
            >
              {/* تصویر بزرگ کارت */}
              <div className="relative aspect-square w-full overflow-hidden bg-[#F8F8F8]">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 150px, 220px"
                  />
                ) : cat.icon_image ? (
                  <Image
                    src={cat.icon_image}
                    alt={cat.name}
                    fill
                    className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 150px, 220px"
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center text-5xl"
                    style={{
                      backgroundColor: cat.color ? `${cat.color}15` : "#F6EAEB",
                    }}
                  >
                    {cat.icon || "📦"}
                  </div>
                )}

                {/* گرادیان نرم پایین تصویر برای خوانایی */}
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* نوار پایین: اسم + تعداد */}
              <div className="px-1.5 py-1.5 text-center">
                <h3 className="text-[10px] font-bold text-[#242424] group-hover:text-[#A72F3B] transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                {cat.products_count > 0 ? (
                  <p className="text-[9px] text-[#898989] mt-0.5">
                    {cat.products_count.toLocaleString("fa-IR")} محصول
                  </p>
                ) : (
                  <p className="text-[9px] text-[#AFAFAF] mt-0.5">به‌زودی</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
