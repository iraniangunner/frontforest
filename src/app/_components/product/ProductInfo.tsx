"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiStar, HiHeart, HiShoppingCart, HiCheck, HiX } from "react-icons/hi";
import {
  HiCube,
  HiScale,
  HiTag,
  HiTruck,
  HiShieldCheck,
  HiLockClosed,
} from "react-icons/hi2";
import toast from "react-hot-toast";
import { cartAPI, favoritesAPI } from "@/lib/api";
import { guestCart } from "@/lib/guestCart";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useUserStatus } from "@/context/UserStatusContext";
import { useAuth } from "@/context/AuthContext";

interface ProductInfoProps {
  product: Product;
}

const formatPrice = (price: number) => price.toLocaleString("fa-IR") + " تومان";
const fmt = (n: number) => Number(n).toLocaleString("fa-IR");

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <HiStar
          key={i}
          className={`w-5 h-5 ${
            i <= Math.round(rating) ? "text-[#F4B740]" : "text-[#EDEDED]"
          }`}
        />
      ))}
    </div>
  );
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [guestAdded, setGuestAdded] = useState(false);

  const { user, loading: authLoading } = useAuth();
  const { incrementCart } = useCart();
  const {
    isFavorite: checkFavorite,
    toggleFavorite: toggleFavoriteContext,
    isInCart,
    addToCart: addToCartContext,
  } = useUserStatus();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setGuestAdded(guestCart.get().some((i) => i.id === product.id));
    } else {
      setGuestAdded(false);
    }
  }, [user, authLoading, product.id]);

  const inCart = isInCart(product.id);
  const isFavorite = checkFavorite(product.id);

  const handleAddToCart = async () => {
    if (!user) {
      guestCart.add({
        id: product.id,
        quantity,
        slug: product.slug,
        title: product.title,
        thumbnail: product.thumbnail ?? null,
        price: product.price,
        sale_price: product.sale_price ?? null,
        current_price: product.current_price,
        stock: product.stock,
      });
      setGuestAdded(true);
      toast.success("به سبد اضافه شد");
      return;
    }

    setAddingToCart(true);
    try {
      await cartAPI.add(product.id, quantity);
      addToCartContext(product.id);
      incrementCart();
      toast.success("به سبد خرید اضافه شد");
    } catch (error: any) {
      if (error.response?.status === 409) {
        addToCartContext(product.id);
        toast.error("این محصول در سبد خرید موجود است");
      } else {
        toast.error(error.response?.data?.message || "خطا در افزودن به سبد");
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error("ابتدا وارد حساب خود شوید");
      return;
    }
    try {
      toggleFavoriteContext(product.id);
      await favoritesAPI.toggle(product.id);
      toast.success(
        isFavorite ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد"
      );
    } catch {
      toggleFavoriteContext(product.id);
      toast.error("خطا در عملیات");
    }
  };

  type BtnState = "inCart" | "guestAdded" | "loading" | "idle";
  const btnState: BtnState = authLoading
    ? "loading"
    : inCart
    ? "inCart"
    : guestAdded
    ? "guestAdded"
    : addingToCart
    ? "loading"
    : "idle";

  // مبلغ صرفه‌جویی (فقط نمایشی — از همان فیلدهای موجود)
  const saving =
    product.is_on_sale && product.price > product.current_price
      ? product.price - product.current_price
      : 0;

  return (
    <div className="space-y-5">
      {/* برند + دسته‌بندی + بج‌ها */}
      <div className="flex items-center gap-2 flex-wrap">
        {product.brand && (
          <span className="px-3 py-1 bg-[#F6EAEB] text-[#A72F3B] text-sm rounded-full font-medium">
            {product.brand}
          </span>
        )}
        {product.category?.parent && (
          <Link
            href={`/products/${product.category.parent.slug}/${product.category.slug}`}
            className="px-3 py-1 bg-[#F5F5F5] text-[#656565] text-sm rounded-full hover:bg-[#EDEDED] transition"
          >
            {product.category?.name}
          </Link>
        )}
        {product.is_featured && (
          <span className="px-3 py-1 bg-[#FBEFD7] text-[#A9791C] text-sm rounded-full">
            ویژه
          </span>
        )}
        {product.is_new && (
          <span className="px-3 py-1 bg-[#E6F4EF] text-[#00966D] text-sm rounded-full">
            جدید
          </span>
        )}
      </div>

      {/* عنوان */}
      <h1 className="text-2xl font-bold text-[#242424] leading-snug">
        {product.title}
      </h1>

      {/* امتیاز */}
      <div className="flex items-center gap-3">
        <StarRating rating={product.rating} />
        <span className="text-[#656565] text-sm">
          {product.rating} از ۵ ({product.reviews_count} نظر)
        </span>
      </div>

      {/* توضیح کوتاه */}
      {product.short_description && (
        <p className="text-[#656565] leading-relaxed">
          {product.short_description}
        </p>
      )}

      {/* ── کارت قیمت ── */}
      <div className="relative overflow-hidden rounded-2xl border border-[#EDD5D8] bg-gradient-to-bl from-[#F6EAEB] to-[#FCF4F5] p-5">
        {product.is_on_sale ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-3xl font-extrabold text-[#A72F3B]">
                {formatPrice(product.current_price)}
              </span>
              <span className="px-2.5 py-1 bg-[#A72F3B] text-white text-xs font-bold rounded-lg">
                {product.discount_percent}٪ تخفیف
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#AFAFAF] line-through">
                {formatPrice(product.price)}
              </span>
              {saving > 0 && (
                <span className="text-[#00966D] font-medium">
                  {fmt(saving)} تومان سود شما
                </span>
              )}
            </div>
          </div>
        ) : (
          <span className="text-3xl font-extrabold text-[#242424]">
            {formatPrice(product.price)}
          </span>
        )}
      </div>

      {/* وضعیت موجودی */}
      <div className="flex items-center gap-2">
        {product.is_in_stock ? (
          <>
            <span className="w-6 h-6 rounded-full bg-[#E6F4EF] flex items-center justify-center">
              <HiCheck className="w-4 h-4 text-[#00966D]" />
            </span>
            <span
              className={`font-medium text-sm ${
                product.is_low_stock ? "text-[#A9791C]" : "text-[#00966D]"
              }`}
            >
              {product.is_low_stock
                ? `تنها ${product.stock} عدد در انبار`
                : "موجود در انبار"}
            </span>
          </>
        ) : (
          <>
            <span className="w-6 h-6 rounded-full bg-[#FBEAEA] flex items-center justify-center">
              <HiX className="w-4 h-4 text-[#C30000]" />
            </span>
            <span className="font-medium text-sm text-[#C30000]">ناموجود</span>
          </>
        )}
      </div>

      {/* دکمه‌های اکشن */}
      {product.is_in_stock && (
        <div className="flex items-center gap-3">
          {/* انتخاب تعداد — فقط قبل از اضافه کردن */}
          {btnState === "idle" && (
            <div className="flex items-center border border-[#EDEDED] rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-11 h-12 flex items-center justify-center text-[#656565] hover:bg-[#F6EAEB] hover:text-[#A72F3B] transition text-lg"
              >
                −
              </button>
              <span className="w-10 h-12 flex items-center justify-center font-bold text-[#242424]">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock, q + 1))
                }
                className="w-11 h-12 flex items-center justify-center text-[#656565] hover:bg-[#F6EAEB] hover:text-[#A72F3B] transition text-lg"
              >
                +
              </button>
            </div>
          )}

          {/* دکمه سبد */}
          <button
            onClick={
              btnState === "guestAdded"
                ? () => router.push("/cart")
                : handleAddToCart
            }
            disabled={btnState === "inCart" || btnState === "loading"}
            className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-xl font-semibold transition-all disabled:opacity-70 ${
              btnState === "inCart" || btnState === "guestAdded"
                ? "bg-[#F6EAEB] text-[#A72F3B] border border-[#EDD5D8]"
                : "bg-[#A72F3B] hover:bg-[#86262F] text-white shadow-lg shadow-[#A72F3B]/25 hover:-translate-y-0.5"
            }`}
          >
            {btnState === "inCart" && (
              <>
                <HiCheck className="w-5 h-5" /> در سبد خرید
              </>
            )}
            {btnState === "guestAdded" && (
              <>
                <HiCheck className="w-5 h-5" /> مشاهده سبد خرید
              </>
            )}
            {btnState === "loading" && (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {btnState === "idle" && (
              <>
                <HiShoppingCart className="w-5 h-5" /> افزودن به سبد
              </>
            )}
          </button>

          {/* علاقه‌مندی */}
          <button
            onClick={handleFavorite}
            aria-label={
              isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"
            }
            className={`w-12 h-12 flex items-center justify-center rounded-xl border transition ${
              isFavorite
                ? "bg-[#FBEAEA] border-[#F3C5C9] text-[#C30000]"
                : "border-[#EDEDED] text-[#AFAFAF] hover:text-[#C30000] hover:border-[#F3C5C9]"
            }`}
          >
            <HiHeart className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* ── نوار مزایا ── */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: HiTruck, label: "ارسال سریع" },
          { icon: HiShieldCheck, label: "ضمانت اصالت" },
          { icon: HiLockClosed, label: "پرداخت امن" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1.5 text-center bg-[#F8F8F8] rounded-xl py-3 px-2 border border-[#F0F0F0]"
          >
            <item.icon className="w-5 h-5 text-[#A72F3B]" />
            <span className="text-xs text-[#656565] font-medium">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* مشخصات سریع */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F0F0F0]">
        {product.sku && (
          <div className="flex items-center gap-2 text-sm text-[#656565]">
            <HiTag className="w-4 h-4 text-[#AFAFAF] flex-shrink-0" />
            <span>
              کد: <span className="font-mono">{product.sku}</span>
            </span>
          </div>
        )}
        {product.weight ? (
          <div className="flex items-center gap-2 text-sm text-[#656565]">
            <HiScale className="w-4 h-4 text-[#AFAFAF] flex-shrink-0" />
            <span>وزن: {product.weight} گرم</span>
          </div>
        ) : null}
        {product.dimensions && (
          <div className="flex items-center gap-2 text-sm text-[#656565]">
            <HiCube className="w-4 h-4 text-[#AFAFAF] flex-shrink-0" />
            <span>ابعاد: {product.dimensions}</span>
          </div>
        )}
      </div>

      {/* تگ‌ها */}
      {product.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag: any) => (
            <span
              key={tag.id}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: tag.color + "20", color: tag.color }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
