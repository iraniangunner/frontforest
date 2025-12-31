import Image from "next/image";
import Link from "next/link";
import { HiStar } from "react-icons/hi";
import { Component } from "@/types";

interface RelatedComponentsProps {
  components: Component[];
  categorySlug: string;
}

export function RelatedComponents({ components, categorySlug }: RelatedComponentsProps) {
  if (components.length === 0) return null;

  const formatPrice = (price: number) => {
    if (price === 0) return "رایگان";
    return price.toLocaleString() + " تومان";
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">کامپوننت‌های مشابه</h2>
        <Link
          href={`/components?categories[]=${categorySlug}`}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          مشاهده همه
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {components.map((component) => (
          <Link
            key={component.id}
            href={`/components/${component.slug}`}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              {component.thumbnail ? (
                <Image
                  src={component.thumbnail}
                  alt={component.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">بدون تصویر</span>
                </div>
              )}

              {component.is_free && (
                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  رایگان
                </span>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {component.title}
              </h3>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1">
                  <HiStar className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-600">{component.rating}</span>
                </div>
                <span
                  className={`font-medium ${
                    component.is_free ? "text-green-600" : "text-gray-900"
                  }`}
                >
                  {formatPrice(component.current_price)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}