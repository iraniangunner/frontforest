// app/components/[slug]/component-detail/ComponentSidebar.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HiDownload,
  HiShoppingCart,
  HiHeart,
  HiOutlineHeart,
  HiStar,
  HiEye,
  HiCheck,
  HiLink,
} from "react-icons/hi";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { cartAPI, favoritesAPI, publicComponentsAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { Component } from "@/types";

interface ComponentSidebarProps {
  component: Component;
}

export function ComponentSidebar({ component }: ComponentSidebarProps) {
  const { user } = useAuth();
  const { incrementCart } = useCart();

  const [isFavorite, setIsFavorite] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);

  const formatPrice = (price: number) => {
    if (price === 0) return "رایگان";
    return price.toLocaleString() + " تومان";
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("لینک کپی شد");
  };

  const handleToggleFavorite = async () => {
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
    } catch (error) {
      toast.error("خطا در انجام عملیات");
    } finally {
      setLoadingFavorite(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("برای افزودن به سبد ابتدا وارد شوید");
      return;
    }

    setLoadingCart(true);
    try {
      await cartAPI.add(component.id);
      incrementCart();
      setInCart(true);
      toast.success("به سبد خرید اضافه شد");
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("برای افزودن به سبد ابتدا وارد شوید");
      } else if (error.response?.status === 409) {
        toast.error("این کامپوننت در سبد خرید موجود است");
        setInCart(true);
      } else {
        toast.error(
          error.response?.data?.message || "خطا در افزودن به سبد خرید"
        );
      }
    } finally {
      setLoadingCart(false);
    }
  };

  const handleDownload = async () => {
    if (!user && !component.is_free) {
      toast.error("برای دانلود ابتدا وارد شوید");
      return;
    }

    setLoadingDownload(true);
    try {
      const response = await publicComponentsAPI.download(component.slug);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${component.slug}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("دانلود شروع شد");
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("برای دانلود ابتدا وارد شوید");
      } else if (error.response?.status === 403) {
        toast.error("برای دانلود ابتدا خریداری کنید");
      } else {
        toast.error("خطا در دانلود فایل");
      }
    } finally {
      setLoadingDownload(false);
    }
  };

  const canDownload = component.is_free || component.can_download;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div
            className="px-3 py-1.5 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: `${component.category.color}15`,
              color: component.category.color,
            }}
          >
            {component.category.name}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyLink}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="کپی لینک"
            >
              <HiLink className="w-5 h-5" />
            </button>
            <button
              onClick={handleToggleFavorite}
              disabled={loadingFavorite}
              className={`p-2 rounded-lg transition-all ${
                isFavorite
                  ? "text-rose-500 bg-rose-50"
                  : "text-gray-400 hover:text-rose-500 hover:bg-rose-50"
              }`}
              title={isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
            >
              {loadingFavorite ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isFavorite ? (
                <HiHeart className="w-5 h-5" />
              ) : (
                <HiOutlineHeart className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {component.title}
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed">
          {component.short_description}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-x-reverse divide-gray-100 border-b border-gray-100">
        <div className="px-4 py-4 text-center">
          <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
            <HiStar className="w-5 h-5" />
            <span className="font-bold text-gray-900">
              {component.rating || "0"}
            </span>
          </div>
          <p className="text-xs text-gray-500">امتیاز</p>
        </div>
        <div className="px-4 py-4 text-center">
          <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
            <HiEye className="w-5 h-5" />
            <span className="font-bold text-gray-900">
              {component.views_count || 0}
            </span>
          </div>
          <p className="text-xs text-gray-500">بازدید</p>
        </div>
        <div className="px-4 py-4 text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-500 mb-1">
            <HiDownload className="w-5 h-5" />
            <span className="font-bold text-gray-900">
              {component.sales_count || 0}
            </span>
          </div>
          <p className="text-xs text-gray-500">فروش</p>
        </div>
      </div>

      {/* Price & Actions */}
      <div className="p-6">
        {/* Price */}
        <div className="mb-6">
          {component.is_on_sale && !component.is_free && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-400 line-through text-lg">
                {formatPrice(component.price)}
              </span>
              <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-xs font-bold rounded-full">
                {component.discount_percent}% تخفیف
              </span>
            </div>
          )}
          <div
            className={`text-3xl font-black ${
              component.is_free ? "text-emerald-600" : "text-gray-900"
            }`}
          >
            {formatPrice(component.current_price)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {canDownload ? (
            <button
              onClick={handleDownload}
              disabled={loadingDownload}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingDownload ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <HiDownload className="w-5 h-5" />
              )}
              <span>دانلود {component.is_free ? "رایگان" : ""}</span>
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={loadingCart || inCart}
              className={`w-full flex items-center justify-center gap-2 px-6 py-4 font-bold rounded-xl shadow-lg transition-all disabled:cursor-not-allowed ${
                inCart
                  ? "bg-emerald-500 text-white shadow-emerald-500/25"
                  : "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30"
              }`}
            >
              {loadingCart ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : inCart ? (
                <>
                  <HiCheck className="w-5 h-5" />
                  <span>در سبد خرید</span>
                </>
              ) : (
                <>
                  <HiShoppingCart className="w-5 h-5" />
                  <span>افزودن به سبد خرید</span>
                </>
              )}
            </button>
          )}

          {inCart  && (
            <Link
              href="/cart"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
            >
              مشاهده سبد خرید
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}