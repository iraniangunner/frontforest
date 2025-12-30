"use client";

import Link from "next/link";
import Image from "next/image";
import { HiStar, HiDownload, HiEye, HiExternalLink } from "react-icons/hi";
import { Component } from "@/types";

interface ComponentCardProps {
  component: Component;
  view?: "grid" | "list";
}

export default function ComponentCard({
  component,
  view = "grid",
}: ComponentCardProps) {
  const formatPrice = (price: number) => {
    if (price === 0) return "رایگان";
    return price.toLocaleString() + " تومان";
  };

  if (view === "list") {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex">
          {/* Image */}
          <div className="relative w-48 h-40 flex-shrink-0">
            {component.thumbnail ? (
              <Image
                src={component.thumbnail}
                alt={component.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-gray-400">بدون تصویر</span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {component.is_free && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  رایگان
                </span>
              )}
              {component.is_on_sale && !component.is_free && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {component.discount_percent}% تخفیف
                </span>
              )}
              {component.is_new && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  جدید
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col">
            <div className="flex items-start justify-between">
              <div>
                <Link
                  href={`/components/${component.slug}`}
                  className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {component.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  {component.category.parent?.name &&
                    `${component.category.parent.name} / `}
                  {component.category.name}
                </p>
              </div>

              {/* Price */}
              <div className="text-left">
                {component.is_on_sale && !component.is_free && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(component.price)}
                  </span>
                )}
                <p
                  className={`text-lg font-bold ${
                    component.is_free ? "text-green-600" : "text-gray-900"
                  }`}
                >
                  {formatPrice(component.current_price)}
                </p>
              </div>
            </div>

            {/* Description */}
            {component.short_description && (
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {component.short_description}
              </p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-3">
              {component.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${tag.color}20`,
                    color: tag.color,
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <HiStar className="w-4 h-4 text-yellow-400" />
                  {component.rating}
                </span>
                <span className="flex items-center gap-1">
                  <HiEye className="w-4 h-4" />
                  {component.views_count}
                </span>
                <span className="flex items-center gap-1">
                  <HiDownload className="w-4 h-4" />
                  {component.sales_count}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {component.preview_url && (
                  <a
                    href={component.preview_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <HiExternalLink className="w-5 h-5" />
                  </a>
                )}
                <Link
                  href={`/components/${component.slug}`}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  مشاهده
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
      {/* Image */}
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
            <span className="text-gray-400">بدون تصویر</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {component.is_free && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              رایگان
            </span>
          )}
          {component.is_on_sale && !component.is_free && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              {component.discount_percent}% تخفیف
            </span>
          )}
          {component.is_new && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              جدید
            </span>
          )}
        </div>

        {/* Preview Button */}
        {component.preview_url && (
          <a
            href={component.preview_url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-white hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
          >
            <HiExternalLink className="w-5 h-5" />
          </a>
        )}

        {/* Category Badge */}
        <div
          className="absolute bottom-3 right-3 px-2 py-1 rounded-lg text-xs font-medium text-white"
          style={{ backgroundColor: component.category.color }}
        >
          {component.category.name}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link
          href={`/components/${component.slug}`}
          className="block font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
        >
          {component.title}
        </Link>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {component.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${tag.color}15`, color: tag.color }}
            >
              {tag.name}
            </span>
          ))}
          {component.tags.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              +{component.tags.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <HiStar className="w-4 h-4 text-yellow-400" />
            {component.rating}
          </span>
          <span className="flex items-center gap-1">
            <HiDownload className="w-4 h-4" />
            {component.sales_count}
          </span>
        </div>

        {/* Price & Button */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div>
            {component.is_on_sale && !component.is_free && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(component.price)}
              </span>
            )}
            <p
              className={`font-bold ${
                component.is_free ? "text-green-600" : "text-gray-900"
              }`}
            >
              {formatPrice(component.current_price)}
            </p>
          </div>
          <Link
            href={`/components/${component.slug}`}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            مشاهده
          </Link>
        </div>
      </div>
    </div>
  );
}
