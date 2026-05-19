// app/(public)/_components/CategoriesSection.tsx
import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types";

interface Props {
  categories: Category[];
}

export default function CategoriesSection({ categories }: Props) {
  if (!categories.length) return null;

  return (
    <section className="py-10" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* هدر */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 bg-teal-600 rounded-full" />
            <h2 className="text-lg font-semibold text-gray-900">
              دسته بندی ها
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm text-teal-600 hover:text-teal-800 font-medium transition-colors"
          >
            همه محصولات ←
          </Link>
        </div>

        {/* گرید */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {categories.map((cat) => {
            // URL — اگه فرزند داشت همه فرزندان رو فیلتر کن
            const href = cat.children?.length
              ? `/products?${cat.children
                  .map((c) => `categories[]=${c.slug}`)
                  .join("&")}`
              : `/products?categories[]=${cat.slug}`;

            return (
              <Link
                key={cat.id}
                href={href}
                className="group flex flex-col items-center gap-2.5 p-3 bg-white rounded-2xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all"
              >
                {/* آیکون */}
                <div
                  className="relative w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: cat.color ? `${cat.color}15` : "#f3f4f6",
                  }}
                >
                  {cat.icon_image ? (
                    // تصویر آپلود شده
                    <Image
                      src={cat.icon_image}
                      alt={cat.name}
                      fill
                      className="object-contain p-2"
                      sizes="56px"
                    />
                  ) : cat.image ? (
                    // تصویر اصلی دسته‌بندی
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : cat.icon ? (
                    // emoji یا متن
                    <span className="text-2xl">{cat.icon}</span>
                  ) : (
                    // placeholder
                    <span className="text-2xl">📦</span>
                  )}
                </div>

                {/* نام */}
                <span className="text-xs font-medium text-gray-700 text-center leading-tight group-hover:text-teal-600 transition-colors line-clamp-2">
                  {cat.name}
                </span>

                {/* تعداد محصول */}
                {cat.products_count > 0 && (
                  <span className="text-[10px] text-gray-400">
                    {cat.products_count.toLocaleString("fa-IR")} محصول
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
