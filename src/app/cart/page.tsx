"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiShoppingCart, HiTrash, HiLogin, HiArrowRight } from "react-icons/hi";
import { cartAPI, checkoutAPI, authAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { useUserStatus } from "@/context/UserStatusContext";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface CartItem {
  id: number;
  title: string;
  slug: string;
  thumbnail: string | null;
  price: number;
  sale_price: number | null;
  current_price: number;
  stock: number;
  quantity: number;
  category: { name: string };
}

interface CartSummary {
  count: number;
  subtotal: number;
  discount: number;
  total: number;
}

const formatPrice = (price: number) => price.toLocaleString("fa-IR") + " تومان";

// ─────────────────────────────────────────────
// QuantityControl
// ─────────────────────────────────────────────
function QuantityControl({
  quantity,
  stock,
  loading,
  onIncrease,
  onDecrease,
}: {
  quantity: number;
  stock: number;
  loading: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden w-fit">
      <button
        onClick={onDecrease}
        disabled={loading || quantity <= 1}
        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition text-lg font-medium"
      >
        −
      </button>
      <span className="w-9 h-9 flex items-center justify-center font-medium text-gray-800 text-sm border-x border-gray-100">
        {loading ? (
          <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        ) : (
          quantity
        )}
      </span>
      <button
        onClick={onIncrease}
        disabled={loading || quantity >= stock}
        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition text-lg font-medium"
      >
        +
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function CartPage() {
  const router = useRouter();

  // ── Contexts ──
  // CartContext: مدیریت تعداد کل سبد توی navbar
  const { refreshCart, clearCart: clearCartContext } = useCart();

  // UserStatusContext: همگام‌سازی وضعیت محصولات (توی کارت/علاقه‌مندی/خریداری‌شده)
  const { removeFromCart: removeFromCartStatus, refresh: refreshStatus } =
    useUserStatus();

  // ── Local State ──
  const [items, setItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary>({
    count: 0,
    subtotal: 0,
    discount: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    checkAuthAndLoadCart();
  }, []);

  const checkAuthAndLoadCart = async () => {
    setLoading(true);
    try {
      await authAPI.me();
      setIsAuthenticated(true);
      await loadCart();
    } catch {
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const loadCart = async () => {
    try {
      const res = await cartAPI.get();
      setItems(res.data.data || []);
      setSummary(
        res.data.summary || { count: 0, subtotal: 0, discount: 0, total: 0 },
      );
      // همگام‌سازی تعداد navbar
      await refreshCart();
    } catch (error: any) {
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
      } else {
        toast.error("خطا در دریافت سبد خرید");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── محاسبه summary از items بدون fetch مجدد ──
  const recalcSummary = (updated: CartItem[]) => {
    const subtotal = updated.reduce((s, i) => s + i.price * i.quantity, 0);
    const discount = updated.reduce(
      (s, i) => (i.sale_price ? s + (i.price - i.sale_price) * i.quantity : s),
      0,
    );
    const total = updated.reduce((s, i) => s + i.current_price * i.quantity, 0);
    const count = updated.reduce((s, i) => s + i.quantity, 0);
    setSummary({ count, subtotal, discount, total });
  };

  // ── افزایش تعداد ──
  const handleIncrease = async (item: CartItem) => {
    if (item.quantity >= item.stock) return;
    setUpdatingIds((prev) => new Set(prev).add(item.id));
    try {
      await cartAPI.add(item.id, 1);
      const updated = items.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
      );
      setItems(updated);
      recalcSummary(updated);
      // آپدیت تعداد navbar
      await refreshCart();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا");
    } finally {
      setUpdatingIds((prev) => {
        const s = new Set(prev);
        s.delete(item.id);
        return s;
      });
    }
  };

  // ── کاهش تعداد ──
  const handleDecrease = async (item: CartItem) => {
    if (item.quantity <= 1) return;
    setUpdatingIds((prev) => new Set(prev).add(item.id));
    try {
      await cartAPI.update(item.id, item.quantity - 1);
      const updated = items.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i,
      );
      setItems(updated);
      recalcSummary(updated);
      await refreshCart();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا");
    } finally {
      setUpdatingIds((prev) => {
        const s = new Set(prev);
        s.delete(item.id);
        return s;
      });
    }
  };

  // ── حذف کامل آیتم ──
  const handleRemove = async (productId: number) => {
    try {
      await cartAPI.removeAll(productId);

      const updated = items.filter((i) => i.id !== productId);
      setItems(updated);
      recalcSummary(updated);

      // آپدیت CartContext (navbar)
      await refreshCart();

      // آپدیت UserStatusContext (وضعیت دکمه‌های محصولات)
      removeFromCartStatus(productId);

      toast.success("از سبد خرید حذف شد");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در حذف");
    }
  };

  // ── خالی کردن سبد ──
  const handleClear = async () => {
    if (!confirm("آیا از خالی کردن سبد خرید اطمینان دارید؟")) return;
    try {
      await cartAPI.clear();
      setItems([]);
      setSummary({ count: 0, subtotal: 0, discount: 0, total: 0 });

      // آپدیت CartContext
      clearCartContext();

      // آپدیت UserStatusContext — همه cartIds پاک میشه
      await refreshStatus();

      toast.success("سبد خرید خالی شد");
    } catch {
      toast.error("خطا در خالی کردن سبد");
    }
  };

  // ── پرداخت ──
  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const res = await checkoutAPI.checkout();
      if (res.data.success && res.data.payment_url) {
        toast.success("در حال انتقال به درگاه پرداخت...");
        window.location.href = res.data.payment_url;
        return;
      }
      toast.error(res.data.message || "امکان اتصال به درگاه وجود ندارد");
      router.replace("/profile/orders");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در پرداخت");
      router.replace("/profile/orders");
    } finally {
      setCheckingOut(false);
    }
  };

  // ─────────────────────────────────────────────
  // Loading
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Not authenticated
  // ─────────────────────────────────────────────
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiLogin className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              ورود به حساب کاربری
            </h1>
            <p className="text-gray-500 mb-6">
              برای مشاهده سبد خرید ابتدا وارد حساب کاربری خود شوید
            </p>
            <div className="space-y-3">
              <Link
                href="/login?redirect=/cart"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
              >
                <HiLogin className="w-5 h-5" />
                ورود به حساب
              </Link>
              <Link
                href="/register?redirect=/cart"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
              >
                ثبت‌نام
              </Link>
              <Link
                href="/products"
                className="block text-sm text-gray-500 hover:text-gray-700 mt-4"
              >
                مشاهده محصولات
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Cart
  // ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* هدر */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">سبد خرید</h1>
          {items.length > 0 && (
            <button
              onClick={handleClear}
              className="text-red-500 text-sm hover:text-red-600 transition"
            >
              خالی کردن سبد
            </button>
          )}
        </div>

        {/* خالی */}
        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <HiShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              سبد خرید خالی است
            </h3>
            <p className="text-gray-500 mb-6">
              محصولات مورد نظر خود را به سبد اضافه کنید
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── لیست آیتم‌ها ── */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => {
                const isUpdating = updatingIds.has(item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm p-4 flex gap-4"
                  >
                    {/* تصویر */}
                    <Link
                      href={`/products/${item.slug}`}
                      className="flex-shrink-0"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                        {item.thumbnail ? (
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <HiShoppingCart className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* اطلاعات */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition truncate">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 mb-2">
                        {item.category?.name}
                      </p>

                      {/* قیمت واحد */}
                      <div className="flex items-center gap-2 mb-3">
                        {item.sale_price && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(item.price)}
                          </span>
                        )}
                        <span className="text-sm font-bold text-gray-900">
                          {formatPrice(item.current_price)}
                        </span>
                      </div>

                      {/* کنترل تعداد + قیمت کل */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <QuantityControl
                          quantity={item.quantity}
                          stock={item.stock}
                          loading={isUpdating}
                          onIncrease={() => handleIncrease(item)}
                          onDecrease={() => handleDecrease(item)}
                        />
                        <span className="text-sm text-gray-500">
                          جمع:{" "}
                          <span className="font-medium text-gray-800">
                            {formatPrice(item.current_price * item.quantity)}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* دکمه حذف */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="self-start p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0 mt-1"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ── خلاصه سفارش ── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  خلاصه سفارش
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>جمع ({summary.count} عدد)</span>
                    <span>{formatPrice(summary.subtotal)}</span>
                  </div>
                  {summary.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>تخفیف</span>
                      <span>− {formatPrice(summary.discount)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
                    <span>قابل پرداخت</span>
                    <span>{formatPrice(summary.total)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkingOut || items.length === 0}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 transition"
                >
                  {checkingOut ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <HiArrowRight className="w-5 h-5" />
                  )}
                  {checkingOut ? "در حال پردازش..." : "پرداخت و تکمیل خرید"}
                </button>

                <Link
                  href="/products"
                  className="block text-center text-blue-600 text-sm mt-4 hover:text-blue-700 transition"
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
