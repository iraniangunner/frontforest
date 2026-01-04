// app/components/[slug]/ComponentDetail.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HiDesktopComputer,
  HiDeviceTablet,
  HiDeviceMobile,
  HiExternalLink,
  HiDownload,
  HiShoppingCart,
  HiHeart,
  HiOutlineHeart,
  HiStar,
  HiEye,
  HiCode,
  HiCheck,
  HiChevronRight,
  HiRefresh,
  HiZoomIn,
  HiX,
  HiShare,
  HiLink,
} from "react-icons/hi";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { cartAPI, favoritesAPI, publicComponentsAPI } from "@/lib/api";
import toast from "react-hot-toast";
import ComponentCard from "./ui/ComponentCard";
import { Component } from "@/types";
import router from "next/navigation";

type DeviceSize = "desktop" | "tablet" | "mobile";

interface DeviceOption {
  id: DeviceSize;
  label: string;
  icon: React.ElementType;
  width: string;
  maxWidth: number;
}

const deviceOptions: DeviceOption[] = [
  { id: "desktop", label: "دسکتاپ", icon: HiDesktopComputer, width: "100%", maxWidth: 1200 },
  { id: "tablet", label: "تبلت", icon: HiDeviceTablet, width: "768px", maxWidth: 768 },
  { id: "mobile", label: "موبایل", icon: HiDeviceMobile, width: "375px", maxWidth: 375 },
];

interface Props {
  component: Component;
  relatedComponents: Component[];
}

export default function ComponentDetail({ component, relatedComponents }: Props) {
  const { user } = useAuth();
  const { incrementCart } = useCart();

  const [activeDevice, setActiveDevice] = useState<DeviceSize>("desktop");
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(component.is_favorite || false);
  const [inCart, setInCart] = useState(component.in_cart || false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const allImages = [
    component.thumbnail,
    ...(component.images || []),
  ].filter(Boolean);

  const formatPrice = (price: number) => {
    if (price === 0) return "رایگان";
    return price.toLocaleString() + " تومان";
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
      toast.success(isFavorite ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد");
    } catch (error) {
      toast.error("خطا در انجام عملیات");
    } finally {
      setLoadingFavorite(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("لطفاً ابتدا وارد شوید");
      return;
    }

    if (component.is_free || inCart) return;

    setLoadingCart(true);
    try {
      await cartAPI.add(component.id);
      setInCart(true);
      incrementCart();
      toast.success("به سبد خرید اضافه شد");
    } catch (error: any) {
      if (error.response?.status === 409) {
        setInCart(true);
      } else {
        toast.error("خطا در افزودن به سبد خرید");
      }
    } finally {
      setLoadingCart(false);
    }
  };

  const handleDownload = async () => {
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
        // router.push("/login");
      } else if (error.response?.status === 403) {
        toast.error("برای دانلود ابتدا خریداری کنید");
      } else {
        toast.error("خطا در دانلود فایل");
      }
    } finally {
      setLoadingDownload(false);
    }
  };


  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("لینک کپی شد");
  };

  const handleRefreshPreview = () => {
    setIframeKey((prev) => prev + 1);
  };

  const currentDevice = deviceOptions.find((d) => d.id === activeDevice)!;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              خانه
            </Link>
            <HiChevronRight className="w-4 h-4 text-gray-400 rotate-180" />
            <Link href="/components" className="text-gray-500 hover:text-gray-700">
              کامپوننت‌ها
            </Link>
            <HiChevronRight className="w-4 h-4 text-gray-400 rotate-180" />
            <Link
              href={`/components?category=${component.category.slug}`}
              className="text-gray-500 hover:text-gray-700"
            >
              {component.category.name}
            </Link>
            <HiChevronRight className="w-4 h-4 text-gray-400 rotate-180" />
            <span className="text-gray-900 font-medium">{component.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preview Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Preview Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                {/* Device Selector */}
                <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-gray-200">
                  {deviceOptions.map((device) => (
                    <button
                      key={device.id}
                      onClick={() => setActiveDevice(device.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeDevice === device.id
                          ? "bg-gray-900 text-white shadow-sm"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <device.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{device.label}</span>
                    </button>
                  ))}
                </div>

                {/* Preview Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRefreshPreview}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="بارگذاری مجدد"
                  >
                    <HiRefresh className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => setShowFullscreen(true)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="تمام صفحه"
                  >
                    <HiZoomIn className="w-5 h-5" />
                  </button>

                  {component.preview_url && (
                    <a
                      href={component.preview_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <HiExternalLink className="w-4 h-4" />
                      <span className="hidden sm:inline">باز کردن</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Preview Frame */}
              <div className="relative bg-[#f8f9fa] overflow-hidden">
                {/* Checkered Background Pattern */}
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
                      linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
                      linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
                    `,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                  }}
                />

                {/* Preview Content */}
                <div
                  className="relative flex justify-center py-8 px-4 min-h-[500px] transition-all duration-500"
                >
                  <div
                    className="relative bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-500 ease-out"
                    style={{
                      width: currentDevice.width,
                      maxWidth: "100%",
                    }}
                  >
                    {/* Browser Chrome */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="bg-white rounded-md px-3 py-1.5 text-xs text-gray-500 font-mono truncate border">
                          {component.preview_url || `frontforest.ir/preview/${component.slug}`}
                        </div>
                      </div>
                    </div>

                    {/* Preview Content */}
                    {component.preview_url ? (
                      <iframe
                        key={iframeKey}
                        src={component.preview_url}
                        className="w-full bg-white"
                        style={{ height: "450px" }}
                        title={component.title}
                      />
                    ) : component.thumbnail ? (
                      <div className="relative aspect-video">
                        <Image
                          src={component.thumbnail}
                          alt={component.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[450px] bg-gray-50">
                        <div className="text-center">
                          <HiCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">پیش‌نمایش در دسترس نیست</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Device Size Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <div className="px-3 py-1.5 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                    {currentDevice.maxWidth}px
                  </div>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            {allImages.length > 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">تصاویر</h3>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === index
                          ? "border-teal-500 ring-2 ring-teal-500/20"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${component.title} - ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* Active Image Preview */}
                <div className="mt-4 relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={allImages[activeImage]}
                    alt={component.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">توضیحات</h3>
              <div
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: component.description || component.short_description }}
              />
            </div>

            {/* Tags */}
            {component.tags?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">تگ‌ها</h3>
                <div className="flex flex-wrap gap-2">
                  {component.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/components?tag=${tag.slug}`}
                      className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                      style={{
                        backgroundColor: `${tag.color}15`,
                        color: tag.color,
                      }}
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Info & Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Main Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="px-3 py-1 rounded-lg text-sm font-medium"
                      style={{
                        backgroundColor: `${component.category.color}15`,
                        color: component.category.color,
                      }}
                    >
                      {component.category.name}
                    </div>

                    <div className="flex items-center gap-2">
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
                      <span className="font-bold text-gray-900">{component.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">امتیاز</p>
                  </div>
                  <div className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                      <HiEye className="w-5 h-5" />
                      <span className="font-bold text-gray-900">{component.views_count}</span>
                    </div>
                    <p className="text-xs text-gray-500">بازدید</p>
                  </div>
                  <div className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-emerald-500 mb-1">
                      <HiDownload className="w-5 h-5" />
                      <span className="font-bold text-gray-900">{component.sales_count}</span>
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
                        <span className="text-gray-400 line-through">
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
                    {component.is_free || component.purchased || component.can_download ? (
                      <button
                        onClick={handleDownload}
                        disabled={loadingDownload}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all disabled:opacity-50"
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
                        className={`w-full flex items-center justify-center gap-2 px-6 py-4 font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 ${
                          inCart
                            ? "bg-emerald-500 text-white shadow-emerald-500/25"
                            : "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-teal-500/25 hover:shadow-xl"
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

                    {inCart && !component.purchased && (
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

              {/* File Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4">اطلاعات فایل</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">حجم فایل</span>
                    <span className="font-medium text-gray-900">
                      {component.file_size_formatted || "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">فرمت</span>
                    <span className="font-medium text-gray-900">ZIP</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">فریم‌ورک</span>
                    <span className="font-medium text-gray-900">
                      {component.tags?.find((t) => t.type === "framework")?.name || "React"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">استایل</span>
                    <span className="font-medium text-gray-900">
                      {component.tags?.find((t) => t.type === "styling")?.name || "Tailwind CSS"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4">ویژگی‌ها</h3>
                <ul className="space-y-3">
                  {[
                    "کد تمیز و استاندارد",
                    "کاملاً واکنش‌گرا",
                    "قابل شخصی‌سازی",
                    "پشتیبانی TypeScript",
                    "به‌روزرسانی رایگان",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <HiCheck className="w-3 h-3 text-emerald-600" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Components */}
        {relatedComponents.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">کامپوننت‌های مشابه</h2>
              <Link
                href={`/components?category=${component.category.slug}`}
                className="text-teal-600 font-medium hover:text-teal-700 transition-colors"
              >
                مشاهده همه
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedComponents.map((item) => (
                <ComponentCard
                  key={item.id}
                  component={item}
                //   initialIsFavorite={item.is_favorite}
                //   initialInCart={item.in_cart}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Preview Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm" dir="rtl">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/50 to-transparent">
            <div className="flex items-center gap-1 p-1 bg-white/10 backdrop-blur-sm rounded-xl">
              {deviceOptions.map((device) => (
                <button
                  key={device.id}
                  onClick={() => setActiveDevice(device.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeDevice === device.id
                      ? "bg-white text-gray-900"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <device.icon className="w-4 h-4" />
                  <span>{device.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowFullscreen(false)}
              className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          {/* Preview */}
          <div className="absolute inset-0 flex items-center justify-center p-8 pt-20">
            <div
              className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-500"
              style={{
                width: currentDevice.width,
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            >
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white rounded-md px-3 py-1.5 text-xs text-gray-500 font-mono truncate border">
                    {component.preview_url || `frontforest.ir/preview/${component.slug}`}
                  </div>
                </div>
              </div>

              {/* Content */}
              {component.preview_url ? (
                <iframe
                  key={iframeKey}
                  src={component.preview_url}
                  className="w-full h-[70vh]"
                  title={component.title}
                />
              ) : component.thumbnail ? (
                <div className="relative h-[70vh]">
                  <Image
                    src={component.thumbnail}
                    alt={component.title}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-[70vh] bg-gray-50">
                  <p className="text-gray-500">پیش‌نمایش در دسترس نیست</p>
                </div>
              )}
            </div>
          </div>

          {/* Size Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full">
              {currentDevice.label} — {currentDevice.maxWidth}px
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
