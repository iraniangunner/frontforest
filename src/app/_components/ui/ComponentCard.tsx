"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HiStar,
  HiDownload,
  HiHeart,
  HiShoppingCart,
  HiCheck,
} from "react-icons/hi";
import type { Component } from "@/types";
import { cartAPI, favoritesAPI } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useUserStatus } from "@/context/UserStatusContext";
import toast from "react-hot-toast";

interface ComponentCardProps {
  component: Component;
  view?: "grid" | "list";
}

export default function ComponentCard({
  component,
  view = "grid",
}: ComponentCardProps) {
  const { user } = useAuth();
  const { incrementCart } = useCart();

  const {
    isInCart,
    isFavorite: checkFavorite,
    isPurchased,
    addToCart: addToCartContext,
    toggleFavorite: toggleFavoriteContext,
    loading: statusLoading,
  } = useUserStatus();

  const inCart = isInCart(component.id);
  const isFavorite = checkFavorite(component.id);
  const purchased = isPurchased(component.id);

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

    const previousState = isFavorite;
    setLoadingFavorite(true);
    toggleFavoriteContext(component.id);

    try {
      await favoritesAPI.toggle(component.id);
      toast.success(
        previousState ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد"
      );
    } catch (error: any) {
      toggleFavoriteContext(component.id);
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

    if (component.is_free || purchased) {
      toast.error("این کامپوننت قابل دانلود است");
      return;
    }

    if (inCart) {
      toast("این کامپوننت در سبد خرید موجود است", { icon: "🛒" });
      return;
    }

    setLoadingCart(true);
    try {
      await cartAPI.add(component.id);
      addToCartContext(component.id);
      incrementCart();
      toast.success("به سبد خرید اضافه شد");
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("لطفاً ابتدا وارد شوید");
      } else if (error.response?.status === 409) {
        addToCartContext(component.id);
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

  const canDownload = component.is_free || purchased;

  if (view === "grid") {
    return (
      <Link
        href={`/components/${component.slug}`}
        className="group block bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg"
      >
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-50">
          {component.thumbnail ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse" />
              )}
              <Image
                src={component.thumbnail || "/placeholder.svg"}
                alt={component.title}
                fill
                className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="w-12 h-12 rounded-lg bg-gray-100" />
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            disabled={loadingFavorite || statusLoading}
            className={`absolute top-2 left-2 p-1.5 rounded-lg backdrop-blur-sm transition-all duration-200 ${
              isFavorite
                ? "bg-rose-500 text-white"
                : "bg-white/80 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-rose-500"
            }`}
          >
            {loadingFavorite || statusLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <HiHeart className="w-4 h-4" />
            )}
          </button>

          {/* Single Badge - Priority: Purchased > Free > Sale */}
          {(purchased || component.is_free || component.is_on_sale) && (
            <div className="absolute top-2 right-2">
              {purchased && !component.is_free ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500 text-white text-xs font-medium rounded">
                  <HiCheck className="w-3 h-3" />
                  خریداری شده
                </span>
              ) : component.is_free ? (
                <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-medium rounded">
                  رایگان
                </span>
              ) : component.is_on_sale ? (
                <span className="px-2 py-0.5 bg-rose-500 text-white text-xs font-medium rounded">
                  {component.discount_percent}%
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-teal-600 transition-colors">
            {component.title}
          </h3>

          {/* Bottom Row */}
          <div className="flex items-center justify-between gap-2">
            {/* Rating */}
            <div className="flex items-center gap-1 text-gray-500">
              <HiStar className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-sm font-medium">{component.rating}</span>
            </div>

            {/* Price & Action */}
            <div className="flex items-center gap-2">
              {canDownload ? (
                <span className="text-sm font-semibold text-emerald-600">
                  {component.is_free ? "رایگان" : "دانلود"}
                </span>
              ) : (
                <>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">
                      {formatPrice(component.current_price)}
                    </span>
                    {component.is_on_sale && (
                      <span className="text-xs text-gray-400 line-through mr-1">
                        {formatPrice(component.price)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={loadingCart || statusLoading}
                    className={`p-1.5 rounded transition-colors ${
                      inCart
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {loadingCart || statusLoading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : inCart ? (
                      <HiCheck className="w-4 h-4" />
                    ) : (
                      <HiShoppingCart className="w-4 h-4" />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ==================== LIST VIEW ====================
  return (
    <Link
      href={`/components/${component.slug}`}
      className="group block bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative sm:w-48 h-32 sm:h-auto overflow-hidden bg-gray-50 flex-shrink-0">
          {component.thumbnail ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse" />
              )}
              <Image
                src={component.thumbnail || "/placeholder.svg"}
                alt={component.title}
                fill
                className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="w-12 h-12 rounded-lg bg-gray-100" />
            </div>
          )}

          {/* Badge */}
          {(purchased || component.is_free || component.is_on_sale) && (
            <div className="absolute top-2 right-2">
              {purchased && !component.is_free ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500 text-white text-xs font-medium rounded">
                  <HiCheck className="w-3 h-3" />
                </span>
              ) : component.is_free ? (
                <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-medium rounded">
                  رایگان
                </span>
              ) : component.is_on_sale ? (
                <span className="px-2 py-0.5 bg-rose-500 text-white text-xs font-medium rounded">
                  {component.discount_percent}%
                </span>
              ) : null}
            </div>
          )}

          {/* Favorite */}
          <button
            onClick={handleToggleFavorite}
            disabled={loadingFavorite || statusLoading}
            className={`absolute top-2 left-2 p-1.5 rounded-lg backdrop-blur-sm transition-all duration-200 ${
              isFavorite
                ? "bg-rose-500 text-white"
                : "bg-white/80 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-rose-500"
            }`}
          >
            {loadingFavorite || statusLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <HiHeart className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Category */}
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: component.category.color || "#6366f1",
                }}
              />
              <span className="text-xs text-gray-500">
                {component.category.name}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 leading-snug line-clamp-1 mb-1 group-hover:text-teal-600 transition-colors">
              {component.title}
            </h3>

            {/* Rating & Stats */}
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <HiStar className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium">{component.rating}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <HiDownload className="w-3.5 h-3.5" />
                <span>{component.sales_count}</span>
              </div>
            </div>
          </div>

          {/* Price & Action */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {canDownload ? (
              <span className="text-sm font-semibold text-emerald-600">
                {component.is_free ? "رایگان" : "دانلود"}
              </span>
            ) : (
              <>
                <div className="text-right">
                  <span className="text-base font-bold text-gray-900 block">
                    {formatPrice(component.current_price)}
                  </span>
                  {component.is_on_sale && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(component.price)}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={loadingCart || statusLoading}
                  className={`p-2 rounded transition-colors ${
                    inCart
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {loadingCart || statusLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : inCart ? (
                    <HiCheck className="w-4 h-4" />
                  ) : (
                    <HiShoppingCart className="w-4 h-4" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
