// app/(public)/_components/home/CategoriesSection.tsx
import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types";

interface Props {
  categories: Category[];
}

export default function CategoriesSection({ categories }: Props) {
  if (!categories.length) return null;

  return (
    <section dir="rtl" className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-teal-500 to-cyan-400 flex-shrink-0" />
          <h2 className="text-[17px] font-bold text-gray-900">دسته‌بندی‌ها</h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6  gap-2.5 sm:gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products/${cat.slug}`}
              className="group flex flex-col items-center gap-2 p-2.5 sm:p-3 bg-white rounded-2xl border-[1.5px] border-slate-100 hover:border-teal-200 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              {/* Icon */}
              <div
                className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-[11px] overflow-hidden flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"
                style={{
                  backgroundColor: cat.color ? `${cat.color}20` : "#f1f5f9",
                }}
              >
                {cat.icon_image ? (
                  <Image
                    src={cat.icon_image}
                    alt={cat.name}
                    fill
                    className="object-contain p-1.5"
                    sizes="52px"
                  />
                ) : cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    sizes="52px"
                  />
                ) : cat.icon ? (
                  <span className="text-xl sm:text-2xl">{cat.icon}</span>
                ) : (
                  <span className="text-xl sm:text-2xl">📦</span>
                )}
              </div>

              {/* Name */}
              <span className="text-[10.5px] sm:text-xs font-semibold text-gray-700 text-center leading-tight group-hover:text-teal-600 transition-colors line-clamp-2">
                {cat.name}
              </span>

              {/* Count */}
              {cat.products_count > 0 && (
                <span className="text-[10px] text-gray-400">
                  {cat.products_count.toLocaleString("fa-IR")} محصول
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
