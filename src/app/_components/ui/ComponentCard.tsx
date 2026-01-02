"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiStar,
  HiDownload,
  HiEye,
  HiExternalLink,
  HiHeart,
  HiOutlineHeart,
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
  const [isHovered, setIsHovered] = useState(false);

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
      <div
        className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2"
        style={{
          boxShadow: isHovered
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)"
            : "0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.03)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
          <Link href={`/components/${component.slug}`}>
            {component.thumbnail ? (
              <Image
                src={component.thumbnail}
                alt={component.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center">
                  <HiEye className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            )}
          </Link>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />

          {/* Top Row - Badges & Favorite */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-between">
            {/* Badges */}
            <div className="flex flex-col gap-2">
              {component.is_free && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg shadow-emerald-500/30">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  رایگان
                </span>
              )}
              {component.is_on_sale && !component.is_free && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg shadow-rose-500/30">
                  {component.discount_percent}% تخفیف
                </span>
              )}
              {component.is_new && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold rounded-full shadow-lg shadow-blue-500/30">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  جدید
                </span>
              )}
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleToggleFavorite}
              disabled={loadingFavorite}
              className={`relative p-3 rounded-2xl backdrop-blur-xl transition-all duration-300 ${
                isFavorite
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-500/40 scale-110"
                  : "bg-white/80 text-gray-600 hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-500/40 hover:scale-110"
              }`}
            >
              {loadingFavorite ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <HiHeart
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isFavorite ? "scale-110" : ""
                  }`}
                />
              )}
              {isFavorite && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-400 rounded-full animate-ping" />
              )}
            </button>
          </div>

          {/* Bottom Row - Actions (Show on Hover) */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-3 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
              {/* Add to Cart Button */}
              {!component.is_free && (
                <button
                  onClick={handleAddToCart}
                  disabled={loadingCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-medium text-sm backdrop-blur-xl transition-all duration-300 ${
                    inCart
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/40"
                      : "bg-white/90 text-gray-800 hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-blue-500/40"
                  }`}
                >
                  {loadingCart ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : inCart ? (
                    <>
                      <HiCheck className="w-5 h-5" />
                      <span>در سبد خرید</span>
                    </>
                  ) : (
                    <>
                      <HiShoppingCart className="w-5 h-5" />
                      <span>افزودن به سبد</span>
                    </>
                  )}
                </button>
              )}

              {/* Preview Button */}
              {component.preview_url && (
                <a
                  href={component.preview_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-3 bg-white/90 backdrop-blur-xl text-gray-800 hover:bg-purple-500 hover:text-white rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/40"
                >
                  <HiPlay className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Category Pill */}
          <div className="absolute bottom-4 right-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
            <span
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white backdrop-blur-xl shadow-lg"
              style={{
                backgroundColor: component.category.color || "#6366f1",
              }}
            >
              {component.category.name}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <Link href={`/components/${component.slug}`}>
            <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
              {component.title}
            </h3>
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {component.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: `${tag.color}15`,
                  color: tag.color,
                }}
              >
                {tag.name}
              </span>
            ))}
            {component.tags.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-500">
                +{component.tags.length - 3}
              </span>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-50">
                <HiStar className="w-4 h-4 text-yellow-500" />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {component.rating}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50">
                <HiEye className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-sm text-gray-500">
                {component.views_count}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50">
                <HiDownload className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-sm text-gray-500">
                {component.sales_count}
              </span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col">
              {component.is_on_sale && !component.is_free && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(component.price)}
                </span>
              )}
              <span
                className={`text-xl font-bold ${
                  component.is_free
                    ? "text-emerald-600"
                    : "text-gray-900"
                }`}
              >
                {formatPrice(component.current_price)}
              </span>
            </div>

            <Link
              href={`/components/${component.slug}`}
              className="relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl overflow-hidden group/btn hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
            >
              <span className="relative z-10">مشاهده</span>
              <HiExternalLink className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==================== LIST VIEW ====================
  return (
    <div
      className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
      style={{
        boxShadow: isHovered
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)"
          : "0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.03)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative sm:w-72 h-52 sm:h-auto overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 flex-shrink-0">
          <Link href={`/components/${component.slug}`}>
            {component.thumbnail ? (
              <Image
                src={component.thumbnail}
                alt={component.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center">
                  <HiEye className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            )}
          </Link>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {component.is_free && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg shadow-emerald-500/30">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                رایگان
              </span>
            )}
            {component.is_on_sale && !component.is_free && (
              <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg shadow-rose-500/30">
                {component.discount_percent}% تخفیف
              </span>
            )}
            {component.is_new && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold rounded-full shadow-lg shadow-blue-500/30">
                جدید
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleToggleFavorite}
              disabled={loadingFavorite}
              className={`p-3 rounded-2xl backdrop-blur-xl transition-all duration-300 ${
                isFavorite
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-500/40"
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
                className="p-3 bg-white/90 backdrop-blur-xl text-gray-600 hover:bg-purple-500 hover:text-white rounded-2xl transition-all duration-300"
              >
                <HiPlay className="w-5 h-5" />
              </a>
            )}
          </div>

          {/* Category */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white backdrop-blur-xl shadow-lg"
              style={{ backgroundColor: component.category.color || "#6366f1" }}
            >
              {component.category.name}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <Link href={`/components/${component.slug}`}>
                <h3 className="font-bold text-gray-900 text-xl leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
                  {component.title}
                </h3>
              </Link>
              <p className="text-gray-500 text-sm mt-1">
                {component.category.parent?.name && (
                  <span className="text-gray-400">
                    {component.category.parent.name} /{" "}
                  </span>
                )}
                <span style={{ color: component.category.color }}>
                  {component.category.name}
                </span>
              </p>
            </div>

            {/* Price */}
            <div className="text-left flex-shrink-0">
              {component.is_on_sale && !component.is_free && (
                <span className="text-sm text-gray-400 line-through block">
                  {formatPrice(component.price)}
                </span>
              )}
              <span
                className={`text-2xl font-bold ${
                  component.is_free ? "text-emerald-600" : "text-gray-900"
                }`}
              >
                {formatPrice(component.current_price)}
              </span>
            </div>
          </div>

          {/* Description */}
          {component.short_description && (
            <p className="text-gray-600 text-sm mt-4 line-clamp-2 leading-relaxed">
              {component.short_description}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {component.tags.slice(0, 5).map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{
                  backgroundColor: `${tag.color}12`,
                  color: tag.color,
                }}
              >
                {tag.name}
              </span>
            ))}
            {component.tags.length > 5 && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-500">
                +{component.tags.length - 5}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-100">
            {/* Stats */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-yellow-50">
                  <HiStar className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">امتیاز</span>
                  <span className="text-sm font-bold text-gray-700">
                    {component.rating}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50">
                  <HiEye className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">بازدید</span>
                  <span className="text-sm font-bold text-gray-700">
                    {component.views_count}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50">
                  <HiDownload className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">فروش</span>
                  <span className="text-sm font-bold text-gray-700">
                    {component.sales_count}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {!component.is_free && (
                <button
                  onClick={handleAddToCart}
                  disabled={loadingCart}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                    inCart
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                      : "bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-blue-500/30"
                  }`}
                >
                  {loadingCart ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : inCart ? (
                    <>
                      <HiCheck className="w-5 h-5" />
                      <span>در سبد</span>
                    </>
                  ) : (
                    <>
                      <HiShoppingCart className="w-5 h-5" />
                      <span>افزودن</span>
                    </>
                  )}
                </button>
              )}

              <Link
                href={`/components/${component.slug}`}
                className="relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-2xl overflow-hidden group/btn hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
              >
                <span className="relative z-10">مشاهده جزئیات</span>
                <HiExternalLink className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}