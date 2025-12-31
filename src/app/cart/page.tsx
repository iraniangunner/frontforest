"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiShoppingCart, HiTrash, HiArrowLeft } from "react-icons/hi";
import { cartAPI, checkoutAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";

interface CartItem {
  id: number;
  title: string;
  slug: string;
  thumbnail: string | null;
  price: number;
  sale_price: number | null;
  current_price: number;
  category: { name: string };
}

interface CartSummary {
  count: number;
  subtotal: number;
  discount: number;
  total: number;
}

export default function CartPage() {
  const router = useRouter();
  const { refreshCart, clearCart } = useCart();

  const [items, setItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary>({
    count: 0,
    subtotal: 0,
    discount: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const response = await cartAPI.get();
      setItems(response.data.data);
      setSummary(response.data.summary);
      refreshCart(); // Header آپدیت میشه
    } catch (error) {
      toast.error("خطا در دریافت سبد خرید");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (componentId: number) => {
    try {
      await cartAPI.remove(componentId);
      setItems((prev) => prev.filter((i) => i.id !== componentId));
      toast.success("از سبد خرید حذف شد");
      loadCart(); // آپدیت summary و Header
    } catch (error) {
      toast.error("خطا در حذف");
    }
  };

  const handleClear = async () => {
    if (!confirm("آیا از خالی کردن سبد خرید اطمینان دارید؟")) return;

    try {
      await cartAPI.clear();
      setItems([]);
      setSummary({ count: 0, subtotal: 0, discount: 0, total: 0 });
      clearCart(); // Header آپدیت میشه
      toast.success("سبد خرید خالی شد");
    } catch (error) {
      toast.error("خطا در خالی کردن سبد");
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const response = await checkoutAPI.checkout();
      
      if (response.data.success && response.data.data.payment_url) {
        window.location.href = response.data.data.payment_url;
      } else {
        toast.error("خطا در ایجاد سفارش");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در پرداخت");
    } finally {
      setCheckingOut(false);
    }
  };

  const formatPrice = (price: number) => price.toLocaleString() + " تومان";

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">سبد خرید</h1>
          {items.length > 0 && (
            <button
              onClick={handleClear}
              className="text-red-600 text-sm hover:text-red-700"
            >
              خالی کردن سبد
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <HiShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              سبد خرید خالی است
            </h3>
            <p className="text-gray-500 mb-4">
              کامپوننت‌های مورد نظر خود را به سبد اضافه کنید
            </p>
            <Link
              href="/components"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              مشاهده کامپوننت‌ها
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex gap-4">
                  <Link href={`/components/${item.slug}`}>
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      {item.thumbnail ? (
                        <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">بدون تصویر</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="flex-1">
                    <Link href={`/components/${item.slug}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-blue-600">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mb-2">{item.category?.name}</p>

                    <div className="flex items-center gap-2">
                      {item.sale_price && (
                        <span className="text-sm text-gray-400 line-through">{formatPrice(item.price)}</span>
                      )}
                      <span className="font-bold text-gray-900">{formatPrice(item.current_price)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="self-center p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <HiTrash className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                <h3 className="font-semibold text-gray-900 mb-4">خلاصه سفارش</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>جمع کل ({summary.count} کامپوننت)</span>
                    <span>{formatPrice(summary.subtotal)}</span>
                  </div>
                  {summary.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>تخفیف</span>
                      <span>- {formatPrice(summary.discount)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
                    <span>مبلغ قابل پرداخت</span>
                    <span>{formatPrice(summary.total)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  {checkingOut ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <HiArrowLeft className="w-5 h-5" />
                  )}
                  {checkingOut ? "در حال پردازش..." : "پرداخت و تکمیل خرید"}
                </button>

                <Link
                  href="/components"
                  className="block text-center text-blue-600 text-sm mt-4 hover:text-blue-700"
                >
                  ادامه خرید
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
