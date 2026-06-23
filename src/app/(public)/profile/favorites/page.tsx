"use client";

// app/(public)/profile/favorites/page.tsx
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiHeart, HiTrash, HiShoppingCart, HiCheck } from "react-icons/hi";
import { favoritesAPI, cartAPI } from "@/lib/api";
import Pagination from "@/app/_components/ui/Pagination";
import toast from "react-hot-toast";
import { useUserStatus } from "@/context/UserStatusContext";
import { useCart } from "@/context/CartContext";

interface FavoriteProduct {
  id: number;
  title: string;
  slug: string;
  thumbnail: string | null;
  price: number;
  sale_price: number | null;
  current_price: number;
  is_in_stock: boolean;
  category: { name: string };
}

const fmt = (n: number) => Number(n).toLocaleString("fa-IR") + " تومان";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

  const { isInCart, addToCart, toggleFavorite } = useUserStatus();
  const { incrementCart } = useCart();

  useEffect(() => {
    loadFavorites();
  }, [meta.current_page]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const res = await favoritesAPI.getAll({
        page: meta.current_page,
        per_page: 12,
      });
      setFavorites(res.data.data || []);
      setMeta(res.data.meta);
    } catch {
      toast.error("خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: number) => {
    try {
      await favoritesAPI.remove(productId);
      setFavorites((prev) => prev.filter((f) => f.id !== productId));
      toggleFavorite(productId);
      toast.success("از علاقه‌مندی‌ها حذف شد");
    } catch {
      toast.error("خطا در حذف");
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await cartAPI.add(productId, 1);
      addToCart(productId);
      incrementCart();
      toast.success("به سبد خرید اضافه شد");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در افزودن به سبد");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] p-6">
      {/* هدر */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-[#242424]">علاقه‌مندی‌ها</h2>
        <span className="text-sm text-[#898989]">{meta.total} محصول</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#F0F0F0] overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-[#F5F5F5]" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-[#F5F5F5] rounded w-3/4" />
                <div className="h-3 bg-[#F5F5F5] rounded w-1/2" />
                <div className="h-8 bg-[#F5F5F5] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="py-16 text-center">
          <HiHeart className="w-16 h-16 text-[#EDD5D8] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#242424] mb-2">
            لیست علاقه‌مندی‌ها خالی است
          </h3>
          <p className="text-[#898989] text-sm">
            محصولات مورد علاقه خود را اینجا ذخیره کنید
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl border border-[#F0F0F0] overflow-hidden hover:border-[#DCACB1] transition-all group"
              >
                {/* تصویر */}
                <Link href={`/products/${product.slug}`}>
                  <div className="relative aspect-square bg-[#F8F8F8] overflow-hidden">
                    {product.thumbnail ? (
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        📦
                      </div>
                    )}
                    {product.sale_price && (
                      <span className="absolute top-2 right-2 bg-[#A72F3B] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {Math.round(
                          (1 - product.sale_price / product.price) * 100,
                        )}
                        ٪
                      </span>
                    )}
                  </div>
                </Link>

                {/* اطلاعات */}
                <div className="p-3 space-y-2">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="text-sm font-semibold text-[#242424] line-clamp-2 hover:text-[#A72F3B] transition-colors">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-[#898989]">
                    {product.category?.name}
                  </p>

                  {/* قیمت */}
                  <div>
                    {product.sale_price ? (
                      <>
                        <p className="text-xs text-[#AFAFAF] line-through">
                          {fmt(product.price)}
                        </p>
                        <p className="text-sm font-bold text-[#A72F3B]">
                          {fmt(product.sale_price)}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm font-bold text-[#242424]">
                        {fmt(product.price)}
                      </p>
                    )}
                  </div>

                  {/* دکمه‌ها */}
                  <div className="flex gap-2 pt-1">
                    {product.is_in_stock ? (
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={isInCart(product.id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all ${
                          isInCart(product.id)
                            ? "bg-[#F6EAEB] text-[#A72F3B] cursor-default"
                            : "bg-[#A72F3B] text-white hover:bg-[#86262F]"
                        }`}
                      >
                        {isInCart(product.id) ? (
                          <>
                            <HiCheck className="w-3.5 h-3.5" /> در سبد
                          </>
                        ) : (
                          <>
                            <HiShoppingCart className="w-3.5 h-3.5" /> سبد خرید
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="flex-1 text-center py-2 rounded-xl text-xs text-[#AFAFAF] bg-[#F5F5F5]">
                        ناموجود
                      </span>
                    )}

                    {/* حذف */}
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="p-2 bg-[#FBEAEA] text-[#C30000] hover:bg-[#F6D5D5] rounded-xl transition-colors"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {meta.last_page > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                onPageChange={(page) =>
                  setMeta((m) => ({ ...m, current_page: page }))
                }
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
