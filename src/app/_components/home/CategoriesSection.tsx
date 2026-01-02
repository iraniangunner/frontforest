// components/home/CategoriesSection.tsx

import Link from "next/link";
import { HiTemplate, HiChevronLeft } from "react-icons/hi";
import { Category } from "@/types";

interface CategoriesSectionProps {
  categories: Category[];
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">دسته‌بندی‌ها</h2>
            <p className="text-gray-500">
              کامپوننت مورد نظر خود را در دسته‌بندی‌های مختلف پیدا کنید
            </p>
          </div>
          <Link
            href="/components"
            className="hidden sm:flex items-center gap-2 text-teal-600 font-medium hover:text-teal-700 transition-colors"
          >
            مشاهده همه
            <HiChevronLeft className="w-5 h-5" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {categories.slice(0, 12).map((category) => (
            <Link
              key={category.id}
              href={`/components?category=${category.slug}`}
              className="group relative p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Background Glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                style={{ backgroundColor: category.color }}
              />

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <HiTemplate className="w-7 h-7" style={{ color: category.color }} />
              </div>

              {/* Content */}
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-gray-700">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">
                {category.components_count || 0} کامپوننت
              </p>

              {/* Arrow */}
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                <HiChevronLeft className="w-5 h-5 text-gray-600" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}