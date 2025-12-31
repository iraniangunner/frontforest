"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HiShoppingCart,
  HiHeart,
  HiOutlineHeart,
  HiDocumentDownload,
  HiShare,
  HiExternalLink,
} from "react-icons/hi";
import { publicComponentsAPI, cartAPI, favoritesAPI } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { Component } from "@/types";
import toast from "react-hot-toast";

interface ActionButtonsProps {
  component: Component;
  initialIsFavorite?: boolean;
}

export function ActionButtons({ component, initialIsFavorite = false }: ActionButtonsProps) {
  const router = useRouter();
  const { incrementCart } = useCart();

  const [downloading, setDownloading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [togglingFavorite, setTogglingFavorite] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  // Handle Download
  const handleDownload = async () => {
    setDownloading(true);
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
        router.push("/login");
      } else if (error.response?.status === 403) {
        toast.error("برای دانلود ابتدا خریداری کنید");
      } else {
        toast.error("خطا در دانلود فایل");
      }
    } finally {
      setDownloading(false);
    }
  };

  // Handle Add to Cart
  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await cartAPI.add(component.id);
      incrementCart();
      toast.success("به سبد خرید اضافه شد");
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("برای افزودن به سبد ابتدا وارد شوید");
        router.push("/login");
      } else if (error.response?.status === 409) {
        toast.error("این کامپوننت در سبد خرید موجود است");
      } else {
        toast.error(error.response?.data?.message || "خطا در افزودن به سبد خرید");
      }
    } finally {
      setAddingToCart(false);
    }
  };

  // Handle Toggle Favorite
  const handleToggleFavorite = async () => {
    setTogglingFavorite(true);
    try {
      const response = await favoritesAPI.toggle(component.id);
      setIsFavorite(response.data.is_favorited);
      toast.success(response.data.message);
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("برای افزودن به علاقه‌مندی ابتدا وارد شوید");
        router.push("/login");
      } else {
        toast.error("خطا در تغییر علاقه‌مندی");
      }
    } finally {
      setTogglingFavorite(false);
    }
  };

  // Handle Share
  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: component.title, url });
      } catch (error) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("لینک کپی شد");
    }
  };

  return (
    <div className="space-y-3">
      {/* Download Button - For free or purchased */}
      {(component.is_free || component.can_download) && component.has_file && (
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {downloading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <HiDocumentDownload className="w-5 h-5" />
          )}
          {downloading
            ? "در حال دانلود..."
            : component.is_free
            ? "دانلود رایگان"
            : "دانلود فایل"}
        </button>
      )}

      {/* Add to Cart Button - For paid items not purchased */}
      {!component.is_free && !component.can_download && (
        <button
          onClick={handleAddToCart}
          disabled={addingToCart}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {addingToCart ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <HiShoppingCart className="w-5 h-5" />
          )}
          {addingToCart ? "در حال افزودن..." : "افزودن به سبد خرید"}
        </button>
      )}

      {/* Favorite & Share */}
      <div className="flex gap-3">
        <button
          onClick={handleToggleFavorite}
          disabled={togglingFavorite}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 ${
            isFavorite
              ? "bg-red-50 text-red-600 border border-red-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {togglingFavorite ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
          ) : isFavorite ? (
            <HiHeart className="w-5 h-5" />
          ) : (
            <HiOutlineHeart className="w-5 h-5" />
          )}
          علاقه‌مندی
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          <HiShare className="w-5 h-5" />
          اشتراک‌گذاری
        </button>
      </div>

      {/* Preview Button */}
      {component.preview_url && (
        <a
          href={component.preview_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          <HiExternalLink className="w-5 h-5" />
          مشاهده پیش‌نمایش
        </a>
      )}
    </div>
  );
}