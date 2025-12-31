import Link from "next/link";
import { HiStar, HiEye, HiDownload } from "react-icons/hi";
import { Component } from "@/types";

interface ComponentInfoProps {
  component: Component;
}

export function ComponentInfo({ component }: ComponentInfoProps) {
  const formatPrice = (price: number) => {
    if (price === 0) return "رایگان";
    return price.toLocaleString() + " تومان";
  };

  return (
    <>
      {/* Category */}
      <Link
        href={`/components?categories[]=${component.category.slug}`}
        className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white mb-4"
        style={{ backgroundColor: component.category.color }}
      >
        {component.category.name}
      </Link>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{component.title}</h1>

      {/* Short Description */}
      {component.short_description && (
        <p className="text-gray-600 mb-4">{component.short_description}</p>
      )}

      {/* Rating & Stats */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-1">
          <HiStar className="w-5 h-5 text-yellow-400" />
          <span className="font-medium">{component.rating}</span>
          <span className="text-gray-400">({component.reviews_count} نظر)</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <HiEye className="w-5 h-5" />
          <span>{component.views_count}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <HiDownload className="w-5 h-5" />
          <span>{component.sales_count}</span>
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        {component.is_on_sale && !component.is_free && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg text-gray-400 line-through">
              {formatPrice(component.price)}
            </span>
            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-sm font-medium">
              {component.discount_percent}% تخفیف
            </span>
          </div>
        )}
        <p
          className={`text-3xl font-bold ${
            component.is_free ? "text-green-600" : "text-gray-900"
          }`}
        >
          {formatPrice(component.current_price)}
        </p>
      </div>
    </>
  );
}