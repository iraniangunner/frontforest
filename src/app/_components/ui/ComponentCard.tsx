"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HiStar,
  HiDownload,
  HiEye,
  HiArrowLeft,
  HiHeart,
  HiShoppingCart,
  HiCheck,
  HiPlay,
} from "react-icons/hi";
import { Component } from "@/types";
import { cartAPI, favoritesAPI } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface ComponentCardProps {
  component: Component;
  view?: "grid" | "list";
  initialIsFavorite?: boolean;
  initialInCart?: boolean;
}

export default function ComponentCard({
  component,
  view = "grid",
  initialIsFavorite = false,
  initialInCart = false,
}: ComponentCardProps) {
  const { user } = useAuth();
  const { incrementCart } = useCart();

  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [inCart, setInCart] = useState(initialInCart);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatPrice = (price: number) => {
    if (price === 0) return "رایگان";
    return price.toLocaleString() + " تومان";
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("لطفاً ابتدا وارد شوید");
      return;
    }

    setLoadingFavorite(true);
    try {
      await favoritesAPI.toggle(component.id);
      setIsFavorite(!isFavorite);
      toast.success(
        isFavorite ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد"
      );
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("لطفاً ابتدا وارد شوید");
      } else {
        toast.error("خطا در انجام عملیات");
      }
    } finally {
      setLoadingFavorite(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("لطفاً ابتدا وارد شوید");
      return;
    }

    if (component.is_free) {
      toast.error("کامپوننت‌های رایگان نیاز به خرید ندارند");
      return;
    }

    if (inCart) {
      toast("این کامپوننت در سبد خرید موجود است", { icon: "🛒" });
      return;
    }

    setLoadingCart(true);
    try {
      await cartAPI.add(component.id);
      setInCart(true);
      incrementCart();
      toast.success("به سبد خرید اضافه شد");
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("لطفاً ابتدا وارد شوید");
      } else if (error.response?.status === 409) {
        setInCart(true);
        toast("این کامپوننت در سبد خرید موجود است", { icon: "🛒" });
       } else if (error.response?.status === 400) {
        
          toast.error("شما قبلاً این کامپوننت را خریداری کرده‌اید");
      } else {
        toast.error("خطا در افزودن به سبد خرید");
      }
    } finally {
      setLoadingCart(false);
    }
  };

  // ==================== GRID VIEW ====================
  if (view === "grid") {
    return (
      <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <Link href={`/components/${component.slug}`}>
            {component.thumbnail ? (
              <>
                {/* Skeleton loader */}
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
                )}
                <Image
                  src={component.thumbnail}
                  alt={component.title}
                  fill
                  className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center">
                  <HiEye className="w-7 h-7 text-gray-400" />
                </div>
              </div>
            )}
          </Link>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

          {/* Top Row - Badges */}
          <div className="absolute top-3 right-3 flex flex-wrap gap-1.5">
            {component.is_free && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-500/25">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                رایگان
              </span>
            )}
            {component.is_on_sale && !component.is_free && (
              <span className="inline-flex items-center px-2.5 py-1 bg-rose-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-rose-500/25">
                {component.discount_percent}%
              </span>
            )}
            {component.is_new && (
              <span className="inline-flex items-center px-2.5 py-1 bg-blue-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-500/25">
                جدید
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            disabled={loadingFavorite}
            className={`absolute top-3 left-3 p-2.5 rounded-xl backdrop-blur-md transition-all duration-300 ${
              isFavorite
                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                : "bg-white/80 text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-rose-500 hover:text-white"
            }`}
          >
            {loadingFavorite ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <HiHeart className="w-5 h-5" />
            )}
          </button>

          {/* Preview Button - Show on Hover */}
          {component.preview_url && (
            <a
              href={component.preview_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-3 left-3 p-2.5 bg-white/90 backdrop-blur-md text-gray-700 hover:bg-purple-500 hover:text-white rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <HiPlay className="w-5 h-5" />
            </a>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: component.category.color || "#6366f1" }}
            />
            <span className="text-xs font-medium text-gray-500">
              {component.category.name}
            </span>
          </div>

          {/* Title */}
          <Link href={`/components/${component.slug}`}>
            <h3 className="font-bold text-gray-900 leading-snug line-clamp-1 group-hover:text-teal-600 transition-colors duration-200">
              {component.title}
            </h3>
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {component.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
                style={{
                  backgroundColor: `${tag.color}10`,
                  color: tag.color,
                }}
              >
                {tag.name}
              </span>
            ))}
            {component.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-500">
                +{component.tags.length - 3}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <HiStar className="w-4 h-4 text-amber-400" />
              <span className="font-medium text-gray-700">{component.rating}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-1">
              <HiDownload className="w-4 h-4 text-gray-400" />
              <span>{component.sales_count}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-1">
              <HiEye className="w-4 h-4 text-gray-400" />
              <span>{component.views_count}</span>
            </div>
          </div>

          {/* Price & Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-baseline gap-2">
              <span
                className={`text-lg font-bold ${
                  component.is_free ? "text-emerald-600" : "text-gray-900"
                }`}
              >
                {formatPrice(component.current_price)}
              </span>
              {component.is_on_sale && !component.is_free && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(component.price)}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Cart Button - Always Visible */}
              {!component.is_free && (
                <button
                  onClick={handleAddToCart}
                  disabled={loadingCart}
                  className={`p-2.5 rounded-xl transition-all duration-200 ${
                    inCart
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                      : "bg-gray-100 text-gray-600 hover:bg-teal-500 hover:text-white"
                  }`}
                  title={inCart ? "در سبد خرید" : "افزودن به سبد"}
                >
                  {loadingCart ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : inCart ? (
                    <HiCheck className="w-5 h-5" />
                  ) : (
                    <HiShoppingCart className="w-5 h-5" />
                  )}
                </button>
              )}

              {/* View Button */}
              <Link
                href={`/components/${component.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 hover:bg-teal-600 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:gap-2"
              >
                <span>مشاهده</span>
                <HiArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== LIST VIEW ====================
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative sm:w-64 lg:w-72 h-48 sm:h-auto overflow-hidden bg-gray-100 flex-shrink-0">
          <Link href={`/components/${component.slug}`}>
            {component.thumbnail ? (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
                )}
                <Image
                  src={component.thumbnail}
                  alt={component.title}
                  fill
                  className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center">
                  <HiEye className="w-7 h-7 text-gray-400" />
                </div>
              </div>
            )}
          </Link>

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-wrap gap-1.5">
            {component.is_free && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-500/25">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                رایگان
              </span>
            )}
            {component.is_on_sale && !component.is_free && (
              <span className="inline-flex items-center px-2.5 py-1 bg-rose-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-rose-500/25">
                {component.discount_percent}% تخفیف
              </span>
            )}
            {component.is_new && (
              <span className="inline-flex items-center px-2.5 py-1 bg-blue-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-500/25">
                جدید
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleToggleFavorite}
              disabled={loadingFavorite}
              className={`p-2.5 rounded-xl backdrop-blur-md transition-all duration-200 ${
                isFavorite
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                  : "bg-white/90 text-gray-600 hover:bg-rose-500 hover:text-white"
              }`}
            >
              {loadingFavorite ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <HiHeart className="w-5 h-5" />
              )}
            </button>

            {component.preview_url && (
              <a
                href={component.preview_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2.5 bg-white/90 backdrop-blur-md text-gray-600 hover:bg-purple-500 hover:text-white rounded-xl transition-all duration-200"
              >
                <HiPlay className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Category */}
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: component.category.color || "#6366f1" }}
                />
                <span className="text-xs font-medium text-gray-500">
                  {component.category.parent?.name && (
                    <span className="text-gray-400">
                      {component.category.parent.name} /&nbsp;
                    </span>
                  )}
                  {component.category.name}
                </span>
              </div>

              {/* Title */}
              <Link href={`/components/${component.slug}`}>
                <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-1 group-hover:text-teal-600 transition-colors duration-200">
                  {component.title}
                </h3>
              </Link>
            </div>

            {/* Price */}
            <div className="text-left flex-shrink-0">
              {component.is_on_sale && !component.is_free && (
                <span className="text-sm text-gray-400 line-through block">
                  {formatPrice(component.price)}
                </span>
              )}
              <span
                className={`text-xl font-bold ${
                  component.is_free ? "text-emerald-600" : "text-gray-900"
                }`}
              >
                {formatPrice(component.current_price)}
              </span>
            </div>
          </div>

          {/* Description */}
          {component.short_description && (
            <p className="text-gray-500 text-sm mt-3 line-clamp-2 leading-relaxed">
              {component.short_description}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {component.tags.slice(0, 5).map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium"
                style={{
                  backgroundColor: `${tag.color}10`,
                  color: tag.color,
                }}
              >
                {tag.name}
              </span>
            ))}
            {component.tags.length > 5 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-500">
                +{component.tags.length - 5}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <HiStar className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">امتیاز</span>
                  <span className="text-sm font-bold text-gray-700">{component.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                  <HiDownload className="w-4 h-4 text-teal-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">فروش</span>
                  <span className="text-sm font-bold text-gray-700">{component.sales_count}</span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <HiEye className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">بازدید</span>
                  <span className="text-sm font-bold text-gray-700">{component.views_count}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!component.is_free && (
                <button
                  onClick={handleAddToCart}
                  disabled={loadingCart}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    inCart
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                      : "bg-gray-100 text-gray-700 hover:bg-teal-500 hover:text-white"
                  }`}
                >
                  {loadingCart ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : inCart ? (
                    <>
                      <HiCheck className="w-4 h-4" />
                      <span className="hidden sm:inline">در سبد</span>
                    </>
                  ) : (
                    <>
                      <HiShoppingCart className="w-4 h-4" />
                      <span className="hidden sm:inline">افزودن</span>
                    </>
                  )}
                </button>
              )}

              <Link
                href={`/components/${component.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-teal-600 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:gap-3"
              >
                <span>مشاهده</span>
                <HiArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}