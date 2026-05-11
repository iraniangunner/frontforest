"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

const formatPrice = (n: number) => Number(n).toLocaleString("fa-IR") + " تومان";

// ─────────────────────────────────────────────
// QuantityControl
// ─────────────────────────────────────────────
function QuantityControl({
  quantity,
  stock,
  disabled,
  onIncrease,
  onDecrease,
}: {
  quantity: number;
  stock: number;
  disabled: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden w-fit">
      <button
        onClick={onDecrease}
        disabled={disabled || quantity <= 1}
        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-lg font-medium"
      >
        −
      </button>
      <span className="w-10 h-9 flex items-center justify-center font-medium text-gray-800 text-sm border-x border-gray-100">
        {disabled ? (
          <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        ) : quantity}
      </span>
      <button
        onClick={onIncrease}
        disabled={disabled || quantity >= stock}
        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-lg font-medium"
      >
        +
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Normalize item — مطمئن میشیم همه عددها number هستن
// ─────────────────────────────────────────────
function normalizeItem(item: any): CartItem {
  return {
    ...item,
    quantity:      Number(item.quantity)      || 1,
    stock:         Number(item.stock)         || 0,
    price:         Number(item.price)         || 0,
    sale_price:    item.sale_price !== null ? Number(item.sale_price) : null,
    current_price: Number(item.current_price) || 0,
  };
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function CartPage() {
  const router = useRouter();
  const { refreshCart, clearCart: clearCartContext } = useCart();
  const { removeFromCart: removeFromCartStatus, refresh: refreshStatus } = useUserStatus();

  const [items, setItems]             = useState<CartItem[]>([]);
  const [summary, setSummary]         = useState<CartSummary>({ count: 0, subtotal: 0, discount: 0, total: 0 });
  const [loading, setLoading]         = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // آیتم‌هایی که در حال آپدیت هستن — با Set فقط یه آپدیت همزمان per item
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());

  // ← ref برای خواندن آخرین quantity بدون stale closure
  // کلید: productId، مقدار: quantity فعلی
  const quantityRef = useRef<Map<number, number>>(new Map());

  useEffect(() => { checkAuthAndLoadCart(); }, []);

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
      // ← normalize همه آیتم‌ها تا quantity حتماً number باشه
      const data: CartItem[] = (res.data.data || []).map(normalizeItem);
      setItems(data);
      // ← ref رو هم آپدیت کن
      quantityRef.current = new Map(data.map((i) => [i.id, i.quantity]));
      setSummary(res.data.summary || { count: 0, subtotal: 0, discount: 0, total: 0 });
      await refreshCart();
    } catch (error: any) {
      if (error.response?.status === 401) setIsAuthenticated(false);
      else toast.error("خطا در دریافت سبد خرید");
    } finally {
      setLoading(false);
    }
  };

  // ── محاسبه summary ──
  const recalcSummary = useCallback((list: CartItem[]) => {
    const subtotal = list.reduce((s, i) => s + i.price * i.quantity, 0);
    const discount = list.reduce((s, i) =>
      i.sale_price ? s + (i.price - i.sale_price) * i.quantity : s, 0);
    const total = list.reduce((s, i) => s + i.current_price * i.quantity, 0);
    const count = list.reduce((s, i) => s + i.quantity, 0);
    setSummary({ count, subtotal, discount, total });
  }, []);

  // ── آپدیت quantity یک آیتم (synchronous + ref update) ──
  const applyQty = useCallback((productId: number, newQty: number) => {
    // ← ref رو همزمان آپدیت کن تا کلیک بعدی مقدار درست بخونه
    quantityRef.current.set(productId, newQty);
    setItems((prev) => {
      const updated = prev.map((i) =>
        i.id === productId ? { ...i, quantity: newQty } : i
      );
      recalcSummary(updated);
      return updated;
    });
  }, [recalcSummary]);

  // ── افزایش تعداد ──
  const handleIncrease = useCallback(async (productId: number, stock: number) => {
    // جلوگیری از کلیک همزمان روی همون آیتم
    if (updatingIds.has(productId)) return;

    // ← خواندن از ref نه از state (همیشه مقدار آخر)
    const oldQty = quantityRef.current.get(productId) ?? 1;
    if (oldQty >= stock) return;

    const newQty = oldQty + 1;

    // ① optimistic
    applyQty(productId, newQty);
    setUpdatingIds((prev) => new Set(prev).add(productId));

    try {
      // ② API
      await cartAPI.add(productId, 1);
      await refreshCart();
    } catch (error: any) {
      // ③ revert
      applyQty(productId, oldQty);
      toast.error(error.response?.data?.message || "خطا در افزایش تعداد");
    } finally {
      setUpdatingIds((prev) => { const s = new Set(prev); s.delete(productId); return s; });
    }
  }, [updatingIds, applyQty, refreshCart]);

  // ── کاهش تعداد ──
  const handleDecrease = useCallback(async (productId: number) => {
    if (updatingIds.has(productId)) return;

    const oldQty = quantityRef.current.get(productId) ?? 1;
    if (oldQty <= 1) return;

    const newQty = oldQty - 1;

    // ① optimistic
    applyQty(productId, newQty);
    setUpdatingIds((prev) => new Set(prev).add(productId));

    try {
      // ② API
      await cartAPI.update(productId, newQty);
      await refreshCart();
    } catch (error: any) {
      // ③ revert
      applyQty(productId, oldQty);
      toast.error(error.response?.data?.message || "خطا در کاهش تعداد");
    } finally {
      setUpdatingIds((prev) => { const s = new Set(prev); s.delete(productId); return s; });
    }
  }, [updatingIds, applyQty, refreshCart]);

  // ── حذف کامل آیتم ──
  const handleRemove = async (productId: number) => {
    const snapshot = [...items];
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== productId);
      recalcSummary(updated);
      return updated;
    });
    quantityRef.current.delete(productId);

    try {
      await cartAPI.removeAll(productId);
      await refreshCart();
      removeFromCartStatus(productId);
      toast.success("از سبد خرید حذف شد");
    } catch (error: any) {
      setItems(snapshot);
      recalcSummary(snapshot);
      quantityRef.current.set(productId, snapshot.find(i => i.id === productId)?.quantity ?? 1);
      toast.error(error.response?.data?.message || "خطا در حذف");
    }
  };

  // ── خالی کردن سبد ──
  const handleClear = async () => {
    if (!confirm("آیا از خالی کردن سبد خرید اطمینان دارید؟")) return;
    const snapshot = [...items];
    setItems([]);
    setSummary({ count: 0, subtotal: 0, discount: 0, total: 0 });
    quantityRef.current.clear();

    try {
      await cartAPI.clear();
      clearCartContext();
      await refreshStatus();
      toast.success("سبد خرید خالی شد");
    } catch {
      setItems(snapshot);
      recalcSummary(snapshot);
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
  // Render
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiLogin className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">ورود به حساب کاربری</h1>
            <p className="text-gray-500 mb-6">برای مشاهده سبد خرید ابتدا وارد شوید</p>
            <div className="space-y-3">
              <Link href="/login?redirect=/cart"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition">
                <HiLogin className="w-5 h-5" /> ورود به حساب
              </Link>
              <Link href="/register?redirect=/cart"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition">
                ثبت‌نام
              </Link>
              <Link href="/products" className="block text-sm text-gray-500 hover:text-gray-700 mt-4">
                مشاهده محصولات
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">سبد خرید</h1>
          {items.length > 0 && (
            <button onClick={handleClear} className="text-red-500 text-sm hover:text-red-600 transition">
              خالی کردن سبد
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <HiShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">سبد خرید خالی است</h3>
            <p className="text-gray-500 mb-6">محصولات مورد نظر خود را به سبد اضافه کنید</p>
            <Link href="/products"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => {
                const isUpdating = updatingIds.has(item.id);
                return (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex gap-4">
                    <Link href={`/products/${item.slug}`} className="flex-shrink-0">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                        {item.thumbnail ? (
                          <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <HiShoppingCart className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition truncate">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 mb-2">{item.category?.name}</p>

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

                      <div className="flex items-center gap-3 flex-wrap">
                        <QuantityControl
                          quantity={item.quantity}
                          stock={item.stock}
                          disabled={isUpdating}
                          onIncrease={() => handleIncrease(item.id, item.stock)}
                          onDecrease={() => handleDecrease(item.id)}
                        />
                        <span className="text-sm text-gray-500">
                          جمع:{" "}
                          <span className="font-medium text-gray-800">
                            {formatPrice(item.current_price * item.quantity)}
                          </span>
                        </span>
                      </div>
                    </div>

                    <button onClick={() => handleRemove(item.id)}
                      className="self-start p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0 mt-1">
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* خلاصه سفارش */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                <h3 className="font-semibold text-gray-900 mb-4">خلاصه سفارش</h3>
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

                <button onClick={handleCheckout} disabled={checkingOut || items.length === 0}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 transition">
                  {checkingOut ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : <HiArrowRight className="w-5 h-5" />}
                  {checkingOut ? "در حال پردازش..." : "پرداخت و تکمیل خرید"}
                </button>

                <Link href="/products"
                  className="block text-center text-blue-600 text-sm mt-4 hover:text-blue-700 transition">
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