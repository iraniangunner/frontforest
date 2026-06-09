"use client";

// app/products/_components/ProductCard.tsx
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  HiShoppingCart,
  HiHeart,
  HiTag,
  HiStar,
  HiCheck,
  HiExclamationCircle,
} from "react-icons/hi";
import { Product } from "@/types";
import { cartAPI, favoritesAPI } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useUserStatus } from "@/context/UserStatusContext";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const fmt = (n: number) => Number(n).toLocaleString("fa-IR");

// fix: rating ممکنه string یا null بیاد
const safeRating = (r: any): number => {
  const n = parseFloat(String(r ?? 0));
  return isNaN(n) ? 0 : n;
};

interface Props {
  product: Product;
  view?: "grid" | "list";
  priority?: boolean;
}

export default function ProductCard({
  product,
  view = "grid",
  priority = false,
}: Props) {
  const { refreshCart } = useCart();
  const { toggleFavorite, isInCart, isFavorite, addToCart } = useUserStatus();
  const { user } = useAuth();

  const [adding, setAdding] = useState(false);
  const [togglingFav, setTogglingFav] = useState(false);

  // آیا این محصول در سبد هست؟

  // ── افزودن به سبد ──────────────────────────────────────────────────
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.is_in_stock) return;

    if (!user) {
      toast.error("ابتدا وارد حساب خود شوید");
      return;
    }

    if (isInCart(product.id)) {
      toast("این محصول قبلاً به سبد اضافه شده", { icon: "🛒" });
      return;
    }

    setAdding(true);
    try {
      await cartAPI.add(product.id, 1);
      addToCart(product.id);
      refreshCart(); // ← optimistic update — UI فوری عوض میشه
      toast.success("به سبد خرید اضافه شد");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در افزودن");
    } finally {
      setAdding(false);
    }
  };

  // ── علاقه‌مندی ─────────────────────────────────────────────────────
  const toggleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (togglingFav) return;

    if (!user) {
      toast.error("ابتدا وارد حساب خود شوید");
      return;
    }

    setTogglingFav(true);
    try {
      await favoritesAPI.toggle(product.id);
      if (isFavorite(product.id)) {
        toggleFavorite(product.id);
        toast("از علاقه‌مندی‌ها حذف شد", { icon: "🗑️" });
      } else {
        toggleFavorite(product.id);
        toast.success("به علاقه‌مندی‌ها اضافه شد");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا");
    } finally {
      setTogglingFav(false);
    }
  };

  const rating = safeRating(product.rating);

  // ════════════════════════════════════════════════════════════════════
  // LIST VIEW
  // ════════════════════════════════════════════════════════════════════
  if (view === "list")
    return (
      <Link
        href={`/products/${product.slug}`}
        className="group flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
      >
        {/* تصویر */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              sizes="80px"
              className="object-cover"
              priority={priority}
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-2xl">
              📦
            </span>
          )}
          {product.is_on_sale && (
            <span className="absolute top-1 right-1 text-[10px] font-bold bg-red-500 text-white px-1 py-0.5 rounded">
              {product.discount_percent}٪
            </span>
          )}
        </div>

        {/* اطلاعات */}
        <div className="flex-1 min-w-0">
          {product.category && (
            <p className="text-xs text-gray-400 mb-0.5">
              {/* نمایش مسیر: والد > فرزند */}

              {product.category.name}
            </p>
          )}
          <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-teal-600 transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <div className="flex items-center gap-0.5">
              <HiStar className="w-3.5 h-3.5 text-amber-400" />
              {/* fix: toFixed روی عدد واقعی */}
              <span className="text-xs text-gray-600 font-medium">
                {rating > 0 ? rating.toFixed(1) : "—"}
              </span>
              <span className="text-xs text-gray-400">
                ({product.reviews_count})
              </span>
            </div>
            {!product.is_in_stock && (
              <span className="flex items-center gap-0.5 text-xs text-red-400">
                <HiExclamationCircle className="w-3 h-3" /> ناموجود
              </span>
            )}
            {product.is_low_stock && product.is_in_stock && (
              <span className="text-xs text-orange-400 flex items-center gap-0.5">
                <HiTag className="w-3 h-3" /> موجودی محدود
              </span>
            )}
          </div>
        </div>

        {/* قیمت + دکمه‌ها */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {product.sale_price ? (
            <>
              <p className="text-xs text-gray-400 line-through">
                {fmt(product.price)} ت
              </p>
              <p className="font-bold text-gray-900 text-sm">
                {fmt(product.sale_price)}{" "}
                <span className="text-xs font-normal text-gray-400">ت</span>
              </p>
            </>
          ) : (
            <p className="font-bold text-gray-900 text-sm">
              {fmt(product.price)}{" "}
              <span className="text-xs font-normal text-gray-400">ت</span>
            </p>
          )}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleFav}
              disabled={togglingFav}
              aria-label={isFavorite(product.id)? "در علاقه مندی ها" : "افزودن به علاقه مندی ها"}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                isFavorite(product.id)
                  ? "border-red-200 bg-red-50 text-red-500"
                  : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400"
              }`}
            >
              <HiHeart className="w-4 h-4" />
            </button>

            {/* دکمه سبد — UI تغییر میکنه وقتی در سبد هست */}
            <button
              onClick={handleAddToCart}
              disabled={adding || !product.is_in_stock}
              aria-label={isInCart(product.id)? "در سبد خرید" : "افزودن به سبد خرید"}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                isInCart(product.id)
                  ? "bg-teal-50 text-teal-700 border border-teal-200"
                  : "bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40"
              }`}
            >
              {adding ? (
                <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              ) : isInCart(product.id) ? (
                <>
                  <HiCheck className="w-3.5 h-3.5" /> در سبد
                </>
              ) : (
                <>
                  <HiShoppingCart className="w-3.5 h-3.5" /> افزودن
                </>
              )}
            </button>
          </div>
        </div>
      </Link>
    );

  // ════════════════════════════════════════════════════════════════════
  // GRID VIEW
  // ════════════════════════════════════════════════════════════════════
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all flex flex-col"
    >
      {/* تصویر */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={priority}
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-4xl">
            📦
          </span>
        )}

        {/* badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {product.is_on_sale && (
            <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full shadow-sm">
              {product.discount_percent}٪ تخفیف
            </span>
          )}
          {product.is_new && !product.is_on_sale && (
            <span className="text-[10px] font-bold bg-teal-500 text-white px-2 py-0.5 rounded-full shadow-sm">
              جدید
            </span>
          )}
        </div>

        {/* ناموجود */}
        {!product.is_in_stock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-600 bg-white px-3 py-1.5 rounded-full border border-gray-200">
              ناموجود
            </span>
          </div>
        )}

        {/* علاقه‌مندی */}
        <button
          onClick={toggleFav}
          disabled={togglingFav}
          aria-label={isFavorite(product.id)? "در علاقه مندی ها" : "افزودن به علاقه مندی ها"}
          className={`absolute top-2 left-2 w-8 h-8 rounded-full shadow flex items-center justify-center transition-all
            opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 ${
              isFavorite(product.id)
                ? "bg-red-50 text-red-500 !opacity-100 border border-red-200"
                : "bg-white text-gray-400 hover:text-red-500 border border-gray-100"
            }`}
        >
          <HiHeart className="w-4 h-4" />
        </button>
      </div>

      {/* محتوا */}
      <div className="p-3 flex flex-col flex-1">
        {/* نمایش مسیر دسته‌بندی: والد > فرزند */}
        {product.category && (
          <p className="text-xs text-gray-400 mb-0.5">
            {product.category.name}
          </p>
        )}

        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-2 flex-1 group-hover:text-teal-600 transition-colors">
          {product.title}
        </h3>

        {/* امتیاز */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <HiStar
              key={i}
              className={`w-3 h-3 ${
                i < Math.round(rating) ? "text-amber-400" : "text-gray-200"
              }`}
            />
          ))}
          <span className="text-xs text-gray-400 mr-0.5">
            ({product.reviews_count})
          </span>
        </div>

        {/* قیمت + دکمه سبد */}
        <div className="flex items-end justify-between gap-2 mt-auto">
          <div>
            {product.sale_price ? (
              <>
                <p className="text-xs text-gray-400 line-through leading-none mb-0.5">
                  {fmt(product.price)} ت
                </p>
                <p className="font-bold text-gray-900 text-sm leading-tight">
                  {fmt(product.sale_price)}
                  <span className="text-xs font-normal text-gray-400 mr-0.5">
                    تومان
                  </span>
                </p>
              </>
            ) : (
              <p className="font-bold text-gray-900 text-sm leading-tight">
                {fmt(product.price)}
                <span className="text-xs font-normal text-gray-400 mr-0.5">
                  تومان
                </span>
              </p>
            )}
          </div>

          {/* دکمه سبد — وقتی در سبد هست UI فرق میکنه */}
          <button
            onClick={handleAddToCart}
            disabled={adding || !product.is_in_stock}
            aria-label={isInCart(product.id)? "در سبد خرید" : "افزودن به سبد خرید"}
            title={isInCart(product.id) ? "در سبد خرید" : "افزودن به سبد"}
            className={`w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl transition-all ${
              isInCart(product.id)
                ? "bg-teal-50 text-teal-600 border-2 border-teal-300"
                : "bg-teal-600 text-white hover:bg-teal-700 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            }`}
          >
            {adding ? (
              <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            ) : isInCart(product.id) ? (
              <HiCheck className="w-4 h-4" />
            ) : (
              <HiShoppingCart className="w-4 h-4" />
            )}
          </button>
        </div>

        {product.is_low_stock && product.is_in_stock && (
          <p className="text-xs text-orange-400 mt-1.5 flex items-center gap-1">
            <HiTag className="w-3 h-3" /> موجودی محدود
          </p>
        )}
      </div>
    </Link>
  );
}
