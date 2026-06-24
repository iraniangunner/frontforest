"use client";

// app/(public)/cart/page.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiShoppingCart, HiX, HiArrowLeft, HiReceiptTax } from "react-icons/hi";
import { cartAPI, authAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { useUserStatus } from "@/context/UserStatusContext";
import { guestCart, GuestCartItem } from "@/lib/guestCart";

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

// ── نوار مراحل ──
function Stepper() {
  const steps = [
    { label: "سبد خرید", active: true },
    { label: "اطلاعات آدرس", done: false },
    { label: "پرداخت", done: false },
  ];
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                s.active
                  ? "bg-[#A72F3B] text-white"
                  : "bg-[#F0F0F0] text-[#AFAFAF]"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-xs ${
                s.active ? "text-[#A72F3B] font-medium" : "text-[#898989]"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="w-16 sm:w-24 mb-5 border-t border-dashed border-[#DCACB1]" />
          )}
        </div>
      ))}
    </div>
  );
}

// ── کنترل تعداد ──
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
    <div className="flex items-center border border-[#EDEDED] rounded-xl overflow-hidden w-fit">
      <button
        onClick={onIncrease}
        disabled={disabled || quantity >= stock}
        className="w-9 h-9 flex items-center justify-center text-[#656565] hover:bg-[#F8F8F8] disabled:opacity-40 disabled:cursor-not-allowed transition text-lg font-medium"
      >
        +
      </button>
      <span className="w-10 h-9 flex items-center justify-center font-medium text-[#242424] text-sm border-x border-[#F0F0F0]">
        {disabled ? (
          <div className="w-3 h-3 border-2 border-[#EDEDED] border-t-[#A72F3B] rounded-full animate-spin" />
        ) : (
          quantity.toLocaleString("fa-IR")
        )}
      </span>
      <button
        onClick={onDecrease}
        disabled={disabled || quantity <= 1}
        className="w-9 h-9 flex items-center justify-center text-[#656565] hover:bg-[#F8F8F8] disabled:opacity-40 disabled:cursor-not-allowed transition text-lg font-medium"
      >
        −
      </button>
    </div>
  );
}

function normalizeItem(item: any): CartItem {
  return {
    ...item,
    quantity: Number(item.quantity) || 1,
    stock: Number(item.stock) || 0,
    price: Number(item.price) || 0,
    sale_price: item.sale_price !== null ? Number(item.sale_price) : null,
    current_price: Number(item.current_price) || 0,
  };
}

// ── کارت آیتم (مشترک) ──
function CartItemRow({
  item,
  disabled,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  item: CartItem | GuestCartItem;
  disabled: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] p-4">
      <div className="flex gap-4">
        <Link href={`/products/${item.slug}`} className="flex-shrink-0">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#F8F8F8] border border-[#F0F0F0]">
            {item.thumbnail ? (
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <HiShoppingCart className="w-8 h-8 text-[#CBCBCB]" />
              </div>
            )}
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/products/${item.slug}`}>
              <h3 className="font-semibold text-[#242424] hover:text-[#A72F3B] transition truncate">
                {item.title}
              </h3>
            </Link>
            <button
              onClick={onRemove}
              className="p-1.5 text-[#AFAFAF] hover:text-[#C30000] hover:bg-[#FBEAEA] rounded-lg transition flex-shrink-0"
            >
              <HiX className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-1 mb-3">
            {item.sale_price && (
              <span className="text-xs text-[#AFAFAF] line-through">
                {formatPrice(item.price)}
              </span>
            )}
            <span className="text-sm font-bold text-[#A72F3B]">
              {formatPrice(item.current_price)}
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <QuantityControl
              quantity={item.quantity}
              stock={item.stock}
              disabled={disabled}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
            />
            <span className="text-sm text-[#898989]">
              جمع:{" "}
              <span className="font-medium text-[#242424]">
                {formatPrice(item.current_price * item.quantity)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── خلاصه‌ی سفارش (بدون هزینه ارسال) ──
function SummaryCard({
  summary,
  onContinue,
  disabled,
}: {
  summary: CartSummary;
  onContinue: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] p-5 sticky top-6">
      <h3 className="font-bold text-[#242424] mb-4">خلاصه سفارش</h3>
      <div className="space-y-3 text-sm mb-5">
        <div className="flex justify-between">
          <span className="text-[#656565]">
            قیمت کالاها ({summary.count.toLocaleString("fa-IR")})
          </span>
          <span className="text-[#242424]">
            {formatPrice(summary.subtotal)}
          </span>
        </div>
        {summary.discount > 0 && (
          <div className="flex justify-between text-[#00966D]">
            <span className="inline-flex items-center gap-1.5">
              <HiReceiptTax className="w-4 h-4" /> مجموع تخفیف روی کالاها
            </span>
            <span>− {formatPrice(summary.discount)}</span>
          </div>
        )}
        <div className="border-t border-[#F0F0F0] pt-3 flex justify-between font-bold">
          <span className="text-[#242424]">جمع مبلغ قابل پرداخت</span>
          <span className="text-[#A72F3B]">{formatPrice(summary.total)}</span>
        </div>
      </div>

      <button
        onClick={onContinue}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-2 py-3 bg-[#A72F3B] text-white rounded-xl font-semibold hover:bg-[#86262F] disabled:bg-[#D6D6D6] disabled:cursor-not-allowed transition"
      >
        ثبت سفارش
        <HiArrowLeft className="w-5 h-5" />
      </button>
    </div>
  );
}

// ── سبد مهمان ──
function GuestCartView() {
  const router = useRouter();
  const [items, setItems] = useState<GuestCartItem[]>(() => guestCart.get());
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const recalcSummary = (list: GuestCartItem[]): CartSummary => ({
    count: list.reduce((s, i) => s + i.quantity, 0),
    subtotal: list.reduce((s, i) => s + i.price * i.quantity, 0),
    discount: list.reduce(
      (s, i) => (i.sale_price ? s + (i.price - i.sale_price) * i.quantity : s),
      0,
    ),
    total: list.reduce((s, i) => s + i.current_price * i.quantity, 0),
  });

  const [summary, setSummary] = useState(() => recalcSummary(guestCart.get()));

  const applyItems = (updated: GuestCartItem[]) => {
    localStorage.setItem("guest_cart", JSON.stringify(updated));
    setItems(updated);
    setSummary(recalcSummary(updated));
    window.dispatchEvent(new Event("guestCartUpdated"));
  };

  const handleIncrease = (id: number) => {
    const current = guestCart.get();
    const item = current.find((i) => i.id === id);
    if (!item || item.quantity >= item.stock) return;
    setUpdatingId(id);
    setTimeout(() => {
      applyItems(
        current.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      );
      setUpdatingId(null);
    }, 150);
  };

  const handleDecrease = (id: number) => {
    const current = guestCart.get();
    const item = current.find((i) => i.id === id);
    if (!item || item.quantity <= 1) return;
    setUpdatingId(id);
    setTimeout(() => {
      applyItems(
        current.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i,
        ),
      );
      setUpdatingId(null);
    }, 150);
  };

  const handleRemove = (id: number) => {
    applyItems(guestCart.get().filter((i) => i.id !== id));
  };

  const handleClear = () => {
    if (!confirm("آیا از خالی کردن سبد خرید اطمینان دارید؟")) return;
    guestCart.clear();
    setItems([]);
    setSummary({ count: 0, subtotal: 0, discount: 0, total: 0 });
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#F0F0F0] p-12 text-center">
        <HiShoppingCart className="w-16 h-16 text-[#EDD5D8] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#242424] mb-2">
          سبد خرید خالی است
        </h3>
        <p className="text-[#898989]">
          محصولات مورد نظر خود را به سبد اضافه کنید
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold text-[#242424]">سبد خرید</h1>
        <button
          onClick={handleClear}
          className="text-[#C30000] text-sm hover:text-[#A30000] transition"
        >
          خالی کردن سبد
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              disabled={updatingId === item.id}
              onIncrease={() => handleIncrease(item.id)}
              onDecrease={() => handleDecrease(item.id)}
              onRemove={() => handleRemove(item.id)}
            />
          ))}
        </div>
        <div className="lg:col-span-1">
          <SummaryCard
            summary={summary}
            onContinue={() => router.push("/checkout/address")}
          />
        </div>
      </div>
    </>
  );
}

// ── Page ──
export default function CartPage() {
  const router = useRouter();
  const { refreshCart, clearCart: clearCartContext } = useCart();
  const { removeFromCart: removeFromCartStatus, refresh: refreshStatus } =
    useUserStatus();

  const [items, setItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary>({
    count: 0,
    subtotal: 0,
    discount: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());
  const quantityRef = useRef<Map<number, number>>(new Map());

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
      const data: CartItem[] = (res.data.data || []).map(normalizeItem);
      setItems(data);
      quantityRef.current = new Map(data.map((i) => [i.id, i.quantity]));
      setSummary(
        res.data.summary || { count: 0, subtotal: 0, discount: 0, total: 0 },
      );
      await refreshCart();
    } catch (error: any) {
      if (error.response?.status === 401) setIsAuthenticated(false);
      else toast.error("خطا در دریافت سبد خرید");
    } finally {
      setLoading(false);
    }
  };

  const recalcSummary = useCallback((list: CartItem[]) => {
    const subtotal = list.reduce((s, i) => s + i.price * i.quantity, 0);
    const discount = list.reduce(
      (s, i) => (i.sale_price ? s + (i.price - i.sale_price) * i.quantity : s),
      0,
    );
    const total = list.reduce((s, i) => s + i.current_price * i.quantity, 0);
    const count = list.reduce((s, i) => s + i.quantity, 0);
    setSummary({ count, subtotal, discount, total });
  }, []);

  const applyQty = useCallback(
    (productId: number, newQty: number) => {
      quantityRef.current.set(productId, newQty);
      setItems((prev) => {
        const updated = prev.map((i) =>
          i.id === productId ? { ...i, quantity: newQty } : i,
        );
        recalcSummary(updated);
        return updated;
      });
    },
    [recalcSummary],
  );

  const handleIncrease = useCallback(
    async (productId: number, stock: number) => {
      if (updatingIds.has(productId)) return;
      const oldQty = quantityRef.current.get(productId) ?? 1;
      if (oldQty >= stock) return;
      const newQty = oldQty + 1;
      applyQty(productId, newQty);
      setUpdatingIds((prev) => new Set(prev).add(productId));
      try {
        await cartAPI.add(productId, 1);
        await refreshCart();
      } catch (error: any) {
        applyQty(productId, oldQty);
        toast.error(error.response?.data?.message || "خطا در افزایش تعداد");
      } finally {
        setUpdatingIds((prev) => {
          const s = new Set(prev);
          s.delete(productId);
          return s;
        });
      }
    },
    [updatingIds, applyQty, refreshCart],
  );

  const handleDecrease = useCallback(
    async (productId: number) => {
      if (updatingIds.has(productId)) return;
      const oldQty = quantityRef.current.get(productId) ?? 1;
      if (oldQty <= 1) return;
      const newQty = oldQty - 1;
      applyQty(productId, newQty);
      setUpdatingIds((prev) => new Set(prev).add(productId));
      try {
        await cartAPI.update(productId, newQty);
        await refreshCart();
      } catch (error: any) {
        applyQty(productId, oldQty);
        toast.error(error.response?.data?.message || "خطا در کاهش تعداد");
      } finally {
        setUpdatingIds((prev) => {
          const s = new Set(prev);
          s.delete(productId);
          return s;
        });
      }
    },
    [updatingIds, applyQty, refreshCart],
  );

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
      quantityRef.current.set(
        productId,
        snapshot.find((i) => i.id === productId)?.quantity ?? 1,
      );
      toast.error(error.response?.data?.message || "خطا در حذف");
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#EDEDED] border-t-[#A72F3B] rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Stepper />
          <GuestCartView />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Stepper />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-bold text-[#242424]">سبد خرید</h1>
          {items.length > 0 && (
            <button
              onClick={handleClear}
              className="text-[#C30000] text-sm hover:text-[#A30000] transition"
            >
              خالی کردن سبد
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#F0F0F0] p-12 text-center">
            <HiShoppingCart className="w-16 h-16 text-[#EDD5D8] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#242424] mb-2">
              سبد خرید خالی است
            </h3>
            <p className="text-[#898989]">
              محصولات مورد نظر خود را به سبد اضافه کنید
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  disabled={updatingIds.has(item.id)}
                  onIncrease={() => handleIncrease(item.id, item.stock)}
                  onDecrease={() => handleDecrease(item.id)}
                  onRemove={() => handleRemove(item.id)}
                />
              ))}
            </div>
            <div className="lg:col-span-1">
              <SummaryCard
                summary={summary}
                disabled={items.length === 0}
                onContinue={() => router.push("/checkout/address")}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
