"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiHeart,
  HiTrash,
  HiShoppingCart,
  HiArrowRight,
  HiCheck,
} from "react-icons/hi";
import { favoritesAPI, cartAPI } from "@/lib/api";
import Pagination from "@/app/_components/ui/Pagination";
import toast from "react-hot-toast";
import { useUserStatus } from "@/context/UserStatusContext";
import { useCart } from "@/context/CartContext";

interface FavoriteComponent {
  id: number;
  title: string;
  slug: string;
  thumbnail: string | null;
  price: number;
  current_price: number;
  is_free: boolean;
  category: { name: string };
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

  const {
    isInCart,
    isFavorite: checkFavorite,
    isPurchased,
    addToCart: addToCartContext,
    toggleFavorite: toggleFavoriteContext,
    loading: statusLoading,
  } = useUserStatus();

  const { incrementCart } = useCart();

  useEffect(() => {
    loadFavorites();
  }, [meta.current_page]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const response = await favoritesAPI.getAll({
        page: meta.current_page,
        per_page: 12,
      });
      setFavorites(response.data.data);
      setMeta(response.data.meta);
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (componentId: number) => {
    try {
      await favoritesAPI.remove(componentId);
      setFavorites((prev) => prev.filter((f) => f.id !== componentId));
      toast.success("از علاقه‌مندی‌ها حذف شد");
    } catch (error) {
      toast.error("خطا در حذف");
    }
  };

  const handleAddToCart = async (componentId: number) => {
    try {
      await cartAPI.add(componentId);
      addToCartContext(componentId);
      incrementCart();
      toast.success("به سبد خرید اضافه شد");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در افزودن به سبد");
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "رایگان";
    return price.toLocaleString() + " تومان";
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/profile"
            className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
          >
            <HiArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">علاقه‌مندی‌ها</h1>
            <p className="text-gray-500">{meta.total} کامپوننت</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <HiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لیست علاقه‌مندی‌ها خالی است
            </h3>
            <p className="text-gray-500 mb-4">
              کامپوننت‌های مورد علاقه خود را اینجا ذخیره کنید
            </p>
            <Link
              href="/components"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              مشاهده کامپوننت‌ها
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((component) => (
                <div
                  key={component.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden group"
                >
                  <Link href={`/components/${component.slug}`}>
                    <div className="relative aspect-video">
                      {component.thumbnail ? (
                        <Image
                          src={component.thumbnail}
                          alt={component.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400">بدون تصویر</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link href={`/components/${component.slug}`}>
                      <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-600">
                        {component.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mb-2">
                      {component.category?.name}
                    </p>
                    <p
                      className={`font-bold mb-4 ${
                        component.is_free ? "text-green-600" : "text-gray-900"
                      }`}
                    >
                      {formatPrice(component.current_price)}
                    </p>

                    <div className="flex gap-2">
                      {!component.is_free && (
                        <button
                          onClick={() => handleAddToCart(component.id)}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            isInCart(component.id)
                              ? "bg-emerald-500 text-white"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {isInCart(component.id) ? (
                            <>
                              <HiCheck className="w-4 h-4" />
                              در سبد
                            </>
                          ) : (
                            <>
                              <HiShoppingCart className="w-4 h-4" />
                              افزودن به سبد
                            </>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleRemove(component.id)}
                        className="flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Pagination
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                basePath="/favorites"
                // onPageChange={(page) =>
                //   setMeta({ ...meta, current_page: page })
                // }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
