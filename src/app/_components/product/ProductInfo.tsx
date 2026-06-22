// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { HiStar, HiHeart, HiShoppingCart, HiCheck, HiX } from "react-icons/hi";
// import { HiCube, HiScale, HiTag, HiTruck } from "react-icons/hi2";
// import toast from "react-hot-toast";
// import { cartAPI, favoritesAPI } from "@/lib/api";
// import { Product } from "@/types";
// import { useCart } from "@/context/CartContext";
// import { useUserStatus } from "@/context/UserStatusContext";
// import { useAuth } from "@/context/AuthContext";

// interface ProductInfoProps {
//   product: Product;
// }

// const formatPrice = (price: number) => price.toLocaleString("fa-IR") + " تومان";

// function StarRating({ rating }: { rating: number }) {
//   return (
//     <div className="flex items-center gap-0.5">
//       {[1, 2, 3, 4, 5].map((i) => (
//         <HiStar
//           key={i}
//           className={`w-5 h-5 ${
//             i <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"
//           }`}
//         />
//       ))}
//     </div>
//   );
// }

// export default function ProductInfo({ product }: ProductInfoProps) {
//   const [quantity, setQuantity] = useState(1);
//   const [addingToCart, setAddingToCart] = useState(false);

//   const { user } = useAuth();

//   const { incrementCart } = useCart();

//   const {
//     isFavorite: checkFavorite,
//     toggleFavorite: toggleFavoriteContext,
//     isInCart,
//     addToCart: addToCartContext,
//     loading: statusLoading,
//   } = useUserStatus();

//   const inCart = isInCart(product.id);
//   const isFavorite = checkFavorite(product.id);

//   const handleAddToCart = async () => {
//     if (!user) {
//       toast.error("ابتدا وارد حساب خود شوید");
//       return;
//     }

//     setAddingToCart(true);

//     try {
//       await cartAPI.add(product.id, quantity);

//       // sync global state
//       addToCartContext(product.id);
//       incrementCart();

//       toast.success("به سبد خرید اضافه شد");
//     } catch (error: any) {
//       if (error.response?.status === 409) {
//         addToCartContext(product.id);
//         toast.error("این محصول در سبد خرید موجود است");
//       } else {
//         toast.error(error.response?.data?.message || "خطا در افزودن به سبد");
//       }
//     } finally {
//       setAddingToCart(false);
//     }
//   };
//   const handleFavorite = async () => {
//     if (!user) {
//       toast.error("ابتدا وارد حساب خود شوید");
//       return;
//     }

//     try {
//       toggleFavoriteContext(product.id); // optimistic update

//       await favoritesAPI.toggle(product.id);

//       toast.success(
//         isFavorite ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد",
//       );
//     } catch (error) {
//       toggleFavoriteContext(product.id); // revert
//       toast.error("خطا در عملیات");
//     }
//   };
//   return (
//     <div className="space-y-5">
//       {/* برند + دسته‌بندی + بج‌ها */}
//       <div className="flex items-center gap-2 flex-wrap">
//         {product.brand && (
//           <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium">
//             {product.brand}
//           </span>
//         )}
//         {product.category?.parent && (
//           <Link
//             href={`/products/${product.category.parent.slug}/${product.category.slug}`}
//             className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition"
//           >
//             {product.category?.name}
//           </Link>
//         )}

//         {product.is_featured && (
//           <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full">
//             ویژه
//           </span>
//         )}
//         {product.is_new && (
//           <span className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
//             جدید
//           </span>
//         )}
//       </div>

//       {/* عنوان */}
//       <h1 className="text-2xl font-bold text-gray-900 leading-snug">
//         {product.title}
//       </h1>

//       {/* امتیاز */}
//       <div className="flex items-center gap-3">
//         <StarRating rating={product.rating} />
//         <span className="text-gray-600 text-sm">
//           {product.rating} از ۵ ({product.reviews_count} نظر)
//         </span>
//         {/* <span className="text-gray-300">|</span>
//         <span className="text-gray-500 text-sm">
//           {product.sales_count} فروش
//         </span> */}
//       </div>

//       {/* توضیح کوتاه */}
//       {product.short_description && (
//         <p className="text-gray-600 leading-relaxed">
//           {product.short_description}
//         </p>
//       )}

//       {/* قیمت */}
//       <div className="bg-white rounded-xl p-4 border border-gray-100">
//         {product.is_on_sale ? (
//           <div className="flex items-center gap-3 flex-wrap">
//             <span className="text-3xl font-bold text-blue-600">
//               {formatPrice(product.current_price)}
//             </span>
//             <span className="text-gray-400 line-through text-lg">
//               {formatPrice(product.price)}
//             </span>
//             <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-bold rounded-lg">
//               {product.discount_percent}٪ تخفیف
//             </span>
//           </div>
//         ) : (
//           <span className="text-3xl font-bold text-gray-900">
//             {formatPrice(product.price)}
//           </span>
//         )}
//       </div>

//       {/* وضعیت موجودی */}
//       <div className="flex items-center gap-2">
//         {product.is_in_stock ? (
//           <>
//             <HiCheck className="w-5 h-5 text-green-500" />
//             <span
//               className={`font-medium ${
//                 product.is_low_stock ? "text-orange-500" : "text-green-600"
//               }`}
//             >
//               {product.is_low_stock
//                 ? `تنها ${product.stock} عدد در انبار`
//                 : "موجود در انبار"}
//             </span>
//           </>
//         ) : (
//           <>
//             <HiX className="w-5 h-5 text-red-500" />
//             <span className="font-medium text-red-500">ناموجود</span>
//           </>
//         )}
//       </div>

//       {/* انتخاب تعداد + دکمه‌های اکشن */}
//       {product.is_in_stock && (
//         <div className="flex items-center gap-3">
//           {/* تعداد */}
//           <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
//             <button
//               onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//               className="w-10 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition text-lg"
//             >
//               −
//             </button>
//             <span className="w-10 h-11 flex items-center justify-center font-medium text-gray-800">
//               {quantity}
//             </span>
//             <button
//               onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
//               className="w-10 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition text-lg"
//             >
//               +
//             </button>
//           </div>

//           {/* افزودن به سبد */}
//           <button
//             onClick={handleAddToCart}
//             disabled={addingToCart || inCart}
//             className={`flex-1 h-11 flex items-center justify-center gap-2 rounded-xl font-medium transition ${
//               inCart
//                 ? "bg-green-500 text-white"
//                 : "bg-blue-600 hover:bg-blue-700 text-white"
//             } disabled:opacity-70`}
//           >
//             {inCart ? (
//               <>
//                 <HiCheck className="w-5 h-5" /> در سبد خرید
//               </>
//             ) : addingToCart ? (
//               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//             ) : (
//               <>
//                 <HiShoppingCart className="w-5 h-5" /> افزودن به سبد
//               </>
//             )}
//           </button>

//           {/* علاقه‌مندی */}
//           <button
//             onClick={handleFavorite}
//             aria-label={
//               isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"
//             }
//             className={`w-11 h-11 flex items-center justify-center rounded-xl border transition ${
//               isFavorite
//                 ? "bg-red-50 border-red-200 text-red-500"
//                 : "border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200"
//             }`}
//           >
//             <HiHeart className="w-5 h-5" />
//           </button>
//         </div>
//       )}

//       {/* مشخصات سریع */}
//       <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
//         {product.sku && (
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <HiTag className="w-4 h-4 text-gray-400 flex-shrink-0" />
//             <span>
//               کد: <span className="font-mono">{product.sku}</span>
//             </span>
//           </div>
//         )}
//         {product.weight ? (
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <HiScale className="w-4 h-4 text-gray-400 flex-shrink-0" />
//             <span>وزن: {product.weight} گرم</span>
//           </div>
//         ) : null}
//         {product.dimensions && (
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <HiCube className="w-4 h-4 text-gray-400 flex-shrink-0" />
//             <span>ابعاد: {product.dimensions}</span>
//           </div>
//         )}
//         <div className="flex items-center gap-2 text-sm text-gray-600">
//           <HiTruck className="w-4 h-4 text-gray-400 flex-shrink-0" />
//           <span>ارسال سریع</span>
//         </div>
//       </div>

//       {/* تگ‌ها */}
//       {product.tags?.length > 0 && (
//         <div className="flex flex-wrap gap-2">
//           {product.tags.map((tag: any) => (
//             <span
//               key={tag.id}
//               className="px-3 py-1 rounded-full text-xs font-medium"
//               style={{ backgroundColor: tag.color + "20", color: tag.color }}
//             >
//               {tag.name}
//             </span>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiStar, HiHeart, HiShoppingCart, HiCheck, HiX } from "react-icons/hi";
import { HiCube, HiScale, HiTag, HiTruck } from "react-icons/hi2";
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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <HiStar
          key={i}
          className={`w-5 h-5 ${
            i <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"
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
        isFavorite ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد",
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

  return (
    <div className="space-y-5">
      {/* برند + دسته‌بندی + بج‌ها */}
      <div className="flex items-center gap-2 flex-wrap">
        {product.brand && (
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium">
            {product.brand}
          </span>
        )}
        {product.category?.parent && (
          <Link
            href={`/products/${product.category.parent.slug}/${product.category.slug}`}
            className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition"
          >
            {product.category?.name}
          </Link>
        )}
        {product.is_featured && (
          <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full">
            ویژه
          </span>
        )}
        {product.is_new && (
          <span className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
            جدید
          </span>
        )}
      </div>

      {/* عنوان */}
      <h1 className="text-2xl font-bold text-gray-900 leading-snug">
        {product.title}
      </h1>

      {/* امتیاز */}
      <div className="flex items-center gap-3">
        <StarRating rating={product.rating} />
        <span className="text-gray-600 text-sm">
          {product.rating} از ۵ ({product.reviews_count} نظر)
        </span>
      </div>

      {/* توضیح کوتاه */}
      {product.short_description && (
        <p className="text-gray-600 leading-relaxed">
          {product.short_description}
        </p>
      )}

      {/* قیمت */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        {product.is_on_sale ? (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-3xl font-bold text-blue-600">
              {formatPrice(product.current_price)}
            </span>
            <span className="text-gray-400 line-through text-lg">
              {formatPrice(product.price)}
            </span>
            <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-bold rounded-lg">
              {product.discount_percent}٪ تخفیف
            </span>
          </div>
        ) : (
          <span className="text-3xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
        )}
      </div>

      {/* وضعیت موجودی */}
      <div className="flex items-center gap-2">
        {product.is_in_stock ? (
          <>
            <HiCheck className="w-5 h-5 text-green-500" />
            <span
              className={`font-medium ${
                product.is_low_stock ? "text-orange-500" : "text-green-600"
              }`}
            >
              {product.is_low_stock
                ? `تنها ${product.stock} عدد در انبار`
                : "موجود در انبار"}
            </span>
          </>
        ) : (
          <>
            <HiX className="w-5 h-5 text-red-500" />
            <span className="font-medium text-red-500">ناموجود</span>
          </>
        )}
      </div>

      {/* دکمه‌های اکشن */}
      {product.is_in_stock && (
        <div className="flex items-center gap-3">
          {/* انتخاب تعداد — فقط قبل از اضافه کردن */}
          {btnState === "idle" && (
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition text-lg"
              >
                −
              </button>
              <span className="w-10 h-11 flex items-center justify-center font-medium text-gray-800">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock, q + 1))
                }
                className="w-10 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition text-lg"
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
            className={`flex-1 h-11 flex items-center justify-center gap-2 rounded-xl font-medium transition disabled:opacity-70 ${
              btnState === "inCart" || btnState === "guestAdded"
                ? "bg-green-500 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {btnState === "inCart" && (
              <>
                <HiCheck className="w-5 h-5" /> در سبد خرید
              </>
            )}
            {btnState === "guestAdded" && (
              <>
                <HiCheck className="w-5 h-5" /> در سبد خرید
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
            className={`w-11 h-11 flex items-center justify-center rounded-xl border transition ${
              isFavorite
                ? "bg-red-50 border-red-200 text-red-500"
                : "border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200"
            }`}
          >
            <HiHeart className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* مشخصات سریع */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
        {product.sku && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HiTag className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>
              کد: <span className="font-mono">{product.sku}</span>
            </span>
          </div>
        )}
        {product.weight ? (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HiScale className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>وزن: {product.weight} گرم</span>
          </div>
        ) : null}
        {product.dimensions && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HiCube className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>ابعاد: {product.dimensions}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <HiTruck className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>ارسال سریع</span>
        </div>
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
