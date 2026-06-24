"use client";

// app/products/_components/ProductCard.tsx
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
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
import { guestCart } from "@/lib/guestCart";
import toast from "react-hot-toast";

const fmt = (n: number) => Number(n).toLocaleString("fa-IR");

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
  const { user, loading: authLoading } = useAuth();

  const [adding, setAdding] = useState(false);
  const [togglingFav, setTogglingFav] = useState(false);
  const [isInGuestCart, setIsInGuestCart] = useState(false);

  // وقتی auth state مشخص شد، guest cart رو چک کن
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIsInGuestCart(guestCart.get().some((i) => i.id === product.id));
    } else {
      setIsInGuestCart(false);
    }
  }, [user, authLoading, product.id]);

  const inCart = isInCart(product.id) || isInGuestCart;
  // تا وقتی auth چک نشده، دکمه loading نشون بده
  const cartButtonLoading = authLoading || adding;

  // ── افزودن به سبد ──
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.is_in_stock) return;

    if (!user) {
      if (isInGuestCart) {
        toast("این محصول قبلاً به سبد اضافه شده", { icon: "🛒" });
        return;
      }
      guestCart.add({
        id: product.id,
        quantity: 1,
        slug: product.slug,
        title: product.title,
        thumbnail: product.thumbnail ?? null,
        price: product.price,
        sale_price: product.sale_price ?? null,
        current_price: product.current_price,
        stock: product.stock,
      });
      setIsInGuestCart(true);
      toast.success("به سبد اضافه شد");
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
      refreshCart();
      toast.success("به سبد خرید اضافه شد");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در افزودن");
    } finally {
      setAdding(false);
    }
  };

  // ── علاقه‌مندی ──
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

  // ════════════════════════════════════════════════════════
  // LIST VIEW
  // ════════════════════════════════════════════════════════
  if (view === "list")
    return (
      <Link
        href={`/products/${product.slug}`}
        className="group flex items-center gap-4 bg-white rounded-2xl p-4 border border-[#F0F0F0] hover:border-[#DCACB1] hover:shadow-sm transition-all"
      >
        {/* تصویر */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#F8F8F8] flex-shrink-0 border border-[#F0F0F0]">
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
            <span className="absolute top-1 right-1 text-[10px] font-bold bg-[#A72F3B] text-white px-1 py-0.5 rounded">
              {product.discount_percent}٪
            </span>
          )}
        </div>

        {/* اطلاعات */}
        <div className="flex-1 min-w-0">
          {product.category && (
            <p className="text-xs text-[#AFAFAF] mb-0.5">
              {product.category.name}
            </p>
          )}
          <h3 className="font-semibold text-[#242424] text-sm truncate group-hover:text-[#A72F3B] transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <div className="flex items-center gap-0.5">
              <HiStar className="w-3.5 h-3.5 text-[#F4B740]" />
              <span className="text-xs text-[#656565] font-medium">
                {rating > 0 ? rating.toFixed(1) : "—"}
              </span>
              <span className="text-xs text-[#AFAFAF]">
                ({product.reviews_count})
              </span>
            </div>
            {!product.is_in_stock && (
              <span className="flex items-center gap-0.5 text-xs text-[#C30000]">
                <HiExclamationCircle className="w-3 h-3" /> ناموجود
              </span>
            )}
            {product.is_low_stock && product.is_in_stock && (
              <span className="text-xs text-[#A9791C] flex items-center gap-0.5">
                <HiTag className="w-3 h-3" /> موجودی محدود
              </span>
            )}
          </div>
        </div>

        {/* قیمت + دکمه‌ها */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {product.sale_price ? (
            <>
              <p className="text-xs text-[#AFAFAF] line-through">
                {fmt(product.price)} ت
              </p>
              <p className="font-bold text-[#242424] text-sm">
                {fmt(product.sale_price)}{" "}
                <span className="text-xs font-normal text-[#AFAFAF]">ت</span>
              </p>
            </>
          ) : (
            <p className="font-bold text-[#242424] text-sm">
              {fmt(product.price)}{" "}
              <span className="text-xs font-normal text-[#AFAFAF]">ت</span>
            </p>
          )}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleFav}
              disabled={togglingFav}
              aria-label={
                isFavorite(product.id)
                  ? "در علاقه مندی ها"
                  : "افزودن به علاقه مندی ها"
              }
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                isFavorite(product.id)
                  ? "border-[#F3C5C9] bg-[#FBEAEA] text-[#C30000]"
                  : "border-[#EDEDED] text-[#AFAFAF] hover:border-[#F3C5C9] hover:text-[#C30000]"
              }`}
            >
              <HiHeart className="w-4 h-4" />
            </button>

            <button
              onClick={handleAddToCart}
              disabled={cartButtonLoading || !product.is_in_stock}
              aria-label={inCart ? "در سبد خرید" : "افزودن به سبد خرید"}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                inCart
                  ? "bg-[#F6EAEB] text-[#A72F3B] border border-[#EDD5D8]"
                  : "bg-[#A72F3B] text-white hover:bg-[#86262F] disabled:opacity-40"
              }`}
            >
              {cartButtonLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              ) : inCart ? (
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

  // ════════════════════════════════════════════════════════
  // GRID VIEW
  // ════════════════════════════════════════════════════════
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-[#F0F0F0] hover:border-[#DCACB1] hover:shadow-lg transition-all flex flex-col"
    >
      {/* تصویر */}
      <div className="relative aspect-square overflow-hidden bg-[#F8F8F8]">
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
            <span className="text-[10px] font-bold bg-[#A72F3B] text-white px-2 py-0.5 rounded-full shadow-sm">
              {product.discount_percent}٪ تخفیف
            </span>
          )}
          {product.is_new && !product.is_on_sale && (
            <span className="text-[10px] font-bold bg-[#00966D] text-white px-2 py-0.5 rounded-full shadow-sm">
              جدید
            </span>
          )}
        </div>

        {/* ناموجود */}
        {!product.is_in_stock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-semibold text-[#656565] bg-white px-3 py-1.5 rounded-full border border-[#EDEDED]">
              ناموجود
            </span>
          </div>
        )}

        {/* علاقه‌مندی */}
        <button
          onClick={toggleFav}
          disabled={togglingFav}
          aria-label={
            isFavorite(product.id)
              ? "در علاقه مندی ها"
              : "افزودن به علاقه مندی ها"
          }
          className={`absolute top-2 left-2 w-8 h-8 rounded-full shadow flex items-center justify-center transition-all
            opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 ${
              isFavorite(product.id)
                ? "bg-[#FBEAEA] text-[#C30000] !opacity-100 border border-[#F3C5C9]"
                : "bg-white text-[#AFAFAF] hover:text-[#C30000] border border-[#F0F0F0]"
            }`}
        >
          <HiHeart className="w-4 h-4" />
        </button>
      </div>

      {/* محتوا */}
      <div className="p-3 flex flex-col flex-1">
        {product.category && (
          <p className="text-xs text-[#AFAFAF] mb-0.5">
            {product.category.name}
          </p>
        )}

        <h3 className="text-sm font-semibold text-[#242424] line-clamp-2 leading-snug mb-2 flex-1 group-hover:text-[#A72F3B] transition-colors">
          {product.title}
        </h3>

        {/* امتیاز */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <HiStar
              key={i}
              className={`w-3 h-3 ${
                i < Math.round(rating) ? "text-[#F4B740]" : "text-[#EDEDED]"
              }`}
            />
          ))}
          <span className="text-xs text-[#AFAFAF] mr-0.5">
            ({product.reviews_count})
          </span>
        </div>

        {/* قیمت + دکمه سبد */}
        <div className="flex items-end justify-between gap-2 mt-auto">
          <div>
            {product.sale_price ? (
              <>
                <p className="text-xs text-[#AFAFAF] line-through leading-none mb-0.5">
                  {fmt(product.price)} ت
                </p>
                <p className="font-bold text-[#242424] text-sm leading-tight">
                  {fmt(product.sale_price)}
                  <span className="text-xs font-normal text-[#AFAFAF] mr-0.5">
                    تومان
                  </span>
                </p>
              </>
            ) : (
              <p className="font-bold text-[#242424] text-sm leading-tight">
                {fmt(product.price)}
                <span className="text-xs font-normal text-[#AFAFAF] mr-0.5">
                  تومان
                </span>
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={cartButtonLoading || !product.is_in_stock}
            aria-label={inCart ? "در سبد خرید" : "افزودن به سبد خرید"}
            title={inCart ? "در سبد خرید" : "افزودن به سبد"}
            className={`w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl transition-all ${
              inCart
                ? "bg-[#F6EAEB] text-[#A72F3B] border-2 border-[#DCACB1]"
                : "bg-[#A72F3B] text-white hover:bg-[#86262F] shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            }`}
          >
            {cartButtonLoading ? (
              <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            ) : inCart ? (
              <HiCheck className="w-4 h-4" />
            ) : (
              <HiShoppingCart className="w-4 h-4" />
            )}
          </button>
        </div>

        {product.is_low_stock && product.is_in_stock && (
          <p className="text-xs text-[#A9791C] mt-1.5 flex items-center gap-1">
            <HiTag className="w-3 h-3" /> موجودی محدود
          </p>
        )}
      </div>
    </Link>
  );
}
